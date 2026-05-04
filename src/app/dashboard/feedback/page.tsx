import { getFeedbacks } from "@/app/actions/get-feedbacks";
import { getBusinessProfile } from "@/app/actions/business";
import { Star } from "lucide-react";

export default async function FeedbackPage() {
  const profile = await getBusinessProfile();
  const feedbacks = await getFeedbacks();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Feedback</h1>
      <p className="mt-2 text-gray-600">
        View customer feedback submitted through your feedback page.
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
        <div className="mt-6 space-y-4">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= feedback.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <time className="text-xs text-gray-400">
                  {new Date(feedback.created_at).toLocaleDateString()}
                </time>
              </div>

              {feedback.feedback_text && (
                <p className="mt-2 text-sm text-gray-700">
                  {feedback.feedback_text}
                </p>
              )}

              {(feedback.name || feedback.email) && (
                <div className="mt-2 flex gap-3 text-xs text-gray-500">
                  {feedback.name && <span>{feedback.name}</span>}
                  {feedback.email && <span>{feedback.email}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
