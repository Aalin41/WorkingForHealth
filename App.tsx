import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { EventLogger } from './components/EventLogger';
import { EventHistory } from './components/EventHistory';
import { SettingsModal } from './components/SettingsModal';
import { PrintView } from './components/PrintView';
import { StressEvent, UserSettings } from './types';
import { APP_STORAGE_KEY } from './constants';
import { calculateStats } from './utils/calculations';
import { v4 as uuidv4 } from 'uuid'; // We need a simple ID generator. Let's simulate since I can't add packages.

// Simple UUID fallback since I can't npm install in this env
const simpleId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  onboardingDate: null,
  targetResignationDate: null
};

function App() {
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [printMode, setPrintMode] = useState<'all' | 'stress' | 'happy'>('all');

  // Load Data
  useEffect(() => {
    const savedData = localStorage.getItem(APP_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.settings) setSettings(parsed.settings);
      } catch (e) {
        console.error("Failed to parse saved data", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save Data
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(APP_STORAGE_KEY, JSON.stringify({ events, settings }));
    }
  }, [events, settings, isLoaded]);

  const stats = useMemo(() => calculateStats(events, settings), [events, settings]);

  const handleAddEvent = (newEvent: Omit<StressEvent, 'id' | 'date'>) => {
    const event: StressEvent = {
      ...newEvent,
      id: simpleId(),
      date: new Date().toISOString(),
    };
    setEvents(prev => [event, ...prev]);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('確定要刪除這條紀錄嗎？此操作無法復原。')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handlePrint = (type: 'all' | 'stress' | 'happy') => {
    setPrintMode(type);
    // Give React a moment to update the DOM with the correct print view before opening dialog
    setTimeout(() => {
      window.print();
    }, 100);
  };

  // Initial Welcome Modal Trigger if no settings
  useEffect(() => {
    if (isLoaded && !settings.targetResignationDate && !isSettingsOpen) {
      // Optional: Auto open settings for new users, currently left manual for cleaner UX
    }
  }, [isLoaded, settings.targetResignationDate, isSettingsOpen]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="no-print">
        <Header 
          onOpenSettings={() => setIsSettingsOpen(true)} 
          onPrint={handlePrint}
        />

        <main className="flex-grow container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard */}
          <DashboardStats stats={stats} settings={settings} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Logger */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <EventLogger onAddEvent={handleAddEvent} />
              </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-2">
              <EventHistory events={events} onDelete={handleDeleteEvent} />
            </div>
          </div>
        </main>

        <footer className="border-t border-slate-800 py-8 mt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} 做身體健康？ | 數據僅存於本地瀏覽器</p>
        </footer>

        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onSave={setSettings}
        />
      </div>

      {/* Hidden Print View - Only shows when printing/saving PDF */}
      <PrintView events={events} settings={settings} stats={stats} printMode={printMode} />
    </div>
  );
}

export default App;