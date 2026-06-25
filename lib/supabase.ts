import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ExhibitionLead, UploadedFile } from '@/types';

// Hardcoded fallbacks ensure mobile browsers never get undefined values.
// NEXT_PUBLIC_ vars are injected at build/compile time by Next.js.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://hvatcjasdnbbzwkmwhgb.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2YXRjamFzZG5iYnp3a213aGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODAwNDYsImV4cCI6MjA5Nzk1NjA0Nn0.xEAIafIw4eVjFmWBZERsGjNZzl2u8wJ9QQdcICcP-R8';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}

export const supabase = getClient;

// ─── Upload File ─────────────────────────────────────────────────────────────

export async function uploadFile(
  file: File,
  category: string,
  leadId: string
): Promise<UploadedFile> {
  const client = getClient();
  const ext = file.name.split('.').pop();
  const fileName = `${leadId}/${category}_${Date.now()}.${ext}`;

  const { error } = await client.storage
    .from('exhibition-leads')
    .upload(fileName, file, { upsert: false, contentType: file.type });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data: urlData } = client.storage
    .from('exhibition-leads')
    .getPublicUrl(fileName);

  return {
    name: file.name,
    url: urlData.publicUrl,
    type: file.type,
    size: file.size,
    category: category as UploadedFile['category'],
  };
}

// ─── Insert Lead ─────────────────────────────────────────────────────────────

export async function insertLead(
  data: Omit<ExhibitionLead, 'id' | 'created_at'>
): Promise<ExhibitionLead> {
  const { data: lead, error } = await getClient()
    .from('exhibition_leads')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(`Insert failed: ${error.message}`);
  return lead as ExhibitionLead;
}

// ─── Fetch All Leads (Admin) ─────────────────────────────────────────────────

export async function fetchAllLeads(): Promise<ExhibitionLead[]> {
  const { data, error } = await getClient()
    .from('exhibition_leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Fetch failed: ${error.message}`);
  return (data ?? []) as ExhibitionLead[];
}

// ─── Search Leads ────────────────────────────────────────────────────────────

export async function searchLeads(query: string): Promise<ExhibitionLead[]> {
  const { data, error } = await getClient()
    .from('exhibition_leads')
    .select('*')
    .or(`name.ilike.%${query}%,mobile.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Search failed: ${error.message}`);
  return (data ?? []) as ExhibitionLead[];
}
