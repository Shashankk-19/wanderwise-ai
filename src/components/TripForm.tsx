import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Sparkles, Users, Plus, X, Heart, Brain, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { searchDestinations } from "@/lib/destinations";

export type TravelGroup = "solo" | "couple" | "family" | "friends";
export type Personality = "explorer" | "relaxer" | "foodie" | "thrill" | "culture" | "social";

export interface BehavioralProfile {
  sleepTiming: "early-bird" | "balanced" | "night-owl";
  foodHabits: "adventurous" | "comfort" | "picky" | "foodie";
  planningStyle: "structured" | "flexible" | "spontaneous";
  socialBattery: "introvert" | "ambivert" | "extrovert";
  photographyInterest: "low" | "medium" | "high";
  spendingBehavior: "frugal" | "balanced" | "indulgent";
  travelPace: "slow" | "moderate" | "fast";
  weatherPreference: "cool" | "warm" | "any";
  crowdTolerance: "low" | "medium" | "high";
  spontaneity: "structured" | "balanced" | "spontaneous";
}

export interface TravelerProfile {
  name: string;
  personality: Personality;
  budgetComfort: "tight" | "balanced" | "luxe";
  interests: string[];
}

export interface TripData {
  destination: string;
  days: number;
  budget: number;
  startDate: string;       // ISO date (YYYY-MM-DD)
  startMonth: string;      // e.g. "March"
  season?: string;         // derived ("Winter", "Monsoon" ...)
  moods: string[];
  preferences: string[];
  travelGroup: TravelGroup;
  travelers: TravelerProfile[];
  primaryPersonality: Personality;
  behavioral: BehavioralProfile;
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const MOODS = [
  { id: "peaceful", label: "Peaceful", emoji: "🕊️" },
  { id: "healing", label: "Healing", emoji: "🌿" },
  { id: "social", label: "Social", emoji: "🥂" },
  { id: "adventurous", label: "Adventurous", emoji: "🧗" },
  { id: "luxury", label: "Luxury", emoji: "✨" },
  { id: "soulful", label: "Soulful", emoji: "🪷" },
  { id: "dopamine", label: "Dopamine-heavy", emoji: "🎢" },
  { id: "nature-detox", label: "Nature detox", emoji: "🌲" },
  { id: "romantic", label: "Romantic", emoji: "🌹" },
  { id: "productive", label: "Productive escape", emoji: "💻" },
];

const GROUP_OPTIONS: { id: TravelGroup; label: string; desc: string; minCount: number }[] = [
  { id: "solo", label: "Solo", desc: "Just me", minCount: 1 },
  { id: "couple", label: "Couple", desc: "2 travelers", minCount: 2 },
  { id: "family", label: "Family", desc: "3+ members", minCount: 3 },
  { id: "friends", label: "Friends", desc: "2-8 friends", minCount: 2 },
];

const PERSONALITIES: { id: Personality; label: string; desc: string }[] = [
  { id: "explorer", label: "Explorer", desc: "Off-beat trails, hidden gems" },
  { id: "relaxer", label: "Relaxer", desc: "Slow mornings, cafés, spas" },
  { id: "foodie", label: "Foodie", desc: "Street food → fine dining" },
  { id: "thrill", label: "Thrill-seeker", desc: "Adventure & adrenaline" },
  { id: "culture", label: "Culture lover", desc: "Heritage, art, museums" },
  { id: "social", label: "Social butterfly", desc: "Nightlife, meetups" },
];

const INTERESTS = ["food", "nightlife", "adventure", "culture", "nature", "shopping", "spiritual"];

// Behavioral psychology questions
type BQ = { key: keyof BehavioralProfile; label: string; options: { v: string; l: string }[] };
const BEHAVIORAL: BQ[] = [
  { key: "sleepTiming", label: "Your usual rhythm", options: [{ v: "early-bird", l: "Early bird" }, { v: "balanced", l: "Balanced" }, { v: "night-owl", l: "Night owl" }] },
  { key: "planningStyle", label: "Planning style", options: [{ v: "structured", l: "Structured" }, { v: "flexible", l: "Flexible" }, { v: "spontaneous", l: "Spontaneous" }] },
  { key: "socialBattery", label: "Social battery", options: [{ v: "introvert", l: "Introvert" }, { v: "ambivert", l: "Ambivert" }, { v: "extrovert", l: "Extrovert" }] },
  { key: "travelPace", label: "Preferred pace", options: [{ v: "slow", l: "Slow" }, { v: "moderate", l: "Moderate" }, { v: "fast", l: "Fast" }] },
  { key: "crowdTolerance", label: "Crowd tolerance", options: [{ v: "low", l: "Low" }, { v: "medium", l: "Medium" }, { v: "high", l: "High" }] },
  { key: "weatherPreference", label: "Weather you love", options: [{ v: "cool", l: "Cool" }, { v: "warm", l: "Warm" }, { v: "any", l: "Any" }] },
  { key: "foodHabits", label: "Food habits", options: [{ v: "adventurous", l: "Adventurous" }, { v: "foodie", l: "Foodie" }, { v: "comfort", l: "Comfort" }, { v: "picky", l: "Picky" }] },
  { key: "photographyInterest", label: "Photo moments", options: [{ v: "low", l: "Low" }, { v: "medium", l: "Some" }, { v: "high", l: "Lots" }] },
  { key: "spendingBehavior", label: "Spending vibe", options: [{ v: "frugal", l: "Frugal" }, { v: "balanced", l: "Balanced" }, { v: "indulgent", l: "Indulgent" }] },
  { key: "spontaneity", label: "On-trip choices", options: [{ v: "structured", l: "Stick to plan" }, { v: "balanced", l: "Mix" }, { v: "spontaneous", l: "Wing it" }] },
];

const DEFAULT_BEHAVIOR: BehavioralProfile = {
  sleepTiming: "balanced", foodHabits: "adventurous", planningStyle: "flexible",
  socialBattery: "ambivert", photographyInterest: "medium", spendingBehavior: "balanced",
  travelPace: "moderate", weatherPreference: "any", crowdTolerance: "medium", spontaneity: "balanced",
};

const blankTraveler = (i: number): TravelerProfile => ({
  name: i === 0 ? "" : `Traveler ${i + 1}`,
  personality: "explorer",
  budgetComfort: "balanced",
  interests: [],
});

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function seasonForMonth(monthIndex: number): string {
  // Generic seasonal hint (N. Hemisphere / India-leaning)
  if ([11, 0, 1].includes(monthIndex)) return "Winter";
  if ([2, 3, 4].includes(monthIndex)) return "Spring";
  if ([5, 6, 7].includes(monthIndex)) return "Summer / Monsoon";
  return "Autumn";
}

const todayISO = () => new Date().toISOString().slice(0, 10);

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [destination, setDestination] = useState("");
  const [destFocused, setDestFocused] = useState(false);
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(50000);
  const [startDate, setStartDate] = useState<string>(todayISO());
  const [moods, setMoods] = useState<string[]>(["peaceful"]);
  const [travelGroup, setTravelGroup] = useState<TravelGroup>("solo");
  const [primaryPersonality, setPrimaryPersonality] = useState<Personality>("explorer");
  const [travelers, setTravelers] = useState<TravelerProfile[]>([blankTraveler(0)]);
  const [behavioral, setBehavioral] = useState<BehavioralProfile>(DEFAULT_BEHAVIOR);
  const [showPsych, setShowPsych] = useState(false);
  const destInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const suggestions = useMemo(() => searchDestinations(destination), [destination]);
  const showSuggestions = destFocused && suggestions.length > 0 && destination.trim().length > 0;

  const monthIdx = useMemo(() => {
    const d = startDate ? new Date(startDate) : new Date();
    return isNaN(d.getTime()) ? new Date().getMonth() : d.getMonth();
  }, [startDate]);
  const monthName = MONTH_NAMES[monthIdx];
  const season = seasonForMonth(monthIdx);

  const isGroup = travelGroup !== "solo";

  const handleGroupChange = (g: TravelGroup) => {
    setTravelGroup(g);
    const min = GROUP_OPTIONS.find((o) => o.id === g)!.minCount;
    setTravelers((prev) => {
      if (g === "solo") return [blankTraveler(0)];
      if (prev.length < min) return [...prev, ...Array.from({ length: min - prev.length }, (_, i) => blankTraveler(prev.length + i))];
      return prev;
    });
  };

  const updateTraveler = (idx: number, patch: Partial<TravelerProfile>) =>
    setTravelers((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));

  const toggleTravelerInterest = (idx: number, interest: string) =>
    setTravelers((prev) =>
      prev.map((t, i) =>
        i === idx ? { ...t, interests: t.interests.includes(interest) ? t.interests.filter((x) => x !== interest) : [...t.interests, interest] } : t
      )
    );

  const addTraveler = () => travelers.length < 8 && setTravelers([...travelers, blankTraveler(travelers.length)]);
  const removeTraveler = (i: number) => setTravelers((prev) => prev.filter((_, idx) => idx !== i));

  const toggleMood = (id: string) => setMoods((prev) => (prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]));

  const pickSuggestion = (s: string) => {
    setDestination(s);
    setDestFocused(false);
    destInputRef.current?.blur();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim() || moods.length === 0) {
      toast({ title: "Pick at least one mood", description: "Choose how you want this trip to feel." });
      return;
    }
    const data: TripData = {
      destination, days, budget,
      startDate, startMonth: monthName, season,
      moods,
      preferences: moods,
      travelGroup,
      travelers: isGroup ? travelers : [{ ...travelers[0], name: travelers[0].name || "You", personality: primaryPersonality }],
      primaryPersonality,
      behavioral,
    };
    onSubmit(data);

    if (user) {
      await supabase.from("saved_trips").insert({
        user_id: user.id, destination: data.destination, days: data.days,
        budget: data.budget, preferences: data.moods.join(", "),
      });
    }
  };

  return (
    <section id="planner" className="py-16 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-4">
            Designed around your psychology
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Where to next?</h2>
          <p className="font-body text-muted-foreground text-lg">Tell us how you want this trip to feel.</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-card rounded-3xl p-8 shadow-soft border border-border space-y-7"
        >
          {/* Destination with autocomplete */}
          <div className="space-y-2">
            <Label className="font-body text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Destination
            </Label>
            <div className="relative">
              <Input
                ref={destInputRef}
                placeholder="Start typing — Goa, Bali, Kyoto..."
                value={destination}
                onChange={(e) => { setDestination(e.target.value); setDestFocused(true); }}
                onFocus={() => setDestFocused(true)}
                onBlur={() => setTimeout(() => setDestFocused(false), 150)}
                className="h-12 text-base bg-background"
                autoComplete="off"
              />
              <AnimatePresence>
                {showSuggestions && (
                  <motion.ul
                    initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-30 left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lift overflow-hidden"
                  >
                    {suggestions.map((s) => (
                      <li key={s}>
                        <button
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); pickSuggestion(s); }}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-accent/10 flex items-center gap-2 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
                          <span>{s}</span>
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Travel group */}
          <div className="space-y-3">
            <Label className="font-body text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" /> Who's traveling?
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROUP_OPTIONS.map((opt) => (
                <button key={opt.id} type="button" onClick={() => handleGroupChange(opt.id)}
                  data-sparkle
                  className={`p-4 rounded-2xl text-center transition-all border-2 ${travelGroup === opt.id ? "bg-accent/10 border-accent shadow-soft" : "bg-background border-border hover:border-accent/40"}`}>
                  <p className="font-heading font-semibold text-sm">{opt.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Start date + Days + Budget */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4 text-accent" />Start date</Label>
              <Input type="date" min={todayISO()} value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12" />
              <p className="text-[11px] text-muted-foreground">{monthName} · {season}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />Days</Label>
              <Input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4 text-accent" />Budget (₹)</Label>
              <Input type="number" min={5000} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-12" />
            </div>
          </div>

          {/* Trip moods (multi) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> Trip moods <span className="text-xs text-muted-foreground font-normal">· pick all that fit</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => {
                const active = moods.includes(m.id);
                return (
                  <button key={m.id} type="button" onClick={() => toggleMood(m.id)}
                    className={`px-4 py-2 rounded-full text-sm transition-all border-2 ${active ? "bg-accent text-accent-foreground border-accent btn-glow" : "bg-background text-foreground border-border hover:border-accent/50"}`}>
                    <span className="mr-1.5">{m.emoji}</span>{m.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary personality */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> {isGroup ? "Trip personality" : "Your travel personality"}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PERSONALITIES.map((p) => (
                <button key={p.id} type="button" onClick={() => setPrimaryPersonality(p.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${primaryPersonality === p.id ? "bg-sunset/10 border-sunset" : "bg-background border-border hover:border-sunset/40"}`}>
                  <p className="font-heading font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Deep psychology section (collapsible) */}
          <div className="rounded-2xl border-2 border-dashed border-accent/30 bg-accent/[0.03] overflow-hidden">
            <button type="button" onClick={() => setShowPsych((v) => !v)}
              className="w-full flex items-center justify-between p-4 text-left">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-accent" />
                <div>
                  <p className="font-heading font-semibold text-sm">Personality deep-dive</p>
                  <p className="text-xs text-muted-foreground">10 quick taps so Wanderly truly gets you</p>
                </div>
              </div>
              <span className="text-xs text-accent font-medium">{showPsych ? "Hide" : "Customize"}</span>
            </button>
            <AnimatePresence initial={false}>
              {showPsych && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="p-4 pt-0 grid sm:grid-cols-2 gap-3">
                    {BEHAVIORAL.map((q) => (
                      <div key={q.key} className="space-y-1.5">
                        <p className="text-xs font-medium text-muted-foreground">{q.label}</p>
                        <div className="flex flex-wrap gap-1">
                          {q.options.map((o) => {
                            const active = (behavioral as any)[q.key] === o.v;
                            return (
                              <button key={o.v} type="button"
                                onClick={() => setBehavioral((b) => ({ ...b, [q.key]: o.v as any }))}
                                className={`px-2.5 py-1 rounded-full text-xs transition-all ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                                {o.l}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Group harmony */}
          <AnimatePresence initial={false}>
            {isGroup && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Group Harmony — tell us about each traveler</Label>
                  <button type="button" onClick={addTraveler} disabled={travelers.length >= 8}
                    className="text-xs font-medium text-accent hover:underline disabled:opacity-40 flex items-center gap-1">
                    <Plus className="w-3 h-3" /> Add
                  </button>
                </div>
                <div className="space-y-3">
                  {travelers.map((t, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-background border border-border space-y-3">
                      <div className="flex items-center gap-2">
                        <Input placeholder={`Traveler ${idx + 1} name`} value={t.name}
                          onChange={(e) => updateTraveler(idx, { name: e.target.value })} className="h-9 text-sm font-medium" />
                        {travelers.length > GROUP_OPTIONS.find((o) => o.id === travelGroup)!.minCount && (
                          <button type="button" onClick={() => removeTraveler(idx)} className="p-2 rounded-lg hover:bg-muted">
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <select value={t.personality} onChange={(e) => updateTraveler(idx, { personality: e.target.value as Personality })}
                          className="h-9 rounded-lg border border-border bg-card px-2 text-sm">
                          {PERSONALITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                        <select value={t.budgetComfort}
                          onChange={(e) => updateTraveler(idx, { budgetComfort: e.target.value as TravelerProfile["budgetComfort"] })}
                          className="h-9 rounded-lg border border-border bg-card px-2 text-sm">
                          <option value="tight">Budget-conscious</option>
                          <option value="balanced">Balanced spender</option>
                          <option value="luxe">Loves luxe</option>
                        </select>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {INTERESTS.map((it) => (
                          <button key={it} type="button" onClick={() => toggleTravelerInterest(idx, it)}
                            className={`px-2.5 py-1 rounded-full text-xs capitalize transition-all ${t.interests.includes(it) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"}`}>
                            {it}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" size="xl"
            data-sparkle="butterfly"
            className="w-full bg-gradient-ocean text-primary-foreground hover:opacity-95 shadow-glow btn-glow"
            disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Crafting your itinerary...
              </span>
            ) : (
              <span className="flex items-center gap-2"><Sparkles className="w-5 h-5" /> Generate My Itinerary</span>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default TripForm;
