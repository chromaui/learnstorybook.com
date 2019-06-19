import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { Button, styles } from '@storybook/design-system';
import GatsbyLink from '../../basics/GatsbyLink';
import Stat from '../../basics/Stat';
import getLanguageName from '../../../lib/getLanguageName';
import * as animations from '../../../styles/animations';

const { breakpoint, color, pageMargins, spacing, typography } = styles;

const HeroWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: ${props => props.themeColor};
  padding-bottom: 80px;
  padding-top: 66px;
  padding-left: ${spacing.padding.medium}px;
  padding-right: ${spacing.padding.medium}px;

  @media (min-width: ${breakpoint * 1.5}px) {
    padding-top: 214px;
    padding-bottom: 178px;
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

const PitchTitle = styled.div`
  font-size: 36px;
  font-weight: ${typography.weight.black};
  letter-spacing: -0.37px;
  line-height: 40px;
`;

const PitchDescription = styled.div`
  margin-top: 17px;
  letter-spacing: -0.33px;
  line-height: 26px;
`;

const GetStartedButton = styled(Button)`
  margin-top: 24px;
  width: 193px;

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
  letter-spacing: -0.25px;
  line-height: 16px;
  margin-top: 11px;
`;

const LanguagesLabel = styled.span`
  font-weight: ${typography.weight.bold};
`;

const StatWrapper = styled(Stat)`
  margin-top: 32px;
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
  ${props =>
    props.heroAnimationName &&
    animations[props.heroAnimationName] &&
    css`
      ${animations[props.heroAnimationName]}
    `}
`;

const Hero = ({
  heroAnimationName,
  contributorCount,
  ctaHref,
  description,
  imagePath,
  languages,
  themeColor,
  title,
  ...rest
}) => {
  const languageList = languages.map(language => getLanguageName(language)).join(', ');

  return (
    <HeroWrapper themeColor={themeColor} {...rest}>
      <HeroContent>
        <Pitch>
          <PitchTitle>{title}</PitchTitle>

          {description && <PitchDescription>{description}</PitchDescription>}

          {ctaHref && (
            <GatsbyLink to={ctaHref}>
              <GetStartedButton appearance="secondary">Get started</GetStartedButton>
            </GatsbyLink>
          )}

          {languageList.length > 0 && (
            <Languages>
              <LanguagesLabel>Languages: </LanguagesLabel>
              {languageList}
            </Languages>
          )}

          {contributorCount && <StatWrapper value={contributorCount} label="Contributors" />}
        </Pitch>

        <Figure>
          {imagePath && (
            <GuideImage alt={title} heroAnimationName={heroAnimationName} src={imagePath} />
          )}
        </Figure>
      </HeroContent>
    </HeroWrapper>
  );
};

Hero.propTypes = {
  contributorCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ctaHref: PropTypes.string,
  description: PropTypes.string,
  heroAnimationName: PropTypes.string,
  imagePath: PropTypes.string,
  languages: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  themeColor: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

Hero.defaultProps = {
  contributorCount: null,
  ctaHref: null,
  description: null,
  heroAnimationName: null,
  imagePath: null,
};

export default Hero;
