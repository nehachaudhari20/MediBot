import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  setTheme: () => null,
});

export const ThemeProvider = ({
  children,
  defaultTheme = 'dark',
  attribute = 'class',
}) => {
  const [theme, setTheme] = useState(defaultTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove old theme class
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    if (attribute === 'class') {
      root.classList.add(theme);
    }
  }, [theme, attribute]);

  const value = {
    theme,
    setTheme: (newTheme) => setTheme(newTheme),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};