import React, { useState } from 'react';

const SpeechTranslator = () => {
  const [capturedText, setCapturedText] = useState('');
  const [translatedTexts, setTranslatedTexts] = useState([]);
  const [inputLanguage, setInputLanguage] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('en'); // Default output language

  const outputLanguages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'bn', name: 'Bengali' },
    { code: 'te', name: 'Telugu' },
    { code: 'mr', name: 'Marathi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ur', name: 'Urdu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'or', name: 'Odia' },
  ];

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join('');

    setCapturedText(transcript);
    detectLanguageAndTranslate(transcript);
  };

  const startRecognition = () => {
    setCapturedText('');
    setTranslatedTexts([]);
    recognition.start();
  };

  const detectLanguageAndTranslate = (text) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // API key from .env.local

    const urlDetect = `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`;
    
    fetch(urlDetect, {
      method: 'POST',
      body: JSON.stringify({ q: text }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const detectedLang = data.data.detections[0][0].language;
        setInputLanguage(detectedLang);
        translateText(text, detectedLang, outputLanguage); // Pass selected output language
      })
      .catch((error) => {
        console.error('Error detecting language:', error);
      });
  };

  const translateText = (text, detectedLang, targetLanguage) => {
    const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY; // API key from .env.local
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
    
    const requestBody = {
      q: text,
      target: targetLanguage,
      source: detectedLang,
    };

    fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const translated = data.data.translations[0].translatedText;
        setTranslatedTexts([translated]); // Store the translated text
        playVoice(translated, targetLanguage); // Play the translated text
      })
      .catch((error) => {
        console.error('Error translating:', error);
      });
  };

  const playVoice = (text, language) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const handleLanguageChange = (event) => {
    setOutputLanguage(event.target.value); // Update the selected output language
  };

  const style = {
    container: {
      textAlign: 'center',
      color: 'white',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
    },
    videoBackground: {
      position: 'fixed',
      right: 0,
      bottom: 0,
      minWidth: '100%',
      minHeight: '100%',
      zIndex: '-1',
      objectFit: 'cover',
      filter: 'brightness(50%)',
    },
    card: {
      marginTop: '100px',
      padding: '30px',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: '15px',
      display: 'inline-block',
      color: 'black',
      boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.3)',
      maxWidth: '500px',
      width: '100%',
      textAlign: 'center',
    },
    title: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#4A4A4A',
    },
    button: {
      padding: '15px 30px',
      fontSize: '16px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
      boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
    },
    textBlock: {
      marginTop: '20px',
      fontSize: '18px',
      fontFamily: 'Verdana, sans-serif',
      color: '#333',
      lineHeight: '1.5',
    },
    select: {
      marginTop: '20px',
      padding: '10px',
      fontSize: '16px',
    },
  };

  return (
    <div style={style.container}>
      <video autoPlay muted loop style={style.videoBackground}>
        <source src="path-to-your-background-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={style.card}>
        <h2 style={style.title}>AI Voice Translator</h2>
        
        {/* Dropdown for language selection */}
        <label htmlFor="language-select">Translate to:</label>
        <select
          id="language-select"
          style={style.select}
          value={outputLanguage}
          onChange={handleLanguageChange}
        >
          {outputLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>

        {/* Start voice capture button */}
        <button
          onClick={startRecognition}
          style={style.button}
        >
          🎤 Start Listening
        </button>

        {/* Display captured speech */}
        <p style={style.textBlock}>
          <strong>Captured Speech:</strong> {capturedText}
        </p>

        {/* Display translated speech */}
        <div style={style.textBlock}>
          <strong>Translated Text:</strong>
          <ul>
            {translatedTexts.map((translated, index) => (
              <li key={index}>{translated}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SpeechTranslator;
