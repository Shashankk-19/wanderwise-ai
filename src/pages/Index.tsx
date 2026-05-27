import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripForm, { type TripData } from "@/components/TripForm";
import { type GeneratedItinerary } from "@/components/ItineraryDisplay";
import ItinerarySkeleton from "@/components/ItinerarySkeleton";
import CinematicShell from "@/components/CinematicShell";
import Chatbot from "@/components/Chatbot";
import IntroAnimation from "@/components/IntroAnimation";
import { useToast } from "@/hooks/use-toast";
import { applyTheme, detectTheme } from "@/lib/destinationTheme";

const ITINERARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToPlanner = () => plannerRef.current?.scrollIntoView({ behavior: "smooth" });

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
    } catch (err) {
      console.error(err);
      toast({ title: "Generation failed", description: "Could not generate your itinerary. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setItinerary(null);
    setTripData(null);
    applyTheme("default");
    setTimeout(() => plannerRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <IntroAnimation />
      <Navbar onGetStarted={scrollToPlanner} />

      {!itinerary && (
        <>
          <HeroSection onGetStarted={scrollToPlanner} />
          <div ref={plannerRef}>
            <TripForm onSubmit={handleSubmit} isLoading={loading} />
          </div>
        </>
      )}

      <div ref={resultsRef}>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ItinerarySkeleton />
            </motion.div>
          )}
          {!loading && tripData && itinerary && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <CinematicShell
                tripData={tripData}
                itinerary={itinerary}
                onUpdateItinerary={setItinerary}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Chatbot />

      {!itinerary && (
        <footer className="py-14 bg-primary">
          <div className="container mx-auto px-6 text-center">
            <p className="font-heading text-2xl font-bold text-primary-foreground mb-2">Wanderly</p>
            <p className="font-body text-sm text-primary-foreground/60">Emotionally intelligent travel, designed around you.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Index;
