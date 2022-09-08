import React from 'react';
import { styled } from '@storybook/theming';
import Header from './Header';

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  height: 120px;
`;

export default {
  component: Header,
  title: 'Composite/Header',
};

function Story(args) {
  return <Header {...args} />;
}
export const Default = Story.bind({});
Default.args = {
  firstChapter: 'get-started',
  githubUrl: 'https://github.com/chromaui/learnstorybook.com',
  guides: {
    edges: [
      {
        node: {
          frontmatter: {
            title: 'Guide title',
            description: 'Guide description',
          },
          fields: {
            slug: 'guide-slug',
          },
        },
      },
    ],
  },
};

export const Inverted = Story.bind({});
Inverted.args = {
  ...Default.args,
  inverse: true,
};
Inverted.decorators = [(story) => <BlueBackground>{story()}</BlueBackground>];
