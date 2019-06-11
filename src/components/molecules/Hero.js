import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Button, Link, styles } from '@storybook/design-system';
import GatsbyLink from '../atoms/GatsbyLink';

const { breakpoint, color, pageMargins, typography } = styles;

const Svg = styled.svg`
  display: inline-block;
  vertical-align: middle;
`;

const HeroWrapper = styled.div`
  background: ${props => color[props.themeColor]};
  padding-top: 242px;
  padding-bottom: 178px;
`;

const HeroContent = styled.div`
  ${pageMargins}
  display: flex;
`;

const Pitch = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  color: ${color.lightest};

  @media (min-width: ${breakpoint * 1.5}px) {
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

const Figure = styled.div`
  flex: 1;

  svg {
    display: block;
    height: auto;
    margin: 0 auto;
    width: 80%;
    @media (min-width: ${breakpoint * 1.5}px) {
      width: 100%;
    }
  }
`;

const Hero = ({ description, themeColor, title, ...rest }) => (
  <HeroWrapper themeColor={themeColor} {...rest}>
    <HeroContent>
      <Pitch>
        <PitchTitle>{title}</PitchTitle>
        <PitchDescription>{description}</PitchDescription>

        <Link to="/intro-to-storybook/react/en/get-started/" LinkWrapper={GatsbyLink}>
          <GetStartedButton appearance="secondary">Get started</GetStartedButton>
        </Link>
      </Pitch>

      <Figure>
        <Svg width="564" height="402" viewBox="0 0 564 402">
          <path
            opacity=".1"
            fill="#FFF"
            d="M306.068 297.122l-180.128 104-126-218.232 180.128-104z"
            className="sheet"
          />
          <path
            opacity=".2"
            fill="#FFF"
            d="M307.394 296.096L105.57 346.411 44.613 101.896 246.435 51.58z"
            className="sheet"
          />
          <path opacity=".3" fill="#FFF" d="M100 44h208v252H100z" className="sheet" />
          <path
            opacity=".9"
            fill="#FFF"
            d="M175.998-.002c55.993 8.091 94.66 14.925 116 20.502S338.339 35.651 367 49.22L308.168 296c-39.927-15.651-70.984-26.484-93.17-32.5s-57.186-12.516-105-19.502l66-244z"
            className="sheet"
          />
          <path
            fill="#FFF"
            d="M366.329 49.771c20.516-2.361 47.699-2.361 81.55 0 33.851 2.36 72.559 6.956 116.121 13.785L500.811 316c-34.729-7.849-67.676-13.345-98.838-16.49A683.042 683.042 0 0 0 308 296.539l58.329-246.768z"
            className="sheet"
          />
        </Svg>
      </Figure>
    </HeroContent>
  </HeroWrapper>
);

Hero.propTypes = {
  description: PropTypes.string.isRequired,
  themeColor: PropTypes.oneOf(Object.keys(color)).isRequired,
  title: PropTypes.string.isRequired,
};

export default Hero;
