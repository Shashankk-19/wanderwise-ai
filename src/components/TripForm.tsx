import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Compass, Sparkles, Users, Plus, X, Heart, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type TravelGroup = "solo" | "couple" | "family" | "friends";
export type Personality = "explorer" | "relaxer" | "foodie" | "thrill" | "culture" | "social";
export type EnergyLevel = "chill" | "balanced" | "packed";

export interface TravelerProfile {
  name: string;
  personality: Personality;
  budgetComfort: "tight" | "balanced" | "luxe";
  interests: string[]; // food, nightlife, adventure, culture, nature, shopping, spiritual
}

export interface TripData {
  destination: string;
  days: number;
  budget: number;
  preferences: string[];
  travelGroup: TravelGroup;
  energy: EnergyLevel;
  travelers: TravelerProfile[];
  primaryPersonality: Personality;
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const PREFERENCES = [
  { id: "culture", label: "Culture" },
  { id: "nature", label: "Nature" },
  { id: "food", label: "Food" },
  { id: "adventure", label: "Adventure" },
  { id: "relaxation", label: "Relaxation" },
  { id: "nightlife", label: "Nightlife" },
  { id: "spiritual", label: "Spiritual" },
  { id: "shopping", label: "Shopping" },
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

const ENERGY_OPTIONS: { id: EnergyLevel; label: string; desc: string }[] = [
  { id: "chill", label: "Chill", desc: "2–3 stops/day, long breaks" },
  { id: "balanced", label: "Balanced", desc: "4–5 stops, paced well" },
  { id: "packed", label: "Packed", desc: "Maximize every hour" },
];

const INTERESTS = ["food", "nightlife", "adventure", "culture", "nature", "shopping", "spiritual"];

const blankTraveler = (i: number): TravelerProfile => ({
  name: i === 0 ? "" : `Traveler ${i + 1}`,
  personality: "explorer",
  budgetComfort: "balanced",
  interests: [],
});

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(50000);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [travelGroup, setTravelGroup] = useState<TravelGroup>("solo");
  const [energy, setEnergy] = useState<EnergyLevel>("balanced");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    const data: TripData = {
      destination, days, budget,
      preferences: selectedPrefs,
      travelGroup, energy,
      travelers: isGroup ? travelers : [{ ...travelers[0], name: travelers[0].name || "You", personality: primaryPersonality }],
      primaryPersonality,
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
      <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />
      <div className="container mx-auto px-6 max-w-3xl relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-4">
            Personalized for you
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Where to next?
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            We design every hour around your energy, taste, and travel companions.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-card rounded-3xl p-8 shadow-soft border border-border space-y-8"
        >
          {/* Destination */}
          <div className="space-y-2">
            <Label className="font-body text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> Destination
            </Label>
            <Input
              placeholder="Goa, Manali, Bali, Kyoto..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 text-base bg-background"
            />
          </div>

          {/* Travel group */}
          <div className="space-y-3">
            <Label className="font-body text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-accent" /> Who's traveling?
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROUP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleGroupChange(opt.id)}
                  className={`p-4 rounded-2xl text-center transition-all border-2 ${
                    travelGroup === opt.id
                      ? "bg-accent/10 border-accent shadow-soft"
                      : "bg-background border-border hover:border-accent/40"
                  }`}
                >
                  <p className="font-heading font-semibold text-sm">{opt.label}</p>
                  <p className="font-body text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Days + Budget + Energy */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><Calendar className="w-4 h-4 text-accent" />Days</Label>
              <Input type="number" min={1} max={30} value={days} onChange={(e) => setDays(Number(e.target.value))} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4 text-accent" />Budget</Label>
              <Input type="number" min={5000} step={5000} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="h-12" />
            </div>
            <div className="space-y-2 col-span-2 sm:col-span-1">
              <Label className="text-sm font-medium flex items-center gap-2"><Battery className="w-4 h-4 text-accent" />Energy</Label>
              <div className="grid grid-cols-3 gap-1 h-12 bg-muted rounded-xl p-1">
                {ENERGY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setEnergy(opt.id)}
                    title={opt.desc}
                    className={`rounded-lg text-xs font-medium transition-all ${
                      energy === opt.id ? "bg-card text-foreground shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Primary personality (always shown) */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-accent" /> {isGroup ? "Trip mood" : "Your travel personality"}
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {PERSONALITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPrimaryPersonality(p.id)}
                  className={`text-left p-3 rounded-xl border-2 transition-all ${
                    primaryPersonality === p.id
                      ? "bg-sunset/10 border-sunset"
                      : "bg-background border-border hover:border-sunset/40"
                  }`}
                >
                  <p className="font-heading font-semibold text-sm">{p.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Group harmony — per traveler */}
          <AnimatePresence initial={false}>
            {isGroup && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Group Harmony — tell us about each traveler</Label>
                  <button
                    type="button"
                    onClick={addTraveler}
                    disabled={travelers.length >= 8}
                    className="text-xs font-medium text-accent hover:underline disabled:opacity-40 flex items-center gap-1"
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
                          <button type="button" onClick={() => removeTraveler(idx)} className="p-2 rounded-lg hover:bg-muted">
                            <X className="w-3.5 h-3.5 text-muted-foreground" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={t.personality}
                          onChange={(e) => updateTraveler(idx, { personality: e.target.value as Personality })}
                          className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
                        >
                          {PERSONALITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                        </select>
                        <select
                          value={t.budgetComfort}
                          onChange={(e) => updateTraveler(idx, { budgetComfort: e.target.value as TravelerProfile["budgetComfort"] })}
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
                            key={it}
                            type="button"
                            onClick={() => toggleTravelerInterest(idx, it)}
                            className={`px-2.5 py-1 rounded-full text-xs capitalize transition-all ${
                              t.interests.includes(it)
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted text-muted-foreground hover:bg-secondary"
                            }`}
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

          {/* Trip-wide preferences */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Compass className="w-4 h-4 text-accent" /> Vibes for the trip
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePref(pref.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all border ${
                    selectedPrefs.includes(pref.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" size="xl" className="w-full bg-gradient-sunset text-primary-foreground hover:opacity-95 shadow-glow" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Crafting your itinerary...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Generate My Itinerary
              </span>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default TripForm;
