import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import MailingListSignup from './MailingListSignup';

const Wrapper = styled.div`
  padding: 20px;
`;

storiesOf('Composite|MailingListSignup', module)
  .addParameters({ component: MailingListSignup })
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => <MailingListSignup />);
