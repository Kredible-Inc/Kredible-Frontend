"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type DashboardTab = 'loans' | 'borrows';

interface DashboardContextType {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('loans');

  return (
    <DashboardContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
} 