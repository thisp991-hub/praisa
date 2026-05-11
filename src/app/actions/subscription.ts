"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import type { BusinessProfile } from "@/lib/types";

export async function getAllBusinessProfiles(): Promise<BusinessProfile[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return [];
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as BusinessProfile[];
}

export async function updateSubscriptionStatus(
  profileId: string,
  status: string,
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { error } = await supabase
    .from("business_profiles")
    .update({ subscription_status: status })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function extendTrial(profileId: string, days: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { data: profile } = await supabase
    .from("business_profiles")
    .select("trial_ends_at")
    .eq("id", profileId)
    .single();

  if (!profile) {
    return { success: false, error: "Profile not found" };
  }

  const currentEnd = profile.trial_ends_at
    ? new Date(profile.trial_ends_at)
    : new Date();
  const newEnd = new Date(
    Math.max(currentEnd.getTime(), Date.now()) + days * 24 * 60 * 60 * 1000,
  );

  const { error } = await supabase
    .from("business_profiles")
    .update({
      subscription_status: "trial",
      trial_ends_at: newEnd.toISOString(),
    })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function activateForDays(profileId: string, days: number) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const paidUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const { error } = await supabase
    .from("business_profiles")
    .update({
      subscription_status: "active",
      paid_until: paidUntil.toISOString(),
    })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePaidUntil(profileId: string, paidUntil: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { error } = await supabase
    .from("business_profiles")
    .update({
      paid_until: paidUntil || null,
    })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function updatePlan(profileId: string, plan: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { error } = await supabase
    .from("business_profiles")
    .update({ plan })
    .eq("id", profileId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
