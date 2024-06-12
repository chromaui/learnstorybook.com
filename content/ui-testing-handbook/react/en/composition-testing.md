---
title: 'Testing composite components'
tocTitle: 'Composition'
description: 'Prevent minor changes from turning into major regressions'
commit: '9c49e13'
---

In Jan 2021, [Tesla recalled 158,000 cars](https://www.theverge.com/2021/1/13/22229854/tesla-recall-model-s-x-touchscreens-bricked-failure-nhtsa) because one module—the display—malfunctioned. With a broken display console, you can’t access the backup camera, turn signals, or driver assistance. That significantly increases the risk of a crash.

> One defective module escalated into a major failure.

UIs suffer from a similar challenge because apps, much like cars, are an interconnected network of parts. A bug in one component affects all others around it. Not to mention every part of the app where it’s used. Testing how UI components are composed helps you to prevent such bugs.

Testing the more complex parts of the UI is tricky. They are created by combining many simpler components and are also wired up to the application state. In this chapter, we'll look at how to isolate and apply visual testing to composite components. Along the way, you'll learn about mocking data and simulating application logic. And ways to test component integration.

## Small bugs end up breaking apps

Applications are built by plugging components into each other. This means a bug in one element can impact its neighbours. For example, renaming a prop can disrupt data flow from parent to child components. Or incorrect CSS in a UI element often leads to broken layouts.

![minor tweaks cause major regressions](/ui-testing-handbook/minor-major-regressions-1.gif)

Consider the Button component from [Storybook’s design system](https://5ccbc373887ca40020446347-idzavsdems.chromatic.com/?path=/story/button--basic). It is used countless times across multiple pages. A bug in `Button` will inadvertently lead to bugs in all those pages. In other words, one failure can compound exponentially. As you move up the component hierarchy towards the level of pages, the impact of these bugs increases. Therefore, we need a way to catch such cascading issues early and figure out the root cause.

![The same button component is being used across multiple pages of an app](/ui-testing-handbook/design-system-inconsistent-buttons.jpg)

## Composition testing

Visual tests catch bugs by capturing and comparing image snapshots of stories—in a real browser. Which makes them ideal for spotting UI changes and identifying the root cause. Here’s a quick reminder of the process:

1. 🏷 **Isolate** components. Use Storybook to test one component at a time.
2. ✍🏽 Write out the **test cases**. Each component state is reproduced using props.
3. 🔍 **Manually verify** the appearance of each test case.
4. 📸 Catch **bugs** automatically using visual regression tests.

Composition testing is all about running visual tests on “composite” components higher up in the tree that are made up of several simpler components. That way you can quantify the impact that any change might have on the entire application. And ensure that the system works as a whole.

The key difference is that composite components track application state and pass behaviors down the tree. You’ll have to account for those when writing the test cases.

Let’s see this process in action by writing tests for the `TaskList` component, which displays the complete list of tasks belonging to the user.

It moves pinned tasks to the top of the list. And has a loading and empty state. We’ll start by writing stories for all these scenarios.

![Task list has four states: Default, Empty, Loading and Pinned](/ui-testing-handbook/task-list.png)

Create a story file, registering the `TaskList` component and add in a story for the default case.

```javascript:title=src/components/TaskList.stories.jsx
import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  argTypes: {
    ...TaskStories.argTypes,
  },
};

export const Default = {
  args: {
    tasks: [
      { id: '1', state: 'TASK_INBOX', title: 'Build a date picker' },
      { id: '2', state: 'TASK_INBOX', title: 'QA dropdown' },
      {
        id: '3',
        state: 'TASK_INBOX',
        title: 'Write a schema for account avatar component',
      },
      { id: '4', state: 'TASK_INBOX', title: 'Export logo' },
      { id: '5', state: 'TASK_INBOX', title: 'Fix bug in input error state' },
      {
        id: '6',
        state: 'TASK_INBOX',
        title: 'Draft monthly blog to customers',
      },
    ],
  },
};
```

Notice the `argTypes`. [Args](https://storybook.js.org/docs/writing-stories/args) are Storybook's mechanism for defining inputs to a story. Think of them as framework-agnostic props. Args defined at the component level are automatically passed down to each story. In our case, we have defined three event handlers using the [Actions addon](https://storybook.js.org/docs/essentials/actions).

These simulated actions will show up in the addons panel as you interact with `TaskList`. Allowing you to verify that the components are wired correctly.

<video autoPlay muted playsInline loop>
  <source
    src="/ui-testing-handbook/tasklist-actions-7-0.mp4"
    type="video/mp4"
  />
</video>

### Composing args

The same way you combine components to create new UIs, you can combine args to create new stories. It’s typical that the args of a composite component will even combine args from its sub-components.

The event handler args are already defined in the Task stories file, which we can reuse. Similarly, we can also use args from the default story to create the pinned tasks story.

```javascript:title=src/components/TaskList.stories.jsx
import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  argTypes: {
    ...TaskStories.argTypes,
  },
};

export const Default = {
  args: {
    tasks: [
      { id: '1', state: 'TASK_INBOX', title: 'Build a date picker' },
      { id: '2', state: 'TASK_INBOX', title: 'QA dropdown' },
      {
        id: '3',
        state: 'TASK_INBOX',
        title: 'Write a schema for account avatar component',
      },
      { id: '4', state: 'TASK_INBOX', title: 'Export logo' },
      { id: '5', state: 'TASK_INBOX', title: 'Fix bug in input error state' },
      {
        id: '6',
        state: 'TASK_INBOX',
        title: 'Draft monthly blog to customers',
      },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    tasks: [
      {
        id: '6',
        title: 'Draft monthly blog to customers',
        state: 'TASK_PINNED',
      },
      ...Default.args.tasks.slice(0, 5),
    ],
  },
};
export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};
export const Empty = {
  args: {
    ...Loading.args,
    loading: false,
  },
};
```

Shaping stories through args composition is a powerful technique. It allows us to write stories without repeating the same data over and over again. And more importantly, it tests component integration. If you rename one of the `Task` component props, that'll lead to failed test cases for `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/ui-testing-handbook/tasklist-stories-finished-7-0.mp4"
    type="video/mp4"
  />
</video>

So far, we’ve only dealt with components that accept data and callbacks via props. Things get trickier when your component is wired up to an API or has internal state. Next, we'll look at how to isolate and test such connected components.

### Stateful composite components

The `InboxScreen` uses a [custom hook](https://github.com/chromaui/ui-testing-handbook-react-template/blob/master/src/useTasks.js) to fetch data from the Taskbox API and to manage application state. Much like unit tests, we want to detach components from the real backend and test the features in isolation.

![](/ui-testing-handbook/taskbox.png)

That’s where Storybook addons come in. They allow you to mock API requests, state, context, providers and anything else that your component relies on. Teams at [The Guardian](https://5dfcbf3012392c0020e7140b-borimwnbdl.chromatic.com/?path=/story/layouts-showcase--article-story) and [Sidewalk Labs](https://www.sidewalklabs.com/) (Google) use them to build entire pages in isolation.

For the InboxScreen, we are going to use [Mock Service Worker (MSW) addon](https://storybook.js.org/addons/msw-storybook-addon/) to intercept requests at the network level and return mocked responses.

This is already provided in the template transferred in the [introduction chapter](/ui-testing-handbook/react/en/introduction/). We'll need to set it up. Let's see how.

Run the following command to generate a new service worker in your `public` folder.

```shell
yarn init-msw
```

<div class="aside">

💡 Public directory may differ depending on the project. For custom configurations, we recommend reading MSW's [documentation](https://mswjs.io/docs/getting-started/integrate/browser#where-is-my-public-directory) to learn more about them. To see the changes reflected in Storybook, you'll need to update the [`staticDirs`](https://storybook.js.org/docs/configure/images-and-assets#serving-static-files-via-storybook-configuration) configuration element in `.storybook/main.js`.

</div>

Enable the MSW addon in your `.storybook/preview.js` file:

```diff:title=.storybook/preview.js
import '../src/index.css';

+ import { initialize, mswLoader } from 'msw-storybook-addon';

+ // Initialize MSW
+ initialize();

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
+ loaders: [mswLoader],
};

export default preview;
```

Lastly, restart the `yarn storybook` command. And we’re all set to mock API requests in stories.

`InboxScreen` calls the `useTasks` hook which in-turn fetches data from the `/tasks` endpoint. We can specify the mock responses using the `msw` parameter. Notice how you can return different responses for each story.

```javascript:title=src/InboxScreen.stories.jsx
import { http, HttpResponse } from 'msw';

import InboxScreen from './InboxScreen';

import { Default as TaskListDefault } from './components/TaskList.stories';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('/tasks', () => {
          return HttpResponse.json(TaskListDefault.args);
        }),
      ],
    },
  },
};

export const Error = {
  args: {
    error: 'Something',
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/tasks', () => {
          return HttpResponse.json([]);
        }),
      ],
    },
  },
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/ui-testing-handbook/inbox-screen-with-mock-7-0.mp4"
    type="video/mp4"
  />
</video>

State has many different forms. Some applications track bits of state globally using libraries such as Redux and MobX. Or by making GraphQL queries. Or they might use container components. Storybook is flexible enough to support all these scenarios. For more on this, see: [Storybook addons to manage data & state](https://storybook.js.org/blog/storybook-addons-to-manage-data-state/).

Building components in isolation curtails the complexity of development. You don't have to spin up the back-end, log in as a user, and click around the UI just to debug some CSS. You can set it all up as a story and get going. And you can even run automated regression tests on those stories.

### Catch regressions

In the [previous chapter](/ui-testing-handbook/react/en/visual-testing/), we set up Chromatic and went over the basic workflow. Now that we have stories for all our composite components, we can execute the visual tests by running:

```shell
npx chromatic --project-token=<project-token>
```

You should be presented with a diff that includes stories for TaskList and the InboxScreen.

![](/ui-testing-handbook/ui-testing-chromatic-changes.png)

Now try changing something in the Task component, something like font size or background color. Then make a commit and rerun Chromatic.

<video autoPlay muted playsInline loop>
  <source
    src="/ui-testing-handbook/chromatic-inboxscreen-visual-changes.mp4"
    type="video/mp4"
  />
</video>

The tree-like nature of applications means that any tweak to the Task component will also be caught by tests for higher level components. Composition testing allows you to understand the potential impact of every small changes.

## Verifying component functionality

Next up, we'll go beyond appearance and into testing interactions. When the user checks off a task, how do you ensure that the suitable event was fired and that state updated correctly?
