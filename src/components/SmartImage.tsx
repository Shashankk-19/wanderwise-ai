import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { FALLBACK_IMG, onImgError } from "@/lib/images";
import { supabase } from "@/integrations/supabase/client";

type Kind = "destination" | "hotel";

const cache = new Map<string, string | null>();
const inflight = new Map<string, Promise<string | null>>();

const MEDIA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/media-search`;

async function fetchMedia(query: string, type: Kind): Promise<string | null> {
  const k = `${type}::${query.toLowerCase()}`;
  if (cache.has(k)) return cache.get(k)!;
  if (inflight.has(k)) return inflight.get(k)!;

  // sessionStorage warm cache (URLs only)
  try {
    const ss = sessionStorage.getItem(`img:${k}`);
    if (ss) { cache.set(k, ss); return ss; }
  } catch {}

  const p = (async () => {
    try {
      const r = await fetch(MEDIA_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ query, type }),
      });
      const j = await r.json();
      const url: string | null = j?.results?.[0]?.url ?? null;
      cache.set(k, url);
      if (url) try { sessionStorage.setItem(`img:${k}`, url); } catch {}
      return url;
    } catch {
      cache.set(k, null);
      return null;
    } finally {
      inflight.delete(k);
    }
  })();
  inflight.set(k, p);
  return p;
}

interface Props {
  query: string;
  type?: Kind;
  alt: string;
  className?: string;
  imgClassName?: string;
  rounded?: string;
}

const SmartImage = ({ query, type = "destination", alt, className = "", imgClassName = "", rounded = "rounded-2xl" }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancel = false;
    setLoaded(false);
    fetchMedia(query, type).then((u) => { if (!cancel) setUrl(u || FALLBACK_IMG); });
    return () => { cancel = true; };
  }, [query, type]);

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`}>
      {!loaded && <Skeleton className={`absolute inset-0 ${rounded}`} />}
      {url && (
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={(e) => { onImgError(e); setLoaded(true); }}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${imgClassName}`}
        />
      )}
    </div>
  );
};

export default SmartImage;
