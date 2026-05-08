"use server";

import { createClient } from "@/lib/supabase/server";
import type { Feedback } from "@/lib/types";

export async function getFeedbacks(): Promise<Feedback[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: profile } = await supabase
    .from("business_profiles")
    .select("business_slug")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return [];
  }

  const { data: feedbacks } = await supabase
    .from("feedbacks")
    .select("*")
    .eq("business_slug", profile.business_slug)
    .order("created_at", { ascending: false });

  return (feedbacks || []) as Feedback[];
}
