import React from 'react';
import styled from 'styled-components';
import { Button, styles } from '@storybook/design-system';
import CTA from './CTA';

const Wrapper = styled.div`
  padding: 40px 0;

  @media (min-width: ${styles.breakpoint + 1}px) {
    padding: 40px;
  }
`;

const ctaAction = <Button appearance="secondary">Get started</Button>;

export default {
  component: CTA,
  title: 'Composite/CTA',
  decorators: [story => <Wrapper>{story()}</Wrapper>],
};

export const All = () => (
  <>
    <CTA text="Get started with our thing today!" action={ctaAction} />

    <CTA
      text="Get started with our really long thing that will potentially break lines today!"
      action={ctaAction}
    />
  </>
);
