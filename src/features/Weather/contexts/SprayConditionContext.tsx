import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SprayCondition } from '../models';

interface SprayConditionContextType {
  conditions: SprayCondition[];
  setConditions: (conditions: SprayCondition[]) => void;
}

const SprayConditionContext = createContext<SprayConditionContextType | undefined>(undefined);

export function SprayConditionProvider({ children }: { children: ReactNode }) {
  const [conditions, setConditions] = useState<SprayCondition[]>([]);

  return (
    <SprayConditionContext.Provider value={{ conditions, setConditions }}>
      {children}
    </SprayConditionContext.Provider>
  );
}

export function useSprayConditionContext() {
  const context = useContext(SprayConditionContext);
  if (!context) {
    throw new Error('useSprayConditionContext must be used within SprayConditionProvider');
  }
  return context;
}
