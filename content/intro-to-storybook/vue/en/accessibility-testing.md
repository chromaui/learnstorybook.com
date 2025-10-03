---
title: 'Accessibility tests'
tocTitle: 'Accessibility Testing'
description: 'Learn how to integrate accessibility tests into your workflow'
---

So far, we've been focused on building our UI components with a strong emphasis on functionality and visual testing, adding complexity as we go. But we've not yet addressed an important aspect of UI development: accessibility.

## Why Accessibility (A11y)?

Accessibility ensures that all users can interact effectively with our components regardless of their abilities. This includes users with visual, auditory, motor, or cognitive impairments. Accessibility is not only the right thing to do, but it's increasingly mandated based on legal requirements and industry standards. Given these requirements, we must test our components for accessibility issues early and often.

## Catch accessibility issues with Storybook

Storybook provides an [Accessibility addon](https://storybook.js.org/addons/@storybook/addon-a11y) (A11y) that helps you test the accessibility of your components. Built on top of [axe-core](https://github.com/dequelabs/axe-core), it can catch up to [57% of WCAG issues](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Let's see how it works! Run the following command to install the addon:

```shell
yarn exec storybook add @storybook/addon-a11y
```

<div class="aside">

💡 Storybook's `add` command automates the addon's installation and configuration. See the [official documentation](https://storybook.js.org/docs/api/cli-options) to learn more about the other available commands.

</div>

Restart your Storybook to see the new addon enabled in the UI.

![Task accessibility issue in Storybook](/intro-to-storybook/accessibility-issue-task-non-react-9-0.png)

Cycling through our stories, we can see that the addon found an accessibility issue with one of our test states. The [**Color contrast**](https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI) violation essentially means there isn't enough contrast between the task title and the background. We can quickly fix it by changing the text color to a darker gray in our application's CSS (located in `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
 text-decoration: line-through;
}
```

That's it. We've taken the first step to ensure our UI remains accessible. However, our job isn't finished yet. Maintaining an accessible UI is an ongoing process, and we should monitor our UI for any new accessibility issues to prevent regressions from being introduced as our app evolves and our UIs gain complexity.

## Accessibility tests with Chromatic

With Storybook's accessibility addon, we can test and get instant feedback on accessibility issues during development. However, keeping track of accessibility issues can be challenging, and prioritizing which issues to address first may require a dedicated effort. This is where Chromatic can help us. As we've already seen, it helped us [visually test](/intro-to-storybook/vue/en/test/) our components to prevent regressions. We'll use its [accessibility testing feature](https://www.chromatic.com/docs/accessibility) to ensure our UI remains accessible and we don't accidentally introduce new violations.

### Enable accessibility tests

Go to your Chromatic project and navigate to the **Manage** page. Click the **Enable** button to activate accessibility tests for your project.

![Chromatic accessibility tests enabled](/intro-to-storybook/chromatic-a11y-tests-enabled.png)

### Run accessibility tests

Now that we've enabled accessibility testing and fixed the color contrast issue in our CSS, let's push our changes to trigger a new Chromatic build.

```shell:clipboard=false
git add .
git commit -m "Fix color contrast accessibility violation"
git push
```

When Chromatic runs, it establishes the [accessibility baselines](https://www.chromatic.com/docs/accessibility/#what-is-an-accessibility-baseline) as the starting point against which future tests will compare their results. This allows us to prioritize, address, and fix accessibility issues more effectively without introducing new regressions.

<!--

TODO: Follow up with Design for an updated asset
 - Needs a React and non-React version to ensure parity with the tutorial
 -->

![Chromatic build with accessibility tests](/intro-to-storybook/chromatic-build-a11y-tests-non-react.png)

We've now successfully built a workflow that ensures our UI remains accessible at each stage of development. Storybook will help us catch accessibility issues during development, while Chromatic keeps track of accessibility regressions, making it easier to fix them incrementally over time.
