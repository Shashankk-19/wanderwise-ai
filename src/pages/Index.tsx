import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripForm, { type TripData } from "@/components/TripForm";
import ItineraryDisplay, { type GeneratedItinerary } from "@/components/ItineraryDisplay";
import ItinerarySkeleton from "@/components/ItinerarySkeleton";
import ItineraryRefiner from "@/components/ItineraryRefiner";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import HotelSuggestions from "@/components/HotelSuggestions";
import TravelChecklist from "@/components/TravelChecklist";
import TravelerStories from "@/components/TravelerStories";
import ThankYouScreen from "@/components/ThankYouScreen";
import Chatbot from "@/components/Chatbot";
import IntroAnimation from "@/components/IntroAnimation";
import { useToast } from "@/hooks/use-toast";
import { applyTheme, detectTheme } from "@/lib/destinationTheme";

const ITINERARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToPlanner = () => plannerRef.current?.scrollIntoView({ behavior: "smooth" });

  // Dynamic destination theme
  useEffect(() => {
    if (!tripData || !itinerary) return;
    const theme = (itinerary.destinationInfo.theme as any) || detectTheme(tripData.destination);
    applyTheme(theme);
    return () => applyTheme("default");
  }, [tripData, itinerary]);

  const handleSubmit = async (data: TripData) => {
    setTripData(data);
    setLoading(true);
    setItinerary(null);

    // Pre-apply theme guess immediately for cinematic feel
    applyTheme(detectTheme(data.destination));

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 150);

    try {
      const resp = await fetch(ITINERARY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(data),
      });
      if (!resp.ok) throw new Error("Failed to generate itinerary");
      const result: GeneratedItinerary = await resp.json();
      setItinerary(result);
      setShowThankYou(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not generate your itinerary. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <IntroAnimation />
      {showThankYou && tripData && (
        <ThankYouScreen
          destination={tripData.destination}
          onClose={() => setShowThankYou(false)}
        />
      )}
      <Navbar onGetStarted={scrollToPlanner} />
      <HeroSection onGetStarted={scrollToPlanner} />
      <div ref={plannerRef}>
        <TripForm onSubmit={handleSubmit} isLoading={loading} />
      </div>

      <div ref={resultsRef}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ItinerarySkeleton />
            </motion.div>
          )}
          {!loading && tripData && itinerary && (
            <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <ItineraryDisplay tripData={tripData} itinerary={itinerary} />
              <ItineraryRefiner tripData={tripData} itinerary={itinerary} onUpdate={setItinerary} />
              <BudgetBreakdown tripData={tripData} itinerary={itinerary} />
              <HotelSuggestions tripData={tripData} itinerary={itinerary} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <TravelerStories />
      <TravelChecklist
        destination={tripData?.destination}
        tripType={itinerary?.destinationInfo?.theme || (tripData ? detectTheme(tripData.destination) : "default")}
      />
      <Chatbot />

      <footer className="py-14 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <p className="font-heading text-2xl font-bold text-primary-foreground mb-2">Wanderly</p>
          <p className="font-body text-sm text-primary-foreground/60">Emotionally intelligent travel, designed around you.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
