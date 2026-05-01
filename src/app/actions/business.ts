"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/utils";

export async function getBusinessProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return data as {
    id: string;
    user_id: string;
    business_name: string;
    business_slug: string;
    google_review_link: string | null;
    created_at: string;
  } | null;
}

export async function saveBusinessProfile(formData: {
  business_name: string;
  google_review_link: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const slug = generateSlug(formData.business_name);

  const { data: existing } = await supabase
    .from("business_profiles")
    .select("id, business_slug")
    .eq("user_id", user.id)
    .single();

  if (existing) {
    const oldSlug = existing.business_slug;

    if (oldSlug && oldSlug !== slug) {
      const { error } = await supabase.rpc("migrate_business_slug", {
        p_profile_id: existing.id,
        p_old_slug: oldSlug,
        p_new_slug: slug,
        p_business_name: formData.business_name,
        p_google_review_link: formData.google_review_link || null,
      });

      if (error) {
        return { success: false, error: error.message };
      }
    } else {
      const { error } = await supabase
        .from("business_profiles")
        .update({
          business_name: formData.business_name,
          business_slug: slug,
          google_review_link: formData.google_review_link || null,
        })
        .eq("id", existing.id);

      if (error) {
        return { success: false, error: error.message };
      }
    }
  } else {
    const { error } = await supabase.from("business_profiles").insert({
      user_id: user.id,
      business_name: formData.business_name,
      business_slug: slug,
      google_review_link: formData.google_review_link || null,
    });

    if (error) {
      return { success: false, error: error.message };
    }
  }

  return { success: true, slug };
}
