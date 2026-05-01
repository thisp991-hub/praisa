import { getSavedReplies } from "@/app/actions/saved-replies";
import { AIRepliesClient } from "./ai-replies-client";

export default async function AIRepliesPage() {
  const savedReplies = await getSavedReplies();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">AI Replies</h1>
      <p className="mt-2 text-gray-600">
        Generate professional replies to customer reviews using AI.
      </p>

      <div className="mt-6">
        <AIRepliesClient initialReplies={savedReplies} />
      </div>
    </div>
  );
}
