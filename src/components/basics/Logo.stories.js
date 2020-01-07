import React from 'react';
import styled from 'styled-components';
import Logo from './Logo';

export default {
  component: Logo,
  title: 'Basics|Logo',
};

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
`;

export const Default = () => <Logo />;

export const Inverted = () => (
  <BlueBackground>
    <Logo isInverted />
  </BlueBackground>
);
