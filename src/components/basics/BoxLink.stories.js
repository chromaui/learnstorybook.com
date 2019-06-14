import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import BoxLink from './BoxLink';

const Wrapper = styled.div`
  padding: 20px;
`;

storiesOf('Basics|BoxLink', module)
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => <BoxLink to="/">BoxLink content</BoxLink>);
