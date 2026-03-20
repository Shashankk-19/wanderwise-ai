import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, days, budget, preferences, travelGroup } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are an expert travel planner. Create a detailed ${days}-day itinerary for ${destination} for a ${travelGroup} trip with a budget of ₹${budget} INR.

Travel preferences: ${preferences?.length ? preferences.join(", ") : "general sightseeing"}.

For EACH day, provide:
1. Unique activities — NEVER repeat the same activity across days
2. Real, actual places, tourist attractions, temples, beaches, viewpoints, etc. that exist in ${destination}
3. Real restaurants with cuisine type
4. Real hotels/stays in the area
5. Approximate coordinates (latitude, longitude) of the main attraction for that day

IMPORTANT: Each day MUST have DIFFERENT places and activities. Do NOT repeat any attraction or restaurant across days.

Respond with valid JSON only, no markdown. Use this exact structure:
{
  "destinationInfo": {
    "lat": number,
    "lng": number,
    "description": "2-3 sentence description of the destination",
    "imageKeyword": "best keyword for searching images of this destination"
  },
  "days": [
    {
      "day": 1,
      "theme": "Short theme for the day e.g. Heritage Walk",
      "morning": { "activity": "description", "place": "Real Place Name", "lat": number, "lng": number },
      "afternoon": { "activity": "description", "place": "Real Place Name", "lat": number, "lng": number },
      "evening": { "activity": "description", "place": "Real Place Name", "lat": number, "lng": number },
      "restaurants": [
        { "name": "Real Restaurant Name", "cuisine": "Type", "priceRange": "₹ amount range", "lat": number, "lng": number }
      ],
      "hotels": [
        { "name": "Real Hotel Name", "pricePerNight": "₹ amount", "rating": 4.5, "lat": number, "lng": number }
      ],
      "attractions": ["Real Place 1", "Real Place 2", "Real Place 3"]
    }
  ],
  "budgetBreakdown": {
    "accommodation": number,
    "food": number,
    "transport": number,
    "activities": number,
    "misc": number
  },
  "travelTips": ["tip 1", "tip 2", "tip 3"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a travel itinerary generator. Always respond with valid JSON only, no markdown code fences." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    let parsed;
    try {
      // Strip markdown code fences if present
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse itinerary" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
