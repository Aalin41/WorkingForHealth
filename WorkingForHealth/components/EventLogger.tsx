import React, { useState } from 'react';
import { StressLevel, StressEvent, EventType } from '../types';
import { STRESS_DESCRIPTIONS, HAPPY_DESCRIPTIONS } from '../constants';
import { Button } from './Button';
import { AlertCircle, CheckCircle2, Flame, Smile, Heart } from 'lucide-react';

interface EventLoggerProps {
  onAddEvent: (event: Omit<StressEvent, 'id' | 'date'>) => void;
}

export const EventLogger: React.FC<EventLoggerProps> = ({ onAddEvent }) => {
  const [eventType, setEventType] = useState<EventType>('stress');
  const [points, setPoints] = useState<StressLevel>(StressLevel.LOW);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string>('');

  const DESCRIPTIONS = eventType === 'stress' ? STRESS_DESCRIPTIONS : HAPPY_DESCRIPTIONS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const tagList = tags.split(/[, ]+/).filter(t => t.length > 0);
    onAddEvent({
      type: eventType,
      points,
      description,
      tags: tagList
    });

    setDescription('');
    setTags('');
    setPoints(StressLevel.LOW);
  };

  return (
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
          
          {/* Stress/Happy Level Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {(Object.keys(DESCRIPTIONS) as unknown as StressLevel[]).map((level) => {
              const info = DESCRIPTIONS[level];
              const isSelected = points === Number(level);
              return (
                <div 
                  key={level}
                  onClick={() => setPoints(Number(level))}
                  className={`cursor-pointer rounded-lg p-3 border transition-all duration-200 ${
                    isSelected 
                      ? `border-transparent bg-slate-700 ring-2 ring-offset-2 ring-offset-slate-800 ${info.ring}` 
                      : 'border-slate-600 hover:bg-slate-750 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-bold text-sm ${info.text}`}>{info.label}</span>
                    {isSelected && <CheckCircle2 className={`w-4 h-4 ${info.text}`} />}
                  </div>
                  <p className="text-xs text-slate-400 leading-tight">{info.desc}</p>
                </div>
              );
            })}
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
            <label className="block text-sm font-medium text-slate-300 mb-1">標籤 (選填，用空白分隔)</label>
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
    </div>
  );
};