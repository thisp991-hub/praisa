"use client";

import { useState, useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { submitFeedback } from "@/app/actions/feedback";

interface FeedbackFormProps {
  businessSlug: string;
  googleReviewLink: string | null;
}

export function FeedbackForm({
  businessSlug,
  googleReviewLink,
}: FeedbackFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPositive = rating >= 4;
  const isNegative = rating >= 1 && rating <= 3;
  const positiveSubmitted = useRef(false);

  useEffect(() => {
    if (isPositive && !positiveSubmitted.current) {
      positiveSubmitted.current = true;
      submitFeedback({
        business_slug: businessSlug,
        rating,
        feedback_text: undefined,
        name: undefined,
        email: undefined,
      });
    }
  }, [isPositive, rating, businessSlug]);

  async function handleSubmitFeedback(e: React.FormEvent) {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setError("Please enter your feedback.");
      return;
    }

    setLoading(true);
    setError(null);

    const result = await submitFeedback({
      business_slug: businessSlug,
      rating,
      feedback_text: feedbackText,
      name: name || undefined,
      email: email || undefined,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error || "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Thank you for your feedback!
        </h2>
        <p className="mt-2 text-gray-600">
          We appreciate you taking the time to share your experience.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Star Rating */}
      <div className="mb-6">
        <p className="mb-3 text-center text-sm font-medium text-gray-700">
          Tap a star to rate
        </p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="rounded-lg p-1 transition-transform hover:scale-110 active:scale-95"
            >
              <Star
                className={`h-10 w-10 ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Positive Rating: Redirect to Google */}
      {isPositive && (
        <div className="text-center">
          <p className="mb-4 text-lg font-medium text-gray-900">
            Thank you! We&apos;re glad you had a great experience.
          </p>
          <p className="mb-6 text-sm text-gray-600">
            Would you mind leaving us a Google review? It really helps!
          </p>
          {googleReviewLink ? (
            <a
              href={googleReviewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Leave a Google Review
            </a>
          ) : (
            <p className="text-sm text-gray-500">
              Google review link not configured yet.
            </p>
          )}
        </div>
      )}

      {/* Negative Rating: Private Feedback Form */}
      {isNegative && (
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <p className="text-center text-sm text-gray-600">
            We&apos;re sorry to hear that. Please share your feedback so we can
            improve.
          </p>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="feedback"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Your Feedback <span className="text-red-500">*</span>
            </label>
            <textarea
              id="feedback"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Tell us what went wrong..."
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email <span className="text-gray-400">(optional)</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
