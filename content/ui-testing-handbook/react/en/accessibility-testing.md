---
title: 'Accessibility testing with Storybook'
tocTitle: 'Accessibility'
description: 'Fast feedback with integrated tooling'
commit: 'e77f771'
---

[26% of adults](https://www.cdc.gov/ncbddd/disabilityandhealth/infographic-disability-impacts-all.html) in the US have at least one disability. When you improve accessibility, it has an outsized impact on your current and future customers. It’s also a legal requirement.

The most accurate way to check accessibility is manually on real devices. But that requires specialized expertise and a lot of time, both of which are scarce on frontend teams.

That's why many companies now use a combination of automated and manual testing. Automation catches common accessibility issues with low effort from developers. Manual QA is reserved for trickier problems that require human attention.

There are plenty of resources that dive deep into accessibility principles, so we won't get into that here. Instead, we'll focus on how to automate accessibility testing with Storybook. It's a pragmatic approach to finding and fixing most issues you're likely to encounter.

## Why automation?

Before we begin, let’s examine common types of disabilities: visual, hearing, mobility, cognition, speech, and neurological. These user disabilities yield app requirements like:

- ⌨ Keyboard navigation
- 🗣 Screen reader support
- 👆 Touch-friendly
- 🎨 High enough colour contrast
- ⚡️ Reduced motion
- 🔍 Zoom

In the past, you’d verify each of these requirements by checking every component across a combination of browsers, devices, and screen readers. But that’s impractical to do by hand because apps have dozens of components and are constantly updating the UI.

## Automation speeds up your workflow

Automated tools audit the rendered DOM against a set of heuristics based on [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) rules and other industry-accepted best practices. They act as the first line of QA to catch blatant accessibility violations.

For example, Axe, on average, finds [57% of WCAG issues automatically](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/). That allows teams to focus their expert resources on the more complex issues that require manual review.

Many teams use the [Axe library](https://github.com/dequelabs/axe-core) because it integrates with most existing test environments. For example, the [Twilio Paste](https://github.com/twilio-labs/paste) team uses the [jest-axe integration](https://github.com/twilio-labs/paste/blob/cd0ddad508e41cb9982a693a5160f1b7866f4e2a/packages/paste-core/components/checkbox/__tests__/checkboxdisclaimer.test.tsx#L40). Whereas the Shopify Polaris & Adobe Spectrum teams use the [Storybook addon](https://storybook.js.org/addons/@storybook/addon-a11y) version.

The Storybook addon runs checks in the browser (as opposed to jsdom for Jest) and can therefore catch issues such as low contrast. However, it does require you to manually verify each story.

## Accessibility testing workflow

By running these checks throughout the development process, you shorten the feedback loop and fix issues faster. Here’s what the workflow looks like:

1.  👨🏽‍💻 **During development:** use Storybook to focus on one component at a time. Use the A11y addon to simulate vision defects and run an accessibility audit at the component level.
2.  ✅ **For QA:** integrate the Axe audit into your functional testing pipeline. Run checks on all components to catch regressions.

![](/ui-testing-handbook/a11y-workflow.png)

Let’s see this workflow in action.

### Install the accessibility addon

Storybook’s Accessibility runs Axe on the active story. It visualizes the test results in a panel and outlines all DOM nodes that have a violation.

![](/ui-testing-handbook/a11y-testing.gif)

To install the addon, run: `yarn add -D @storybook/addon-a11y`. Then, add `'@storybook/addon-a11y'` to the addons array in your `.storybook/main.js`:

```diff:title=.storybook/main.js
module.exports = {
 // ...
 addons: [
   '@storybook/addon-links',
   '@storybook/addon-essentials',
   '@storybook/preset-create-react-app',
+  '@storybook/addon-a11y',
   '@storybook/addon-interactions',
 ],
};
```

### Testing accessibility as you code

We've already [isolated](/ui-testing-handbook/react/en/visual-testing/) the Task component and captured all its use cases as stories. During the development phase, you can cycle through these stories to spot accessibility issues.

```javascript:title=src/components/Task.stories.js
import React from 'react';
import { Task } from './Task';

export default {
  component: Task,
  title: 'Task',
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
  },
};

const Template = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Buy milk',
    state: 'TASK_INBOX',
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    id: '2',
    title: 'QA dropdown',
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    id: '3',
    title: 'Write schema for account menu',
    state: 'TASK_ARCHIVED',
  },
};

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    id: '4',
    title: longTitleString,
    state: 'TASK_INBOX',
  },
};
```

![](/ui-testing-handbook/a11y-addon.png)

Notice how the addon found two violations. The first, **“Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds,”** is specific to the `archived` state. Essentially what it means is that there isn’t enough contrast between the text and the background. We can fix that by changing the text color to a slightly darker gray—from `gray.400` to `gray.600`.

```diff:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';
import {
 Checkbox,
 Flex,
 IconButton,
 Input,
 Box,
 VisuallyHidden,
} from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';

export const Task = ({
 task: { id, title, state },
 onArchiveTask,
 onTogglePinTask,
 onEditTitle,
 ...props
}) => (

 // code omitted for brevity

   <Box width="full" as="label">
     <VisuallyHidden>Edit</VisuallyHidden>
     <Input
       variant="unstyled"
       flex="1 1 auto"
-      color={state === 'TASK_ARCHIVED' ? 'gray.400' : 'gray.700'}
+      color={state === 'TASK_ARCHIVED' ? 'gray.600' : 'gray.700'}
       textDecoration={state === 'TASK_ARCHIVED' ? 'line-through' : 'none'}
       fontSize="sm"
       isTruncated
       value={title}
       onChange={(e) => onEditTitle(e.target.value, id)}
     />
   </Box>

   // code omitted for brevity
 </Flex>
);

Task.propTypes = {
 task: PropTypes.shape({
   id: PropTypes.string.isRequired,
   title: PropTypes.string.isRequired,
   state: PropTypes.string.isRequired,
 }),
 onArchiveTask: PropTypes.func.isRequired,
 onTogglePinTask: PropTypes.func.isRequired,
 onEditTitle: PropTypes.func.isRequired,
};
```

The second violation, **“Ensures `<li>` elements are used semantically,”** indicates incorrect DOM structure. The Task component renders just a `<li>` element. So we need to update its stories template to wrap the component in an `<ul>` element.

```js:title=src/components/Task.stories.js
import React from 'react';
import { Task } from './Task';

export default {
  component: Task,
  title: 'Task',
  argTypes: {
    onArchiveTask: { action: 'onArchiveTask' },
    onTogglePinTask: { action: 'onTogglePinTask' },
    onEditTitle: { action: 'onEditTitle' },
  },
};

const Template = (args) => (
  <ul>
    <Task {...args} />
  </ul>
);

// ... code omitted for brevity
```

You can now repeat this process for all other components.

Integrating accessibility testing into Storybook streamlines your development workflow. You don’t have to jump between different tools while working on a component. Everything you need is right there in the browser. You can even simulate visual impairments such as deuteranomaly, protanomaly or tritanopia.

![](/ui-testing-handbook/vision-simulator.png)

### Catch regressions automatically with the test runner

Often, changes to a component can unintentionally introduce new accessibility issues. To catch such regressions, you'll want to test all your stories before opening a pull request. However, the Accessibility addon only runs checks when you’re viewing a story. To test all stories at once we can use the Storybook test runner. It’s a standalone utility (powered by [Jest](https://jestjs.io/) and [Playwright](https://playwright.dev/)) that checks for rendering errors in stories.

Let’s go ahead and configure the test runner to run Axe. We’ll start by installing [axe-playwright](https://github.com/abhinaba-ghosh/axe-playwright).

```bash
yarn add -D axe-playwright
```

Add a new configuration file inside your Storybook directory with the following inside:

```javascript:title=.storybook/test-runner.js
const { injectAxe, checkA11y } = require('axe-playwright');

module.exports = {
 async preRender(page, context) {
   await injectAxe(page);
 },
 async postRender(page, context) {
   await checkA11y(page, '#root', {
     detailedReport: true,
     detailedReportOptions: {
       html: true,
     },
   })
 },
};
```

`preRender` and `postRender` are convenient hooks that allow you to configure the test runner to perform additional tasks. We're using those hooks to inject Axe into a story, and then once it renders, run the accessibility test.

You’ll notice a few options passed into the `checkA11y` function. We’ve set up Axe to start at the story's root element and then traverse down the DOM tree to check for issues. It will also generate a detailed report based on the issues it encountered and output a list of HTML elements that violated accessibility rules.

To run the tests, start your Storybook in one terminal window with `yarn storybook` and the test runner in another with `yarn test-storybook`.

![](/ui-testing-handbook/test-runner-ally.png)

## Catching integration issues

UIs are assembled by composing components and wiring them up to data and APIs. That's a lot of potential points of failure. Next up, we'll look at using Cypress to catch integration issues by testing all layers of your system in one go.
