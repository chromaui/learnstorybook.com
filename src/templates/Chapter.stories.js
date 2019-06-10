import React from 'react';
import { storiesOf } from '@storybook/react';
import Chapter from './chapter';
import LanguageMenu from '../components/molecules/LanguageMenu';

const props = {
  guide: 'sample-guide',
  title: 'Chapter Title',
  slug: 'chapter-slug',
  description: 'A good chapter',
  githubUrl: 'https://github.com',
  codeGithubUrl: 'https://github.com',
  html: '<div>The html</div>',
  entries: [
    {
      slug: 'chapter-slug',
      title: 'Chapter Title',
    },
  ],
  nextEntry: null,
  commit: '123456789',
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
