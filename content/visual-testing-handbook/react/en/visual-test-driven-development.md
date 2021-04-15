---
title: 'Visual test-driven development'
description: 'A straightforward workflow for building components'
---

Developing user interfaces has always been a bit of an art. In the past, the visual and subjective nature of the medium usually led to ad-hoc and ill-defined development processes. The lack of a unified approach makes it hard for developers to build genuinely excellent UIs quickly.

Throughout this chapter, we’ll see how combining visual testing, and component explorers unlock the ability to build modular and extensible UIs in a rigorous test-driven fashion.

## How does it work?

**Visual TDD** applies the test-driven development process to UI components. It relies on supporting tools that enable a TDD-style workflow to make a once cumbersome a dead simple process.

![Visual testing driven path](/visual-testing-handbook/visual-testing-handbook-vtdd-path-optimized.png)

## Test-Driven Development

One of the crucial advantages of modularization is **test-driven development (TDD)**, the process of:

1. Constructing a set of automated tests for your code
2. Writing the code itself to “turn the tests green”

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/red-green-vtdd-optimized.mp4"
    type="video/mp4">
</video>

TDD allows you to think clearly about what your code needs to do in terms of concrete inputs (for components, we refer to these as “states”) and makes it easy to cover all use cases of your module. For more on this subject, check out [James Shore’s post](http://www.jamesshore.com/v2/books/aoad1/test_driven_development).

Let's look at an example, `relativize` function that converts a raw date object to the relative date format of the form "2 weeks ago". It's pretty straightforward to outline all the various types of input you want to cover. And then, just hit the "test" button each time you think you've made progress toward a solution.

Your test framework allows you to run the `relativize` function in isolation without needing to provide input for your entire application just to test that one part.

However, TDD wavers when it’s hard to define unit tests ahead of time when your module is hard to isolate, and your outputs are hard to predict ahead of time. It's the perfect case for UIs without visual testing.

## Visual TDD

If you are building an app from a well-thought-out design, the chances are that there are a set of well-specified components with inputs and outputs embedded in the design artifact. Pair this “design spec” with the visual testing process, and you can run an exact analogy to pure TDD:

- ✍🏽 **Build out the test cases.** Specify a set of inputs to the component that cover these use cases. It can often lead you to think about scenarios that you wouldn’t consider if you developed it in a more ad-hoc way.
- 🔍 **Implement and verify.** As you progress towards the solution, you can quickly and easily verify each state in the component explorer.
- 📁 **Capture snapshots.** The set of specs survive the development process will form the basis of the regression tests.
- 🔄 Iterate

### Writing visual test cases

Visual tests share the same setup, execute, and teardown steps as any other type of testing, but the verification step falls to the user. In Storybook, a test is as simple as rendering a React element.

To write a visual test, we outline the state of the component we are interested in. In Storybook, we might write:

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

Then we can view the Task in the explorer.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/task-stories-snoozed-optimized.mp4"
    type="video/mp4"/>
</video>

What we have produced above corresponds to the _“execute”_ phase of a test cycle; the _“verify”_ phase we do by eye.

For UI testing, manually verifying is sometimes the best approach as it is robust to changes in the component that don’t affect the visual appearance. Additionally, because we only need to write our inputs ahead of time and visually check the output, we’re automatically building UIs in a TDD style.

## Next up: learn by doing

Whether or not you follow a rigorous TDD process or enjoy (finally!) writing visual tests for your components as you build them, once you try a component explorer and start building components in isolation, you’ll see the benefits almost immediately.

Let's apply what we’ve learned so far by building an example component using Visual TDD.
