export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email en bericht zijn verplicht' });
    }

    const words = message.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length < 5) {
      return res.status(400).json({ error: 'Je bericht moet minimaal 5 woorden bevatten' });
    }

    const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'buy now'];
    const lowerMessage = message.toLowerCase();
    const isSpam = spamKeywords.some(keyword => lowerMessage.includes(keyword));

    if (isSpam) {
      return res.status(200).json({ success: true, message: 'Bericht succesvol verzonden!' });
    }

    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    const emailSubject = `Nieuw contactformulier bericht van ${email}`;
    const emailBody = `
Nieuw contactformulier bericht:

Naam: ${name || 'Niet opgegeven'}
Email: ${email}
Bericht: ${message}

---
IP: ${ip}
User Agent: ${userAgent}
Tijdstip: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}
    `;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'KHCustomWeb Contact <onboarding@resend.dev>',
        to: ['kayhuybreghs@icloud.com'],
        subject: emailSubject,
        text: emailBody,
        reply_to: email
      })
    });

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text();
      console.error('Email send error:', errorData);
      return res.status(500).json({ error: 'Er is een fout opgetreden bij het verzenden' });
    }

    return res.status(200).json({ success: true, message: 'Bericht succesvol verzonden!' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Er is een onverwachte fout opgetreden' });
  }
}
