import { PrescriptionProvider } from './context/PrescriptionContext';
import DrugFinder from './components/DrugFinder';
import ChatBot from './components/ChatBot';
import './index.css';

function App() {
  return (
    <PrescriptionProvider>
      <div className="app-container">
        <h1>PharmAssist</h1>
        <div className="cards-container">
          <DrugFinder />
          <ChatBot />
        </div>
      </div>
    </PrescriptionProvider>
  );
}

export default App;
