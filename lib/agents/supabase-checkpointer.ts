import { supabaseAdmin } from "@/lib/supabase";

export interface GraphCheckpointRecord {
  thread_id: string;
  checkpoint: Record<string, unknown>;
  updated_at?: string;
}

export class SupabaseCheckpointer {
  async get(threadId: string): Promise<Record<string, unknown> | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from("graph_checkpoints")
        .select("checkpoint")
        .eq("thread_id", threadId)
        .maybeSingle();

      if (error || !data) return null;
      return data.checkpoint as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  async put(threadId: string, checkpoint: Record<string, unknown>): Promise<void> {
    try {
      await supabaseAdmin.from("graph_checkpoints").upsert({
        thread_id: threadId,
        checkpoint,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Failed to persist graph checkpoint to Supabase:", err);
    }
  }
}

export const supabaseCheckpointer = new SupabaseCheckpointer();
