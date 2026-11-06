import React from 'react';
import Guides from './Guides';

export default {
  component: Guides,
  title: 'Screens/IndexScreen/Guides',
};

const Story = (args) => <Guides {...args} />;
export const Default = Story.bind({});
Default.args = {
  chaptersEdges: [
    {
      node: {
        fields: {
          guide: 'guide',
        },
      },
    },
  ],
  guidesEdges: [
    {
      node: {
        fields: {
          guide: 'guide',
          slug: '/guide',
        },
        frontmatter: {
          description: 'The guide description',
          title: 'Guide Title',
          themeColor: '#6F2CAC',
          thumbImagePath: '/guide-thumb/intro.svg',
        },
      },
    },
    {
      node: {
        fields: {
          guide: 'ai-ready-design-systems',
          slug: '/ai-ready-design-systems',
        },
        frontmatter: {
          description:
            'Give coding agents the context, docs and feedback loops they need to build with your components.',
          isNew: true,
          title: 'Make your Design System AI-ready',
          themeColor: '#EA580C',
          themeGradientName: 'sunrise',
          thumbImagePath: '/guide-thumb/ai-ready-design-systems.svg',
        },
      },
    },
    {
      node: {
        fields: {
          guide: 'guide-three',
          slug: '/guide-three',
        },
        frontmatter: {
          description: 'The third guide description',
          title: 'Third Guide',
          themeColor: '#2A0481',
          thumbImagePath: '/guide-thumb/ui-test.svg',
        },
      },
    },
    {
      node: {
        fields: {
          guide: 'guide-four',
          slug: '/guide-four',
        },
        frontmatter: {
          description: 'The fourth guide description',
          title: 'Fourth Guide',
          themeColor: '#129F00',
          thumbImagePath: '/guide-thumb/visual-testing.svg',
        },
      },
    },
  ],
};
