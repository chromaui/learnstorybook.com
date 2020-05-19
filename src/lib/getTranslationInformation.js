import EnglishLanguageMap from './locales/en';
import PortugueseLanguageMap from './locales/pt';
import SpanishLanguageMap from './locales/es';
import NetherLandsLanguageMap from './locales/nl';
import GermanLanguageMap from './locales/de';
import SimplifiedChineseLanguageMap from './locales/zh-CN';
import TraditionalChineseLanguageMap from './locales/zh-TW';
import FrenchLanguageMap from './locales/fr';
import ItalianLanguageMap from './locales/it';

const translationMap = {
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
};
/**
 *  function to fetch the necessary text for displaying the not current tutorial version
 * @param {String} language will retrieve the necessary information based on the language supplied
 * @returns {Object} with the necessary text to be added to the tutorial
 */
export const fetchTutorialNotUpdatedText = language => {
  return translationMap[language]
    ? translationMap[language].guidenotupdated
    : translationMap.en.guidenotupdated;
};
/**
 *  function to fetch the necessary text for displaying the twitter information
 * @param {String} language will retrieve the necessary information based on the language supplied
 * @returns {Object} with the necessary text to be added to the tutorial
 */
export const fetchTwitterTextInfo = language => {
  return translationMap[language] ? translationMap[language].twitter : translationMap.en.twitter;
};

/**
 *  function to fetch the necessary text for displaying the github information
 * @param {String} language will retrieve the necessary information based on the language supplied
 * @returns {Object} with the necessary text to be added to the tutorial
 */
export const fetchGitHubTextInfo = language => {
  return translationMap[language] ? translationMap[language].github : translationMap.en.github;
};
