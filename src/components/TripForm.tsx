import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, IndianRupee, Compass, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type TravelGroup = "solo" | "couple" | "family" | "friends";

export interface TripData {
  destination: string;
  days: number;
  budget: number;
  preferences: string[];
  travelGroup: TravelGroup;
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
  isLoading?: boolean;
}

const PREFERENCES = [
  { id: "culture", label: "🏛️ Culture & History" },
  { id: "nature", label: "🌿 Nature & Outdoors" },
  { id: "food", label: "🍜 Food & Cuisine" },
  { id: "adventure", label: "🧗 Adventure" },
  { id: "relaxation", label: "🧘 Relaxation" },
  { id: "nightlife", label: "🌙 Nightlife" },
];

const GROUP_OPTIONS: { id: TravelGroup; label: string; emoji: string; desc: string }[] = [
  { id: "solo", label: "Solo", emoji: "🧳", desc: "Just me" },
  { id: "couple", label: "Couple", emoji: "💑", desc: "2 people" },
  { id: "family", label: "Family", emoji: "👨‍👩‍👧‍👦", desc: "3-6 people" },
  { id: "friends", label: "Friends", emoji: "👯", desc: "2-8 people" },
];

const TripForm = ({ onSubmit, isLoading }: TripFormProps) => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(50000);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);
  const [travelGroup, setTravelGroup] = useState<TravelGroup>("solo");
  const { user } = useAuth();
  const { toast } = useToast();

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    const data: TripData = { destination, days, budget, preferences: selectedPrefs, travelGroup };
    onSubmit(data);

    if (user) {
      await supabase.from("saved_trips").insert({
        user_id: user.id,
        destination: data.destination,
        days: data.days,
        budget: data.budget,
        preferences: data.preferences.join(", "),
      });
      toast({ title: "Trip saved!", description: "You can find it in your saved trips." });
    }
  };

  return (
    <section id="planner" className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Where to next?
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Tell us about your dream trip and we'll handle the rest.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card rounded-2xl p-8 shadow-[var(--shadow-card)] border border-border space-y-6"
        >
          {/* Destination */}
          <div className="space-y-2">
            <Label className="font-body text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              Destination
            </Label>
            <Input
              placeholder="e.g. Goa, Jaipur, Bali, Paris..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 text-base font-body bg-background"
            />
          </div>

          {/* Travel Group */}
          <div className="space-y-3">
            <Label className="font-body text-sm font-medium text-foreground flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Who's traveling?
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {GROUP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTravelGroup(opt.id)}
                  className={`relative flex flex-col items-center gap-1.5 p-4 rounded-xl text-center transition-all duration-200 border-2 ${
                    travelGroup === opt.id
                      ? "bg-primary/10 border-primary shadow-sm"
                      : "bg-background border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-body text-sm font-medium text-foreground">{opt.label}</span>
                  <span className="font-body text-xs text-muted-foreground">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Days & Budget */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                Days
              </Label>
              <Input
                type="number"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="h-12 text-base font-body bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-body text-sm font-medium text-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-primary" />
                Budget (₹ INR)
              </Label>
              <Input
                type="number"
                min={5000}
                step={5000}
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="h-12 text-base font-body bg-background"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <Label className="font-body text-sm font-medium text-foreground flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              Travel Preferences
            </Label>
            <div className="flex flex-wrap gap-2">
              {PREFERENCES.map((pref) => (
                <button
                  key={pref.id}
                  type="button"
                  onClick={() => togglePref(pref.id)}
                  className={`px-4 py-2 rounded-full text-sm font-body transition-all duration-200 border ${
                    selectedPrefs.includes(pref.id)
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/30"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Generating your itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Itinerary
              </>
            )}
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default TripForm;
