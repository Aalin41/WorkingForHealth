import React from 'react';
import { X, Tag, Filter, Search } from 'lucide-react';
import { Button } from './Button';

interface TagTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TagTutorialModal: React.FC<TagTutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Tag className="w-5 h-5 mr-2 text-indigo-400" />
            如何使用標籤功能？
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-base">1. 紀錄特定的人</h3>
            <p>
              想要知道某位主管或同事到底貢獻了多少負能量嗎？
              <br/>
              在標籤欄位輸入他們的名字，例如 <span className="inline-block bg-slate-800 text-indigo-300 px-1.5 rounded border border-slate-700">主管王大明</span>。
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-white font-bold text-base">2. 紀錄特定事件類型</h3>
            <p>
              輸入 <span className="inline-block bg-slate-800 text-indigo-300 px-1.5 rounded border border-slate-700">無效會議</span> 或 <span className="inline-block bg-slate-800 text-indigo-300 px-1.5 rounded border border-slate-700">強迫加班</span>，日後可以分析這些爛事發生的頻率。
            </p>
          </div>

          <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-4 space-y-3">
            <h3 className="text-indigo-200 font-bold flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              之後可以做什麼？
            </h3>
            <ul className="list-disc list-inside space-y-1 ml-1">
              <li>在紀錄列表使用下拉選單篩選特定標籤。</li>
              <li>點擊右上角的分析圖表，查看誰是您的壓力冠軍。</li>
              <li>將特定標籤的罪狀全部篩選出來，截圖存證（？）。</li>
            </ul>
          </div>

        <div className="p-5 border-t border-slate-800 flex justify-end">
          <Button onClick={onClose}>我學會了</Button>
        </div>
      </div>
    </div>
    </div>
  );
};
