import React from 'react';
import { styles as marketingStyles } from '@storybook/components-marketing';
import { styles } from '@storybook/design-system';
import { styled } from '@storybook/theming';

const { breakpoint, color } = styles;

const PitchWrapper = styled.div`
  margin-bottom: 40px;
`;

const PitchTitle = styled.h1`
  ${marketingStyles.marketing.subheading}
  color: ${color.darkest};
  margin-bottom: 12px;

  @media (min-width: ${breakpoint}px) {
    ${marketingStyles.marketing.hero2}
  }
`;

const PitchDescription = styled.p`
  ${marketingStyles.marketing.textLarge}
  color: ${color.darker};
  margin: 0;
`;

function Pitch() {
  return (
    <PitchWrapper>
      <PitchTitle>Tutorials</PitchTitle>

      <PitchDescription>
        Free in-depth guides with code samples. Made for professional frontend developers.{' '}
      </PitchDescription>
    </PitchWrapper>
  );
}

export default Pitch;
