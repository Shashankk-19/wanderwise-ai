import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Luggage, FileText, ShieldCheck, Mountain, Waves, Flame, Leaf } from "lucide-react";

interface TravelChecklistProps {
  destination?: string;
  tripType?: string; // mountains, beach, nightlife, spiritual, default
}

type ChecklistCategory = {
  icon: React.ElementType;
  title: string;
  items: string[];
};

const BASE_CHECKLIST: Record<string, ChecklistCategory> = {
  packing: {
    icon: Luggage,
    title: "Packing Essentials",
    items: ["Passport & copies", "Travel adapter", "Comfortable walking shoes", "Sunscreen & hat", "First aid kit", "Reusable water bottle", "Light rain jacket", "Phone charger & power bank"],
  },
  documents: {
    icon: FileText,
    title: "Documents",
    items: ["Valid passport", "Visa (if required)", "Travel insurance", "Flight tickets", "Hotel bookings", "Emergency contacts", "Travel itinerary printout"],
  },
  safety: {
    icon: ShieldCheck,
    title: "Safety & Misc",
    items: ["Register with embassy", "Share itinerary with family", "Download offline maps", "Learn basic local phrases", "Check vaccination requirements", "Notify bank of travel"],
  },
};

const THEME_EXTRAS: Record<string, { icon: React.ElementType; title: string; items: string[] }> = {
  mountains: {
    icon: Mountain,
    title: "Mountain Essentials",
    items: ["Warm layers & thermal wear", "Waterproof trekking boots", "Altitude sickness medicine", "Trekking poles", "Headlamp with spare batteries", "High-SPF lip balm & sunscreen", "Emergency whistle", "Snacks & trail mix"],
  },
  beach: {
    icon: Waves,
    title: "Beach Essentials",
    items: ["High-SPF reef-safe sunscreen", "Waterproof phone pouch", "Rashguard / swim cover-up", "Flip flops & water shoes", "After-sun lotion / aloe vera", "Insect repellent for evenings", "Dry bag for valuables", "Snorkeling gear (if not renting)"],
  },
  nightlife: {
    icon: Flame,
    title: "Nightlife Essentials",
    items: ["Smart casual outfit options", "Comfortable yet stylish shoes", "Portable phone charger", "Cash in local currency", "ID / passport copy for entry", "Earplugs for light sleepers", "Eye mask for late-morning sleep", "Hydration tablets / electrolytes"],
  },
  spiritual: {
    icon: Leaf,
    title: "Spiritual Travel",
    items: ["Modest clothing / head covering", "Comfortable sandals for temples", "Small offering items (flowers, incense)", "Journal for reflections", "Learn basic local greetings", "Silence your phone at sacred sites", "Donation cash in small bills", "Comfortable meditation cushion"],
  },
};

function getChecklist(destination: string = "", tripType: string = "default") {
  const dest = destination.toLowerCase();
  let detectedType = tripType;

  if (detectedType === "default" || !detectedType) {
    if (["manali", "shimla", "leh", "ladakh", "munnar", "ooty", "trek", "mountain", "hill"].some((k) => dest.includes(k))) {
      detectedType = "mountains";
    } else if (["goa", "bali", "maldives", "andaman", "beach", "island", "phuket", "varkala"].some((k) => dest.includes(k))) {
      detectedType = "beach";
    } else if (["dubai", "las vegas", "bangkok", "ibiza", "miami", "berlin", "nightlife"].some((k) => dest.includes(k))) {
      detectedType = "nightlife";
    } else if (["varanasi", "rishikesh", "haridwar", "tirupati", "amritsar", "spiritual", "ashram", "temple"].some((k) => dest.includes(k))) {
      detectedType = "spiritual";
    }
  }

  const categories: Record<string, ChecklistCategory> = { ...BASE_CHECKLIST };
  if (THEME_EXTRAS[detectedType]) {
    categories.theme = THEME_EXTRAS[detectedType];
  }

  return { categories, detectedType };
}

const TravelChecklist = ({ destination = "", tripType = "default" }: TravelChecklistProps) => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const { categories, detectedType } = useMemo(() => getChecklist(destination, tripType), [destination, tripType]);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const totalItems = Object.values(categories).reduce((acc, cat) => acc + cat.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  const themeLabel: Record<string, string> = {
    mountains: "Mountain trip",
    beach: "Beach trip",
    nightlife: "City & nightlife",
    spiritual: "Spiritual journey",
    default: "General travel",
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-4">
            {themeLabel[detectedType] || "General travel"}
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            {destination ? `Pack smart for ${destination}` : "Travel Checklist"}
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            {destination ? `Curated packing list for your ${themeLabel[detectedType]?.toLowerCase() || "trip"}.` : "Don't forget anything important."}
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
              <span>{checked.size} of {totalItems} items</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        <div className={`grid gap-6 ${Object.keys(categories).length === 4 ? "md:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
          {Object.entries(categories).map(([key, category], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-soft border border-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold text-foreground leading-snug">{category.title}</h3>
              </div>
              <ul className="space-y-2">
                {category.items.map((item) => (
                  <li key={item}>
                    <button
                      onClick={() => toggle(item)}
                      className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      {checked.has(item) ? (
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-muted-foreground/40 shrink-0" />
                      )}
                      <span className={`font-body text-sm ${checked.has(item) ? "text-muted-foreground line-through" : "text-foreground"}`}>
                        {item}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelChecklist;
