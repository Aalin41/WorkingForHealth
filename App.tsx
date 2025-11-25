import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { EventLogger } from './components/EventLogger';
import { EventHistory } from './components/EventHistory';
import { SettingsModal } from './components/SettingsModal';
import { PrintView } from './components/PrintView';
import { AnalysisModal } from './components/AnalysisModal';
import { TagTutorialModal } from './components/TagTutorialModal';
import { PointsGuideModal } from './components/PointsGuideModal';
import { StressEvent, UserSettings, EventType } from './types';
import { APP_STORAGE_KEY } from './constants';
import { calculateStats } from './utils/calculations';

// Simple UUID fallback since I can't npm install in this env
const simpleId = () => Math.random().toString(36).substring(2, 9);

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  onboardingDate: null,
  targetResignationDate: null,
  ageRange: undefined
};

function App() {
  const [events, setEvents] = useState<StressEvent[]>([]);
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [isTagTutorialOpen, setIsTagTutorialOpen] = useState(false);
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);
  const [pointsGuideType, setPointsGuideType] = useState<EventType>('stress');
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [printMode, setPrintMode] = useState<'all' | 'stress' | 'happy' | 'tag'>('all');
  
  // Lifted state for filtering (shared between History and Print)
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Load Data
  useEffect(() => {
    const savedData = localStorage.getItem(APP_STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        if (parsed.events) setEvents(parsed.events);
        if (parsed.settings) setSettings({ ...DEFAULT_SETTINGS, ...parsed.settings });
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

  const handlePrint = (type: 'all' | 'stress' | 'happy' | 'tag') => {
    setPrintMode(type);
    // Give React a moment to update the DOM with the correct print view before opening dialog
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleOpenPointsGuide = (type: EventType) => {
    setPointsGuideType(type);
    setIsPointsGuideOpen(true);
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
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
          onPrint={handlePrint}
          selectedTag={selectedTag}
        />

        <main className="flex-grow container max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Dashboard */}
          <DashboardStats stats={stats} settings={settings} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Logger */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <EventLogger 
                  onAddEvent={handleAddEvent} 
                  onOpenTagTutorial={() => setIsTagTutorialOpen(true)}
                  onOpenPointsGuide={handleOpenPointsGuide}
                />
              </div>
            </div>

            {/* Right Column: History */}
            <div className="lg:col-span-2">
              <EventHistory 
                events={events} 
                onDelete={handleDeleteEvent}
                selectedTag={selectedTag}
                onTagSelect={setSelectedTag}
              />
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

        <AnalysisModal 
          isOpen={isAnalysisOpen}
          onClose={() => setIsAnalysisOpen(false)}
          events={events}
        />

        <TagTutorialModal 
          isOpen={isTagTutorialOpen}
          onClose={() => setIsTagTutorialOpen(false)}
        />

        <PointsGuideModal 
          isOpen={isPointsGuideOpen} 
          onClose={() => setIsPointsGuideOpen(false)}
          type={pointsGuideType}
        />
      </div>

      {/* Hidden Print View - Only shows when printing/saving PDF */}
      <PrintView 
        events={events} 
        settings={settings} 
        stats={stats} 
        printMode={printMode} 
        selectedTag={selectedTag}
      />
    </div>
  );
}

export default App;
