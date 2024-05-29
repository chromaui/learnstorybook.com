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

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** Event handler for the Pin Task */
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  /** Event handler for the Archive Task */
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  /** Composition of the task */
  export let task = {
    id: '',
    title: '',
    state: '',
  };
</script>

<div class="list-item">
  <label for="title" aria-label={task.title}>
    <input type="text" value={task.title} name="title" readonly />
  </label>
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
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  render: (args) => ({
    Component: Task,
    props: args,
    on: {
      ...actionsData,
    },
  }),
};

export const Default = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX",
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_PINNED",
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_ARCHIVED",
    },
  },
};
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions) help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use `action()` to stub them in.

</div>

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component` -- the component itself
- `title` -- how to refer to the component in the sidebar of the Storybook app
- `excludeStories` -- information required by the story but should not be rendered by the Storybook app
- `tags` -- to automatically generate documentation for our components
- `render` -- a function that gives additional control over how the story is rendered

To define our stories, we'll use Component Story Format 3 (also known as [CSF3](https://storybook.js.org/docs/api/csf) ) to build out each of our test cases. This format is designed to build out each of our test cases in a concise way. By exporting an object containing each component state, we can define our tests more intuitively and author and reuse stories more efficiently.

Arguments or [`args`](https://storybook.js.org/docs/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/writing-stories/args) value changes, so does the component.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and pass them into our story definition each time. Another nice thing about bundling the `actionsData` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

When creating a story, we use a base `task` arg to build out the shape of the task the component expects. Typically modeled from what the actual data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

## Config

We'll need to make a couple of changes to Storybook's configuration files so it notices our recently created stories and allows us to use the application's CSS file (located in `src/index.css`).

Start by changing your Storybook configuration file (`.storybook/main.js`) to the following:

```diff:title=.storybook/main.js
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
};
export default config;
```

After completing the change above, inside the `.storybook` folder, change your `preview.js` to the following:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/svelte').Preview } */
const preview = {
  actions: { argTypesRegex: "^on.*" },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters) are typically used to control the behavior of Storybook's features and addons. In our case, we're going to use them to configure how the `actions` (mocked callbacks) are handled.

`actions` allows us to create callbacks that appear in the **Actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now that we have Storybook set up, styles imported, and test cases built out, we can quickly start implementing the HTML of the component to match the design.

The component is still rudimentary at the moment. First, write the code that achieves the design without going into too much detail:

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /** Event handler for the Pin Task */
  function PinTask() {
    dispatch('onPinTask', { id: task.id });
  }

  /** Event handler for the Archive Task */
  function ArchiveTask() {
    dispatch('onArchiveTask', { id: task.id });
  }

  /** Composition of the task */
  export let task = {
    id: '',
    title: '',
    state: ''
  };

  /* Reactive declaration (computed prop in other frameworks) */
  $: isChecked = task.state === "TASK_ARCHIVED";
</script>

<div class="list-item {task.state}">
  <label
    for={`checked-${task.id}`}
    class="checkbox"
    aria-label={`archiveTask-${task.id}`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      disabled
      name={`checked-${task.id}`}
      id={`archiveTask-${task.id}`}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="checkbox-custom"
      role="button"
      on:click={ArchiveTask}
      tabindex="-1"
      aria-label={`archiveTask-${task.id}`}
    />
  </label>
  <label for={`title-${task.id}`} aria-label={task.title} class="title">
    <input
      type="text"
      value={task.title}
      readonly
      name="title"
      id={`title-${task.id}`}
      placeholder="Input title"
    />
  </label>
  {#if task.state !== 'TASK_ARCHIVED'}
    <button
      class="pin-button"
      on:click|preventDefault={PinTask}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star" />
    </button>
  {/if}
</div>
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Catch accessibility issues

Accessibility tests refer to the practice of auditing the rendered DOM with automated tools against a set of heuristics based on [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) rules and other industry-accepted best practices. They act as the first line of QA to catch blatant accessibility violations ensuring that an application is usable for as many people as possible, including people with disabilities such as vision impairment, hearing problems, and cognitive conditions.

Storybook includes an official [accessibility addon](https://storybook.js.org/addons/@storybook/addon-a11y). Powered by Deque's [axe-core](https://github.com/dequelabs/axe-core), it can catch up to [57% of WCAG issues](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Let's see how it works! Run the following command to install the addon:

```shell
yarn add --dev @storybook/addon-a11y
```

Then, update your Storybook configuration file (`.storybook/main.js`) to enable it:

```diff:title=.storybook/main.js
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
};
export default config;
```

Finally, restart your Storybook to see the new addon enabled in the UI.

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

Cycling through our stories, we can see that the addon found an accessibility issue with one of our test states. The message [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) essentially means there isn't enough contrast between the task title and the background. We can quickly fix it by changing the text color to a darker gray in our application's CSS (located in `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

That's it! We've taken the first step to ensure that UI becomes accessible. As we continue to add complexity to our application, we can repeat this process for all other components without needing to spin up additional tools or testing environments.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
