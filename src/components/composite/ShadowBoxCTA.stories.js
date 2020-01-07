import React from 'react';
import styled from 'styled-components';
import { Button, styles } from '@storybook/design-system';
import ShadowBoxCTA from './ShadowBoxCTA';

export default {
  component: ShadowBoxCTA,
  title: 'Composite|ShadowBoxCTA',
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  excludeStories: /.*Data$/,
};

const Wrapper = styled.div`
  padding: 40px 0;

  @media (min-width: ${styles.breakpoint + 1}px) {
    padding: 40px;
  }
`;

export const ctaActionData = <Button appearance="secondary">Continue</Button>;

export const Default = () => (
  <ShadowBoxCTA
    action={ctaActionData}
    headingText="Composite component"
    messageText="Assemble a composite component out of simpler components"
  />
);
