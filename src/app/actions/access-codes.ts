"use server";

import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/admin";
import type { AccessCode } from "@/lib/types";

export async function validateAccessCode(code: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("validate_access_code", {
    p_code: code,
  });

  if (error) {
    return false;
  }

  return data === true;
}

export async function claimAccessCode(
  code: string,
  email: string,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("claim_access_code", {
    p_code: code,
    p_email: email,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (data !== true) {
    return {
      success: false,
      error: "This access code has already been used or is no longer valid.",
    };
  }

  return { success: true };
}

export async function releaseAccessCode(
  code: string,
  email: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("release_access_code", {
    p_code: code,
    p_email: email,
  });
}

export async function finalizeAccessCode(
  code: string,
  email: string,
  userId: string,
): Promise<void> {
  const supabase = await createClient();
  await supabase.rpc("finalize_access_code", {
    p_code: code,
    p_email: email,
    p_user_id: userId,
  });
}

export async function getAccessCodes(): Promise<AccessCode[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return [];
  }

  const { data, error } = await supabase
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return data as AccessCode[];
}

export async function createAccessCode(formData: {
  code: string;
  client_name?: string;
  expires_at?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { data, error } = await supabase
    .from("access_codes")
    .insert({
      code: formData.code,
      client_name: formData.client_name || null,
      expires_at: formData.expires_at || null,
      created_by: user.id,
    })
    .select("id")
    .single();

  if (error) {
    if (error.message.includes("duplicate") || error.message.includes("unique")) {
      return { success: false, error: "This access code already exists." };
    }
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id as string };
}

export async function deleteAccessCode(codeId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdmin(user.email)) {
    return { success: false, error: "Not authorized" };
  }

  const { error } = await supabase
    .from("access_codes")
    .delete()
    .eq("id", codeId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
