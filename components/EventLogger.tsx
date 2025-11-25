import React, { useState } from 'react';
import { StressLevel, StressEvent, EventType } from '../types';
import { STRESS_DESCRIPTIONS, HAPPY_DESCRIPTIONS } from '../constants';
import { Button } from './Button';
import { AlertCircle, CheckCircle2, Flame, Smile, Heart, Settings2, HelpCircle } from 'lucide-react';
import { PointsGuideModal } from './PointsGuideModal';

interface EventLoggerProps {
  onAddEvent: (event: Omit<StressEvent, 'id' | 'date'>) => void;
  onOpenTagTutorial: () => void;
}

export const EventLogger: React.FC<EventLoggerProps> = ({ onAddEvent, onOpenTagTutorial }) => {
  const [eventType, setEventType] = useState<EventType>('stress');
  const [points, setPoints] = useState<number>(1);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string>('');
  const [isCustomPoints, setIsCustomPoints] = useState(false);
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);

  const DESCRIPTIONS = eventType === 'stress' ? STRESS_DESCRIPTIONS : HAPPY_DESCRIPTIONS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;
    if (points <= 0) return;

    const tagList = tags.split(/[, ]+/).filter(t => t.length > 0);
    onAddEvent({
      type: eventType,
      points,
      description,
      tags: tagList
    });

    setDescription('');
    setTags('');
    // Reset to default
    setPoints(1); 
    setIsCustomPoints(false);
  };

  const handlePresetClick = (val: number) => {
    setPoints(val);
    setIsCustomPoints(false);
  };

  return (
    <>
    <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setEventType('stress')}
          className={`flex-1 py-4 flex items-center justify-center space-x-2 transition-colors ${
            eventType === 'stress' 
              ? 'bg-slate-800 text-red-400 font-bold border-b-2 border-red-500' 
              : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          }`}
        >
          <Flame className="w-5 h-5" />
          <span>累積壓力</span>
        </button>
        <button
          onClick={() => setEventType('happy')}
          className={`flex-1 py-4 flex items-center justify-center space-x-2 transition-colors ${
            eventType === 'happy' 
              ? 'bg-slate-800 text-teal-400 font-bold border-b-2 border-teal-500' 
              : 'bg-slate-900/50 text-slate-500 hover:bg-slate-800 hover:text-slate-300'
          }`}
        >
          <Smile className="w-5 h-5" />
          <span>累積快樂</span>
        </button>
      </div>

      <div className="p-6">
        <h3 className={`text-lg font-semibold mb-4 flex items-center ${eventType === 'stress' ? 'text-red-100' : 'text-teal-100'}`}>
          {eventType === 'stress' ? '發生了什麼鳥事？' : '發生了什麼好事？'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(DESCRIPTIONS) as unknown as StressLevel[]).map((level) => {
              const info = DESCRIPTIONS[level];
              const isSelected = !isCustomPoints && points === Number(level);
              return (
                <div 
                  key={level}
                  onClick={() => handlePresetClick(Number(level))}
                  className={`cursor-pointer rounded-lg p-3 border transition-all duration-200 ${
                    isSelected 
                      ? `border-transparent bg-slate-700 ring-2 ring-offset-2 ring-offset-slate-800 ${info.ring}` 
                      : 'border-slate-600 hover:bg-slate-750 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${info.text}`}>{info.label} ({level}點)</span>
                    {isSelected && <CheckCircle2 className={`w-4 h-4 ${info.text}`} />}
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">{info.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Custom Points Input */}
          <div className={`rounded-lg border p-3 transition-colors ${
            isCustomPoints 
              ? 'bg-slate-750 border-indigo-500 ring-1 ring-indigo-500' 
              : 'bg-slate-900/50 border-slate-700 hover:border-slate-600'
          }`}>
             <div className="flex items-center justify-between mb-2" onClick={() => setIsCustomPoints(true)}>
               <div className="flex items-center space-x-2">
                 <Settings2 className={`w-4 h-4 ${isCustomPoints ? 'text-indigo-400' : 'text-slate-500'}`} />
                 <span className={`text-sm font-medium ${isCustomPoints ? 'text-white' : 'text-slate-400'}`}>
                   自訂點數
                 </span>
               </div>
               {isCustomPoints && <span className="text-xs text-indigo-400 font-medium">使用中</span>}
             </div>
             <div className="flex items-center space-x-3">
                <input 
                  type="number" 
                  min="1"
                  max="100"
                  value={points}
                  onFocus={() => setIsCustomPoints(true)}
                  onChange={(e) => {
                    setPoints(Number(e.target.value));
                    setIsCustomPoints(true);
                  }}
                  className={`flex-1 bg-slate-800 border rounded px-3 py-2 text-white font-mono text-lg outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                    isCustomPoints ? 'border-slate-600' : 'border-slate-700 text-slate-500'
                  }`}
                />
                
                {/* Guide Button */}
                <button
                  type="button"
                  onClick={() => setIsPointsGuideOpen(true)}
                  className="flex items-center space-x-1.5 px-3 py-2 rounded bg-slate-800 border border-slate-600 hover:bg-slate-700 hover:border-slate-500 transition-all group"
                  title="查看點數參考"
                >
                    <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-indigo-400" />
                    <span className="text-sm text-slate-400 group-hover:text-indigo-300 font-medium">
                        {eventType === 'stress' ? '參考嚴重度' : '參考快樂度'}
                    </span>
                </button>
             </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">事件描述</label>
            <textarea 
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={eventType === 'stress' 
                ? "例如：主管在下班前5分鐘指派新專案..." 
                : "例如：同事幫忙解決了一個很難的 Bug..."}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
            />
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
               <label className="block text-sm font-medium text-slate-300">標籤 (選填，用空白分隔)</label>
               <button 
                type="button" 
                onClick={onOpenTagTutorial}
                className="flex items-center space-x-1 px-2 py-1 rounded-md bg-indigo-900/30 text-indigo-300 hover:bg-indigo-900/50 hover:text-white transition-colors text-xs font-medium border border-indigo-500/30"
               >
                 <span>💡 如何使用標籤？</span>
               </button>
            </div>
            <input 
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder={eventType === 'stress' ? "加班 霸凌 慣老闆" : "下午茶 加薪 神隊友"}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className={`w-full py-3 font-bold ${
                eventType === 'stress' 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {eventType === 'stress' ? (
                <>
                  <AlertCircle className="w-5 h-5 mr-2 inline" />
                  紀錄壓力 (+{points} 點)
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2 inline" />
                  紀錄快樂 (+{points} 點)
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <PointsGuideModal 
        isOpen={isPointsGuideOpen} 
        onClose={() => setIsPointsGuideOpen(false)}
        type={eventType}
      />
    </div>
    </>
  );
};
