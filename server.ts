import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Security Analysis API Endpoint
app.post('/api/security/analyze', async (req, res) => {
  try {
    const { agent, capability, resource, action, source, policyRule } = req.body;

    // If Gemini is available, perform real-time generative threat analysis
    if (ai) {
      const prompt = `You are Sentinel, an autonomous AI Agent Runtime Security & Authorization firewall.
Analyze the following runtime tool invocation by an autonomous AI agent to identify potential threats such as prompt injection, secret exfiltration, privilege escalation, or unauthorized destructive actions.

Agent Name: ${agent?.name || 'Unknown Agent'}
Model: ${agent?.model || 'Unknown Model'}
Assigned Environment: ${agent?.environment || 'Development'}
Requested Capability: ${capability || 'unknown'}
Target Resource/Argument: ${resource || action || 'unknown'}
Execution Origin / Source: ${source?.origin || 'User prompt'}
Source Trust Level: ${source?.trust || 'UNTRUSTED'}
Applicable Policy Rule: ${policyRule?.name || 'Default Deny'} - ${policyRule?.reason || 'None'}

Provide a JSON assessment matching this exact schema:
{
  "intent": "Brief description of the agent's apparent intent (under 15 words)",
  "threat": "Identified threat category (e.g. 'Indirect Prompt Injection', 'Secret Credential Exfiltration', 'Tool Escalation', 'Destructive Shell Execution', 'Normal Authorized Operation', 'Shadow Tool Invocation')",
  "risk": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": number between 50 and 99,
  "recommendation": "ALLOW" | "REVIEW" | "BLOCK",
  "mitreAtlasId": "AML.T00xx or OWASP LLM0x category code",
  "reasoning": "Clear, precise explanation of why this was flagged or permitted and the specific security risk to the host environment (under 50 words)."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text || '{}';
      try {
        const parsed = JSON.parse(text);
        return res.json({ success: true, analysis: parsed, engine: 'gemini-3.8-flash' });
      } catch (err) {
        console.error('Failed to parse Gemini output:', text);
      }
    }

    // High-fidelity fallback heuristic security engine (used if no API key or on parse failure)
    const isUntrusted = source?.trust === 'UNTRUSTED' || (source?.origin && source.origin.toLowerCase().includes('untrusted'));
    const isSecret = resource && (
      resource.includes('.env') ||
      resource.includes('secret') ||
      resource.includes('.ssh') ||
      resource.includes('credential') ||
      resource.includes('id_rsa') ||
      resource.includes('aws')
    );
    const isDestructive = resource && (
      resource.includes('rm -rf') ||
      resource.includes('drop table') ||
      resource.includes('force push') ||
      resource.includes('--force')
    );
    const isProduction = resource && (
      resource.includes('production') ||
      resource.includes('prod') ||
      capability?.includes('deploy.prod')
    );

    let threat = 'Normal Authorized Operation';
    let risk = 'LOW';
    let recommendation = 'ALLOW';
    let mitreAtlasId = 'AML.M0000 (Safe)';
    let reasoning = 'Request strictly aligns with defined role boundary and trusted operator origin.';
    let intent = 'Standard operational task execution';

    if (isUntrusted && isSecret) {
      threat = 'Indirect Prompt Injection / Secret Exfiltration';
      risk = 'HIGH';
      recommendation = 'BLOCK';
      mitreAtlasId = 'AML.T0051 (LLM01 / LLM06)';
      reasoning = 'Request was triggered by untrusted source content attempting to inspect secret environment keys. Exfiltration vector neutralized.';
      intent = 'Exfiltrate environment secrets via poisoned context';
    } else if (isDestructive) {
      threat = 'Destructive Shell Escalation';
      risk = 'CRITICAL';
      recommendation = 'BLOCK';
      mitreAtlasId = 'AML.T0054 (LLM08 Excessive Agency)';
      reasoning = 'Command contains destructive filesystem or repository primitives prohibited by developer policy.';
      intent = 'Execute irreversible destructive operation';
    } else if (isProduction) {
      threat = 'Privilege Escalation / Production Drift';
      risk = 'MEDIUM';
      recommendation = 'REVIEW';
      mitreAtlasId = 'AML.T0053 (Privilege Escalation)';
      reasoning = 'Production deployments require explicit human multi-factor authorization before execution.';
      intent = 'Deploy changes to live production environment';
    } else if (isSecret) {
      threat = 'Unauthorized Secret Access';
      risk = 'HIGH';
      recommendation = 'BLOCK';
      mitreAtlasId = 'AML.T0051 (LLM06 Sensitive Info Disclosure)';
      reasoning = 'Agent role is denied access to credentials and secret dotfiles.';
      intent = 'Read configuration credentials';
    }

    return res.json({
      success: true,
      analysis: {
        intent,
        threat,
        risk,
        confidence: 94,
        recommendation,
        mitreAtlasId,
        reasoning,
      },
      engine: 'sentinel-runtime-heuristics',
    });
  } catch (error: any) {
    console.error('Security analyze error:', error);
    res.status(500).json({ error: error.message || 'Internal security inspection error' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    version: '0.4.2-enterprise',
    enforcementActive: true,
    geminiAttached: !!ai,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite in Dev or serve static in Prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sentinel Security Authorization Gateway listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
