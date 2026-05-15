import { getBusinessProfile } from "@/app/actions/business";
import { getCurrentUser, getBusinessProfileWithSubscription } from "@/app/actions/auth";
import { getSubscriptionState, isAccountActive } from "@/lib/subscription";
import { TrialBanner } from "@/components/trial-banner";
import { SUPPORT_EMAIL, WHATSAPP_LINK } from "@/lib/admin";
import { Mail, MessageCircle } from "lucide-react";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const fullProfile = await getBusinessProfileWithSubscription();
  const subState = getSubscriptionState(fullProfile, user?.isAdmin ?? false);
  const active = isAccountActive(subState);
  const profile = await getBusinessProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">
        Configure your business profile and preferences.
      </p>

      <div className="mt-4">
        <TrialBanner state={subState} />
      </div>

      {!active && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm font-medium text-amber-800">
            To renew your Praisa plan, contact support.
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:underline"
            >
              <Mail className="h-4 w-4" />
              {SUPPORT_EMAIL}
            </a>
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-amber-700 hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      )}

      <div className="mt-2">
        <SettingsForm
          initialName={profile?.business_name || ""}
          initialGoogleLink={profile?.google_review_link || ""}
          initialLogoUrl={profile?.logo_url || ""}
          currentSlug={profile?.business_slug || null}
        />
      </div>
    </div>
  );
}
