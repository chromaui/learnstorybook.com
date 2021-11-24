import React from 'react';
import PropTypes from 'prop-types';
import { styled, css } from '@storybook/theming';
import { Button, styles, Icon } from '@storybook/design-system';
import GatsbyLink from '../../basics/GatsbyLink';
import Stat from '../../basics/Stat';
import * as animations from '../../../styles/animations';

const { breakpoint, color, pageMargins, spacing, typography } = styles;

const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${(props) => props.themeColor};
  padding-bottom: 80px;
  padding-top: 80px;
  padding-left: ${spacing.padding.medium}px;
  padding-right: ${spacing.padding.medium}px;

  @media (min-width: ${breakpoint * 1.5}px) {
    padding-top: 220px;
    padding-bottom: 180px;
    padding-left: 0;
    padding-right: 0;
    min-height: 70vh;
  }
`;

const HeroContent = styled.div`
  ${pageMargins}
  display: flex;
  flex-direction: column-reverse;
  text-align: center;

  @media (min-width: ${breakpoint * 1.5}px) {
    flex-direction: row;
    align-items: center;
    text-align: left;
  }
`;

const Pitch = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  color: ${color.lightest};
  margin-top: ${spacing.padding.medium}px;

  @media (min-width: ${breakpoint * 1.5}px) {
    margin-top: 0;
    flex: 0 1 55%;
    padding-right: 3rem;
  }
`;

const PitchTitle = styled.h1`
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.l1}px;
  line-height: 44px;

  @media (min-width: ${breakpoint * 1.5}px) {
    font-size: 36px;
    line-height: 48px;
  }
`;

const PitchDescription = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 28px;
  margin-top: 0.5rem;

  @media (min-width: ${breakpoint * 1.5}px) {
    margin-top: 0.75rem;
  }
`;

const GetStartedButton = styled(Button)`
  margin-top: 24px;
  font-size: ${typography.size.s3}px;
  font-weight: ${typography.weight.black};
  padding-top: 16px;
  padding-bottom: 16px;
  width: 180px;

  &,
  &:hover,
  &:focus,
  &:hover:focus {
    background: ${color.lightest};
    color: ${color.secondary};
  }
`;

const Languages = styled.div`
  color: ${color.lightest};
  font-size: ${typography.size.s1}px;
  line-height: 16px;
  margin-top: 1rem;
`;

const LanguagesLabel = styled.span`
  font-weight: ${typography.weight.bold};
`;
const LanguageLinkStyles = `
  && {
    &:not(:last-child):after{
      content:', ';
      white-space: pre;
    }
  }
`;
const LanguagesLink = styled(GatsbyLink)`
  ${LanguageLinkStyles}
`;

const StatWrapper = styled.div`
  margin-top: 32px;
  display: flex;
  flex-direction: row;
  justify-content: center;

  > * {
    margin-right: 30px;
  }

  @media (min-width: ${breakpoint * 1.5}px) {
    justify-content: flex-start;
  }
`;

const Figure = styled.div`
  flex: 1;

  @media (min-width: ${breakpoint * 1.5}px) {
    height: 480px;
  }

  img {
    display: block;
    height: auto;
    margin: 0 auto;
    max-width: 80%;
    max-height: 480px;

    @media (min-width: ${breakpoint * 1.5}px) {
      max-width: 100%;
    }
  }
`;

const GuideImage = styled.img`
  ${(props) =>
    props.heroAnimationName &&
    animations[props.heroAnimationName] &&
    css`
      ${animations[props.heroAnimationName]}
    `}
`;

const BreadcrumbLink = styled(GatsbyLink)`
  font-size: ${typography.size.s3}px;
  line-height: ${typography.size.m1}px;
  font-weight: ${typography.weight.bold};
  margin-top: 16px;
  margin-bottom: 20px;
  color: ${color.lightest};
  margin-left: -22px; // optical for rebalancing for centered layout. This accounts for the arrow

  &:hover,
  &:focus,
  &:active {
    color: ${color.lightest};
  }

  @media (min-width: ${breakpoint * 1.333}px) {
    margin-top: 0;
    margin-left: 0;
  }
`;

const Breadcrumb = ({ children, ...props }) => (
  <BreadcrumbLink withIcon {...props}>
    <Icon icon="arrowleft" />
    {children}
  </BreadcrumbLink>
);

Breadcrumb.propTypes = {
  children: PropTypes.node.isRequired,
};

const Hero = ({
  heroAnimationName,
  contributorCount,
  chapterCount,
  ctaHref,
  description,
  imagePath,
  languages,
  themeColor,
  title,
  ...rest
}) => (
  <HeroWrapper themeColor={themeColor} {...rest}>
    <HeroContent>
      <Pitch>
        <Breadcrumb to="/">Tutorials</Breadcrumb>

        <PitchTitle>{title}</PitchTitle>

        {description && <PitchDescription>{description}</PitchDescription>}

        {ctaHref && (
          <GatsbyLink to={ctaHref}>
            <GetStartedButton>Get started</GetStartedButton>
          </GatsbyLink>
        )}

        {languages.length > 0 && (
          <Languages>
            <LanguagesLabel>Languages: </LanguagesLabel>
            {languages.map((language) => (
              <LanguagesLink inverse key={`lang_link_${language.name}`} to={language.tutorial}>
                {language.name}
              </LanguagesLink>
            ))}
          </Languages>
        )}
        <StatWrapper>
          {contributorCount && <Stat value={contributorCount} label="Contributors" />}
          {chapterCount && <Stat value={chapterCount} label="Chapters" />}
        </StatWrapper>
      </Pitch>
      <Figure>
        {imagePath && (
          <GuideImage alt={title} heroAnimationName={heroAnimationName} src={imagePath} />
        )}
      </Figure>
    </HeroContent>
  </HeroWrapper>
);

Hero.propTypes = {
  contributorCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  chapterCount: PropTypes.number,
  ctaHref: PropTypes.string,
  description: PropTypes.string,
  heroAnimationName: PropTypes.string,
  imagePath: PropTypes.string,
  languages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      tutorial: PropTypes.string,
    })
  ).isRequired,
  themeColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
  contributorCount: null,
  chapterCount: null,
  ctaHref: null,
  description: null,
  heroAnimationName: null,
  imagePath: null,
};

export default Hero;
