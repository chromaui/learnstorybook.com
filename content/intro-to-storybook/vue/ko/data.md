---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워보세요'
commit: '30e306d'
---

지금까지 우리는 독립된 환경에서 상태를 가지지 않는(stateless) 컴포넌트를 만들어보았습니다. 이는 스토리북(Storybook)에는 적합하지만 앱에 데이터를 제공하기 전까지는 유용하지 않습니다.

이번 튜토리얼에서는 앱 제작의 세부 사항에 중점을 두지 않기 때문에 자세히 설명하지 않을 것입니다. 그보다 컨테이너 컴포넌트(container components)에 데이터를 연결하는 일반적인 패턴을 살펴보도록 하겠습니다.

## 컨테이너 컴포넌트

현재 구현된 TaskList는 외부와 어떠한 소통도 하지 않기 때문에 “표상적(presentational)”이라고 할 수 있습니다. 데이터 주입을 위해서는 “컨테이너”가 필요합니다.

이 예제에서는 Vue의 기본 상태 관리 라이브러리인 [Pinia](https://pinia.vuejs.org/)를 사용하여 앱의 단순한 데이터 모델을 만듭니다. 그러나 이 패턴은 [Apollo](https://www.apollographql.com/client/), [MobX](https://mobx.js.org/)와 같은 다른 상태 관리 라이브러리에도 동일하게 적용할 수 있습니다.

다음 명령으로 필요한 의존성을 프로젝트에 추가합니다.

```shell
yarn add pinia
```

먼저, `src` 디렉터리에 `store.js` 파일을 생성하고 Task의 상태를 변경하는 액션에 반응하는 간단한 Pinia 스토어를 만듭니다(일부러 단순하게 유지).

```js:title=src/store.js
/* A simple Pinia store/actions implementation.
 * A true app would be more complex and separated into different files.
 */
import { defineStore } from 'pinia';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

/*
 * The store is created here.
 * You can read more about Pinia defineStore in the docs:
 * https://pinia.vuejs.org/core-concepts/
 */
export const useTaskStore = defineStore({
  id: 'taskbox',
  state: () => ({
    tasks: defaultTasks,
    status: 'idle',
    error: null,
  }),
  actions: {
    archiveTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_ARCHIVED';
      }
    },
    pinTask(id) {
      const task = this.tasks.find((task) => task.id === id);
      if (task) {
        task.state = 'TASK_PINNED';
      }
    },
  },
  getters: {
    getFilteredTasks: (state) => {
      const filteredTasks = state.tasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
      );
      return filteredTasks;
    },
  },
});
```

그런 다음, `TaskList`가 스토어에서 데이터를 읽도록 수정합니다.
먼저 기존 프레젠테이셔널 버전을 `src/components/PureTaskList.vue`로 이동하고 컴포넌트 이름을 `PureTaskList`로 변경한 뒤, 컨테이너로 감쌉니다.

`src/components/PureTaskList.vue`:

```html:title=src/components/PureTaskList.vue
<template>
  <div class="list-items">
    <template v-if="loading">
      <div v-for="n in 6" :key="n" class="loading-item">
        <span class="glow-checkbox" />
        <span class="glow-text">
          <span>Loading</span> <span>cool</span> <span>state</span>
        </span>
      </div>
    </template>

    <div v-else-if="isEmpty" class="list-items">
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
<script>
import Task from './Task.vue';
import { reactive, computed } from 'vue';

export default {
  name: 'PureTaskList',
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
      tasksInOrder: computed(() => {
        return [
          ...props.tasks.filter((t) => t.state === 'TASK_PINNED'),
          ...props.tasks.filter((t) => t.state !== 'TASK_PINNED'),
        ];
      }),
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

`src/components/TaskList.vue`:

```html:title=src/components/TaskList.vue
<template>
  <PureTaskList :tasks="tasks" @archive-task="archiveTask" @pin-task="pinTask" />
</template>

<script>
import PureTaskList from './PureTaskList.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  components: { PureTaskList },
  name: 'TaskList',
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the tasks from the store's state auxiliary getter function
    const tasks = computed(() => store.getFilteredTasks);

    //👇 Dispatches the actions back to the store
    const archiveTask = (task) => store.archiveTask(task);
    const pinTask = (task) => store.pinTask(task);

    return {
      tasks,
      archiveTask,
      pinTask,
    };
  },
};
</script>
```

`TaskList`의 프레젠테이셔널 버전을 별도로 유지하는 이유는 테스트와 분리가 쉽기 때문입니다. 스토어에 의존하지 않으므로 테스트 환경에서 다루기 훨씬 편합니다.
`src/components/TaskList.stories.js`를 `src/components/PureTaskList.stories.js`로 변경하고, 스토리가 프레젠테이셔널 버전을 사용하도록 수정합니다.

```diff:title=src/components/PureTaskList.stories.js
+ import PureTaskList from './PureTaskList.vue';

import * as TaskStories from './Task.stories';

export default {
+ component: PureTaskList,
+ title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [() => ({ template: '<div style="margin: 3em;"><story/></div>' })],
  args: {
    ...TaskStories.ActionsData,
  }
};

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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 변경 사항을 Git에 커밋하는 것을 잊지 마세요!
</div>

이제 Pinia 스토어에서 가져온 실제 데이터로 컴포넌트를 채웠습니다. 원한다면 이를 `src/App.vue`에 연결하여 컴포넌트를 렌더링할 수도 있습니다. 이는 다음 장에서 다루겠습니다.
