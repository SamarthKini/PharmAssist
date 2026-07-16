import { motion } from 'framer-motion';
import { PrescriptionProvider } from './context/PrescriptionContext';
import DrugFinder from './components/DrugFinder';
import ChatBot from './components/ChatBot';
import './index.css';

function AppContent() {
  return (
    <div className="app-shell">
      <motion.header
        className="hero-panel"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="hero-copy">
          <h1>PharmAssist</h1>
          <p>
            Search medicines and consult the medication assistant in one focused clinical workspace.
          </p>
        </div>
      </motion.header>

      <section className="workspace-grid">
        <DrugFinder />
        <ChatBot />
      </section>
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
