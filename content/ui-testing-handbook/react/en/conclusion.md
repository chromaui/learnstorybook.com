---
title: 'Conclusion'
tocTitle: 'Conclusion'
description: 'Get more done by doing less'
---

Developers spend [21% of their time](https://www.niss.org/sites/default/files/technicalreports/tr81.pdf) fixing bugs. Tests help reduce the amount of work you have to do by catching defects and speeding up debugging. But every new feature introduces more UI and states that need tests. The only way to stay productive is to implement an intuitive testing workflow.

**Start by writing test cases as stories**. You can reuse them in testing tools such as Jest, Chromatic and Axe. Studies suggest that reusing code can shave [42-81% off](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) dev time.

During development, **test while you code** to get a fast feedback loop and catch bugs before hitting production. It's [10x](https://ntrs.nasa.gov/search.jsp?R=20100036670) more expensive to fix bugs in production!

<img src="/ui-testing-handbook/component-automate-testing.gif" alt="PR checks for all types of UI testing: visual, interaction, accessibility, composition and user flows" style="max-width: 450px;" />

Finally, **use a CI server to run all your checks** across the entire UI to prevent accidental regressions. Research-backed studies from Microsoft suggest that you can see a [20.9% reduction in defects](https://collaboration.csc.ncsu.edu/laurie/Papers/Unit_testing_cameraReady.pdf) with automated testing.

When your tests pass, you’ll have confidence that your UI is bug-free.

I hope condensing these learnings into a pragmatic workflow helps you implement a solid testing strategy of your own. Let this be your starting point.

## Sample code for this tutorial

If you've been coding along, your repository and deployed Storybook should look like this:

- 📕 [GitHub repository](https://github.com/chromaui/ui-testing-guide-code/tree/Storybook-7-0)
- 🌎 [Deployed Storybook](https://storybook-7-0--60876bbe754b7b0021704b3d.chromatic.com/)

## More resources

Want more? Here are some additional helpful resources:

- [**Visual Testing Handbook**](/visual-testing-handbook/) is an in-depth guide to testing UI appearance—with learnings from leading engineering teams like BBC, Adobe, Target and more.
- [**How to test UIs with Storybook**](https://storybook.js.org/docs/writing-tests) details how you can use Storybook for UI testing.
- [**Discord chat**](https://discord.gg/UUt2PJb) puts you in contact with the Storybook community and maintainers.
- [**Blog**](https://storybook.js.org/blog/) showcases the latest releases and features to streamline your UI development workflow.

Thanks for learning with us. Subscribe to the Storybook mailing list to get notified when helpful articles and guides like this are published.

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>
