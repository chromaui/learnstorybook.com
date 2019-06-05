import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from '@storybook/design-system';
import ShadowBox from './ShadowBox';

storiesOf('ShadowBox', module).add('default', () => <ShadowBox>Shadow box content</ShadowBox>);
