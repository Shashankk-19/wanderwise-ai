import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { applyTheme, detectTheme } from "@/lib/destinationTheme";

const ITINERARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;

type TabId = "hero" | "plan" | "itinerary" | "budget" | "stays" | "savings" | "stories" | "checklist" | "thanks";

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

  // Build dynamic tab list
  const tabs: { id: TabId; label: string }[] = [
    { id: "hero", label: "Welcome" },
    { id: "plan", label: "Plan" },
    ...(itinerary || loading ? [{ id: "itinerary" as TabId, label: "Itinerary" }] : []),
    ...(itinerary ? [
      { id: "budget" as TabId, label: "Budget" },
      { id: "stays" as TabId, label: "Stays" },
      ...(itinerary.costSavingTips?.length ? [{ id: "savings" as TabId, label: "Savings" }] : []),
      ...(itinerary.travelerStories?.length ? [{ id: "stories" as TabId, label: "Stories" }] : []),
      { id: "checklist" as TabId, label: "Checklist" },
      { id: "thanks" as TabId, label: "Farewell" },
    ] : []),
  ];

  const goTab = (id: TabId) => {
    setTab(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const tabIndex = tabs.findIndex((t) => t.id === tab);
  const prevTab = () => tabIndex > 0 && goTab(tabs[tabIndex - 1].id);
  const nextTab = () => tabIndex < tabs.length - 1 && goTab(tabs[tabIndex + 1].id);

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
      <IntroAnimation />
      <Navbar onGetStarted={() => goTab("plan")} />

      {/* Floating tab navigation */}
      {tabs.length > 2 && (
        <motion.nav
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 max-w-[min(95vw,800px)]">
          <div className="flex items-center gap-1 bg-card/80 backdrop-blur-xl border border-border shadow-lift rounded-full px-2 py-1.5 overflow-x-auto scrollbar-none">
            {tabs.map((t) => {
              const active = t.id === tab;
              return (
                <button key={t.id} onClick={() => goTab(t.id)}
                  className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-all ${
                    active ? "bg-primary text-primary-foreground shadow-soft btn-glow" : "text-muted-foreground hover:text-foreground"
                  }`}>
                  {t.label}
                </button>
              );
            })}
          </div>
        </motion.nav>
      )}

      {/* Tab content with cinematic transitions */}
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
                <>
                  <ItineraryDisplay tripData={tripData} itinerary={itinerary} />
                  <ItineraryRefiner tripData={tripData} itinerary={itinerary} onUpdate={setItinerary} />
                </>
              )}
            </>
          )}
          {tab === "budget" && tripData && itinerary && <BudgetBreakdown tripData={tripData} itinerary={itinerary} />}
          {tab === "stays" && tripData && <HotelSuggestions tripData={tripData} itinerary={itinerary ?? undefined} />}
          {tab === "savings" && tripData && <CostSavingTips destination={tripData.destination} itinerary={itinerary ?? undefined} />}
          {tab === "stories" && tripData && <TravelerStories destination={tripData.destination} itinerary={itinerary ?? undefined} />}
          {tab === "checklist" && <TravelChecklist checklist={itinerary?.checklist} destination={tripData?.destination} />}
          {tab === "thanks" && <ThankYou onReplan={reset} destination={tripData?.destination} />}
        </motion.main>
      </AnimatePresence>

      {/* Prev / Next floating arrows */}
      {tabs.length > 2 && tab !== "hero" && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
          <button onClick={prevTab} disabled={tabIndex === 0}
            className="w-12 h-12 rounded-full bg-card/90 backdrop-blur border border-border shadow-lift flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs text-muted-foreground font-medium px-3">
            {tabIndex + 1} / {tabs.length}
          </span>
          <button onClick={nextTab} disabled={tabIndex === tabs.length - 1}
            className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-glow btn-glow flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <Chatbot />
    </div>
  );
};

export default Index;
