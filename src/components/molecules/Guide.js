import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { styles, Subheading } from '@storybook/design-system';

const { color, spacing, typography } = styles;

const GuideWrapper = styled.div`
  background: ${props => color[props.themeColor]};
  color: ${color.lightest};
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 1px 8px 0 rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  text-align: left;
  height: 400px;
`;

const GuideTitle = styled.div`
  font-size: ${typography.size.m1}px;
  font-weight: ${typography.weight.black};
  line-height: ${typography.size.m3}px;
  letter-spacing: -0.4px;
`;

const GuideDescription = styled.div`
  margin-top: ${spacing.padding.small}px;
`;

const GuideChapterCount = styled(Subheading)`
  margin-top: ${spacing.padding.small}px;
  font-size: ${typography.size.s1}px;
  opacity: 0.5;
`;

const GuideImage = styled.img`
  margin: ${spacing.padding.medium}px auto 0;
  width: fit-content;
  max-width: 100%;
`;

const Guide = ({ chapterCount, description, imagePath, themeColor, title }) => (
  <GuideWrapper themeColor={themeColor}>
    <GuideTitle>{title}</GuideTitle>
    <GuideDescription>{description}</GuideDescription>
    <GuideChapterCount>{chapterCount} Chapters</GuideChapterCount>
    <GuideImage src={imagePath} alt={title} />
  </GuideWrapper>
);

Guide.propTypes = {
  chapterCount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  imagePath: PropTypes.string.isRequired,
  themeColor: PropTypes.oneOf(Object.keys(color)).isRequired,
  title: PropTypes.string.isRequired,
};

export default Guide;
