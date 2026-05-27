import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Shield, AlertCircle } from "lucide-react";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface Props { tripData: TripData; itinerary?: GeneratedItinerary; }

const BudgetBreakdown = ({ tripData, itinerary }: Props) => {
  const { budget } = tripData;
  const bb = itinerary?.budgetBreakdown;

  const breakdown = bb ? [
    { name: "Accommodation", value: bb.accommodation, color: "hsl(220, 55%, 16%)" },
    { name: "Food", value: bb.food, color: "hsl(178, 65%, 38%)" },
    { name: "Transport", value: bb.transport, color: "hsl(18, 92%, 58%)" },
    { name: "Activities", value: bb.activities, color: "hsl(200, 50%, 45%)" },
    { name: "Misc", value: bb.misc, color: "hsl(220, 14%, 60%)" },
  ] : [
    { name: "Accommodation", value: Math.round(budget * 0.35), color: "hsl(220, 55%, 16%)" },
    { name: "Food", value: Math.round(budget * 0.25), color: "hsl(178, 65%, 38%)" },
    { name: "Transport", value: Math.round(budget * 0.15), color: "hsl(18, 92%, 58%)" },
    { name: "Activities", value: Math.round(budget * 0.18), color: "hsl(200, 50%, 45%)" },
    { name: "Misc", value: Math.round(budget * 0.07), color: "hsl(220, 14%, 60%)" },
  ];

  const fmt = (v: number) => `₹${v.toLocaleString("en-IN")}`;
  const confidence = bb?.confidenceScore ?? 75;
  const confColor = confidence >= 75 ? "hsl(178 65% 38%)" : confidence >= 50 ? "hsl(18 92% 58%)" : "hsl(0 72% 52%)";

  const hiddenTotal = (bb?.hiddenCosts || []).reduce((s, h) => s + (h.estimate || 0), 0);

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium tracking-wide uppercase mb-3">
            Realistic budget engine
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-3">Budget Breakdown</h2>
          <p className="text-muted-foreground text-lg">Smart split of your ₹{budget.toLocaleString("en-IN")} — including the costs no one warns you about.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie + legend */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border">
            <h3 className="font-heading text-lg font-semibold mb-4">Expense distribution</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={breakdown} cx="50%" cy="50%" innerRadius={56} outerRadius={96} paddingAngle={3} dataKey="value">
                  {breakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v: number) => [fmt(v), ""]} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 14% 90%)", fontFamily: "DM Sans" }} />
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

          {/* Confidence + hidden costs */}
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="space-y-4">
            <div className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4" style={{ color: confColor }} />
                <h3 className="font-heading font-semibold">Budget confidence</h3>
                <span className="ml-auto font-heading text-2xl font-bold" style={{ color: confColor }}>{confidence}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${confidence}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: confColor }}
                />
              </div>
              {bb?.confidenceReason && (
                <p className="text-xs text-muted-foreground mt-3">{bb.confidenceReason}</p>
              )}
            </div>

            <div className="lift-card bg-card rounded-3xl p-6 shadow-soft border border-border">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-sunset" />
                <h3 className="font-heading font-semibold">Hidden costs travelers forget</h3>
              </div>
              {bb?.hiddenCosts?.length ? (
                <div className="space-y-2">
                  {bb.hiddenCosts.map((h, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-background border border-border/60">
                      <div>
                        <p className="text-sm font-medium">{h.label}</p>
                        {h.note && <p className="text-xs text-muted-foreground">{h.note}</p>}
                      </div>
                      <span className="text-sm text-sunset font-semibold">{fmt(h.estimate)}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border/60 flex justify-between text-sm">
                    <span className="text-muted-foreground">Hidden total</span>
                    <span className="font-semibold">{fmt(hiddenTotal)}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Tips, entry fees, transit surge, ATM fees, bottled water — generate an itinerary to see specifics for {tripData.destination}.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BudgetBreakdown;
