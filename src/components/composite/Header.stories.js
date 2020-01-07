import React from 'react';
import styled from 'styled-components';
import Header from './Header';

export default {
  component: Header,
  excludeStories: /.*Data$/,
  title: 'Composite|Header',
};

const BlueBackground = styled.div`
  padding: 20px;
  background-image: linear-gradient(14deg, #26c6db 0%, #2694db 100%);
  height: 120px;
`;

export const HeaderData = {
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

export const Default = () => <Header {...HeaderData} />;

export const Inverted = () => (
  <BlueBackground>
    <Header isInverted {...HeaderData} />
  </BlueBackground>
);
