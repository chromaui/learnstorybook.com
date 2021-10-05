---
title: 'UI Testing Handbook'
description: 'Learn how to build your own addons that will super charge your development'
heroDescription: 'Addons give you superpowers to extend Storybook, automate workflows, and integrate with your favorite tools. This guide shows you how to create an addon.'
overview: 'While the Storybook community offers over 250 addons, you can also build one tailored to your specific needs. This guide introduces you to the Addon Kit and APIs, along the way you will build an addon from scratch.'
order: 3
themeColor: '#2A0481'
codeGithubUrl: 'https://github.com/chromaui/ui-testing-guide-code'
heroAnimationName: null
toc:
  [
    'introduction',
    'strategy',
    'visual-testing',
    'composition-testing',
    'interaction-testing',
    'accessibility-testing',
    'user-flow-testing',
    'automate',
    'workflow',
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
twitterShareText: "I’m learning how to test UIs! They're great for customizing Storybook to fit your UI development workflow."
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg"> React
  </div>
</div>

![Taskbox UI](/ui-testing-handbook/taskbox.png)

Follow along as we test the Taskbox app. It's a task management app, similar to Asana, where you can pin, edit and archive tasks. We'll look at how to test visual and functional characteristics of this UI. Each chapter illustrates a different aspect of testing components.
