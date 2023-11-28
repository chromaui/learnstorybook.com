import React from 'react';
import { SubNavBreadcrumb, SubNavTabs } from '@storybook/components-marketing';
import { Icon } from '@storybook/design-system';
import { styled } from '@storybook/theming';
import Header from './Header';

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

const Height = styled.div`
  height: ${9.5 + 1}rem;
`;

const BlueBackground = styled.div`
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  height: 100%;
`;

export default {
  component: Header,
  title: 'Composite/Header',
  argTypes: {
    subNav: {
      options: ['default', 'inverted'],
      mapping: {
        default: <SubNavTabs label="Docs nav" items={navItems} />,
        inverted: (
          <SubNavBreadcrumb inverse tertiary to="#">
            <Icon icon="arrowleft" />
            Back to tutorials
          </SubNavBreadcrumb>
        ),
      },
    },
  },
  decorators: [(story) => <Height>{story()}</Height>],
  parameters: {
    layout: 'fullscreen',
  },
};

function Story(args) {
  return <Header {...args} />;
}
export const Default = Story.bind({});
Default.args = {
  githubStars: 99999,
  latestPost: {
    title: 'Why Storybook in 2022?',
    url: 'https://storybook.js.org/blog/why-storybook-in-2022',
  },
  subNav: 'default',
  versionString: '6.5',
};

export const Inverted = Story.bind({});
Inverted.args = {
  ...Default.args,
  inverse: true,
  subNav: 'inverted',
};
Inverted.decorators = [(story) => <BlueBackground>{story()}</BlueBackground>];
