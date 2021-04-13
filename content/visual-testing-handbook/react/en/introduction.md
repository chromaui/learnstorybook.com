---
title: 'Introduction to visual testing'
tocTitle: 'Introduction'
description: 'The pragmatic way to test user interfaces'
---

<div class="aside">
This handbook is made for <b>professional developers</b> learning how to implement visual testing in their workflows. Intermediate experience in JavaScript and React is recommended. You should also know Storybook basics, such as writing a story and editing config files (<a href="/intro-to-storybook">Intro to Storybook</a> teaches basics).
</div>

<br/>

Testing is integral to creating and maintaining high-quality software. Throughout the buildout process, you’ll often find developers and designers doing manual testing — _“Does this look right?”_ However, due to the often subjective nature of interface design, it’s not really possible to write an automated test to capture that “correctness”. It means that companies face a decision between time-consuming manual testing or the inevitable decline in UI quality that results from the lack of a proper testing regime.

Testing UIs is complicated because the salient details of the smallest modules of UI (components) are hard to express programmatically. When is the output of a component correct? Correctness can neither be determined by the exact sequence of HTML tags/classes nor the textual part of the output. Different approaches have attempted to hit the sweet spot for years and capture the nuance without real success.

This handbook argues for a different approach: instead of removing humans from the testing equation, let’s use tools to focus the manual tester on the exact components in the exact states that require human attention.

## Unit testing UIs

To grasp visual testing, let’s first take a look at unit testing. Componentization of UIs is all the rage these days, but that’s just a fancy way of saying the code is more modular. A key benefit of modular code is the ability to unit test it.

A unit test isolates a module and then verifies its behavior over a set of inputs by comparing the module’s output on each input to an expected result. The reason unit testing is so desirable is that when testing a module in isolation (rather than the system as a whole), it is easier to thoroughly cover all of its use cases and subsequently to identify where issues are located when they occur.

<video autoPlay muted playsInline loop>
  <source 
    src="/visual-testing-handbook/unit-testing-optimized.mp4"
    type="video/mp4"/>
</video>

### The problem

For a unit of user interface (a component), we can specify the input — in React, that would be the component instance’s props and context — in a straightforward fashion. Still, it is harder to determine the output in a sensible way that is robust to minor changes in the component’s implementation.

There are great tools (such as [Enzyme](https://enzymejs.github.io/enzyme/)) to render a single component in a single state and programmatically inspect the resulting DOM. However, in most cases, the salient details of the generated HTML are not easy to express, and the tests end up brittle (over-specified) or insufficient (under-specified).

![Minified component code](/visual-testing-handbook/code-visual-testing-optimized.png)

In some cases, it makes sense to write a typical unit test: if I render a `RelativeDate` component that should display “two weeks ago” for a given date, I can pass in a well-chosen date and inspect the text of the resultant HTML.

Even in such testable cases as this, there’s a solid argument to be made that the date formatting functionality should be factored out into a simple library, which can then be tested directly without the complexity of rendering HTML and inspecting the DOM for the result.

The core issue is that a large portion of components’ inherent complexity is visual — the specifics of how generated HTML and CSS appears when it reaches the user’s screen. Historically it has never been easy to write a test for such a case.

The difficulty in unit testing UIs unsurprisingly leads to a lack of UI tests, which lead to resultant regressions as UIs evolve, and various states of the system are forgotten about.

It’s not surprising that you often see visual bugs in loading states or when you have unusual data, even in production systems, as it’s troublesome to manually test everything when deploying a new version of a UI.

> "In a world that’s moving toward continuous deployment, we absolutely need to test our UIs effectively; a lack of tests is a problem that’s only getting worse and worse."

### Approach: Snapshot testing

One approach to solving this problem comes in the form of a “snapshot test”. This approach complements UI unit tests by acknowledging that often UI outputs are difficult to specify in code; instead, we focus on ensuring we are informed about all the parts of the UI that have changed for a given set of code changes. Snapshot testing frameworks like [Jest](https://jestjs.io/) compare the rendered HTML output of components.

<div class="aside">
Todo: missing image (page 7) Comparing rendered HTML (Jest snapshot)
</div>

Hopefully, this approach allows us to quickly check if the changes are intended — although it’s not always easy to tell whether UI changes from an HTML diff with high accuracy; perhaps there’s a better way? There is 🎉 !

## Visual testing

Snapshot testing is helpful but ultimately suffers from the same brittleness as all other automated UI tests. They must be constantly updated as minor details (that may not ultimately matter to the user) trigger the test to fail. Eventually, **a developer must check a failing test to confirm if it is a false positive**.

> "Snapshot testing entails an admission of defeat in capturing the essential details of a component: instead, we capture them all."

**There is another way**. A different approach to all this is to use a component explorer. A component explorer is a tool that allows you to work with a single component from your app in isolation. Rather than building a component “on-site” of the app screen where it is first used, you use a tool that isolates the component. The idea is that you define test states and use the explorer to choose a state of a component to see on the screen.

![Storybook toggle button](/visual-testing-handbook/storybook-toggle-stories-optimized.png)

It means that you (a human) can quickly and easily “run” a manual test of a component, see how it renders, and decide if it works properly.

It may sound laborious, but typically it ends up being easier than sifting through false positives from automated tests, updating test cases to match up with minor UI changes, and working overtime to make tests pass again. Suppose you are careful to visual test regularly. In that case, it’s certainly a world better than having patchy or non-existent UI tests and dealing with regular regressions hitting production!

### Writing visual tests

Visual tests share the same setup, execute, and teardown steps as any other type of testing, but the verification step falls to the user. In Storybook, a test is as simple as rendering a React element:

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';

export default {
  component: TaskList,
  title: 'TaskList',
};

const Template = args => <TaskList {...args} />;

export const Inbox = Template.bind({});
Inbox.args = {
  tasks: [
    {
      id: '1',
      boardName: 'on Chromatic/Taskbox',
      title: 'Add Asana integration',
      state: 'TASK_INBOX',
      updatedAt: new Date(2021, 0, 1, 9, 0),
    },
    {
      id: '2',
      boardName: 'on Test Board',
      title: 'Write commodity components post',
      state: 'TASK_INBOX',
      updatedAt: new Date(2021, 0, 1, 9, 0),
    },
    {
      id: '33',
      title: 'Pay electric bill',
      state: 'TASK_INBOX',
      updatedAt: new Date(2021, 0, 1, 9, 0),
    },
  ],
};
```

To test `TaskList` in the "inbox" state, we browse to the relevant part of Storybook to see it in isolation on our screen. We verify that it looks and behaves OK and move on.

<video autoPlay muted playsInline loop>
  <source 
    src="/visual-testing-handbook/tasklist-snoozed-stories-optimized.mp4"
    type="video/mp4"/>
</video>

## Next up: learn the tools

Now that we have a sense of why to visual test components let’s check out the main tool you need to enable it: a component explorer.

In the next chapter, we’ll see how component explorers help developers build more robust and testable components.
