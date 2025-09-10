---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: '30e306d'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Pinia](https://pinia.vuejs.org/), Vue's default data management library, to build a simple data model for our application and help us manage the state of our tasks.

Add the necessary dependency to your project with:

```shell
yarn add pinia
```

First, we'll create a simple Pinia store that responds to actions that change the task's state in a file called `store.ts` in the `src` directory (intentionally kept simple):

```ts:title=src/store.ts
import type { TaskData } from './types'

/* A simple Pinia store/actions implementation.
 * A true app would be more complex and separated into different files.
 */
import { defineStore } from 'pinia'

interface TaskBoxState {
  tasks: TaskData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks: TaskData[] = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
]

/*
 * The store is created here.
 * You can read more about Pinia defineStore in the docs:
 * https://pinia.vuejs.org/core-concepts/
 */
export const useTaskStore = defineStore('taskbox', {
  state: (): TaskBoxState => ({
    tasks: defaultTasks,
    status: 'idle',
    error: null,
  }),
  actions: {
    archiveTask(id: string) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.state = 'TASK_ARCHIVED'
      }
    },
    pinTask(id: string) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.state = 'TASK_PINNED'
      }
    },
  },
  getters: {
    getFilteredTasks: (state) => {
      const filteredTasks = state.tasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED',
      )
      return filteredTasks
    },
  },
})
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/components/PureTaskList.vue` (renaming the component to `PureTaskList`) and wrap it with a container.

In `src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<!--This file moved from TaskList.vue-->
<template>
  <div class="list-items">
    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="loading-item" data-testid="loading" id="loading">
        <span class="glow-checkbox" />
        <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
      </div>
    </template>

    <div v-else-if="isEmpty" class="list-items" data-testid="empty" id="empty">
      <div class="wrapper-message">
        <span class="icon-check" />
        <p class="title-message">You have no tasks</p>
        <p class="subtitle-message">Sit back and relax</p>
      </div>
    </div>

    <template v-else>
      <Task
        v-for="task in tasksInOrder"
        :key="task.id"
        :task="task"
        @archive-task="onArchiveTask"
        @pin-task="onPinTask"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import type { TaskData } from '../types'

import { computed } from 'vue'

import Task from './Task.vue'

type TaskListProps = {
  tasks: TaskData[]
  loading?: boolean
}

const props = defineProps<TaskListProps>()

const isEmpty = computed(() => props.tasks.length === 0)
const tasksInOrder = computed(() => {
  return [
    ...props.tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...props.tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ]
})

const emit = defineEmits<{
  (e: 'archive-task', id: string): void
  (e: 'pin-task', id: string): void
}>()

/**
 * Event handler for archiving tasks
 */
function onArchiveTask(taskId: string): void {
  emit('archive-task', taskId)
}

/**
 * Event handler for pinning tasks
 */
function onPinTask(taskId: string): void {
  emit('pin-task', taskId)
}
</script>
```

In `src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script lang="ts" setup>
import PureTaskList from './PureTaskList.vue'

import { computed } from 'vue'

import { useTaskStore } from '../store'

const taskStore = useTaskStore()
//👇 Creates a store instance
const store = useTaskStore()

//👇 Retrieves the tasks from the store's state auxiliary getter function
const tasks = computed(() => store.getFilteredTasks)

//👇 Dispatches the actions back to the store
const archiveTask = (task: string) => store.archiveTask(task)
const pinTask = (task: string) => store.pinTask(task)
</script>
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/components/TaskList.stories.ts` into `src/components/PureTaskList.stories.ts` and ensure our stories use the presentational version:

```ts:title=src/components/PureTaskList.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import PureTaskList from './PureTaskList.vue'

import * as TaskStories from './Task.stories'

export const TaskListData = [
  { ...TaskStories.TaskData, id: '1', title: 'Task 1' },
  { ...TaskStories.TaskData, id: '2', title: 'Task 2' },
  { ...TaskStories.TaskData, id: '3', title: 'Task 3' },
  { ...TaskStories.TaskData, id: '4', title: 'Task 4' },
  { ...TaskStories.TaskData, id: '5', title: 'Task 5' },
  { ...TaskStories.TaskData, id: '6', title: 'Task 6' },
]

const meta = {
  component: PureTaskList,
  title: 'PureTaskList',
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.TaskData.events,
  },
} satisfies Meta<typeof PureTaskList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: TaskListData,
  },
}

export const WithPinnedTasks: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
}

export const Loading: Story = {
  args: {
    tasks: [],
    loading: true,
  },
}

export const Empty: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
}
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component, obtained from the Pinia store, we could have wired it to `src/App.vue` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
