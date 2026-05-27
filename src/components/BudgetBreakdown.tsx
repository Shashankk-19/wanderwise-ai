import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Shield, AlertCircle, PiggyBank, Sparkles } from "lucide-react";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface Props { tripData: TripData; itinerary?: GeneratedItinerary; embedded?: boolean; }

const BudgetBreakdown = ({ tripData, itinerary, embedded }: Props) => {
  const { budget } = tripData;
  const bb = itinerary?.budgetBreakdown;
  const savers = itinerary?.costSavers || [];

  const breakdown = bb ? [
    { name: "Accommodation", value: bb.accommodation, color: "hsl(18 38% 32%)" },
    { name: "Food", value: bb.food, color: "hsl(22 78% 60%)" },
    { name: "Transport", value: bb.transport, color: "hsl(12 70% 56%)" },
    { name: "Activities", value: bb.activities, color: "hsl(38 55% 52%)" },
    { name: "Misc", value: bb.misc, color: "hsl(22 18% 50%)" },
  ] : [
    { name: "Accommodation", value: Math.round(budget * 0.35), color: "hsl(18 38% 32%)" },
    { name: "Food", value: Math.round(budget * 0.25), color: "hsl(22 78% 60%)" },
    { name: "Transport", value: Math.round(budget * 0.15), color: "hsl(12 70% 56%)" },
    { name: "Activities", value: Math.round(budget * 0.18), color: "hsl(38 55% 52%)" },
    { name: "Misc", value: Math.round(budget * 0.07), color: "hsl(22 18% 50%)" },
  ];

  const fmt = (v: number) => `₹${(v || 0).toLocaleString("en-IN")}`;
  const confidence = bb?.confidenceScore ?? 75;
  const confColor = confidence >= 75 ? "hsl(22 78% 50%)" : confidence >= 50 ? "hsl(38 65% 50%)" : "hsl(0 72% 52%)";
  const hidden = bb?.hiddenCosts || [];
  const hiddenTotal = hidden.reduce((s, h) => s + (h.estimate || 0), 0);
  const maxRange = Math.max(1, ...hidden.map((h) => h.high ?? h.estimate ?? 0));

  return (
    <section className={embedded ? "py-6" : "py-24 bg-background"}>
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-medium tracking-wide uppercase mb-3">
            Honest, detailed budget
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-3">Budget breakdown</h2>
          <p className="text-muted-foreground text-lg">Your ₹{budget.toLocaleString("en-IN")} — split realistically, with every cost travelers forget.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border">
            <h3 className="font-heading text-lg font-semibold mb-4">Expense distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={56} outerRadius={96} paddingAngle={3} dataKey="value">
                  {breakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [fmt(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(28 30% 85%)", fontFamily: "DM Sans" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {breakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-4 h-4" style={{ color: confColor }} />
              <h3 className="font-heading font-semibold">Budget confidence</h3>
              <span className="ml-auto font-heading text-2xl font-bold" style={{ color: confColor }}>{confidence}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }} whileInView={{ width: `${confidence}%` }} viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full" style={{ backgroundColor: confColor }}
              />
            </div>
            {bb?.confidenceReason && <p className="text-xs text-muted-foreground mt-3">{bb.confidenceReason}</p>}

            <div className="mt-5 pt-5 border-t border-border/60">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Quick total</p>
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Hidden costs (added)</span>
                <span className="font-heading text-xl font-bold text-sunset">{fmt(hiddenTotal)}</span>
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm text-muted-foreground">Effective trip cost</span>
                <span className="font-heading text-xl font-bold">{fmt(budget + hiddenTotal)}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed hidden costs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border mb-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 text-sunset" />
            <h3 className="font-heading font-semibold">Hidden costs travelers always forget</h3>
            <span className="ml-auto text-xs text-muted-foreground">low ↔ high range</span>
          </div>
          {hidden.length ? (
            <div className="space-y-3">
              {hidden.map((h, i) => {
                const low = h.low ?? h.estimate;
                const high = h.high ?? h.estimate;
                return (
                  <motion.div
                    key={i} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="p-3.5 rounded-xl bg-background border border-border/60"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{h.label}</p>
                        {h.note && <p className="text-[11px] text-muted-foreground mt-0.5">{h.note}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">{fmt(low)} – {fmt(high)}</p>
                        <p className="text-sm font-semibold text-sunset">{fmt(h.estimate)}</p>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, ((high) / maxRange) * 100)}%` }}
                        viewport={{ once: true }} transition={{ duration: 0.7, ease: "easeOut" }}
                        className="h-full bg-gradient-sunset"
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Generate an itinerary to see the detailed hidden-cost breakdown for {tripData.destination}.</p>
          )}
        </motion.div>

        {/* Smart cost savers */}
        {savers.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="lift-card bg-gradient-warm rounded-3xl p-6 shadow-soft border border-border">
            <div className="flex items-center gap-2 mb-4">
              <PiggyBank className="w-5 h-5 text-primary" />
              <h3 className="font-heading font-semibold text-primary">Smart cost-saving hacks</h3>
              <Sparkles className="w-4 h-4 text-accent ml-auto" />
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {savers.map((s, i) => (
                <motion.div
                  key={i} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 rounded-2xl bg-card border border-border/60 hover:border-accent/50 hover:shadow-soft transition-all"
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold">{s.title}</p>
                    <span className="text-[10px] uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full shrink-0">{s.category}</span>
                  </div>
                  <p className="text-xs text-primary/80 font-medium mb-1">💚 {s.saving}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BudgetBreakdown;
