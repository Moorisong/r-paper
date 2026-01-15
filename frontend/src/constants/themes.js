// 단일 기본 테마
export const DEFAULT_THEME = {
  name: 'Default',
  background: 'bg-gray-50',
  card: 'bg-white border-gray-200',
  accent: 'text-gray-700',
  button: 'bg-gray-800 hover:bg-gray-900 text-white',
  input: 'border-gray-300 focus:border-gray-500 focus:ring-gray-500/20',
  text: 'text-gray-900',
  subtext: 'text-gray-500',
};

// 하위 호환성을 위해 유지
export const THEMES = {
  default: DEFAULT_THEME,
};

export const THEME_KEYS = ['default'];

export const getRandomTheme = () => 'default';

export const getTheme = (themeKey) => DEFAULT_THEME;
