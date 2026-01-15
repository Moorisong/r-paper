// 단일 기본 테마
// Theme Definitions
export const THEMES = {
  theme_basic: {
    id: 'theme_basic',
    name: 'Basic',
    background: 'bg-gradient-to-br from-gray-50 to-gray-100',
    card: 'bg-white/80 backdrop-blur-xl border-white/50 shadow-sm',
    accent: 'text-gray-800',
    button: 'bg-gray-900 hover:bg-gray-800 text-white shadow-lg shadow-gray-900/20',
    input: 'bg-white/50 border-gray-200 focus:border-gray-400 focus:ring-gray-400/20',
    text: 'text-gray-900',
    subtext: 'text-gray-500',
    iconBlob: 'from-gray-200 to-gray-300'
  },
  theme_sunset: {
    id: 'theme_sunset',
    name: 'Sunset',
    background: 'bg-gradient-to-br from-[#FFF0F0] via-[#FFE4E1] to-[#FFDAB9]',
    card: 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(255,100,100,0.1)]',
    accent: 'text-rose-600',
    button: 'bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white shadow-lg shadow-rose-500/30',
    input: 'bg-white/50 border-rose-100 focus:border-rose-300 focus:ring-rose-300/20',
    text: 'text-gray-800',
    subtext: 'text-gray-600',
    iconBlob: 'from-orange-300 to-rose-400'
  },
  theme_ocean: {
    id: 'theme_ocean',
    name: 'Ocean',
    background: 'bg-gradient-to-br from-[#F0F8FF] via-[#E0F7FA] to-[#B2EBF2]',
    card: 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(0,150,255,0.1)]',
    accent: 'text-cyan-700',
    button: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/30',
    input: 'bg-white/50 border-cyan-100 focus:border-cyan-300 focus:ring-cyan-300/20',
    text: 'text-cyan-950',
    subtext: 'text-cyan-700/70',
    iconBlob: 'from-cyan-300 to-blue-400'
  },
  theme_forest: {
    id: 'theme_forest',
    name: 'Forest',
    background: 'bg-gradient-to-br from-[#F1F8E9] via-[#DCEDC8] to-[#C8E6C9]',
    card: 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(50,200,100,0.1)]',
    accent: 'text-emerald-700',
    button: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30',
    input: 'bg-white/50 border-emerald-100 focus:border-emerald-300 focus:ring-emerald-300/20',
    text: 'text-emerald-950',
    subtext: 'text-emerald-800/70',
    iconBlob: 'from-emerald-300 to-green-400'
  },
  theme_lavender: {
    id: 'theme_lavender',
    name: 'Lavender',
    background: 'bg-gradient-to-br from-[#F3E5F5] via-[#E1BEE7] to-[#CE93D8]',
    card: 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(150,50,250,0.1)]',
    accent: 'text-purple-700',
    button: 'bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/30',
    input: 'bg-white/50 border-purple-100 focus:border-purple-300 focus:ring-purple-300/20',
    text: 'text-purple-950',
    subtext: 'text-purple-800/70',
    iconBlob: 'from-purple-300 to-indigo-400'
  },
  theme_mint: {
    id: 'theme_mint',
    name: 'Mint',
    background: 'bg-gradient-to-br from-[#E0F2F1] via-[#B2DFDB] to-[#80CBC4]',
    card: 'bg-white/60 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(0,180,150,0.1)]',
    accent: 'text-teal-700',
    button: 'bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-white shadow-lg shadow-teal-500/30',
    input: 'bg-white/50 border-teal-100 focus:border-teal-300 focus:ring-teal-300/20',
    text: 'text-teal-950',
    subtext: 'text-teal-800/70',
    iconBlob: 'from-teal-300 to-emerald-400'
  }
};

export const THEME_KEYS = Object.keys(THEMES);

export const getRandomTheme = () => {
  const keys = Object.keys(THEMES);
  return THEMES[keys[Math.floor(Math.random() * keys.length)]];
};

export const getTheme = (themeKey) => {
  return THEMES[themeKey] || THEMES.theme_basic;
};
