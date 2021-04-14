---
title: 'Introduction to visual testing'
tocTitle: 'Introduction'
description: 'The pragmatic way to test user interfaces'
---

<div class="aside">
This handbook is made for <b>professional developers</b> learning how to implement visual testing in their workflows. Intermediate experience in JavaScript and React is recommended. You should also know Storybook basics, such as writing a story and editing config files (<a href="/intro-to-storybook">Intro to Storybook</a> teaches basics).
</div>

<br/>

Applications now have a larger surface area than ever before, and users expect frequent releases with new features. This has made automated testing essential for creating and maintaining high-quality software.

Interfaces are subjective by nature. "Does this look right?" — the answer often depends on the browser/device. You can't infer correctness from an exact sequence of HTML tags and CSS classes. Developers and designers have to verify the rendered UI — a time-consuming and manual process. Different approaches have attempted to automate this process but failed to capture the nuance without real success.

This handbook argues for a different approach. Instead of completely removing humans from the testing equation, let's use tools to augment the process. Focus their effort on the specific components in the particular states that require human attention.

Testing is integral to creating and maintaining high-quality software. Throughout the buildout process, you’ll often find developers and designers doing manual testing — _“Does this look right?”_ However, due to the often subjective nature of interface design, it’s not really possible to write an automated test to capture that “correctness”. It means that companies face a decision between time-consuming manual testing or the inevitable decline in UI quality that results from the lack of a proper testing regime.

Testing UIs is complicated because the salient details of the smallest modules of UI (components) are hard to express programmatically. When is the output of a component correct? Correctness can neither be determined by the exact sequence of HTML tags/classes nor the textual part of the output. Different approaches have attempted to hit the sweet spot for years and capture the nuance without real success.

This handbook argues for a different approach: instead of removing humans from the testing equation, let’s use tools to focus the manual tester on the exact components in the exact states that require human attention.

## Unit testing UIs

A unit test isolates a module and then verifies its behaviour by supplying inputs and comparing the output to an expected result. A vital benefit of the [component-driven](https://componentdriven.org/) approach is that we can unit test components much like functions.

What makes unit testing so desirable is that isolation makes it easier to cover all use cases thoroughly. And subsequently pinpoint the source of failures.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/unit-testing-optimized.mp4"
    type="video/mp4"/>
</video>

### The problem

The component construct allows you to render a specific variation as a function of props and state. You don't need to spin up the whole app just to see how a component renders, instead pass in props and state to view it in isolation. However, determining the output is still a challenge.

The core issue is that much of a components' inherent complexity is visual — the specifics of how generated HTML and CSS appear when it reaches the user's screen. Which historically has made it difficult to unit test UIs.

The complexity of unit testing UIs leads to a lack of UI tests, which leads to resultant regressions. It's not surprising that you often see visual bugs in loading states or when you have unusual data, even in production.

> "In a world that’s moving toward continuous deployment, we absolutely need to test our UIs effectively; a lack of tests is a problem that’s only getting worse and worse."

### Approach: Snapshot testing

One approach to solving this problem is [snapshot testing](https://reactjs.org/docs/testing-recipes.html#snapshot-testing). This is where the test framework saves the rendered HTML of a component. And each subsequent change has to be explicitly committed by the developer.

The intention was to allow us to check the changes quickly. However, these DOM snapshots are super hard to parse. You really can't discern the salient details of UI by looking at a blob of HTML 🤷🏽‍♂️

![Minified component code](/visual-testing-handbook/code-visual-testing-optimized.png)

It also suffers from the same brittleness as all other automated UI tests. Any changes to the internal workings of a component require the test to be updated, regardless of whether the component's output changed.

Luckily for us, there is a better way!

## Visual testing

A different approach to all this is to use a component explorer. It allows you to isolate components, mock their variations, and record the supported test cases. That enables developers to spot-check component appearance during initial development and again in QA.

You can run through all the variations, see how they render, and decide if they work correctly.

![Storybook toggle button](/visual-testing-handbook/storybook-toggle-stories-optimized.png)

Still, given the scale of modern applications, it's impractical to test UI appearance by hand. You'd have to check each component's variations across every breakpoint and browser whenever you tweak the UI. That's a lot of work!

Visual tests add a layer of automation to this process. They capture a screenshot of every UI component, complete with markup, styling, and other assets, in a consistent browser environment. That way, they're testing what the user actually sees.

Each commit, new screenshots are automatically compared to previously accepted baseline screenshots. When the machine detects visual differences, the developer gets notified to approve the intentional change or fix the accidental bug.

![Storybook toggle button](/visual-testing-handbook/component-visual-testing.gif)

### Writing visual test cases

Visual tests share the same setup, execute, and teardown steps as any other type of testing, but the verification step falls to the user. In Storybook, a test is as simple as rendering a React element.

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

In the upcoming chapters, we'll dive deeper into this process. We will learn how to use tools like Chromatic to capture snapshots and build a complete workflow.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/tasklist-snoozed-stories-optimized.mp4"
    type="video/mp4"/>
</video>

## Next up: learn the tools

Now that we have a sense of why to visual test components let’s check out the main tool you need to enable it: a component explorer.

In the next chapter, we’ll see how component explorers help developers build more robust and testable components.
