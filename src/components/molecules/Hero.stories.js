import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import Hero from './Hero';

const Wrapper = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
`;

storiesOf('Molecules|Hero', module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => <Hero />);
