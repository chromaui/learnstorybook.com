import React from 'react';
import styled from 'styled-components';
import AppLayout from './AppLayout';

export default {
  component: AppLayout,
  excludeStories: /.*Data$/,
  title: 'Composite|AppLayout',
};

const Children = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 169px 0 100px;
`;

const AppLayoutData = {
  children: <Children>I am the app.</Children>,
  location: { pathname: '' },
};
export const Default = () => <AppLayout {...AppLayoutData} />;
