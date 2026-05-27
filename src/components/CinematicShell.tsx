import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { TripData } from "./TripForm";
import type { GeneratedItinerary } from "./ItineraryDisplay";
import ItineraryDisplay from "./ItineraryDisplay";
import ItineraryRefiner from "./ItineraryRefiner";
import BudgetBreakdown from "./BudgetBreakdown";
import HotelSuggestions from "./HotelSuggestions";
import TravelChecklist from "./TravelChecklist";
import StoriesPanel from "./StoriesPanel";
import ThankYouScreen from "./ThankYouScreen";

interface Props {
  tripData: TripData;
  itinerary: GeneratedItinerary;
  onUpdateItinerary: (next: GeneratedItinerary) => void;
  onReset: () => void;
}

const TABS = [
  { id: "itinerary", label: "Itinerary", emoji: "🗺️" },
  { id: "refine",    label: "Refine",    emoji: "✏️" },
  { id: "stays",     label: "Stays",     emoji: "🏨" },
  { id: "budget",    label: "Budget",    emoji: "💰" },
  { id: "checklist", label: "Packing",   emoji: "🎒" },
  { id: "stories",   label: "Stories",   emoji: "📖" },
  { id: "thanks",    label: "Wrap up",   emoji: "✨" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const CinematicShell = ({ tripData, itinerary, onUpdateItinerary, onReset }: Props) => {
  const [active, setActive] = useState<TabId>("itinerary");
  const [dir, setDir] = useState(1);

  const idx = TABS.findIndex((t) => t.id === active);
  const go = (next: TabId) => {
    const nextIdx = TABS.findIndex((t) => t.id === next);
    setDir(nextIdx > idx ? 1 : -1);
    setActive(next);
  };
  const prev = () => idx > 0 && go(TABS[idx - 1].id);
  const next = () => idx < TABS.length - 1 && go(TABS[idx + 1].id);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // Reset scroll to top on tab change for cinematic feel
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [active]);

  return (
    <section className="min-h-[100vh] bg-background relative">
      {/* Sticky tab strip */}
      <div className="sticky top-16 z-30 bg-background/85 backdrop-blur-xl border-b border-border/60">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {TABS.map((t) => {
              const isActive = active === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => go(t.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 whitespace-nowrap ${
                    isActive
                      ? "bg-accent text-accent-foreground border-accent active-glow"
                      : "bg-background text-muted-foreground border-transparent hover:border-accent/40 hover:text-foreground"
                  }`}
                >
                  <span className="mr-1.5">{t.emoji}</span>{t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cinematic content */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, x: dir * 80, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -dir * 80, filter: "blur(8px)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          >
            {active === "itinerary" && <ItineraryDisplay tripData={tripData} itinerary={itinerary} embedded />}
            {active === "refine" && <ItineraryRefiner tripData={tripData} itinerary={itinerary} onUpdate={onUpdateItinerary} />}
            {active === "stays" && <HotelSuggestions tripData={tripData} itinerary={itinerary} embedded />}
            {active === "budget" && <BudgetBreakdown tripData={tripData} itinerary={itinerary} embedded />}
            {active === "checklist" && (
              <TravelChecklist destination={tripData.destination} packingChecklist={itinerary.packingChecklist} embedded />
            )}
            {active === "stories" && <StoriesPanel destination={tripData.destination} stories={itinerary.travelerStories} embedded />}
            {active === "thanks" && <ThankYouScreen tripData={tripData} itinerary={itinerary} onReset={onReset} embedded />}
          </motion.div>
        </AnimatePresence>

        {/* Side nav arrows */}
        <div className="fixed bottom-6 right-6 z-40 flex gap-2">
          <button
            onClick={prev} disabled={idx === 0}
            className="w-11 h-11 rounded-full bg-card border border-border shadow-lift flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Previous tab"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next} disabled={idx === TABS.length - 1}
            className="w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lift flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-30 disabled:pointer-events-none active-glow"
            aria-label="Next tab"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CinematicShell;
