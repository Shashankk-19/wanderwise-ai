import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripForm, { type TripData } from "@/components/TripForm";
import ItineraryDisplay, { type GeneratedItinerary } from "@/components/ItineraryDisplay";
import ItinerarySkeleton from "@/components/ItinerarySkeleton";
import ItineraryRefiner from "@/components/ItineraryRefiner";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import HotelSuggestions from "@/components/HotelSuggestions";
import CostSavingTips from "@/components/CostSavingTips";
import TravelerStories from "@/components/TravelerStories";
import TravelChecklist from "@/components/TravelChecklist";
import ThankYou from "@/components/ThankYou";
import Chatbot from "@/components/Chatbot";
import IntroAnimation from "@/components/IntroAnimation";
import SparkleOverlay from "@/components/SparkleOverlay";
import DestinationGallery from "@/components/DestinationGallery";
import { useToast } from "@/hooks/use-toast";
import { applyTheme, detectTheme } from "@/lib/destinationTheme";

const ITINERARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;

type TabId = "hero" | "plan" | "itinerary";

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("hero");
  const { toast } = useToast();

  useEffect(() => {
    if (!tripData) return;
    const theme = (itinerary?.destinationInfo.theme as any) || detectTheme(tripData.destination);
    applyTheme(theme);
    return () => applyTheme("default");
  }, [tripData, itinerary]);

  // Only show tabs for Welcome / Plan / Itinerary. The Itinerary view scrolls
  // continuously through Gallery → Plan → Budget → Stays → Savings → Stories
  // → Checklist → Farewell.
  const tabs: { id: TabId; label: string }[] = [
    { id: "hero", label: "Welcome" },
    { id: "plan", label: "Plan" },
    ...(itinerary || loading ? [{ id: "itinerary" as TabId, label: "Itinerary" }] : []),
  ];

  const goTab = (id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (data: TripData) => {
    setTripData(data);
    setLoading(true);
    setItinerary(null);
    applyTheme(detectTheme(data.destination));
    setTab("itinerary");

    try {
      const resp = await fetch(ITINERARY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to generate itinerary");
      const result: GeneratedItinerary = await resp.json();
      setItinerary(result);
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not generate your itinerary. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setTripData(null); setItinerary(null); setTab("hero");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <SparkleOverlay />
      <IntroAnimation />
      <Navbar onGetStarted={() => goTab("plan")} />

      {/* Minimal tab navigation: Welcome / Plan / Itinerary */}
      {tabs.length > 1 && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40">
          <div className="flex items-center gap-1 bg-card/85 backdrop-blur-xl border border-border shadow-lift rounded-full px-1.5 py-1.5">
            {tabs.map((t) => {
              const active = t.id === tab;
              return (
                <button
                  key={t.id}
                  onClick={() => goTab(t.id)}
                  data-sparkle
                  className={`px-4 py-1.5 text-xs font-medium rounded-full transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={tab}
          initial={{ opacity: 0, y: 30, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="min-h-screen pt-16"
        >
          {tab === "hero" && <HeroSection onGetStarted={() => goTab("plan")} />}
          {tab === "plan" && <TripForm onSubmit={handleSubmit} isLoading={loading} />}

          {tab === "itinerary" && (
            <>
              {loading && <ItinerarySkeleton />}
              {!loading && tripData && itinerary && (
                <div className="space-y-4">
                  <DestinationGallery
                    destination={tripData.destination}
                    baseKeyword={itinerary.destinationInfo.imageKeyword}
                  />
                  <ItineraryDisplay tripData={tripData} itinerary={itinerary} />
                  <ItineraryRefiner tripData={tripData} itinerary={itinerary} onUpdate={setItinerary} />
                  <BudgetBreakdown tripData={tripData} itinerary={itinerary} />
                  <HotelSuggestions tripData={tripData} itinerary={itinerary} />
                  {itinerary.costSavingTips?.length ? (
                    <CostSavingTips destination={tripData.destination} itinerary={itinerary} />
                  ) : null}
                  {itinerary.travelerStories?.length ? (
                    <TravelerStories destination={tripData.destination} itinerary={itinerary} />
                  ) : null}
                  <TravelChecklist checklist={itinerary.checklist} destination={tripData.destination} />
                  <ThankYou onReplan={reset} destination={tripData.destination} />
                </div>
              )}
            </>
          )}
        </motion.main>
      </AnimatePresence>

      <Chatbot />
    </div>
  );
};

export default Index;
