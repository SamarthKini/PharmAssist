import { useState, useEffect, useRef } from 'react';
import { usePrescription } from '../context/PrescriptionContext';
import axios from '../services/api';

const ChatBot = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const { prescription } = usePrescription();
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = { sender: 'user', text: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const prescriptionNames = prescription.map(med => med.name);
      console.log(message)
      
      const response = await axios.post('/ask', {
        message,
        prescription: prescriptionNames
      });
      
      setChatHistory(prev => [
        ...prev, 
        { sender: 'bot', text: response.response }
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory(prev => [
        ...prev, 
        { sender: 'bot', text: "Sorry, I'm having trouble connecting to the medical assistant" }
      ]);
    }
    
    setMessage('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  return (
    <div className="card">
      <h2>Medication Assistant</h2>
      <div className="chat-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="chat-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about your medications..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
        
        <div className="prescription-context">
          <strong>Current Prescription:</strong>
          {prescription.length > 0 ? (
            prescription.map(med => (
              <span key={med.id}>
                {med.name} (₹{med.price?.toFixed(2)})
              </span>
            ))
          ) : (
            <span>No medications selected</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;