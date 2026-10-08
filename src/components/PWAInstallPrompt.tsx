import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, Smartphone, Share, PlusSquare, CheckCircle2, WifiOff, X } from 'lucide-react';
import { usePWAInstall, useOnlineStatus } from '../utils/usePWAInstall';
import { cyberSound } from '../utils/cyberSound';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  React.useEffect(() => {
    if (!showGuideModal) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        cyberSound.playClick();
        setShowGuideModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showGuideModal]);

  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    cyberSound.playClick();
    if (isInstallable) {
      const accepted = await install();
      if (accepted) {
        cyberSound.playSuccess();
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleInstallClick}
        onMouseEnter={() => cyberSound.playHover()}
        title="Install Apurba Bera Portfolio App (Add to Home Screen & Offline Ready)"
        aria-label="Add to Home Screen / Install App"
        className={
          compact
            ? 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-950/55 hover:bg-cyan-900/75 border border-cyan-400/60 hover:border-cyan-300 text-[10.5px] font-mono font-bold text-cyan-200 hover:text-white transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer'
            : 'inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/70 via-purple-950/70 to-fuchsia-950/70 border border-cyan-400/55 hover:border-cyan-300 text-xs font-mono font-bold text-cyan-200 hover:text-white transition-all shadow-[0_0_18px_rgba(6,182,212,0.28)] cursor-pointer'
        }
      >
        <Download className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
        <span>{isIOS ? 'INSTALL ON iOS' : 'INSTALL APP'}</span>
      </button>

      <AnimatePresence>
        {showGuideModal && (
          <div
            data-lenis-prevent
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
            onClick={() => setShowGuideModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md rounded-2xl bg-[#080518]/95 border border-cyan-500/50 p-6 shadow-[0_0_55px_rgba(6,182,212,0.32)] text-slate-100"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-purple-900/45">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-950/70 border border-cyan-500/45 flex items-center justify-center text-cyan-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold font-orbitron text-white uppercase tracking-wider">
                      ADD TO HOME SCREEN
                    </h3>
                    <p className="text-[10.5px] font-mono text-cyan-300">
                      PWA Offline Mode &amp; Native App Experience
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowGuideModal(false)}
                  className="p-1.5 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-slate-300 hover:text-white border border-purple-500/40 cursor-pointer"
                  aria-label="Close install guide"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3.5 text-xs text-slate-200 leading-relaxed">
                {isIOS ? (
                  <div className="space-y-3 p-3.5 rounded-xl bg-purple-950/35 border border-purple-500/35">
                    <p className="font-mono text-cyan-300 font-bold">
                      Install on iPhone / iPad (Safari):
                    </p>
                    <div className="flex items-start gap-2.5">
                      <Share className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
                      <span>
                        1. Tap the <strong>Share</strong> icon at the bottom of your Safari toolbar.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <PlusSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        2. Scroll down and select <strong>Add to Home Screen</strong>, then tap{' '}
                        <strong>Add</strong>.
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 p-3.5 rounded-xl bg-purple-950/35 border border-purple-500/35">
                    <p className="font-mono text-cyan-300 font-bold">
                      Install on Android / Desktop Browser:
                    </p>
                    <div className="flex items-start gap-2.5">
                      <Download className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>
                        1. Click the <strong>Install App</strong> icon in your browser&apos;s address bar (or open the browser menu <strong>⋮</strong>).
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        2. Select <strong>Install app</strong> or <strong>Add to Home screen</strong> to launch Apurba Bera&apos;s portfolio in full-screen standalone mode with offline caching.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/80 to-fuchsia-600/80 hover:from-cyan-500 hover:to-fuchsia-500 text-xs font-mono font-bold text-white uppercase tracking-wider transition-all cursor-pointer"
              >
                GOT IT // ACKNOWLEDGE
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-[#09051a]/95 border border-amber-500/60 px-3.5 py-2 text-xs font-mono text-amber-200 shadow-[0_0_24px_rgba(245,158,11,0.35)] backdrop-blur-md"
    >
      <WifiOff className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
      <span>OFFLINE MODE // SERVING CACHED NEURAL ASSETS</span>
    </div>
  );
};
