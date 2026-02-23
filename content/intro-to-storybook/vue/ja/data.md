---
title: 'データを繋ぐ'
tocTitle: 'データ'
description: 'UI コンポーネントとデータを繋ぐ方法を学びましょう'
commit: 'fafbc81'
---

これまでに、Storybook の切り離された環境で、状態を持たないコンポーネントを作成してきました。しかし、究極的には、アプリケーションからコンポーネントにデータを渡さなければ役には立ちません。

このチュートリアルは「アプリケーションを作る方法について」ではないので、詳細までは説明しませんが、コンテナコンポーネントを使ってデータを繋ぐ一般的なパターンについて見てみましょう。

## 繋がれたコンポーネント

現在の `TaskList` コンポーネントは「表示用 (presentational)」として書かれており、その実装以外の外部とは何もやりとりをしません。データを中に入れるためには「コンテナ」が必要です。

この例では、Vue のデフォルトの状態管理ライブラリである [Pinia](https://pinia.vuejs.org/) を使用して、アプリケーションにシンプルなデータモデルを作り、タスクの状態を管理します。

以下のコマンドを実行し、必要な依存関係をプロジェクトに追加しましょう:

```shell
yarn add pinia
```

まず、タスクの状態を変更するアクションに応答するシンプルな Pinia ストアを、`src` ディレクトリ内の `store.ts` というファイルに作成します (あえて簡単にしています):

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

次に、`TaskList` を更新してストアからデータを読み取るようにします。まず、既存の表示用バージョンを `src/components/PureTaskList.vue` ファイルに移動し (コンポーネント名を `PureTaskList` に変更)、コンテナでラップします。

`src/components/PureTaskList.vue`:

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

`src/components/TaskList.vue`:

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

`TaskList` の表示用バージョンを分離しておく理由は、テストや分離が容易になるためです。ストアの存在に依存しないため、テストの観点からはるかに扱いやすくなります。`src/components/TaskList.stories.ts` を `src/components/PureTaskList.stories.ts` にリネームし、ストーリーが表示用バージョンを使うようにしましょう:

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
💡 Git へのコミットを忘れずに行ってください！
</div>

Pinia ストアから取得した実際のデータでコンポーネントが表示されるようになりました。`src/App.vue` に接続してコンポーネントを描画することもできますが、心配しないでください。次の章で対応します。
