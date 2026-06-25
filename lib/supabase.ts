import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { ExhibitionLead, UploadedFile } from '@/types';

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      'Supabase env vars not set. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local'
    );
  }
  _client = createClient(url, key);
  return _client;
}

// Named export kept for convenience — throws at call time if not configured
export const supabase = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    return getClient()[prop as keyof SupabaseClient];
  },
});

// ─── Upload Files ────────────────────────────────────────────────────────────

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
