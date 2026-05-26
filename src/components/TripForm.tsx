import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Compass, Sparkles, Users, Plus, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PersonalityQuiz, { type PersonalityProfile } from "./PersonalityQuiz";

export type TravelGroup = "solo" | "couple" | "family" | "friends";
export type TripMood =
  | "peaceful"
  | "healing"
  | "social"
  | "adventurous"
  | "luxury"
  | "soulful"
  | "dopamine-heavy"
  | "nature-detox"
  | "romantic"
  | "productive-escape"
  | "cultural-deep-dive"
  | "budget-smart";

export type Personality = "explorer" | "relaxer" | "foodie" | "thrill" | "culture" | "social";
export type EnergyLevel = "chill" | "balanced" | "packed";

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
  travelGroup: TravelGroup;
  moods: TripMood[];
  travelers: TravelerProfile[];
  primaryPersonality: Personality;
  personalityProfile?: PersonalityProfile;
  energy?: string;
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const TRIP_MOODS: { id: TripMood; label: string; desc: string; emoji: string; color: string }[] = [
  { id: "peaceful", label: "Peaceful", desc: "Slow mornings, stillness", emoji: "🕊️", color: "hsl(155, 22%, 52%)" },
  { id: "healing", label: "Healing", desc: "Reset, rest, come back whole", emoji: "🌿", color: "hsl(140, 30%, 48%)" },
  { id: "social", label: "Social", desc: "Connections, laughs, shared meals", emoji: "🫂", color: "hsl(22, 80%, 55%)" },
  { id: "adventurous", label: "Adventurous", desc: "Adrenaline, trails, unexplored", emoji: "⛰️", color: "hsl(200, 55%, 45%)" },
  { id: "luxury", label: "Luxury", desc: "Curated, elevated, effortless", emoji: "✨", color: "hsl(42, 70%, 50%)" },
  { id: "soulful", label: "Soulful", desc: "Meaning, depth, inner journey", emoji: "🕯️", color: "hsl(30, 45%, 50%)" },
  { id: "dopamine-heavy", label: "Dopamine Rush", desc: "Maximum stimulation, never boring", emoji: "🎆", color: "hsl(12, 85%, 60%)" },
  { id: "nature-detox", label: "Nature Detox", desc: "Zero screens, 100% sky", emoji: "🌲", color: "hsl(130, 35%, 42%)" },
  { id: "romantic", label: "Romantic", desc: "Sunset walks, candlelit dinners", emoji: "🌹", color: "hsl(355, 65%, 55%)" },
  { id: "productive-escape", label: "Productive Escape", desc: "Work meets wanderlust", emoji: "💻", color: "hsl(220, 45%, 50%)" },
  { id: "cultural-deep-dive", label: "Cultural Dive", desc: "History, art, local wisdom", emoji: "🏛️", color: "hsl(28, 55%, 48%)" },
  { id: "budget-smart", label: "Budget Smart", desc: "Stretch every rupee beautifully", emoji: "🎯", color: "hsl(160, 40%, 45%)" },
];

const PREFERENCES = [
  { id: "culture", label: "Culture", emoji: "🏛️" },
  { id: "nature", label: "Nature", emoji: "🌿" },
  { id: "food", label: "Food", emoji: "🍜" },
  { id: "adventure", label: "Adventure", emoji: "⛰️" },
  { id: "relaxation", label: "Relaxation", emoji: "🛁" },
  { id: "nightlife", label: "Nightlife", emoji: "🌙" },
  { id: "spiritual", label: "Spiritual", emoji: "🕌" },
  { id: "shopping", label: "Shopping", emoji: "🛍️" },
];

const GROUP_OPTIONS: { id: TravelGroup; label: string; desc: string; emoji: string; minCount: number }[] = [
  { id: "solo", label: "Solo", desc: "Just me", emoji: "🧍", minCount: 1 },
  { id: "couple", label: "Couple", desc: "2 travelers", emoji: "💑", minCount: 2 },
  { id: "family", label: "Family", desc: "3+ members", emoji: "👨‍👩‍👧", minCount: 3 },
  { id: "friends", label: "Friends", desc: "2-8 friends", emoji: "🫂", minCount: 2 },
];

const PERSONALITIES: { id: Personality; label: string; desc: string; emoji: string }[] = [
  { id: "explorer", label: "Explorer", desc: "Off-beat trails, hidden gems", emoji: "🗺️" },
  { id: "relaxer", label: "Relaxer", desc: "Slow mornings, cafes, spas", emoji: "🛋️" },
  { id: "foodie", label: "Foodie", desc: "Street food to fine dining", emoji: "🍜" },
  { id: "thrill", label: "Thrill-seeker", desc: "Adventure & adrenaline", emoji: "⛷️" },
  { id: "culture", label: "Culture lover", desc: "Heritage, art, museums", emoji: "🏛️" },
  { id: "social", label: "Social butterfly", desc: "Nightlife, meetups, energy", emoji: "🦋" },
];

const INTERESTS = ["food", "nightlife", "adventure", "culture", "nature", "shopping", "spiritual"];

const blankTraveler = (i: number): TravelerProfile => ({
  name: i === 0 ? "" : `Traveler ${i + 1}`,
  personality: "explorer",
  budgetComfort: "balanced",
  interests: [],
});

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [showQuiz, setShowQuiz] = useState(true);
  const [personalityProfile, setPersonalityProfile] = useState<PersonalityProfile | undefined>();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(50000);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [travelGroup, setTravelGroup] = useState<TravelGroup>("solo");
  const [selectedMoods, setSelectedMoods] = useState<TripMood[]>([]);
  const [primaryPersonality, setPrimaryPersonality] = useState<Personality>("explorer");
  const [travelers, setTravelers] = useState<TravelerProfile[]>([blankTraveler(0)]);

  const { user } = useAuth();
  const { toast } = useToast();

  const isGroup = travelGroup !== "solo";

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

  const updateTraveler = (idx: number, patch: Partial<TravelerProfile>) => {
    setTravelers((prev) => prev.map((t, i) => (i === idx ? { ...t, ...patch } : t)));
  };

  const toggleTravelerInterest = (idx: number, interest: string) => {
    setTravelers((prev) =>
      prev.map((t, i) =>
        i === idx
          ? { ...t, interests: t.interests.includes(interest) ? t.interests.filter((x) => x !== interest) : [...t.interests, interest] }
          : t
      )
    );
  };

  const addTraveler = () => travelers.length < 8 && setTravelers([...travelers, blankTraveler(travelers.length)]);
  const removeTraveler = (i: number) => setTravelers((prev) => prev.filter((_, idx) => idx !== i));

  const togglePref = (id: string) =>
    setSelectedPrefs((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));

  const toggleMood = (id: TripMood) =>
    setSelectedMoods((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : prev.length < 4 ? [...prev, id] : prev
    );

  const handleQuizComplete = (profile: PersonalityProfile) => {
    setPersonalityProfile(profile);
    setShowQuiz(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    const data: TripData = {
      destination,
      days,
      budget,
      preferences: selectedPrefs,
      travelGroup,
      moods: selectedMoods,
      energy: selectedMoods.length > 0 ? selectedMoods[0] : "balanced",
      travelers: isGroup ? travelers : [{ ...travelers[0], name: travelers[0].name || "You", personality: primaryPersonality }],
      primaryPersonality,
      personalityProfile,
    };
    onSubmit(data);

    if (user) {
      await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        preferences: data.preferences.join(", "),
      });
      toast({ title: "Trip saved", description: "Find it under My Trips." });
    }
  };

  return (
    <section id="planner" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-3 py-1 rounded-full bg-accent/12 text-accent text-xs font-medium tracking-wide uppercase mb-4"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            Emotionally intelligent travel
          </span>
          <h2
            className="text-4xl md:text-5xl font-bold text-foreground mb-3"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {showQuiz ? "First, let us know you" : "Where to next?"}
          </h2>
          <p className="text-muted-foreground text-lg" style={{ fontFamily: "var(--font-body)" }}>
            {showQuiz
              ? "10 questions to understand your travel DNA"
              : "We'll design every hour around your personality and energy."}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-card rounded-3xl p-8 shadow-soft border border-border"
        >
          <AnimatePresence mode="wait">
            {showQuiz ? (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <PersonalityQuiz onComplete={handleQuizComplete} onSkip={() => setShowQuiz(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35 }}
              >
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Destination */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                      <MapPin className="w-4 h-4 text-accent" /> Destination
                    </Label>
                    <Input
                      placeholder="Goa, Manali, Bali, Kyoto, Lisbon..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="h-12 text-base bg-background"
                      required
                    />
                  </div>

                  {/* Travel group */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                      <Users className="w-4 h-4 text-accent" /> Who's coming?
                    </Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {GROUP_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleGroupChange(opt.id)}
                          className={`p-4 rounded-2xl text-center transition-all border-2 card-warm-hover ${
                            travelGroup === opt.id
                              ? "bg-accent/12 border-accent mood-active"
                              : "bg-background border-border"
                          }`}
                        >
                          <div className="text-2xl mb-1">{opt.emoji}</div>
                          <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-ui)" }}>{opt.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Days + Budget */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                        <Calendar className="w-4 h-4 text-accent" /> Days
                      </Label>
                      <Input
                        type="number"
                        min={1}
                        max={30}
                        value={days}
                        onChange={(e) => setDays(Number(e.target.value))}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                        <IndianRupee className="w-4 h-4 text-accent" /> Budget (INR)
                      </Label>
                      <Input
                        type="number"
                        min={5000}
                        step={5000}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* Trip Moods */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                      <Heart className="w-4 h-4 text-accent" /> Trip Mood
                      <span className="ml-auto text-xs text-muted-foreground font-normal">Pick up to 4</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {TRIP_MOODS.map((mood) => {
                        const selected = selectedMoods.includes(mood.id);
                        const maxReached = !selected && selectedMoods.length >= 4;
                        return (
                          <motion.button
                            key={mood.id}
                            type="button"
                            onClick={() => !maxReached && toggleMood(mood.id)}
                            whileHover={!maxReached ? { y: -2 } : {}}
                            whileTap={!maxReached ? { scale: 0.97 } : {}}
                            className={`p-3 rounded-xl text-left transition-all border-2 relative overflow-hidden ${
                              selected
                                ? "border-accent bg-accent/10 mood-active"
                                : maxReached
                                  ? "border-border bg-background opacity-40 cursor-not-allowed"
                                  : "border-border bg-background hover:border-accent/40"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{mood.emoji}</span>
                              <div>
                                <p className="font-semibold text-xs leading-tight" style={{ fontFamily: "var(--font-ui)" }}>{mood.label}</p>
                                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{mood.desc}</p>
                              </div>
                              {selected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto w-4 h-4 rounded-full bg-accent flex items-center justify-center shrink-0"
                                >
                                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                    {selectedMoods.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="flex flex-wrap gap-1.5 pt-1"
                      >
                        {selectedMoods.map((m) => {
                          const mood = TRIP_MOODS.find((x) => x.id === m)!;
                          return (
                            <span
                              key={m}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                              style={{ background: `${mood.color}25`, color: mood.color, fontFamily: "var(--font-ui)" }}
                            >
                              {mood.emoji} {mood.label}
                              <button type="button" onClick={() => toggleMood(m)} className="ml-0.5 opacity-70 hover:opacity-100">
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>

                  {/* Primary personality */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                      <Compass className="w-4 h-4 text-accent" /> {isGroup ? "Trip style" : "Your travel personality"}
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {PERSONALITIES.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setPrimaryPersonality(p.id)}
                          className={`text-left p-3 rounded-xl border-2 transition-all card-warm-hover ${
                            primaryPersonality === p.id
                              ? "bg-accent/10 border-accent mood-active"
                              : "bg-background border-border"
                          }`}
                        >
                          <div className="text-xl mb-1">{p.emoji}</div>
                          <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-ui)" }}>{p.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Group harmony */}
                  <AnimatePresence initial={false}>
                    {isGroup && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium" style={{ fontFamily: "var(--font-ui)" }}>
                            Group harmony
                          </Label>
                          <button
                            type="button"
                            onClick={addTraveler}
                            disabled={travelers.length >= 8}
                            className="text-xs font-medium text-accent hover:underline disabled:opacity-40 flex items-center gap-1"
                            style={{ fontFamily: "var(--font-ui)" }}
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                        <div className="space-y-3">
                          {travelers.map((t, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="p-4 rounded-2xl bg-background border border-border space-y-3"
                            >
                              <div className="flex items-center gap-2">
                                <Input
                                  placeholder={`Traveler ${idx + 1} name`}
                                  value={t.name}
                                  onChange={(e) => updateTraveler(idx, { name: e.target.value })}
                                  className="h-9 text-sm font-medium"
                                />
                                {travelers.length > GROUP_OPTIONS.find((o) => o.id === travelGroup)!.minCount && (
                                  <button
                                    type="button"
                                    onClick={() => removeTraveler(idx)}
                                    className="p-2 rounded-lg hover:bg-muted"
                                  >
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                  </button>
                                )}
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <select
                                  value={t.personality}
                                  onChange={(e) => updateTraveler(idx, { personality: e.target.value as Personality })}
                                  className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  {PERSONALITIES.map((p) => (
                                    <option key={p.id} value={p.id}>
                                      {p.emoji} {p.label}
                                    </option>
                                  ))}
                                </select>
                                <select
                                  value={t.budgetComfort}
                                  onChange={(e) =>
                                    updateTraveler(idx, { budgetComfort: e.target.value as TravelerProfile["budgetComfort"] })
                                  }
                                  className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                                  style={{ fontFamily: "var(--font-body)" }}
                                >
                                  <option value="tight">Budget-conscious</option>
                                  <option value="balanced">Balanced spender</option>
                                  <option value="luxe">Loves luxe</option>
                                </select>
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {INTERESTS.map((it) => (
                                  <button
                                    key={it}
                                    type="button"
                                    onClick={() => toggleTravelerInterest(idx, it)}
                                    className={`px-2.5 py-1 rounded-full text-xs capitalize transition-all ${
                                      t.interests.includes(it)
                                        ? "bg-accent text-accent-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-secondary"
                                    }`}
                                    style={{ fontFamily: "var(--font-ui)" }}
                                  >
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

                  {/* Preferences */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: "var(--font-ui)" }}>
                      <Sparkles className="w-4 h-4 text-accent" /> Experiences you want
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {PREFERENCES.map((pref) => (
                        <button
                          key={pref.id}
                          type="button"
                          onClick={() => togglePref(pref.id)}
                          className={`px-4 py-2 rounded-full text-sm transition-all border flex items-center gap-1.5 ${
                            selectedPrefs.includes(pref.id)
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:border-accent/40"
                          }`}
                          style={{ fontFamily: "var(--font-ui)" }}
                        >
                          <span>{pref.emoji}</span> {pref.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {personalityProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-secondary border border-border"
                    >
                      <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center text-accent text-sm">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground" style={{ fontFamily: "var(--font-ui)" }}>
                          Personality profile saved
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Your psychology will shape every recommendation
                        </p>
                      </div>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    size="xl"
                    className="w-full bg-gradient-warm text-primary-foreground hover:opacity-95 btn-glow border-0"
                    disabled={isLoading}
                    style={{ fontFamily: "var(--font-ui)" }}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Crafting your journey...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5" /> Generate My Itinerary
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default TripForm;
