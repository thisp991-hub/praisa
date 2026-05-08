import { getBusinessProfile } from "@/app/actions/business";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const profile = await getBusinessProfile();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-2 text-gray-600">
        Configure your business profile and preferences.
      </p>

      <div className="mt-6">
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
