"use server";

import { createClient } from "@/lib/supabase/server";
export async function submitFeedback(data: {
  business_slug: string;
  rating: number;
  feedback_text?: string;
  name?: string;
  email?: string;
  category?: string;
}) {
  const supabase = await createClient();

  const { error } = await supabase.from("feedbacks").insert({
    business_slug: data.business_slug,
    rating: data.rating,
    feedback_text: data.feedback_text || null,
    name: data.name || null,
    email: data.email || null,
    category: data.category || null,
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
    logo_url: string | null;
    subscription_status: string;
    trial_ends_at: string | null;
    paid_until: string | null;
    created_at: string;
  };
}

export async function updateFeedbackStatus(
  feedbackId: string,
  status: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("feedbacks")
    .update({ status })
    .eq("id", feedbackId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updateFeedbackNote(
  feedbackId: string,
  internal_note: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("feedbacks")
    .update({ internal_note: internal_note || null })
    .eq("id", feedbackId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
