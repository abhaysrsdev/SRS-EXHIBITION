const { execSync } = require('child_process');

const keysToPush = [
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'NEXT_PUBLIC_WHATSAPP_MESSAGE',
  'GOOGLE_SERVICE_ACCOUNT_EMAIL',
  'GOOGLE_PRIVATE_KEY'
];

for (const key of keysToPush) {
  let val = process.env[key];
  if (!val) continue;

  console.log(`Adding ${key}...`);

  try {
    const result = execSync(`npx vercel env add ${key} production`, {
      input: val,
      encoding: 'utf-8',
      shell: 'powershell.exe'
    });
    console.log(`Successfully added ${key}:`, result);
  } catch (err) {
    console.error(`Failed to add ${key}`);
    console.error(err.stdout);
    console.error(err.stderr);
  }
}
