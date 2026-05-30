import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface Props { itinerary?: GeneratedItinerary; destination: string; }

const TravelerStories = ({ itinerary, destination }: Props) => {
  const stories = itinerary?.travelerStories || [];
  if (!stories.length) return null;

  return (
    <section className="py-16 bg-secondary/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-sunset/10 text-sunset text-xs font-medium tracking-wide uppercase mb-3">
            Emotional moments
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-3">Stories from Travelers</h2>
          <p className="text-muted-foreground text-lg">Real feelings, real moments in {destination}.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((s, i) => (
            <motion.figure key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="lift-card bg-card rounded-3xl shadow-soft border border-border p-6 flex flex-col">
              <Quote className="w-7 h-7 text-sunset mb-3" />
              <blockquote className="font-heading text-lg italic leading-snug mb-4">"{s.quote}"</blockquote>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">{s.story}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-gradient-ocean flex items-center justify-center text-primary-foreground font-heading font-bold text-sm">
                  {s.name.slice(0, 1)}
                </div>
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="text-xs text-accent capitalize">felt {s.feeling}</p>
                </div>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelerStories;
