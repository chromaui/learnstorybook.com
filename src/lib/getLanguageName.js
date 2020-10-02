const languageNameMap = {
  en: 'English',
  es: 'Español',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  pt: 'Português',
  nl: 'Nederlands',
  de: 'Deutsch',
  fr: 'Français',
  jp: '日本語',
  tr: 'Türk',
  gr: 'Ελληνικά',
  il: 'ישראלי',
  kr: '한국어',
  ru: 'русский',
  bg: 'български',
  it: 'Italiano',
};

const getLanguageName = language => languageNameMap[language] || language;

export default getLanguageName;
