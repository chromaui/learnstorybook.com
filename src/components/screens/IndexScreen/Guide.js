import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@storybook/theming';
import pluralize from 'pluralize';
import { styles, Subheading } from '@storybook/design-system';
import getThemeBackground from '../../../lib/getThemeBackground';

const { breakpoint, color, spacing, typography } = styles;

const GuideWrapper = styled.span`
  position: relative;
  display: block;
  background: ${(props) => props.background};
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

  @media (min-width: ${breakpoint * 1.75}px) {
    padding: 28px;
    height: 340px;
  }
`;

const GuideBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: ${typography.weight.bold};
  letter-spacing: 0.08em;
  line-height: 1.4;
  text-transform: uppercase;
  background: rgba(0, 0, 0, 0.4);
  color: ${color.lightest};
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

  @media (min-width: ${breakpoint * 1.75}px) {
    height: 130px;
  }
`;

const GuideImage = styled.img`
  margin: ${spacing.padding.medium}px auto 0;
  width: fit-content;
  max-width: 100%;
  max-height: 170px;

  @media (min-width: ${breakpoint * 1.75}px) {
    max-height: 130px;
  }
`;

function Guide({
  chapterCount,
  description,
  imagePath,
  isNew,
  themeColor,
  themeGradientName,
  title,
  ...props
}) {
  const background = getThemeBackground({ themeColor, themeGradientName });
  return (
    <GuideWrapper background={background} {...props}>
      {isNew && <GuideBadge>New</GuideBadge>}
      <div>
        <GuideTitle>{title}</GuideTitle>
        <GuideDescription>{description}</GuideDescription>

        {chapterCount && (
          <GuideChapterCount>{pluralize('Chapter', chapterCount, true)}</GuideChapterCount>
        )}
      </div>

      <GuideImageWrapper>
        {imagePath && <GuideImage src={imagePath} alt={title} />}
      </GuideImageWrapper>
    </GuideWrapper>
  );
}

Guide.propTypes = {
  chapterCount: PropTypes.number,
  description: PropTypes.string.isRequired,
  imagePath: PropTypes.string,
  isNew: PropTypes.bool,
  themeColor: PropTypes.string.isRequired,
  themeGradientName: PropTypes.string,
  title: PropTypes.string.isRequired,
};

Guide.defaultProps = {
  chapterCount: null,
  imagePath: null,
  isNew: false,
  themeGradientName: null,
};

export default Guide;
