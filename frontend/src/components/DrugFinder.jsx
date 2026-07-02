import { useState } from 'react';
import { usePrescription } from '../context/PrescriptionContext';
import axios from '../services/api';

const DrugFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToPrescription } = usePrescription();

  const searchMedicines = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/search?name=${encodeURIComponent(searchTerm)}`
      );
      console.log(response)
      setResults(response);
    } catch (error) {
      console.error("Search failed:", error);
      alert('Medicine not found. Please try another search term.');
    } finally {
      setLoading(false);
    }
  };
  return (
    
    <div className="card">
      <h2>Medicine Finder</h2>
      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter medicine name"
        />
        <button onClick={searchMedicines} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {results && (
        <div className="results-section">
          <div className="medicine-details">
            <h3>{results.main_medicine.name}</h3>
            <p><strong>Salt Composition:</strong> {results.main_medicine.salt || 'N/A'}</p>
            <p><strong>Description:</strong> {results.main_medicine.description || 'N/A'}</p> 
             <p><strong>Side Effects:</strong> {results.main_medicine.side_effects || 'N/A'}</p> 
            <p><strong>Interactions:</strong> {results.main_medicine.interaction || 'N/A'}</p> 
            <p><strong>Status:</strong> {results.main_medicine.status ? 'Discontinued' : 'Active'}</p>
            <p><strong>Price:</strong> ₹{results.main_medicine.price?.toFixed(2) || 'N/A'}</p>
                    
            <button onClick={() => addToPrescription(main_medicine.name)}>Add to Prescription</button>
          </div>

          {results.alternatives.length > 0 && (
            <div>
              <h4>Similar Medicines:</h4>
              {results.alternatives.map(med => (
                <div key={med.id} className="medicine-card">
                  <div>
                    <h4>{med.name}</h4>
                    <p><strong>Salt:</strong> {med.salt || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹{med.price?.toFixed(2) || 'N/A'}</p>
                    <p><strong>Status:</strong> {med.status ? 'Discontinued' : 'Active'}</p>
                  </div>
                  <button onClick={() => addToPrescription(med)}>
                    Add to Prescription
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugFinder;
