import { getBusinessBySlug } from "@/app/actions/feedback";
import { FeedbackForm } from "./feedback-form";

export default async function FeedbackPage({
  params,
}: {
  params: Promise<{ businessSlug: string }>;
}) {
  const { businessSlug } = await params;
  const business = await getBusinessBySlug(businessSlug);

  if (!business) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Business not found
          </h1>
          <p className="mt-2 text-gray-600">
            The feedback page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          {business.logo_url && (
            <div className="mb-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={business.logo_url}
                alt={`${business.business_name} logo`}
                className="h-16 w-16 rounded-full object-cover shadow-sm"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-900">
            {business.business_name}
          </h1>
          <p className="mt-2 text-gray-600">How was your experience?</p>
        </div>
        <FeedbackForm
          businessSlug={businessSlug}
          googleReviewLink={business.google_review_link}
        />
        <p className="mt-6 text-center text-xs text-gray-400">
          Powered by Praisa
        </p>
      </div>
    </div>
  );
}
