import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Coffee, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "./TripForm";

interface HotelSuggestionsProps {
  tripData: TripData;
}

const HotelSuggestions = ({ tripData }: HotelSuggestionsProps) => {
  const nightlyBudget = Math.round((tripData.budget * 0.35) / tripData.days);

  const hotels = [
    {
      name: `${tripData.destination} Cozy Hostel`,
      price: Math.round(nightlyBudget * 0.4),
      rating: 4.2,
      type: "Hostel",
      amenities: [Wifi, Coffee],
    },
    {
      name: `${tripData.destination} Boutique Inn`,
      price: Math.round(nightlyBudget * 0.8),
      rating: 4.5,
      type: "Boutique Hotel",
      amenities: [Wifi, Coffee, Car],
    },
    {
      name: `${tripData.destination} Grand Hotel`,
      price: Math.round(nightlyBudget * 1.2),
      rating: 4.7,
      type: "Hotel",
      amenities: [Wifi, Coffee, Car],
    },
  ];

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Where to Stay
          </h2>
          <p className="font-body text-muted-foreground text-lg">
            Budget-friendly stays in {tripData.destination}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel, idx) => (
            <motion.div
              key={hotel.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-border hover:shadow-lg transition-shadow duration-300 group"
            >
              <div className="h-40 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <MapPin className="w-12 h-12 text-primary/40 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{hotel.name}</h3>
                    <p className="font-body text-xs text-muted-foreground">{hotel.type}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-body text-sm font-medium text-foreground">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {hotel.amenities.map((Icon, i) => (
                    <Icon key={i} className="w-4 h-4 text-muted-foreground" />
                  ))}
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-border">
                  <div>
                    <p className="font-heading text-2xl font-bold text-foreground">${hotel.price}</p>
                    <p className="font-body text-xs text-muted-foreground">per night</p>
                  </div>
                  <Button variant="warm" size="sm">View</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelSuggestions;
