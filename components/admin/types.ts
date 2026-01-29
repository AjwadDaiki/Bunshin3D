export type AdminUserProfile = {
  id: string;
  email: string;
  credits: number;
  created_at: string;
  is_admin?: boolean;
  is_moderator?: boolean;
  is_banned?: boolean;
  last_sign_in?: string;
};

export type AdminStats = {
  revenue: number;
  users: number;
  models: number;
  arpu: string;
  conversion: string;
  burn: string;
  errorRate?: string;
  todayUsers?: number;
  todayGenerations?: number;
};

