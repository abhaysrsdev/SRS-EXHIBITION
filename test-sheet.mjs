import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SPREADSHEET_ID = '18nfrZNdy6rUtjIU7TyzMdnI5MWqkp3oaJH8RT-6M3pE';

async function test() {
  try {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!email || !key) {
      console.log('Missing credentials in .env.local');
      process.exit(1);
    }

    const serviceAccountAuth = new JWT({
      email: email,
      key: key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    console.log('SUCCESS! Connected to sheet:', doc.title);
  } catch (err) {
    console.error('ERROR connecting to sheet:', err.message);
  }
}

test();
