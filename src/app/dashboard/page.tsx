import { getFeedbacks } from "@/app/actions/get-feedbacks";
import { getCurrentUser, getBusinessProfileWithSubscription } from "@/app/actions/auth";
import { getSubscriptionState, isAccountActive } from "@/lib/subscription";
import { TrialBanner } from "@/components/trial-banner";
import { RenewalMessage } from "@/components/renewal-message";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import type { Feedback } from "@/lib/types";

function getTopCategory(feedbacks: Feedback[]): string | null {
  const privateFeedbacks = feedbacks.filter(
    (f) => f.rating <= 3 && f.category,
  );
  if (privateFeedbacks.length === 0) return null;

  const counts: Record<string, number> = {};
  for (const f of privateFeedbacks) {
    const cat = f.category as string;
    counts[cat] = (counts[cat] || 0) + 1;
  }

  let topCat = "";
  let topCount = 0;
  for (const [cat, count] of Object.entries(counts)) {
    if (count > topCount) {
      topCat = cat;
      topCount = count;
    }
  }

  return topCat || null;
}

function getRecommendation(
  avgRating: number,
  positivePercent: number,
  needsAttention: number,
  topCategory: string | null,
): string {
  if (needsAttention > 0 && topCategory) {
    return `You have ${needsAttention} feedback item${needsAttention > 1 ? "s" : ""} needing attention. The most common issue is "${topCategory}" — consider addressing this to improve satisfaction.`;
  }
  if (needsAttention > 0) {
    return `You have ${needsAttention} private feedback item${needsAttention > 1 ? "s" : ""} to review. Check the Feedback page to respond.`;
  }
  if (avgRating >= 4.5) {
    return "Excellent! Your customers love you. Keep sharing your QR code to collect more reviews.";
  }
  if (avgRating >= 3.5) {
    return "Good performance! Focus on addressing any private feedback to push your rating higher.";
  }
  return "Share your QR code to start collecting feedback and building your reputation.";
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const profile = await getBusinessProfileWithSubscription();
  const subState = getSubscriptionState(profile, user?.isAdmin ?? false);
  const active = isAccountActive(subState);

  if (!active) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="mt-4">
          <TrialBanner state={subState} />
        </div>
        <RenewalMessage />
      </div>
    );
  }

  const feedbacks = await getFeedbacks();

  const total = feedbacks.length;
  const avgRating =
    total > 0
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / total
      : 0;
  const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;
  const privateCount = feedbacks.filter((f) => f.rating <= 3).length;

  const now = new Date();
  const thisMonth = feedbacks.filter((f) => {
    const d = new Date(f.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthTotal = thisMonth.length;
  const monthAvg =
    monthTotal > 0
      ? thisMonth.reduce((sum, f) => sum + f.rating, 0) / monthTotal
      : 0;
  const monthPositive = thisMonth.filter((f) => f.rating >= 4).length;
  const monthPositivePercent =
    monthTotal > 0 ? Math.round((monthPositive / monthTotal) * 100) : 0;
  const needsAttention = thisMonth.filter(
    (f) => f.rating <= 3 && f.status === "new",
  ).length;
  const topCategory = getTopCategory(thisMonth);

  const stats = [
    {
      label: "Total Feedback",
      value: total > 0 ? total.toString() : "—",
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Average Rating",
      value: total > 0 ? avgRating.toFixed(1) : "—",
      icon: Star,
      color: "text-yellow-600",
      bg: "bg-yellow-50",
    },
    {
      label: "Positive Ratings",
      value: total > 0 ? positiveCount.toString() : "—",
      icon: ThumbsUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Private Feedback",
      value: total > 0 ? privateCount.toString() : "—",
      icon: ShieldAlert,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const recommendation = getRecommendation(
    monthAvg,
    monthPositivePercent,
    needsAttention,
    topCategory,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Your feedback overview at a glance.
      </p>

      <div className="mt-4">
        <TrialBanner state={subState} />
      </div>

      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-6"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            </div>
            <p className="mt-4 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Reputation Summary */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-900">
            Reputation Summary — This Month
          </h2>
        </div>

        {monthTotal === 0 ? (
          <p className="text-sm text-gray-500">
            No feedback received this month yet. Share your QR code to start
            collecting reviews.
          </p>
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-xs font-medium text-blue-600">
                  Feedback This Month
                </p>
                <p className="mt-1 text-2xl font-bold text-blue-900">
                  {monthTotal}
                </p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-4">
                <p className="text-xs font-medium text-yellow-600">
                  Average Rating
                </p>
                <p className="mt-1 text-2xl font-bold text-yellow-900">
                  {monthAvg.toFixed(1)}
                </p>
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs font-medium text-green-600">
                  Positive Feedback
                </p>
                <p className="mt-1 text-2xl font-bold text-green-900">
                  {monthPositivePercent}%
                </p>
              </div>
              <div className="rounded-lg bg-orange-50 p-4">
                <div className="flex items-center gap-1">
                  <p className="text-xs font-medium text-orange-600">
                    Needs Attention
                  </p>
                  {needsAttention > 0 && (
                    <AlertTriangle className="h-3 w-3 text-orange-500" />
                  )}
                </div>
                <p className="mt-1 text-2xl font-bold text-orange-900">
                  {needsAttention}
                </p>
              </div>
            </div>

            {topCategory && (
              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-4 py-3">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-700">
                  Top issue this month:{" "}
                  <span className="font-medium">{topCategory}</span>
                </p>
              </div>
            )}

            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
              <p className="text-sm text-gray-700">{recommendation}</p>
            </div>
          </div>
        )}
      </div>

      {total === 0 && (
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">
            No feedback yet. Share your QR code to start collecting reviews.
          </p>
        </div>
      )}
    </div>
  );
}
