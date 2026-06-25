const { Client } = require('pg');
const fs = require('fs');

const DATABASE_URL = "postgresql://postgres.kosjaeupqasimmtqefnp:Abhay%40332145@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres";

const schema = `
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create exhibition_leads table
CREATE TABLE IF NOT EXISTS public.exhibition_leads (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT          NOT NULL,
  mobile            TEXT          NOT NULL,
  city              TEXT          NOT NULL,
  state             TEXT,
  shop_name         TEXT          NOT NULL,
  business_type     TEXT          CHECK (business_type IN ('Wholesaler', 'Retailer', 'Distributor', 'Other')),
  product_code      TEXT,
  sales_order_code  TEXT,
  remarks           TEXT,
  uploaded_files    JSONB,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_name ON public.exhibition_leads USING btree (name);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_mobile ON public.exhibition_leads USING btree (mobile);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_created_at ON public.exhibition_leads USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_business_type ON public.exhibition_leads USING btree (business_type);

-- Enable RLS
ALTER TABLE public.exhibition_leads ENABLE ROW LEVEL SECURITY;

-- RLS Policies (drop if exists first to avoid conflicts)
DROP POLICY IF EXISTS "Allow public insert" ON public.exhibition_leads;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.exhibition_leads;
DROP POLICY IF EXISTS "Allow anon read" ON public.exhibition_leads;

CREATE POLICY "Allow public insert" ON public.exhibition_leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow authenticated read" ON public.exhibition_leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow anon read" ON public.exhibition_leads
  FOR SELECT TO anon USING (true);
`;

async function run() {
  const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected! Running schema...');
    await client.query(schema);
    console.log('Schema created successfully!');
    
    // Verify table exists
    const result = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'exhibition_leads' 
      ORDER BY ordinal_position;
    `);
    console.log('\nexhibition_leads table columns:');
    result.rows.forEach(row => console.log(` - ${row.column_name} (${row.data_type})`));
    console.log('\nDone!');
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
