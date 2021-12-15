---
title: 'Visual Testing Handbook'
description: 'Visual testing is a pragmatic yet precise way to check UI appearance.'
heroDescription: 'Visual testing is a pragmatic yet precise way to verify the look of UI components. It’s practiced by companies like Slack, Lonely Planet, and Walmart. This handbook gives you an overview of visual testing in Storybook.'
overview: 'What is visual testing? Visual tests validate the appearance of rendered UI by capturing an image of it in a consistent browser environment. That image is compared to previous images (baselines) to detect visual changes. UIs are more complex, multi-state, and personalized than ever. Visual testing helps you ensure that your app looks right every release.'
order: 4
themeColor: '#129F00'
codeGithubUrl: 'https://github.com/chromaui/learnstorybook-visual-testing-code'
heroAnimationName: null
toc: ['introduction', 'component-explorers', 'workflow', 'vtdd', 'automate', 'conclusion']
coverImagePath: '/guide-cover/visual-testing.svg'
thumbImagePath: '/guide-thumb/visual-testing.svg'
contributorCount: '33+' # early access readers
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
contributors: []
twitterShareText: 'I’m learning how to visual test UIs with Storybook! It’s great for finding UI bugs automatically.'
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/frameworks/logo-react.svg"> React
  </div>
</div>

![CommentList](/visual-testing-handbook/commentlist-presentation-data.jpg)

`CommentList` is a list component that you might find in any chat tool. Follow along as we demonstrate how to use Storybook to build discrete UI variations. Then we'll walk through the process of visual testing manually and automatically.
