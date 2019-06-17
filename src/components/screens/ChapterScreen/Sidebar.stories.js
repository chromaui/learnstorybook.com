import React from 'react';
import { storiesOf } from '@storybook/react';
import Sidebar from './Sidebar';
import LanguageMenu from './LanguageMenu';

const currentPageSlug = 'slug-1';

const entries = [
  { slug: currentPageSlug, title: 'Chapter 1' },
  { slug: 'slug-2', title: 'Chapter 2' },
];

storiesOf('Screens|ChapterScreen/Sidebar', module).add('default', () => (
  <Sidebar
    entries={entries}
    guide="Guide Name"
    slug={currentPageSlug}
    languageMenu={
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
    }
  />
));
