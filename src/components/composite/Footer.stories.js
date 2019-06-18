import React from 'react';
import { storiesOf } from '@storybook/react';
import Footer from './Footer';

const guides = {
  edges: [
    {
      node: { frontmatter: { title: 'Intro to Storybook' }, fields: { slug: 'slug' } },
    },
    {
      node: { frontmatter: { title: 'Storybook Best Practices' }, fields: { slug: 'slug' } },
    },
    {
      node: { frontmatter: { title: 'Master Storybook' }, fields: { slug: 'slug' } },
    },
    {
      node: { frontmatter: { title: 'Component-Driven Development' }, fields: { slug: 'slug' } },
    },
  ],
};

storiesOf('Composite|Footer', module).add('default', () => <Footer guides={guides} />);
