import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PEXELS = "https://api.pexels.com/v1/search";
const GW = "https://connector-gateway.lovable.dev/google_maps";

interface MediaResp { url: string | null; alt?: string; source: "pexels" | "google" | "none" }

async function pexels(query: string, count = 1): Promise<MediaResp[]> {
  const key = Deno.env.get("PEXELS_API_KEY");
  if (!key) return [];
  const r = await fetch(`${PEXELS}?query=${encodeURIComponent(query)}&per_page=${count}&orientation=landscape`, {
    headers: { Authorization: key },
  });
  if (!r.ok) return [];
  const j = await r.json();
  return (j.photos || []).map((p: any) => ({
    url: p.src?.large2x || p.src?.large || p.src?.original,
    alt: p.alt || query,
    source: "pexels" as const,
  }));
}

async function googlePlacePhoto(query: string): Promise<MediaResp | null> {
  const lk = Deno.env.get("LOVABLE_API_KEY");
  const gk = Deno.env.get("GOOGLE_MAPS_API_KEY");
  const browserKey = Deno.env.get("GOOGLE_MAPS_BROWSER_KEY");
  if (!lk || !gk) return null;
  // Text search first
  const sr = await fetch(`${GW}/places/v1/places:searchText`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lk}`,
      "X-Connection-Api-Key": gk,
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.id,places.photos",
    },
    body: JSON.stringify({ textQuery: query, pageSize: 1 }),
  });
  if (!sr.ok) return null;
  const sj = await sr.json();
  const photoName = sj.places?.[0]?.photos?.[0]?.name;
  if (!photoName || !browserKey) return null;
  // Photo media endpoint — return the direct googleusercontent URL via skipHttpRedirect
  const pr = await fetch(`https://places.googleapis.com/v1/${photoName}/media?maxWidthPx=1200&skipHttpRedirect=true&key=${browserKey}`);
  if (!pr.ok) return null;
  const pj = await pr.json();
  return pj.photoUri ? { url: pj.photoUri, alt: query, source: "google" } : null;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { query, type = "destination", count = 1 } = await req.json();
    if (!query) throw new Error("query required");

    let results: MediaResp[] = [];

    if (type === "hotel") {
      const g = await googlePlacePhoto(query);
      if (g) results.push(g);
      if (!results.length) results = await pexels(query, count);
    } else {
      results = await pexels(query, count);
    }

    if (!results.length) results = [{ url: null, source: "none" }];

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("media-search error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown", results: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
