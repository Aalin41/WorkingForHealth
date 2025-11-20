import React from 'react';
import { StressEvent, UserSettings, CalculatedStats } from '../types';
import { format, parseISO } from 'date-fns';

interface PrintViewProps {
  events: StressEvent[];
  settings: UserSettings;
  stats: CalculatedStats;
  printMode: 'all' | 'stress' | 'happy';
}

export const PrintView: React.FC<PrintViewProps> = ({ events, settings, stats, printMode }) => {
  // Split events
  const stressEvents = events.filter(e => e.type === 'stress' || e.type === undefined)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const happyEvents = events.filter(e => e.type === 'happy')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const renderTable = (title: string, items: StressEvent[], isStress: boolean) => (
    <div className="mb-8">
      <h2 className={`text-xl font-bold mb-4 pb-2 border-b-2 ${isStress ? 'border-red-800 text-red-900' : 'border-teal-800 text-teal-900'}`}>
        {title}
      </h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500 italic">無相關紀錄</p>
      ) : (
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="p-2 w-32">日期/時間</th>
              <th className="p-2 w-16 text-center">點數</th>
              <th className="p-2 w-32">標籤</th>
              <th className="p-2">事件描述</th>
            </tr>
          </thead>
          <tbody>
            {items.map((event) => (
              <tr key={event.id} className="border-b border-gray-200 break-inside-avoid">
                <td className="p-2 align-top font-mono text-gray-600">{format(parseISO(event.date), 'yyyy-MM-dd HH:mm')}</td>
                <td className="p-2 align-top text-center font-bold">{event.points}</td>
                <td className="p-2 align-top">
                  {event.tags.map(t => (
                    <span key={t} className="inline-block bg-gray-100 border border-gray-300 rounded px-1 mr-1 mb-1 text-xs">{t}</span>
                  ))}
                </td>
                <td className="p-2 align-top whitespace-pre-wrap">{event.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const getTitle = () => {
    if (printMode === 'stress') return '離職理由清單 (壓力事件)';
    if (printMode === 'happy') return '留任理由清單 (快樂事件)';
    return '職涯評估完整報告';
  };

  return (
    <div className="print-only p-8 max-w-4xl mx-auto bg-white text-black">
      <div className="border-b-4 border-indigo-900 pb-4 mb-6">
        <h1 className="text-3xl font-bold mb-2">做身體健康？ - {getTitle()}</h1>
        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <div>
            <p><span className="font-bold">姓名:</span> {settings.name || '未設定'}</p>
            <p><span className="font-bold">入職日期:</span> {settings.onboardingDate || '未設定'}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">匯出日期:</span> {format(new Date(), 'yyyy-MM-dd')}</p>
            {(printMode === 'all' || printMode === 'stress') && (
              <p className="text-red-700"><span className="font-bold">累積壓力:</span> {stats.totalStressPoints} 點</p>
            )}
            {(printMode === 'all' || printMode === 'happy') && (
              <p className="text-teal-700"><span className="font-bold">累積快樂:</span> {stats.totalHappyPoints} 點</p>
            )}
          </div>
        </div>
      </div>

      {printMode === 'all' && (
        <div className="mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-bold mb-3 border-b border-gray-300 pb-1">離職試算摘要</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-4">
              <div>
                  <p className="text-sm text-gray-600 mb-1">因壓力消磨熱情</p>
                  <p className="text-xl font-bold text-red-600">-{stats.stressDaysEarned} 天</p>
              </div>
              <div>
                  <p className="text-sm text-gray-600 mb-1">因快樂延後離職</p>
                  <p className="text-xl font-bold text-teal-600">+{stats.happyDaysEarned} 天</p>
              </div>
          </div>

          <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
              <p className="text-sm mb-1 text-indigo-900">
              剩餘工作日 (不含假日): <span className="font-bold text-lg">{stats.remainingWorkingDays ?? 'N/A'}</span> 天
              </p>
              <p className="text-sm text-indigo-900">
              加速後離職日: <span className="font-bold font-mono">{stats.acceleratedResignationDate ? format(stats.acceleratedResignationDate, 'yyyy-MM-dd') : 'N/A'}</span>
              </p>
          </div>
        </div>
      )}

      {(printMode === 'all' || printMode === 'stress') && renderTable("離職理由 (壓力事件)", stressEvents, true)}
      {(printMode === 'all' || printMode === 'happy') && renderTable("留下理由 (快樂事件)", happyEvents, false)}

      <div className="mt-12 pt-4 border-t border-gray-300 text-xs text-gray-500 text-center">
        <p>本文件由「做身體健康？」產生，僅供個人紀錄與參考。</p>
      </div>
    </div>
  );
};