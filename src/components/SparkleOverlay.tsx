import { useEffect } from "react";

/**
 * Mount once at the app root. Listens for clicks on any element with
 * data-sparkle="true" (or sparkle / sparkle-butterfly variants) and emits
 * lightweight particles at the click coordinates.
 *   data-sparkle="sparkle"     -> teal/sage sparkles (default)
 *   data-sparkle="butterfly"   -> floating butterflies
 */
const COLORS = ["#2cb6a8", "#7fc8a9", "#f3d27a", "#ffffff"];

function emitSparkles(x: number, y: number) {
  for (let i = 0; i < 10; i++) {
    const el = document.createElement("span");
    el.className = "sparkle-particle";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const dist = 40 + Math.random() * 50;
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    el.style.background = COLORS[i % COLORS.length];
    el.style.borderRadius = i % 2 === 0 ? "50%" : "2px";
    el.style.boxShadow = `0 0 8px ${COLORS[i % COLORS.length]}`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}

function emitButterflies(x: number, y: number) {
  const emojis = ["🦋", "✨", "🌿"];
  for (let i = 0; i < 6; i++) {
    const el = document.createElement("span");
    el.className = "butterfly-particle";
    el.textContent = emojis[i % emojis.length];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    const angle = (Math.PI * 2 * i) / 6;
    const dist = 60 + Math.random() * 60;
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }
}

const SparkleOverlay = () => {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const el = target.closest("[data-sparkle]") as HTMLElement | null;
      if (!el) return;
      const kind = el.dataset.sparkle;
      if (kind === "butterfly") emitButterflies(e.clientX, e.clientY);
      else emitSparkles(e.clientX, e.clientY);
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);
  return null;
};

export default SparkleOverlay;
