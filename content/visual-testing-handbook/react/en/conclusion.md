---
title: 'Conclusion'
tocTitle: 'Conclusion'
description: 'Say bye to visual bugs'
---

Developers spend [21%](https://ieeexplore.ieee.org/document/895984) of their time fixing bugs. If you're a frontend developer like me, debugging UI appearance is especially frustrating.

Reproducing visual bugs requires you to spin up different browsers, get your app into the right state, and trudge through CSS. If you can't catch bugs in time, you end up burning [5-10x](https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf) more time to fix production bugs.

It should come as no surprise then why thousands of teams are adopting Storybook for visual testing. Storybook helps you **build** components and write **visual tests**. Running tests at the component level allows you to pinpoint the root cause of a change. Taking image snapshots helps you catch **regressions** automatically. That means folks can ship UIs without worrying about stowaway bugs.

This guide introduced you to essential visual testing concepts and tooling. Tom and I hope you can build upon these learnings in your own projects. Subscribe to the Storybook mailing list to get notified when helpful articles and guides like this are published.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## Sample code for this tutorial

If you've been following along, your repository and deployed Storybook should look like this:

- 📕 [GitHub repository](https://github.com/chromaui/learnstorybook-visual-testing-code)
- 🌎 [Deployed Storybook](https://6070d9288779ab00214a9831-oymqxvbejc.chromatic.com/?path=/story/commentlist--paginated)

## More resources

Want to dive deeper? Here are some additional helpful resources:

- [**Official Storybook documentation**](https://storybook.js.org/docs/react/get-started/introduction) has API documentation, examples, and the addon gallery.

- [**How to actually test UIs**](https://storybook.js.org/blog/how-to-actually-test-uis/) is a summary of practical UI testing strategies from Shopify, Adobe, Twilio, and more.

- [**Storybook Discord chat**](https://discord.gg/UUt2PJb) puts you in contact with the Storybook community and maintainers.

- [**Storybook blog**](https://medium.com/storybookjs) showcases the latest releases and features to streamline your UI development workflow.
