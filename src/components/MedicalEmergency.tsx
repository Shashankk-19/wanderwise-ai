import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HeartPulse, Phone, Navigation, Pill, Stethoscope, ShieldAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/nearby-emergency`;

type Kind = "hospital" | "pharmacy" | "clinic" | "police";
const KINDS: { id: Kind; label: string; icon: any }[] = [
  { id: "hospital", label: "Hospitals", icon: HeartPulse },
  { id: "clinic", label: "Clinics", icon: Stethoscope },
  { id: "pharmacy", label: "Pharmacies", icon: Pill },
  { id: "police", label: "Police", icon: ShieldAlert },
];

interface Place {
  id: string; name: string; address?: string; phone?: string;
  lat: number; lng: number; rating?: number; reviews?: number; mapsUri?: string; openNow?: boolean;
}

interface Props { lat: number; lng: number; destination: string; }

const MedicalEmergency = ({ lat, lng, destination }: Props) => {
  const [kind, setKind] = useState<Kind>("hospital");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ lat, lng, kind }),
    })
      .then((r) => r.json())
      .then((j) => { if (!cancel) setPlaces(j.places || []); })
      .catch(() => { if (!cancel) setPlaces([]); })
      .finally(() => { if (!cancel) setLoading(false); });
    return () => { cancel = true; };
  }, [kind, lat, lng]);

  return (
    <section className="py-12">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold">Emergency Support in {destination}</h3>
                <p className="text-xs text-muted-foreground">Nearest help, just in case. Tap to call or navigate.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {KINDS.map((k) => {
                const Icon = k.icon;
                const active = k.id === kind;
                return (
                  <button key={k.id} onClick={() => setKind(k.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                      active ? "bg-destructive text-destructive-foreground border-destructive" : "bg-background border-border hover:border-destructive/40"
                    }`}>
                    <Icon className="w-3.5 h-3.5" /> {k.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-10 flex items-center justify-center text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" /> Finding nearest help...
              </div>
            ) : places.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No nearby results found.</p>
            ) : (
              <ul className="grid md:grid-cols-2 gap-3">
                {places.slice(0, 8).map((p) => (
                  <li key={p.id} className="p-4 rounded-2xl bg-background border border-border/60 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-heading text-sm font-semibold leading-tight truncate">{p.name}</p>
                        {p.address && <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{p.address}</p>}
                      </div>
                      {p.openNow != null && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${p.openNow ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                          {p.openNow ? "Open" : "Closed"}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {p.rating && <span>★ {p.rating} {p.reviews ? `(${p.reviews})` : ""}</span>}
                    </div>
                    <div className="flex gap-2 mt-1">
                      {p.phone && (
                        <Button asChild size="sm" variant="default" className="h-8 px-3">
                          <a href={`tel:${p.phone.replace(/\s+/g, "")}`}><Phone className="w-3 h-3" /> Call</a>
                        </Button>
                      )}
                      <Button asChild size="sm" variant="outline" className="h-8 px-3">
                        <a href={p.mapsUri || `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`} target="_blank" rel="noreferrer">
                          <Navigation className="w-3 h-3" /> Directions
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default MedicalEmergency;
