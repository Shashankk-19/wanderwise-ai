import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Luggage, FileText, ShieldCheck } from "lucide-react";

const CHECKLIST = {
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

const TravelChecklist = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  const totalItems = Object.values(CHECKLIST).reduce((acc, cat) => acc + cat.items.length, 0);
  const progress = Math.round((checked.size / totalItems) * 100);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Travel Checklist
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Don't forget anything important
          </p>
          {/* Progress */}
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

        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(CHECKLIST).map(([key, category], idx) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">{category.title}</h3>
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
