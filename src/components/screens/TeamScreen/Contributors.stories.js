import React from 'react';
import { storiesOf } from '@storybook/react';
import Contributors from './Contributors';

storiesOf('Screens|TeamScreen/Contributors', module)
  .addParameters({ component: Contributors })
  .add('default', () => <Contributors />);
