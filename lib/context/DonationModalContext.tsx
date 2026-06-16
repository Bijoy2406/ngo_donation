"use client";

import { createContext, use, useState, useMemo, ReactNode } from "react";

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

  const value = useMemo(
    () => ({
      isOpen,
      openModal: () => setIsOpen(true),
      closeModal: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return (
    <DonationModalContext.Provider value={value}>
      {children}
    </DonationModalContext.Provider>
  );
}

export function useDonationModal() {
  return use(DonationModalContext);
}
