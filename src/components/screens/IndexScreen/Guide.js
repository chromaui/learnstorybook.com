import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import pluralize from 'pluralize';
import { styles, Icon, Subheading } from '@storybook/design-system';

const { breakpoint, color, spacing, typography } = styles;

const GuideWrapper = styled.span`
  display: block;
  background: ${props => props.themeColor};
  color: ${color.lightest};
  padding: 40px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  height: 400px;

  @media (min-width: ${breakpoint}px) {
    height: 450px;
  }

  @media (min-width: ${breakpoint * 1.25}px) {
    height: 400px;
  }
`;

const GuideTitle = styled.span`
  display: block;
  font-size: ${typography.size.m1}px;
  font-weight: ${typography.weight.black};
  line-height: ${typography.size.m3}px;
`;

const GuideDescription = styled.span`
  display: block;
  margin-top: ${spacing.padding.small}px;
`;

const GuideChapterCount = styled(Subheading)`
  display: block;
  margin-top: ${spacing.padding.small}px;
  font-size: ${typography.size.s1}px;
  opacity: 0.5;
`;

const GuideImageWrapper = styled.span`
  height: 170px;
  display: flex;
  align-items: center;
`;

const GuideImage = styled.img`
  margin: ${spacing.padding.medium}px auto 0;
  width: fit-content;
  max-width: 100%;
  max-height: 170px;
`;

const StyledIcon = styled(Icon)`
  opacity: 0.7;
  height: 0.8em !important;
  bottom: -0.25em !important;
`;

const Guide = ({ chapterCount, description, imagePath, themeColor, title, ...props }) => (
  <GuideWrapper themeColor={themeColor} {...props}>
    <div>
      <GuideTitle>
        {title} <StyledIcon icon="arrowrightalt" />
      </GuideTitle>
      <GuideDescription>{description}</GuideDescription>

      {chapterCount && (
        <GuideChapterCount>{pluralize('Chapter', chapterCount, true)}</GuideChapterCount>
      )}
    </div>

    <GuideImageWrapper>{imagePath && <GuideImage src={imagePath} alt={title} />}</GuideImageWrapper>
  </GuideWrapper>
);

Guide.propTypes = {
  chapterCount: PropTypes.number,
  description: PropTypes.string.isRequired,
  imagePath: PropTypes.string,
  themeColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Guide.defaultProps = {
  chapterCount: null,
  imagePath: null,
};

export default Guide;
