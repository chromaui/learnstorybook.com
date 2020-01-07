import React from 'react';
import Footer from './Footer';

export default {
  component: Footer,
  excludeStories: /.*Data$/,
  title: 'Composite|Footer',
};

const guidesData = {
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

export const Default = () => <Footer guides={guidesData} />;
