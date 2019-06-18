import React from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import { styles } from '@storybook/design-system';
import Stat from './Stat';

const Wrapper = styled.div`
  background: ${styles.color.green};
  padding: 20px;
`;

storiesOf('Basics|Stat', module)
  .addParameters({ component: Stat })
  .addDecorator(story => <Wrapper>{story()}</Wrapper>)
  .add('default', () => <Stat value="6" label="Contributors" />);
