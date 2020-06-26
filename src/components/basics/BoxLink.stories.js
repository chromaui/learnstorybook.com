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

const Story = args => <BoxLink {...args}>{args.text}</BoxLink>;
export const Default = Story.bind({});
Default.args = {
  to: '/',
  text: 'BoxLink content',
};
