import { StressLevel } from './types';

export const APP_STORAGE_KEY = 'career-pressure-gauge-data';

export const POINTS_PER_DAY_OFF = 3;

// Major Taiwan Holidays (Fixed & Lunar estimated for 2024-2025 context)
export const TAIWAN_HOLIDAYS = [
  // 2024
  '2024-01-01', // New Year
  '2024-02-08', '2024-02-09', '2024-02-10', '2024-02-11', '2024-02-12', '2024-02-13', '2024-02-14', // LNY
  '2024-02-28', // Peace Memorial
  '2024-04-04', '2024-04-05', // Children's & Tomb Sweeping
  '2024-05-01', // Labor Day
  '2024-06-10', // Dragon Boat
  '2024-09-17', // Moon Festival
  '2024-10-10', // Double Tenth
  
  // 2025
  '2025-01-01', // New Year
  '2025-01-25', '2025-01-26', '2025-01-27', '2025-01-28', '2025-01-29', '2025-01-30', '2025-01-31', '2025-02-01', '2025-02-02', // LNY (Estimated range)
  '2025-02-28', // Peace Memorial
  '2025-04-03', '2025-04-04', // Children's & Tomb Sweeping
  '2025-05-01', // Labor Day
  '2025-05-31', // Dragon Boat
  '2025-10-06', // Moon Festival
  '2025-10-10', // Double Tenth
  
  // 2026 (Buffer)
  '2026-01-01',
];

export const STRESS_DESCRIPTIONS = {
  [StressLevel.LOW]: {
    label: '輕微 (1點)',
    desc: '例行公事被刁難、無意義會議、小誤會',
    color: 'bg-yellow-500',
    text: 'text-yellow-500',
    ring: 'ring-yellow-500'
  },
  [StressLevel.MEDIUM]: {
    label: '中度 (2點)',
    desc: '不合理加班、不公平待遇、任務分配不當',
    color: 'bg-orange-500',
    text: 'text-orange-500',
    ring: 'ring-orange-500'
  },
  [StressLevel.HIGH]: {
    label: '嚴重 (3點)',
    desc: '職場霸凌、人身攻擊、薪資爭議、法律邊緣',
    color: 'bg-red-600',
    text: 'text-red-600',
    ring: 'ring-red-600'
  },
};

export const HAPPY_DESCRIPTIONS = {
  [StressLevel.LOW]: {
    label: '小確幸 (1點)',
    desc: '免費下午茶、準時下班、同事互相幫忙',
    color: 'bg-emerald-400',
    text: 'text-emerald-400',
    ring: 'ring-emerald-400'
  },
  [StressLevel.MEDIUM]: {
    label: '舒服 (2點)',
    desc: '專案順利上線、獲得讚賞、額外獎金',
    color: 'bg-teal-500',
    text: 'text-teal-500',
    ring: 'ring-teal-500'
  },
  [StressLevel.HIGH]: {
    label: '奇蹟 (3點)',
    desc: '升遷加薪、討厭的主管離職、超長連假',
    color: 'bg-cyan-500',
    text: 'text-cyan-500',
    ring: 'ring-cyan-500'
  },
};