export type DestinationTheme = "mountains" | "beach" | "nightlife" | "spiritual" | "default";

const KEYWORDS: Record<Exclude<DestinationTheme, "default">, string[]> = {
  mountains: ["manali", "shimla", "leh", "ladakh", "kashmir", "darjeeling", "sikkim", "nainital", "munnar", "ooty", "alps", "himalaya", "mountain", "trek", "kedarnath", "spiti"],
  beach: ["goa", "bali", "maldives", "andaman", "pondicherry", "phuket", "krabi", "miami", "beach", "island", "lakshadweep", "varkala", "gokarna"],
  nightlife: ["dubai", "las vegas", "bangkok", "ibiza", "mumbai", "berlin", "amsterdam", "tokyo nightlife", "miami beach"],
  spiritual: ["varanasi", "rishikesh", "haridwar", "tirupati", "amritsar", "bodh gaya", "puri", "ujjain", "kashi", "ayodhya", "vrindavan", "kyoto", "lhasa"],
};

export function detectTheme(destination: string): DestinationTheme {
  const d = destination.toLowerCase();
  for (const [theme, words] of Object.entries(KEYWORDS) as [Exclude<DestinationTheme, "default">, string[]][]) {
    if (words.some((w) => d.includes(w))) return theme;
  }
  return "default";
}

export function applyTheme(theme: DestinationTheme) {
  if (typeof document === "undefined") return;
  if (theme === "default") document.documentElement.removeAttribute("data-theme");
  else document.documentElement.setAttribute("data-theme", theme);
}
