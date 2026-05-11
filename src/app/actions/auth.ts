"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin as checkAdmin } from "@/lib/admin";
import type { BusinessProfile } from "@/lib/types";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email || "",
    isAdmin: checkAdmin(user.email),
  };
}

export async function getBusinessProfileWithSubscription(): Promise<BusinessProfile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (data as BusinessProfile) || null;
}
