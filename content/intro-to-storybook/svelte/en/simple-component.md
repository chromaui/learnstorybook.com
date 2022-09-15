---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom-up”, starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` is the core component of our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in, and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

## Get set up

First, let’s create the task component and its accompanying story file: `src/components/Task.svelte` and `src/components/Task.stories.js`.

We’ll begin with a baseline implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```svelte:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  };
</script>

<div class="list-item">
  <input type="text" value={task.title} readonly />
</div>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```js:title=src/components/Task.stories.js
import Task from './Task.svelte';

import { action } from '@storybook/addon-actions';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export default {
  component: Task,
  title: 'Task',
  excludeStories: /.*Data$/,
  //👇 The argTypes are included so that they are properly displayed in the Actions Panel
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

const Template = ({ onArchiveTask, onPinTask, ...args }) => ({
  Component: Task,
  props: args,
  on: {
    ...actionsData,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};
export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component`--the component itself,
- `title`--how to refer to the component in the sidebar of the Storybook app,
- `excludeStories`--information required by the story but should not be rendered by the Storybook app.
- `argTypes`--specify the [args](https://storybook.js.org/docs/svelte/api/argtypes) behavior in each story.

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e., a component class with a set of props) in a given state.

As we have multiple permutations of our component, assigning it to a `Template` variable is convenient. Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.

<div class="aside">
💡 <code>Template.bind({})</code> is a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">standard JavaScript</a> technique for making a copy of a function. We use this technique to allow each exported story to set its own properties, but use the same implementation.
</div>

Arguments or [`args`](https://storybook.js.org/docs/react/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/react/writing-stories/args) value changes, so does the component.

When creating a story, we use a base `task` arg to build out the shape of the task the component expects, typically modeled from what the actual data looks like.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and pass them into our story definition each time.

Another nice thing about bundling the `actionsData` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/svelte/essentials/actions"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We'll need to make a couple of changes to Storybook's configuration files, so it notices not only our recently created stories and allow us to use the application's CSS file (located in `src/index.css`).

Start by changing your Storybook configuration file (`.storybook/main.js`) to the following:

```diff:title=.storybook/main.js
// .storybook/main.js

module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-interactions'],
};
```

After completing the change above, inside the `.storybook` folder, change your `preview.js` to the following:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

[`parameters`](https://storybook.js.org/docs/svelte/writing-stories/parameters) are typically used to control the behavior of Storybook's features and addons. In our case, we're going to use them to configure how the `actions` (mocked callbacks) are handled.

`actions` allows us to create callbacks that appear in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now that we have Storybook set up, styles imported, and test cases built out, we can quickly start implementing the HTML of the component to match the design.

The component is still rudimentary at the moment. First, write the code that achieves the design without going into too much detail:

```diff:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // Event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }
  // Event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  };

+ // Reactive declaration (computed prop in other frameworks)
+ $: isChecked = task.state === 'TASK_ARCHIVED';
</script>
-  <div class="list-item">
-   <input type="text" value={task.title} readonly />
-  </div>
+  <div class="list-item {task.state}">
+   <label class="checkbox">
+     <input type="checkbox" checked={isChecked} disabled name="checked" />
+     <span class="checkbox-custom" on:click={ArchiveTask} aria-label={`archiveTask-${task.id}`}/>
+   </label>
+   <div class="title">
+     <input type="text" readonly value={task.title} placeholder="Input title" />
+   </div>
+   <div class="actions">
+     {#if task.state !== 'TASK_ARCHIVED'}
+     <a href="/" on:click|preventDefault={PinTask}>
+       <span class="icon-star" aria-label={`pinTask-${task.id}`}/>
+     </a>
+     {/if}
+   </div>
+  </div>
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to manually test our application UI during construction. The stories will help ensure we don’t break our Task's appearance as we continue to develop the app. However, it is an entirely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in the future. It complements Storybook because it’s a quick way to view the new version and check out the differences.

<div class="aside">
💡 Make sure your components render data that doesn't change so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

A snapshot test is created with the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) for each of the stories. Use it by adding the following development dependencies:

```shell
yarn add -D @storybook/addon-storyshots
```

Then create a `src/storybook.test.js` file with the following in it:

```js:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

And finally, we need to make a minor adjustment to our `jest` key in `package.json`:

```diff:title=package.json
"jest": {
  "transform": {
    "^.+\\.js$": "babel-jest",
+    "^.+\\.stories\\.[jt]sx?$": "<rootDir>node_modules/@storybook/addon-storyshots/injectFileName",
    "^.+\\.svelte$": "jest-transform-svelte"
  },
+  "transformIgnorePatterns": ["node_modules/(?!(@storybook/svelte)/)"],
}
```

That's it. We can run `yarn test` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
