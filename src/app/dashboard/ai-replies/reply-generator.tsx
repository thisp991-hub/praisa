"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, Save } from "lucide-react";
import { generateReply } from "@/app/actions/ai-reply";
import { saveReply } from "@/app/actions/saved-replies";

export function ReplyGenerator({
  onReplySaved,
}: {
  onReplySaved: () => void;
}) {
  const [reviewText, setReviewText] = useState("");
  const [tone, setTone] = useState<"friendly" | "formal">("friendly");
  const [generatedReply, setGeneratedReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  async function handleGenerate() {
    setError("");
    setGeneratedReply("");
    setSaveMessage("");
    setLoading(true);

    const result = await generateReply(reviewText, tone);

    if (result.success && result.reply) {
      setGeneratedReply(result.reply);
    } else {
      setError(result.error ?? "Failed to generate reply");
    }

    setLoading(false);
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    setSaving(true);
    setSaveMessage("");

    const result = await saveReply({
      review_text: reviewText,
      reply_text: generatedReply,
      tone,
    });

    if (result.success) {
      setSaveMessage("Reply saved!");
      onReplySaved();
    } else {
      setSaveMessage(result.error ?? "Failed to save");
    }

    setSaving(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <label className="block text-sm font-medium text-gray-700">
          Customer Review
        </label>
        <textarea
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          placeholder="Paste the customer review here..."
          rows={4}
          className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">
            Tone
          </label>
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setTone("friendly")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tone === "friendly"
                  ? "bg-primary text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Friendly
            </button>
            <button
              type="button"
              onClick={() => setTone("formal")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                tone === "formal"
                  ? "bg-primary text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Formal
            </button>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !reviewText.trim()}
          className="mt-4 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating..." : "Generate Reply"}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {generatedReply && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-medium text-gray-700">
            Generated Reply
          </h3>
          <div className="mt-3 rounded-lg bg-gray-50 p-4 text-sm text-gray-800">
            {generatedReply}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Reply"}
            </button>

            {saveMessage && (
              <span
                className={`text-sm ${
                  saveMessage === "Reply saved!"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
