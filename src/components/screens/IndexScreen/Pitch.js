import React from 'react';
import { styled } from '@storybook/theming';
import { styles } from '@storybook/design-system';
import IconLearnStorybook from '../../basics/IconLearnStorybook';

const { breakpoint, color, typography } = styles;

const PitchWrapper = styled.div`
  color: ${color.darkest};
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 9rem 20px 3rem;
`;

const PitchTitle = styled.h1`
  margin-top: 1rem;

  font-size: ${typography.size.m3}px;
  font-weight: ${typography.weight.black};
  line-height: 24px;
  margin-bottom: 0.5rem;

  @media (min-width: ${breakpoint}px) {
    font-size: ${typography.size.l2}px;
    line-height: 1;
    margin-bottom: 1rem;
  }
`;

const PitchDescription = styled.div`
  font-size: ${typography.size.s3}px;
  line-height: 1.5;
  color: ${color.darker};

  @media (min-width: ${breakpoint}px) {
    font-size: ${typography.size.m1}px;
    line-height: 32px;
  }
`;

function Pitch() {
  return (
    <PitchWrapper>
      <IconLearnStorybook />

      <PitchTitle>Tutorials</PitchTitle>

      <PitchDescription>Learn to develop UIs with components and design systems.</PitchDescription>
    </PitchWrapper>
  );
}

export default Pitch;
