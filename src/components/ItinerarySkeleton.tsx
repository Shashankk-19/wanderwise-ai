import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Compass } from "lucide-react";

const QUOTES = [
  "“We travel not to escape life, but for life not to escape us.”",
  "“The world is a book, and those who do not travel read only one page.”",
  "“Adventure is worthwhile in itself.”",
  "“Travel is the only thing you buy that makes you richer.”",
  "“To travel is to live, gently and fully.”",
  "“Wherever you go, go with all your heart.”",
];

const PHASES = [
  "Reading the rhythm of your group…",
  "Searching for hidden gems locals love…",
  "Pricing the costs no one warns you about…",
  "Pacing the days to match your energy…",
  "Mapping every restaurant + hotel…",
];

const ItinerarySkeleton = () => {
  const [phase, setPhase] = useState(0);
  const [quote, setQuote] = useState(0);

  useEffect(() => {
    const p = setInterval(() => setPhase((x) => (x + 1) % PHASES.length), 2200);
    const q = setInterval(() => setQuote((x) => (x + 1) % QUOTES.length), 3400);
    return () => { clearInterval(p); clearInterval(q); };
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="relative rounded-3xl overflow-hidden h-72 md:h-[420px] mb-10 bg-primary">
          <div className="absolute inset-0 bg-gradient-glow opacity-80" />
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 500">
            <motion.path
              d="M 30 380 Q 220 100 480 240 T 970 120"
              stroke="hsl(var(--accent))" strokeWidth="3" fill="none" className="route-line"
            />
            <motion.circle
              r="8" fill="hsl(var(--sunset))"
              initial={{ offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ offsetPath: "path('M 30 380 Q 220 100 480 240 T 970 120')" } as any}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-primary-foreground px-6 text-center">
            <motion.div
              animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="w-14 h-14 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-glow active-glow"
            >
              <Compass className="w-7 h-7" />
            </motion.div>
            <p className="font-heading text-xl font-semibold">Designing your journey…</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={phase}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="font-body text-sm opacity-80"
              >
                {PHASES[phase]}
              </motion.p>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={quote}
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.6 }}
                className="font-heading italic text-base md:text-lg opacity-70 max-w-md mt-2"
              >
                {QUOTES[quote]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              className="bg-card rounded-3xl border border-border overflow-hidden shadow-soft"
            >
              <div className="h-20 shimmer" />
              <div className="p-6 space-y-3">
                <div className="grid md:grid-cols-3 gap-3">
                  {[0, 1, 2].map((j) => <div key={j} className="h-24 rounded-2xl shimmer" />)}
                </div>
                <div className="h-12 rounded-xl shimmer" />
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="h-16 rounded-xl shimmer" />
                  <div className="h-16 rounded-xl shimmer" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ItinerarySkeleton;
