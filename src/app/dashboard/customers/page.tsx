import { getBusinessProfile } from "@/app/actions/business";
import { getCustomers } from "@/app/actions/customers";
import { getCurrentUser, getBusinessProfileWithSubscription } from "@/app/actions/auth";
import { getSubscriptionState, isAccountActive } from "@/lib/subscription";
import { TrialBanner } from "@/components/trial-banner";
import { RenewalMessage } from "@/components/renewal-message";
import { CustomersClient } from "./customers-client";

export default async function CustomersPage() {
  const user = await getCurrentUser();
  const fullProfile = await getBusinessProfileWithSubscription();
  const subState = getSubscriptionState(fullProfile, user?.isAdmin ?? false);
  const active = isAccountActive(subState);

  if (!active) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <div className="mt-4">
          <TrialBanner state={subState} />
        </div>
        <RenewalMessage />
      </div>
    );
  }

  const profile = await getBusinessProfile();
  const customers = await getCustomers();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
      <p className="mt-2 text-gray-600">
        Manage your customers and send review requests via WhatsApp.
      </p>

      {!profile ? (
        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
          <h2 className="text-lg font-semibold text-yellow-800">
            Set up your business first
          </h2>
          <p className="mt-2 text-sm text-yellow-700">
            Go to{" "}
            <a
              href="/dashboard/settings"
              className="font-medium underline hover:no-underline"
            >
              Settings
            </a>{" "}
            and enter your business name before adding customers.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <CustomersClient
            initialCustomers={customers}
            businessName={profile.business_name}
            businessSlug={profile.business_slug}
          />
        </div>
      )}
    </div>
  );
}
