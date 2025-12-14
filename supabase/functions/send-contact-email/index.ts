import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = "re_VXSNTMHe_FMEYBxdpQmgwwNq7D9XgLhfs";

interface ContactSubmission {
  email: string;
  message: string;
  name?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { email, message, name }: ContactSubmission = await req.json();
    
    const ip_address = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const user_agent = req.headers.get("user-agent") || "unknown";

    if (!email || !message) {
      return new Response(
        JSON.stringify({ error: "Email en bericht zijn verplicht" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const wordCount = message.trim().split(/\s+/).length;
    if (wordCount < 5) {
      return new Response(
        JSON.stringify({ error: "Bericht moet minimaal 5 woorden bevatten" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const { data: recentSubmissions, error: rateLimitError } = await supabaseClient
      .from("contact_submissions")
      .select("id")
      .eq("ip_address", ip_address)
      .gte("created_at", fiveMinutesAgo);

    if (rateLimitError) {
      console.error("Rate limit check error:", rateLimitError);
    }

    if (recentSubmissions && recentSubmissions.length > 0) {
      return new Response(
        JSON.stringify({ error: "Je kunt maar 1 bericht per 5 minuten versturen" }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const spamKeywords = ["viagra", "casino", "lottery", "winner", "congratulations", "click here", "buy now"];
    const lowerMessage = message.toLowerCase();
    const isSpam = spamKeywords.some(keyword => lowerMessage.includes(keyword));

    const { error: insertError } = await supabaseClient
      .from("contact_submissions")
      .insert({
        email,
        message,
        ip_address,
        user_agent,
        is_spam: isSpam,
      });

    if (insertError) {
      console.error("Database insert error:", insertError);
      return new Response(
        JSON.stringify({ error: "Er is een fout opgetreden. Probeer het later opnieuw." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!isSpam) {
      const emailSubject = `🚀 Nieuw bericht van ${email}`;
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #FF844B 0%, #FF6B2C 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .info-row { margin: 10px 0; padding: 10px; background: white; border-radius: 4px; }
    .label { font-weight: bold; color: #FF6B2C; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>📧 Nieuw Contactformulier Bericht</h2>
    </div>
    <div class="content">
      <div class="info-row">
        <span class="label">👤 Naam:</span> ${name || "Niet opgegeven"}
      </div>
      <div class="info-row">
        <span class="label">📧 Email:</span> <a href="mailto:${email}">${email}</a>
      </div>
      <div class="info-row">
        <span class="label">💬 Bericht:</span><br>${message}
      </div>
      <div class="footer">
        <p><strong>📍 Details:</strong></p>
        <p>IP Adres: ${ip_address}</p>
        <p>User Agent: ${user_agent}</p>
        <p>Tijdstip: ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</p>
      </div>
    </div>
  </div>
</body>
</html>
      `;

      try {
        console.log('📨 Sending email via Resend API...');
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'KHCustomWeb Contact <onboarding@resend.dev>',
            to: ['Kayhuybreghs@icloud.com'],
            subject: emailSubject,
            html: emailHtml,
            reply_to: email
          })
        });

        const emailData = await emailResponse.json();

        if (!emailResponse.ok) {
          console.error('❌ Email send failed:', emailData);
          throw new Error(`Email failed: ${JSON.stringify(emailData)}`);
        }

        console.log('✅ Email sent successfully!');
        console.log('Email ID:', emailData.id);
        console.log('TO: Kayhuybreghs@icloud.com');
        console.log('FROM:', email);
        console.log('MESSAGE:', message);

      } catch (emailError) {
        console.error('💥 Email error:', emailError);
        
        return new Response(
          JSON.stringify({ error: "Formulier verzonden maar email kon niet worden verstuurd. We nemen zo snel mogelijk contact op." }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Bericht succesvol verzonden!" 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Er is een onverwachte fout opgetreden" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});