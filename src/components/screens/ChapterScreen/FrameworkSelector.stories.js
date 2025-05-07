import React from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { styled } from '@storybook/theming';
import FrameworkSelector from './FrameworkSelector';

export default {
  component: FrameworkSelector,
  title: 'Screens/ChapterScreen/FrameworkSelector',
  args: {
    chapter: 'chapter',
    contributeUrl: '/contribute',
    firstChapter: 'get-started',
    guide: 'guide',
    language: 'en',
  },
};
const Height = styled.div`
  height: ${({ height }) => height}px;
`;

function Story(args) {
  return <FrameworkSelector {...args} />;
}

export const Default = Story.bind({});
Default.args = {
  framework: 'react',
  translationPages: {
    edges: [
      {
        node: {
          fields: {
            framework: 'react',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'angular',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'vue',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'svelte',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'react-native',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'html',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'marko',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'mithril',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
      {
        node: {
          fields: {
            framework: 'riot',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
    ],
  },
};
Default.decorators = [(story) => <Height height={450}>{story()}</Height>];
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = await canvas.findByRole('button', { name: /react/i });

  await userEvent.click(button);
};

export const OnlyOneFramework = Story.bind({});
OnlyOneFramework.args = {
  framework: 'react',
  translationPages: {
    edges: [
      {
        node: {
          fields: {
            framework: 'react',
            language: 'en',
            slug: '/chapter',
          },
        },
      },
    ],
  },
};
