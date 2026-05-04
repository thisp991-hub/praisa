export interface Feedback {
  id: string;
  business_slug: string;
  rating: number;
  feedback_text: string | null;
  name: string | null;
  email: string | null;
  created_at: string;
}

export interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_slug: string;
  google_review_link: string | null;
  created_at: string;
}

export interface SavedReply {
  id: string;
  user_id: string;
  review_text: string;
  reply_text: string;
  tone: string;
  created_at: string;
}
