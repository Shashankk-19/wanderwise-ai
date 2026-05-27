import { motion } from "framer-motion";
import { MapPin, Sun, Moon, Camera, Utensils, Hotel, Lightbulb, Navigation, AlertTriangle, Shield, Gem, Heart, ThumbsDown, ThumbsUp, ExternalLink } from "lucide-react";
import type { TripData } from "./TripForm";
import DestinationMap from "./DestinationMap";
import { unsplashImg, onImgError, mapsLink } from "@/lib/imageFallback";

interface TimeSlot {
  activity: string;
  place: string;
  lat: number;
  lng: number;
  durationHrs?: number;
  effort?: "low" | "medium" | "high";
}

interface Restaurant { name: string; cuisine: string; priceRange: string; lat: number; lng: number; imageKeyword?: string; }
interface HotelInfo { name: string; pricePerNight: string; rating: number; lat: number; lng: number; imageKeyword?: string; }

export interface ItineraryDay {
  day: number;
  theme: string;
  morning: TimeSlot;
  afternoon: TimeSlot;
  evening: TimeSlot;
  restaurants: Restaurant[];
  hotels: HotelInfo[];
  attractions: string[];
  hiddenGem?: { name: string; why: string; lat?: number; lng?: number };
  personalizedMentions?: string[];
}

export interface Warning { type: "scam" | "trap" | "unsafe" | "overpriced"; title: string; detail: string; severity: "low" | "medium" | "high"; }

export interface HiddenCost { label: string; estimate: number; low?: number; high?: number; note?: string; }
export interface CostSaver { title: string; saving: string; category: string; tip: string; lat?: number; lng?: number; }
export interface ChecklistCategory { category: string; items: string[]; }
export interface TravelerStory { title: string; snippet: string; moodTag?: string; author?: string; }

export interface GeneratedItinerary {
  destinationInfo: {
    lat: number; lng: number;
    description: string;
    imageKeyword: string;
    theme?: "mountains" | "beach" | "nightlife" | "spiritual" | "default";
    bestTimeToVisit?: string;
    weatherSummary?: string;
    vibe?: string;
  };
  days: ItineraryDay[];
  warnings?: Warning[];
  regretPrevention?: { dontMiss: string[]; skippable: string[] };
  budgetBreakdown: {
    accommodation: number; food: number; transport: number; activities: number; misc: number;
    hiddenCosts?: HiddenCost[];
    confidenceScore?: number;
    confidenceReason?: string;
  };
  costSavers?: CostSaver[];
  packingChecklist?: ChecklistCategory[];
  travelerStories?: TravelerStory[];
  travelTips: string[];
}

interface ItineraryDisplayProps { tripData: TripData; itinerary: GeneratedItinerary; embedded?: boolean; }

const effortColor = (e?: string) => e === "high" ? "text-sunset" : e === "medium" ? "text-accent" : "text-muted-foreground";

const ItineraryDisplay = ({ tripData, itinerary, embedded }: ItineraryDisplayProps) => {
  const allMarkers = itinerary.days.flatMap((day) => [
    { lat: day.morning.lat, lng: day.morning.lng, label: day.morning.place, type: "attraction" as const },
    { lat: day.afternoon.lat, lng: day.afternoon.lng, label: day.afternoon.place, type: "attraction" as const },
    { lat: day.evening.lat, lng: day.evening.lng, label: day.evening.place, type: "attraction" as const },
    ...day.restaurants.map((r) => ({ lat: r.lat, lng: r.lng, label: r.name, type: "restaurant" as const })),
    ...day.hotels.map((h) => ({ lat: h.lat, lng: h.lng, label: h.name, type: "hotel" as const })),
  ]);

  const heroImg = unsplashImg(`${itinerary.destinationInfo.imageKeyword || tripData.destination},landscape,travel`, 1600, 900);

  return (
    <section className={embedded ? "py-6" : "py-20 bg-secondary/40"}>
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Cinematic hero */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-3xl overflow-hidden mb-10 h-72 md:h-[420px] shadow-lift kenburns"
        >
          <img src={heroImg} alt={tripData.destination} onError={onImgError} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute bottom-8 left-8 right-8">
            {itinerary.destinationInfo.vibe && (
              <span className="inline-block mb-3 px-3 py-1 rounded-full bg-accent/30 text-primary-foreground text-xs font-medium tracking-wide uppercase backdrop-blur-sm">
                {itinerary.destinationInfo.vibe}
              </span>
            )}
            <h2 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-3 leading-tight">
              {tripData.destination}
            </h2>
            <p className="font-body text-primary-foreground/85 text-sm md:text-base max-w-2xl">
              {itinerary.destinationInfo.description}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Chip>📅 {tripData.days} days</Chip>
              <Chip>💰 ₹{tripData.budget.toLocaleString("en-IN")}</Chip>
              <Chip className="capitalize">👥 {tripData.travelGroup}</Chip>
              {tripData.behavioralProfile?.derivedArchetype && <Chip>✨ {tripData.behavioralProfile.derivedArchetype}</Chip>}
              {itinerary.destinationInfo.bestTimeToVisit && <Chip>🗓 {itinerary.destinationInfo.bestTimeToVisit}</Chip>}
              {itinerary.destinationInfo.weatherSummary && <Chip>🌤 {itinerary.destinationInfo.weatherSummary}</Chip>}
            </div>
          </div>
        </motion.div>

        {/* Warnings strip */}
        {itinerary.warnings && itinerary.warnings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mb-10 bg-card rounded-2xl p-6 border border-border shadow-soft"
          >
            <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-sunset" /> Safety & Tourist Traps
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {itinerary.warnings.map((w, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${
                  w.severity === "high" ? "border-destructive bg-destructive/5" :
                  w.severity === "medium" ? "border-sunset bg-sunset/5" :
                  "border-muted-foreground/40 bg-muted/30"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${w.severity === "high" ? "text-destructive" : "text-sunset"}`} />
                    <p className="font-heading font-semibold text-sm">{w.title}</p>
                    <span className="ml-auto text-[10px] uppercase tracking-wide text-muted-foreground">{w.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{w.detail}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Map */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <h3 className="font-heading text-2xl font-bold mb-4 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-accent" /> Explore on Map
          </h3>
          <DestinationMap center={[itinerary.destinationInfo.lat, itinerary.destinationInfo.lng]} markers={allMarkers} />
        </motion.div>

        {/* Daily itinerary */}
        <div className="space-y-6">
          {itinerary.days.map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: idx * 0.08, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
              className="lift-card bg-card rounded-3xl overflow-hidden shadow-soft border border-border"
            >
              <div className="bg-gradient-ocean px-6 py-5 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary-foreground/20 backdrop-blur flex items-center justify-center font-heading font-bold">
                    {day.day}
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-semibold">Day {day.day}</h3>
                    <p className="font-body text-sm opacity-80">{day.theme}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-5">
                {day.personalizedMentions && day.personalizedMentions.length > 0 && (
                  <div className="rounded-xl bg-accent/10 border border-accent/25 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Heart className="w-4 h-4 text-accent" />
                      <p className="font-heading font-semibold text-sm">Tailored for your group</p>
                    </div>
                    <ul className="space-y-1">
                      {day.personalizedMentions.map((m, i) => (
                        <li key={i} className="text-sm text-foreground/85 flex gap-2"><span className="text-accent">✦</span>{m}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-3">
                  <TimeBlock icon={Sun} label="Morning" slot={day.morning} dest={tripData.destination} />
                  <TimeBlock icon={Camera} label="Afternoon" slot={day.afternoon} dest={tripData.destination} />
                  <TimeBlock icon={Moon} label="Evening" slot={day.evening} dest={tripData.destination} />
                </div>

                {day.hiddenGem && (
                  <div className="rounded-xl border-2 border-dashed border-sunset/40 bg-sunset/5 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Gem className="w-4 h-4 text-sunset" />
                      <p className="font-heading font-semibold text-sm">Hidden gem · {day.hiddenGem.name}</p>
                      <a
                        href={mapsLink(day.hiddenGem.name, tripData.destination)} target="_blank" rel="noreferrer"
                        className="ml-auto text-xs text-sunset hover:underline flex items-center gap-1"
                      >
                        Maps <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-muted-foreground">{day.hiddenGem.why}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {day.attractions.map((spot) => (
                    <a
                      key={spot} href={mapsLink(spot, tripData.destination)} target="_blank" rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs hover:bg-accent/20 transition-colors"
                    >
                      <MapPin className="w-3 h-3" /> {spot}
                    </a>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-3 border-t border-border/60">
                  {day.restaurants?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Utensils className="w-3 h-3" /> Where to Eat
                      </p>
                      {day.restaurants.map((r) => (
                        <a
                          key={r.name} href={mapsLink(r.name, tripData.destination)} target="_blank" rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60 hover:border-accent/50 hover:shadow-soft transition-all"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{r.name}</p>
                            <p className="text-xs text-muted-foreground">{r.cuisine}</p>
                          </div>
                          <span className="text-xs text-accent font-medium shrink-0 ml-2">{r.priceRange}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {day.hotels?.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Hotel className="w-3 h-3" /> Where to Stay
                      </p>
                      {day.hotels.map((h) => (
                        <a
                          key={h.name} href={mapsLink(h.name, tripData.destination)} target="_blank" rel="noreferrer"
                          className="flex items-center justify-between p-3 rounded-xl bg-background border border-border/60 hover:border-accent/50 hover:shadow-soft transition-all"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{h.name}</p>
                            <p className="text-xs text-muted-foreground">⭐ {h.rating}</p>
                          </div>
                          <span className="text-xs text-accent font-medium shrink-0 ml-2">{h.pricePerNight}/night</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regret prevention */}
        {itinerary.regretPrevention && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-12 grid md:grid-cols-2 gap-4">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
              <h3 className="font-heading font-semibold flex items-center gap-2 mb-3"><ThumbsUp className="w-4 h-4 text-accent" /> Don't miss</h3>
              <ul className="space-y-2">
                {itinerary.regretPrevention.dontMiss.map((x, i) => (
                  <li key={i} className="text-sm flex gap-2"><span className="text-accent">→</span>{x}</li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl p-6 border border-border shadow-soft">
              <h3 className="font-heading font-semibold flex items-center gap-2 mb-3"><ThumbsDown className="w-4 h-4 text-muted-foreground" /> Skip without regret</h3>
              <ul className="space-y-2">
                {itinerary.regretPrevention.skippable.map((x, i) => (
                  <li key={i} className="text-sm flex gap-2 text-muted-foreground"><span>·</span>{x}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* Travel tips */}
        {itinerary.travelTips?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-8 bg-card rounded-2xl p-6 shadow-soft border border-border">
            <h3 className="font-heading text-xl font-semibold mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-sunset" /> Travel Tips
            </h3>
            <ul className="space-y-2">
              {itinerary.travelTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-sunset font-bold">•</span>{tip}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const Chip = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-foreground/15 backdrop-blur-sm text-primary-foreground text-xs ${className}`}>
    {children}
  </span>
);

const TimeBlock = ({ icon: Icon, label, slot, dest }: { icon: any; label: string; slot: TimeSlot; dest: string }) => (
  <a
    href={mapsLink(slot.place, dest)} target="_blank" rel="noreferrer"
    className="flex gap-3 p-4 rounded-2xl bg-background border border-border/60 lift-card hover:border-accent/40 transition-colors"
  >
    <Icon className="w-5 h-5 text-accent mt-0.5 shrink-0" />
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        {slot.effort && <span className={`text-[10px] uppercase ${effortColor(slot.effort)}`}>· {slot.effort}</span>}
      </div>
      <p className="text-sm font-medium mt-1 leading-snug">{slot.activity}</p>
      <p className="text-xs text-accent mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{slot.place}</p>
      {slot.durationHrs && <p className="text-[11px] text-muted-foreground mt-0.5">~{slot.durationHrs}h</p>}
    </div>
  </a>
);

export default ItineraryDisplay;
