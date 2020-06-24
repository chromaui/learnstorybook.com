import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  height: 120px;
`;

const props = {
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

export default {
  component: Header,
  title: 'Composite/Header',
};

export const Basic = args => <Header {...args} />;
Basic.storyName = 'default';
Basic.args = {
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
export const Inverted = () => (
  <BlueBackground>
    <Header isInverted {...props} />
  </BlueBackground>
);
Inverted.storyName = 'inverted';
