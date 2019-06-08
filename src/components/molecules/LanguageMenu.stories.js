import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import LanguageMenu from './LanguageMenu';

const Wrapper = styled.div`
  padding: 20px;
`;

storiesOf('Molecules|LanguageMenu', module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => <LanguageMenu currentLanguageName="English" />);
