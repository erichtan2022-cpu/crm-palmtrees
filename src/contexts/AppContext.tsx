import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const AppContext = createContext<AppContextType>({ sidebarOpen: false, toggleSidebar: () => {} });

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <AppContext.Provider value={{ sidebarOpen, toggleSidebar: () => setSidebarOpen(p => !p) }}>
      {children}
    </AppContext.Provider>
  );
};
