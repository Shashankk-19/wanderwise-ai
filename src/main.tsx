import { createRoot } from "react-dom/client";
import { ConfigError } from "./components/ConfigError.tsx";
import { checkEnv } from "./lib/env.ts";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
const env = checkEnv();

if (!env.ok) {
  // eslint-disable-next-line no-console
  console.error("[Wanderly] Missing required env vars:", env.missing);
  root.render(<ConfigError missing={env.missing} />);
} else {
  const { default: App } = await import("./App.tsx");
  root.render(<App />);
}
