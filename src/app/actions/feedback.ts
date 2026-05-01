"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitFeedback(data: {
  business_slug: string;
  rating: number;
  feedback_text?: string;
  name?: string;
  email?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("feedbacks").insert({
    business_slug: data.business_slug,
    rating: data.rating,
    feedback_text: data.feedback_text || null,
    name: data.name || null,
    email: data.email || null,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("business_slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data as {
    id: string;
    user_id: string;
    business_name: string;
    business_slug: string;
    google_review_link: string | null;
    created_at: string;
  };
}
