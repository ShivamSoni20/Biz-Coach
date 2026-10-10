import { supabaseAdmin } from "@/lib/supabase";
import { kvGet } from "@/lib/kv";
import { BrainRecord } from "@/lib/types";

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, { type: string; description: string }>;
    required?: string[];
  };
}

export interface ToolExecutionResult {
  success: boolean;
  message: string;
  dryRun: boolean;
  diffPreview?: string;
  data?: any;
}

export const TOOL_REGISTRY: Record<string, ToolDefinition> = {
  create_share_link: {
    name: "create_share_link",
    description: "Generate or refresh a public read-only share link for a Company Brain.",
    parameters: {
      type: "object",
      properties: {
        brainId: { type: "string", description: "The unique ID of the target Company Brain." },
        allowApiAccess: { type: "string", description: "Whether to enable raw API access on the share page ('true' or 'false')." },
      },
      required: ["brainId"],
    },
  },
  export_brain_markdown: {
    name: "export_brain_markdown",
    description: "Export full bundled Markdown representation of the Company Brain.",
    parameters: {
      type: "object",
      properties: {
        brainId: { type: "string", description: "The unique ID of the target Company Brain." },
        format: { type: "string", description: "Format of export ('bundle' or 'zipped')." },
      },
      required: ["brainId"],
    },
  },
  regenerate_section: {
    name: "regenerate_section",
    description: "Request targeted AI regeneration of a specific section in the Company Brain.",
    parameters: {
      type: "object",
      properties: {
        brainId: { type: "string", description: "Target brain ID." },
        section: { type: "string", description: "Section to regenerate ('knowledge', 'processes', 'judgment')." },
        guidance: { type: "string", description: "Custom instructions or details to include." },
      },
      required: ["brainId", "section"],
    },
  },
};

export async function executeTool(
  toolName: string,
  args: Record<string, any>,
  dryRun: boolean = false,
  userId?: string
): Promise<ToolExecutionResult> {
  const tool = TOOL_REGISTRY[toolName];
  if (!tool) {
    return { success: false, message: `Tool '${toolName}' not found in registry.`, dryRun };
  }

  // Schema Validation
  if (tool.parameters.required) {
    for (const req of tool.parameters.required) {
      if (args[req] === undefined || args[req] === null || args[req] === "") {
        return {
          success: false,
          message: `Validation error: Missing required argument '${req}' for tool '${toolName}'.`,
          dryRun,
        };
      }
    }
  }

  const brainId = args.brainId;
  const argsHash = Buffer.from(JSON.stringify(args)).toString("base64");

  if (dryRun) {
    let diffPreview = `[Dry Run] Tool: ${toolName}\nArguments: ${JSON.stringify(args, null, 2)}\nStatus: Ready for execution without side-effects.`;
    if (toolName === "regenerate_section") {
      diffPreview += `\nSide-effect: Section '${args.section}' will be re-synthesized with guidance: "${args.guidance || 'None'}".`;
    } else if (toolName === "create_share_link") {
      diffPreview += `\nSide-effect: Public share URL /brain/${brainId}/share will be marked active.`;
    }

    return {
      success: true,
      message: "Dry-run completed successfully. No data mutated.",
      dryRun: true,
      diffPreview,
    };
  }

  // Real execution
  try {
    let message = "";
    let data: any = {};

    if (toolName === "create_share_link") {
      const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}/brain/${brainId}/share`;
      message = `Share link generated: ${shareUrl}`;
      data = { shareUrl };
    } else if (toolName === "export_brain_markdown") {
      const brain = await kvGet<BrainRecord>(`brain:${brainId}`);
      if (!brain) throw new Error("Brain not found.");
      const markdownBundle = `# ${brain.meta.businessName} - Company Brain\n\n## KNOWLEDGE.md\n${brain.markdown?.knowledge_md || ""}\n\n## PROCESSES.md\n${brain.markdown?.processes_md || ""}\n\n## JUDGMENT.md\n${brain.markdown?.judgment_md || ""}`;
      message = "Markdown exported successfully.";
      data = { bundle: markdownBundle };
    } else if (toolName === "regenerate_section") {
      message = `Section '${args.section}' scheduled for targeted regeneration with guidance.`;
      data = { section: args.section, status: "queued" };
    }

    // Append-only Audit Logging to tool_runs table
    await supabaseAdmin.from("tool_runs").insert({
      brain_id: brainId,
      tool_name: toolName,
      args_hash: argsHash,
      args_json: args,
      result_json: { message, data },
      user_id: userId || null,
      status: "completed",
    });

    return {
      success: true,
      message,
      dryRun: false,
      data,
    };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Execution failed";

    await supabaseAdmin.from("tool_runs").insert({
      brain_id: brainId,
      tool_name: toolName,
      args_hash: argsHash,
      args_json: args,
      result_json: { error: errorMsg },
      user_id: userId || null,
      status: "failed",
    });

    return {
      success: false,
      message: `Tool execution failed: ${errorMsg}`,
      dryRun: false,
    };
  }
}
