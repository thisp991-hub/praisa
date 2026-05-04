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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {business.business_name}
          </h1>
          <p className="mt-2 text-gray-600">How was your experience?</p>
        </div>
        <FeedbackForm
          businessSlug={businessSlug}
          googleReviewLink={business.google_review_link}
        />
      </div>
    </div>
  );
}
