import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
    if (wordCount > 5) {
      return new Response(
        JSON.stringify({ error: "Bericht mag maximaal 5 woorden bevatten" }),
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
      const emailBody = `
Nieuw contactformulier bericht:

Naam: ${name || "Niet opgegeven"}
Email: ${email}
Bericht: ${message}

IP: ${ip_address}
User Agent: ${user_agent}
      `;

      console.log("Email would be sent to: Kayhuybreghs@icloud.com");
      console.log(emailBody);
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