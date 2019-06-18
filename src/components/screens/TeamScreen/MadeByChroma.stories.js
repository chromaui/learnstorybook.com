import React from 'react';
import { storiesOf } from '@storybook/react';
import MadeByChroma from './MadeByChroma';

storiesOf('Screens|TeamScreen/MadeByChroma', module)
  .addParameters({ component: MadeByChroma })
  .add('default', () => <MadeByChroma />);
