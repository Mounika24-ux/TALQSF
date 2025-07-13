// src/contexts/DarkModeContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

// Create context
const DarkModeContext = createContext();

// Create provider
export function DarkModeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <DarkModeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </DarkModeContext.Provider>
  );
}

// Hook to use context
export function useDarkMode() {
  return useContext(DarkModeContext);
}
