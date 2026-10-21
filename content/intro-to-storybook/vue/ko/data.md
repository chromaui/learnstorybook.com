---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워보세요'
commit: 'fafbc81'
---

지금까지 자체 상태가 없는 컴포넌트를 독립적으로 만들었습니다. Storybook에서는 유용하지만, 애플리케이션에서 실제로 활용하려면 데이터를 연결해야 합니다.

이 튜토리얼은 애플리케이션 개발의 세부 사항에 초점을 맞추지는 않습니다. 대신 컨테이너 컴포넌트로 데이터를 연결하는 일반적인 패턴을 간단히 살펴보겠습니다.

## 컨테이너 컴포넌트

현재 `TaskList`는 외부에서 데이터를 가져오지 않고, 전달받은 데이터를 화면에 보여주는 "프레젠테이셔널" 컴포넌트입니다. 데이터를 가져와 이 컴포넌트에 전달하는 역할은 "컨테이너"가 맡습니다.

이 예제에서는 Vue의 기본 상태 관리 라이브러리인 [Pinia](https://pinia.vuejs.org/)로 애플리케이션의 간단한 데이터 모델을 만들고 작업의 상태를 관리합니다.

다음 명령어로 프로젝트에 필요한 의존성을 추가하세요:

```shell
yarn add pinia
```

먼저 `src` 디렉터리에 `store.ts` 파일을 만들고, 작업 상태를 변경하는 액션에 응답하는 간단한 Pinia 스토어를 작성합니다. 예제를 이해하기 쉽도록 단순하게 구성했습니다:

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

이제 스토어에서 데이터를 읽도록 `TaskList`를 수정하겠습니다. 먼저 기존 프레젠테이셔널 컴포넌트를 `src/components/PureTaskList.vue`로 옮기고 이름을 `PureTaskList`로 바꾼 뒤, 이를 컨테이너로 감쌉니다.

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

`TaskList`의 프레젠테이셔널 버전을 별도로 유지하는 이유는 독립적으로 테스트하기 쉽기 때문입니다. 스토어가 없어도 동작하므로 테스트에서 다루기 훨씬 편합니다. `src/components/TaskList.stories.ts`의 이름을 `src/components/PureTaskList.stories.ts`로 바꾸고, 스토리가 프레젠테이셔널 버전을 사용하도록 수정하세요:

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
💡 변경 사항을 git으로 커밋하는 것을 잊지 마세요!
</div>

이제 Pinia 스토어에서 가져온 실제 데이터가 컴포넌트에 채워집니다. 이를 `src/App.vue`에 연결해 렌더링할 수도 있지만, 그 작업은 다음 장에서 진행하겠습니다.
