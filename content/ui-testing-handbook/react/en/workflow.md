---
title: 'UI Testing Playbook'
tocTitle: 'Workflow'
description: 'A testing workflow that doesn’t slow you down'
commit: '83c4adf'
---

We've covered different aspects of UI that need testing and which tools work best—that's the easy part. But knowing how to combine them into a productive workflow is tricky. If you get it wrong, the UI development process feels like a slog. Your tests break whenever there's an implementation tweak. You have to duplicate test cases for every tool, and it all spirals into a maintenance nightmare.

I interviewed ten teams from companies like Twilio, Adobe, Peloton and Shopify to see how they balanced UI testing effort and value. Despite differences in team size and tech stack, folks had similar tactics. This chapter combines those learnings into the pragmatic workflow described below.

1.  📚 **Isolate components using** [**Storybook**](http://storybook.js.org/). Write test cases where each state is reproduced using props and mock data.
2.  ✅ **Catch visual bugs and verify composition** using [Chromatic](https://www.chromatic.com/).
3.  **🐙 Verify interactions** with [Jest](https://jestjs.io/) and [Testing Library](https://testing-library.com/).
4.  ♿️ **Audit accessibility** of your components using [Axe](https://www.deque.com/axe/).
5.  🔄 **Verify user flows** by writing end-to-end tests with [Cypress](https://www.cypress.io/).
6.  🚥 **Catch regressions** by automatically running tests with [GitHub Actions](https://github.com/features/actions).

## What works

It should be seamless to build and test UI components. That comes down to two considerations: reducing maintenance burden while adding flexibility in how you run tests.

### Test at the component level to find bugs faster

The teams I surveyed also shared that they mostly run tests at the component level. Components allow you to break up the interface into isolated chunks. Testing in isolation makes it easier to pinpoint bugs.

### Reuse stories to reduce maintenance

Each type of test uses different tools. This means you're often replicating the same component state over and over. That's a headache to set up and maintain. Storybook enables you to isolate a component and capture all test cases in a `*.stories.js` file. You can then [import them](https://storybook.js.org/blog/stories-are-tests/) into tools such as Jest and Cypress. The end result, you only have to write your test cases once.

### Test while you code for a faster feedback loop

During development, you're focused on a handful of components related to the feature you're working on. Therefore, you'll want to run targeted tests on just those components.

### Run all checks before you merge

When you're getting ready to merge, you'll want to check for regression bugs. That means running your entire test suite automatically using a CI server.

![](/ui-testing-handbook/ui-testing-workflow.png)

## UI Testing workflow in practice

To demonstrate this process, let's add in the ability to delete a task and step through the entire testing workflow.

![](/ui-testing-handbook/add-delete-button.png)

For this demo, let's jump straight to the point where you're ready to test. Download the updated files and place them in the `/src` directory:

- [src/components/Task.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/components/Task.js)
- [src/components/TaskList.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/components/TaskList.js)
- [src/InboxScreen.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/InboxScreen.js)
- [src/useTasks.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/83c4adfc1f4ccee57278f8cfce539af1c1aa2463/src/useTasks.js)

### Visual & Composition tests

First, we're going to ensure that the updated UI styles match the spec. The Task component now requires the `onDeleteTask` prop to handle deletions. Let's mock that out as an action in the Task stories.

```diff:title=src/components/Task.stories.js
import React from 'react';
import { Task } from './Task';
export default {
  component: Task,
  title: 'Task',
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
+   onDeleteTask: { action: 'onDeleteTask' },
  },
  parameters: {
    a11y: {
 ...
```

#### During development

Instead of booting up the entire application, you can use Storybook to focus on just the Task component. Then cycle through all its stories to manually verify their appearance.

![](/ui-testing-handbook/task-stories.gif)

#### PR check

Tweaks to the Task UI can lead to unintended changes in other components where it's used: TaskList and InboxScreen. Running visual tests with Chromatic will catch those. It'll also ensure that everything is still wired up correctly.

Chromatic will be triggered automatically when you create a pull request. On completion, you'll be presented with a diff to review. In this case, the changes are intentional. Press the accept button to update the baselines.

![](/ui-testing-handbook/workflow-visual-tests.png)

![](/ui-testing-handbook/workflow-visual-diff.png)

### Accessibility tests

![](/ui-testing-handbook/task-a11y.gif)

#### During development

Run accessibility checks inside Storybook during development. The [A11y addon](https://storybook.js.org/addons/@storybook/addon-a11y) uses Axe to audit the active story and displays the report in the addon panel. A quick glance confirms that none of our stories have any violations.

#### PR check

To catch regressions you need to run on all your components. You can do that by importing stories into a Jest and then running an accessibility audit using [jest-axe](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40). All violations will be reported back to the PR page.

![](/ui-testing-handbook/ci-a11y.png)

### Interaction tests

The user can delete a task by clicking on the _trash can_ button, we’ll need to add in a test to verify that behaviour.

![](/ui-testing-handbook/manual-interaction.gif)

#### During development

During development, manually verify the interaction using the InboxScreen stories. If it’s working as expected, you can move on to adding in an interaction test using Jest and Testing Library.

```diff:title=src/InboxScreen.test.js
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  render,
  waitFor,
  cleanup,
  within,
  fireEvent,
} from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { composeStories } from '@storybook/testing-react';
import { getWorker } from 'msw-storybook-addon';
import * as stories from './InboxScreen.stories';

expect.extend(toHaveNoViolations);

describe('InboxScreen', () => {
  afterEach(() => {
    cleanup();
  });

  afterAll(() => getWorker().close());

  const { Default } = composeStories(stories);

  it('should pin a task', async () => { ... });
  it('should archive a task', async () => { ... });
  it('should edit a task', async () => { ... });
  it('Should have no accessibility violations', async () => { ... });

+ it('should delete a task', async () => {
+   const { queryByText, getByRole, getAllByRole } = render(<Default />);
+
+   await waitFor(() => {
+     expect(queryByText('You have no tasks')).not.toBeInTheDocument();
+   });
+
+   const getTask = () => getByRole('listitem', { name: 'Export logo' });
+
+   const deleteButton = within(getTask()).getByRole('button', {
+     name: 'delete',
+   });
+
+   fireEvent.click(deleteButton);
+
+   expect(getAllByRole('listitem').length).toBe(5);
+ });
});

```

Run `yarn test` to confirm that all tests are passing. Notice how Jest runs in watch mode and only executes tests related to files that changed.

![](/ui-testing-handbook/jest.png)

#### PR check

Github Actions will run Jest when the pull request is created and report status via PR checks.

![](/ui-testing-handbook/jest-ci.png)

## User flow tests

Lastly, you'll need to run E2E tests to ensure that all your critical user flows are working as expected.

#### During development

You can run targeted E2E tests during development but, that requires you to spin up the complete instance of your application and a test browser. It can all get quite resource-heavy. Therefore, you can wait to run Cypress on the CI server unless you're updating a test.

![](/ui-testing-handbook/auth-flow.png)

#### PR check

Just like all your other tests, Github actions will also run E2E tests using Cypress.

![](/ui-testing-handbook/user-flow-ci.png)
