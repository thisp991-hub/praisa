"use client";

import { useState } from "react";
import {
  updateSubscriptionStatus,
  extendTrial,
  activateForDays,
  updatePaidUntil,
  updatePlan,
} from "@/app/actions/subscription";
import {
  createAccessCode,
  deleteAccessCode,
} from "@/app/actions/access-codes";
import type { BusinessProfile, AccessCode } from "@/lib/types";
import {
  Users,
  Key,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
  Copy,
} from "lucide-react";

interface AdminClientProps {
  initialProfiles: BusinessProfile[];
  initialAccessCodes: AccessCode[];
}

export function AdminClient({
  initialProfiles,
  initialAccessCodes,
}: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"clients" | "codes">("clients");

  return (
    <div className="mt-6">
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("clients")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === "clients"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Users className="h-4 w-4" />
          Client Businesses
        </button>
        <button
          onClick={() => setActiveTab("codes")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            activeTab === "codes"
              ? "border-b-2 border-primary text-primary"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <Key className="h-4 w-4" />
          Access Codes
        </button>
      </div>

      {activeTab === "clients" ? (
        <ClientsTable initialProfiles={initialProfiles} />
      ) : (
        <AccessCodesTable initialCodes={initialAccessCodes} />
      )}
    </div>
  );
}

function ClientsTable({
  initialProfiles,
}: {
  initialProfiles: BusinessProfile[];
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusChange(profileId: string, status: string) {
    setLoading(profileId);
    setError(null);
    const result = await updateSubscriptionStatus(profileId, status);
    if (!result.success) {
      setError(result.error || "Failed to update status");
    } else {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId ? { ...p, subscription_status: status } : p,
        ),
      );
    }
    setLoading(null);
  }

  async function handleExtendTrial(profileId: string) {
    setLoading(profileId);
    setError(null);
    const result = await extendTrial(profileId, 7);
    if (!result.success) {
      setError(result.error || "Failed to extend trial");
    } else {
      const newEnd = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? {
                ...p,
                subscription_status: "trial",
                trial_ends_at: newEnd.toISOString(),
              }
            : p,
        ),
      );
    }
    setLoading(null);
  }

  async function handleActivate30(profileId: string) {
    setLoading(profileId);
    setError(null);
    const result = await activateForDays(profileId, 30);
    if (!result.success) {
      setError(result.error || "Failed to activate");
    } else {
      const paidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? {
                ...p,
                subscription_status: "active",
                paid_until: paidUntil.toISOString(),
              }
            : p,
        ),
      );
    }
    setLoading(null);
  }

  async function handleUpdatePaidUntil(profileId: string, date: string) {
    setLoading(profileId);
    setError(null);
    const result = await updatePaidUntil(profileId, date);
    if (!result.success) {
      setError(result.error || "Failed to update");
    } else {
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === profileId
            ? { ...p, paid_until: date || null }
            : p,
        ),
      );
    }
    setLoading(null);
  }

  async function handleUpdatePlan(profileId: string, plan: string) {
    setLoading(profileId);
    setError(null);
    const result = await updatePlan(profileId, plan);
    if (!result.success) {
      setError(result.error || "Failed to update plan");
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.id === profileId ? { ...p, plan } : p)),
      );
    }
    setLoading(null);
  }

  return (
    <div className="mt-6 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {profiles.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          No client businesses registered yet.
        </div>
      ) : (
        profiles.map((profile) => {
          const isExpanded = expandedId === profile.id;
          const isLoading = loading === profile.id;

          return (
            <div
              key={profile.id}
              className="rounded-lg border border-gray-200 bg-white"
            >
              <button
                onClick={() =>
                  setExpandedId(isExpanded ? null : profile.id)
                }
                className="flex w-full items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {profile.business_name || "No business name"}
                    </p>
                    <p className="text-xs text-gray-500">
                      /{profile.business_slug || "—"}
                    </p>
                  </div>
                  <StatusBadge status={profile.subscription_status} />
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 p-4">
                  <div className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <span className="text-gray-500">Owner ID:</span>{" "}
                      <span className="font-mono text-xs text-gray-700">
                        {profile.user_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>{" "}
                      <span className="font-medium">
                        {profile.subscription_status}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Plan:</span>{" "}
                      <span className="font-medium">{profile.plan}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Trial ends:</span>{" "}
                      <span>
                        {profile.trial_ends_at
                          ? new Date(profile.trial_ends_at).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Paid until:</span>{" "}
                      <span>
                        {profile.paid_until
                          ? new Date(profile.paid_until).toLocaleDateString()
                          : "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>{" "}
                      <span>
                        {new Date(profile.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        handleStatusChange(profile.id, "trial")
                      }
                      disabled={isLoading}
                      className="rounded-md bg-blue-100 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                    >
                      Set Trial
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(profile.id, "active")
                      }
                      disabled={isLoading}
                      className="rounded-md bg-green-100 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-200 disabled:opacity-50"
                    >
                      Set Active
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(profile.id, "expired")
                      }
                      disabled={isLoading}
                      className="rounded-md bg-red-100 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-200 disabled:opacity-50"
                    >
                      Set Expired
                    </button>
                    <button
                      onClick={() => handleExtendTrial(profile.id)}
                      disabled={isLoading}
                      className="rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                    >
                      +7 Days Trial
                    </button>
                    <button
                      onClick={() => handleActivate30(profile.id)}
                      disabled={isLoading}
                      className="rounded-md bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 disabled:opacity-50"
                    >
                      Activate 30 Days
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="text-xs text-gray-500">
                      Paid until:
                    </label>
                    <input
                      type="date"
                      defaultValue={
                        profile.paid_until
                          ? profile.paid_until.split("T")[0]
                          : ""
                      }
                      onBlur={(e) =>
                        handleUpdatePaidUntil(profile.id, e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                    />

                    <label className="text-xs text-gray-500">Plan:</label>
                    <select
                      defaultValue={profile.plan}
                      onChange={(e) =>
                        handleUpdatePlan(profile.id, e.target.value)
                      }
                      className="rounded-md border border-gray-300 px-2 py-1 text-xs"
                    >
                      <option value="starter">Starter</option>
                      <option value="pro">Pro</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    trial: "bg-blue-100 text-blue-700",
    active: "bg-green-100 text-green-700",
    expired: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status}
    </span>
  );
}

function AccessCodesTable({
  initialCodes,
}: {
  initialCodes: AccessCode[];
}) {
  const [codes, setCodes] = useState(initialCodes);
  const [showForm, setShowForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [clientName, setClientName] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  function generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "PR-";
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!newCode.trim()) {
      setFormError("Access code is required.");
      return;
    }

    setFormLoading(true);
    const result = await createAccessCode({
      code: newCode.trim(),
      client_name: clientName.trim() || undefined,
      expires_at: expiresAt || undefined,
    });

    if (!result.success) {
      setFormError(result.error || "Failed to create code");
      setFormLoading(false);
      return;
    }

    setCodes((prev) => [
      {
        id: crypto.randomUUID(),
        code: newCode.trim(),
        client_name: clientName.trim() || null,
        is_used: false,
        used_by_email: null,
        used_by_user_id: null,
        expires_at: expiresAt || null,
        created_at: new Date().toISOString(),
        created_by: null,
      },
      ...prev,
    ]);

    setNewCode("");
    setClientName("");
    setExpiresAt("");
    setShowForm(false);
    setFormLoading(false);
  }

  async function handleDelete(codeId: string) {
    const result = await deleteAccessCode(codeId);
    if (result.success) {
      setCodes((prev) => prev.filter((c) => c.id !== codeId));
    }
  }

  async function handleCopy(code: string, id: string) {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {codes.length} access code{codes.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) setNewCode(generateCode());
          }}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" />
          Create Code
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreate}
          className="rounded-lg border border-gray-200 bg-white p-4 space-y-3"
        >
          {formError && (
            <div className="rounded-md bg-red-50 p-2 text-xs text-red-600">
              {formError}
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Code
              </label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                  placeholder="PR-XXXX"
                />
                <button
                  type="button"
                  onClick={() => setNewCode(generateCode())}
                  className="rounded-md border border-gray-300 px-2 text-xs text-gray-500 hover:bg-gray-50"
                >
                  Random
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Client Name (optional)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
                placeholder="Client name"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">
                Expires (optional)
              </label>
              <input
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={formLoading}
              className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {formLoading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {codes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-500">
          No access codes created yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600">Code</th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Client
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Used By
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Expires
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Created
                </th>
                <th className="px-4 py-3 font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {codes.map((code) => (
                <tr key={code.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs font-medium">
                        {code.code}
                      </span>
                      <button
                        onClick={() => handleCopy(code.code, code.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy code"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                      {copiedId === code.id && (
                        <span className="text-xs text-green-600">Copied!</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {code.client_name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        code.is_used
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {code.is_used ? "Used" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {code.used_by_email || "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {code.expires_at
                      ? new Date(code.expires_at).toLocaleDateString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {new Date(code.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(code.id)}
                      className="text-red-400 hover:text-red-600"
                      title="Delete code"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
