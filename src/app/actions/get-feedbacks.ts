"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFeedbacks() {
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

  return (feedbacks || []) as {
    id: string;
    business_slug: string;
    rating: number;
    feedback_text: string | null;
    name: string | null;
    email: string | null;
    created_at: string;
  }[];
}
