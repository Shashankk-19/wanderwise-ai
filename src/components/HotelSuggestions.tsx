import { motion } from "framer-motion";
import { Star, MapPin, Wifi, Coffee, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface HotelSuggestionsProps {
  tripData: TripData;
  itinerary?: GeneratedItinerary;
}

const HotelSuggestions = ({ tripData, itinerary }: HotelSuggestionsProps) => {
  // Collect unique hotels from itinerary
  const aiHotels = itinerary?.days.flatMap((d) => d.hotels) || [];
  const uniqueHotels = aiHotels.filter((h, i, arr) => arr.findIndex((x) => x.name === h.name) === i).slice(0, 6);

  const nightlyBudget = Math.round((tripData.budget * 0.35) / tripData.days);

  const fallbackHotels = [
    { name: `${tripData.destination} Cozy Hostel`, pricePerNight: `₹${Math.round(nightlyBudget * 0.4).toLocaleString("en-IN")}`, rating: 4.2 },
    { name: `${tripData.destination} Boutique Inn`, pricePerNight: `₹${Math.round(nightlyBudget * 0.8).toLocaleString("en-IN")}`, rating: 4.5 },
    { name: `${tripData.destination} Grand Hotel`, pricePerNight: `₹${Math.round(nightlyBudget * 1.2).toLocaleString("en-IN")}`, rating: 4.7 },
  ];

  const hotels = uniqueHotels.length > 0 ? uniqueHotels : fallbackHotels;

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
            Recommended stays in {tripData.destination}
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
              <div className="h-40 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/600x400/?${encodeURIComponent(tripData.destination)},hotel,resort`}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{hotel.name}</h3>
                  </div>
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-lg">
                    <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-body text-sm font-medium text-foreground">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Wifi className="w-4 h-4 text-muted-foreground" />
                  <Coffee className="w-4 h-4 text-muted-foreground" />
                  <Car className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-border">
                  <div>
                    <p className="font-heading text-2xl font-bold text-foreground">{hotel.pricePerNight}</p>
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
