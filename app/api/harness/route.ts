import { executeTool, TOOL_REGISTRY } from "@/lib/harness/tools";
import { getAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  return Response.json({ tools: Object.values(TOOL_REGISTRY) });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    const { toolName, args, dryRun } = (await request.json()) as {
      toolName?: string;
      args?: Record<string, any>;
      dryRun?: boolean;
    };

    if (!toolName || !args) {
      return Response.json({ error: "toolName and args are required." }, { status: 400 });
    }

    const result = await executeTool(toolName, args, !!dryRun, user?.id);

    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Tool harness invocation failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
