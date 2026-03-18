import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, DollarSign, Trash2, ArrowLeft, Compass, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type SavedTrip = Tables<"saved_trips">;

const SavedTrips = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Error loading trips", description: error.message, variant: "destructive" });
    } else {
      setTrips(data ?? []);
    }
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    setDeleting(id);
    const { error } = await supabase.from("saved_trips").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting trip", description: error.message, variant: "destructive" });
    } else {
      setTrips((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Trip deleted" });
    }
    setDeleting(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-24 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">My Saved Trips</h1>
            <p className="text-muted-foreground font-body">View and manage your planned adventures</p>
          </div>
        </div>

        {trips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <Compass className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
            <h2 className="font-heading text-xl font-semibold text-muted-foreground mb-2">No trips yet</h2>
            <p className="text-muted-foreground/70 font-body mb-6">Plan your first adventure to see it here!</p>
            <Button variant="hero" onClick={() => navigate("/")}>
              Plan a Trip
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            <AnimatePresence>
              {trips.map((trip, i) => (
                <motion.div
                  key={trip.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="group hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="font-heading text-xl flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-primary" />
                          {trip.destination}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => deleteTrip(trip.id)}
                          disabled={deleting === trip.id}
                        >
                          {deleting === trip.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-body">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {trip.days} {trip.days === 1 ? "day" : "days"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          ${trip.budget.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground/60">
                          {new Date(trip.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {trip.preferences && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {trip.preferences.split(",").map((pref) => (
                            <span
                              key={pref}
                              className="px-2 py-0.5 text-xs rounded-full bg-secondary text-secondary-foreground"
                            >
                              {pref.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTrips;
