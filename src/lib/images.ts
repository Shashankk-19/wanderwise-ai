// Reliable image helper — Unsplash source endpoint was deprecated,
// loremflickr returns real keyword-matched photos without an API key.
export function travelImage(keyword: string, w = 800, h = 600, seed?: string | number) {
  const kw = encodeURIComponent(keyword.replace(/\s+/g, ",").toLowerCase());
  const s = seed != null ? `?lock=${encodeURIComponent(String(seed))}` : "";
  return `https://loremflickr.com/${w}/${h}/${kw}${s}`;
}

export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
       <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
         <stop offset='0%' stop-color='#1a3a5f'/><stop offset='100%' stop-color='#2cb6a8'/>
       </linearGradient></defs>
       <rect width='800' height='600' fill='url(#g)'/>
       <text x='50%' y='52%' fill='white' font-family='Poppins,sans-serif' font-size='28' text-anchor='middle' opacity='0.85'>Wanderly</text>
     </svg>`
  );

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const el = e.currentTarget;
  if (el.dataset.fallback === "1") return;
  el.dataset.fallback = "1";
  el.src = FALLBACK_IMG;
}
