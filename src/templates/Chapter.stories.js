import React from 'react';
import { storiesOf } from '@storybook/react';
import Chapter from './chapter';
import LanguageMenu from '../components/molecules/LanguageMenu';

const props = {
  data: {
    currentPage: {
      html: '<div>The html</div>',
      frontmatter: {
        commit: '123456789',
        title: 'Chapter Title',
        description: 'A good chapter',
      },
      fields: {
        chapter: 'chapter-1',
        guide: 'sample-guide',
        language: 'en',
        slug: '/chapter-slug',
      },
    },
    currentGuide: {
      frontmatter: {
        languages: ['en'],
        toc: ['chapter-1', 'chapter-2'],
      },
    },
    site: {
      siteMetadata: {
        githubUrl: 'https://github.com',
        codeGithubUrl: 'https://github.com',
        title: 'Learn Storybook',
      },
    },
    pages: {
      edges: [
        {
          node: {
            frontmatter: {
              title: 'Chapter 1',
              description: 'Chapter 1 description',
            },
            fields: {
              slug: '/chapter-slug',
              chapter: 'chapter-1',
            },
          },
        },
      ],
    },
  },
  languageMenu: (
    <LanguageMenu
      buttonContent="The button"
      renderItems={({ Item, Title, Detail, Link }) => (
        <Item>
          <div>
            <Title>React</Title>
            <Detail>
              <Link to="/en/">English</Link>
              <Link to="/es/">Español</Link>
              <Link to="/pt/">Português</Link>
            </Detail>
          </div>
        </Item>
      )}
    />
  ),
};

storiesOf('Templates|Chapter', module).add('default', () => <Chapter {...props} />);
