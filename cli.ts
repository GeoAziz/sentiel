import { runMockCliAction } from "./src/runtime/cliRunner";

const apiBaseUrl = (process.env.SENTINEL_API_URL || "http://localhost:3000").replace(/\/$/, "");

const demoActions = [
	{
		label: "Read allowed source file",
		request: {
			agent_id: "agent_coding_01",
			capability: "filesystem.read",
			resource: "tests/auth.test.ts",
			action: "read tests/auth.test.ts",
			context: { source: "operator task", trust: "TRUSTED" as const },
		},
	},
	{
		label: "Attempt protected secret read",
		request: {
			agent_id: "agent_coding_01",
			capability: "filesystem.read",
			resource: ".env",
			action: "read .env",
			context: { source: "untrusted repository content", trust: "UNTRUSTED" as const },
		},
	},
	{
		label: "Request gated production deployment",
		request: {
			agent_id: "agent_release_01",
			capability: "deploy.production",
			resource: "production",
			action: "deploy production --tag=mock-v1",
			context: { source: "mock release pipeline", trust: "TRUSTED" as const },
		},
	},
];

async function main() {
	const [command, target] = process.argv.slice(2);
	if (command !== "run" || target !== "demo") {
		console.log("Usage: sentinel run demo");
		process.exitCode = 2;
		return;
	}

	console.log("Sentinel mock CLI: requests are authorized by the local mock API.");
	console.log(`API: ${apiBaseUrl}`);
	console.log("No real agent, filesystem, shell, or deployment tools are invoked.\n");

	for (const action of demoActions) {
		console.log(`\n${action.label}`);
		const event = await runMockCliAction({
			apiBaseUrl,
			request: action.request,
			onDecision: (decision) => {
				console.log(`[${decision.decision}] ${decision.capability}(\"${decision.resource}\")`);
				console.log(`Policy: ${decision.policy.name} · ${decision.policy.reason}`);
				console.log(`Event: ${decision.id}`);
			},
			onReview: (decision) => {
				console.log(`Waiting for operator approval in Sentinel (event ${decision.id})...`);
				console.log("Open the web console's Pending Approvals view to resolve it.");
			},
			mockToolAdapter: async (decision) => {
				console.log(`MOCK TOOL ADAPTER: simulated result for ${decision.action}`);
				console.log("No host tool was called.");
			},
		});

		if (event.decision === "BLOCK") {
			console.log("MOCK TOOL ADAPTER NOT INVOKED.");
		}
		if (event.approval?.outcome === "DENIED") {
			console.log("Operator denied the request; mock tool adapter not invoked.");
		}
	}
}

main().catch((error: unknown) => {
	console.error(error instanceof Error ? error.message : error);
	process.exitCode = 1;
});
