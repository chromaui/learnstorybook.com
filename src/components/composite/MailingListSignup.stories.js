import React from 'react';
import styled from 'styled-components';
import MailingListSignup from './MailingListSignup';

const Wrapper = styled.div`
  padding: 20px;
`;
export default {
  component: MailingListSignup,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Composite/MailingListSignup',
};
export const Default = () => <MailingListSignup />;
