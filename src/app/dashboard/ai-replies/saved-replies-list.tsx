"use client";

import { useState } from "react";
import { Copy, Check, Trash2 } from "lucide-react";
import { deleteReply } from "@/app/actions/saved-replies";
import type { SavedReply } from "@/lib/types";

export function SavedRepliesList({
  replies,
  onReplyDeleted,
}: {
  replies: SavedReply[];
  onReplyDeleted: () => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleCopy(replyText: string, id: string) {
    await navigator.clipboard.writeText(replyText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteReply(id);

    if (result.success) {
      onReplyDeleted();
    }

    setDeletingId(null);
  }

  if (replies.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">No saved replies yet.</p>
        <p className="mt-2 text-sm text-gray-400">
          Generate a reply above and save it to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <div
          key={reply.id}
          className="rounded-lg border border-gray-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                  {reply.tone}
                </span>
                <time className="text-xs text-gray-400">
                  {new Date(reply.created_at).toLocaleDateString()}
                </time>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                <span className="font-medium">Review:</span>{" "}
                {reply.review_text.length > 120
                  ? reply.review_text.slice(0, 120) + "..."
                  : reply.review_text}
              </p>

              <div className="mt-2 rounded bg-gray-50 p-3 text-sm text-gray-800">
                {reply.reply_text}
              </div>
            </div>

            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => handleCopy(reply.reply_text, reply.id)}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                title="Copy reply"
              >
                {copiedId === reply.id ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleDelete(reply.id)}
                disabled={deletingId === reply.id}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                title="Delete reply"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
