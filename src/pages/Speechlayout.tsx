import React, { useState, useEffect } from "react";
import SpeechToTextConverter from "../components/sts";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const Speechlayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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
          <p className="text-lg font-medium">Loading your chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen  bg-background">
     
        
      <div className="relative flex flex-1 flex-col">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-hidden relative ">
    
        <div className="sticky bottom-0 bg-background/80 backdrop-blur-sm">
          <SpeechToTextConverter />
        </div>
        </div>
      </div>
    </div>
  );
};

export default Speechlayout;