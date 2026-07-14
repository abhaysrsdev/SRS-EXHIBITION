import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { insertLead } from '@/lib/supabase';

// The ID from the URL the user provided
const SPREADSHEET_ID = '18nfrZNdy6rUtjIU7TyzMdnI5MWqkp3oaJH8RT-6M3pE';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // 1. First, insert into Supabase Database
    try {
      await insertLead({
        name:           data.name,
        mobile:         data.mobile,
        city:           data.city,
        state:          null,
        shop_name:      data.shop_name,
        business_type:  null,
        product_code:   null,
        sales_order_code: null,
        remarks:        null,
        gst_number:     data.gst_number || null,
        uploaded_files: data.uploaded_files || null,
        upload_destination: data.upload_destination || null,
      });
    } catch (dbError: any) {
      console.error('Supabase DB insert failed inside API:', dbError);
      // If database fails, we might want to return an error, but for now we continue
      // to Google Sheets so at least one system has the data, or we can fail.
      // Let's fail the whole request so the user retries.
      return NextResponse.json({ success: false, error: 'Database insert failed' }, { status: 500 });
    }

    
    // Ensure credentials exist
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!email || !key) {
      console.warn('Google Sheets integration skipped: Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_PRIVATE_KEY in environment variables.');
      return NextResponse.json({ success: false, message: 'Google Sheets credentials not configured.' }, { status: 500 });
    }

    const serviceAccountAuth = new JWT({
      email: email,
      key: key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);

    // Implementation of a retry mechanism with exponential backoff
    const MAX_RETRIES = 3;
    let attempt = 0;
    
    while (attempt < MAX_RETRIES) {
      try {
        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        // Ensure headers exist (if sheet is completely empty, we need to set them)
        // If the sheet has no header row, loadHeaderRow() might throw an error or rows might not load.
        try {
          await sheet.loadHeaderRow();
        } catch (e) {
          // If loading header fails, it's likely empty. Let's set the headers.
          await sheet.setHeaderRow([
            'Timestamp',
            'Business / Boutique Name',
            'Contact Person Name',
            'Mobile Number',
            'City',
            'GST Number',
            'Visiting Card File URL',
            'Front Image URL',
            'Back Image URL',
            'Upload Timestamp',
            'Upload Destination',
            'Lead Source',
            'Lead Status'
          ]);
        }

        let frontUrl = '';
        let backUrl = '';
        if (data.uploaded_files && Array.isArray(data.uploaded_files)) {
          const front = data.uploaded_files.find((f: any) => f.category === 'front_card' || f.category === 'visiting_card');
          if (front) frontUrl = front.url;
          const back = data.uploaded_files.find((f: any) => f.category === 'back_card');
          if (back) backUrl = back.url;
        }

        const destLabel: Record<string, string> = {
          SRS: 'Shree Radha Studio',
          RADHIKA: 'Radhika Collection',
          BOTH: 'Both',
        };

        const hasTimestamp2 = sheet.headerValues.includes('Timestamp2');
        const rowData = {
          [hasTimestamp2 ? 'Timestamp2' : 'Timestamp']: data.timestamp || new Date().toLocaleString(),
          'Business / Boutique Name': data.shop_name || '',
          'Contact Person Name': data.name || '',
          'Mobile Number': data.mobile,
          'City': data.city || '',
          'GST Number': data.gst_number || '',
          'Visiting Card File URL': frontUrl || '',
          'Front Image URL': frontUrl,
          'Back Image URL': backUrl,
          'Upload Timestamp': data.timestamp || new Date().toLocaleString(),
          'Upload Destination': destLabel[data.upload_destination] || data.upload_destination || '',
          'Lead Source': data.lead_source || 'Website Registration',
          'Lead Status': data.lead_status || 'New Lead'
        };

        // Always append a new row, exactly mirroring the database insert behavior
        await sheet.addRow(rowData);

        return NextResponse.json({ success: true });
        
      } catch (err: any) {
        attempt++;
        console.error(`Google Sheets Sync Attempt ${attempt} failed:`, err.message);
        if (attempt >= MAX_RETRIES) {
          throw err;
        }
        // Wait before retrying (exponential backoff)
        await new Promise(res => setTimeout(res, 1000 * Math.pow(2, attempt)));
      }
    }

  } catch (error: any) {
    console.error('Failed to sync with Google Sheets after all retries:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
