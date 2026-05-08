"use client";

import { useState } from "react";
import { Star, AlertTriangle, MessageSquare, StickyNote } from "lucide-react";
import {
  updateFeedbackStatus,
  updateFeedbackNote,
} from "@/app/actions/feedback";
import type { Feedback, FeedbackStatus } from "@/lib/types";
import { FEEDBACK_STATUSES } from "@/lib/types";

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: "New",
  contacted: "Contacted",
  resolved: "Resolved",
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  new: "bg-red-100 text-red-700",
  contacted: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
};

export function FeedbackList({
  initialFeedbacks,
}: {
  initialFeedbacks: Feedback[];
}) {
  const [feedbacks, setFeedbacks] = useState(initialFeedbacks);
  const [filter, setFilter] = useState<"all" | "positive" | "private">("all");
  const [expandedNote, setExpandedNote] = useState<string | null>(null);

  const filtered = feedbacks.filter((f) => {
    if (filter === "positive") return f.rating >= 4;
    if (filter === "private") return f.rating <= 3;
    return true;
  });

  async function handleStatusChange(id: string, status: string) {
    const result = await updateFeedbackStatus(id, status);
    if (result.success) {
      setFeedbacks((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status } : f)),
      );
    }
  }

  async function handleNoteSave(id: string, note: string) {
    const result = await updateFeedbackNote(id, note);
    if (result.success) {
      setFeedbacks((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, internal_note: note || null } : f,
        ),
      );
      setExpandedNote(null);
    }
  }

  return (
    <div>
      <div className="mb-4 flex gap-2">
        {(["all", "positive", "private"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "positive"
                ? "Positive (4-5)"
                : "Private (1-3)"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No feedback in this category.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((feedback) => (
            <FeedbackCard
              key={feedback.id}
              feedback={feedback}
              expandedNote={expandedNote}
              onToggleNote={setExpandedNote}
              onStatusChange={handleStatusChange}
              onNoteSave={handleNoteSave}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FeedbackCard({
  feedback,
  expandedNote,
  onToggleNote,
  onStatusChange,
  onNoteSave,
}: {
  feedback: Feedback;
  expandedNote: string | null;
  onToggleNote: (id: string | null) => void;
  onStatusChange: (id: string, status: string) => void;
  onNoteSave: (id: string, note: string) => void;
}) {
  const [noteText, setNoteText] = useState(feedback.internal_note || "");
  const isPrivate = feedback.rating <= 3;
  const isExpanded = expandedNote === feedback.id;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
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
          {isPrivate && (
            <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
              <AlertTriangle className="h-3 w-3" />
              Needs Attention
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isPrivate && (
            <select
              value={feedback.status}
              onChange={(e) => onStatusChange(feedback.id, e.target.value)}
              className={`rounded-md px-2 py-1 text-xs font-medium ${STATUS_COLORS[(feedback.status as FeedbackStatus) || "new"]}`}
            >
              {FEEDBACK_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          )}
          <time className="text-xs text-gray-400">
            {new Date(feedback.created_at).toLocaleDateString()}
          </time>
        </div>
      </div>

      {feedback.category && (
        <div className="mt-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
            <MessageSquare className="h-3 w-3" />
            {feedback.category}
          </span>
        </div>
      )}

      {feedback.feedback_text && (
        <p className="mt-2 text-sm text-gray-700">{feedback.feedback_text}</p>
      )}

      {(feedback.name || feedback.email) && (
        <div className="mt-2 flex gap-3 text-xs text-gray-500">
          {feedback.name && <span>{feedback.name}</span>}
          {feedback.email && <span>{feedback.email}</span>}
        </div>
      )}

      {/* Internal Note (private feedback only) */}
      {isPrivate && (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <button
            onClick={() => onToggleNote(isExpanded ? null : feedback.id)}
            className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            <StickyNote className="h-3 w-3" />
            {feedback.internal_note ? "View/Edit Note" : "Add Note"}
          </button>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-xs focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Internal note (only visible to you)..."
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onNoteSave(feedback.id, noteText)}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary-dark"
                >
                  Save Note
                </button>
                <button
                  onClick={() => {
                    setNoteText(feedback.internal_note || "");
                    onToggleNote(null);
                  }}
                  className="rounded-md bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isExpanded && feedback.internal_note && (
            <p className="mt-1 text-xs text-gray-400 italic">
              {feedback.internal_note}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
