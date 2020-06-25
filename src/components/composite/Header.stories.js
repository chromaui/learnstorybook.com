import React from 'react';
import styled from 'styled-components';
import Header from './Header';

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  height: 120px;
`;

export default {
  component: Header,
  title: 'Composite/Header',
  args: {
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
  },
};

export const Default = args => <Header {...args} />;
export const Inverted = args => (
  <BlueBackground>
    <Header isInverted {...args} />
  </BlueBackground>
);
