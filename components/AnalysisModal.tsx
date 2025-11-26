import React, { useMemo } from 'react';
import { X, Frown, AlertCircle, Smile } from 'lucide-react';
import { StressEvent, EventType } from '../types';
import { Button } from './Button';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: StressEvent[];
  type: EventType;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose, events, type }) => {
  if (!isOpen) return null;

  const isStress = type === 'stress';

  const stats = useMemo(() => {
    // Filter events based on type
    const targetEvents = events.filter(e => {
        if (isStress) return e.type === 'stress' || e.type === undefined;
        return e.type === 'happy';
    });
    
    const totalPoints = targetEvents.reduce((sum, e) => sum + e.points, 0);

    const tagMap: Record<string, number> = {};
    let untaggedPoints = 0;

    targetEvents.forEach(e => {
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
        percentage: totalPoints > 0 ? Math.round((points / totalPoints) * 100) : 0
      }));

    if (untaggedPoints > 0) {
      sortedTags.push({
        tag: '(未分類)',
        points: untaggedPoints,
        percentage: totalPoints > 0 ? Math.round((untaggedPoints / totalPoints) * 100) : 0
      });
    }

    return { totalPoints, sortedTags };
  }, [events, isStress]);

  // Theme configuration
  const theme = isStress ? {
      bgIcon: 'bg-red-900/30',
      textIcon: 'text-red-400',
      title: '離職理由分析',
      icon: <Frown className="w-5 h-5 text-red-400" />,
      barStart: 'from-red-600',
      barEnd: 'to-orange-500',
      pointColor: 'text-red-400',
      desc: '離職推手',
      emptyText: '目前還沒有壓力紀錄，無法分析。',
      advice: '如果某個特定標籤（例如某位主管的名字）佔比超過 50%，建議您在離職面談時...嗯，您知道該怎麼做的。'
  } : {
      bgIcon: 'bg-teal-900/30',
      textIcon: 'text-teal-400',
      title: '留任理由分析',
      icon: <Smile className="w-5 h-5 text-teal-400" />,
      barStart: 'from-teal-600',
      barEnd: 'to-emerald-500',
      pointColor: 'text-teal-400',
      desc: '留任動力',
      emptyText: '目前還沒有快樂紀錄，生活這麼苦嗎？',
      advice: '這些是支撐您繼續待下去的理由。如果這些快樂的總分遠低於壓力，也許是時候設下停損點了。'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${theme.bgIcon}`}>
                {theme.icon}
            </div>
            <h2 className="text-xl font-bold text-white">{theme.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          {stats.totalPoints === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{theme.emptyText}</p>
            </div>
          ) : (
            <>
                <p className="text-slate-400 text-sm mb-6">
                    以下顯示各個標籤佔「總{isStress ? '壓力' : '快樂'}點數 ({stats.totalPoints}點)」的比例。
                    <br/>
                    這能幫助您釐清{theme.desc}的主要來源。
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
                                <span className={`${theme.pointColor} font-bold`}>{item.points}</span> 點 ({item.percentage}%)
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                            <div 
                                className={`bg-gradient-to-r ${theme.barStart} ${theme.barEnd} h-2.5 rounded-full transition-all duration-1000`} 
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                    ))}
                </div>

                <div className="mt-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-xs text-slate-400">
                    <p className="font-bold text-slate-300 mb-1">💡 分析建議：</p>
                    <p>{theme.advice}</p>
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
