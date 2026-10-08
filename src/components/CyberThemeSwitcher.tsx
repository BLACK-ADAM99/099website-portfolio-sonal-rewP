import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles, Zap, Shield, TrendingUp, DollarSign, Layers } from 'lucide-react';
import { useCyberTheme, CyberTheme } from '../context/ThemeContext';
import { cyberSound } from '../utils/cyberSound';

export const CyberThemeSwitcher: React.FC = () => {
  const { theme, setTheme, themeConfig } = useCyberTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const themes: Array<{
    id: CyberTheme;
    name: string;
    desc: string;
    color: string;
    accent: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'cyber',
      name: 'CYBER MAINFRAME',
      desc: 'Fuchsia & Electric Cyan (Flagship)',
      color: '#d946ef',
      accent: '#06b6d4',
      icon: Zap,
    },
    {
      id: 'quant',
      name: 'QUANT EMERALD',
      desc: 'Forex Matrix Green & Cyan',
      color: '#10b981',
      accent: '#06b6d4',
      icon: TrendingUp,
    },
    {
      id: 'gold',
      name: 'BILLIONAIRE GOLD',
      desc: '24K Amber Gold & Deep Bronze',
      color: '#f59e0b',
      accent: '#fbbf24',
      icon: DollarSign,
    },
    {
      id: 'stealth',
      name: 'STEALTH TITANIUM',
      desc: 'Clean Monolithic Ice White',
      color: '#ffffff',
      accent: '#38bdf8',
      icon: Shield,
    },
  ];

  return (
    <div className="relative font-mono select-none" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => {
          cyberSound.playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => cyberSound.playHover()}
        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#0a051d]/90 border border-purple-500/40 hover:border-cyan-400 text-slate-300 hover:text-white transition-all text-[11px] shadow-[0_0_15px_rgba(168,85,247,0.15)] cursor-pointer group"
        title="Switch Cyber Theme Matrix"
        aria-label="Switch Cyber Theme Matrix"
      >
        <div 
          className="w-2.5 h-2.5 rounded-full animate-pulse shadow-sm"
          style={{ backgroundColor: themeConfig.primaryColor }}
        />
        <span className="hidden md:inline text-slate-400 group-hover:text-slate-200">
          THEME:
        </span>
        <span className="font-bold text-white tracking-wider">
          {themeConfig.badge}
        </span>
        <Palette className="w-3 h-3 text-cyan-400 ml-0.5 group-hover:rotate-45 transition-transform" />
      </button>

      {/* Futuristic Theme Selection Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-72 rounded-2xl bg-[#09041a]/95 backdrop-blur-xl border border-cyan-500/50 p-3 shadow-[0_0_35px_rgba(6,182,212,0.35),0_0_50px_rgba(217,70,239,0.2)] z-50 text-slate-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-purple-900/50 pb-2 mb-2 px-1">
              <span className="text-[10px] text-cyan-400 font-bold tracking-wider">
                // SYSTEM THEME PROTOCOLS
              </span>
              <span className="text-[9px] text-purple-400 font-mono">
                [LIVE CSS OVERRIDE]
              </span>
            </div>

            {/* Theme Options */}
            <div className="space-y-1.5">
              {themes.map((t) => {
                const Icon = t.icon;
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => cyberSound.playHover()}
                    className={`w-full flex items-center justify-between p-2 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-cyan-400 bg-[#140a33] shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                        : 'border-purple-900/40 bg-[#060312]/60 hover:border-purple-500/50 hover:bg-[#0c0624]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: `${t.color}15`,
                          borderColor: `${t.color}50`,
                          color: t.color,
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{t.name}</span>
                          {t.id === 'cyber' && (
                            <span className="text-[8px] px-1 rounded bg-fuchsia-950/80 border border-fuchsia-500/40 text-fuchsia-300 font-bold">
                              RECOMMENDED
                            </span>
                          )}
                        </div>
                        <div className="text-[9.5px] text-slate-400">
                          {t.desc}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <div 
                        className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: t.color }}
                      />
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="text-[9px] text-slate-400 text-center pt-2 mt-2 border-t border-purple-900/40">
              Trigger instant chromatic matrix re-rendering
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
