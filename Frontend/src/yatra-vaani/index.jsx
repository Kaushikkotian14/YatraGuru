import React, { useState } from 'react';

const SpeechTranslator = () => {
  const [capturedText, setCapturedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [inputLanguage, setInputLanguage] = useState('hi'); // Default input language: Hindi
  const [outputLanguage, setOutputLanguage] = useState('en'); // Default output language: English

  // Initialize speech recognition
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.interimResults = true;
  recognition.continuous = true;
  recognition.lang = inputLanguage; // Set language for speech recognition

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map((result) => result[0].transcript)
      .join('');

    // Display detected speech
    setCapturedText(transcript);

    // Translate captured text
    translateText(transcript, outputLanguage);
  };

  const startRecognition = () => {
    // Clear previous captured and translated text
    setCapturedText('');
    setTranslatedText('');

    recognition.start();
  };

  // Translation API function
  const translateText = (text, targetLanguage) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_TRANSLATE_API_KEY; // Use the API key from .env.local

    // Construct the Google Translate API URL
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    // Prepare the request data
    const requestBody = {
      q: text,
      target: targetLanguage,
      source: inputLanguage,
    };

    // Call the API to translate the text
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Extract the translated text
        const translated = data.data.translations[0].translatedText;
        setTranslatedText(decodeHtml(translated)); // Decode HTML entities
      })
      .catch((error) => {
        console.error('Error translating:', error);
      });
  };

  // Handle input language selection
  const handleInputLanguageChange = (e) => {
    setInputLanguage(e.target.value);
    recognition.lang = e.target.value; // Change recognition language dynamically
  };

  // Handle output language selection
  const handleOutputLanguageChange = (e) => {
    setOutputLanguage(e.target.value);
  };

  // Function to decode HTML entities
  const decodeHtml = (html) => {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
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
      filter: 'brightness(75%)', // Adjust the brightness of the video
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
    select: {
      color: '#333',
      backgroundColor: '#fff',
      border: '1px solid #ccc',
      padding: '10px',
      marginTop: '10px',
      borderRadius: '5px',
      width: '60%',
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      cursor: 'pointer',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
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
  };

  return (
    <div style={style.container}>
      {/* Background video */}
      <video autoPlay muted loop style={style.videoBackground}>
        <source src="public/my-trips.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div style={style.card}>
        <h1 style={style.title}><b>Yatra Vaani</b></h1>

        {/* Input language selection with label */}
        <label htmlFor="input-language-select"><b>Voice Language:</b>&nbsp;</label>
        <select
          id="input-language-select"
          value={inputLanguage}
          onChange={handleInputLanguageChange}
          style={style.select}
        >
          <option value="hi">Hindi</option>
          <option value="en">English</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="gu">Gujarati</option>
          <option value="ur">Urdu</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="or">Odia</option>
        </select>

        <br />
        <br />

        {/* Output language selection with label */}
        <label htmlFor="output-language-select">&nbsp;&nbsp;&nbsp;&nbsp;<b>Translate to:</b> &nbsp;</label>
        <select
          id="output-language-select"
          value={outputLanguage}
          onChange={handleOutputLanguageChange}
          style={style.select}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="bn">Bengali</option>
          <option value="te">Telugu</option>
          <option value="mr">Marathi</option>
          <option value="ta">Tamil</option>
          <option value="gu">Gujarati</option>
          <option value="ur">Urdu</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="or">Odia</option>
        </select>

        <br />
        <br />
        

        {/* Start voice capture button */}
        <button
          onClick={startRecognition}
          style={style.button}
        >
          Start Speaking
        </button>

        {/* Display captured speech */}
        <p style={style.textBlock}>
          <strong>Captured Speech:</strong> {capturedText}
        </p>

        {/* Display translated speech */}
        <p style={style.textBlock}>
          <strong>Translated Text:</strong> {translatedText}
        </p>
      </div>
    </div>
  );
};

export default SpeechTranslator;
