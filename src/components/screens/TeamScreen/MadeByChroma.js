import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import Subheading from './Subheading';
import ShadowBox from '../../basics/ShadowBox';

const { breakpoint, color, typography } = styles;

const ChromaShadowBox = styled(ShadowBox)`
  margin-top: 24px;
  padding: 20px;

  display: flex;
  text-decoration: none;
  color: ${color.darkest};

  transition: transform 150ms ease-out;

  &:hover {
    transform: translate3d(0, -3px, 0);
  }

  &:active {
    transform: translate3d(0, 0, 0);
  }

  img {
    display: block;
    width: 50px;
    height: 50px;
    margin-right: 16px;
  }

  @media (min-width: ${breakpoint}px) {
    padding: 40px;

    a {
    }

    img {
      width: 60px;
      height: 60px;
      margin-right: 24px;
    }
  }
`;

const Bold = styled.span`
  font-weight: ${typography.weight.bold};
`;

const MadeByChroma = () => (
  <>
    <Subheading>Made by</Subheading>

    <ChromaShadowBox as="a" target="_blank" rel="noopener noreferrer" href="https://hichroma.com/">
      <img alt="Chroma, the Storybook company" src="/icon-chroma.svg" />
      <div>
        <Bold>Chroma is the Storybook company</Bold> run by core maintainers. We help devs learn
        Component-Driven Development and build time-saving tools like Chromatic.{' '}
      </div>
    </ChromaShadowBox>
  </>
);

export default MadeByChroma;
