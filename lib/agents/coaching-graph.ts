import { StateGraph, END, START } from "@langchain/langgraph";
import { AIML_MODEL, getAiClient } from "@/lib/ai";
import { BIZ_COACH_SYSTEM } from "@/lib/prompts";
import { generateBrainFromSession } from "@/lib/brain-generator";
import { getNextQuestionCount, parseBrainReady } from "@/lib/utils";
import { supabaseCheckpointer } from "@/lib/agents/supabase-checkpointer";
import type { BusinessType, ChatMessage, SessionState } from "@/lib/types";

export interface CoachingState {
  messages: ChatMessage[];
  businessType: BusinessType;
  businessName?: string;
  questionsAnswered: number;
  coverage: { knowledge: number; processes: number; judgment: number };
  probeInstruction?: string;
  brainId?: string;
  done: boolean;
}

const stateChannels = {
  messages: {
    value: (x: ChatMessage[], y: ChatMessage[]) => (y !== undefined ? y : x),
    default: () => [] as ChatMessage[],
  },
  businessType: {
    value: (_x: BusinessType, y: BusinessType) => y,
    default: () => "agency" as BusinessType,
  },
  businessName: {
    value: (_x: string | undefined, y: string | undefined) => y,
    default: () => undefined as string | undefined,
  },
  questionsAnswered: {
    value: (_x: number, y: number) => y,
    default: () => 0,
  },
  coverage: {
    value: (
      _x: { knowledge: number; processes: number; judgment: number },
      y: { knowledge: number; processes: number; judgment: number }
    ) => y,
    default: () => ({ knowledge: 0, processes: 0, judgment: 0 }),
  },
  probeInstruction: {
    value: (_x: string | undefined, y: string | undefined) => y,
    default: () => undefined as string | undefined,
  },
  brainId: {
    value: (_x: string | undefined, y: string | undefined) => y,
    default: () => undefined as string | undefined,
  },
  done: {
    value: (_x: boolean, y: boolean) => y,
    default: () => false,
  },
};

export async function interviewerNode(
  state: CoachingState,
  options?: { onToken?: (token: string) => void }
): Promise<Partial<CoachingState>> {
  const aiClient = getAiClient();
  let systemPrompt = BIZ_COACH_SYSTEM(state.businessType);

  if (state.probeInstruction) {
    systemPrompt += `\n\nTARGETED FOLLOW-UP REQUIRED:\n${state.probeInstruction}\nProbe the user gently before moving on to the next main question.`;
  }

  const promptMessages = [
    { role: "system" as const, content: systemPrompt },
    ...state.messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  ];

  let assistantContent = "";

  if (options?.onToken) {
    const stream = await aiClient.chat.completions.create({
      model: AIML_MODEL,
      stream: true,
      temperature: 0.7,
      max_tokens: 900,
      messages: promptMessages,
    });

    for await (const chunk of stream) {
      const token = chunk.choices[0]?.delta?.content ?? "";
      if (token) {
        assistantContent += token;
        options.onToken(token);
      }
    }
  } else {
    const completion = await aiClient.chat.completions.create({
      model: AIML_MODEL,
      stream: false,
      temperature: 0.7,
      max_tokens: 900,
      messages: promptMessages,
    });
    assistantContent = completion.choices[0]?.message?.content ?? "";
  }

  const updatedMessages = [
    ...state.messages,
    {
      role: "assistant" as const,
      content: assistantContent,
      timestamp: new Date().toISOString(),
    },
  ];

  const updatedQuestions = getNextQuestionCount(assistantContent, state.questionsAnswered);
  const isReady = parseBrainReady(assistantContent);

  return {
    messages: updatedMessages,
    questionsAnswered: updatedQuestions,
    probeInstruction: undefined,
    done: isReady,
  };
}

export async function completenessCheckerNode(
  state: CoachingState
): Promise<Partial<CoachingState>> {
  if (state.questionsAnswered >= 5 || state.done) {
    return {
      coverage: { knowledge: 1.0, processes: 1.0, judgment: 1.0 },
      probeInstruction: undefined,
    };
  }

  const lastUserMessage = [...state.messages]
    .reverse()
    .find((m) => m.role === "user")?.content ?? "";

  // If answer is short or thin, request a targeted follow-up
  const isThinAnswer =
    lastUserMessage.trim().length > 0 &&
    (lastUserMessage.trim().split(/\s+/).length < 5 ||
      lastUserMessage.toLowerCase().includes("idk") ||
      lastUserMessage.toLowerCase().includes("not sure"));

  try {
    const aiClient = getAiClient();
    const checkerPrompt = `You are the Biz Coach Quality Evaluator. Score the user's coverage (0.0 to 1.0) of Knowledge, Processes, and Judgment from the conversation so far.
Return ONLY valid JSON with keys:
{
  "knowledge": number,
  "processes": number,
  "judgment": number,
  "needs_probe": boolean,
  "probe_instruction": string
}

CONVERSATION:
${state.messages.map((m) => `${m.role.toUpperCase()}: ${m.content}`).join("\n\n")}`;

    const completion = await aiClient.chat.completions.create({
      model: AIML_MODEL,
      messages: [{ role: "user", content: checkerPrompt }],
      temperature: 0.1,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const result = JSON.parse(cleaned);

    const needsProbe = isThinAnswer || Boolean(result.needs_probe);
    const probeInstruction = needsProbe
      ? result.probe_instruction || "The previous answer was very brief. Ask for a specific real-world example."
      : undefined;

    return {
      coverage: {
        knowledge: typeof result.knowledge === "number" ? result.knowledge : 0.5,
        processes: typeof result.processes === "number" ? result.processes : 0.5,
        judgment: typeof result.judgment === "number" ? result.judgment : 0.5,
      },
      probeInstruction,
    };
  } catch {
    return {
      coverage: {
        knowledge: Math.min(1.0, state.questionsAnswered * 0.2),
        processes: Math.min(1.0, state.questionsAnswered * 0.2),
        judgment: Math.min(1.0, state.questionsAnswered * 0.2),
      },
      probeInstruction: isThinAnswer
        ? "The previous answer was very brief. Ask for a specific real-world example."
        : undefined,
    };
  }
}

export async function writerNode(
  state: CoachingState,
  sessionId: string,
  userId?: string
): Promise<Partial<CoachingState>> {
  const sessionData: SessionState = {
    id: sessionId,
    userId,
    businessType: state.businessType,
    businessName: state.businessName,
    messages: state.messages,
    questionsAnswered: state.questionsAnswered,
    extractedData: {},
    status: "generating",
    createdAt: new Date().toISOString(),
  };

  const brain = await generateBrainFromSession(sessionData);

  return {
    brainId: brain.meta.id,
    done: true,
  };
}

export function buildCoachingGraph() {
  const builder = new StateGraph<CoachingState>({
    channels: stateChannels as any,
  });

  builder.addNode("interviewer", async (state: CoachingState) => {
    return await interviewerNode(state);
  });

  builder.addNode("completeness_checker", async (state: CoachingState) => {
    return await completenessCheckerNode(state);
  });

  builder.addNode("writer", async (state: CoachingState) => {
    return await writerNode(state, "thread-session");
  });

  builder.addEdge(START, "interviewer" as any);
  builder.addEdge("interviewer" as any, "completeness_checker" as any);

  builder.addConditionalEdges(
    "completeness_checker" as any,
    (state: CoachingState) => {
      if (state.probeInstruction) {
        return "interviewer";
      }
      if (state.done || state.questionsAnswered >= 5) {
        return "writer";
      }
      return END;
    },
    {
      interviewer: "interviewer" as any,
      writer: "writer" as any,
      [END]: END,
    }
  );

  builder.addEdge("writer" as any, END);

  return builder.compile();
}

export async function runCoachingGraphStream(params: {
  threadId: string;
  businessType: BusinessType;
  businessName?: string;
  newMessages: ChatMessage[];
  onToken: (token: string) => void;
  userId?: string;
}): Promise<CoachingState> {
  const { threadId, businessType, businessName, newMessages, onToken, userId } = params;

  // Restore state from checkpoint if available
  const existingCheckpoint = (await supabaseCheckpointer.get(threadId)) as Partial<CoachingState> | null;

  const initialState: CoachingState = {
    messages: newMessages,
    businessType: existingCheckpoint?.businessType ?? businessType,
    businessName: existingCheckpoint?.businessName ?? businessName,
    questionsAnswered: existingCheckpoint?.questionsAnswered ?? 0,
    coverage: existingCheckpoint?.coverage ?? { knowledge: 0, processes: 0, judgment: 0 },
    probeInstruction: existingCheckpoint?.probeInstruction,
    brainId: existingCheckpoint?.brainId,
    done: existingCheckpoint?.done ?? false,
  };

  // Run interviewer node with token streaming
  const interviewerDelta = await interviewerNode(initialState, { onToken });
  const updatedState: CoachingState = {
    ...initialState,
    ...interviewerDelta,
  };

  // Run completeness check in background
  const checkerDelta = await completenessCheckerNode(updatedState);
  const finalState: CoachingState = {
    ...updatedState,
    ...checkerDelta,
  };

  // If flow is marked done, trigger writer
  if (finalState.done && !finalState.brainId) {
    try {
      const writerDelta = await writerNode(finalState, threadId, userId);
      Object.assign(finalState, writerDelta);
    } catch (err) {
      console.warn("Writer node generation deferred to standard route:", err);
    }
  }

  // Persist updated state to Supabase checkpoint
  await supabaseCheckpointer.put(threadId, finalState as unknown as Record<string, unknown>);

  return finalState;
}
