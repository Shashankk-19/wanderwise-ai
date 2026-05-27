
# Wanderly — Premium Emotional Intelligence Upgrade

A large, multi-area overhaul. I'll group the work into 6 focused phases so we can ship cohesively without breaking the existing flow.

---

## Phase 1 — Visual Foundation (palette + motion language)

Replace the white-heavy off-white/navy/teal palette with a cozy, peachy-brown warm system inspired by Pinterest aesthetics, then layer cinematic motion primitives on top.

**Tokens (in `src/index.css` + `tailwind.config.ts`)**
- `--background: 28 45% 95%` (warm peach cream)
- `--foreground: 20 25% 18%` (deep cocoa)
- `--primary: 18 38% 32%` (roasted brown)
- `--accent: 22 78% 62%` (warm peach)
- `--sunset: 12 70% 58%` (terracotta)
- `--muted: 28 25% 88%` (latte)
- Glow ring `--ring: 22 78% 62%` for active states
- Keep `[data-theme="mountains|beach|nightlife|spiritual"]` overrides but recolor them to live in the same warm family (cool mist, golden sand, neon plum, sandalwood beige)

**Motion utilities (Tailwind keyframes + CSS)**
- `cinematic-pan`, `tab-slide`, `glow-pulse` (for active buttons), `kenburns` (image), `quote-rise`, `card-flip`
- `active-glow` utility — soft outer glow on focus/active CTAs using accent at 35% opacity
- Smooth `view-transition` wrapper using framer-motion AnimatePresence

## Phase 2 — Tab/Section Cinematic Shell

Convert `src/pages/Index.tsx` from a long-scroll layout into a full-viewport, tab-based experience with cinematic transitions.

**New component: `src/components/CinematicShell.tsx`**
- Full-screen `100dvh` sections, only one mounted/visible at a time
- AnimatePresence with directional slide+fade between tabs
- Sticky top tab strip with glowing indicator on the active pill
- Tabs: `Plan` → `Personality` → `Itinerary` → `Map` → `Budget` → `Checklist` → `Stories` → `Thank You`
- Keyboard arrows + swipe support
- Each tab fades in a hero quote and a Ken Burns destination image while loading

The old `BudgetBreakdown`, `ItineraryDisplay`, `DestinationMap`, `HotelSuggestions`, `TravelChecklist` become tab panes instead of scroll sections.

## Phase 3 — Deeper Onboarding & Personality Engine

Rebuild `TripForm.tsx` into a multi-step wizard with emotional/psychological depth.

**Steps**
1. Destination + days + budget (INR)
2. **Trip moods** (multi-select, chip-style with glow): peaceful, healing, social, adventurous, luxury, soulful, dopamine-heavy, nature detox, romantic, productive escape. **Remove the Energy Level slider entirely.**
3. **Personality probe** (behavioral signals → inferred personality):
   - Sleep timing (early bird ↔ night owl)
   - Food habits (street food ↔ fine dining; veg/non-veg/experimental)
   - Planning style (everything booked ↔ wing it)
   - Social battery (recharge alone ↔ recharge with people)
   - Photography interest (none ↔ obsessed)
   - Spending behavior (frugal ↔ splurge on memories)
   - Preferred pace (slow mornings ↔ packed days)
   - Weather preference (cool ↔ tropical)
   - Crowd tolerance (avoid ↔ love the buzz)
   - Spontaneous vs structured
4. Group harmony (only for couple/family/friends — kept from current build)

**Client-side derivation in `src/lib/personalityEngine.ts`**
- Map answers → a `behavioralProfile` object (chronotype, foodProfile, planningStyle, socialBattery, photoInterest, spendingStyle, pace, weatherPref, crowdTolerance, spontaneity, derivedArchetype)
- Pass full profile + selected moods array to the edge function

## Phase 4 — Smarter AI Itinerary (edge function rewrite)

Update `supabase/functions/generate-itinerary/index.ts`:

- Accept `moods: string[]`, `behavioralProfile`, drop `energy`
- Prompt explicitly asks Gemini to:
  - Use `behavioralProfile` to time activities (e.g. night-owls get late dinners; low crowd tolerance → off-peak slots)
  - Honor all selected moods (e.g. "healing + social" → quiet morning ritual + evening community dinner)
  - Return **destination-specific, weather-aware, activity-aware checklist** (`packingChecklist: { category, items[] }`) — replace generic checklist
  - Return **costSavers**: hidden cheap cafés, cheaper timings, local transport alternatives, budget hacks, free experiences (each with `lat/lng` when applicable)
  - Return **travelerStories**: 3 short, evocative micro-stories ("Maya found a hidden ghat at sunrise…") with mood tags
  - Return **highly detailed hiddenCosts**: local transport, surge pricing, GST/taxes, food range (street → mid → premium), emergency buffer, tourist pricing markup, tipping, sim/data, baggage, ATM/forex, with low/high `estimateRange`
  - Return **bookingLinks** with valid `Maps` search URLs (Google Maps "search?q=" with name+destination) and `imageQuery` — fixes broken links
  - Return `theme` (mountains/beach/nightlife/spiritual/default) for dynamic UI

**Image strategy** — replace any broken Unsplash direct URLs with Unsplash Source search URLs built from the AI-provided `imageKeyword` (always render with `onError` fallback to a curated placeholder). Hotel/restaurant cards always render a Google Maps search link as the "Open" button so they can never 404.

## Phase 5 — Re-skinned Components

- **HotelSuggestions / restaurant cards** — image with onError fallback; "View on Maps" button using `https://www.google.com/maps/search/?api=1&query=...`; price + rating chips; glow-on-hover
- **BudgetBreakdown** — expanded hidden costs table with category icons, low/high range bars, confidence meter, and a "Smart Savings" panel listing `costSavers`
- **TravelChecklist** — fully driven by AI `packingChecklist` (categories: Documents, Weather-specific, Activity-specific, Health, Tech, Local essentials), with checkbox state in localStorage per destination
- **StoriesPanel** (new) — Pinterest-style masonry of `travelerStories` with quote-rise animation and soft warm gradients
- **ThankYouScreen** (new) — final tab: animated "Thank you for using Wanderly" with letter-rise, floating polaroid stack of the trip's hero images, a soft confetti of warm dots, and CTAs to Save Trip / Plan Another

## Phase 6 — Microinteractions & Dynamic Theming

- Active tab pill + primary CTAs use new `.active-glow` utility (soft pulsing accent halo)
- All cards: lift + warm shadow on hover, image `kenburns` on hover
- Quotes and flash cards between tabs (`"Travel is the only thing you buy that makes you richer."` etc.) appear during itinerary loading via `ItinerarySkeleton`
- Destination theme is set on `<html data-theme>` as soon as the AI returns `theme`, switching the entire palette in one transition
- Existing `IntroAnimation` retuned to warm palette

---

## Files

**Edit**
- `src/index.css`, `tailwind.config.ts` — palette + motion utilities
- `src/pages/Index.tsx` — mount `CinematicShell`
- `src/components/TripForm.tsx` — wizard + personality probe + multi-mood, remove energy
- `src/components/BudgetBreakdown.tsx` — detailed hidden costs + cost savers panel
- `src/components/HotelSuggestions.tsx` — fix links/images, glow hover
- `src/components/TravelChecklist.tsx` — AI-driven, destination/weather/activity aware
- `src/components/ItineraryDisplay.tsx` — reveal animations, story callouts, mood chips
- `src/components/ItinerarySkeleton.tsx` — rotating travel quotes/flash cards
- `src/components/IntroAnimation.tsx` — warm palette
- `src/components/Navbar.tsx` — restyle for warm theme
- `src/lib/destinationTheme.ts` — recolor theme variants
- `supabase/functions/generate-itinerary/index.ts` — new schema fields

**Create**
- `src/components/CinematicShell.tsx`
- `src/components/StoriesPanel.tsx`
- `src/components/ThankYouScreen.tsx`
- `src/components/MoodPicker.tsx`
- `src/components/PersonalityProbe.tsx`
- `src/lib/personalityEngine.ts`
- `src/lib/imageFallback.ts` (Unsplash Source + onError helper)

## Out of scope (call out)
- Real booking integrations — we generate reliable Google Maps deep links instead of partnering with Booking/MMT.
- Real-time weather API — we let the model infer typical weather for `month/destination`; if you want live weather I'll add OpenWeather as a follow-up.
- Saving the new personality profile to the `profiles` table — happy to add a migration in a follow-up so personality persists across sessions.

Approve and I'll start with Phase 1 (palette + motion) and Phase 2 (cinematic shell) so the new aesthetic is visible immediately, then work through the rest.
