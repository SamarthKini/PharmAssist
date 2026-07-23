import { useState } from 'react';
import {
  AlertTriangle,
  LoaderCircle,
  Pill,
  PlusCircle,
  Search,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { usePrescription } from '../context/PrescriptionContext';
import axios from '../services/api';


const DrugFinder = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { prescription, addToPrescription } = usePrescription();
  const [currentPage, setCurrentPage] = useState(1);
const medicinesPerPage = 3;
  const searchMedicines = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/search?name=${encodeURIComponent(searchTerm)}`
      );
      setResults(response);
      setCurrentPage(1);
    } catch (error) {
      console.error('Search failed:', error);
      alert('Medicine not found. Please try another search term.');
    } finally {
      setLoading(false);
    }
  };

  const mainMedicine = results?.main_medicine;
  const alternatives = results?.alternatives ?? [];
  const totalPages = Math.ceil(alternatives.length / medicinesPerPage);

const startIndex = (currentPage - 1) * medicinesPerPage;
const currentAlternatives = alternatives.slice(
  startIndex,
  startIndex + medicinesPerPage
);
const getVisiblePages = () => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const windowStart = Math.min(currentPage, totalPages - 4);
  const visiblePages = Array.from(
    { length: 5 },
    (_, index) => windowStart + index
  );

  return visiblePages[4] < totalPages
    ? [...visiblePages, "...", totalPages]
    : visiblePages;
};

  return (
    <div className="section-card">
      <div className="section-heading">
        <div>
          <span className="section-kicker">Search</span>
          <h2>Medicine Finder</h2>
        </div>
        {/* <div className="section-meta">Smart lookup</div> */}
      </div>

      <div className="search-shell">
        <div className="search-input-wrap">
          <Search size={18} className="input-icon" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicine name"
            onKeyDown={(e) => e.key === 'Enter' && searchMedicines()}
          />
        </div>

        <button type="button" className="primary-btn" onClick={searchMedicines} disabled={loading}>
          {loading ? (
            <>
              <LoaderCircle size={16} className="spinner" />
              Searching...
            </>
          ) : (
            <>
              <Search size={16} />
              Search
            </>
          )}
        </button>
      </div>

      {loading && (
        <div className="empty-state">
          <LoaderCircle size={18} className="spinner" />
          <p>Looking up medicine details and alternatives...</p>
        </div>
      )}

      {!loading && !results && (
        <div className="empty-state">
          <Pill size={18} />
          <p>Search for a medicine to review its composition, safety notes, and related alternatives.</p>
        </div>
      )}

      {results && mainMedicine && (
        <div className="results-section">
          <div className="medicine-details">
            <div className="medicine-header-row">
              <div>
                <p className="label">Primary medicine</p>
                <h3>{mainMedicine.name}</h3>
              </div>
              <span className="status-pill">
                <ShieldCheck size={14} />
                {mainMedicine.status == 0 ? 'Discontinued' : 'Active'} 
                {/* change here */}
              </span>
            </div>
            <div className="medicine-layout">
  <div className="medicine-summary">
    <div className="info-card">
      <span className="info-label">Salt Composition</span>
      <p>{mainMedicine.salt || 'N/A'}</p>
    </div>

    <div className="info-card">
      <span className="info-label">Price</span>
      <p>₹{mainMedicine.price?.toFixed(2) || 'N/A'}</p>
    </div>

    <div className="info-card">
      <span className="info-label">Side Effects</span>
      <p>{mainMedicine.side_effects || 'N/A'}</p>
    </div>
  </div>

  <div className="medicine-description">
    <div className="info-card description-card">
      <span className="info-label">Description</span>
      <p>{mainMedicine.description || 'N/A'}</p>
    </div>
  </div>
</div>

             {/* <div className="info-grid">
              <div className="info-card">
                <span className="info-label">Salt Composition</span>
                <p>{mainMedicine.salt || 'N/A'}</p>
              </div>
              <div className="info-card">
                <span className="info-label">Price</span>
                <p>₹{mainMedicine.price?.toFixed(2) || 'N/A'}</p>
              </div>
              <div className="info-card info-card-wide">
                <span className="info-label">Side Effects</span>
                <p>{mainMedicine.side_effects || 'N/A'}</p>
              </div>
              <div className="info-card info-card-wide description-card">
                <span className="info-label">Description</span>
                <p>{mainMedicine.description || 'N/A'}</p>
              </div> 
            </div> */}

           {(() => {
  const isAdded = prescription.some(
    (item) => item.id === mainMedicine.id
  );

  return (
    <button
      type="button"
      className={`full-width ${isAdded ? "added-btn" : "primary-btn"}`}
      onClick={() => addToPrescription(mainMedicine)}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check size={16} />
          Added
        </>
      ) : (
        <>
          <PlusCircle size={16} />
          Add to Prescription
        </>
      )}
    </button>
  );
})()}
          </div>

          {alternatives.length > 0 && (
            <div className="alternatives-block">
              <div className="subheading-row">
                <h4>Similar Medicines</h4>
                <span>{alternatives.length} alternatives</span>
              </div>

              {currentAlternatives.map((med) => (
                <div key={med.id} className="medicine-card">
                  <div className="medicine-card-copy">
                    <h4>{med.name}</h4>
                    <p><strong>Salt:</strong> {med.salt || 'N/A'}</p>
                    <p><strong>Price:</strong> ₹{med.price?.toFixed(2) || 'N/A'}</p>
                    <p><strong>Status:</strong> {med.status == 0 ? 'Discontinued' : 'Active'}</p>
                    {/* change here */}
                  </div>

                  {(() => {
  const isAdded = prescription.some((item) => item.id === med.id);

  return (
    <button
      type="button"
      className={isAdded ? "added-btn" : "secondary-btn"}
      onClick={() => addToPrescription(med)}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check size={16} />
          Added
        </>
      ) : (
        <>
          <PlusCircle size={16} />
          Add
        </>
      )}
    </button>
  );
})()}
                </div>
              ))}
              {totalPages > 1 && (
  <div className="pagination">
    <button
      className="page-nav"
      onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
      disabled={currentPage === 1}
    >
      <ChevronLeft size={18} />
    </button>

    {getVisiblePages().map((page, index) =>
  page === "..." ? (
    <span key={`dots-${index}`} className="page-dots">
      ...
    </span>
  ) : (
    <button
      key={`page-${page}`}
      className={`page-number ${currentPage === page ? "active" : ""}`}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </button>
  )
)}

    <button
      className="page-nav"
      onClick={() =>
        setCurrentPage((p) => Math.min(p + 1, totalPages))
      }
      disabled={currentPage === totalPages}
    >
      <ChevronRight size={18} />
    </button>
  </div>
)}
            </div>
          )}

          {alternatives.length === 0 && (
            <div className="empty-state compact-empty-state">
              <AlertTriangle size={18} />
              <p>No alternative medicines were returned for this search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DrugFinder;
