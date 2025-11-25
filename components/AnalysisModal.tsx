import React, { useMemo } from 'react';
import { X, Frown, AlertCircle } from 'lucide-react';
import { StressEvent } from '../types';
import { Button } from './Button';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: StressEvent[];
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, events }) => {
  if (!isOpen) return null;

  const stats = useMemo(() => {
    // Filter only stress events
    const stressEvents = events.filter(e => e.type === 'stress' || e.type === undefined);
    const totalStressPoints = stressEvents.reduce((sum, e) => sum + e.points, 0);

    const tagMap: Record<string, number> = {};
    let untaggedPoints = 0;

    stressEvents.forEach(e => {
      if (e.tags.length === 0) {
        untaggedPoints += e.points;
      } else {
        e.tags.forEach(tag => {
          tagMap[tag] = (tagMap[tag] || 0) + e.points;
        });
      }
    });

    const sortedTags = Object.entries(tagMap)
      .sort(([, a], [, b]) => b - a)
      .map(([tag, points]) => ({
        tag,
        points,
        percentage: totalStressPoints > 0 ? Math.round((points / totalStressPoints) * 100) : 0
      }));

    if (untaggedPoints > 0) {
      sortedTags.push({
        tag: '(未分類)',
        points: untaggedPoints,
        percentage: totalStressPoints > 0 ? Math.round((untaggedPoints / totalStressPoints) * 100) : 0
      });
    }

    return { totalStressPoints, sortedTags };
  }, [events]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-red-900/30 rounded-lg">
                <Frown className="w-5 h-5 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">離職理由分析</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {stats.totalStressPoints === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>目前還沒有壓力紀錄，無法分析。</p>
              <p className="text-xs mt-2">（這是好事嗎？）</p>
            </div>
          ) : (
            <>
                <p className="text-slate-400 text-sm mb-6">
                    以下顯示各個標籤佔「總壓力點數 ({stats.totalStressPoints}點)」的比例。
                    <br/>
                    這能幫助您釐清究竟是什麼原因讓您最想離職。
                </p>

                <div className="space-y-4">
                    {stats.sortedTags.map((item, index) => (
                    <div key={item.tag} className="space-y-1">
                        <div className="flex justify-between text-sm">
                            <span className="font-bold text-white flex items-center">
                                <span className="w-5 h-5 flex items-center justify-center bg-slate-800 rounded-full text-xs text-slate-500 mr-2 border border-slate-700">
                                    {index + 1}
                                </span>
                                {item.tag}
                            </span>
                            <span className="text-slate-400">
                                <span className="text-red-400 font-bold">{item.points}</span> 點 ({item.percentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-red-600 to-orange-500 h-2.5 rounded-full transition-all duration-1000" 
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-xs text-slate-400">
                    <p className="font-bold text-slate-300 mb-1">💡 分析建議：</p>
                    <p>如果某個特定標籤（例如某位主管的名字）佔比超過 50%，建議您在離職面談時...嗯，您知道該怎麼做的。</p>
                </div>
            </>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end">
          <Button onClick={onClose}>關閉</Button>
        </div>
      </div>
    </div>
  );
};