import React, { useState, useEffect } from 'react';
import { X, Calendar, User } from 'lucide-react';
import { UserSettings } from '../types';
import { getRecommendedDates } from '../utils/calculations';
import { format } from 'date-fns';
import { Button } from './Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [formData, setFormData] = useState<UserSettings>(settings);

  useEffect(() => {
    if (isOpen) {
      setFormData(settings);
    }
  }, [isOpen, settings]);

  if (!isOpen) return null;

  const recommended = getRecommendedDates(formData.onboardingDate);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const applyRecommendation = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        targetResignationDate: format(date, 'yyyy-MM-dd')
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">設定</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <User className="w-4 h-4 mr-2" />
              您的稱呼
            </label>
            <input 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              placeholder="Ex: 苦命工程師"
            />
          </div>

          {/* Onboarding Date */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 mr-2" />
              入職日期 (用於計算年資與推薦)
            </label>
            <input 
              type="date"
              value={formData.onboardingDate || ''}
              onChange={(e) => setFormData({...formData, onboardingDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Target Resignation Date */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 mr-2" />
              預計離職日期
            </label>
            <input 
              type="date"
              value={formData.targetResignationDate || ''}
              onChange={(e) => setFormData({...formData, targetResignationDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            
            {recommended.adaptationDate && (
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-2 border border-slate-700/50">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2">系統推薦離職日</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button 
                    onClick={() => applyRecommendation(recommended.adaptationDate)}
                    className="text-left p-2 rounded hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <span className="block text-indigo-400 text-xs font-bold">快速適應期 (12個月)</span>
                    <span className="text-sm text-slate-300">{recommended.adaptationDate && format(recommended.adaptationDate, 'yyyy-MM-dd')}</span>
                  </button>
                  <button 
                    onClick={() => applyRecommendation(recommended.experienceDate)}
                    className="text-left p-2 rounded hover:bg-slate-700 transition-colors border border-slate-700 hover:border-slate-600"
                  >
                    <span className="block text-green-400 text-xs font-bold">經驗累積期 (15個月)</span>
                    <span className="text-sm text-slate-300">{recommended.experienceDate && format(recommended.experienceDate, 'yyyy-MM-dd')}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  * 數據來源：台灣上班族平均換工作週期 (12-15 個月)
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button onClick={handleSave}>儲存設定</Button>
        </div>
      </div>
    </div>
  );
};