import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

interface Props { onGetStarted: () => void; }

const FLOATING_DESTINATIONS = [
  {
    name: "Manali",
    src: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400",
    className: "top-[18%] left-[6%] w-32 h-44 float-slow",
  },
  {
    name: "Goa",
    src: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=400",
    className: "top-[60%] left-[4%] w-28 h-36 float-slower",
  },
  {
    name: "Kyoto",
    src: "https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400",
    className: "top-[14%] right-[8%] w-32 h-44 float-slower",
  },
  {
    name: "Varanasi",
    src: "https://images.pexels.com/photos/3581369/pexels-photo-3581369.jpeg?auto=compress&cs=tinysrgb&w=400",
    className: "top-[58%] right-[6%] w-28 h-36 float-slow",
  },
];

const HeroSection = ({ onGetStarted }: Props) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      <div className="absolute inset-0 bg-gradient-glow" />

      {/* Floating destination cards */}
      {FLOATING_DESTINATIONS.map((d, i) => (
        <motion.div
          key={d.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.8 }}
          className={`hidden lg:block absolute rounded-2xl overflow-hidden shadow-lift border border-border/60 ${d.className}`}
        >
          <img
            src={d.src}
            alt={d.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
          <div
            className="absolute bottom-2 left-2 text-primary-foreground text-xs font-semibold tracking-wide"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            {d.name}
          </div>
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/12 text-accent text-xs font-medium tracking-wide uppercase mb-6 border border-accent/20"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Emotionally intelligent travel planning
          </span>
          <h1
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-foreground mb-6 leading-[1.05]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Travel that finally
            <br />
            <span className="bg-gradient-warm bg-clip-text text-transparent">feels like you</span>
          </h1>
          <p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Wanderly designs every hour around your personality, psychology, and travel companions —
            with hidden gems, real warnings, and a budget that actually adds up.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center"
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 h-14 px-10 text-base rounded-2xl font-medium bg-gradient-warm text-primary-foreground shadow-lift btn-glow active:scale-[0.98] transition-all duration-300"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            <MapPin className="w-5 h-5" /> Plan my trip
          </button>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 h-14 px-8 text-base rounded-2xl font-medium text-foreground hover:bg-muted transition-colors"
            style={{ fontFamily: "var(--font-ui)" }}
          >
            See how it works →
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-muted-foreground"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {["Personality-aware", "Mood-curated", "Hidden gems", "Real warnings", "Group harmony", "Cost-saving tips"].map((tag) => (
            <span key={tag} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" /> {tag}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
