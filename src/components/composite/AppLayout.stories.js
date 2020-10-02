import React from 'react';
import styled from 'styled-components';
import AppLayout from './AppLayout';

const Children = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 169px 0 100px;
`;
export default {
  component: AppLayout,
  title: 'Composite/AppLayout',
};
const Story = args => <AppLayout {...args} />;

export const Default = Story.bind({});
Default.args = {
  children: <Children>I am the app.</Children>,
  location: { pathname: '' },
};
