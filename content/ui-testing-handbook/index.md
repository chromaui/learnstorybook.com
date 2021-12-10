---
title: 'UI Testing Handbook'
description: 'Testing techniques used by leading engineering teams'
heroDescription: "A guide that highlights UI testing strategies used by scaled front-end teams. You'll learn to verify everything from visual appearance to logic and even detect integration issues. Along the way, we'll demonstrate how you can reduce bugs by automatically running your tests."
overview: "UI testing is integral to delivering high-quality experiences. But there are so many ways to test that it can be overwhelming to figure out what's right for your project. This guide distils learnings from leading teams such as Target, Adobe, O'Reilly and Shopify into a pragmatic testing strategy that offers comprehensive coverage, easy setup, and low maintenance. We'll walk through the processes of setting up tooling, writing tests and automating your workflow."
order: 3
themeColor: '#2A0481'
codeGithubUrl: 'https://github.com/chromaui/ui-testing-guide-code'
heroAnimationName: null
toc:
  [
    'introduction',
    'visual-testing',
    'composition-testing',
    'interaction-testing',
    'accessibility-testing',
    'user-flow-testing',
    'automate',
    'workflow',
    'conclusion',
  ]
coverImagePath: '/guide-cover/ui-test.svg'
thumbImagePath: '/guide-thumb/ui-test.svg'
contributorCount: '1'
authors:
  [
    {
      src: 'https://avatars2.githubusercontent.com/u/42671',
      name: 'Varun Vachhar',
      detail: 'Storybook DX',
    },
  ]
contributors: []
twitterShareText: "I'm learning how to test UIs! This will help me ship UIs without worrying about stowaway bugs."
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg"> React
  </div>
  <div class="badge">
    <img src="/frameworks/logo-testing-library.svg"> Testing Library
  </div>
  <div class="badge">
    <img src="/icon-chroma.svg"> Chromatic
  </div>
  <div class="badge">
    <img src="/frameworks/logo-axe.png"> Axe
  </div>
  <div class="badge">
    <img src="/frameworks/logo-jest.svg"> Jest
  </div>
  <div class="badge">
    <img src="/frameworks/logo-github.svg"> GitHub Actions
  </div>
  <div class="badge">
    <img src="/frameworks/logo-cypress.svg"> Cypress
  </div>
</div>

![Taskbox UI](/ui-testing-handbook/taskbox.png)

Follow along as we test the Taskbox app. It's a task management app, similar to Asana, where you can pin, edit and archive tasks. We'll look at how to verify the various characteristics of this UI.
