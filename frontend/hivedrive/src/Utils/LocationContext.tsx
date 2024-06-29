import React, { createContext, useState, useContext } from 'react';

interface LocationContextProps {
  location: string;
  setLocation: (location: string) => void;
}

const LocationContext = createContext<LocationContextProps | undefined>(undefined);

export const useLocationContext = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocationContext must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<string>('Zuhause');
  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
