"use client";

import { useState } from "react";
import { Copy, Trash2, UserPlus } from "lucide-react";
import {
  addCustomer,
  updateCustomerStatus,
  deleteCustomer,
} from "@/app/actions/customers";
import type { Customer, CustomerStatus } from "@/lib/types";
import { CUSTOMER_STATUSES } from "@/lib/types";

const STATUS_LABELS: Record<CustomerStatus, string> = {
  not_requested: "Not Requested",
  requested: "Requested",
  feedback_received: "Feedback Received",
};

const STATUS_COLORS: Record<CustomerStatus, string> = {
  not_requested: "bg-gray-100 text-gray-700",
  requested: "bg-blue-100 text-blue-700",
  feedback_received: "bg-green-100 text-green-700",
};

export function CustomersClient({
  initialCustomers,
  businessName,
  businessSlug,
}: {
  initialCustomers: Customer[];
  businessName: string;
  businessSlug: string;
}) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Customer name is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const result = await addCustomer({
      name: name.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
    });

    setSaving(false);

    if (!result.success) {
      setError(result.error || "Something went wrong.");
      return;
    }

    if (result.customer) {
      setCustomers((prev) => [result.customer!, ...prev]);
    }

    setName("");
    setPhone("");
    setEmail("");
    setShowForm(false);
  }

  async function handleStatusChange(id: string, status: string) {
    const result = await updateCustomerStatus(id, status);
    if (result.success) {
      setCustomers((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c)),
      );
    }
  }

  async function handleDelete(id: string) {
    const result = await deleteCustomer(id);
    if (result.success) {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
    }
  }

  function handleCopyWhatsApp(customer: Customer) {
    const feedbackUrl = `${window.location.origin}/feedback/${businessSlug}`;
    const message = `Hi ${customer.name}, thank you for visiting ${businessName}! We'd love to hear your feedback. Please take a moment to share your experience: ${feedbackUrl}`;

    navigator.clipboard.writeText(message).then(() => {
      setCopiedId(customer.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {customers.length} customer{customers.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          <UserPlus className="h-4 w-4" />
          Add Customer
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 rounded-lg border border-gray-200 bg-white p-4 space-y-3"
        >
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="customerName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Customer name"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="customerPhone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="customerPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="+1 234 567 8900"
              />
            </div>
            <div>
              <label
                htmlFor="customerEmail"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email <span className="text-gray-400">(optional)</span>
              </label>
              <input
                id="customerEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="customer@email.com"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Customer"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {customers.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">No customers added yet.</p>
          <p className="mt-2 text-sm text-gray-400">
            Add customers to send them review requests via WhatsApp.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {customers.map((customer) => (
            <div
              key={customer.id}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{customer.name}</p>
                  <div className="mt-1 flex flex-wrap gap-3 text-xs text-gray-500">
                    {customer.phone && <span>{customer.phone}</span>}
                    {customer.email && <span>{customer.email}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={customer.status}
                    onChange={(e) =>
                      handleStatusChange(customer.id, e.target.value)
                    }
                    className={`rounded-md px-2 py-1 text-xs font-medium ${STATUS_COLORS[(customer.status as CustomerStatus) || "not_requested"]}`}
                  >
                    {CUSTOMER_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleCopyWhatsApp(customer)}
                    className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      copiedId === customer.id
                        ? "bg-green-100 text-green-700"
                        : "bg-green-50 text-green-600 hover:bg-green-100"
                    }`}
                    title="Copy WhatsApp review request message"
                  >
                    <Copy className="h-3 w-3" />
                    {copiedId === customer.id
                      ? "Copied!"
                      : "WhatsApp Message"}
                  </button>

                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500"
                    title="Delete customer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
