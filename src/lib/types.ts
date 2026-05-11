export interface Feedback {
  id: string;
  business_slug: string;
  rating: number;
  feedback_text: string | null;
  name: string | null;
  email: string | null;
  category: string | null;
  status: string;
  internal_note: string | null;
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_slug: string;
  google_review_link: string | null;
  logo_url: string | null;
  subscription_status: string;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  paid_until: string | null;
  plan: string;
  created_at: string;
}

export interface AccessCode {
  id: string;
  code: string;
  client_name: string | null;
  is_used: boolean;
  used_by_email: string | null;
  used_by_user_id: string | null;
  expires_at: string | null;
  created_at: string;
  created_by: string | null;
}

export interface SavedReply {
  id: string;
  user_id: string;
  review_text: string;
  reply_text: string;
  tone: string;
  created_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  business_slug: string;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  created_at: string;
}

export const ISSUE_CATEGORIES = [
  "Long waiting time",
  "Staff behavior",
  "Pricing issue",
  "Service quality",
  "Cleanliness",
  "Other",
] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];

export const FEEDBACK_STATUSES = ["new", "contacted", "resolved"] as const;
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number];

export const CUSTOMER_STATUSES = [
  "not_requested",
  "requested",
  "feedback_received",
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];
