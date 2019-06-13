import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import App from './app';

const Children = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 169px 0 100px;
`;

const props = {
  children: <Children>I am the app.</Children>,
  location: { pathname: '' },
};

storiesOf('Templates|App', module).add('default', () => <App {...props} />);
