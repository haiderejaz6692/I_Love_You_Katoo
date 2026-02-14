import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ValentineYes from "./pages/ValentineYes";
import KatooSplash from "./components/KatooSplash";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  const triggerSplash = useCallback((duration = 5000) => {
    setShowSplash(true);
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => setShowSplash(false), duration);
  }, []);

  useEffect(() => {
    triggerSplash();
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ duration?: number }>).detail;
      triggerSplash(detail?.duration ?? 5000);
    };
    window.addEventListener("katoo:splash", handler as EventListener);
    return () => {
      window.removeEventListener("katoo:splash", handler as EventListener);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [triggerSplash]);

  useEffect(() => {
    document.body.style.overflow = showSplash ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showSplash]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/yes" element={<ValentineYes />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <KatooSplash visible={showSplash} />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
