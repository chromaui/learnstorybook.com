import React from 'react';
import { storiesOf } from '@storybook/react';
import Chapter from './index';
import LanguageMenu from '../ChapterScreen/LanguageMenu';

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
    tocPages: {
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
        {
          node: {
            frontmatter: {
              title: 'Chapter 2',
              description: 'Chapter 2 description',
            },
            fields: {
              slug: '/chapter-2-slug',
              chapter: 'chapter-2',
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

storiesOf('Screens|ChapterScreen/index', module).add('default', () => <Chapter {...props} />);
