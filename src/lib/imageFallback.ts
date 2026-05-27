// Image utilities — generate safe Unsplash search URLs and Google Maps deep links
// so hotel/restaurant/destination cards never present broken links.

export const unsplashImg = (keyword: string, w = 800, h = 600) =>
  `https://source.unsplash.com/${w}x${h}/?${encodeURIComponent(keyword || "travel,landscape")}`;

/** A cozy, warm placeholder used when an external image fails to load. */
export const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0' stop-color='#f6d8b8'/>
          <stop offset='1' stop-color='#d99a6c'/>
        </linearGradient>
      </defs>
      <rect width='800' height='600' fill='url(#g)'/>
      <g fill='#5b3a22' opacity='0.55' font-family='Poppins, sans-serif' text-anchor='middle'>
        <text x='400' y='305' font-size='44' font-weight='600'>Wanderly</text>
        <text x='400' y='350' font-size='18'>travel · daydream · arrive</text>
      </g>
    </svg>`
  );

export function onImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback === "1") return;
  img.dataset.fallback = "1";
  img.src = FALLBACK_IMG;
}

/** Reliable Google Maps deep link for a place name in a destination. */
export const mapsLink = (name: string, destination?: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    [name, destination].filter(Boolean).join(" ")
  )}`;
