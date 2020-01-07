import React from 'react';
import styled from 'styled-components';
import { Button, styles } from '@storybook/design-system';
import CTA from './CTA';

export default {
  component: CTA,
  excludeStories: /.*Data$/,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Composite|CTA',
};

const Wrapper = styled.div`
  padding: 40px 0;

  @media (min-width: ${styles.breakpoint + 1}px) {
    padding: 40px;
  }
`;

const ctaActionData = <Button appearance="secondary">Get started</Button>;

export const All = () => (
  <>
    <CTA text="Get started with our thing today!" action={ctaActionData} />

    <CTA
      text="Get started with our really long thing that will potentially break lines today!"
      action={ctaActionData}
    />
  </>
);
