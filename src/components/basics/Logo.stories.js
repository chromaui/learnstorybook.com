import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import Logo from './Logo';

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
`;

storiesOf('Basics|Logo', module)
  .add('default', () => <Logo />)
  .add('inverted', () => (
    <BlueBackground>
      <Logo isInverted />
    </BlueBackground>
  ));
