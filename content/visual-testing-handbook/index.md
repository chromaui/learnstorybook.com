---
title: "Visual Testing Handbook"
description: "✍️Coming soon: Visual testing is a pragmatic yet precise way to check UI appearance."
heroDescription: "✍️Coming soon: Visual testing is a pragmatic yet precise way to verify the look of UI components. It’s practiced by companies like Slack, Lonely Planet, and Walmart. This five chapter handbook gives you an overview of visual testing in Storybook."
overview: "UIs are more complex, multi-state, and personalized than ever. This yields thousands of app permutations users can encounter. UI components help manage that complexity. This book talks about how testing those components helps you ensure that your app looks and feels great every release."
themeColor: "#129F00"
codeGithubUrl: "https://github.com/chromaui/learnstorybook-code"
heroAnimationName: null
toc:
  [
    "introduction",
    "component-explorers",
    "visual-test-driven-development",
    "tutorial",
    "automate",
  ]
coverImagePath: "/guide-cover/visual-testing.svg"
thumbImagePath: "/guide-thumb/visual-testing.svg"
contributorCount: "+2"
authors:
  [
    {
      src: "https://avatars2.githubusercontent.com/u/263385",
      name: "Dominic Nguyen",
      detail: "Storybook design",
    },
    {
      src: "https://avatars2.githubusercontent.com/u/132554",
      name: "Tom Coleman",
      detail: "Storybook core",
    },
  ]
contributors: []
---

<h2>What you'll build</h2>

<div class="badge-box">
  <div class="badge">
    <img src="/logo-react.svg"> React
  </div>
</div>

![CommentList](/visual-testing-handbook/commentlist-presentation-data.jpg)

`CommentList` is a list component that you might find in any chat tool. Follow along as we demonstrate how to use Storybook to build discrete UI states including `loading`, `empty`, and `hasData`. Then we'll walk through the process of visual testing by hand and automatically.
