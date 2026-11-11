import React from 'react';
import Footer from './Footer';

export default {
  component: Footer,
  title: 'Composite/Footer',
  parameters: {
    layout: 'fullscreen',
  },
};

const Story = (args) => <Footer {...args} />;
export const Default = Story.bind({});
Default.args = {
  subscriberCount: 9999,
};
