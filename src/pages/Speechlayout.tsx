import React, { useState, useEffect } from "react";
import SpeechToTextConverter from "../components/sts";
import Header from "../components/Header";

const Speechlayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isCompatible, setIsCompatible] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Check browser compatibility
  useEffect(() => {
    const checkCompatibility = () => {
      const hasRecognition = !!window.SpeechRecognition || !!window.webkitSpeechRecognition;
      const hasSpeechSynthesis = !!window.speechSynthesis;
      setIsCompatible(hasRecognition && hasSpeechSynthesis);
    };
    
    checkCompatibility();
  }, []);

  // Simulate page loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-lg font-medium">Loading your interface...</p>
        </div>
      </div>
    );
  }

  // Show compatibility warning if needed
  if (!isCompatible) {
    return (
      <div className="flex h-screen items-center justify-center bg-background flex-col p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold mb-4">Browser Compatibility Issue</h2>
          <p className="mb-4">
            Your browser doesn't fully support the speech recognition features needed for this application.
          </p>
          <p className="mb-4">
            For the best experience, please use Google Chrome on desktop or Android.
          </p>
          <button 
            className="px-4 py-2 bg-primary text-white rounded"
            onClick={() => setIsCompatible(true)} // Continue anyway
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="relative flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-hidden relative">
          <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm" style={{scale:"1",marginTop:"-40px"}}>
            <SpeechToTextConverter />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Speechlayout;
