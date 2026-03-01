import { createRoot } from "react-dom/client";
import "@/audio/howlerGlobal";
import App from "./App.tsx";
import "./index.css";

declare global {
  interface Window {
    __CC_BOOTED?: boolean;
  }
}

window.__CC_BOOTED = true;
document.getElementById("boot-fallback")?.remove();

createRoot(document.getElementById("root")!).render(<App />);
