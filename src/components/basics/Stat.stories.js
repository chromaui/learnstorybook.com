import React from 'react';
import styled from 'styled-components';
import { styles } from '@storybook/design-system';
import Stat from './Stat';

export default {
  component: Stat,
  decorators: [story => <Wrapper>{story()}</Wrapper>],
  title: 'Basics/Stat',
};

const Wrapper = styled.div`
  background: ${styles.color.green};
  padding: 20px;
`;
const Story = args => <Stat {...args} />;

export const Default = Story.bind({});
Default.args = {
  value: '6',
  label: 'Contributors',
};
