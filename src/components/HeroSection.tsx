import { motion } from "framer-motion";
import { MapPin, Sparkles } from "lucide-react";

interface Props { onGetStarted: () => void; }

const FLOATING_DESTINATIONS = [
  { name: "Manali", img: "manali,himalaya", className: "top-[18%] left-[6%] w-32 h-44 float-slow" },
  { name: "Goa", img: "goa,beach,sunset", className: "top-[60%] left-[4%] w-28 h-36 float-slower" },
  { name: "Kyoto", img: "kyoto,temple", className: "top-[14%] right-[8%] w-32 h-44 float-slower" },
  { name: "Varanasi", img: "varanasi,ghats", className: "top-[58%] right-[6%] w-28 h-36 float-slow" },
];

const HeroSection = ({ onGetStarted }: Props) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
      {/* Glow backdrop */}
      <div className="absolute inset-0 bg-gradient-glow" />

      {/* Floating destination cards (hidden on mobile) */}
      {FLOATING_DESTINATIONS.map((d, i) => (
        <motion.div
          key={d.name}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 + i * 0.15, duration: 0.8 }}
          className={`hidden lg:block absolute rounded-2xl overflow-hidden shadow-lift border border-border/60 ${d.className}`}
        >
          <img
            src={`https://source.unsplash.com/300x400/?${encodeURIComponent(d.img)}`}
            alt={d.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
          <div className="absolute bottom-2 left-2 text-primary-foreground text-xs font-heading font-semibold tracking-wide">{d.name}</div>
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-6 border border-accent/20">
            <Sparkles className="w-3.5 h-3.5" /> Emotionally intelligent travel planning
          </span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-[5.5rem] font-bold text-foreground mb-6 leading-[1.05] tracking-tight">
            Travel that finally
            <br />
            <span className="bg-gradient-sunset bg-clip-text text-transparent">feels like you</span>
          </h1>
          <p className="font-body text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Wanderly designs every hour around your personality, energy, and travel companions —
            with hidden gems, real warnings, and a budget that actually adds up.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 h-14 px-10 text-base rounded-2xl font-medium bg-primary text-primary-foreground shadow-lift hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
          >
            <MapPin className="w-5 h-5" /> Plan my trip
          </button>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 h-14 px-8 text-base rounded-2xl font-medium text-foreground hover:bg-muted transition-colors"
          >
            See how it works →
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-20 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
          {["Personality-aware", "Energy-paced", "Hidden gems", "Real warnings", "Group harmony"].map((tag) => (
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
