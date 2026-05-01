"use client";

import { useCallback, useState } from "react";
import { ReplyGenerator } from "./reply-generator";
import { SavedRepliesList } from "./saved-replies-list";
import { getSavedReplies } from "@/app/actions/saved-replies";
import type { SavedReply } from "@/lib/types";

export function AIRepliesClient({
  initialReplies,
}: {
  initialReplies: SavedReply[];
}) {
  const [replies, setReplies] = useState(initialReplies);

  const refreshReplies = useCallback(async () => {
    const updated = await getSavedReplies();
    setReplies(updated);
  }, []);

  return (
    <div className="space-y-8">
      <ReplyGenerator onReplySaved={refreshReplies} />

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Saved Replies</h2>
        <p className="mt-1 text-sm text-gray-500">
          Your previously generated and saved replies.
        </p>
        <div className="mt-4">
          <SavedRepliesList
            initialReplies={replies}
            onReplyDeleted={refreshReplies}
          />
        </div>
      </div>
    </div>
  );
}
