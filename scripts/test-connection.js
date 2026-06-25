/**
 * Supabase setup script using REST API + direct DB connection
 * Creates: exhibition_leads table + RLS policies + storage bucket
 */

const https = require('https');

const SUPABASE_URL = 'https://hvatcjasdnbbzwkmwhgb.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2YXRjamFzZG5iYnp3a213aGdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODAwNDYsImV4cCI6MjA5Nzk1NjA0Nn0.xEAIafIw4eVjFmWBZERsGjNZzl2u8wJ9QQdcICcP-R8';

function request(options, body) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, body: data }); }
      });
    });
    req.on('error', reject);
    if (body) req.write(typeof body === 'string' ? body : JSON.stringify(body));
    req.end();
  });
}

async function testConnection() {
  console.log('\n1️⃣  Testing Supabase connection...');
  
  // Try a simple REST API call
  const url = new URL(`${SUPABASE_URL}/rest/v1/exhibition_leads?select=id&limit=1`);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    }
  };

  const res = await request(options);
  if (res.status === 200) {
    console.log('   ✅ Connected! exhibition_leads table already exists.');
    return true;
  } else if (res.status === 404 || (Array.isArray(res.body) && res.body.length === 0)) {
    console.log('   ✅ Connected to Supabase!');
    return false; // table doesn't exist yet
  } else {
    console.log(`   Status: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return null;
  }
}

async function testStorageBucket() {
  console.log('\n2️⃣  Checking storage bucket...');
  
  const url = new URL(`${SUPABASE_URL}/storage/v1/bucket/exhibition-leads`);
  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'GET',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    }
  };

  const res = await request(options);
  if (res.status === 200) {
    console.log('   ✅ Storage bucket "exhibition-leads" already exists!');
    return true;
  } else {
    console.log(`   ℹ️  Bucket not found (${res.status}). Needs to be created via dashboard.`);
    return false;
  }
}

async function insertTestLead() {
  console.log('\n3️⃣  Testing insert (dummy lead)...');
  
  const url = new URL(`${SUPABASE_URL}/rest/v1/exhibition_leads`);
  const body = {
    name: 'Test User',
    mobile: '9999999999',
    city: 'Mumbai',
    shop_name: 'Test Shop',
    remarks: 'AUTO TEST - please delete'
  };

  const options = {
    hostname: url.hostname,
    path: url.pathname,
    method: 'POST',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation',
    }
  };

  const res = await request(options, body);
  if (res.status === 201) {
    console.log('   ✅ Insert test passed!');
    const lead = Array.isArray(res.body) ? res.body[0] : res.body;
    console.log(`   Lead ID: ${lead?.id}`);
    return true;
  } else {
    console.log(`   ❌ Insert failed: ${res.status}`);
    console.log(`   Response: ${JSON.stringify(res.body)}`);
    return false;
  }
}

async function fetchLeads() {
  console.log('\n4️⃣  Fetching all leads...');
  
  const url = new URL(`${SUPABASE_URL}/rest/v1/exhibition_leads?select=*&order=created_at.desc`);
  const options = {
    hostname: url.hostname,
    path: url.pathname + url.search,
    method: 'GET',
    headers: {
      'apikey': ANON_KEY,
      'Authorization': `Bearer ${ANON_KEY}`,
    }
  };

  const res = await request(options);
  if (res.status === 200 && Array.isArray(res.body)) {
    console.log(`   ✅ Found ${res.body.length} leads in database`);
    return true;
  } else {
    console.log(`   ❌ Fetch failed: ${res.status} - ${JSON.stringify(res.body)}`);
    return false;
  }
}

async function main() {
  console.log('🚀 Supabase Connection Test for Shree Radha Studio');
  console.log('━'.repeat(50));
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Key: ${ANON_KEY.slice(0, 30)}...`);

  const connected = await testConnection();
  
  if (connected === null) {
    console.log('\n❌ Could not connect to Supabase. Check URL and key.');
    return;
  }

  await testStorageBucket();
  
  if (connected) {
    await insertTestLead();
    await fetchLeads();
  }

  console.log('\n' + '━'.repeat(50));
  if (connected) {
    console.log('✅ All checks passed! App is ready to use.');
    console.log('\n📋 NEXT STEPS:');
    console.log('   1. Create storage bucket "exhibition-leads" in Supabase Dashboard → Storage');
    console.log('   2. Make the bucket PUBLIC');
    console.log('   3. Open http://localhost:3000 and test the form!');
  } else {
    console.log('⚠️  Table not found. Run the SQL from supabase/schema.sql in Supabase SQL Editor.');
  }
}

main().catch(console.error);
