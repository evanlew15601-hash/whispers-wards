import { createRoot } from "react-dom/client";
import "@/audio/howlerGlobal";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
