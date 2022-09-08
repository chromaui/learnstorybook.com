import ArabicLanguageMap from './locales/ar';
import EnglishLanguageMap from './locales/en';
import PortugueseLanguageMap from './locales/pt';
import SpanishLanguageMap from './locales/es';
import NetherLandsLanguageMap from './locales/nl';
import GermanLanguageMap from './locales/de';
import SimplifiedChineseLanguageMap from './locales/zh-CN';
import TraditionalChineseLanguageMap from './locales/zh-TW';

import FrenchLanguageMap from './locales/fr';
import ItalianLanguageMap from './locales/it';
import JapaneseLanguageMap from './locales/ja';
import KoreanLanguageMap from './locales/kr';

const translationMap = {
  ar: {
    ...ArabicLanguageMap,
  },
  en: {
    ...EnglishLanguageMap,
  },
  pt: {
    ...PortugueseLanguageMap,
  },
  es: {
    ...SpanishLanguageMap,
  },
  nl: {
    ...NetherLandsLanguageMap,
  },
  de: {
    ...GermanLanguageMap,
  },
  'zh-CN': {
    ...SimplifiedChineseLanguageMap,
  },
  'zh-TW': {
    ...TraditionalChineseLanguageMap,
  },
  fr: {
    ...FrenchLanguageMap,
  },
  it: {
    ...ItalianLanguageMap,
  },
  ja: {
    ...JapaneseLanguageMap,
  },
  kr: {
    ...KoreanLanguageMap,
  },
};
/**
 *  function to fetch the necessary text for displaying the not current tutorial version
 * @param {String} language will retrieve the necessary information based on the language supplied
 * @returns {Object} with the necessary text to be added to the tutorial
 */
const fetchTutorialNotUpdatedText = (language) =>
  translationMap[language] ? translationMap[language] : translationMap.en;

export default fetchTutorialNotUpdatedText;
