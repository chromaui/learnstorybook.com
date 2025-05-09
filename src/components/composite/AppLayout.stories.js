import React from 'react';
import { SubNavTabs } from '@storybook/components-marketing';
import { styled } from '@storybook/theming';
import { PureAppLayout } from './AppLayout';

const navItems = [
  {
    key: '0',
    label: 'Guides',
    href: '#',
  },
  {
    key: '1',
    label: 'Tutorials',
    href: '#',
    isActive: true,
  },
];

const Children = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default {
  component: PureAppLayout,
  title: 'Composite/AppLayout',
  argTypes: {
    children: {
      options: ['default'],
      mapping: {
        default: <Children>I am the app.</Children>,
      },
    },
    subNav: {
      options: ['default'],
      mapping: {
        default: <SubNavTabs label="Docs nav" items={navItems} />,
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};
function Story(args) {
  return <PureAppLayout {...args} />;
}

export const Default = Story.bind({});
Default.args = {
  children: 'default',
  data: {
    site: {
      siteMetadata: {
        title: 'Storybook Tutorials',
        description:
          'Learn how to build and test UI components with Storybook. Our in-depth frontend guides are created by Storybook maintainers and peer-reviewed by the open source community.',
        githubUrl: 'https://github.com/chromaui/learnstorybook.com',
        permalink: 'https://storybook.js.org/tutorials',
      },
    },
    guides: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Intro to Storybook',
              description:
                "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch.",
            },
            fields: {
              slug: '/intro-to-storybook/',
            },
          },
        },
        {
          node: {
            frontmatter: {
              title: 'UI Testing Handbook',
              description: 'Testing techniques used by leading engineering teams',
            },
            fields: {
              slug: '/ui-testing-handbook/',
            },
          },
        },
        {
          node: {
            frontmatter: {
              title: 'Visual Testing Handbook',
              description: 'Visual testing is a pragmatic yet precise way to check UI appearance.',
            },
            fields: {
              slug: '/visual-testing-handbook/',
            },
          },
        },
      ],
    },
    dxData: {
      githubStars: 99999,
      versionString: '6.5',
      subscriberCount: 9999,
    },
  },
  location: { pathname: '' },
  subNav: 'default',
};
