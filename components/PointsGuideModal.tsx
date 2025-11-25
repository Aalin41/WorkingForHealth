import React from 'react';
import { X, Flame, Smile, ArrowRight } from 'lucide-react';
import { Button } from './Button';
import { EventType } from '../types';

interface PointsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: EventType;
}

export const PointsGuideModal: React.FC<PointsGuideModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const isStress = type === 'stress';

  const stressExamples = [
    { points: 1, desc: '輕微：被已讀不回、無效會議、影印機卡紙' },
    { points: 2, desc: '中度：週五下班前派工、不公平的任務分配' },
    { points: 3, desc: '嚴重：被言語諷刺、請假被刁難、背黑鍋' },
    { points: 4, desc: '爆發邊緣：在小會議室裡被拍桌、被威脅考績' },
    { points: 5, desc: '尊嚴受損：在大家面前被公開羞辱/大罵' },
    { points: 6, desc: '人身攻擊：被針對性的侮辱、涉及家人的謾罵' },
    { points: 7, desc: '肢體威脅：被摔東西、踹椅子、肢體推擠' },
    { points: 10, desc: '違法亂紀：被要求做假帳、性騷擾、欠薪 (建議直接提告)' },
  ];

  const happyExamples = [
    { points: 1, desc: '小確幸：飲料半價、準時下班、廁所沒人' },
    { points: 2, desc: '舒服：專案順利結案、客戶稱讚' },
    { points: 3, desc: '驚喜：意外的獎金、被主管公開表揚' },
    { points: 4, desc: '實質回饋：拿到優渥的年終、調薪幅度超乎預期' },
    { points: 5, desc: '環境優化：討厭的主管/同事離職了！' },
    { points: 7, desc: '人生勝利：升遷 + 加薪 + 允許遠端工作' },
    { points: 10, desc: '奇蹟降臨：公司上市發股票、中樂透頭獎 (可以直接離職了)' },
  ];

  const examples = isStress ? stressExamples : happyExamples;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className={`flex items-center justify-between p-5 border-b border-slate-800 ${isStress ? 'bg-red-900/10' : 'bg-teal-900/10'}`}>
          <h2 className={`text-lg font-bold flex items-center ${isStress ? 'text-red-400' : 'text-teal-400'}`}>
            {isStress ? <Flame className="w-5 h-5 mr-2" /> : <Smile className="w-5 h-5 mr-2" />}
            {isStress ? '壓力點數參考量表' : '快樂點數參考量表'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-0 overflow-y-auto">
          <div className="divide-y divide-slate-800">
            {examples.map((ex) => (
              <div key={ex.points} className="flex items-start p-4 hover:bg-slate-800/50 transition-colors">
                <div className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm mr-3 ${
                    isStress 
                    ? 'bg-red-900/30 text-red-400 border border-red-800' 
                    : 'bg-teal-900/30 text-teal-400 border border-teal-800'
                }`}>
                  {ex.points}
                </div>
                <div className="flex-1">
                  <p className="text-slate-300 text-sm">{ex.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-800/50 text-xs text-slate-500 border-t border-slate-800 text-center">
            點數越高，代表離職/留任的動力越強。請依當下感受自由調整。
        </div>

        <div className="p-5 border-t border-slate-800 flex justify-end">
          <Button onClick={onClose}>了解</Button>
        </div>
      </div>
    </div>
  );
};