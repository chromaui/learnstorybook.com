import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import Header from './Header';

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
`;

const props = {
  firstChapter: 'get-started',
  githubUrl: 'https://github.com/chromaui/learnstorybook.com',
};

storiesOf('Organisms|Header', module)
  .add('default', () => <Header {...props} />)
  .add('with nav', () => <Header withNav {...props} />)
  .add('inverted', () => (
    <BlueBackground>
      <Header isInverted {...props} />
    </BlueBackground>
  ))
  .add('inverted with nav', () => (
    <BlueBackground>
      <Header isInverted withNav {...props} />
    </BlueBackground>
  ));
