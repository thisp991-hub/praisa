import { getFeedbacks } from "@/app/actions/get-feedbacks";
import { getBusinessProfile } from "@/app/actions/business";
import { getCurrentUser, getBusinessProfileWithSubscription } from "@/app/actions/auth";
import { getSubscriptionState, isAccountActive } from "@/lib/subscription";
import { TrialBanner } from "@/components/trial-banner";
import { RenewalMessage } from "@/components/renewal-message";
import { FeedbackList } from "./feedback-client";

export default async function FeedbackPage() {
  const user = await getCurrentUser();
  const fullProfile = await getBusinessProfileWithSubscription();
  const subState = getSubscriptionState(fullProfile, user?.isAdmin ?? false);
  const active = isAccountActive(subState);

  if (!active) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
        <div className="mt-4">
          <TrialBanner state={subState} />
        </div>
        <RenewalMessage />
      </div>
    );
  }

  const profile = await getBusinessProfile();
  const feedbacks = await getFeedbacks();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
      <p className="mt-2 text-gray-600">
        View and manage customer feedback submitted through your feedback page.
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
            and enter your business name to start collecting feedback.
          </p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No feedback received yet.</p>
          <p className="mt-2 text-sm text-gray-400">
            Share your QR code to start collecting feedback.
          </p>
        </div>
      ) : (
        <div className="mt-6">
          <FeedbackList initialFeedbacks={feedbacks} />
        </div>
      )}
    </div>
  );
}
