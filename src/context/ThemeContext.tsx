import React, { createContext, useContext, useState, useEffect } from 'react';
import { cyberSound } from '../utils/cyberSound';

export type CyberTheme = 'cyber' | 'quant' | 'gold' | 'stealth';

interface ThemeContextType {
  theme: CyberTheme;
  setTheme: (theme: CyberTheme) => void;
  cycleTheme: () => void;
  themeConfig: {
    id: CyberTheme;
    name: string;
    label: string;
    sublabel: string;
    primaryColor: string;
    secondaryColor: string;
    badge: string;
  };
}

const THEME_CONFIGS: Record<CyberTheme, {
  id: CyberTheme;
  name: string;
  label: string;
  sublabel: string;
  primaryColor: string;
  secondaryColor: string;
  badge: string;
}> = {
  cyber: {
    id: 'cyber',
    name: 'CYBER MAINFRAME',
    label: 'Cyber-Quant (Fuchsia / Cyan)',
    sublabel: 'Default Flagship Protocol',
    primaryColor: '#d946ef',
    secondaryColor: '#06b6d4',
    badge: 'FLAGSHIP',
  },
  quant: {
    id: 'quant',
    name: 'QUANT EMERALD',
    label: 'Forex Matrix (Emerald / Cyan)',
    sublabel: 'High-Frequency Trading Mode',
    primaryColor: '#10b981',
    secondaryColor: '#06b6d4',
    badge: 'FOREX QUANT',
  },
  gold: {
    id: 'gold',
    name: 'BILLIONAIRE GOLD',
    label: 'Fintech Luxury (24K Gold / Bronze)',
    sublabel: 'Generational Scale Blueprint',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    badge: 'BILLIONAIRE',
  },
  stealth: {
    id: 'stealth',
    name: 'STEALTH TITANIUM',
    label: 'Minimalist Monolith (Ice / White)',
    sublabel: 'Clean Deep-Tech Architecture',
    primaryColor: '#ffffff',
    secondaryColor: '#38bdf8',
    badge: 'STEALTH',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<CyberTheme>('cyber');

  useEffect(() => {
    const savedTheme = localStorage.getItem('apurba_theme') as CyberTheme;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'cyber');
    }
  }, []);

  const setTheme = (newTheme: CyberTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('apurba_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    // Audio chirp and dispatch global glitch burst
    cyberSound.playClick();
    cyberSound.playChirp(newTheme === 'quant' ? 720 : newTheme === 'gold' ? 840 : 960, 0.08);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('trigger-cyber-glitch', { detail: { intensity: 'burst', sound: false } }));
    }
  };

  const cycleTheme = () => {
    const themeOrder: CyberTheme[] = ['cyber', 'quant', 'gold', 'stealth'];
    const nextIdx = (themeOrder.indexOf(theme) + 1) % themeOrder.length;
    setTheme(themeOrder[nextIdx]);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme,
      cycleTheme,
      themeConfig: THEME_CONFIGS[theme],
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCyberTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCyberTheme must be used within a ThemeProvider');
  }
  return context;
};
