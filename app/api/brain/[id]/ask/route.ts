import { getAiClient, AIML_MODEL } from "@/lib/ai";
import { kvGet } from "@/lib/kv";
import { searchBrainChunks, ingestBrain, extractBrainSections } from "@/lib/rag/ingest";
import type { BrainRecord } from "@/lib/types";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const brainId = params.id;
    const { question } = (await request.json()) as { question?: string };

    if (!question || question.trim().length === 0) {
      return Response.json({ error: "Question is required." }, { status: 400 });
    }

    const brain = await kvGet<BrainRecord>(`brain:${brainId}`);
    if (!brain) {
      return Response.json({ error: "Brain not found." }, { status: 404 });
    }

    let chunks = await searchBrainChunks(brainId, question, 5);

    // If chunks are missing (e.g. legacy brain created before migration), perform automatic ingestion
    if (chunks.length === 0) {
      try {
        await ingestBrain(brain);
        chunks = await searchBrainChunks(brainId, question, 5);
      } catch (ingestErr) {
        console.warn("Auto-ingestion skipped or failed:", ingestErr);
      }
    }

    // Resilient Fallback: If vector search returned 0 chunks (e.g. Supabase table not migrated or embedding API down),
    // extract direct chunks directly from the brain's existing markdown files so RAG never fails if info exists!
    if (chunks.length === 0) {
      const directSections = extractBrainSections(brain);
      chunks = directSections.map((sec, idx) => ({
        section: sec.section,
        chunk_index: idx,
        content: sec.content,
      }));
    }

    const contextStr = chunks.length > 0
      ? chunks.map((c, i) => `[Source ${i + 1} - ${c.section}:chunk-${c.chunk_index}]\n${c.content}`).join("\n\n")
      : "No specific source files found.";

    const systemPrompt = `You are Biz Coach RAG Assistant. Your job is to answer questions using strictly the provided Company Brain source chunks.

CRITICAL CITATION & FAITHFULNESS RULES:
1. Every factual statement MUST include inline citation in format [section:chunk_index] corresponding to the source chunks. (Example: [KNOWLEDGE.md:0] or [PROCESSES.md:1]).
2. Do NOT invent details or claim facts not supported by the sources.
3. If the sources do not contain the answer, explicitly state "I could not find information about this in the Company Brain."`;

    const userPrompt = `Company Brain (${brain.meta.businessName} - ${brain.meta.businessType}):

--- SOURCE CHUNKS ---
${contextStr}
--- END SOURCE CHUNKS ---

User Question: ${question}

Provide a concise, cited response.`;

    const ai = getAiClient();
    const completion = await ai.chat.completions.create({
      model: AIML_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const answer = completion.choices[0]?.message?.content ?? "No answer generated.";

    const citations = chunks.map((c) => ({
      section: c.section,
      chunkIndex: c.chunk_index,
      snippet: c.content,
    }));

    return Response.json({
      answer,
      citations,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "RAG query failed.";
    return Response.json({ error: message }, { status: 500 });
  }
}
