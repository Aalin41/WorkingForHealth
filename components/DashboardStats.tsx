import React from 'react';
import { CalculatedStats, UserSettings } from '../types';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { Briefcase, Zap, Info, Smile, ShieldAlert } from 'lucide-react';

interface DashboardStatsProps {
  stats: CalculatedStats;
  settings: UserSettings;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, settings }) => {
  
  if (!settings.targetResignationDate) {
    return (
      <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">歡迎使用「做身體健康？」</h2>
        <p className="text-indigo-200 mb-4">請先設定您的入職日與預計離職日，計算您實際還需要上班幾天。</p>
        <p className="text-sm text-slate-400 animate-pulse">請點擊右上角設定圖示開始</p>
      </div>
    );
  }

  // Calculate Progress Percentage (Tenure Completed)
  let progressPercent = 0;
  if (settings.onboardingDate && settings.targetResignationDate) {
      const start = parseISO(settings.onboardingDate);
      const end = parseISO(settings.targetResignationDate);
      const today = new Date();
      
      const totalDuration = differenceInCalendarDays(end, start);
      const daysPassed = differenceInCalendarDays(today, start);
      
      if (totalDuration > 0) {
          progressPercent = Math.min(100, Math.max(0, (daysPassed / totalDuration) * 100));
      }
  }

  // Circular Chart Params
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      
      {/* Main Working Days Countdown Card */}
      <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-6 shadow-xl relative overflow-hidden text-white flex justify-between items-center">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex-1">
          <h3 className="text-indigo-100 font-medium flex items-center mb-1">
            <Briefcase className="w-5 h-5 mr-2" />
            實際剩餘工作日
          </h3>
          <p className="text-xs text-indigo-300 mb-2 opacity-80">(扣除假日)</p>
          
          <div className="flex items-baseline mt-1">
            <span className="text-6xl sm:text-7xl font-bold tracking-tighter shadow-black drop-shadow-lg leading-none">
              {stats.remainingWorkingDays !== null ? stats.remainingWorkingDays : 0}
            </span>
            <span className="text-xl ml-2 opacity-80">天</span>
          </div>

          <div className="mt-4 flex items-center text-sm text-indigo-200 bg-black/20 rounded-lg p-2 w-fit backdrop-blur-sm border border-white/10">
            <span className="mr-2 opacity-70">珍重再見:</span>
            <span className="font-bold text-white font-mono">{stats.acceleratedResignationDate ? format(stats.acceleratedResignationDate, 'yyyy-MM-dd') : '-'}</span>
          </div>
        </div>

        {/* Circular Progress Chart */}
        <div className="relative z-10 flex flex-col items-center justify-center ml-2 sm:ml-4">
             <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                <svg className="w-full h-full transform -rotate-90">
                    {/* Background Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        className="text-indigo-900/50"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-sm font-bold">{Math.round(progressPercent)}%</span>
                </div>
             </div>
             <span className="text-[10px] text-indigo-200 mt-1 font-medium tracking-wide">職涯進度</span>
        </div>
      </div>

      {/* Stress Stats (Negative) */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium flex items-center">
              <Zap className="w-4 h-4 mr-2 text-red-500" />
              累積壓力指數
            </h3>
            <div className="relative tooltip-trigger group">
              <Info className="w-4 h-4 text-slate-500 cursor-help" />
              <div className="tooltip-content invisible opacity-0 absolute right-0 top-full mt-2 w-48 p-2 bg-black border border-slate-700 rounded text-xs text-slate-300 z-50 transition-all duration-200 shadow-xl">
                每累積 3 點壓力，建議離職日提前 1 天。
              </div>
            </div>
          </div>
          
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-3xl font-bold text-white">{stats.totalStressPoints}</span>
            <span className="text-xs text-slate-400 mb-1.5">點</span>
          </div>
          
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            你已經因為這裡被消磨掉 <span className="text-red-400 font-bold text-sm">{stats.stressDaysEarned}</span> 天的熱情
          </p>
        </div>
        
        <div className="mt-3">
          <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1">
            <div 
              className="bg-red-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${((3 - stats.stressPointsUntilNextDay) / 3) * 100}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-500 text-right">再 {stats.stressPointsUntilNextDay} 點少做一天</p>
        </div>
      </div>

      {/* Happy Stats (Positive) & Legal Notice */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col justify-between space-y-4">
        
        {/* Happy Stats with Gauge */}
        <div>
           <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium flex items-center">
              <Smile className="w-4 h-4 mr-2 text-teal-400" />
              累積快樂指數
            </h3>
             <div className="relative tooltip-trigger group">
              <Info className="w-4 h-4 text-slate-500 cursor-help" />
              <div className="tooltip-content invisible opacity-0 absolute right-0 top-full mt-2 w-48 p-2 bg-black border border-slate-700 rounded text-xs text-slate-300 z-50 transition-all duration-200 shadow-xl">
                每累積 3 點快樂，離職日延後 1 天（為了五斗米折腰）。
              </div>
            </div>
          </div>
          
          <div className="flex items-end space-x-2 mt-1">
            <span className="text-3xl font-bold text-white">{stats.totalHappyPoints}</span>
             <span className="text-xs text-slate-400 mb-1.5">點</span>
          </div>

           <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            因為捨不得而延後 <span className="text-teal-400 font-bold text-sm">{stats.happyDaysEarned}</span> 天
          </p>

           <div className="mt-3">
            <div className="w-full bg-slate-900 rounded-full h-1.5 mb-1">
              <div 
                className="bg-teal-400 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${((3 - stats.happyPointsUntilNextDay) / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 text-right">再 {stats.happyPointsUntilNextDay} 點多做一天</p>
          </div>
        </div>

        {/* Legal Notice Compact */}
        <div className="border-t border-slate-700 pt-3">
          <h3 className="text-slate-400 text-sm font-medium flex items-center mb-1">
            <ShieldAlert className="w-4 h-4 mr-2 text-blue-400" />
            法定預告 ({stats.legalNoticeDays}天前)
          </h3>
          <div className="text-base font-bold text-blue-400 flex items-center">
            {stats.legalNoticeDate ? format(stats.legalNoticeDate, 'yyyy-MM-dd') : 'N/A'}
          </div>
        </div>
      </div>

    </div>
  );
};
