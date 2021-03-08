---
title: 'Design Systems for Developers'
description: 'Discover how to build and maintain design systems using Storybook.'
heroDescription: 'A guide that teaches professional developers how to transform component libraries into design systems and set up the production infrastructure used by leading frontend teams.'
overview: "Design systems power the frontend teams of Shopify, IBM, Salesforce, Airbnb, Twitter,  and many more. This guide for professional developers examines how the smartest teams engineer design systems at scale and why they use the tools they use. We'll walk through setting up core services, libraries, and workflows to develop a design system from scratch."
order: 2
themeColor: '#0079FF'
codeGithubUrl: 'https://github.com/chromaui/learnstorybook-design-system'
heroAnimationName: null
toc:
  [
    'introduction',
    'architecture',
    'build',
    'review',
    'test',
    'document',
    'distribute',
    'workflow',
    'conclusion',
  ]
coverImagePath: '/guide-cover/design-system.svg'
thumbImagePath: '/guide-thumb/design-system.svg'
contributorCount: '+38'
authors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/263385',
      name: 'Dominic Nguyen',
      detail: 'Storybook design',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/132554',
      name: 'Tom Coleman',
      detail: 'Storybook core',
    },
  ]
contributors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/239215',
      name: 'Fernando Carrettoni',
      detail: 'Design Systems at Auth0',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/8339031',
      name: 'Jessie Wu',
      detail: 'Engineer at New York Times',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/21959607',
      name: 'John Crisp',
      detail: 'Engineer at Acivilate',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/1474548',
      name: 'Daniel Duan',
      detail: 'Engineer at Squarespace',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/85783',
      name: 'Kaelig Deloumeau-Prigent',
      detail: 'UX Development at Shopify',
    },
  ]
twitterShareText: "I’m learning about building design systems! They're great for scaling frontend code on large teams."
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg"> React
  </div>
  <div class="badge">
    styled-components
  </div>
  <div class="badge">
    Prettier
  </div>
  <div class="badge">
    GitHub Actions
  </div>
  <div class="badge">
    ESLint
  </div>
  <div class="badge">
    Chromatic
  </div>
  <div class="badge">
    Jest
  </div>
  <div class="badge">
    npm
  </div>
  <div class="badge">
    Auto
  </div>
</div>

![Design System example](/design-systems-for-developers/design-system-overview.jpg)

Follow along as we code a design system that's inspired by [Storybook's own](https://medium.com/storybookjs/introducing-storybook-design-system-23fd9b1ac3c0). We'll learn the developer perspective on design systems by examining three technical pieces of a design system.

- 🏗 Common reusable UI components
- 🎨 Design tokens: Styling-specific variables such as brand colors and spacing
- 📕 Documentation site: Usage instructions, narrative, do’s and don'ts

After that, we'll set up the industrial-grade infrastructure for review, testing, documentation, and distribution.
