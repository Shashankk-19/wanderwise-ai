import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TripForm, { type TripData } from "@/components/TripForm";
import ItineraryDisplay from "@/components/ItineraryDisplay";
import BudgetBreakdown from "@/components/BudgetBreakdown";
import HotelSuggestions from "@/components/HotelSuggestions";
import TravelChecklist from "@/components/TravelChecklist";
import Chatbot from "@/components/Chatbot";

const Index = () => {
  const [tripData, setTripData] = useState<TripData | null>(null);
  const plannerRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const scrollToPlanner = () => {
    plannerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (data: TripData) => {
    setTripData(data);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onGetStarted={scrollToPlanner} />
      <HeroSection onGetStarted={scrollToPlanner} />
      <div ref={plannerRef}>
        <TripForm onSubmit={handleSubmit} />
      </div>
      {tripData && (
        <div ref={resultsRef}>
          <ItineraryDisplay tripData={tripData} />
          <BudgetBreakdown tripData={tripData} />
          <HotelSuggestions tripData={tripData} />
        </div>
      )}
      <TravelChecklist />

      {/* Footer */}
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
