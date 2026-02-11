import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";
import Index from "./pages/Index";
import PlayPage from "./pages/PlayPage";
import ScenarioPlayer from "./pages/ScenarioPlayer";
import PuzzlePage from "./pages/PuzzlePage";
import PuzzlePlayer from "./pages/PuzzlePlayer";
import LearnPage from "./pages/LearnPage";
import ProgressPage from "./pages/ProgressPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/play" element={<PlayPage />} />
            <Route path="/play/:scenarioId" element={<ScenarioPlayer />} />
            <Route path="/puzzles" element={<PuzzlePage />} />
            <Route path="/puzzles/:puzzleId" element={<PuzzlePlayer />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/progress" element={<ProgressPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
