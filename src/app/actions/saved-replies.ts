"use server";

import { createClient } from "@/lib/supabase/server";
import type { SavedReply } from "@/lib/types";

export async function saveReply(data: {
  review_text: string;
  reply_text: string;
  tone: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("saved_replies").insert({
    user_id: user.id,
    review_text: data.review_text,
    reply_text: data.reply_text,
    tone: data.tone,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getSavedReplies(): Promise<SavedReply[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data } = await supabase
    .from("saved_replies")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data as SavedReply[]) ?? [];
}

export async function deleteReply(replyId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("saved_replies")
    .delete()
    .eq("id", replyId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
