import React, { useMemo } from 'react';
import { StressEvent, StressLevel } from '../types';
import { format, parseISO } from 'date-fns';
import { Trash2, Tag, Filter, Edit2 } from 'lucide-react';
import { STRESS_DESCRIPTIONS, HAPPY_DESCRIPTIONS } from '../constants';

interface EventHistoryProps {
  events: StressEvent[];
  onDelete: (id: string) => void;
  onEdit: (event: StressEvent) => void;
  selectedTag: string;
  onTagSelect: (tag: string) => void;
}

export const EventHistory: React.FC<EventHistoryProps> = ({ events, onDelete, onEdit, selectedTag, onTagSelect }) => {
  
  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    events.forEach(e => e.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [events]);

  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (selectedTag !== 'all') {
      filtered = filtered.filter(e => e.tags.includes(selectedTag));
    }
    // Sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [events, selectedTag]);

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 border-t border-slate-800 mt-8">
        <p>目前沒有任何紀錄。</p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h3 className="text-lg font-semibold text-white">紀錄列表</h3>
        
        {/* Filter Dropdown */}
        {allTags.length > 0 && (
          <div className="relative flex items-center">
            <Filter className="w-4 h-4 text-slate-400 absolute left-3" />
            <select 
              value={selectedTag}
              onChange={(e) => onTagSelect(e.target.value)}
              className="bg-slate-800 text-sm text-slate-300 border border-slate-700 rounded-lg pl-9 pr-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:bg-slate-750"
            >
              <option value="all">所有標籤</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredEvents.length === 0 && (
           <div className="text-center py-8 text-slate-500 bg-slate-900/50 rounded-lg border border-dashed border-slate-800">
             <p>沒有符合篩選條件的紀錄。</p>
           </div>
        )}

        {filteredEvents.map((event) => {
          const isStress = event.type === 'stress' || event.type === undefined;
          const descMap = isStress ? STRESS_DESCRIPTIONS : HAPPY_DESCRIPTIONS;
          
          // Attempt to find preset info, otherwise use fallback for custom points
          const info = descMap[event.points as StressLevel];
          
          const colorClass = info?.text || (isStress ? 'text-red-400' : 'text-teal-400');
          const borderColor = isStress ? 'border-red-900/30 hover:border-red-700/50' : 'border-teal-900/30 hover:border-teal-700/50';
          const bgHover = isStress ? 'hover:bg-red-950/10' : 'hover:bg-teal-950/10';

          return (
            <div key={event.id} className={`bg-slate-800/50 border ${borderColor} rounded-lg p-4 ${bgHover} transition-all group`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xs text-slate-500 font-mono">
                      {format(parseISO(event.date), 'yyyy-MM-dd HH:mm')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold bg-slate-900 border border-slate-700 ${colorClass}`}>
                       {isStress ? '+' : '+'}{event.points} 點 {info ? `(${info.label})` : '(自訂)'}
                    </span>
                  </div>
                  <p className="text-slate-200 mb-2 whitespace-pre-wrap">{event.description}</p>
                  
                  {event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center text-xs text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-700/50">
                          <Tag className="w-3 h-3 mr-1 opacity-50" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => onEdit(event)}
                        className="text-slate-500 hover:text-indigo-400 p-2 transition-colors rounded hover:bg-slate-700"
                        title="編輯紀錄"
                    >
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => onDelete(event.id)}
                        className="text-slate-500 hover:text-red-500 p-2 transition-colors rounded hover:bg-slate-700"
                        title="刪除紀錄"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
