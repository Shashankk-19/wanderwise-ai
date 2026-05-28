import { motion } from "framer-motion";
import { PiggyBank, Sparkles } from "lucide-react";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface Props { itinerary?: GeneratedItinerary; destination: string; }

const CostSavingTips = ({ itinerary, destination }: Props) => {
  const tips = itinerary?.costSavingTips || [];
  if (!tips.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-3">
            Local intelligence
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-3">Smart Cost-Saving Hacks</h2>
          <p className="text-muted-foreground text-lg">Insider moves that work in {destination}.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map((tip, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="lift-card bg-card rounded-3xl p-6 border border-border shadow-soft relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-accent/10 blur-2xl" />
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-base">{tip.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{tip.detail}</p>
              {tip.savesAround && (
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sunset/10 text-sunset text-xs font-medium">
                  <Sparkles className="w-3 h-3" /> Saves ~{tip.savesAround}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CostSavingTips;
