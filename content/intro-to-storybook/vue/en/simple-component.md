---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
commit: 'b586083'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom-up”, starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` is the core component of our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in, and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

## Get set up

First, let’s create the task component and its accompanying story file: `src/components/Task.vue` and `src/components/Task.stories.ts`.

We’ll begin with a baseline implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <label for="title" :aria-label="task.title">
      <input type="text" readonly :value="task.title" id="title" name="title" />
    </label>
  </div>
</template>

<script lang="ts" setup>
type TaskData = {
  id: string
  title: string
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED'
}

type TaskProps = {
  task: TaskData
  onArchiveTask: (id: string) => void
  onPinTask: (id: string) => void
}
const props = withDefaults(defineProps<TaskProps>(), {
  task: { id: '', title: '', state: 'TASK_INBOX' },
})
</script>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos application.

Below we build out Task’s three test states in the story file:

```ts:title=src/components/Task.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fn } from 'storybook/test'

import Task from './Task.vue'

export const TaskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX' as 'TASK_INBOX' | 'TASK_ARCHIVED' | 'TASK_PINNED',
  events: {
    onArchiveTask: fn(),
    onPinTask: fn(),
  },
}

const meta = {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...TaskData.events,
  },
} satisfies Meta<typeof Task>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    task: TaskData,
  },
}

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
}

export const Archived: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
}
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions) help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use `fn()` to stub them in.

</div>

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are testing, we create a `default` export that contains:

- `component` -- the component itself
- `title` -- how to group or categorize the component in the Storybook sidebar
- `tags` -- to automatically generate documentation for our components
- `excludeStories`-- additional information required by the story but should not be rendered in Storybook
- `args` -- define the action [args](https://storybook.js.org/docs/essentials/actions#action-args) that the component expects to mock out the custom events

To define our stories, we'll use Component Story Format 3 (also known as [CSF3](https://storybook.js.org/docs/api/csf) ) to build out each of our test cases. This format is designed to build out each of our test cases in a concise way. By exporting an object containing each component state, we can define our tests more intuitively and author and reuse stories more efficiently.

Arguments or [`args`](https://storybook.js.org/docs/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/writing-stories/args) value changes, so does the component.

`fn()` allows us to create a callback that appears in the **Actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `TaskData` variable and pass them into our story definition each time. Another nice thing about bundling the `TaskData` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

## Config

We'll need to make a couple of changes to Storybook's configuration files, so it notices our recently created stories and allows us to use the application's CSS file (located in `src/index.css`).

Start by changing your Storybook configuration file (`.storybook/main.ts`) to the following:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.ts'],
  staticDirs: ['../public'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
```

After completing the change above, inside the `.storybook` folder, change your `preview.ts` to the following:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/vue3-vite'

+ import '../src/index.css'

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters) are typically used to control the behavior of Storybook's features and addons. In our case, we won't use them for that purpose. Instead, we will import our application's CSS file.

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now that we have Storybook set up, styles imported, and test cases built out, we can quickly start implementing the HTML of the component to match the design.

The component is still rudimentary at the moment. First, write the code that achieves the design without going into too much detail:

```html:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label :for="'checked' + task.id" :aria-label="'archiveTask-' + task.id" class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type TaskData = {
  id: string
  title: string
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED'
}

type TaskProps = {
  /** Composition of the task */
  task: TaskData
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void
}

const props = withDefaults(defineProps<TaskProps>(), {
  task: { id: '', title: '', state: 'TASK_INBOX' },
})

const classes = computed(() => {
  return `list-item ${props.task.state}`
})

/*
 * Computed property for checking the state of the task
 */
const isChecked = computed(() => props.task.state === 'TASK_ARCHIVED')

const emit = defineEmits<{
  (e: 'archive-task', id: string): void
  (e: 'pin-task', id: string): void
}>()

/**
 * Event handler for archiving tasks
 */
function archiveTask() {
  emit('archive-task', props.task.id)
}

/**
 * Event handler for pinning tasks
 */
function pinTask(): void {
  emit('pin-task', props.task.id)
}
</script>
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

As we continue to build out our components, we can specify the shape of the data that the `Task` component expects by defining a TypeScript type. This way, we can catch errors early and ensure the component is used correctly when adding more complexity. Start by creating a `types.ts` file in the `src` folder and move our existing `TaskData` type there:

```ts:title=src/types.ts
export type TaskData = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
```

Then, update the `Task` component to use our newly created type:

```html:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label :for="'checked' + task.id" :aria-label="'archiveTask-' + task.id" class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { TaskData } from '../types'

import { computed } from 'vue'

type TaskProps = {
  /** Composition of the task */
  task: TaskData
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void
}

const props = defineProps<TaskProps>()

const classes = computed(() => {
  return `list-item ${props.task.state}`
})

/*
 * Computed property for checking the state of the task
 */
const isChecked = computed(() => props.task.state === 'TASK_ARCHIVED')

const emit = defineEmits<{
  (e: 'archive-task', id: string): void
  (e: 'pin-task', id: string): void
}>()

/**
 * Event handler for archiving tasks
 */
function archiveTask() {
  emit('archive-task', props.task.id)
}

/**
 * Event handler for pinning tasks
 */
function pinTask(): void {
  emit('pin-task', props.task.id)
}
</script>
```

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
