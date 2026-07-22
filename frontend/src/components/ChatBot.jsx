import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Bot, SendHorizonal, Sparkles } from 'lucide-react';
import { usePrescription } from '../context/PrescriptionContext';
import axios from '../services/api';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { prescription, removeFromPrescription } = usePrescription();
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = { sender: 'user', text: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const prescriptionNames = prescription.map((med) => med.name);

      const response = await axios.post('/ask', {
        message,
        prescription: prescriptionNames,
      });

      setChatHistory((prev) => [
        ...prev,
        { sender: 'bot', text: response.response },
      ]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatHistory((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "Sorry, I'm having trouble connecting to the medical assistant.",
        },
      ]);
    } finally {
      setIsTyping(false);
      setMessage('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  return (
    <div id="chat-assistant" className="section-card chat-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Assistant</span>
          <h2>Medication Assistant</h2>
        </div>
        {/* <div className="section-meta">AI guided</div> */}
      </div>

      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.length === 0 && !isTyping ? (
            <div className="empty-state chat-empty-state">
              <Bot size={18} />
              <p>Ask a question about your current medication list and get guided support.</p>
            </div>
          ) : (
            chatHistory.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`message ${msg.sender}`}>
                {msg.sender === 'bot' ? (
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  msg.text
                )}
              </div>
            ))
          )}

          {isTyping && (
            <div className="message bot typing-bubble">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-wrap">
          <div className="chat-input-shell">
            <Sparkles size={16} className="input-icon" />
              <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isTyping
                  ? "AI is generating a response..."
                  : "Ask about your medications..."
              }
              disabled={isTyping}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isTyping) {
                  sendMessage();
                }
              }}
            />
          </div>
              <button
              type="button"
              className="primary-btn"
              onClick={sendMessage}
              disabled={isTyping || !message.trim()}
            >
              {isTyping ? (
                <>
                  <span className="spinner" />
                  Thinking...
                </>
              ) : (
                <>
                  <SendHorizonal size={16} />
                  Send
                </>
              )}
            </button>
        </div>

        <div className="prescription-context">
          <strong>Current Prescription:</strong>
          {prescription.length > 0 ? (
            prescription.map((med) => (
              <span className="prescription-pill" key={med.id}>
                {med.name} (₹{med.price?.toFixed(2) || 'N/A'})

                <button
                  type="button"
                  className="remove-pill"
                  onClick={() => removeFromPrescription(med.id)}
                  aria-label={`Remove ${med.name}`}
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="context-empty">No medications selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;