---
title: 'Intro to Storybook'
description: "Learn to create bulletproof UI components, along the way you'll build an app UI from scratch."
heroDescription: 'Storybook is the most popular UI component development tool for React, Vue, and Angular. It helps you develop and design UI components outside your app in an isolated environment. Learn Storybook to create bulletproof UI components, along the way you’ll build an app UI from scratch.'
overview: 'Intro to Storybook teaches tried-and-true patterns for component development using Storybook. You’ll walk through essential UI component techniques while building a UI from scratch in React, Vue, or Angular. The info here is sourced from professional teams, core maintainers, and the awesome Storybook community. Professional developers at Airbnb, Dropbox, and Lonely Planet use Storybook to build durable documented UIs faster.'
order: 1
themeColor: '#6F2CAC'
codeGithubUrl: 'https://github.com/chromaui/learnstorybook-code'
heroAnimationName: 'float'
toc:
  [
    'get-started',
    'simple-component',
    'composite-component',
    'data',
    'screen',
    'test',
    'using-addons',
    'creating-addons',
    'deploy',
    'conclusion',
    'contribute',
  ]
coverImagePath: '/guide-cover/intro.svg'
thumbImagePath: '/guide-thumb/intro.svg'
contributorCount: '+42'
authors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/132554',
      name: 'Tom Coleman',
      detail: 'Storybook core',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/263385',
      name: 'Dominic Nguyen',
      detail: 'Storybook design',
    },
  ]
contributors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/22988955',
      name: 'João Cardoso',
      detail: 'Engineer',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/1593752',
      name: 'Carlos Vega',
      detail: 'Engineer',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/5649014',
      name: 'Carlos Iván Suarez',
      detail: 'Engineer',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/9523719',
      name: 'Kyle Holmberg',
      detail: 'Engineer at Acorns',
    },
    {
      src: 'https://avatars2.githubusercontent.com/u/1474548',
      name: 'Daniel Duan',
      detail: 'Engineer at Squarespace',
    },
  ]
twitterShareText: 'I’m learning Storybook! It’s a great dev tool for UI components.'
guideInformation: [
  {
     framework: 'react',
     currentGuideVersion: [
       {
         language: 'de',
         version: 5.2
       },
       {
         language: 'en',
         version: 5.3
       },
       {
         language: 'es',
         version: 5.2
       },
       {
         language: 'nl',
         version: 5.2
       },
       {
         language: 'pt',
         version: 5.3
       },
       {
         language: 'zh-CN',
         version: 5.2
       },
       {
         language: 'zh-TW',
         version: 5.2
       },
     ]
  },
  {
     framework: 'react-native',
     currentGuideVersion: [
       {
         language: 'en',
         version: 5.3
       },
       {
         language: 'es',
         version: 5.3
       },
     ]
  },
  {
     framework: 'vue',
     currentGuideVersion: [
       {
         language: 'en',
         version: 5.3
       },
       {
         language: 'es',
         version: 5.3
       },
       {
         language: 'pt',
         version: 5.3
       }
     ]
  },
  {
     framework: 'angular',
     currentGuideVersion: [
       {
         language: 'en',
         version: 5.3
       },
       {
         language: 'es',
         version: 5.2
       },
       {
         language: 'pt',
         version: 5.2
       }
     ]
  },
  {
     framework: 'svelte',
     currentGuideVersion: [
        {
         language: 'en',
         version: 5.3
       }
     ]
  },
  {
     framework: 'ember',
     currentGuideVersion: []
  },
  {
     framework: 'html',
     currentGuideVersion: []
  },
  {
     framework: 'marko',
     currentGuideVersion: []
  },
  {
     framework: 'mithril',
     currentGuideVersion: []
  },
  {
     framework: 'riot',
     currentGuideVersion: []
  },
]
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg">
    <a href="/intro-to-storybook/react/en/get-started/"> React</a>
  </div>
  <div class="badge">
    <img src="/frameworks/logo-react.svg">
    <a href="/intro-to-storybook/react-native/en/get-started/"> React Native</a>
  </div>
  <div class="badge">
    <img src="/frameworks/logo-vue.svg">
    <a href="/intro-to-storybook/vue/en/get-started/"> Vue</a>
  </div>
  <div class="badge">
    <img src="/frameworks/logo-angular.svg">
    <a href="/intro-to-storybook/angular/en/get-started/"> Angular</a>
  </div>
  <div class="badge">
   <img src="/frameworks/logo-svelte.svg">
   <a href="/intro-to-storybook/svelte/en/get-started/">  Svelte</a>
  </div>
</div>

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

Taskbox, a task management UI (similar to Asana), complete with multiple item types and states. We'll go from building simple UI components to assembling screens. Each chapter illustrates a different aspect of developing UIs with Storybook.

📖 Each chapter is linked to a working commit to help you stay in sync.
