"use client";

import { useState } from "react";
import { saveBusinessProfile } from "@/app/actions/business";
import { generateSlug } from "@/lib/utils";

function friendlyError(raw: string | undefined): string {
  if (!raw) return "Something went wrong. Please try again.";
  const lower = raw.toLowerCase();
  if (
    lower.includes("unique") ||
    lower.includes("duplicate") ||
    lower.includes("business_slug") ||
    lower.includes("already exists")
  ) {
    return "This business name is already used. Please choose a slightly different name.";
  }
  if (lower.includes("not authorized") || lower.includes("not authenticated")) {
    return "You need to be logged in to save settings. Please refresh and try again.";
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "Could not connect to the server. Please check your internet connection and try again.";
  }
  return "Something went wrong. Please try again.";
}

interface SettingsFormProps {
  initialName: string;
  initialGoogleLink: string;
  currentSlug: string | null;
}

export function SettingsForm({
  initialName,
  initialGoogleLink,
  currentSlug,
}: SettingsFormProps) {
  const [businessName, setBusinessName] = useState(initialName);
  const [googleReviewLink, setGoogleReviewLink] = useState(initialGoogleLink);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const previewSlug = businessName ? generateSlug(businessName) : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!businessName.trim()) {
      setMessage({ type: "error", text: "Business name is required." });
      return;
    }

    setSaving(true);
    setMessage(null);

    const result = await saveBusinessProfile({
      business_name: businessName.trim(),
      google_review_link: googleReviewLink.trim(),
    });

    setSaving(false);

    if (result.success) {
      setMessage({ type: "success", text: "Settings saved successfully!" });
    } else {
      setMessage({
        type: "error",
        text: friendlyError(result.error),
      });
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-xl space-y-6 rounded-lg border border-gray-200 bg-white p-6"
    >
      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label
          htmlFor="businessName"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Business Name <span className="text-red-500">*</span>
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="e.g. Ali Dental Clinic"
        />
        {previewSlug && (
          <p className="mt-1 text-xs text-gray-500">
            Feedback URL: /feedback/<span className="font-mono">{previewSlug}</span>
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="googleReviewLink"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Google Review Link{" "}
          <span className="text-gray-400">(optional)</span>
        </label>
        <input
          id="googleReviewLink"
          type="url"
          value={googleReviewLink}
          onChange={(e) => setGoogleReviewLink(e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="https://g.page/r/..."
        />
        <p className="mt-1 text-xs text-gray-500">
          Customers who rate 4-5 stars will be redirected here.
        </p>
      </div>

      {currentSlug && (
        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm font-medium text-gray-700">Current Slug</p>
          <p className="mt-1 font-mono text-sm text-gray-900">{currentSlug}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Settings"}
      </button>
    </form>
  );
}
