import { Sparkles } from "lucide-react";

export default function AIRepliesPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Replies</h1>
      <p className="mt-2 text-gray-600">
        Generate professional replies to customer reviews using AI.
      </p>

      <div className="mt-8 flex flex-col items-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
        <p className="mt-3 max-w-md text-gray-600">
          AI-powered review responses will be available soon.
        </p>
        <p className="mt-6 text-sm text-gray-400">
          We&apos;re building smart reply suggestions so you can respond to
          every review in seconds.
        </p>
      </div>
    </div>
  );
}
