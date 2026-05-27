import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      destination, days, budget, preferences, travelGroup,
      moods = [], travelers, primaryPersonality, behavioralProfile,
    } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const travelerSummary = (travelers || []).map((t: any, i: number) =>
      `${i + 1}. ${t.name || `Traveler ${i + 1}`} — personality: ${t.personality}, budget comfort: ${t.budgetComfort}, interests: ${(t.interests || []).join(", ") || "open"}`
    ).join("\n");

    const profileLine = behavioralProfile
      ? `chronotype=${behavioralProfile.chronotype}, food=${behavioralProfile.foodProfile}, planning=${behavioralProfile.planningStyle}, social=${behavioralProfile.socialBattery}, photo=${behavioralProfile.photoInterest}/5, spending=${behavioralProfile.spendingStyle}, pace=${behavioralProfile.pace}, weather=${behavioralProfile.weatherPref}, crowds=${behavioralProfile.crowdTolerance}, spontaneity=${behavioralProfile.spontaneity}, archetype="${behavioralProfile.derivedArchetype}"`
      : "n/a";

    const moodsLine = (moods.length ? moods : preferences || []).join(", ") || "general";

    const prompt = `You are Wanderly — an emotionally intelligent, premium AI travel planner. Design a deeply personalized ${days}-day itinerary for ${destination}.

Trip context:
- Budget: ₹${budget} INR total
- Group type: ${travelGroup}
- Lead personality: ${primaryPersonality}
- Trip moods (multi-select, blend ALL of these): ${moodsLine}
- Behavioral profile: ${profileLine}

Travelers (GROUP HARMONY — balance everyone's preferences so no one feels left out):
${travelerSummary || "Solo traveler"}

PSYCHOLOGY-DRIVEN RULES (must obey):
1. Use the chronotype to time activities (early-bird → sunrise; night-owl → late dinners).
2. Use crowd tolerance — "avoid" → off-peak slots, less touristy spots.
3. Use pace + planning style — "slow + spontaneous" → fewer fixed bookings, more drift windows.
4. Honor every trip mood. "healing + social" → quiet morning ritual + community evening dinner. "luxury" → at least one curated splurge. "nature-detox" → minimum one full nature half-day.
5. Photography interest >=4 → schedule golden-hour photo stops.
6. Spending style "frugal" → emphasize cost-savers; "splurge" → at least one signature experience.
7. Hidden gems: each day MUST include at least one less-crowded local spot (not the top tourist trap) with a short reason it's special.
8. Tourist trap & safety warnings: list 4–7 specific tourist traps, scams, overpriced spots, or unsafe-after-dark areas in ${destination}.
9. Regret-prevention: highlight 2–3 commonly-missed experiences travelers regret skipping, plus 2 things that are overrated and can be skipped.
10. Realistic, highly detailed budget engine — see schema below.
11. Group harmony: for each day, 1–2 "personalizedMentions" using actual traveler names.
12. Unique days — never repeat the same attraction or restaurant across days.
13. Real places only — actual attractions, real restaurants, real hotels in ${destination} with coordinates (lat/lng as numbers).
14. Personality fit — adapt activities to ${primaryPersonality} (explorer→off-beat, relaxer→slow+spa, foodie→food trails, thrill→adventure, culture→museums/heritage, social→nightlife/meetups).

Detect destination theme: "mountains" | "beach" | "nightlife" | "spiritual" | "default".

Respond with valid JSON only, no markdown. Schema:
{
  "destinationInfo": {
    "lat": number, "lng": number,
    "description": "evocative 2-3 sentence intro",
    "imageKeyword": "best image search keyword for this destination",
    "theme": "mountains|beach|nightlife|spiritual|default",
    "bestTimeToVisit": "string",
    "weatherSummary": "typical weather + temperature range for the trip window (1 sentence)",
    "vibe": "one-line emotional summary"
  },
  "days": [
    {
      "day": 1,
      "theme": "Short theme",
      "morning":   { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "afternoon": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "evening":   { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "restaurants": [{ "name": "Real Restaurant", "cuisine": "...", "priceRange": "₹...", "lat": n, "lng": n, "imageKeyword": "specific search term" }],
      "hotels":      [{ "name": "Real Hotel",      "pricePerNight": "₹...", "rating": n, "lat": n, "lng": n, "imageKeyword": "specific search term" }],
      "attractions": ["Place 1", "Place 2", "Place 3"],
      "hiddenGem":   { "name": "...", "why": "1-2 sentence reason", "lat": n, "lng": n },
      "personalizedMentions": ["Sunrise trek added for Riya and Aman", "..."]
    }
  ],
  "warnings": [
    { "type": "scam|trap|unsafe|overpriced", "title": "...", "detail": "1-2 sentences", "severity": "low|medium|high" }
  ],
  "regretPrevention": { "dontMiss": ["...","..."], "skippable": ["...","..."] },
  "budgetBreakdown": {
    "accommodation": n, "food": n, "transport": n, "activities": n, "misc": n,
    "hiddenCosts": [
      { "label": "Local transport (autos/rickshaws/metro)", "estimate": n, "low": n, "high": n, "note": "expect surge pricing in evenings, ~1.5x" },
      { "label": "Entry/temple fees & camera fees",          "estimate": n, "low": n, "high": n, "note": "..." },
      { "label": "Food range (street → mid → premium)",      "estimate": n, "low": n, "high": n, "note": "per person per meal" },
      { "label": "GST + service charges on hotels/food",     "estimate": n, "low": n, "high": n, "note": "12–18% typical" },
      { "label": "Tourist pricing markup",                    "estimate": n, "low": n, "high": n, "note": "..." },
      { "label": "Tipping & porter fees",                     "estimate": n, "low": n, "high": n, "note": "..." },
      { "label": "Sim/data, power adapter, sunscreen",        "estimate": n, "low": n, "high": n, "note": "..." },
      { "label": "ATM/forex/bank charges",                    "estimate": n, "low": n, "high": n, "note": "..." },
      { "label": "Emergency buffer (medical/weather/delays)", "estimate": n, "low": n, "high": n, "note": "keep 10–15% aside" }
    ],
    "confidenceScore": 0-100,
    "confidenceReason": "one line"
  },
  "costSavers": [
    { "title": "Local thali joint near ...", "saving": "Save ₹400/meal vs tourist cafes", "category": "food|transport|stay|entry|hack", "tip": "go before 1pm to avoid lines", "lat": n, "lng": n }
  ],
  "packingChecklist": [
    { "category": "Documents",          "items": ["..."] },
    { "category": "Weather-specific",   "items": ["weather-aware items based on destination + season"] },
    { "category": "Activity-specific",  "items": ["items based on actual activities planned above"] },
    { "category": "Health & Medicine",  "items": ["..."] },
    { "category": "Tech & Power",       "items": ["..."] },
    { "category": "Local essentials",   "items": ["e.g. modest clothing for temples, mosquito repellent for backwaters"] }
  ],
  "travelerStories": [
    { "title": "...", "snippet": "2-3 sentence emotional micro-story tied to ${destination}", "moodTag": "one of the trip moods", "author": "First name" }
  ],
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
