import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = "re_8uXxZJfu_6T7oAiYSu6snkUniW7C2b3iU"
const MY_EMAIL = "stagfireworksuk@gmail.com"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, payload } = await req.json();
    let html = '';
    let subject = '';

    if (type === 'checkout') {
       subject = '[Client Booking Form] New Fireworks Order!';
       html = `<h2>New Order Received</h2>
       <p><strong>Name:</strong> ${payload.first_name} ${payload.last_name}</p>
       <p><strong>Email:</strong> ${payload.email}</p>
       <p><strong>Phone:</strong> ${payload.phone}</p>
       <p><strong>Event Type:</strong> ${payload.event_type}</p>
       <p><strong>Date:</strong> ${payload.event_date}</p>
       <p><strong>Budget:</strong> ${payload.budget}</p>
       <h3>Cart Items:</h3>
       <ul>${payload.cart_summary.map((i: any) => `<li>${i.name} (x${i.quantity})</li>`).join('')}</ul>`;
    } else if (type === 'contact') {
       subject = '[Client Booking Form] New Message Inquiry';
       html = `<h2>New Contact Message</h2>
       <p><strong>Name:</strong> ${payload.name}</p>
       <p><strong>Email:</strong> ${payload.email}</p>
       <p><strong>Phone:</strong> ${payload.phone}</p>
       <p><strong>Message:</strong> ${payload.message}</p>`;
    } else if (type === 'newsletter') {
       subject = 'New Newsletter Subscriber!';
       html = `<p><strong>Email:</strong> ${payload.email}</p>`;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
         from: 'Stag Fireworks <onboarding@resend.dev>',
         to: [MY_EMAIL], 
         subject: subject,
         html: html
      })
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }})
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders })
  }
})
