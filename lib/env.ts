import { z } from 'zod';

const envSchema = z.object({
  PUBLIC_SITE_URL: z.string().url(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  VITE_SCRAPER_API_BASE_URL: z.string().url(),
  OPENAI_API_KEY: z.string().min(1),
  LEAD_WEBHOOK_URL: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    'Missing required environment variables:',
    parsed.error.flatten().fieldErrors
  );
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
