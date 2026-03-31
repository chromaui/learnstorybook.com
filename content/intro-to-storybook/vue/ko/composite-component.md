---
title: '복합적 컴포넌트 조합하기'
tocTitle: '복합적 컴포넌트'
description: '간단한 컴포넌트로 복합적 컴포넌트를 조합해보세요'
commit: '3221bbb'
---

지난 챕터에서 첫 번째 컴포넌트를 만들어보았습니다. 이번 챕터에서는 이전에 학습한 내용을 바탕으로 Task의 목록인 TaskList를 만들어보겠습니다. 컴포넌트를 결합하여 복잡성이 커지는 경우 어떤 일이 일어나는지 함께 살펴보겠습니다.

## Tasklist

Taskbox는 핀으로 고정된 task를 일반 task 위에 배치하여 강조합니다. 따라서 일반 task와 핀으로 고정된 task에 대한 두 가지 유형의 `TaskList` 스토리(story)를 만들어야 합니다.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

`Task` 데이터는 비동기식으로 전송될 수 있기 때문에, 연결이 없는 상태를 렌더링 할 수 있도록 로딩 상태(state) **또한** 필요합니다. task가 없는 경우를 위해 비어있는 상태도 필요할 것입니다.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## 설정하기

복합 컴포넌트는 기본 컴포넌트와 크게 다르지 않습니다. `TaskList` 컴포넌트와 그에 해당하는 스토리 파일을 만들어보겠습니다. `src/components/TaskList.vue` 와 `src/components/TaskList.stories.js`를 생성해 주세요.

우선 `TaskList`의 대략적인 구현부터 시작하겠습니다. 이전의 `Task` 컴포넌트를 가져온 후, 속성과 액션을 입력값으로 전달해 주세요:

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

<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'TaskList',
  components: { Task },
  props: {
    tasks: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      isEmpty: computed(() => props.tasks.length === 0),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task', taskId);
      },
      /**
       * Event handler for pinning tasks
       */
      onPinTask(taskId) {
        emit('pin-task', taskId);
      },
    };
  },
};
</script>
```

그리고, 스토리 파일 안에 `TaskList`의 테스트 상태값들을 만들어 보세요.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.vue';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.ActionsData,
  }
}

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.js.
    tasks: [
      { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
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
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">

💡 [**데코레이터(Decorators)**](https://storybook.js.org/docs/writing-stories/decorators)는 스토리에 임의의 래퍼(wrapper)를 제공하는 방법입니다. 여기서는 default export에 decorators 키를 사용해 렌더링된 컴포넌트에 `margin`을 추가했습니다. 이외에도 컴포넌트에 다른 컨텍스트를 추가하는 데 활용할 수 있습니다.

</div>

`TaskStories`를 import하면 args [구성(compose)](https://storybook.js.org/docs/react/writing-stories/args#args-composition)을 통해 손쉽게 스토리 데이터를 재사용할 수 있습니다.
이를 통해 두 컴포넌트가 받을 수 있는 데이터와 액션(mocked callbacks)이 모두 보존됩니다.

이제 Storybook에서 새 `TaskList` 스토리를 확인합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(States) 구현하기

현재 컴포넌트는 아직 단순하지만, 앞으로 구현할 스토리에 대한 윤곽이 잡혔습니다. `.list-items` 래퍼(wrapper)가 너무 단순하다고 느낄 수 있는데, 맞습니다! 대부분의 경우에 우리는 단지 래퍼(wrapper)를 추가하기 위해서 새로운 컴포넌트를 만들지 않습니다. 그러나 `TaskList` 컴포넌트의 **진정한 복잡성**은 `withPinnedTasks`, `loading`, `empty`와 같은 엣지 케이스에서 드러납니다.

```diff:title=src/components/TaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
+     <div v-for="n in 6" :key="n" class="loading-item">
+       <span class="glow-checkbox" />
+       <span class="glow-text">
+         <span>Loading</span> <span>cool</span> <span>state</span>
+       </span>
+     </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
+     <div class="wrapper-message">
+       <span class="icon-check" />
+       <p class="title-message">You have no tasks</p>
+       <p class="subtitle-message">Sit back and relax</p>
+     </div>
    </div>

    <template v-else>
+     <Task
+       v-for="task in tasksInOrder"
+       :key="task.id"
+       :task="task"
+       @archive-task="onArchiveTask"
+       @pin-task="onPinTask"
+     />
   </template>
  </div>
</template>

<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'TaskList',
  components: { Task },
  props: {
    tasks: { type: Array, required: true, default: () => [] },
    loading: { type: Boolean, default: false },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      isEmpty: computed(() => props.tasks.length === 0),
+     tasksInOrder:computed(()=>{
+       return [
+         ...props.tasks.filter(t => t.state === 'TASK_PINNED'),
+         ...props.tasks.filter(t => t.state !== 'TASK_PINNED'),
+       ]
+     }),
      /**
       * Event handler for archiving tasks
       */
      onArchiveTask(taskId) {
        emit('archive-task',taskId);
      },
      /**
       * Event handler for pinning tasks
       */
      onPinTask(taskId) {
        emit('pin-task', taskId);
      },
    };
  },
};
</script>
```

위에서 추가된 마크업으로 다음과 같은 UI가 나타납니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

목록에서 고정된 항목이 상단에 표시되는 것을 확인할 수 있습니다. 사용자가 고정된 항목을 우선적으로 확인할 수 있도록 의도한 동작입니다.

<div class="aside">
💡 변경 사항을 Git에 커밋하는 것을 잊지 마세요!
</div>
