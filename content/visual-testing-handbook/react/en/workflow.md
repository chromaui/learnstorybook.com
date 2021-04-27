---
title: 'Workflow'
description: 'A test-driven workflow for building components'
---

Developing user interfaces has always been part art and part science. The subjective nature of UI often led to ad-hoc development workflows. The lack of a unified approach meant that it was tricky for developers to build durable UIs quickly.

This chapter shows you how to build UIs in a rigorous, visual test-driven fashion.

## Test-driven development

Before we begin, let's recap **[test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)**, a popular engineering practice. The core idea behind TDD is that you write your tests first then develop the functionality under test.

1. Construct a set of automated unit tests for your code
2. Write the code itself to “turn the tests green”

TDD allows you to think clearly about what your code needs to do in terms of concrete inputs (for components, we refer to these as “states”). That way you can cover all use cases of your module.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/test-driven-development.mp4"
    type="video/mp4">
</video>

Let's look at an example. Assume we have a `relativize` function that converts a raw date object to the relative date format of the form "2 weeks ago". It's pretty straightforward to outline all the various types of input you want to cover. And then, just hit the "test" button each time you think you've made progress toward a solution.

Your test framework allows you to run the `relativize` function in isolation without needing to provide input for your entire application just to test that one part.

However, TDD falls down when developing UIs because it's hard to define tests ahead of time, modules are hard to isolate, and the outputs are subjective. These shortcomings are solved by visual testing components in isolation.

## Visual testing

The tricky part of UI testing is that it’s not possible to express the relevant visual details through verification code. Visual testing bypasses this by involving a human’s judgement in a quick and focused fashion.

#### How to write visual test cases

In practice, visual testing uses Storybook to “visually” test a component across a set of defined test states. Visual tests share the same setup, execute, and teardown steps as any other type of testing, but the verification step falls to the user.

```
test do
  setup
  execute 👈 Storybook renders stories
  verify 👈 you look at stories
  teardown
end
```

In Storybook, a test is as simple as rendering a React element. To write a visual test case, a "story" in Storybook parlance, we'll outline the states of the component we're interested in.

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const InboxTask = Template.bind({});
InboxTask.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
    boardName: 'on Test Board',
  },
};

export const SnoozedTask = Template.bind({});
SnoozedTask.args = {
  task: {
    // Shaping the stories through args composition.
    ...InboxTask.args.task,
    state: 'TASK_SNOOZED',
  },
};

export const PinnedTask = Template.bind({});
PinnedTask.args = {
  task: {
    // Shaping the stories through args composition.
    ...InboxTask.args.task,
    state: 'TASK_PINNED',
  },
};
```

Then we can view the Task in Storybook.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/task-stories-snoozed-optimized.mp4"
    type="video/mp4"/>
</video>

What we have produced above corresponds to the _“execute”_ phase of a test cycle; the _“verify”_ phase we do by eye.

For testing UI, human verification is a pragmatic approach because it's robust to code changes in the component that don’t affect the visual appearance. Additionally, because we only need to write our inputs ahead of time and visually check the output, we’re automatically building UIs in a TDD style.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/visual-test-driven-development.mp4"
    type="video/mp4">
</video>

## Learn visual test-driven development

If you are building an app from a well-thought-out design, the chances are that there are a set of well-specified components with inputs and outputs embedded in the design artifact. Pair this “design spec” with the visual testing process, and you can run an exact analogy to TDD:

- ✍🏽 **Build out the test cases.** Specify a set of inputs to the component that cover these use cases. It can often lead you to think about scenarios that you wouldn’t consider if you developed it in an ad-hoc way.
- 🔍 **Implement and verify.** As you progress towards the solution, you can quickly and easily verify each state in Storybook.
- 📁 **Capture image snapshots.** The set of specs that survive the development process will form the basis of the regression tests.
- 🔄 **Iterate**

In the next chapter, we'll apply what we learned so far by coding an example component using Visual TDD.
