const { Client } = require('pg');

// Try multiple connection options for project hvatcjasdnbbzwkmwhgb
const PROJECT_REF = 'hvatcjasdnbbzwkmwhgb';
const PASSWORD = 'Abhay%40332145'; // Try same password as other project

const connections = [
  `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-1-ap-northeast-1.pooler.supabase.com:5432/postgres`,
  `postgresql://postgres.${PROJECT_REF}:${PASSWORD}@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres`,
];

const schema = `
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.exhibition_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT,
  shop_name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('Wholesaler', 'Retailer', 'Distributor', 'Other')),
  product_code TEXT,
  sales_order_code TEXT,
  remarks TEXT,
  uploaded_files JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exhibition_leads_name ON public.exhibition_leads USING btree (name);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_mobile ON public.exhibition_leads USING btree (mobile);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_created_at ON public.exhibition_leads USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_exhibition_leads_business_type ON public.exhibition_leads USING btree (business_type);

ALTER TABLE public.exhibition_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert" ON public.exhibition_leads;
DROP POLICY IF EXISTS "Allow authenticated read" ON public.exhibition_leads;
DROP POLICY IF EXISTS "Allow anon read" ON public.exhibition_leads;

CREATE POLICY "Allow public insert" ON public.exhibition_leads FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow authenticated read" ON public.exhibition_leads FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow anon read" ON public.exhibition_leads FOR SELECT TO anon USING (true);
`;

async function tryConnect(url) {
  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  try {
    await client.connect();
    return client;
  } catch (e) {
    return null;
  }
}

async function main() {
  console.log(`🔌 Trying to connect to project: ${PROJECT_REF}`);

  let client = null;
  for (const url of connections) {
    const region = url.split('@')[1].split('.pooler')[0];
    process.stdout.write(`   Trying ${region}... `);
    client = await tryConnect(url);
    if (client) { console.log('✅ Connected!'); break; }
    else console.log('❌');
  }

  if (!client) {
    console.log('\n❌ Could not connect with same password.');
    console.log('\n📋 Please do this manually in Supabase Dashboard:');
    console.log('   1. Go to: https://supabase.com/dashboard/project/hvatcjasdnbbzwkmwhgb/sql/new');
    console.log('   2. Paste the SQL from: supabase/schema.sql');
    console.log('   3. Click Run');
    console.log('   4. Go to Storage → New bucket → "exhibition-leads" → Make Public');
    return;
  }

  try {
    console.log('\n📊 Creating schema...');
    await client.query(schema);
    console.log('✅ Schema created!');

    const result = await client.query(`
      SELECT column_name FROM information_schema.columns 
      WHERE table_name = 'exhibition_leads' ORDER BY ordinal_position;
    `);
    console.log(`   Columns: ${result.rows.map(r => r.column_name).join(', ')}`);

    console.log('\n✅ Database setup complete!');
  } catch (err) {
    console.error('❌ Schema error:', err.message);
  } finally {
    await client.end();
  }
}

main().catch(console.error);
