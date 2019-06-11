const languageNameMap = {
  en: 'English',
  es: 'Español',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  pt: 'Português',
};

const getLanguageName = language => languageNameMap[language];

export default getLanguageName;
