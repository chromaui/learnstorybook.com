import React from 'react';
import { styled } from '@storybook/theming';
import BoxLink from './BoxLink';

export default {
  component: BoxLink,
  decorators: [(story) => <Wrapper>{story()}</Wrapper>],
  title: 'Basics/BoxLink',
};

const Wrapper = styled.div`
  padding: 20px;
`;

const Story = (args) => <BoxLink {...args} />;
export const Default = Story.bind({});
Default.args = {
  to: '/',
  children: 'BoxLink content',
};
