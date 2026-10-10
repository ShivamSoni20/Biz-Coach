import { generateBrainFromSession } from "@/lib/brain-generator";
import { getAuthenticatedUser } from "@/lib/auth";
import { kvGet, kvSet } from "@/lib/kv";
import type { SessionState } from "@/lib/types";
import { ingestBrain } from "@/lib/rag/ingest";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);

    if (!user) {
      return Response.json({ error: "Login required." }, { status: 401 });
    }

    const { sessionId } = (await request.json()) as { sessionId?: string };

    if (!sessionId) {
      return Response.json({ error: "sessionId is required." }, { status: 400 });
    }

    const session = await kvGet<SessionState>(`session:${sessionId}`);

    if (!session) {
      return Response.json({ error: "Session not found." }, { status: 404 });
    }

    if (session.userId && session.userId !== user.id) {
      return Response.json({ error: "You do not have access to this session." }, { status: 403 });
    }

    session.userId = user.id;
    const brain = await generateBrainFromSession(session);
    await kvSet(`brain:${brain.meta.id}`, brain, { ex: 60 * 60 * 24 * 30 });

    // Ingest chunks into vector DB asynchronously for RAG Q&A
    ingestBrain(brain).catch((err) => {
      console.error("Background RAG ingestion error:", err);
    });

    const completedSession: SessionState = {
      ...session,
      status: "complete",
    };

    await kvSet(`session:${sessionId}`, completedSession, { ex: 86400 });

    return Response.json({ brainId: brain.meta.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not generate the brain.";
    return Response.json({ error: message }, { status: 500 });
  }
}
