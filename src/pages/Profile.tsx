import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, X, Plus, User } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const TRAVEL_STYLES = ["Adventure", "Relaxation", "Cultural", "Luxury", "Budget", "Family", "Solo", "Romantic"];
const BUDGET_OPTIONS = ["Budget ($0-$50/day)", "Mid-range ($50-$150/day)", "Comfort ($150-$300/day)", "Luxury ($300+/day)"];

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [preferredBudget, setPreferredBudget] = useState("");
  const [destinations, setDestinations] = useState<string[]>([]);
  const [newDestination, setNewDestination] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }
    if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user!.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || "");
      setTravelStyle(data.travel_style || "");
      setPreferredBudget(data.preferred_budget || "");
      setDestinations(data.favorite_destinations || []);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        travel_style: travelStyle,
        preferred_budget: preferredBudget,
        favorite_destinations: destinations,
      })
      .eq("user_id", user!.id);

    setSaving(false);
    if (error) {
      toast.error("Failed to save profile");
    } else {
      toast.success("Profile updated!");
    }
  };

  const addDestination = () => {
    const trimmed = newDestination.trim();
    if (trimmed && !destinations.includes(trimmed)) {
      setDestinations([...destinations, trimmed]);
      setNewDestination("");
    }
  };

  const removeDestination = (dest: string) => {
    setDestinations(destinations.filter((d) => d !== dest));
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 pt-24 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="font-heading">Your Profile</CardTitle>
                  <CardDescription>Personalize your travel experience</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Travel Style</Label>
                <Select value={travelStyle} onValueChange={setTravelStyle}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your travel style" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRAVEL_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Preferred Budget</Label>
                <Select value={preferredBudget} onValueChange={setPreferredBudget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {BUDGET_OPTIONS.map((budget) => (
                      <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Favorite Destinations</Label>
                <div className="flex gap-2">
                  <Input
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="Add a destination"
                    maxLength={100}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addDestination())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addDestination}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {destinations.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {destinations.map((dest) => (
                      <Badge key={dest} variant="secondary" className="gap-1 pr-1">
                        {dest}
                        <button onClick={() => removeDestination(dest)} className="ml-1 hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
