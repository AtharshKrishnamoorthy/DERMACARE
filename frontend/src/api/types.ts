// ── User ─────────────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  skin_type: string | null;
  known_conditions: string | null;
  allergies: string | null;
  created_at: string;
};

export type CreateUserBody = {
  name: string;
  email: string;
  phone: string;
  password: string;
  user_id?: string;
};

export type UpdateUserBody = {
  name?: string;
  email?: string;
  phone?: string;
};

// ── Chat ─────────────────────────────────────────────────────────────────────

export type Chat = {
  id: string;
  user_id: string;
  message: string;
  response: string | null;
  created_at: string;
};

export type AddChatBody = {
  user_id: string;
  message: string;
  response?: string;
};

export type UpdateChatBody = {
  message?: string;
  response?: string;
};

// ── Identification ───────────────────────────────────────────────────────────

export type Identification = {
  id: string;
  user_id: string;
  image_url: string | null;
  predicted_disease: string | null;
  model_response: string | null;
  created_at: string;
};

export type AddIdentificationBody = {
  user_id: string;
  image_url: string;
  predicted_disease: string;
  model_response?: string;
};

// ── Report ───────────────────────────────────────────────────────────────────

export type Report = {
  id: string;
  user_id: string;
  file_url: string | null;
  file_type: string | null;
  analysis: string | null;
  created_at: string;
};

export type AddReportBody = {
  user_id: string;
  file_url: string;
  file_type: string;
  analysis?: string;
};

// ── Symptom ──────────────────────────────────────────────────────────────────

export type Symptom = {
  id: string;
  user_id: string;
  description: string;
  logged_at: string;
};

export type AddSymptomBody = {
  user_id: string;
  description: string;
};

// ── Settings ─────────────────────────────────────────────────────────────────

export type Settings = {
  id: string;
  user_id: string;
  theme: string;
  notifications_enabled: boolean;
  email_updates: boolean;
  language: string;
  account_deleted: boolean;
  updated_at: string;
};

export type UpdateSettingsBody = {
  theme?: string;
  notifications_enabled?: boolean;
  email_updates?: boolean;
  language?: string;
  account_deleted?: boolean;
};

// ── Auth ────────────────────────────────────────────────────────────────────

export type SigninBody = {
  email: string;
  password: string;
};

export type SigninResponse = {
  access_token: string;
  token_type: string;
};

export type SignupBody = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type SignupResponse = {
  id: string;
  email: string;
};

// ── AI Chat ──────────────────────────────────────────────────────────────────

export type AiChatRequest = {
  user_id: string;
  query: string;
};

export type AiChatResponse = {
  response: string;
};

// ── AI Identification ────────────────────────────────────────────────────────

export type PredictResponse = {
  predicted_disease: string;
};

export type PredictDescribeResponse = {
  predicted_disease: string;
  description: string;
};

// ── AI Report ────────────────────────────────────────────────────────────────

export type ReportAnalysisResponse = {
  response: Record<string, unknown>;
};
