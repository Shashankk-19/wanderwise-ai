import { motion } from "framer-motion";
import { Star, Wifi, Coffee, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";

interface Props { tripData: TripData; itinerary?: GeneratedItinerary; }

const HotelSuggestions = ({ tripData, itinerary }: Props) => {
  const aiHotels = itinerary?.days.flatMap((d) => d.hotels) || [];
  const unique = aiHotels.filter((h, i, arr) => arr.findIndex((x) => x.name === h.name) === i).slice(0, 6);

  const nightly = Math.round((tripData.budget * 0.35) / Math.max(tripData.days, 1));
  const fallback = [
    { name: `${tripData.destination} Cozy Hostel`, pricePerNight: `₹${Math.round(nightly * 0.4).toLocaleString("en-IN")}`, rating: 4.2, imageKeyword: `${tripData.destination} hostel` },
    { name: `${tripData.destination} Boutique Inn`, pricePerNight: `₹${Math.round(nightly * 0.8).toLocaleString("en-IN")}`, rating: 4.5, imageKeyword: `${tripData.destination} boutique hotel` },
    { name: `${tripData.destination} Grand Hotel`, pricePerNight: `₹${Math.round(nightly * 1.2).toLocaleString("en-IN")}`, rating: 4.7, imageKeyword: `${tripData.destination} luxury hotel` },
  ];
  const hotels = unique.length > 0 ? unique : fallback;

  return (
    <section className="py-24 bg-secondary/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-sunset/10 text-sunset text-xs font-medium tracking-wide uppercase mb-3">
            Curated stays
          </span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-3">Where to Stay</h2>
          <p className="text-muted-foreground text-lg">Hand-picked picks in {tripData.destination}.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {hotels.map((hotel: any, idx) => (
            <motion.div
              key={hotel.name + idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="lift-card bg-card rounded-3xl overflow-hidden shadow-soft border border-border group"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={`https://source.unsplash.com/600x400/?${encodeURIComponent(hotel.imageKeyword || `${hotel.name} ${tripData.destination}`)},hotel`}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                />
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading text-lg font-semibold leading-tight">{hotel.name}</h3>
                  <div className="flex items-center gap-1 bg-accent/10 px-2 py-1 rounded-lg shrink-0">
                    <Star className="w-3.5 h-3.5 text-accent fill-accent" />
                    <span className="text-sm font-medium">{hotel.rating}</span>
                  </div>
                </div>
                <div className="flex gap-2 text-muted-foreground">
                  <Wifi className="w-4 h-4" />
                  <Coffee className="w-4 h-4" />
                  <Car className="w-4 h-4" />
                </div>
                <div className="flex items-end justify-between pt-3 border-t border-border">
                  <div>
                    <p className="font-heading text-2xl font-bold">{hotel.pricePerNight}</p>
                    <p className="text-xs text-muted-foreground">per night</p>
                  </div>
                  <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">View</Button>
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
