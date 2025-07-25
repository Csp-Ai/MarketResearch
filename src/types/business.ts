export interface UserBusiness {
  id: string;
  user_id: string;
  business_name: string;
  website_url: string;
  analysis_data?: any;
  description?: string;
  industry?: string;
  services?: string;
  contact_info?: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProfile {
  id: string;
  name: string;
  website: string;
  industry?: string;
  description?: string;
  contact_email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  last_analysis?: string;
} 