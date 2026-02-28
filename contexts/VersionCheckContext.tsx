import React, { createContext, useContext, useState, ReactNode } from 'react';

type VersionCheckContextType = {
  /** Dev only: when true, show the blocking "Update required" screen for testing */
  simulateUpdateRequired: boolean;
  setSimulateUpdateRequired: (value: boolean) => void;
};

const VersionCheckContext = createContext<VersionCheckContextType | undefined>(undefined);

export const VersionCheckProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [simulateUpdateRequired, setSimulateUpdateRequired] = useState(false);
  return (
    <VersionCheckContext.Provider value={{ simulateUpdateRequired, setSimulateUpdateRequired }}>
      {children}
    </VersionCheckContext.Provider>
  );
};

export const useVersionCheck = (): VersionCheckContextType => {
  const context = useContext(VersionCheckContext);
  if (!context) {
    throw new Error('useVersionCheck must be used within VersionCheckProvider');
  }
  return context;
};
