import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const formData = req.body;

        // Format the email content
        const emailContent = formatEmailContent(formData);

        // Send email using Resend
        const data = await resend.emails.send({
            from: 'DaněNula.cz <onboarding@resend.dev>', // You'll need to update this with your verified domain
            to: [process.env.NOTIFICATION_EMAIL || 'your-email@example.com'],
            subject: `Nová objednávka: ${formData['service-package']} - ${formData['first-name']} ${formData['last-name']}`,
            html: emailContent,
        });

        console.log('Email sent successfully:', data);

        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully!',
            emailId: data.id
        });

    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to send email',
            details: error.message
        });
    }
}

function formatEmailContent(data) {
    const timestamp = new Date().toLocaleString('cs-CZ', {
        dateStyle: 'full',
        timeStyle: 'long'
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .header h1 {
          margin: 0;
          font-size: 24px;
        }
        .header p {
          margin: 10px 0 0 0;
          opacity: 0.9;
        }
        .section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 20px;
        }
        .section h2 {
          color: #667eea;
          margin-top: 0;
          font-size: 18px;
          border-bottom: 2px solid #667eea;
          padding-bottom: 10px;
        }
        .field {
          margin: 15px 0;
          padding: 10px;
          background: white;
          border-left: 3px solid #667eea;
          border-radius: 4px;
        }
        .field-label {
          font-weight: 600;
          color: #495057;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .field-value {
          color: #212529;
          font-size: 16px;
        }
        .array-value {
          margin-top: 5px;
        }
        .array-item {
          background: #e7f1ff;
          padding: 5px 10px;
          border-radius: 4px;
          margin: 3px 0;
          display: inline-block;
        }
        .footer {
          text-align: center;
          color: #6c757d;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #dee2e6;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📋 Nová objednávka z DaněNula.cz</h1>
        <p>${timestamp}</p>
      </div>

      <div class="section">
        <h2>📦 Balíček služeb</h2>
        <div class="field">
          <div class="field-value"><strong>${data['service-package'] || '-'}</strong></div>
        </div>
      </div>

      <div class="section">
        <h2>👤 Osobní údaje</h2>
        ${createField('Jméno', data['first-name'])}
        ${createField('Příjmení', data['last-name'])}
        ${createField('Adresa', data['address'])}
        ${createField('E-mail', data['email'])}
        ${createField('Telefon', data['phone'])}
        ${createField('Státní příslušnost', data['nationality'])}
      </div>

      <div class="section">
        <h2>🏢 Daňové údaje</h2>
        ${createField('IČO', data['ico'])}
        ${createField('DIČ', data['dic'])}
        ${createField('Finanční úřad', data['tax-office'])}
        ${createField('Zdravotní pojišťovna', data['health-insurance'])}
        ${createField('VS ČSSZ', data['social-security-symbol'])}
        ${createField('Typ činnosti', data['activity-type'])}
        ${data['secondary-reason'] ? createField('Důvod vedlejší činnosti', data['secondary-reason']) : ''}
      </div>

      <div class="section">
        <h2>💰 Příjmy a slevy</h2>
        ${createField('Zdanitelné příjmy', data['taxable-income'])}
        ${createField('Jiné příjmy', data['other-income'])}
        ${data['tax-deductions'] ? createArrayField('Slevy na dani', data['tax-deductions']) : ''}
        ${data['child-benefits'] ? createArrayField('Daňové zvýhodnění na děti', data['child-benefits']) : ''}
        ${data['deductible-expenses'] ? createArrayField('Nezdanitelné části', data['deductible-expenses']) : ''}
        ${data['pohoda-confirmations'] ? createArrayField('POHODA potvrzení', data['pohoda-confirmations']) : ''}
      </div>

      <div class="section">
        <h2>📄 Způsob podání</h2>
        ${createField('Způsob podání', data['filing-method'])}
        ${data['data-box-id'] ? createField('ID Datové schránky', data['data-box-id']) : ''}
      </div>

      <div class="footer">
        <p>Tato zpráva byla automaticky vygenerována z formuláře na DaněNula.cz</p>
      </div>
    </body>
    </html>
  `;
}

function createField(label, value) {
    if (!value || value === '') return '';
    return `
    <div class="field">
      <div class="field-label">${label}</div>
      <div class="field-value">${value}</div>
    </div>
  `;
}

function createArrayField(label, values) {
    if (!values || values.length === 0) return '';
    const items = values.map(v => `<span class="array-item">✓ ${v}</span>`).join(' ');
    return `
    <div class="field">
      <div class="field-label">${label}</div>
      <div class="array-value">${items}</div>
    </div>
  `;
}
