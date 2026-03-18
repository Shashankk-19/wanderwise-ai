import { motion } from "framer-motion";
import { Clock, MapPin, Utensils, Camera, Sun, Moon } from "lucide-react";
import type { TripData } from "./TripForm";

interface ItineraryDisplayProps {
  tripData: TripData;
}

const generateItinerary = (data: TripData) => {
  const activities: Record<string, { morning: string; afternoon: string; evening: string; spots: string[] }> = {
    default: {
      morning: "Explore the city center and visit iconic landmarks",
      afternoon: "Discover local markets and taste street food",
      evening: "Enjoy a sunset dinner with local cuisine",
      spots: ["City Center", "Local Market", "Sunset Point"],
    },
  };

  const destinations: Record<string, { morning: string; afternoon: string; evening: string; spots: string[] }[]> = {
    bali: [
      { morning: "Sunrise at Tegallalang Rice Terraces", afternoon: "Visit Ubud Monkey Forest & Art Market", evening: "Traditional Kecak dance at Uluwatu Temple", spots: ["Tegallalang", "Ubud", "Uluwatu"] },
      { morning: "Snorkeling at Nusa Penida", afternoon: "Explore Kelingking Beach & Angel's Billabong", evening: "Seafood BBQ on the beach", spots: ["Nusa Penida", "Kelingking Beach", "Jimbaran"] },
      { morning: "Tirta Empul water temple purification", afternoon: "Mount Batur area & coffee plantation", evening: "Spa & relaxation at resort", spots: ["Tirta Empul", "Mt. Batur", "Seminyak"] },
    ],
    tokyo: [
      { morning: "Tsukiji Outer Market breakfast", afternoon: "Senso-ji Temple & Asakusa district", evening: "Shibuya Crossing & nightlife", spots: ["Tsukiji", "Asakusa", "Shibuya"] },
      { morning: "Meiji Shrine & Harajuku", afternoon: "Akihabara electronics district", evening: "Ramen tasting in Shinjuku", spots: ["Harajuku", "Akihabara", "Shinjuku"] },
      { morning: "TeamLab Borderless digital art", afternoon: "Odaiba island exploration", evening: "Tokyo Tower night view", spots: ["TeamLab", "Odaiba", "Tokyo Tower"] },
    ],
    paris: [
      { morning: "Eiffel Tower at sunrise", afternoon: "Louvre Museum & Tuileries Gardens", evening: "Seine river dinner cruise", spots: ["Eiffel Tower", "Louvre", "Seine River"] },
      { morning: "Montmartre & Sacré-Cœur", afternoon: "Le Marais neighborhood walk", evening: "Wine tasting in Saint-Germain", spots: ["Montmartre", "Le Marais", "Saint-Germain"] },
      { morning: "Versailles Palace day trip", afternoon: "Versailles Gardens", evening: "Champs-Élysées evening stroll", spots: ["Versailles", "Versailles Gardens", "Champs-Élysées"] },
    ],
  };

  const key = data.destination.toLowerCase().trim();
  const matched = Object.keys(destinations).find((k) => key.includes(k));
  const dayTemplates = matched ? destinations[matched] : [activities.default];

  return Array.from({ length: data.days }, (_, i) => {
    const template = dayTemplates[i % dayTemplates.length];
    return {
      day: i + 1,
      ...template,
    };
  });
};

const ItineraryDisplay = ({ tripData }: ItineraryDisplayProps) => {
  const itinerary = generateItinerary(tripData);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Your {tripData.destination} Itinerary
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            {tripData.days} days · ${tripData.budget} budget
          </p>
        </motion.div>

        <div className="space-y-6">
          {itinerary.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold">
                  {day.day}
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">Day {day.day}</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <TimeBlock icon={Sun} label="Morning" text={day.morning} />
                <TimeBlock icon={Camera} label="Afternoon" text={day.afternoon} />
                <TimeBlock icon={Moon} label="Evening" text={day.evening} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {day.spots.map((spot) => (
                  <span key={spot} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body">
                    <MapPin className="w-3 h-3" />
                    {spot}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TimeBlock = ({ icon: Icon, label, text }: { icon: any; label: string; text: string }) => (
  <div className="flex gap-3 p-3 rounded-xl bg-background border border-border/50">
    <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
    <div>
      <p className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-body text-sm text-foreground mt-1">{text}</p>
    </div>
  </div>
);

export default ItineraryDisplay;
