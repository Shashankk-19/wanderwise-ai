import { motion } from "framer-motion";
import { MapPin, Sun, Moon, Camera, Utensils, Hotel, Lightbulb, Navigation } from "lucide-react";
import type { TripData } from "./TripForm";
import DestinationMap from "./DestinationMap";

interface TimeSlot {
  activity: string;
  place: string;
  lat: number;
  lng: number;
}

interface Restaurant {
  name: string;
  cuisine: string;
  priceRange: string;
  lat: number;
  lng: number;
}

interface HotelInfo {
  name: string;
  pricePerNight: string;
  rating: number;
  lat: number;
  lng: number;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  morning: TimeSlot;
  afternoon: TimeSlot;
  evening: TimeSlot;
  restaurants: Restaurant[];
  hotels: HotelInfo[];
  attractions: string[];
}

export interface GeneratedItinerary {
  destinationInfo: {
    lat: number;
    lng: number;
    description: string;
    imageKeyword: string;
  };
  days: ItineraryDay[];
  budgetBreakdown: {
    accommodation: number;
    food: number;
    transport: number;
    activities: number;
    misc: number;
  };
  travelTips: string[];
}

interface ItineraryDisplayProps {
  tripData: TripData;
  itinerary: GeneratedItinerary;
}

const ItineraryDisplay = ({ tripData, itinerary }: ItineraryDisplayProps) => {
  const allMarkers = itinerary.days.flatMap((day) => [
    { lat: day.morning.lat, lng: day.morning.lng, label: day.morning.place, type: "attraction" as const },
    { lat: day.afternoon.lat, lng: day.afternoon.lng, label: day.afternoon.place, type: "attraction" as const },
    { lat: day.evening.lat, lng: day.evening.lng, label: day.evening.place, type: "attraction" as const },
    ...day.restaurants.map((r) => ({ lat: r.lat, lng: r.lng, label: r.name, type: "restaurant" as const })),
    ...day.hotels.map((h) => ({ lat: h.lat, lng: h.lng, label: h.name, type: "hotel" as const })),
  ]);

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header with destination image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="relative rounded-3xl overflow-hidden mb-8 h-64 md:h-80">
            <img
              src={`https://source.unsplash.com/1200x600/?${encodeURIComponent(itinerary.destinationInfo.imageKeyword || tripData.destination)},travel,landmark`}
              alt={`Beautiful view of ${tripData.destination}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-left">
              <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-2">
                {tripData.destination}
              </h2>
              <p className="font-body text-primary-foreground/80 text-sm md:text-base max-w-2xl">
                {itinerary.destinationInfo.description}
              </p>
              <div className="flex gap-4 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-body">
                  📅 {tripData.days} days
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-body">
                  💰 ₹{tripData.budget.toLocaleString("en-IN")}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-xs font-body capitalize">
                  👥 {tripData.travelGroup}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="font-heading text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-primary" />
            Explore on Map
          </h3>
          <DestinationMap
            center={[itinerary.destinationInfo.lat, itinerary.destinationInfo.lng]}
            markers={allMarkers}
          />
        </motion.div>

        {/* Daily Itinerary */}
        <div className="space-y-8">
          {itinerary.days.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-card)] border border-border"
            >
              {/* Day header */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/5 px-6 py-4 border-b border-border/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-heading font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground">Day {day.day}</h3>
                    <p className="font-body text-sm text-muted-foreground">{day.theme}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {/* Time blocks */}
                <div className="grid md:grid-cols-3 gap-4">
                  <TimeBlock icon={Sun} label="Morning" activity={day.morning} />
                  <TimeBlock icon={Camera} label="Afternoon" activity={day.afternoon} />
                  <TimeBlock icon={Moon} label="Evening" activity={day.evening} />
                </div>

                {/* Attractions */}
                <div className="flex flex-wrap gap-2">
                  {day.attractions.map((spot) => (
                    <span key={spot} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-body">
                      <MapPin className="w-3 h-3" />
                      {spot}
                    </span>
                  ))}
                </div>

                {/* Restaurants & Hotels */}
                <div className="grid md:grid-cols-2 gap-4 pt-2 border-t border-border/50">
                  {day.restaurants.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Utensils className="w-3 h-3" /> Where to Eat
                      </p>
                      {day.restaurants.map((r) => (
                        <div key={r.name} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50">
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{r.name}</p>
                            <p className="font-body text-xs text-muted-foreground">{r.cuisine}</p>
                          </div>
                          <span className="font-body text-xs text-primary font-medium">{r.priceRange}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {day.hotels.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                        <Hotel className="w-3 h-3" /> Where to Stay
                      </p>
                      {day.hotels.map((h) => (
                        <div key={h.name} className="flex items-center justify-between p-2 rounded-lg bg-background border border-border/50">
                          <div>
                            <p className="font-body text-sm font-medium text-foreground">{h.name}</p>
                            <p className="font-body text-xs text-muted-foreground">⭐ {h.rating}</p>
                          </div>
                          <span className="font-body text-xs text-primary font-medium">{h.pricePerNight}/night</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Travel Tips */}
        {itinerary.travelTips?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-card rounded-2xl p-6 shadow-[var(--shadow-card)] border border-border"
          >
            <h3 className="font-heading text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Travel Tips
            </h3>
            <ul className="space-y-2">
              {itinerary.travelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 font-body text-sm text-muted-foreground">
                  <span className="text-primary font-bold mt-0.5">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const TimeBlock = ({ icon: Icon, label, activity }: { icon: any; label: string; activity: { activity: string; place: string } }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-background border border-border/50 hover:shadow-sm transition-shadow">
    <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
    <div>
      <p className="font-body text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="font-body text-sm font-medium text-foreground mt-1">{activity.activity}</p>
      <p className="font-body text-xs text-primary mt-0.5 flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        {activity.place}
      </p>
    </div>
  </div>
);

export default ItineraryDisplay;
