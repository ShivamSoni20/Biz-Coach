import OpenAI from "openai";

export const AIML_BASE_URL = process.env.AIML_API_BASE_URL ?? "https://api.aimlapi.com/v1";
export const AIML_MODEL = process.env.AIML_MODEL ?? "openai/gpt-4o-mini";
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

export function assertAiConfig() {
  if (!process.env.AIML_API_KEY && !process.env.OPENAI_API_KEY) {
    throw new Error("Missing AIML API key. Set AIML_API_KEY in your environment.");
  }
}

export function getAiClient() {
  assertAiConfig();

  return new OpenAI({
    apiKey: process.env.AIML_API_KEY ?? process.env.OPENAI_API_KEY,
    baseURL: AIML_BASE_URL,
  });
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const ai = getAiClient();
    const res = await ai.embeddings.create({
      model: EMBEDDING_MODEL,
      input: text,
    });
    return res.data[0]?.embedding ?? [];
  } catch (error) {
    console.warn("Embedding API call skipped or failed, falling back to keyword search:", error);
    return [];
  }
}
