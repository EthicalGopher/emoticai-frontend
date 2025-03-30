// c:\Users\sankh\Downloads\emoticaimain\src\App.tsx
import { Toaster } from "./components/ui/toaster"
import { Toaster as Sonner } from "./components/ui/sonner"
import { TooltipProvider } from "./components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import React from "react"
import { ThemeProvider } from "./contexts/ThemeContext" // Import ThemeProvider
import Speechlayout from "./pages/Speechlayout"


const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider> {/* Wrap the Routes in ThemeProvider */}
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/speech" element={<Speechlayout/>}/>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
