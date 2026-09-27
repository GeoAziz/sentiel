import { GoogleGenerativeAI } from "@google/generative-ai";
import type {
  AISecurityAnalysis,
  AuthorizationRequest,
  Decision,
  EvaluationResultLike,
} from "../types/sentinel";

let client: GoogleGenerativeAI | null | undefined;

function getClient(): GoogleGenerativeAI | null {
  if (client !== undefined) return client;
  const apiKey = process.env.GEMINI_API_KEY;
  client =
    apiKey && apiKey !== "MY_GEMINI_API_KEY" ? new GoogleGenerativeAI(apiKey) : null;
  return client;
}

export function isGeminiConfigured(): boolean {
  return getClient() !== null;
}

/**
 * Only called for requests the deterministic policy engine could not confidently
 * classify (no matching rule -> default-deny, or a REVIEW hold). Gemini returns
 * contextual analysis to help a human reviewer; it never sets the decision itself
 * -- evaluateRequest()'s output always remains authoritative.
 */
export async function analyzeWithGemini(
  request: AuthorizationRequest,
  result: EvaluationResultLike,
): Promise<AISecurityAnalysis | null> {
  const genAI = getClient();
  if (!genAI) return null;

  const prompt = `You are a security analyst assisting a deterministic AI-agent authorization firewall named Sentinel.
Sentinel's policy engine has already made the binding decision below; you are NOT authorizing or blocking anything.
Your only job is to produce a short structured risk analysis for a human reviewer.

Request:
- capability: ${request.capability}
- resource: ${request.resource}
- action: ${request.action ?? "(unspecified)"}
- source origin: ${request.context?.source ?? "unspecified"}
- source trust: ${request.context?.trust ?? "UNTRUSTED"}
- prompt snippet from agent context: ${request.context?.promptSnippet ?? "(none)"}

Deterministic policy engine decision (already final): ${result.decision}
Reason given by the policy engine: ${result.reason}

Reply with ONLY a compact JSON object, no markdown fences, matching exactly:
{"intent": string, "threat": string, "risk": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "confidence": number (0-100), "reasoning": string, "mitreAtlasId": string|null}`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const response = await model.generateContent(prompt);
    const text = response.response.text().trim();
    const jsonText = text.replace(/^```json\s*|```$/g, "").trim();
    const parsed = JSON.parse(jsonText) as {
      intent: string;
      threat: string;
      risk: AISecurityAnalysis["risk"];
      confidence: number;
      reasoning: string;
      mitreAtlasId?: string | null;
    };

    return {
      intent: parsed.intent,
      threat: parsed.threat,
      risk: parsed.risk,
      confidence: Math.max(0, Math.min(100, Math.round(parsed.confidence))),
      recommendation: result.decision as Decision,
      reasoning: parsed.reasoning,
      mitreAtlasId: parsed.mitreAtlasId ?? undefined,
      engine: "gemini-2.0-flash",
    };
  } catch (error) {
    console.warn(
      "Gemini advisory call failed; falling back to deterministic mock advisory.",
      error,
    );
    return null;
  }
}
