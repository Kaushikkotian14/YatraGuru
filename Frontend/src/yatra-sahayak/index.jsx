import React, { useState, useEffect, useRef } from 'react';
import { askQuestion } from '../apiService';

const ChatComponent = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [messages, setMessages] = useState([]);
    const recognitionRef = useRef(null);
    const utteranceRef = useRef(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            recognitionRef.current = new window.webkitSpeechRecognition();
            recognitionRef.current.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage + '-IN';
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setMessage(transcript);
                handleSubmit();
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
            };
        } else {
            alert('Speech recognition not supported');
        }
    }, [selectedLanguage]);

    const handleSubmit = async () => {
        setLoading(true);
        document.body.style.backgroundColor = '#f1f1f1';
        
        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_query: message, language: selectedLanguage }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            setLoading(false);
            document.body.style.backgroundColor = '#e9ecef';
    
            // Update messages state
            setMessages(prevMessages => [
                ...prevMessages,
                { type: 'user', text: message },
                { type: 'ai', text: data.response },
            ]);
    
            if (utteranceRef.current) {
                window.speechSynthesis.cancel();
            }
            utteranceRef.current = new SpeechSynthesisUtterance(data.response);
            utteranceRef.current.voice = getVoiceForLanguage(selectedLanguage) || window.speechSynthesis.getVoices()[0];
            utteranceRef.current.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage + '-IN';
            window.speechSynthesis.speak(utteranceRef.current);
            
        } catch (error) {
            console.error('Error:', error);
            document.body.style.backgroundColor = '#e9ecef'; // Or any other default color
        }
        
        setMessage('');
    };

    const startVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.start();
        }
    };

    const stopVoiceInput = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };

    const stopSpeechSynthesis = () => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    };

    const getVoiceForLanguage = (lang) => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(voice => voice.lang.startsWith(lang));
    };

    const goBack = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            window.location.href = '/'; // Redirect to home page or any fallback page
        }
    };

    return (
        <div>
            <div style={styles.containerStyle}>
                <div style={styles.headerBar}>
                <button style={styles.backButton} onClick={goBack}>
                        <b> ↩</b>
                    </button>
       
                    <div style={styles.headerTitle}><b>Yatra Sahayak</b></div>
                    <select style={styles.languageSelect} value={selectedLanguage} onChange={(e) => setSelectedLanguage(e.target.value)}>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="bn">Bengali</option>
                        <option value="te">Telugu</option>
                        <option value="mr">Marathi</option>
                        <option value="ta">Tamil</option>
                        <option value="gu">Gujarati</option>
                        <option value="kn">Kannada</option>
                        <option value="ml">Malayalam</option>
                        <option value="or">Odia</option>
                        <option value="zh">Chinese</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="ja">Japanese</option>
                    </select>
                </div>
                <video style={styles.videoBg} autoPlay muted loop>
                    <source src="/yatra_sahayak.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                <div style={styles.container}>
                    <div id="chat" style={styles.chat}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={msg.type === 'user' ? styles.userMessage : styles.aiMessage}
                            >
                                <p>{msg.text}</p>
                            </div>
                        ))}
                    </div>
                    {loading && (
                        <div style={styles.loading}>
                            <div style={styles.dots}>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                                <div style={styles.dot}></div>
                            </div>
                        </div>
                    )}
                    <form id="chat-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} style={styles.chatForm}>
                        <input
                            type="text"
                            id="user-query"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            required
                            style={styles.userQuery}
                        />
                        <button type="button" id="voice-input" onClick={startVoiceInput} style={styles.iconButton}>
                            <img src="https://cdn-icons-png.flaticon.com/512/709/709950.png" alt="Mic" style={styles.icon} />
                        </button>
                        <button type="button" id="stop-voice" onClick={() => { stopVoiceInput(); stopSpeechSynthesis(); }} style={styles.iconButton}>⏸️
                        </button>
                        <button type="submit" id="send-button" style={styles.iconButton}>
                            <img src="https://cdn-icons-png.flaticon.com/512/876/876777.png" alt="Send" style={styles.icon} />
                        </button>
                    </form>
                </div>
            </div> 
        </div>
    );
};

const styles = {
    headerBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        width: '100%', // Ensure it takes full width
    boxSizing: 'border-box',
    },
    backButton: {
        background: 'none',
        border: 'none',
        fontSize: '24px', // Reduced from 32px
        color: 'white',
        cursor: 'pointer',
        padding: '0',
        margin: '0',
        width: '40px', // Give a fixed width
        display: 'flex',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: '1.5rem', // Reduced from 2rem
        whiteSpace: 'nowrap', // Prevent text wrapping
        flex: '1', // Allow it to take available space
        textAlign: 'center', // Center the title
    },
    languageSelect: {
        backgroundColor: 'white',
    border: 'none',
    padding: '5px 8px', // Reduced padding
    borderRadius: '5px',
    fontSize: '14px', // Reduced from 16px
    color: '#333',
    width: 'auto', // Let it size according to content
    minWidth: '80px', // But with a minimum width
    },
    containerStyle: {
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', // Ensures no scrollbars
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
    container: {
        position: 'relative',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center', // Centering the chat and input
        height: 'calc(100vh - 100px)', // Adjust based on your header height
    justifyContent: 'space-between',
    },
    chat: {
        width: '90%', // Adjust width as needed
        maxWidth: '800px', // Maximum width
        height: '500px',
        overflowY: 'auto',
        border: '1px solid #ced4da',
        background: '#ffffff',
        padding: '10px',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        marginTop: '20px',
        display: 'flex',
    flexDirection: 'column',
       
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: '20px 0',
    },
    dots: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: '#007bff',
        margin: '0 4px',
        animation: 'pulse 1.5s infinite ease-in-out',
    },
    chatForm: {
        display: 'flex',
        alignItems: 'center',
        marginTop: '10px',
        border: '1px solid #ced4da',
        borderRadius: '20px',
        padding: '5px 10px',
        position: 'relative',
        backgroundColor: '#f8f9fa',
        width: '90%', // Adjust width as needed
        maxWidth: '800px', // Maximum width
        boxSizing: 'border-box',
    },
    userQuery: {
        flex: '1',
        border: 'none',
        outline: 'none',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '20px',
        marginRight: '10px',
    },
    iconButton: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        marginLeft: '5px',
        padding: '5px',
        width: '40px',
        height: '40px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: '20px',
        height: '20px',
    },
    userMessage: {
        textAlign: 'right',
        margin: '5px 0 5px 50%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '15px',
        maxWidth: '70%',
        alignSelf: 'flex-end', // Aligns to the right
    },
    aiMessage: {
        textAlign: 'left',
        margin: '5px 0',
        padding: '10px',
        backgroundColor: '#f1f1f1',
        color: '#333',
        borderRadius: '15px',
        maxWidth: '70%',
        alignSelf: 'flex-start', // Aligns to the left
    },
};

// CSS Keyframes for animation
const styleSheet = document.styleSheets[0];
const keyframes = `
@keyframes pulse {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.5;
    }
}
`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default ChatComponent;
