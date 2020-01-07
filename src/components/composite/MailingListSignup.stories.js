import React from 'react';
import styled from 'styled-components';
import MailingListSignup from './MailingListSignup';

export default {
  component: MailingListSignup,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Composite|MailingListSignup',
};

const Wrapper = styled.div`
  padding: 20px;
`;

export const Default = () => <MailingListSignup />;
