import { BrainRecord } from "@/lib/types";
import { supabaseAdmin } from "@/lib/supabase";
import { generateEmbedding } from "@/lib/ai";

export interface BrainChunk {
  id?: string;
  brainId: string;
  section: string;
  chunkIndex: number;
  content: string;
  embedding?: number[];
}

export function chunkText(text: string, chunkSize: number = 500, overlap: number = 50): string[] {
  if (!text || text.trim().length === 0) return [];
  const words = text.split(/\s+/);
  if (words.length <= chunkSize) return [text.trim()];

  const chunks: string[] = [];
  let start = 0;
  while (start < words.length) {
    const end = Math.min(start + chunkSize, words.length);
    const chunk = words.slice(start, end).join(" ");
    chunks.push(chunk);
    if (end === words.length) break;
    start += chunkSize - overlap;
  }
  return chunks;
}

export function extractBrainSections(brain: BrainRecord): { section: string; content: string }[] {
  const sections: { section: string; content: string }[] = [];

  if (brain.markdown?.knowledge_md) {
    sections.push({ section: "KNOWLEDGE.md", content: brain.markdown.knowledge_md });
  } else if (brain.knowledge) {
    sections.push({
      section: "KNOWLEDGE.md",
      content: `Operating Model: ${brain.knowledge.operatingModel}\nClient Profile: ${brain.knowledge.clientProfile}\nPricing Model: ${brain.knowledge.pricingModel}\nTeam Structure: ${brain.knowledge.teamStructure}\nKey Metrics: ${brain.knowledge.keyMetrics.join(", ")}`,
    });
  }

  if (brain.markdown?.processes_md) {
    sections.push({ section: "PROCESSES.md", content: brain.markdown.processes_md });
  } else if (brain.processes?.length) {
    const processStr = brain.processes
      .map(
        (p) =>
          `Process: ${p.name}\nOwner: ${p.owner}\nTrigger: ${p.trigger}\nDecision Points: ${p.decisionPoints.join(
            ", "
          )}\nSteps:\n` + p.steps.map((s) => `${s.order}. ${s.action} (Owner: ${s.owner}) -> ${s.output}`).join("\n")
      )
      .join("\n\n");
    sections.push({ section: "PROCESSES.md", content: processStr });
  }

  if (brain.markdown?.judgment_md) {
    sections.push({ section: "JUDGMENT.md", content: brain.markdown.judgment_md });
  } else if (brain.judgment) {
    sections.push({
      section: "JUDGMENT.md",
      content: `Quality Criteria: ${brain.judgment.qualityCriteria}\nHard Rules: ${brain.judgment.hardRules.join(
        "\n- "
      )}\nScoring Framework: ${brain.judgment.scoringFramework}\nApproval Required: ${brain.judgment.approvalRequired.join(
        ", "
      )}`,
    });
  }

  if (brain.skills?.length) {
    const skillsStr = brain.skills
      .map(
        (s) =>
          `Skill: ${s.name}\nDescription: ${s.description}\nInputs: ${s.inputs.join(", ")}\nOutputs: ${s.outputs.join(
            ", "
          )}\nSteps: ${s.steps.join(" -> ")}`
      )
      .join("\n\n");
    sections.push({ section: "SKILLS", content: skillsStr });
  }

  return sections;
}

export async function ingestBrain(brain: BrainRecord): Promise<{ chunksIngested: number }> {
  const sections = extractBrainSections(brain);
  const chunksToInsert: Omit<BrainChunk, "id">[] = [];

  for (const sec of sections) {
    const textChunks = chunkText(sec.content, 350, 40);
    textChunks.forEach((chunk, index) => {
      chunksToInsert.push({
        brainId: brain.meta.id,
        section: sec.section,
        chunkIndex: index,
        content: chunk,
      });
    });
  }

  let ingestedCount = 0;

  for (const chunk of chunksToInsert) {
    let embedding: number[] | undefined;
    try {
      embedding = await generateEmbedding(chunk.content);
    } catch {
      embedding = undefined;
    }

    const payload: any = {
      brain_id: chunk.brainId,
      section: chunk.section,
      chunk_index: chunk.chunkIndex,
      content: chunk.content,
    };

    if (embedding && embedding.length > 0) {
      payload.embedding = embedding;
    }

    const { error } = await supabaseAdmin.from("brain_chunks").insert(payload);
    if (!error) {
      ingestedCount++;
    }
  }

  return { chunksIngested: ingestedCount };
}

export async function searchBrainChunks(
  brainId: string,
  query: string,
  topK: number = 4
): Promise<{ section: string; chunk_index: number; content: string }[]> {
  // Try semantic embedding search first
  try {
    const queryEmbedding = await generateEmbedding(query);
    if (queryEmbedding && queryEmbedding.length > 0) {
      const { data, error } = await supabaseAdmin.rpc("match_brain_chunks", {
        query_embedding: queryEmbedding,
        match_brain_id: brainId,
        match_count: topK,
      });
      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch {
    // Fallback to text matching
  }

  // Fallback: direct database text query
  const { data } = await supabaseAdmin
    .from("brain_chunks")
    .select("section, chunk_index, content")
    .eq("brain_id", brainId)
    .limit(topK * 2);

  if (!data || data.length === 0) return [];

  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  const scored = data.map((chunk: any) => {
    const contentLower = String(chunk.content || "").toLowerCase();
    let score = 0;
    queryTerms.forEach((term) => {
      if (contentLower.includes(term)) score += 1;
    });
    return { ...chunk, score };
  });

  scored.sort((a: any, b: any) => b.score - a.score);
  return scored.slice(0, topK).map(({ section, chunk_index, content }: any) => ({
    section,
    chunk_index,
    content,
  }));
}
