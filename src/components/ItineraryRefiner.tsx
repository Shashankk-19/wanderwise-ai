import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Wand2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";

const REFINE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refine-itinerary`;

interface Props {
  tripData: TripData;
  itinerary: GeneratedItinerary;
  onUpdate: (next: GeneratedItinerary) => void;
}

const SUGGESTIONS = [
  "Make day 2 more relaxing",
  "Swap evening activity on day 1 for something local",
  "Add more food experiences",
  "Cut a tourist-heavy spot",
];

const ItineraryRefiner = ({ tripData, itinerary, onUpdate }: Props) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const refine = async (instruction: string) => {
    if (!instruction.trim() || loading) return;
    setLoading(true);
    try {
      const resp = await fetch(REFINE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ itinerary, instruction, tripData }),
      });
      if (!resp.ok) throw new Error("refine failed");
      const next = await resp.json();
      onUpdate(next);
      setInput("");
      toast({ title: "Itinerary updated", description: "Your changes are in." });
    } catch {
      toast({ title: "Couldn't refine", description: "Please try a different instruction.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card rounded-3xl p-8 border border-border shadow-soft"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-ocean flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold">Tweak it, in plain English</h3>
              <p className="text-sm text-muted-foreground">Tell Wanderly what to change — it'll rebuild instantly.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); refine(input); }}
            className="flex gap-2 mt-5"
          >
            <Input
              placeholder='e.g. "Make day 3 quieter" or "Add a sunset point on day 2"'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-12 text-base bg-background"
              disabled={loading}
            />
            <Button type="submit" size="lg" disabled={loading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
              {loading ? (
                <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </form>

          <div className="flex flex-wrap gap-2 mt-4">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                disabled={loading}
                onClick={() => refine(s)}
                className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-accent/15 hover:text-accent transition-colors disabled:opacity-40"
              >
                {s}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ItineraryRefiner;
