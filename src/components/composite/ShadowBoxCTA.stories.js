import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { Button, styles } from '@storybook/design-system';
import ShadowBoxCTA from './ShadowBoxCTA';

const Wrapper = styled.div`
  padding: 40px 0;

  @media (min-width: ${styles.breakpoint + 1}px) {
    padding: 40px;
  }
`;

const ctaAction = <Button appearance="secondary">Continue</Button>;

storiesOf('Composite|ShadowBoxCTA', module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => (
    <ShadowBoxCTA
      action={ctaAction}
      headingText="Composite component"
      messageText="Assemble a composite component out of simpler components"
    />
  ));
