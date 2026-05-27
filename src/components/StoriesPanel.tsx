import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import type { TravelerStory } from "./ItineraryDisplay";
import { unsplashImg, onImgError } from "@/lib/imageFallback";

interface Props { destination: string; stories?: TravelerStory[]; embedded?: boolean; }

const FALLBACK: TravelerStory[] = [
  { title: "The kindest stranger",  snippet: "On a quiet street, a vendor handed me chai for free because I 'looked tired'. I still think about him.",       moodTag: "soulful",   author: "Aanya" },
  { title: "Sunrise nobody saw",     snippet: "I woke at 4am alone. The sky burned orange and the world felt new. It cost me nothing and changed everything.",     moodTag: "healing",   author: "Ravi" },
  { title: "A meal we don't forget", snippet: "We followed a child to a hidden thali joint. Three of us ate for ₹260. We still call it 'the meal'.",              moodTag: "social",    author: "Maya" },
];

const StoriesPanel = ({ destination, stories, embedded }: Props) => {
  const data = stories && stories.length ? stories : FALLBACK;

  return (
    <section className={embedded ? "py-6" : "py-24 bg-background"}>
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sunset/15 text-sunset text-xs font-medium tracking-wide uppercase mb-3">
            <Quote className="w-3.5 h-3.5" /> Traveler stories
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Tiny moments people took home from {destination}
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            The kind of memory no checklist can plan for.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {data.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
              className={`lift-card rounded-3xl overflow-hidden shadow-soft border border-border bg-card group ${i % 2 === 1 ? "md:translate-y-6" : ""}`}
            >
              <div className="h-44 overflow-hidden bg-muted">
                <img
                  src={unsplashImg(`${destination} ${s.moodTag || "travel"} moment`, 600, 400)}
                  alt={s.title} onError={onImgError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1400ms]"
                  loading="lazy"
                />
              </div>
              <div className="p-5">
                {s.moodTag && (
                  <span className="inline-block text-[10px] uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full mb-2">
                    {s.moodTag}
                  </span>
                )}
                <h3 className="font-heading text-lg font-semibold leading-snug mb-2 quote-rise">{s.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">"{s.snippet}"</p>
                {s.author && <p className="mt-3 text-xs text-foreground/60">— {s.author}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StoriesPanel;
