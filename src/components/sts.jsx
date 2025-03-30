import React, { useState, useEffect, memo, useCallback } from 'react';
import axios from 'axios'; // Import axios
import '../pages/style.scss';


const SpeechToTextConverter = memo(() => {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [currentScene, setCurrentScene] = useState(
    'https://prod.spline.design/ZfXGtOrdyLuJsnNi/scene.splinecode'
  ); // Default scene (not listening)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleClear = () => {
    setTranscript('');
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onstart = () => {
        setIsListening(true);
      };

      recognitionInstance.onresult = (event) => {
        const newTranscript = event.results[0][0].transcript;
        setTranscript((prevTranscript) => prevTranscript + ' ' + newTranscript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  useEffect(() => {
    const handleFetch = async () => {
      if (transcript.trim() === '') return; // Don't fetch if transcript is empty
      setIsLoading(true);
      try {
        console.log(transcript);
        const res = await axios.get(
          `https://agriroad-chat-tybs.onrender.com/getresponse?input=${transcript}`
        );
        setResponse(res.data); // Access res.data instead of res.Data
        console.log(res.data);
      } catch (error) {
        console.error('Error in fetching the info', error);
        setResponse('Sorry, I encountered an error.');
      } finally {
        setIsLoading(false);
      }
    };
    handleClear();
    handleFetch();
  }, [transcript]); // Call handleFetch when transcript changes

  useEffect(() => {
    // Update the scene based on the listening state
    if (isListening) {
      setCurrentScene(
        'https://prod.spline.design/ZYrKXaQkBmgB2u3l/scene.splinecode'
        
      ); // Listening scene
    } else {
      setCurrentScene(
        'https://prod.spline.design/ZfXGtOrdyLuJsnNi/scene.splinecode'
      ); // Not listening scene
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

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [isListening, recognition]);

  const speak = useCallback(
    (text) => {
      if (!text || isSpeaking) return;

      setIsSpeaking(false); // Set isSpeaking to true

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      // Create a new speech utterance
      const utterance = new SpeechSynthesisUtterance(text);

      // Select a voice (optional)
      if (voices.length > 0) {
        utterance.voice = voices[0]; // Use the first available voice
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        setIsSpeaking(false);
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
    <div
      className="container mx-auto p-6 box"

    >
  
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
      </div>
    </div>
  );
});

export default SpeechToTextConverter;
