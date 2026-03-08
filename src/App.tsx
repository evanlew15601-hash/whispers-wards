import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/audio/AudioProvider";
import { TipsProvider } from "@/ui/tips/TipsProvider";
import Index from "./pages/Index";
import PortraitLab from "./pages/PortraitLab";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const baseUrl = import.meta.env.BASE_URL;
// Vite sets BASE_URL to:
// - "/" on root deploys
// - "/<repo>/" on GitHub Pages project sites
// - "./" when using a relative base
const basename = baseUrl.startsWith('/') ? baseUrl.replace(/\/$/, '') : '';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AudioProvider>
      <TipsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={basename}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/portrait-lab" element={<PortraitLab />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TipsProvider>
    </AudioProvider>
  </QueryClientProvider>
);

export default App;
