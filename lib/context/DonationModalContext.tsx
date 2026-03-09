"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface DonationModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DonationModalContext = createContext<DonationModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function DonationModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DonationModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </DonationModalContext.Provider>
  );
}

export function useDonationModal() {
  return useContext(DonationModalContext);
}
