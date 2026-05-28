import { motion } from "framer-motion";
import { Sparkles, Heart, Plane } from "lucide-react";

interface Props { onReplan: () => void; destination?: string; }

const QUOTES = [
  "Travel far enough, you meet yourself.",
  "Collect moments, not things.",
  "The journey is the destination.",
];

const ThankYou = ({ onReplan, destination }: Props) => {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  return (
    <section className="min-h-[80vh] flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-gradient-glow opacity-60" />

      {/* Soft floating bokeh */}
      {[...Array(6)].map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full bg-accent/20 blur-2xl"
          style={{ width: 80 + i * 30, height: 80 + i * 30, left: `${10 + i * 14}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 text-center container mx-auto px-6 max-w-2xl">
        <motion.div initial={{ scale: 0, rotate: -10 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-gradient-sunset flex items-center justify-center shadow-glow">
          <Plane className="w-10 h-10 text-primary-foreground -rotate-45" />
        </motion.div>

        <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Thank you for using
          <br /><span className="bg-gradient-sunset bg-clip-text text-transparent">Wanderly</span>
        </motion.h2>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
          className="font-body text-lg text-muted-foreground mb-3">
          {destination ? `May ${destination} surprise you in all the right ways.` : "May the world surprise you in all the right ways."}
        </motion.p>

        <motion.blockquote initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
          className="font-heading italic text-xl text-accent mb-10 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4" /> "{quote}" <Sparkles className="w-4 h-4" />
        </motion.blockquote>

        <motion.button
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}
          onClick={onReplan}
          className="inline-flex items-center gap-2 h-14 px-10 text-base rounded-2xl font-medium bg-primary text-primary-foreground shadow-lift hover:shadow-glow hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 btn-glow">
          <Heart className="w-5 h-5" /> Plan another trip
        </motion.button>
      </div>
    </section>
  );
};

export default ThankYou;
