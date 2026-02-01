import { google } from 'googleapis';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Format data as row
    const timestamp = new Date().toLocaleString('cs-CZ', {
      dateStyle: 'short',
      timeStyle: 'medium'
    });

    const row = [
      timestamp,
      formData['service-package'] || '',
      formData['first-name'] || '',
      formData['last-name'] || '',
      formData['address'] || '',
      formData['email'] || '',
      formData['phone'] || '',
      formData['nationality'] || '',
      formData['ico'] || '',
      formData['dic'] || '',
      formData['tax-office'] || '',
      formData['health-insurance'] || '',
      formData['social-security-symbol'] || '',
      formData['activity-type'] || '',
      formData['secondary-reason'] || '',
      formData['taxable-income'] || '',
      formData['other-income'] || '',
      Array.isArray(formData['tax-deductions']) ? formData['tax-deductions'].join(', ') : '',
      Array.isArray(formData['child-benefits']) ? formData['child-benefits'].join(', ') : '',
      Array.isArray(formData['deductible-expenses']) ? formData['deductible-expenses'].join(', ') : '',
      Array.isArray(formData['pohoda-confirmations']) ? formData['pohoda-confirmations'].join(', ') : '',
      formData['filing-method'] || '',
      formData['data-box-id'] || '',
      formData['gdpr-consent'] === 'on' ? 'Ano' : 'Ne'
    ];

    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'A:X', // Columns A through X (24 columns)
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    });

    console.log('✅ Form submission saved to Google Sheets');

    return res.status(200).json({
      success: true,
      message: 'Form submitted successfully!',
    });

  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to save submission',
      details: error.message
    });
  }
}
