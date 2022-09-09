import React from 'react';
import { within, userEvent } from '@storybook/testing-library';
import { styled } from '@storybook/theming';
import { languageNameMap } from '../../../lib/getLanguageName';
import LanguageSelector from './LanguageSelector';

export default {
  component: LanguageSelector,
  title: 'Screens/ChapterScreen/LanguageSelector',
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
  return <LanguageSelector {...args} />;
}

export const Default = Story.bind({});
Default.args = {
  translationPages: {
    edges: Object.keys(languageNameMap).map((l) => ({
      node: {
        fields: {
          language: l,
          slug: '/chapter',
        },
      },
    })),
  },
};
Default.decorators = [(story) => <Height height={750}>{story()}</Height>];
Default.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = await canvas.findByRole('button', { name: /english/i });

  await userEvent.click(button);
};

export const OnlyOneLanguage = Story.bind({});
OnlyOneLanguage.args = {
  translationPages: {
    edges: [
      {
        node: {
          fields: {
            language: 'en',
            slug: '/chapter',
          },
        },
      },
    ],
  },
};
