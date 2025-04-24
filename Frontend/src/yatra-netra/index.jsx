import React, { useRef, useState, useEffect } from 'react';

const LensComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [translatedText, setTranslatedText] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('en'); // Default target language is English

  // Access the API key from environment variable
  const API_KEY = import.meta.env.VITE_GOOGLE_LENS_API_KEY;

  // Start the camera
  const startCamera = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        })
        .catch((err) => console.error('Error accessing camera: ', err));
    }
  };

  // Stop the camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Capture photo from the video stream
  const capturePhoto = () => {
    const context = canvasRef.current.getContext('2d');
    context.drawImage(
      videoRef.current,
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    const imageDataUrl = canvasRef.current.toDataURL('image/png');
    performOCR(imageDataUrl);
  };

  // Perform OCR using Google Cloud Vision API
  const performOCR = async (imageDataUrl) => {
    const base64Image = imageDataUrl.split(',')[1];

    try {
      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [
              {
                image: { content: base64Image },
                features: [{ type: 'TEXT_DETECTION' }],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      if (data.responses && data.responses[0].textAnnotations) {
        const detectedText = data.responses[0].textAnnotations[0].description;
        detectLanguageAndTranslate(detectedText);
      } else {
        console.error('No text detected');
      }
    } catch (error) {
      console.error('Error performing OCR:', error);
    }
  };

  // Detect the language of the extracted text and translate it
  const detectLanguageAndTranslate = async (text) => {
    try {
      // Detect the language
      const detectResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ q: text }),
        }
      );

      const detectData = await detectResponse.json();
      const detectedLanguage = detectData.data.detections[0][0].language;

      // Translate to the target language
      const translateResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            source: detectedLanguage,
            target: targetLanguage,
          }),
        }
      );

      const translateData = await translateResponse.json();
      const translatedText = translateData.data.translations[0].translatedText;
      setTranslatedText(translatedText);
      textToSpeech(translatedText);
    } catch (error) {
      console.error('Error detecting language or translating text:', error);
    }
  };

  // Convert translated text to speech using Google Text-to-Speech API
  const textToSpeech = async (text) => {
    try {
      const response = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: { text: text },
            voice: { languageCode: targetLanguage, name: 'en-US-Wavenet-D' }, // Adjust voice based on language
            audioConfig: { audioEncoding: 'MP3' },
          }),
        }
      );

      const data = await response.json();
      const audio = new Audio('data:audio/mp3;base64,' + data.audioContent);
      audio.play();
    } catch (error) {
      console.error('Error converting text to speech:', error);
    }
  };

  useEffect(() => {
    // Ensure the videoRef is not null when accessing it
    if (cameraActive) {
      startCamera();
    }
  }, [cameraActive]);

  return (
    
    <div style={styles.container}>
                      <video style={styles.videoBg} autoPlay muted loop>
                    <source src="/yatra_sahayak.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
      <h1 style={styles.heading}>Yatra Netra</h1>
      <div style={styles.videoContainer}>
        {cameraActive && (
          <video ref={videoRef} style={styles.video} autoPlay />
        )}
        <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }}></canvas>
      </div>
      <div style={styles.buttonContainer}>
        {!cameraActive ? (
          <button
            onClick={() => setCameraActive(true)}
            style={styles.button}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
          >
            Start Camera
          </button>
        ) : (
          <>
            <button
              onClick={stopCamera}
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Stop Camera
            </button>
            <button
              onClick={capturePhoto}
              style={styles.button}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.button.backgroundColor}
            >
              Capture Photo
            </button>
          </>
        )}
      </div>
      <div style={styles.languageSelector}>
        <label htmlFor="target-language-select" style={styles.label}>Translate To: </label>
        <select
          id="target-language-select"
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          style={styles.select}
        >
          {/* Indian languages */}
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="ta">Tamil</option>
          <option value="te">Telugu</option>
          <option value="bn">Bengali</option>
          <option value="mr">Marathi</option>
          <option value="gu">Gujarati</option>
          <option value="kn">Kannada</option>
          <option value="ml">Malayalam</option>
          <option value="or">Odia</option>
          <option value="as">Assamese</option>
          <option value="pa">Punjabi</option>
          <option value="ne">Nepali</option>
          <option value="si">Sinhala</option>
          <option value="ks">Kashmiri</option>
          <option value="sd">Sindhi</option>
          <option value="bh">Bhojpuri</option>
          <option value="mag">Magahi</option>
          <option value="sa">Sanskrit</option>

          {/* Global languages */}
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="zh">Chinese (Simplified)</option>
          <option value="ja">Japanese</option>
          <option value="ko">Korean</option>
          <option value="ar">Arabic</option>
          <option value="ru">Russian</option>
          <option value="vi">Vietnamese</option>
          <option value="tr">Turkish</option>
          <option value="pl">Polish</option>
          <option value="sv">Swedish</option>
          <option value="no">Norwegian</option>
          <option value="fi">Finnish</option>
          <option value="da">Danish</option>
          <option value="cs">Czech</option>
          <option value="hu">Hungarian</option>
          <option value="he">Hebrew</option>
          <option value="th">Thai</option>
        </select>
      </div>
      {translatedText && <p style={styles.translatedText}>Translated Text: {translatedText}</p>}
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'transparent',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  videoBg: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: '-1',
},
  heading: {
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333',
    fontWeight: '600',
  },
  videoContainer: {
    marginBottom: '20px',
    position: 'relative',
    display: 'inline-block',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  video: {
    width: '320px',
    height: '240px',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    border: '3px solid #007bff',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    backgroundColor: '#007bff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
  languageSelector: {
    marginBottom: '20px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
  },
  label: {
    marginRight: '10px',
    fontSize: '16px',
  },
  select: {
    fontSize: '16px',
    padding: '5px',
    border: 'none',
    borderRadius: '5px',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.1)',
  },
  translatedText: {
    fontWeight: '600',
    fontSize: '18px',
    color: '#333',
    marginTop: '20px',
    backgroundColor: 'white',
  },
};

export default LensComponent;