import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GW = "https://connector-gateway.lovable.dev/google_maps";

const TYPE_MAP: Record<string, string[]> = {
  hospital: ["hospital"],
  pharmacy: ["pharmacy"],
  clinic: ["doctor"],
  police: ["police"],
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { lat, lng, kind = "hospital", radius = 5000 } = await req.json();
    if (typeof lat !== "number" || typeof lng !== "number") throw new Error("lat/lng required");
    const lk = Deno.env.get("LOVABLE_API_KEY");
    const gk = Deno.env.get("GOOGLE_MAPS_API_KEY");
    if (!lk || !gk) throw new Error("Google Maps connector not configured");

    const includedTypes = TYPE_MAP[kind] || [kind];
    const r = await fetch(`${GW}/places/v1/places:searchNearby`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lk}`,
        "X-Connection-Api-Key": gk,
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.location,places.rating,places.userRatingCount,places.googleMapsUri,places.regularOpeningHours.openNow",
      },
      body: JSON.stringify({
        includedTypes,
        maxResultCount: 10,
        rankPreference: "DISTANCE",
        locationRestriction: { circle: { center: { latitude: lat, longitude: lng }, radius } },
      }),
    });
    if (!r.ok) {
      const t = await r.text();
      console.error("places error", r.status, t);
      throw new Error("Places search failed");
    }
    const j = await r.json();
    const places = (j.places || []).map((p: any) => ({
      id: p.id,
      name: p.displayName?.text,
      address: p.formattedAddress,
      phone: p.internationalPhoneNumber,
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      rating: p.rating,
      reviews: p.userRatingCount,
      mapsUri: p.googleMapsUri,
      openNow: p.regularOpeningHours?.openNow,
    }));
    return new Response(JSON.stringify({ places }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("nearby-emergency error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown", places: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
