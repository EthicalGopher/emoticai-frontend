import React, { useState, useEffect, memo, useCallback } from 'react';
import axios from 'axios';
import '../pages/style.scss';

const SpeechToTextConverter = memo(() => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentScene, setCurrentScene] = useState(
    'https://prod.spline.design/ZfXGtOrdyLuJsnNi/scene.splinecode'
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    supported: false,
    error: null,
    device: 'unknown'
  });

  const handleClear = () => {
    setTranscript('');
  };

  // Check if device is mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Request microphone permission explicitly
  const requestMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setDebugInfo(prev => ({ ...prev, error: null }));
      return true;
    } catch (error) {
      setDebugInfo(prev => ({ ...prev, error: `Permission error: ${error.message}` }));
      return false;
    }
  };

  useEffect(() => {
    // Update debug info with device type
    setDebugInfo(prev => ({ 
      ...prev, 
      device: isMobile ? 'mobile' : 'desktop' 
    }));

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setDebugInfo(prev => ({ ...prev, supported: true }));
      
      const recognitionInstance = new SpeechRecognition();
      // Use more restrictive settings for mobile
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        setDebugInfo(prev => ({ ...prev, error: null }));
      };

      recognitionInstance.onresult = (event) => {
        try {
          const newTranscript = event.results[0][0].transcript;
          setTranscript((prevTranscript) => prevTranscript + ' ' + newTranscript);
        } catch (error) {
          setDebugInfo(prev => ({ ...prev, error: `Result error: ${error.message}` }));
        }
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setDebugInfo(prev => ({ ...prev, error: `Recognition error: ${event.error}` }));
      };

      setRecognition(recognitionInstance);
    } else {
      setDebugInfo(prev => ({ 
        ...prev, 
        supported: false,
        error: 'SpeechRecognition not supported in this browser'
      }));
    }
  }, [isMobile]);

  useEffect(() => {
    const name2 = localStorage.getItem('user');
    // Add a null check before parsing
    const name = name2 ? JSON.parse(name2)?.name : '';
    
    const handleFetch = async () => {
      if (transcript.trim() === '') return; // Don't fetch if transcript is empty
      setIsLoading(true);
      try {
        console.log(transcript);
        const res = await axios.get(
          `https://emoticai-backend.onrender.com/?input=${encodeURIComponent(transcript)}&username=${encodeURIComponent(name)}`
        );
        setResponse(res.data);
        console.log(res.data);
      } catch (error) {
        console.error('Error in fetching the info', error);
        setResponse('Sorry, I encountered an error.');
        setDebugInfo(prev => ({ ...prev, error: `API error: ${error.message}` }));
      } finally {
        setIsLoading(false);
      }
    };
    
    if (transcript.trim() !== '') {
      handleClear();
      handleFetch();
    }
  }, [transcript]);

  useEffect(() => {
    // Update the scene based on the listening state
    if (isListening) {
      setCurrentScene(
        'https://prod.spline.design/wpf0-lMEBGUtlUwn/scene.splinecode'
      );
    } else {
      setCurrentScene(
        'https://prod.spline.design/ZfXGtOrdyLuJsnNi/scene.splinecode'
      );
    }
  }, [isListening]);

  useEffect(() => {
    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    handleVoicesChanged(); // Get initial voices

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const toggleListening = useCallback(async () => {
    if (!recognition) {
      setDebugInfo(prev => ({ ...prev, error: 'Speech recognition not initialized' }));
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      // Ask for permission first on mobile
      if (isMobile) {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
          alert('Microphone permission is required for voice recognition');
          return;
        }
      }
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        setDebugInfo(prev => ({ ...prev, error: `Start error: ${error.message}` }));
        
        // Try to recover by stopping any existing sessions first
        try {
          recognition.stop();
          setTimeout(() => {
            recognition.start();
          }, 200);
        } catch (retryError) {
          setDebugInfo(prev => ({ ...prev, error: `Retry error: ${retryError.message}` }));
        }
      }
    }
  }, [isListening, recognition, isMobile]);

  const speak = useCallback(
    (text) => {
      if (!text || isSpeaking) return;

      setIsSpeaking(true);

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Select a voice (optional)
      if (voices.length > 0) {
        // Try to use a female voice if available
        const femaleVoice = voices.find(voice => 
          voice.name.includes('female') || 
          voice.name.includes('Samantha') || 
          voice.name.includes('Google UK English Female')
        );
        utterance.voice = femaleVoice || voices[0];
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
        setDebugInfo(prev => ({ ...prev, error: `Synthesis error: ${event.error}` }));
      };

      // Speak the text
      window.speechSynthesis.speak(utterance);
    },
    [isSpeaking, voices]
  );

  useEffect(() => {
    if (response) {
      speak(response);
      setResponse('');
    }
  }, [response, speak]);

  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return (
      <div className="text-red-500 text-center p-4">
        Speech recognition is not supported in this browser.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 box bg-background">
      <div className="aielement">
        <spline-viewer url="https://prod.spline.design/DwXgvLAwHRM8gDPp/scene.splinecode"></spline-viewer>
      </div>
      <div className="flex flex-col items-center justify-content">
        <button
          onClick={toggleListening}
          id="micButton"
          className="transition-colors cursor-pointer"
        >
          <spline-viewer url={currentScene}></spline-viewer>
        </button>
        
        {/* Show status indicators */}
        <div 
          className="status-indicator"
          style={{
            position: 'fixed',
            bottom: '10px',
            left: '10px',
            color: 'white',
            fontSize: '12px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: '5px',
            borderRadius: '5px',
            zIndex: 1000
          }}
        >
          <div>Device: {debugInfo.device}</div>
          <div>Recognition: {debugInfo.supported ? 'Supported' : 'Not Supported'}</div>
          <div>Status: {isListening ? 'Listening' : 'Not Listening'}</div>
          {isLoading && <div>Processing...</div>}
          {debugInfo.error && <div style={{color: 'red'}}>{debugInfo.error}</div>}
        </div>
      </div>
    </div>
  );
});

export default SpeechToTextConverter;
