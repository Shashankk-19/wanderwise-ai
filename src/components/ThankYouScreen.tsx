import { useMemo } from "react";
import { motion } from "framer-motion";
import { Compass, RotateCcw, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";
import { unsplashImg, onImgError } from "@/lib/imageFallback";

interface Props {
  tripData: TripData;
  itinerary: GeneratedItinerary;
  onReset: () => void;
  embedded?: boolean;
}

const ThankYouScreen = ({ tripData, itinerary, onReset, embedded }: Props) => {
  const word = "Thank you".split("");
  const sub = "for travelling with Wanderly".split(" ");

  // Up to 4 polaroid images from the itinerary
  const polaroids = useMemo(() => {
    const kws = [
      itinerary.destinationInfo.imageKeyword,
      itinerary.days[0]?.morning.place,
      itinerary.days[Math.floor(itinerary.days.length / 2)]?.afternoon.place,
      itinerary.days[itinerary.days.length - 1]?.evening.place,
    ].filter(Boolean) as string[];
    return kws.slice(0, 4).map((k) => unsplashImg(`${k} ${tripData.destination}`, 500, 600));
  }, [itinerary, tripData.destination]);

  const dots = Array.from({ length: 22 }).map((_, i) => ({
    left: `${(i * 53) % 100}%`,
    size: 6 + ((i * 7) % 10),
    delay: `${(i * 0.4) % 6}s`,
    color: i % 3 === 0 ? "hsl(var(--accent))" : i % 3 === 1 ? "hsl(var(--sunset))" : "hsl(var(--primary))",
  }));

  return (
    <section className={embedded ? "py-6" : "py-24"}>
      <div className="relative container mx-auto px-6 max-w-4xl text-center min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Confetti */}
        {dots.map((d, i) => (
          <span
            key={i} className="confetti-dot"
            style={{ left: d.left, width: d.size, height: d.size, background: d.color, animationDelay: d.delay }}
          />
        ))}

        {/* Polaroid stack */}
        <div className="relative h-56 md:h-72 w-full mb-8 flex items-center justify-center">
          {polaroids.map((src, i) => {
            const rot = [-12, -4, 6, 14][i] ?? 0;
            const tx = [-140, -50, 50, 140][i] ?? 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, rotate: 0 }}
                animate={{ opacity: 1, y: 0, rotate: rot, x: tx }}
                transition={{ delay: 0.15 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute w-32 h-44 md:w-40 md:h-52 bg-card p-2 pb-6 rounded-md shadow-lift border border-border"
              >
                <img src={src} onError={onImgError} alt="" className="w-full h-full object-cover rounded-sm" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 rounded-2xl bg-gradient-sunset flex items-center justify-center shadow-glow active-glow mb-6"
        >
          <Compass className="w-8 h-8 text-primary-foreground" />
        </motion.div>

        <div className="flex overflow-hidden mb-3">
          {word.map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading text-4xl md:text-6xl font-bold tracking-tight bg-gradient-sunset bg-clip-text text-transparent"
            >
              {c === " " ? "\u00A0" : c}
            </motion.span>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }}
          className="font-body text-muted-foreground text-base md:text-lg mb-2"
        >
          {sub.join(" ")}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4, duration: 0.6 }}
          className="font-heading italic text-foreground/75 max-w-md mb-8"
        >
          "May your {tripData.destination} trip feel exactly like you hoped it would."
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button onClick={onReset} size="lg" className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 active-glow">
            <RotateCcw className="w-4 h-4 mr-2" /> Plan another trip
          </Button>
          <Button variant="outline" size="lg" className="rounded-2xl">
            <Heart className="w-4 h-4 mr-2" /> Saved to My Trips
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ThankYouScreen;
