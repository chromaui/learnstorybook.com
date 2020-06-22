import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import { fetchTutorialNotUpdatedText } from '../../../lib/getTranslationInformation';

const { spacing, color, typography } = styles;

const TranslationWrapper = styled.div`
  font-size: ${typography.size.s3}px;
  color: ${color.darker};
  background: #f8fafc;
  border-radius: ${spacing.borderRadius.small}px;
  padding: 20px;
  margin: ${spacing.padding.small}px 0px;
`;

const TranslationUpdated = ({ currentLanguage, currentTranslations, storybookVersion }) => {
  const getGuideVersionByLanguage = currentTranslations.findIndex(
    guideLanguage => guideLanguage.language === currentLanguage
  );
  const translationNotUpdated = fetchTutorialNotUpdatedText(currentLanguage);
  if (
    getGuideVersionByLanguage < 0 ||
    currentTranslations[getGuideVersionByLanguage].version >= storybookVersion
  ) {
    return null;
  }
  return <TranslationWrapper>{translationNotUpdated}</TranslationWrapper>;
};
TranslationUpdated.defaultProps = {
  currentTranslations: [],
};
TranslationUpdated.propTypes = {
  storybookVersion: PropTypes.number.isRequired,
  currentLanguage: PropTypes.string.isRequired,
  currentTranslations: PropTypes.arrayOf(
    PropTypes.shape({
      language: PropTypes.string,
      version: PropTypes.number,
    }).isRequired
  ),
};
export default TranslationUpdated;
