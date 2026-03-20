import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripForm, { type TripData } from "@/components/TripForm";
import ItineraryDisplay, { type GeneratedItinerary } from "@/components/ItineraryDisplay";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import HotelSuggestions from "@/components/HotelSuggestions";
import TravelChecklist from "@/components/TravelChecklist";
import Chatbot from "@/components/Chatbot";
import { useToast } from "@/hooks/use-toast";

const ITINERARY_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-itinerary`;

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const plannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToPlanner = () => {
    plannerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (data: TripData) => {
    setTripData(data);
    setLoading(true);
    setItinerary(null);

    try {
      const resp = await fetch(ITINERARY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify(data),
      });

      if (!resp.ok) {
        throw new Error("Failed to generate itinerary");
      }

      const result: GeneratedItinerary = await resp.json();
      setItinerary(result);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error(err);
      toast({
        title: "Generation failed",
        description: "Could not generate your itinerary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={scrollToPlanner} />
      <HeroSection onGetStarted={scrollToPlanner} />
      <div ref={plannerRef}>
        <TripForm onSubmit={handleSubmit} isLoading={loading} />
      </div>
      {tripData && itinerary && (
        <div ref={resultsRef}>
          <ItineraryDisplay tripData={tripData} itinerary={itinerary} />
          <BudgetBreakdown tripData={tripData} itinerary={itinerary} />
          <HotelSuggestions tripData={tripData} itinerary={itinerary} />
        </div>
      )}
      <TravelChecklist />
      <Chatbot />

      <footer className="py-12 bg-foreground">
        <div className="container mx-auto px-6 text-center">
          <p className="font-heading text-2xl font-bold text-primary-foreground mb-2">Wanderly</p>
          <p className="font-body text-sm text-primary-foreground/60">
            AI-powered travel planning for budget-conscious explorers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
