---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '간단한 컴포넌트를 독립적으로 만들어봅시다'
commit: '18e218e'
---

[컴포넌트 주도 개발(Component-Driven Development, CDD)](https://www.componentdriven.org/) 방법론에 따라 UI를 만들겠습니다. 컴포넌트부터 시작해 화면까지 만드는 "상향식" 개발 방식입니다. CDD를 사용하면 UI를 구축하면서 마주하는 복잡성을 단계적으로 다룰 수 있습니다.

## Task 컴포넌트

![세 가지 상태의 Task 컴포넌트](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task`는 애플리케이션의 핵심 컴포넌트입니다. 각 작업은 상태에 따라 조금씩 다르게 표시됩니다. 완료 여부를 나타내는 체크박스, 작업 정보, 목록에서 작업의 위치를 바꿀 수 있는 "고정" 버튼으로 구성됩니다. 이를 구현하려면 다음 props가 필요합니다:

- `title` – 작업을 설명하는 문자열
- `state` – 작업이 현재 어느 목록에 있는지, 완료로 표시되었는지를 나타내는 상태

`Task`를 만들 때는 먼저 위에서 살펴본 여러 작업 유형에 해당하는 테스트 상태를 작성합니다. 그런 다음 모의 데이터를 사용해 Storybook에서 컴포넌트를 독립적으로 만듭니다. 개발하면서 각 상태에서 컴포넌트가 어떻게 보이는지 "시각적 테스트"로 확인하겠습니다.

## 설정하기

먼저 작업 컴포넌트와 스토리 파일인 `src/components/Task.vue`와 `src/components/Task.stories.ts`를 만듭니다.

필요한 속성과 작업을 목록 간에 이동시키는 두 가지 액션을 전달받는 기본적인 `Task` 구현부터 시작하겠습니다:

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

위 코드는 Todos 애플리케이션의 기존 HTML 구조를 바탕으로 `Task`의 간단한 마크업을 렌더링합니다.

아래와 같이 스토리 파일에 Task의 세 가지 테스트 상태를 작성합니다:

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

💡 [**액션(Actions)**](https://storybook.js.org/docs/essentials/actions)은 UI 컴포넌트를 독립적으로 만들 때 상호작용을 확인하는 데 도움이 됩니다. 애플리케이션의 컨텍스트에서 제공하는 함수나 상태에 접근할 수 없는 경우가 많습니다. 이때 `fn()`으로 대체 함수를 만들 수 있습니다.

</div>

Storybook에는 두 가지 기본 구성 단계가 있습니다. 컴포넌트와 그 하위 스토리입니다. 각 스토리를 컴포넌트의 변형이라고 생각해보세요. 한 컴포넌트는 필요한 만큼 많은 스토리를 가질 수 있습니다.

- **컴포넌트**
  - 스토리
  - 스토리
  - 스토리

테스트할 컴포넌트를 Storybook에 알려주기 위해 다음 항목을 포함하는 `default` export를 작성합니다:

- `component` – 컴포넌트 자체
- `title` – Storybook 사이드바에서 컴포넌트를 그룹화하거나 분류하는 방식
- `tags` – 컴포넌트 문서를 자동으로 생성하기 위한 태그
- `excludeStories` – 스토리에 필요하지만 Storybook에서 스토리로 렌더링하지 않을 추가 정보
- `args` – 컴포넌트의 사용자 정의 이벤트를 모의 구현하기 위한 액션 [args](https://storybook.js.org/docs/essentials/actions#action-args)

스토리는 Component Story Format 3([CSF3](https://storybook.js.org/docs/api/csf)) 형식으로 작성합니다. 컴포넌트의 상태를 객체에 담아 내보내는 방식이라 테스트 케이스를 간결하고 직관적으로 표현할 수 있습니다. 스토리를 작성하고 재사용하기도 편리합니다.

인수(arguments), 줄여서 [`args`](https://storybook.js.org/docs/writing-stories/args)를 사용하면 Storybook을 다시 시작하지 않고도 Controls 애드온으로 컴포넌트를 실시간으로 편집할 수 있습니다. [`args`](https://storybook.js.org/docs/writing-stories/args) 값이 변경되면 컴포넌트도 함께 변경됩니다.

`fn()`을 사용하면 클릭 시 Storybook UI의 **Actions** 패널에 호출 내역이 나타나는 콜백을 생성할 수 있습니다. 따라서 핀으로 고정하는 버튼을 만들 때 버튼 클릭이 UI에서 제대로 처리되는지 확인할 수 있습니다.

모든 스토리에 같은 액션이 필요하므로, `TaskData` 변수에 한데 묶어 전달하면 편리합니다. 이렇게 묶은 `TaskData`를 `export`하면 Task를 사용하는 다른 컴포넌트의 스토리에서도 재사용할 수 있습니다. 이 방법은 뒤에서 살펴보겠습니다.

## 환경 설정

새로 만든 스토리를 인식하고 애플리케이션의 CSS 파일(`src/index.css`)을 사용할 수 있도록 Storybook 설정 파일을 몇 군데 수정해야 합니다.

먼저 Storybook 설정 파일(`.storybook/main.ts`)을 다음과 같이 수정하세요:

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

위 변경을 마쳤다면 `.storybook` 폴더의 `preview.ts`를 다음과 같이 수정하세요:

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

[매개변수(`parameters`)](https://storybook.js.org/docs/writing-stories/parameters)는 일반적으로 Storybook의 기능과 애드온의 동작을 제어하는 데 사용됩니다. 이번에는 그 용도로 사용하지 않고, 애플리케이션의 CSS 파일을 가져오겠습니다.

설정을 마친 뒤 Storybook 서버를 재시작하면 Task의 세 가지 상태에 대한 테스트 케이스를 볼 수 있습니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(States) 구현하기

Storybook 설정, 스타일 가져오기, 테스트 케이스 작성이 끝났으므로 이제 디자인에 맞게 컴포넌트의 HTML을 구현할 수 있습니다.

현재 컴포넌트는 아직 기본적인 형태입니다. 우선 세부 사항에 너무 얽매이지 않고 디자인을 구현하는 코드를 작성합니다:

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

위에서 추가한 마크업과 앞서 가져온 CSS를 함께 적용하면 다음과 같은 UI가 만들어집니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 데이터 요구 사항 명시하기

컴포넌트를 계속 만들어가면서 TypeScript 타입을 정의해 `Task` 컴포넌트가 요구하는 데이터의 형태를 명시할 수 있습니다. 이렇게 하면 오류를 일찍 발견하고, 복잡성이 늘어나도 컴포넌트를 올바르게 사용할 수 있습니다. 먼저 `src` 폴더에 `types.ts` 파일을 만들고 기존 `TaskData` 타입을 옮깁니다:

```ts:title=src/types.ts
export type TaskData = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
```

그런 다음 새로 만든 타입을 사용하도록 `Task` 컴포넌트를 수정합니다:

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

## 컴포넌트 완성!

서버를 준비하거나 프론트엔드 애플리케이션 전체를 실행하지 않고도 컴포넌트를 완성했습니다. 다음 단계에서는 같은 방식으로 나머지 Taskbox 컴포넌트를 하나씩 만들겠습니다.

이처럼 컴포넌트를 독립적으로 만드는 작업은 쉽고 빠르게 시작할 수 있습니다. 가능한 모든 상태를 자세히 살펴보고 테스트할 수 있으므로, 버그가 적고 완성도 높은 UI를 만들 수 있습니다.

<div class="aside">
💡 변경 사항을 git으로 커밋하는 것을 잊지 마세요!
</div>
