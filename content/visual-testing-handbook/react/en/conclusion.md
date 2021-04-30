---
title: 'Conclusion'
tocTitle: 'Conclusion'
description: 'Say bye to visual bugs'
---

Developers spend [21%](https://ieeexplore.ieee.org/document/895984) of their time fixing bugs. Debugging UI appearance can be especially frustrating. Reproductions require you to spin up different browsers, get your app into the right state, and trudge through DOM. The stakes are higher too; uncaught bugs cost [5-10x](https://www.cs.umd.edu/projects/SoftEng/ESEG/papers/82.78.pdf) more time to fix in production than in QA.

It's common sense then that thousands of frontend teams visual test using Storybook. Storybook helps you **build** components and write **visual tests**. Running tests at the component level allows you to pinpoint the root cause of a bug. Taking image snapshots helps you catch **regressions** automatically. That means folks can ship UIs without worrying about stowaway bugs.

This guide introduced you to the basics of visual testing. Tom and I hope you can build upon these learnings in your own projects. Join the Storybook mailing list to get notified of more helpful articles and guides like this.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## Sample code for this tutorial

If you've been following along, your repository and deployed Storybook should look like this:

- 📕 [**GitHub repository**](https://github.com/chromaui/learnstorybook-visual-testing-code)
- 🌎 [**Deployed Storybook**](https://6070d9288779ab00214a9831-oymqxvbejc.chromatic.com/?path=/story/commentlist--paginated)

## More resources

Want to dive deeper? Here are some additional helpful resources:

- [**Official Storybook docs**](https://storybook.js.org/docs/react/get-started/introduction) has API documentation, examples, and the addon gallery.

- [**How to actually test UIs**](https://storybook.js.org/blog/how-to-actually-test-uis/) is a summary of practical UI testing strategies from Shopify, Adobe, Twilio, and more.

- [**Discord chat**](https://discord.gg/UUt2PJb) puts you in contact with the Storybook community and maintainers.

- [**Blog**](https://medium.com/storybookjs) showcases the latest releases and features to streamline your UI development workflow.
