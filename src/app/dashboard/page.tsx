import { getFeedbacks } from "@/app/actions/get-feedbacks";
import { MessageSquare, Star, ThumbsUp, ShieldAlert } from "lucide-react";

export default async function DashboardPage() {
  const feedbacks = await getFeedbacks();

  const total = feedbacks.length;
  const avgRating =
    total > 0
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1)
      : "—";
  const positiveCount = feedbacks.filter((f) => f.rating >= 4).length;
  const privateCount = feedbacks.filter((f) => f.rating <= 3).length;

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
      value: avgRating,
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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Your feedback overview at a glance.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
