import { createRoot } from "react-dom/client";
import "@/audio/howlerGlobal";
import App from "./App.tsx";
import "./index.css";
import AppErrorBoundary from "@/components/AppErrorBoundary";

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>,
);
