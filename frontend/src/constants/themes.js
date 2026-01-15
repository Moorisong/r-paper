export const THEMES = {
  theme_candy: {
    name: 'Candy Pop',
    background: 'bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200',
    card: 'bg-white/80 backdrop-blur-sm border-pink-200',
    accent: 'text-pink-500',
    button: 'bg-pink-500 hover:bg-pink-600 text-white',
    input: 'border-pink-300 focus:border-pink-500 focus:ring-pink-500/20',
    text: 'text-pink-900',
    subtext: 'text-pink-600',
  },
  theme_ocean: {
    name: 'Ocean Wave',
    background: 'bg-gradient-to-br from-cyan-200 via-blue-300 to-indigo-400',
    card: 'bg-white/80 backdrop-blur-sm border-blue-200',
    accent: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600 text-white',
    input: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500/20',
    text: 'text-blue-900',
    subtext: 'text-blue-600',
  },
  theme_sunset: {
    name: 'Sunset Glow',
    background: 'bg-gradient-to-br from-orange-200 via-red-200 to-pink-300',
    card: 'bg-white/80 backdrop-blur-sm border-orange-200',
    accent: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600 text-white',
    input: 'border-orange-300 focus:border-orange-500 focus:ring-orange-500/20',
    text: 'text-orange-900',
    subtext: 'text-orange-600',
  },
  theme_forest: {
    name: 'Forest Dream',
    background: 'bg-gradient-to-br from-green-200 via-emerald-200 to-teal-300',
    card: 'bg-white/80 backdrop-blur-sm border-green-200',
    accent: 'text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    input: 'border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500/20',
    text: 'text-emerald-900',
    subtext: 'text-emerald-600',
  },
  theme_galaxy: {
    name: 'Galaxy Night',
    background: 'bg-gradient-to-br from-violet-300 via-purple-400 to-indigo-500',
    card: 'bg-white/70 backdrop-blur-sm border-violet-200',
    accent: 'text-violet-500',
    button: 'bg-violet-500 hover:bg-violet-600 text-white',
    input: 'border-violet-300 focus:border-violet-500 focus:ring-violet-500/20',
    text: 'text-violet-900',
    subtext: 'text-violet-600',
  },
  theme_cherry: {
    name: 'Cherry Blossom',
    background: 'bg-gradient-to-br from-pink-100 via-rose-200 to-pink-300',
    card: 'bg-white/80 backdrop-blur-sm border-rose-200',
    accent: 'text-rose-500',
    button: 'bg-rose-500 hover:bg-rose-600 text-white',
    input: 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20',
    text: 'text-rose-900',
    subtext: 'text-rose-600',
  },
  theme_mint: {
    name: 'Fresh Mint',
    background: 'bg-gradient-to-br from-teal-100 via-cyan-200 to-emerald-200',
    card: 'bg-white/80 backdrop-blur-sm border-teal-200',
    accent: 'text-teal-500',
    button: 'bg-teal-500 hover:bg-teal-600 text-white',
    input: 'border-teal-300 focus:border-teal-500 focus:ring-teal-500/20',
    text: 'text-teal-900',
    subtext: 'text-teal-600',
  },
  theme_lavender: {
    name: 'Lavender Field',
    background: 'bg-gradient-to-br from-purple-100 via-violet-200 to-fuchsia-200',
    card: 'bg-white/80 backdrop-blur-sm border-purple-200',
    accent: 'text-purple-500',
    button: 'bg-purple-500 hover:bg-purple-600 text-white',
    input: 'border-purple-300 focus:border-purple-500 focus:ring-purple-500/20',
    text: 'text-purple-900',
    subtext: 'text-purple-600',
  },
  theme_peach: {
    name: 'Peach Paradise',
    background: 'bg-gradient-to-br from-orange-100 via-amber-200 to-yellow-200',
    card: 'bg-white/80 backdrop-blur-sm border-amber-200',
    accent: 'text-amber-500',
    button: 'bg-amber-500 hover:bg-amber-600 text-white',
    input: 'border-amber-300 focus:border-amber-500 focus:ring-amber-500/20',
    text: 'text-amber-900',
    subtext: 'text-amber-600',
  },
  theme_sky: {
    name: 'Clear Sky',
    background: 'bg-gradient-to-br from-sky-100 via-blue-200 to-cyan-200',
    card: 'bg-white/80 backdrop-blur-sm border-sky-200',
    accent: 'text-sky-500',
    button: 'bg-sky-500 hover:bg-sky-600 text-white',
    input: 'border-sky-300 focus:border-sky-500 focus:ring-sky-500/20',
    text: 'text-sky-900',
    subtext: 'text-sky-600',
  },
};

export const THEME_KEYS = Object.keys(THEMES);

export const getRandomTheme = () => {
  const randomIndex = Math.floor(Math.random() * THEME_KEYS.length);
  return THEME_KEYS[randomIndex];
};

export const getTheme = (themeKey) => {
  return THEMES[themeKey] || THEMES.theme_candy;
};
