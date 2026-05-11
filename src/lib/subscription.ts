import type { BusinessProfile } from "@/lib/types";

export type SubscriptionState =
  | { status: "trial_active"; daysRemaining: number }
  | { status: "paid_active"; paidUntil: string }
  | { status: "expired" }
  | { status: "admin" };

export function getSubscriptionState(
  profile: BusinessProfile | null,
  isAdminUser: boolean,
): SubscriptionState {
  if (isAdminUser) {
    return { status: "admin" };
  }

  if (!profile) {
    return { status: "expired" };
  }

  const now = new Date();

  if (
    profile.subscription_status === "active" &&
    profile.paid_until &&
    new Date(profile.paid_until) > now
  ) {
    return {
      status: "paid_active",
      paidUntil: new Date(profile.paid_until).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };
  }

  if (
    profile.subscription_status === "trial" &&
    profile.trial_ends_at &&
    new Date(profile.trial_ends_at) > now
  ) {
    const diffMs = new Date(profile.trial_ends_at).getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
    return { status: "trial_active", daysRemaining };
  }

  return { status: "expired" };
}

export function isAccountActive(state: SubscriptionState): boolean {
  return (
    state.status === "admin" ||
    state.status === "trial_active" ||
    state.status === "paid_active"
  );
}
