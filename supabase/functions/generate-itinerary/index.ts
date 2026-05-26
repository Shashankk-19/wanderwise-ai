import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 200, headers: corsHeaders });

  try {
    const {
      destination, days, budget, preferences, travelGroup,
      energy, travelers, primaryPersonality,
      moods, personalityProfile,
    } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const travelerSummary = (travelers || []).map((t: any, i: number) =>
      `${i + 1}. ${t.name || `Traveler ${i + 1}`} — personality: ${t.personality}, budget: ${t.budgetComfort}, interests: ${(t.interests || []).join(", ") || "open"}`
    ).join("\n");

    const moodList = (moods || [energy] || ["balanced"]).join(", ");

    const paceFromMoods = () => {
      const m = moods || [];
      if (m.includes("packed") || m.includes("dopamine-heavy") || m.includes("adventurous")) return "5-6 activities/day, early starts, dense scheduling";
      if (m.includes("peaceful") || m.includes("healing") || m.includes("nature-detox") || m.includes("soulful")) return "2-3 activities/day, slow mornings, long breaks";
      if (m.includes("luxury")) return "3-4 activities/day, spa windows, premium timing";
      return "4 activities/day, balanced pacing, one mid-day break";
    };

    const personalityContext = personalityProfile ? `
Traveler personality profile (from behavioral quiz):
- Sleep type: ${personalityProfile.sleepType} (${personalityProfile.sleepType === "early-bird" ? "prefers morning starts" : personalityProfile.sleepType === "night-owl" ? "prefers late starts, evening activities" : "flexible"})
- Food style: ${personalityProfile.foodStyle}
- Planning style: ${personalityProfile.planningStyle}
- Social battery: ${personalityProfile.socialBattery}
- Photography interest: ${personalityProfile.photographyInterest}
- Spending style: ${personalityProfile.spendingStyle}
- Travel pace: ${personalityProfile.travelPace}
- Weather preference: ${personalityProfile.weatherPref}
- Crowd tolerance: ${personalityProfile.crowdTolerance}
- Structure vs spontaneous: ${personalityProfile.structureVsSpontaneous}
` : "";

    const prompt = `You are an emotionally-intelligent, premium AI travel planner for "Wanderly". Design a deeply personalized ${days}-day itinerary for ${destination}.

Trip context:
- Budget: ₹${budget} INR total
- Group type: ${travelGroup}
- Primary trip personality: ${primaryPersonality}
- Trip moods selected: ${moodList}
- Scheduling pace: ${paceFromMoods()}
- Trip-wide vibes: ${(preferences || []).join(", ") || "general"}
${personalityContext}
Travelers (GROUP HARMONY — balance everyone's preferences):
${travelerSummary || "Solo traveler"}

REQUIREMENTS:
1. Mood-aware scheduling: if moods include "healing" or "peaceful" — start days slowly, add nature & silence moments. "Soulful" → include a spiritual or introspective activity daily. "Dopamine-heavy" → max fun, color, activity variety. "Luxury" → premium restaurants, spas, upscale hotels. "Nature-detox" → zero mall/city recommendations. "Romantic" → couple-specific sunset spots, intimate dining. "Productive-escape" → include coworking-friendly cafes. "Cultural-deep-dive" → prioritize museums, local artisans, heritage walks. "Budget-smart" → highlight free/cheap alternatives for every activity.

2. Personality-adaptive scheduling: use the personality profile above to fine-tune (if provided). Night owls get late-morning starts. Introverts get solo-friendly spots. Low crowd-tolerance travelers avoid peak hours with timing tips.

3. Hidden gems: each day MUST include one less-known local spot with a specific reason it's special.

4. Tourist traps & safety: list 4-6 specific scams, overpriced spots, unsafe areas in ${destination}.

5. Detailed realistic budget with hidden costs — be highly specific:
   - Include: local rickshaw/auto surge pricing, seasonal markup, tourist pricing vs local pricing gap, mandatory tips at specific venues, bottled water/day estimate, entry fee totals, emergency buffer (3-5%), festive season premium if applicable, forex conversion loss if international, app-based vs counter booking difference.

6. Cost-saving suggestions: for each day, include 1-2 "costSavingTip" suggestions (e.g. "Take local bus instead of taxi — saves ₹300/day", "Visit X attraction before 9am for free/half-price entry").

7. Group harmony: write 1-2 "personalizedMentions" per day citing specific traveler names.

8. Real places only with coordinates. Unique per day — no repeats.

9. Regret prevention: 2-3 must-do experiences + 2 skippable overhyped ones.

10. Personality archetype fit: ${primaryPersonality} personality → explorer: off-beat; relaxer: spa+slow; foodie: food trails; thrill: adventure; culture: heritage; social: nightlife/meetups; soul wanderer: introspective/quiet spots; luxury nomad: premium; content creator: photogenic/unique backdrops.

Detect destination theme: "mountains", "beach", "nightlife", "spiritual", or "default".

Return valid JSON only (no markdown):
{
  "destinationInfo": {
    "lat": number, "lng": number,
    "description": "evocative 2-3 sentence intro matching the trip moods",
    "imageKeyword": "best image keyword",
    "theme": "mountains|beach|nightlife|spiritual|default",
    "bestTimeToVisit": "string",
    "vibe": "one-line emotional summary matching selected moods"
  },
  "days": [
    {
      "day": 1,
      "theme": "Short mood-aware theme",
      "energyScore": 1-10,
      "morning": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "afternoon": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "evening": { "activity": "...", "place": "Real Place", "lat": n, "lng": n, "durationHrs": n, "effort": "low|medium|high" },
      "costSavingTips": ["Take local bus instead of cab — saves ₹200", "..."],
      "restaurants": [{ "name": "...", "cuisine": "...", "priceRange": "₹...", "lat": n, "lng": n }],
      "hotels": [{ "name": "Real Hotel", "pricePerNight": "₹...", "rating": n, "lat": n, "lng": n }],
      "attractions": ["Place 1", "Place 2"],
      "hiddenGem": { "name": "...", "why": "1-2 sentences", "lat": n, "lng": n },
      "personalizedMentions": ["..."]
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
    "hiddenCosts": [
      { "label": "Auto-rickshaw surge (evening peak)", "estimate": n, "note": "Expect 1.5x-2x meter rate after 9pm" },
      { "label": "Tourist pricing premium", "estimate": n, "note": "Foreigners/tourists often charged 2-3x" },
      { "label": "Bottled water (daily)", "estimate": n, "note": "~₹30-50/bottle, 3-4/day" },
      { "label": "Entry fees total", "estimate": n, "note": "All monuments and parks" },
      { "label": "Emergency buffer (5%)", "estimate": n, "note": "Medical, last-minute changes" }
    ],
    "confidenceScore": 0-100,
    "confidenceReason": "one line"
  },
  "travelTips": ["tip 1", "tip 2", "tip 3", "tip 4", "tip 5"]
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
