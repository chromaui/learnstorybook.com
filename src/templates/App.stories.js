/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import App from './App';

const Children = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const props = {
  children: <Children>I am the app.</Children>,
  location: { pathname: ':pathname' },
};

storiesOf('Templates|App', module).add('default', () => <App {...props} />);
