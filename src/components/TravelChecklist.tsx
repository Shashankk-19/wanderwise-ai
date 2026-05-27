import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Luggage } from "lucide-react";
import type { ChecklistCategory } from "./ItineraryDisplay";

interface Props {
  destination?: string;
  packingChecklist?: ChecklistCategory[];
  embedded?: boolean;
}

const DEFAULT_CHECKLIST: ChecklistCategory[] = [
  { category: "Documents",         items: ["Govt ID + photocopies", "Travel insurance", "Booking confirmations", "Emergency contacts"] },
  { category: "Weather-specific",  items: ["Layered clothing", "Light rain jacket", "Sunscreen & hat"] },
  { category: "Activity-specific", items: ["Comfortable walking shoes", "Daypack", "Reusable water bottle"] },
  { category: "Health & Medicine", items: ["Personal medications", "Basic first-aid kit", "Hand sanitizer"] },
  { category: "Tech & Power",      items: ["Phone charger", "Power bank", "Universal adapter"] },
  { category: "Local essentials",  items: ["Cash + UPI ready", "Offline maps downloaded", "Translator app"] },
];

const TravelChecklist = ({ destination, packingChecklist, embedded }: Props) => {
  const list = useMemo(() => (packingChecklist && packingChecklist.length ? packingChecklist : DEFAULT_CHECKLIST), [packingChecklist]);
  const storageKey = `wanderly_checklist_${(destination || "default").toLowerCase()}`;

  const [checked, setChecked] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setChecked(new Set(JSON.parse(raw)));
      else setChecked(new Set());
    } catch { setChecked(new Set()); }
  }, [storageKey]);

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      try { localStorage.setItem(storageKey, JSON.stringify(Array.from(next))); } catch {}
      return next;
    });
  };

  const totalItems = list.reduce((acc, cat) => acc + cat.items.length, 0);
  const progress = totalItems ? Math.round((checked.size / totalItems) * 100) : 0;

  return (
    <section className={embedded ? "py-6" : "py-24 bg-background"}>
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium tracking-wide uppercase mb-3">
            <Luggage className="w-3.5 h-3.5" /> Smart packing
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-3">
            Packed for {destination || "the trip"}
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Tuned to the weather, the activities, and the local quirks.
          </p>
          <div className="mt-6 max-w-xs mx-auto">
            <div className="flex justify-between font-body text-sm text-muted-foreground mb-2">
              <span>{checked.size} of {totalItems} packed</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-sunset"
                initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((category, idx) => (
            <motion.div
              key={category.category + idx}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="lift-card bg-card rounded-2xl p-6 shadow-soft border border-border"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-base font-semibold text-foreground">{category.category}</h3>
                <span className="text-[11px] text-muted-foreground">{category.items.length}</span>
              </div>
              <ul className="space-y-1.5">
                {category.items.map((item) => {
                  const isChecked = checked.has(item);
                  return (
                    <li key={item}>
                      <button
                        onClick={() => toggle(item)}
                        className="flex items-center gap-3 w-full text-left p-2 rounded-lg hover:bg-secondary/60 transition-colors"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-4.5 h-4.5 text-accent shrink-0" />
                        ) : (
                          <Circle className="w-4.5 h-4.5 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={`font-body text-sm ${isChecked ? "text-muted-foreground line-through" : "text-foreground"}`}>
                          {item}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TravelChecklist;
