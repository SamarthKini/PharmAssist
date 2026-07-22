import { motion } from 'framer-motion';
import { PrescriptionProvider } from './context/PrescriptionContext';
import DrugFinder from './components/DrugFinder';
import ChatBot from './components/ChatBot';
import './index.css';
// import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
// import { Pill } from "lucide-react";
import { MessageCircle } from "lucide-react";

function AppContent() {
  const [showChatButton, setShowChatButton] = useState(true);
// useEffect(() => {
//   const handleScroll = () => {
//     const chatSection = document.getElementById("chat-assistant");

//     if (!chatSection) return;

//     const rect = chatSection.getBoundingClientRect();

//     // Assistant is considered visible only when its TOP reaches the viewport
//     if (rect.top <= 100) {
//       setShowChatButton(false);
//     } else {
//       setShowChatButton(true);
//     }
//   };

//   window.addEventListener("scroll", handleScroll);

//   // Start with the button visible
//   setShowChatButton(true);

//   return () => window.removeEventListener("scroll", handleScroll);
// }, []);
useEffect(() => {
  const chatSection = document.getElementById("chat-assistant");

  if (!chatSection) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      setShowChatButton(!entry.isIntersecting);
    },
    {
      threshold: 0.5, // Hide when about 20% of the assistant is visible
    }
  );

  observer.observe(chatSection);

  return () => observer.disconnect();
}, []);
  return (
    <div className="app-shell">
     <motion.header
  className="hero-panel"
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.35 }}
>
  <div className="hero-copy">
    <h1 className="hero-title">PharmAssist</h1>

    <p>
      Search medicines and consult the medication assistant in one focused
      clinical workspace.
    </p>
  </div>
</motion.header>

      <section className="workspace-stack">
        <DrugFinder />
        <ChatBot />
      </section>
      
 <button
  className={`floating-chat ${showChatButton ? "show" : "hide"}`}
  onClick={() => {
    document
      .getElementById("chat-assistant")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    setTimeout(() => {
      document
        .querySelector(".chat-input-shell input")
        ?.focus();
    }, 500);
  }}
>
  <MessageCircle size={22} />
  <span>Ask AI</span>
</button>


    

    </div>
  );
}

function App() {
  return (
    <PrescriptionProvider>
      <AppContent />
    </PrescriptionProvider>
  );
}

export default App;
