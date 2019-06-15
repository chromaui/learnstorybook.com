import React from 'react';
import styled from 'styled-components';
import { Link, styles } from '@storybook/design-system';
import Subheading from './Subheading';
import ShadowBox from '../../basics/ShadowBox';

const { breakpoint, typography } = styles;

const ChromaShadowBox = styled(ShadowBox)`
  margin-top: 24px;
  padding: 20px;
  display: flex;

  a {
    margin-right: 16px;
  }

  img {
    width: 50px;
    height: 50px;
  }

  @media (min-width: ${breakpoint}px) {
    padding: 40px;

    a {
      margin-right: 24px;
    }

    img {
      width: 60px;
      height: 60px;
    }
  }
`;

const Bold = styled.span`
  font-weight: ${typography.weight.bold};
`;

const MadeByChroma = () => (
  <>
    <Subheading>Made by</Subheading>

    <ChromaShadowBox>
      <Link target="_blank" href="https://hichroma.com/">
        <img alt="Chroma, the Storybook company" src="/icon-chroma.svg" />
      </Link>

      <div>
        <Bold>Chroma is the Storybook company</Bold> run by core maintainers. We help devs learn
        Component-Driven Development and create frontend tools like Chromatic and Storybook Loop.{' '}
      </div>
    </ChromaShadowBox>
  </>
);

export default MadeByChroma;
