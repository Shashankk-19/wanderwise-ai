import { motion } from "framer-motion";
import { MapPin, Calendar, DollarSign } from "lucide-react";
import heroImage from "@/assets/hero-travel.jpg";

interface HeroSectionProps {
  onGetStarted: () => void;
}

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful travel destination at golden hour"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-primary-foreground text-sm font-body mb-6 backdrop-blur-sm border border-primary-foreground/10">
            AI-Powered Travel Planning
          </span>
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-primary-foreground mb-6 leading-tight">
            Plan Your Dream
            <br />
            <span className="text-primary">Adventure</span>
          </h1>
          <p className="font-body text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            Generate complete personalized itineraries, optimize your budget, and discover hidden gems — all in one place.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 h-14 px-10 text-lg rounded-xl font-body font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <MapPin className="w-5 h-5" />
            Start Planning
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16"
        >
          {[
            { icon: MapPin, label: "Destinations", value: "500+" },
            { icon: Calendar, label: "Trips Planned", value: "10K+" },
            { icon: DollarSign, label: "Avg. Saved", value: "30%" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <p className="font-heading text-2xl font-bold text-primary-foreground">{stat.value}</p>
                <p className="font-body text-sm text-primary-foreground/60">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
