import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Luggage, FileText, ShieldCheck, Cloud, Mountain } from "lucide-react";
import type { ChecklistData } from "./ItineraryDisplay";

const DEFAULTS: Required<Omit<ChecklistData, "weatherSummary">> = {
  packing: ["Passport & copies", "Travel adapter", "Comfortable walking shoes", "Sunscreen & hat", "First aid kit", "Reusable water bottle", "Phone charger & power bank"],
  documents: ["Valid passport", "Visa (if required)", "Travel insurance", "Flight tickets", "Hotel bookings", "Emergency contacts"],
  activitySpecific: ["Comfortable shoes for walking", "Day backpack", "Camera or phone with storage"],
  safety: ["Share itinerary with family", "Download offline maps", "Learn basic local phrases", "Notify bank of travel"],
};

interface Props { checklist?: ChecklistData; destination?: string; }

const TravelChecklist = ({ checklist, destination }: Props) => {
  const data = useMemo(() => ({
    packing: checklist?.packing?.length ? checklist.packing : DEFAULTS.packing,
    documents: checklist?.documents?.length ? checklist.documents : DEFAULTS.documents,
    activitySpecific: checklist?.activitySpecific?.length ? checklist.activitySpecific : DEFAULTS.activitySpecific,
    safety: checklist?.safety?.length ? checklist.safety : DEFAULTS.safety,
  }), [checklist]);

  const categories = [
    { key: "packing", icon: Luggage, title: "Packing Essentials", items: data.packing },
    { key: "activitySpecific", icon: Mountain, title: "Activity-Specific", items: data.activitySpecific },
    { key: "documents", icon: FileText, title: "Documents", items: data.documents },
    { key: "safety", icon: ShieldCheck, title: "Safety & Misc", items: data.safety },
  ];

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const toggle = (item: string) => setChecked((prev) => {
    const next = new Set(prev);
    next.has(item) ? next.delete(item) : next.add(item);
    return next;
  });

  const total = categories.reduce((a, c) => a + c.items.length, 0);
  const progress = total ? Math.round((checked.size / total) * 100) : 0;

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">Travel Checklist</h2>
          <p className="font-body text-muted-foreground text-lg">
            {destination ? `Tailored for ${destination}` : "Don't forget anything important"}
          </p>
          {checklist?.weatherSummary && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm">
              <Cloud className="w-4 h-4" /> {checklist.weatherSummary}
            </div>
          )}
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
              <span>{checked.size} of {total} items</span><span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, idx) => (
            <motion.div key={cat.key}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="lift-card bg-card rounded-2xl p-6 shadow-soft border border-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <cat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-base font-semibold">{cat.title}</h3>
              </div>
              <ul className="space-y-1.5">
                {cat.items.map((item) => (
                  <li key={item}>
                    <button onClick={() => toggle(item)}
                      className="flex items-start gap-2 w-full text-left p-1.5 rounded-lg hover:bg-secondary/50 transition-colors">
                      {checked.has(item)
                        ? <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        : <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />}
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
