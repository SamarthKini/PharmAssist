import React, { createContext, useState, useContext } from 'react';

const PrescriptionContext = createContext();

export function PrescriptionProvider({ children }) {
  const [prescription, setPrescription] = useState([]);

  const addToPrescription = (medicine) => {
    setPrescription((prev) =>
      prev.some((item) => item.id === medicine.id)
        ? prev
        : [...prev, medicine]
    );
  };

  const removeFromPrescription = (id) => {
    setPrescription((prev) =>
      prev.filter((med) => med.id !== id)
    );
  };

  return (
    <PrescriptionContext.Provider
      value={{
        prescription,
        addToPrescription,
        removeFromPrescription,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
}

export function usePrescription() {
  return useContext(PrescriptionContext);
}