import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type { TripData } from "./TripForm";

interface BudgetBreakdownProps {
  tripData: TripData;
}

const BudgetBreakdown = ({ tripData }: BudgetBreakdownProps) => {
  const { budget, days } = tripData;

  const breakdown = [
    { name: "Accommodation", value: Math.round(budget * 0.35), color: "hsl(32, 95%, 44%)" },
    { name: "Food & Dining", value: Math.round(budget * 0.25), color: "hsl(16, 70%, 50%)" },
    { name: "Transport", value: Math.round(budget * 0.15), color: "hsl(36, 60%, 55%)" },
    { name: "Activities", value: Math.round(budget * 0.18), color: "hsl(28, 80%, 60%)" },
    { name: "Misc", value: Math.round(budget * 0.07), color: "hsl(40, 30%, 70%)" },
  ];

  const dailyData = Array.from({ length: days }, (_, i) => ({
    name: `Day ${i + 1}`,
    cost: Math.round((budget / days) * (0.8 + Math.random() * 0.4)),
  }));

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Budget Breakdown
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Smart allocation of your ${budget} budget
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border"
          >
            <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Expense Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={breakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {breakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`$${value}`, ""]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(36, 20%, 88%)",
                    fontFamily: "DM Sans",
                    fontSize: "14px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {breakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-body text-sm text-muted-foreground">{item.name}</span>
                  <span className="font-body text-sm font-medium text-foreground ml-auto">${item.value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border"
          >
            <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Daily Spending Estimate</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={dailyData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontFamily: "DM Sans", fontSize: 12, fill: "hsl(220, 10%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontFamily: "DM Sans", fontSize: 12, fill: "hsl(220, 10%, 46%)" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v}`}
                />
                <Tooltip
                  formatter={(value: number) => [`$${value}`, "Est. Cost"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(36, 20%, 88%)",
                    fontFamily: "DM Sans",
                    fontSize: "14px",
                  }}
                />
                <Bar dataKey="cost" fill="hsl(32, 95%, 44%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 rounded-xl bg-secondary/50 border border-border/50">
              <p className="font-body text-sm text-muted-foreground">
                Average daily budget: <span className="font-medium text-foreground">${Math.round(budget / days)}/day</span>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BudgetBreakdown;
