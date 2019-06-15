import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import IconLearnStorybook from '../../basics/IconLearnStorybook';

const { breakpoint, color, typography } = styles;

const PitchWrapper = styled.div`
  text-align: center;
  max-width: 608px;
  margin: 0 auto;
  padding: 145px 20px 64px;
`;

const PitchTitle = styled.h1`
  color: ${color.darkest};
  font-weight: ${typography.weight.black};
  font-size: ${typography.size.l1}px;
  letter-spacing: -0.33px;
  line-height: 38px;
  margin-top: 18px;

  @media (min-width: ${breakpoint * 1.5}px) {
    font-size: 36px;
    line-height: 44px;
  }
`;

const PitchDescription = styled.div`
  color: ${color.darkest};
  font-size: ${typography.size.m1}px;
  color: ${color.dark};
  letter-spacing: -0.41px;
  line-height: 32px;
  text-align: center;
  margin: 12px auto 0;
  max-width: 434px;
`;

const Pitch = () => (
  <PitchWrapper>
    <IconLearnStorybook />

    <PitchTitle>Learn to develop UIs with components and design systems</PitchTitle>

    <PitchDescription>
      Free in-depth guides for professional frontend developers. Made by Storybook maintainers.
    </PitchDescription>
  </PitchWrapper>
);

export default Pitch;
