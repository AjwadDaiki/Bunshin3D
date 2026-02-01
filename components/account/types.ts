export type Generation = {
  id: string;
  user_id: string;
  status: string;
  mode?: string;
  type?: string;
  source_image_url?: string;
  model_glb_url?: string;
  model_storage_path?: string;
  created_at: string;
  expires_at?: string;
  prediction_id?: string;
};

export type AccountUser = {
  id: string;
  email: string;
  created_at: string;
};

export type AccountProfile = {
  email?: string;
  credits?: number;
  referral_code?: string;
  referral_credits?: number;
};
