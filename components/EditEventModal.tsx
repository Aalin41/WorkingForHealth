import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Tag, FileText, Zap } from 'lucide-react';
import { StressEvent } from '../types';
import { Button } from './Button';
import { format, parseISO } from 'date-fns';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: StressEvent | null;
  onSave: (updatedEvent: StressEvent) => void;
}

export const EditEventModal: React.FC<EditEventModalProps> = ({ isOpen, onClose, event, onSave }) => {
  const [formData, setFormData] = useState<Partial<StressEvent>>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isOpen && event) {
      setFormData({
        ...event,
      });
      setTagInput(event.tags.join(' '));
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description || !formData.points || !formData.date) return;

    const updatedTags = tagInput.split(/[, ]+/).filter(t => t.length > 0);

    onSave({
      ...event,
      ...formData as StressEvent,
      tags: updatedTags
    });
    onClose();
  };

  // Convert ISO date to datetime-local string format (YYYY-MM-DDThh:mm)
  const getDatetimeValue = (isoString?: string) => {
    if (!isoString) return '';
    try {
      return format(parseISO(isoString), "yyyy-MM-dd'T'HH:mm");
    } catch (e) {
      return '';
    }
  };

  const isStress = event.type === 'stress' || event.type === undefined;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            編輯紀錄
            <span className={`ml-3 text-xs px-2 py-0.5 rounded-full border ${
                isStress ? 'border-red-500/50 text-red-400 bg-red-900/20' : 'border-teal-500/50 text-teal-400 bg-teal-900/20'
            }`}>
                {isStress ? '壓力事件' : '快樂事件'}
            </span>
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto">
          
          {/* Date Time */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 mr-2" />
              發生時間
            </label>
            <input 
              type="datetime-local"
              value={getDatetimeValue(formData.date)}
              onChange={(e) => setFormData({...formData, date: new Date(e.target.value).toISOString()})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          {/* Points */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Zap className="w-4 h-4 mr-2" />
              點數 ({isStress ? '壓力' : '快樂'}程度)
            </label>
            <input 
              type="number"
              min="1"
              max="100"
              value={formData.points}
              onChange={(e) => setFormData({...formData, points: Number(e.target.value)})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-lg"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <FileText className="w-4 h-4 mr-2" />
              事件描述
            </label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
              required
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Tag className="w-4 h-4 mr-2" />
              標籤 (用空白分隔)
            </label>
            <input 
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

        </form>

        <div className="p-6 border-t border-slate-800 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            儲存變更
          </Button>
        </div>
      </div>
    </div>
  );
};