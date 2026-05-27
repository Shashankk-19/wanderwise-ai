import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Sparkles, Users, Plus, X, Heart, ChevronRight, ChevronLeft, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  TRIP_MOODS,
  PROBE_QUESTIONS,
  DEFAULT_PROFILE,
  deriveArchetype,
  type BehavioralProfile,
  type TripMood,
} from "@/lib/personalityEngine";

export type TravelGroup = "solo" | "couple" | "family" | "friends";
export type Personality = "explorer" | "relaxer" | "foodie" | "thrill" | "culture" | "social";

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
  preferences: string[];
  moods: TripMood[];
  travelGroup: TravelGroup;
  travelers: TravelerProfile[];
  primaryPersonality: Personality;
  behavioralProfile: BehavioralProfile;
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const GROUP_OPTIONS: { id: TravelGroup; label: string; desc: string; minCount: number; emoji: string }[] = [
  { id: "solo", label: "Solo", desc: "Just me", minCount: 1, emoji: "🧍" },
  { id: "couple", label: "Couple", desc: "2 travelers", minCount: 2, emoji: "💞" },
  { id: "family", label: "Family", desc: "3+ members", minCount: 3, emoji: "👨‍👩‍👧" },
  { id: "friends", label: "Friends", desc: "2–8 friends", minCount: 2, emoji: "🫂" },
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

const blankTraveler = (i: number): TravelerProfile => ({
  name: i === 0 ? "" : `Traveler ${i + 1}`,
  personality: "explorer",
  budgetComfort: "balanced",
  interests: [],
});

const STEPS = ["Where", "Mood", "Personality", "Group"] as const;

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [step, setStep] = useState(0);

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(50000);

  const [moods, setMoods] = useState<TripMood[]>([]);

  const [primaryPersonality, setPrimaryPersonality] = useState<Personality>("explorer");
  const [profile, setProfile] = useState<BehavioralProfile>(DEFAULT_PROFILE);

  const [travelGroup, setTravelGroup] = useState<TravelGroup>("solo");
  const [travelers, setTravelers] = useState<TravelerProfile[]>([blankTraveler(0)]);

  const { user } = useAuth();
  const { toast } = useToast();
  const isGroup = travelGroup !== "solo";

  const toggleMood = (id: TripMood) =>
    setMoods((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const handleGroupChange = (g: TravelGroup) => {
    setTravelGroup(g);
    const min = GROUP_OPTIONS.find((o) => o.id === g)!.minCount;
    setTravelers((prev) => {
      if (g === "solo") return [blankTraveler(0)];
      if (prev.length < min) {
        return [...prev, ...Array.from({ length: min - prev.length }, (_, i) => blankTraveler(prev.length + i))];
      }
      return prev;
    });
  };
  const updateTraveler = (idx: number, patch: Partial<TravelerProfile>) =>
    setTravelers((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  const toggleTravelerInterest = (idx: number, interest: string) =>
    setTravelers((prev) =>
      prev.map((t, i) =>
        i === idx
          ? { ...t, interests: t.interests.includes(interest) ? t.interests.filter((x) => x !== interest) : [...t.interests, interest] }
          : t
      )
    );
  const addTraveler = () => travelers.length < 8 && setTravelers([...travelers, blankTraveler(travelers.length)]);
  const removeTraveler = (i: number) => setTravelers((prev) => prev.filter((_, idx) => idx !== i));

  const canNext = () => {
    if (step === 0) return destination.trim().length > 0 && days > 0 && budget > 0;
    if (step === 1) return moods.length > 0;
    return true;
  };

  const handleSubmit = async () => {
    if (!destination.trim()) return;
    const finalProfile: BehavioralProfile = {
      ...profile,
      derivedArchetype: deriveArchetype(profile),
    };
    const data: TripData = {
      destination, days, budget,
      preferences: moods, // keep `preferences` populated for saved_trips compat
      moods,
      travelGroup,
      travelers: isGroup ? travelers : [{ ...travelers[0], name: travelers[0].name || "You", personality: primaryPersonality }],
      primaryPersonality,
      behavioralProfile: finalProfile,
    };
    onSubmit(data);
    if (user) {
      await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        preferences: data.moods.join(", "),
      });
      toast({ title: "Trip saved", description: "Find it under My Trips." });
    }
  };

  return (
    <section id="planner" className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium tracking-wide uppercase mb-3">
            Personalized for you
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-2">Where to next?</h2>
          <p className="font-body text-muted-foreground">
            A few thoughtful questions — we'll read between the lines and design the trip around you.
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  i === step ? "w-10 bg-accent active-glow" : i < step ? "w-6 bg-accent/60" : "w-6 bg-muted"
                }`}
              />
              {i < STEPS.length - 1 && <span className="text-muted-foreground/50 text-xs">·</span>}
            </div>
          ))}
        </div>

        <div className="bg-card rounded-3xl p-6 md:p-8 shadow-soft border border-border min-h-[420px]">
          <AnimatePresence mode="wait">
            {/* Step 0 — Where + days + budget */}
            {step === 0 && (
              <motion.div key="s0" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
                <div className="space-y-2">
                  <Label className="font-body text-sm font-medium flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent" /> Destination
                  </Label>
                  <Input
                    placeholder="Goa, Manali, Bali, Kyoto…"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="h-12 text-base bg-background"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />Days</Label>
                    <Input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4 text-accent" />Budget (INR)</Label>
                    <Input type="number" min={5000} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-12" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "The journey is the destination — but a thoughtful plan helps you arrive softly."
                </p>
              </motion.div>
            )}

            {/* Step 1 — Moods (multi-select) */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-5">
                <div>
                  <Label className="font-body text-sm font-medium flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-accent" /> What should this trip feel like?
                  </Label>
                  <p className="text-xs text-muted-foreground">Pick as many as you want — they shape the entire itinerary.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {TRIP_MOODS.map((m) => {
                    const active = moods.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => toggleMood(m.id)}
                        className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border-2 ${
                          active
                            ? "bg-accent text-accent-foreground border-accent active-glow"
                            : "bg-background text-foreground border-border hover:border-accent/50"
                        }`}
                      >
                        <span className="mr-1.5">{m.emoji}</span>{m.label}
                      </button>
                    );
                  })}
                </div>
                {moods.length > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-accent">
                    ✓ {moods.length} mood{moods.length > 1 ? "s" : ""} selected — we'll blend them.
                  </motion.p>
                )}
              </motion.div>
            )}

            {/* Step 2 — Personality probe */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
                <div>
                  <Label className="font-body text-sm font-medium flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-accent" /> A few honest questions
                  </Label>
                  <p className="text-xs text-muted-foreground">No wrong answers — we use these to time your days like you'd actually live them.</p>
                </div>

                <div className="space-y-5 max-h-[420px] overflow-y-auto pr-2">
                  {PROBE_QUESTIONS.map((q) => (
                    <div key={q.key} className="space-y-2">
                      <p className="text-sm font-medium">{q.question}</p>
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((opt) => {
                          const selected = (profile as any)[q.key] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setProfile({ ...profile, [q.key]: opt.value as any })}
                              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border-2 ${
                                selected
                                  ? "bg-sunset/15 border-sunset text-foreground"
                                  : "bg-background border-border hover:border-sunset/40 text-muted-foreground"
                              }`}
                            >
                              <span className="mr-1">{opt.emoji}</span>{opt.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Photography interest — slider */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Camera className="w-4 h-4 text-accent" /> Photography interest
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setProfile({ ...profile, photoInterest: n as any })}
                          className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${
                            profile.photoInterest >= n ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {profile.photoInterest <= 2 ? "Casual snaps" : profile.photoInterest === 3 ? "I take my time" : "I chase the frame"}
                    </p>
                  </div>
                </div>

                {/* Live archetype preview */}
                <motion.div
                  key={deriveArchetype(profile)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center bg-gradient-warm rounded-2xl p-4 border border-border"
                >
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Reading your profile…</p>
                  <p className="font-heading text-xl font-semibold text-primary mt-0.5">{deriveArchetype(profile)}</p>
                </motion.div>
              </motion.div>
            )}

            {/* Step 3 — Group + primary personality */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Users className="w-4 h-4 text-accent" /> Who's traveling?
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {GROUP_OPTIONS.map((opt) => (
                      <button
                        key={opt.id} type="button" onClick={() => handleGroupChange(opt.id)}
                        className={`p-4 rounded-2xl text-center transition-all border-2 ${
                          travelGroup === opt.id ? "bg-accent/10 border-accent active-glow" : "bg-background border-border hover:border-accent/40"
                        }`}
                      >
                        <p className="text-2xl mb-1">{opt.emoji}</p>
                        <p className="font-heading font-semibold text-sm">{opt.label}</p>
                        <p className="font-body text-[11px] text-muted-foreground mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-accent" /> {isGroup ? "Trip mood lead" : "Your travel personality"}
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {PERSONALITIES.map((p) => (
                      <button
                        key={p.id} type="button" onClick={() => setPrimaryPersonality(p.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all ${
                          primaryPersonality === p.id ? "bg-sunset/10 border-sunset" : "bg-background border-border hover:border-sunset/40"
                        }`}
                      >
                        <p className="font-heading font-semibold text-sm">{p.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {isGroup && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Group Harmony — a quick note on each traveler</Label>
                      <button
                        type="button" onClick={addTraveler} disabled={travelers.length >= 8}
                        className="text-xs font-medium text-accent hover:underline disabled:opacity-40 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    </div>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {travelers.map((t, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-background border border-border space-y-3">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder={`Traveler ${idx + 1} name`}
                              value={t.name}
                              onChange={(e) => updateTraveler(idx, { name: e.target.value })}
                              className="h-9 text-sm font-medium"
                            />
                            {travelers.length > GROUP_OPTIONS.find((o) => o.id === travelGroup)!.minCount && (
                              <button type="button" onClick={() => removeTraveler(idx)} className="p-2 rounded-lg hover:bg-muted">
                                <X className="w-3.5 h-3.5 text-muted-foreground" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={t.personality} onChange={(e) => updateTraveler(idx, { personality: e.target.value as Personality })}
                              className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                            >
                              {PERSONALITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                            </select>
                            <select
                              value={t.budgetComfort} onChange={(e) => updateTraveler(idx, { budgetComfort: e.target.value as TravelerProfile["budgetComfort"] })}
                              className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                            >
                              <option value="tight">Budget-conscious</option>
                              <option value="balanced">Balanced spender</option>
                              <option value="luxe">Loves luxe</option>
                            </select>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {INTERESTS.map((it) => (
                              <button
                                key={it} type="button" onClick={() => toggleTravelerInterest(idx, it)}
                                className={`px-2.5 py-1 rounded-full text-xs capitalize transition-all ${
                                  t.interests.includes(it) ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:bg-secondary"
                                }`}
                              >
                                {it}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 mt-6">
          <Button
            type="button" variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || isLoading}
            className="rounded-2xl"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Back
          </Button>

          <p className="text-xs text-muted-foreground">{STEPS[step]} · {step + 1} / {STEPS.length}</p>

          {step < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 active-glow"
            >
              Continue <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !destination.trim()}
              size="lg"
              className="rounded-2xl bg-gradient-sunset text-primary-foreground hover:opacity-95 shadow-glow active-glow"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Designing…
                </span>
              ) : (
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Generate itinerary</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TripForm;
