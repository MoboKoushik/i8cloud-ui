import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeSettings {
  sidebarColor: string;
  sidebarTextColor: string;
  primaryColor: string;
  accentColor: string;
  sidebarStyle: 'solid' | 'gradient';
}

interface ThemeContextType {
  theme: ThemeSettings;
  updateTheme: (newTheme: Partial<ThemeSettings>) => void;
  resetTheme: () => void;
}

const defaultTheme: ThemeSettings = {
  sidebarColor: '#1864ab',
  sidebarTextColor: '#ffffff',
  primaryColor: '#1971c2',
  accentColor: '#51cf66',
  sidebarStyle: 'gradient',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeSettings>(() => {
    const savedTheme = localStorage.getItem('appTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  useEffect(() => {
    localStorage.setItem('appTheme', JSON.stringify(theme));
  }, [theme]);

  const updateTheme = (newTheme: Partial<ThemeSettings>) => {
    setTheme((prev) => ({ ...prev, ...newTheme }));
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
