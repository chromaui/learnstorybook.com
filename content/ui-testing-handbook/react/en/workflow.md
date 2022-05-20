---
title: 'UI Testing Playbook'
tocTitle: 'Workflow'
description: 'A testing workflow that doesn’t slow you down'
commit: '81c0264'
---

It's easy to find tools that test different parts of the UI. But knowing how to combine them into a productive workflow is tricky. If you get it wrong, it spirals into a maintenance nightmare.

Our workflow reduces the maintenance burden by reusing stories as test cases. Plus, we can spot bugs faster by testing at the component level.

This chapter demonstrates the entire UI testing workflow by adding in the ability to delete a task.

![](/ui-testing-handbook/workflow-ui-testing.png)

## Build

The Task component already allows users to edit, pin and archive a task. We'll add a delete button and wire that up to the application state to add the delete functionality.

![](/ui-testing-handbook/add-delete-button.png)

For this demo, let's jump straight to the point where you're ready to test. Download the updated files and place them in the `/src` directory:

- [src/components/Task.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/81c0264/src/components/Task.js)
- [src/components/TaskList.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/81c0264/src/components/TaskList.js)
- [src/InboxScreen.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/81c0264/src/InboxScreen.js)
- [src/useTasks.js](https://raw.githubusercontent.com/chromaui/ui-testing-guide-code/81c0264/src/useTasks.js)

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

To catch regressions you need to run on all your components. You can do that by importing stories into a test file and then running an accessibility audit using [jest-axe](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40). All violations will be reported back to the PR page.

![](/ui-testing-handbook/ci-a11y.png)

### Interaction tests

The user can delete a task by clicking on the _trash can_ button, we’ll need to add in a test to verify that behaviour.

![](/ui-testing-handbook/manual-interaction.gif)

#### During development

During development, manually verify the interaction using the InboxScreen stories. If it’s working as expected, you can add in an interaction test using a play function.

```javascript:title=src/InboxScreen.stories.js
// ... code omitted for brevity ...

export const DeleteTask = Template.bind({});
DeleteTask.parameters = { ...Default.parameters };
DeleteTask.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const getTask = (name) => canvas.findByRole('listitem', { name });

  const itemToDelete = await getTask('Build a date picker');
  const deleteButton = await findByRole(itemToDelete, 'button', {
    name: 'delete',
  });
  await userEvent.click(deleteButton);

  await expect(canvas.getAllByRole('listitem').length).toBe(5);
};
```

Run `yarn run test-storybook` to confirm that all tests are passing. Notice how Jest runs in watch mode and only executes tests related to files that changed.

![](/ui-testing-handbook/test-runner-delete.png)

#### PR check

Github Actions will run the test runner when the pull request is created and report status via PR checks.

![](/ui-testing-handbook/test-runner-ci.png)

## User flow tests

Lastly, you'll need to run E2E tests to ensure that all your critical user flows are working as expected.

#### During development

This new functionality doesn't impact the auth flow. Therefore, you can wait to run Cypress on the CI server. You only need to run targeted E2E tests during development if you add or update a test.

![](/ui-testing-handbook/auth-flow.png)

#### PR check

Just like all your other tests, Github actions will also run E2E tests using Cypress.

![](/ui-testing-handbook/user-flow-ci.png)

## Your journey begins

**UI Testing handbook** highlights testing strategies used by professional front-end teams. These tests act as health checks for your app, verify everything from visual appearance to UI logic, and even detect integration issues. What's more, you can reduce bugs by using continuous integration to test each commit automatically.

The final chapter concludes with the complete sample code, helpful resources, and frequently asked questions from developers.
