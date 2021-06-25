const languageNameMap = {
  en: 'English',
  es: 'Español',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ar: 'العربية',
  pt: 'Português',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  ja: '日本語',
  tr: 'Türk',
  gr: 'Ελληνικά',
  il: 'ישראלי',
  ko: '한국어',
  ru: 'русский',
  bg: 'български',
  it: 'Italiano',
};

const getLanguageName = (language) => languageNameMap[language] || language;

export default getLanguageName;
