import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign, Compass, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface TripData {
  destination: string;
  days: number;
  budget: number;
  preferences: string[];
}

interface TripFormProps {
  onSubmit: (data: TripData) => void;
}

const PREFERENCES = [
  { id: "culture", label: "🏛️ Culture & History", icon: "🏛️" },
  { id: "nature", label: "🌿 Nature & Outdoors", icon: "🌿" },
  { id: "food", label: "🍜 Food & Cuisine", icon: "🍜" },
  { id: "adventure", label: "🧗 Adventure", icon: "🧗" },
  { id: "relaxation", label: "🧘 Relaxation", icon: "🧘" },
  { id: "nightlife", label: "🌙 Nightlife", icon: "🌙" },
];

const TripForm = ({ onSubmit }: TripFormProps) => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(1000);
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>([]);

  const togglePref = (id: string) => {
    setSelectedPrefs((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination, days, budget, preferences: selectedPrefs });
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
              placeholder="e.g. Bali, Tokyo, Paris..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="h-12 text-base font-body bg-background"
            />
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
                <DollarSign className="w-4 h-4 text-primary" />
                Budget (USD)
              </Label>
              <Input
                type="number"
                min={100}
                step={50}
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

          <Button type="submit" variant="hero" size="xl" className="w-full">
            <Sparkles className="w-5 h-5" />
            Generate My Itinerary
          </Button>
        </motion.form>
      </div>
    </section>
  );
};

export default TripForm;
