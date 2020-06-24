import React from 'react';
import styled from 'styled-components';
import BoxLink from './BoxLink';

export default {
  component: BoxLink,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Basics/BoxLink',
};

const Wrapper = styled.div`
  padding: 20px;
`;

export const Basic = () => <BoxLink to="/">BoxLink content</BoxLink>;
Basic.storyName = 'Default';
