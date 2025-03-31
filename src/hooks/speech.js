import { useEffect, useState } from "react";


const useSpeechRecognition = () => {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile
    setIsMobile(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent));
  }, []);


  const createRecognition = () => {

    const SpeechRecognition = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition || 
      window.mozSpeechRecognition || 
      window.msSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return null;
    }
    
    try {
      const recognition = new SpeechRecognition();
      // Use settings that work better on mobile
      recognition.continuous = !isMobile; // continuous on desktop, not on mobile
      recognition.lang = "en-US";
      recognition.interimResults = !isMobile; // interim results only on desktop
      return recognition;
    } catch (err) {
      setError(`Failed to initialize speech recognition: ${err.message}`);
      return null;
    }
  };

  useEffect(() => {
    const recognition = createRecognition();
    if (!recognition) return;

    recognition.onresult = (event) => {
      let currentTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      setText(currentTranscript);
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      setError(`Speech recognition error: ${event.error}`);
    };

    // Request permission on hook initialization for mobile
    const requestPermission = async () => {
      if (isMobile) {
        try {
          await navigator.mediaDevices.getUserMedia({ audio: true });
        } catch (err) {
          setError(`Microphone permission denied: ${err.message}`);
        }
      }
    };
    
    requestPermission();

    return () => {
      if (recognition) {
        recognition.onresult = null;
        recognition.onstart = null;
        recognition.onend = null;
        recognition.onerror = null;
        if (recognition.state === "recording") {
          recognition.stop();
        }
      }
    };
  }, [isMobile]); // Re-initialize when mobile detection changes

  const startListening = async () => {
    setText("");
    setError(null);
    
    // Request permission explicitly every time on mobile
    if (isMobile) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (err) {
        setError(`Microphone permission denied: ${err.message}`);
        return;
      }
    }
    
    const recognition = createRecognition();
    if (recognition && !isListening) {
      try {
        recognition.start();
      } catch (error) {
        console.error("Error starting recognition:", error);
        setError(`Error starting recognition: ${error.message}`);
        
        // Try to recover by forcing a clean state
        try {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
          }, 200);
        } catch (retryError) {
          setError(`Failed to restart recognition: ${retryError.message}`);
        }
      }
    }
  };

  const stopListening = () => {
    const recognition = createRecognition();
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  return {
    text,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!window.SpeechRecognition || !!window.webkitSpeechRecognition,
    error,
    isMobile
  };
};

export default useSpeechRecognition;
