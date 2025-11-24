import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Clock, ChevronRight, Check } from 'lucide-react';
import { UserSettings, AgeRangeType } from '../types';
import { getRecommendedDates } from '../utils/calculations';
import { AGE_TENURE_MAP } from '../constants';
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

  const recommended = getRecommendedDates(formData.onboardingDate, formData.ageRange);

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

  const isSelected = (date: Date | null) => {
    if (!date || !formData.targetResignationDate) return false;
    return formData.targetResignationDate === format(date, 'yyyy-MM-dd');
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Onboarding Date */}
            <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-300">
                <Calendar className="w-4 h-4 mr-2" />
                入職日期
                </label>
                <input 
                type="date"
                value={formData.onboardingDate || ''}
                onChange={(e) => setFormData({...formData, onboardingDate: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>

            {/* Age Range Selector */}
            <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-slate-300">
                <Clock className="w-4 h-4 mr-2" />
                年齡區間 (用於推薦)
                </label>
                <select
                value={formData.ageRange || ''}
                onChange={(e) => setFormData({...formData, ageRange: e.target.value as AgeRangeType})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                >
                <option value="" disabled>請選擇年齡層</option>
                {Object.entries(AGE_TENURE_MAP).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                ))}
                </select>
            </div>
          </div>

          {/* Target Resignation Date */}
          <div className="space-y-3">
            <label className="flex items-center text-sm font-medium text-slate-300">
              <Calendar className="w-4 h-4 mr-2" />
              預計離職日期 (目標)
            </label>
            <input 
              type="date"
              value={formData.targetResignationDate || ''}
              onChange={(e) => setFormData({...formData, targetResignationDate: e.target.value})}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            
            {/* Recommendations Section */}
            {recommended.adaptationDate && (
              <div className="bg-slate-800/50 p-4 rounded-lg space-y-3 border border-slate-700/50 mt-2">
                <div className="flex items-center justify-between">
                   <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">系統推薦離職日</p>
                   {formData.ageRange && (
                       <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300">
                           基於: {AGE_TENURE_MAP[formData.ageRange].label}
                       </span>
                   )}
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {/* Age Based Recommendation */}
                  {recommended.ageBasedDate && formData.ageRange && (
                      <button 
                        onClick={() => applyRecommendation(recommended.ageBasedDate)}
                        className={`group flex items-center justify-between p-3 rounded-lg border transition-all text-left ${
                          isSelected(recommended.ageBasedDate)
                            ? 'bg-indigo-900/60 border-indigo-500 ring-1 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                            : 'bg-indigo-900/20 border-indigo-500/30 hover:bg-indigo-900/40'
                        }`}
                      >
                        <div>
                            <span className={`block text-xs font-bold mb-1 ${
                                isSelected(recommended.ageBasedDate) ? 'text-indigo-200' : 'text-indigo-300'
                            }`}>
                                平均續航力 ({AGE_TENURE_MAP[formData.ageRange].months}個月)
                            </span>
                            <div className="flex items-center space-x-2">
                                <span className="text-lg font-mono font-bold text-white">
                                    {format(recommended.ageBasedDate, 'yyyy-MM-dd')}
                                </span>
                            </div>
                            <span className="text-xs text-slate-400 block mt-1">
                                {AGE_TENURE_MAP[formData.ageRange].desc}
                            </span>
                        </div>
                        {isSelected(recommended.ageBasedDate) ? (
                            <div className="bg-indigo-500 rounded-full p-1">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        ) : (
                            <ChevronRight className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </button>
                  )}

                  <div className="grid grid-cols-2 gap-2 mt-1">
                     <button 
                        onClick={() => applyRecommendation(recommended.adaptationDate)}
                        className={`p-3 rounded-lg border transition-all text-left relative overflow-hidden flex flex-col justify-between ${
                            isSelected(recommended.adaptationDate)
                              ? 'bg-indigo-900/60 border-indigo-500 ring-1 ring-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                              : 'hover:bg-slate-750 border-slate-700 hover:border-slate-600 bg-slate-800/30'
                        }`}
                    >
                        <div className="flex justify-between w-full mb-1">
                            <span className={`block text-xs font-bold ${isSelected(recommended.adaptationDate) ? 'text-indigo-200' : 'text-slate-400'}`}>
                                基本適應 (1年)
                            </span>
                            {isSelected(recommended.adaptationDate) && (
                                <div className="bg-indigo-500 rounded-full p-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-white font-mono font-bold">
                            {format(recommended.adaptationDate, 'yyyy-MM-dd')}
                        </span>
                    </button>
                    
                    <button 
                        onClick={() => applyRecommendation(recommended.experienceDate)}
                        className={`p-3 rounded-lg border transition-all text-left relative overflow-hidden flex flex-col justify-between ${
                            isSelected(recommended.experienceDate)
                              ? 'bg-indigo-900/60 border-indigo-500 ring-1 ring-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                              : 'hover:bg-slate-750 border-slate-700 hover:border-slate-600 bg-slate-800/30'
                        }`}
                    >
                        <div className="flex justify-between w-full mb-1">
                             <span className={`block text-xs font-bold ${isSelected(recommended.experienceDate) ? 'text-indigo-200' : 'text-slate-400'}`}>
                                履歷加分 (1.5年)
                            </span>
                            {isSelected(recommended.experienceDate) && (
                                <div className="bg-indigo-500 rounded-full p-0.5">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            )}
                        </div>
                        <span className="text-sm text-white font-mono font-bold">
                            {format(recommended.experienceDate, 'yyyy-MM-dd')}
                        </span>
                    </button>
                  </div>
                </div>
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
