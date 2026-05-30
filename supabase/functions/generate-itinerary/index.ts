import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const {
      destination, days, budget, moods, preferences, travelGroup,
      travelers, primaryPersonality, behavioral,
      startDate, startMonth, season,
      gender, womenSafeMode,
    } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const moodList = (moods && moods.length ? moods : preferences) || ["peaceful"];

    const travelerSummary = (travelers || []).map((t: any, i: number) =>
      `${i + 1}. ${t.name || `Traveler ${i + 1}`} — personality: ${t.personality}, budget: ${t.budgetComfort}, interests: ${(t.interests || []).join(", ") || "open"}`
    ).join("\n");

    const b = behavioral || {};
    const behavioralSummary = `
- Sleep: ${b.sleepTiming || "balanced"}
- Food habits: ${b.foodHabits || "adventurous"}
- Planning: ${b.planningStyle || "flexible"}
- Social battery: ${b.socialBattery || "ambivert"}
- Photography interest: ${b.photographyInterest || "medium"}
- Spending: ${b.spendingBehavior || "balanced"}
- Travel pace: ${b.travelPace || "moderate"}
- Weather pref: ${b.weatherPreference || "any"}
- Crowd tolerance: ${b.crowdTolerance || "medium"}
- Spontaneity: ${b.spontaneity || "balanced"}
`.trim();

    const dateLine = startDate
      ? `- Trip starts: ${startDate} (${startMonth || ""}${season ? `, ${season}` : ""})`
      : "";

    const safetyLine = womenSafeMode
      ? `\n\nWOMEN SAFE MODE — ENABLED (traveler gender: ${gender || "unspecified"}):
- Prioritize stays in safe, well-reviewed, well-lit neighborhoods with 24/7 reception.
- Bias activities toward daytime; flag any evening plans with a clear safety note + suggested transport.
- Recommend verified taxi apps / women-only transport where available.
- Prefer busier, well-trafficked attractions over isolated spots after dark.
- Add a dedicated "safetyTips" array (6-10 items) tailored for solo female travelers in ${destination}: scams targeting women, dress code norms, emergency numbers, safe areas to stay, areas to avoid after dark, women-only carriages/coaches if applicable.
- In warnings, add at least 2 women-specific safety warnings with severity.`
      : `\n(Traveler gender: ${gender || "unspecified"}. Standard safety guidance.)`;


    const prompt = `You are Wanderly — a deeply emotionally-intelligent, premium travel intelligence engine.
Plan a richly personalized ${days}-day trip to ${destination}.

CONTEXT
- Budget: ₹${budget} INR total
- Group: ${travelGroup}
- Primary personality: ${primaryPersonality}
- Trip moods (multi): ${moodList.join(", ")}
${dateLine}
- Travelers:
${travelerSummary || "Solo traveler"}
${safetyLine}


BEHAVIORAL / PSYCHOLOGY PROFILE (use this to shape EVERY choice):
${behavioralSummary}

SEASON / DATE AWARENESS:
- Tailor activities, weather summary, packing list and warnings to the actual season at ${destination} during ${startMonth || "the trip month"}.
- Mention any festivals, monsoon closures, peak/off-peak pricing, snow access etc. relevant to that month.
- If outdoor activities are unsafe or attractions are closed in that season, suggest indoor/seasonal alternatives.


TRANSLATE THE PROFILE INTO CONCRETE DECISIONS:
- Night-owl → start days late, evening-heavy. Early-bird → sunrise activities.
- Introvert / low crowd-tolerance → quiet cafés, off-peak timings, hidden spots.
- Slow pace → 2–3 stops/day with long breaks. Fast pace → 5+ stops, dense.
- Frugal → cheap eats, local transport. Indulgent → at least one luxe moment/day.
- High photography → golden-hour stops, scenic viewpoints.
- Adventurous food → street + regional. Picky → safer options always nearby.
- Spontaneous → leave 1 "wild-card window" per day.
- Weather pref + ${destination} climate → suggest packing accordingly.

REQUIREMENTS
1. UNIQUE days — never repeat any attraction/restaurant across days.
2. REAL places only with real lat/lng. Real, currently-operating hotels & restaurants in ${destination}.
3. Each day must include 1 hidden gem (less crowded) + why it's special.
4. Tourist trap / scam / unsafe-area warnings (3–6 items, specific to ${destination}).
5. Regret-prevention: 2–3 things travelers regret missing, 2 overrated things they can skip.
6. REALISTIC, DETAILED budget engine — include hidden costs like:
   local transport surge/auto-rickshaw markup, GST/service tax, tipping,
   monument entry fees (separate Indian/foreign rate where relevant),
   bottled water + sunscreen, ATM withdrawal fees, tourist pricing markup,
   emergency buffer (~8–10%), food range (street ₹/casual ₹₹/fine ₹₹₹), data SIM, baggage.
   Provide a confidence score (0–100) + one-line reason.
7. SMART COST-SAVING SUGGESTIONS specific to ${destination}: cheap-but-loved cafés, off-peak timing tricks,
   local transport hacks (state buses, shared autos, metro day-pass), free attractions,
   bargain markets, days/times entry is free or cheaper.
8. Destination-aware THEME — pick one: "mountains", "beach", "nightlife", "spiritual", "default".
9. WEATHER awareness — give a likely weather summary for the trip window and 6–10 destination/weather/activity-specific packing items.
10. ACTIVITY-SPECIFIC checklist items (e.g. trekking shoes for Manali, modest clothing for temples, reef-safe sunscreen for beach).
11. TRAVELER STORIES — invent 3 short, emotionally resonant micro-stories (60–90 words each) from past visitors of ${destination} that match this trip's mood. Realistic, warm, specific. Include a first name + one feeling word.
12. PERSONALITY READOUT — a 2-3 sentence empathetic summary of who this traveler likely is based on the behavioral profile, written in second person.

For images, give SPECIFIC, evocative loremflickr-friendly keywords (comma-separated nouns, no spaces, e.g. "fontainhas,goa,colorful,street").

Respond as VALID JSON ONLY (no markdown):
{
  "destinationInfo": {
    "lat": n, "lng": n,
    "description": "2-3 sentence evocative intro",
    "imageKeyword": "kw1,kw2,kw3",
    "theme": "mountains|beach|nightlife|spiritual|default",
    "bestTimeToVisit": "...",
    "vibe": "one-line emotional summary",
    "weather": { "summary": "...", "tempRangeC": "22-30", "rainChance": "low|medium|high" }
  },
  "personalityReadout": "...",
  "days": [
    {
      "day": 1,
      "theme": "...",
      "energyScore": 1-10,
      "morning":   { "activity":"...", "place":"Real Place", "lat":n, "lng":n, "durationHrs":n, "effort":"low|medium|high" },
      "afternoon": { "activity":"...", "place":"Real Place", "lat":n, "lng":n, "durationHrs":n, "effort":"low|medium|high" },
      "evening":   { "activity":"...", "place":"Real Place", "lat":n, "lng":n, "durationHrs":n, "effort":"low|medium|high" },
      "restaurants": [{ "name":"...", "cuisine":"...", "priceRange":"₹...", "lat":n, "lng":n, "imageKeyword":"specific,keywords" }],
      "hotels":      [{ "name":"Real Hotel", "pricePerNight":"₹...", "rating":n, "lat":n, "lng":n, "imageKeyword":"specific,keywords" }],
      "attractions": ["...","...","..."],
      "hiddenGem": { "name":"...", "why":"...", "lat":n, "lng":n },
      "personalizedMentions": ["..."],
      "moodTag": "peaceful|social|adventurous|luxury|soulful|romantic|dopamine|healing|productive|nature-detox"
    }
  ],
  "warnings": [{ "type":"scam|trap|unsafe|overpriced", "title":"...", "detail":"...", "severity":"low|medium|high" }],
  "regretPrevention": { "dontMiss": ["..."], "skippable": ["..."] },
  "budgetBreakdown": {
    "accommodation": n, "food": n, "transport": n, "activities": n, "misc": n,
    "hiddenCosts": [{ "label":"Tipping (10%)", "estimate":n, "note":"..." }],
    "confidenceScore": 0-100,
    "confidenceReason": "..."
  },
  "costSavingTips": [{ "title":"...", "detail":"...", "savesAround": "₹..." }],
  "travelerStories": [{ "name":"Riya", "feeling":"peaceful", "quote":"...", "story":"..." }],
  "checklist": {
    "weatherSummary": "...",
    "packing":   ["destination/weather-specific items"],
    "documents": ["..."],
    "activitySpecific": ["e.g., trekking poles for Day 3 hike"],
    "safety":    ["..."]
  },
  "travelTips": ["...","...","..."]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
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
