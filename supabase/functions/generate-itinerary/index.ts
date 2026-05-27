import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { destination, days, budget, preferences, travelGroup, energy, travelers, primaryPersonality } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const travelerSummary = (travelers || []).map((t: any, i: number) =>
      `${i + 1}. ${t.name || `Traveler ${i + 1}`} — personality: ${t.personality}, budget: ${t.budgetComfort}, interests: ${(t.interests || []).join(", ") || "open"}`
    ).join("\n");

    const energyRule = energy === "chill" ? "2-3 activities/day, long mid-day breaks, no early starts"
      : energy === "packed" ? "5-6 activities/day, early starts, dense scheduling"
      : "4 activities/day, balanced pacing, one break window";

    const prompt = `You are an emotionally-intelligent, premium AI travel planner for "Wanderly". Design a deeply personalized ${days}-day itinerary for ${destination}.

Trip context:
- Budget: ₹${budget} INR total
- Group type: ${travelGroup}
- Trip mood / primary personality: ${primaryPersonality}
- Energy preference: ${energy} (${energyRule})
- Trip-wide vibes: ${(preferences || []).join(", ") || "general"}

Travelers (GROUP HARMONY — balance everyone's preferences so no one feels left out):
${travelerSummary || "Solo traveler"}

CRITICAL REQUIREMENTS:
1. Energy-aware scheduling: respect the energy rule strictly. Avoid back-to-back high-effort activities. Insert rest/comfort windows for chill/balanced.
2. Hidden gems: each day MUST include at least one less-crowded local spot (not the top tourist trap) with a short reason it's special.
3. Tourist trap & safety warnings: list 3–6 specific tourist traps, scams, overpriced spots, or unsafe-after-dark areas in ${destination}.
4. Regret-prevention: highlight 2–3 commonly-missed experiences travelers regret skipping, plus 2 things that overrated and can be skipped.
5. Realistic budget engine: include hidden costs travelers usually forget (tips, entry fees, transit surge, ATM fees, bottled water, sunscreen, etc.). Include a confidence score (0–100) reflecting how realistic the budget is for the chosen preferences, plus a one-line confidence reason.
6. Group harmony: for each day, write 1–2 "personalizedMentions" naming specific travelers (e.g. "Sunrise trek added for Riya and Aman", "Quiet café break for Maya"). Use the actual names provided.
7. Unique days — never repeat the same attraction or restaurant across days.
8. Real places only — actual attractions, real restaurants, real hotels in ${destination} with coordinates.
9. Personality fit — adapt activities to ${primaryPersonality}: explorer → off-beat, relaxer → slow + spa, foodie → food trails, thrill → adventure sports, culture → museums/heritage, social → nightlife/meetups.

Detect the destination theme (one of): "mountains", "beach", "nightlife", "spiritual", or "default".

Respond with valid JSON only, no markdown. Structure:
{
  "destinationInfo": {
    "lat": number, "lng": number,
    "description": "evocative 2-3 sentence intro",
    "imageKeyword": "best image search keyword for this destination",
    "theme": "mountains|beach|nightlife|spiritual|default",
    "bestTimeToVisit": "string",
    "vibe": "one-line emotional summary"
  },
  "days": [
    {
      "day": 1,
      "theme": "Short theme",
      "energyScore": 1-10,
      "morning": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "afternoon": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "evening": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "restaurants": [{ "name": "...", "cuisine": "...", "priceRange": "₹...", "lat": n, "lng": n, "imageKeyword": "specific search term" }],
      "hotels": [{ "name": "Real Hotel", "pricePerNight": "₹...", "rating": n, "lat": n, "lng": n, "imageKeyword": "specific search term" }],
      "attractions": ["Place 1", "Place 2", "Place 3"],
      "hiddenGem": { "name": "...", "why": "1-2 sentence reason", "lat": n, "lng": n },
      "personalizedMentions": ["Sunrise trek added for Riya and Aman", "..."]
    }
  ],
  "warnings": [
    { "type": "scam|trap|unsafe|overpriced", "title": "...", "detail": "1-2 sentences", "severity": "low|medium|high" }
  ],
  "regretPrevention": {
    "dontMiss": ["...", "..."],
    "skippable": ["...", "..."]
  },
  "budgetBreakdown": {
    "accommodation": n, "food": n, "transport": n, "activities": n, "misc": n,
    "hiddenCosts": [{ "label": "Entry fees", "estimate": n, "note": "short" }],
    "confidenceScore": 0-100,
    "confidenceReason": "one line"
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
          { role: "system", content: "You are a premium travel intelligence engine. Return strict JSON only, no markdown." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      if (response.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please retry shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (response.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      return new Response(JSON.stringify({ error: "AI service unavailable" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    let parsed;
    try {
      const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("Failed to parse:", content);
      return new Response(JSON.stringify({ error: "Failed to parse itinerary" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(parsed), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("generate-itinerary error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
