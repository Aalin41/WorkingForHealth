import React, { useState, useRef, useEffect } from 'react';
import { Printer, Settings as SettingsIcon, ChevronDown, FileText, Frown, Smile, Download } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onPrint: (type: 'all' | 'stress' | 'happy') => void;
}

const LazyAnimalLogo = () => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-400">
    {/* Soft blobby shape representing a lazy cat/animal */}
    <path d="M20 60C20 60 15 45 30 40C35 38 40 42 45 45C55 48 70 48 80 40C90 32 95 50 95 60C95 75 85 85 50 85C25 85 20 75 20 60Z" stroke="currentColor" strokeWidth="3" fill="rgba(129, 140, 248, 0.1)" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Ears */}
    <path d="M25 45L20 30L35 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M80 40L90 30L88 45" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    {/* Sleeping Eyes */}
    <path d="M35 55C35 55 38 52 41 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <path d="M50 55C50 55 53 52 56 55" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    {/* ZZZ */}
    <path d="M70 30L80 30L70 40L80 40" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
    <path d="M85 20L90 20L85 25L90 25" stroke="currentColor" strokeWidth="2" opacity="0.4"/>
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onPrint }) => {
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsPrintMenuOpen(false);
      }
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handlePrintClick = (type: 'all' | 'stress' | 'happy') => {
    onPrint(type);
    setIsPrintMenuOpen(false);
  };

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the install prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setInstallPrompt(null);
  };

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 no-print safe-area-top">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-indigo-900/20 rounded-lg">
            <LazyAnimalLogo />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">
              做身體健康？
            </h1>
            <span className="text-slate-500 text-xs font-medium">Working for Health?</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
           
           {/* Install App Button (Only visible if installable) */}
           {installPrompt && (
             <button
                onClick={handleInstallClick}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-full transition-all animate-pulse"
             >
               <Download className="w-4 h-4" />
               <span>下載 App</span>
             </button>
           )}

           {/* Print Dropdown */}
           <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setIsPrintMenuOpen(!isPrintMenuOpen)}
              className={`flex items-center space-x-1 p-2 rounded-full transition-colors ${isPrintMenuOpen ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
              title="匯出報告"
            >
              <Printer className="w-5 h-5" />
              <ChevronDown className="w-3 h-3" />
            </button>

            {isPrintMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                <div className="py-1">
                  <button 
                    onClick={() => handlePrintClick('all')}
                    className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center"
                  >
                    <FileText className="w-4 h-4 mr-3 text-indigo-400" />
                    完整報告
                  </button>
                  <button 
                    onClick={() => handlePrintClick('stress')}
                    className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center border-t border-slate-700/50"
                  >
                    <Frown className="w-4 h-4 mr-3 text-red-400" />
                    僅壓力 (離職理由)
                  </button>
                  <button 
                    onClick={() => handlePrintClick('happy')}
                    className="w-full px-4 py-3 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center border-t border-slate-700/50"
                  >
                    <Smile className="w-4 h-4 mr-3 text-teal-400" />
                    僅快樂 (留下理由)
                  </button>
                </div>
              </div>
            )}
           </div>

          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
            title="設定"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};