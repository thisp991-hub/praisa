"use client";

import { Shield, Clock, AlertTriangle } from "lucide-react";
import type { SubscriptionState } from "@/lib/subscription";

interface TrialBannerProps {
  state: SubscriptionState;
}

export function TrialBanner({ state }: TrialBannerProps) {
  if (state.status === "admin") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
        <Shield className="h-5 w-5 text-purple-600" />
        <p className="text-sm font-medium text-purple-800">
          Admin access — full control enabled
        </p>
      </div>
    );
  }

  if (state.status === "trial_active") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <Clock className="h-5 w-5 text-blue-600" />
        <p className="text-sm font-medium text-blue-800">
          Trial active — {state.daysRemaining} day
          {state.daysRemaining !== 1 ? "s" : ""} remaining
        </p>
      </div>
    );
  }

  if (state.status === "no_profile") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <Clock className="h-5 w-5 text-blue-600" />
        <p className="text-sm font-medium text-blue-800">
          Welcome! Go to{" "}
          <a href="/dashboard/settings" className="underline hover:no-underline">
            Settings
          </a>{" "}
          to set up your business profile.
        </p>
      </div>
    );
  }

  if (state.status === "paid_active") {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <Shield className="h-5 w-5 text-green-600" />
        <p className="text-sm font-medium text-green-800">
          Plan active until {state.paidUntil}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <AlertTriangle className="h-5 w-5 text-red-600" />
      <p className="text-sm font-medium text-red-800">
        Your trial has ended. Please renew to continue using Praisa.
      </p>
    </div>
  );
}
