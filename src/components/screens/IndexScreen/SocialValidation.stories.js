import React from 'react';
import { storiesOf } from '@storybook/react';
import SocialValidation from './SocialValidation';

storiesOf('Screens|IndexScreen/SocialValidation', module)
  .addParameters({ component: SocialValidation })
  .add('default', () => <SocialValidation />);
