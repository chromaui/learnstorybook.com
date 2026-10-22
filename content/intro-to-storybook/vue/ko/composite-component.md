---
title: '복합적 컴포넌트 조합하기'
tocTitle: '복합적 컴포넌트'
description: '간단한 컴포넌트로 복합적 컴포넌트를 조합해보세요'
commit: '554783d'
---

지난 장에서 첫 번째 컴포넌트를 만들어보았습니다. 이번 장에서는 이전에 학습한 내용을 바탕으로 Task의 목록인 TaskList를 만들어보겠습니다. 컴포넌트를 결합하여 복잡성이 커지는 경우 어떤 일이 일어나는지 함께 살펴보겠습니다.

## TaskList

Taskbox는 핀으로 고정된 작업을 일반 작업 위에 배치하여 강조합니다. 따라서 일반 작업과 핀으로 고정된 작업에 대한 두 가지 유형의 `TaskList` 스토리를 만들어야 합니다.

![일반 작업과 고정된 작업](/intro-to-storybook/tasklist-states-1.png)

`Task` 데이터는 비동기로 전달될 수 있으므로, 아직 연결되지 않았거나 데이터를 기다리는 동안 표시할 로딩 상태도 **추가로** 필요합니다. 작업이 하나도 없을 때 표시할 빈 상태도 필요합니다.

![작업이 없는 상태와 로딩 상태](/intro-to-storybook/tasklist-states-2.png)

## 설정하기

복합 컴포넌트를 만드는 과정은 그 안에 들어가는 기본 컴포넌트를 만드는 과정과 크게 다르지 않습니다. `TaskList` 컴포넌트와 스토리 파일인 `src/components/TaskList.vue`와 `src/components/TaskList.stories.ts`를 만듭니다.

간단한 `TaskList` 구현부터 시작합니다. 앞서 만든 `Task` 컴포넌트를 가져와 필요한 속성을 입력값으로 전달합니다.

```html:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading"> loading </template>
    <template v-else-if="isEmpty"> empty </template>
    <template v-else>
      <Task
        v-for="task in tasks"
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

이어서 스토리 파일에 `TaskList`의 테스트 상태를 작성합니다.

```ts:title=src/components/TaskList.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import TaskList from './TaskList.vue'

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
  component: TaskList,
  title: 'TaskList',
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.TaskData.events,
  },
} satisfies Meta<typeof TaskList>

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

<div class="aside">

💡 [**데코레이터(Decorators)**](https://storybook.js.org/docs/writing-stories/decorators)는 스토리를 원하는 래퍼로 감싸는 방법입니다. 여기서는 default export의 `decorators` 키를 사용해 렌더링된 컴포넌트 주변에 스타일을 적용합니다. 뒤에서 살펴보겠지만, 데코레이터로 컴포넌트에 다른 컨텍스트를 제공할 수도 있습니다.

</div>

`TaskStories`를 가져오면 스토리의 인수(arguments, 줄여서 args)를 손쉽게 [조합](https://storybook.js.org/docs/writing-stories/args#args-composition)할 수 있습니다. 이를 통해 두 컴포넌트에 필요한 데이터와 액션(모의 콜백)을 모두 유지할 수 있습니다.

이제 Storybook에서 새로운 `TaskList` 스토리를 확인하세요.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(States) 구현하기

컴포넌트는 아직 기본적인 형태지만, 이제 어떤 스토리를 구현해야 할지 알 수 있습니다. `.list-items` 래퍼가 너무 단순하다고 생각할 수도 있습니다. 실제로 래퍼 하나를 추가하기 위해 새 컴포넌트를 만드는 경우는 많지 않습니다. 하지만 `TaskList`의 **구현이 복잡해지는 부분**은 따로 있습니다. 고정된 작업이 있는 상태(`WithPinnedTasks`), 로딩 상태(`Loading`), 빈 상태(`Empty`)를 각각 처리해야 하기 때문입니다.

```html:title=src/components/TaskList.vue
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

마크업을 추가하면 다음과 같은 UI가 만들어집니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

목록에서 고정된 작업의 위치를 확인하세요. 사용자가 우선 처리할 수 있도록 고정된 작업을 목록 맨 위에 표시합니다.

<div class="aside">
💡 변경 사항을 git으로 커밋하는 것을 잊지 마세요!
</div>
