"use server";

import { createClient } from "@/lib/supabase/server";
import type { Customer } from "@/lib/types";

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data: customers } = await supabase
    .from("customers")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (customers || []) as Customer[];
}

export async function addCustomer(data: {
  name: string;
  phone?: string;
  email?: string;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { data: profile } = await supabase
    .from("business_profiles")
    .select("business_slug")
    .eq("user_id", user.id)
    .single();

  if (!profile) {
    return { success: false, error: "Set up your business profile first" };
  }

  const { data: created, error } = await supabase
    .from("customers")
    .insert({
      user_id: user.id,
      business_slug: profile.business_slug,
      name: data.name,
      phone: data.phone || null,
      email: data.email || null,
    })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, customer: created as Customer };
}

export async function updateCustomerStatus(
  customerId: string,
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
    .from("customers")
    .update({ status })
    .eq("id", customerId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function deleteCustomer(customerId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)
    .eq("user_id", user.id);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
