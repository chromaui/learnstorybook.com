---
title: 'Create an Addon'
description: 'Learn how to build your own addons that will super charge your development'
heroDescription: 'Addons give you superpowers to extend Storybook, automate workflows, and integrate with your favorite tools. This guide shows you how to create an addon.'
overview: 'While the Storybook community offers over 250 addons, you can also build one tailored to your specific needs. This guide introduces you to the Addon Kit and APIs, along the way you will build an addon from scratch.'
order: 4
themeColor: '#FF4785'
codeGithubUrl: 'https://github.com/chromaui/learnstorybook-code'
heroAnimationName: null
toc:
  [
    'introduction',
    'getting-started',
    'register-an-addon',
    'track-state',
    'decorators',
    'preset',
    'add-to-catalog',
    'conclusion',
  ]
coverImagePath: '/guide-cover/create-an-addon.svg'
thumbImagePath: '/guide-thumb/create-an-addon.svg'
contributorCount: '+3'
authors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/42671',
      name: 'Varun Vachhar',
      detail: 'Storybook DX',
    },
  ]
contributors: []
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg"> <a href="/create-an-addon/react/en/introduction/"> React</a>
  </div>
</div>

![Outline Addon](/images/outline-addon-hero.gif)

Follow along as we code the Outline addon—used for visually debugging CSS layout and alignment. It adds a toolbar button that outlines all UI elements, making it easy to verify positioning and placement at a glance.
