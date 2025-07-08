---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법 배우기'
---

지금끼자는 격리된 상태 없는(stateless) 컴포넌트를 만들었습니다-Storybook에는 훌륭하지만, 궁극적으로는 앱에 데이터를 연결해주기 전까지는 쓸모가 없습니다.

이 튜토리얼은 앱을 실제로 구축하는 세부사항을 다루지는 않겠지만, 컨테이너 컴포넌트를 사용하여 데이터를 연결하는 일반적인 패턴을 잠시 살펴보겠습니다.

## 컨테이너 컴포넌트

현재 작성된 `TaskList` 컴포넌트는 자체적으로는 외부와 통신하지 않는 "프레젠테이셔널(presentational" 컴포넌트입니다. 여기에 데이터를 전달하려면 "컨테이너"가 필요합니다.

이 예제에서는 Svelte의 기본 데이터 관리 API인 [스토어](https://svelte.dev/docs/svelte-store)를 사용하여 앱의 간단한 데이터 모델을 구현합니다. 이 패턴은 [Apollo](https://www.apollographql.com/client/)나 [MobX](https://mobx.js.org/) 같은 다른 데이터 관리 라이브러리에도 똑같이 적용할 수 있습니다.

먼저, `src` 디렉토리의 `stores.js` 파일에서 작업 상태를 변경하는 액션에 반응하는 간단한 Svelte 스토어를 구성합니다(의도적으로 단순하게 만든 예제입니다):

```js:title=src/store.js
// 업데이트 메서드와 초기화 메서드를 갖춘 간단한 Svelte 스토어 구현입니다.
// 실제 앱은 더 복잡하고 여러 파일로 분리되어 있을 거예요.

import { writable } from 'svelte/store';
/*
 * 앱이 로드될 때 스토어의 초기 상태입니다.
 * 보통은 서버에서 가져오겠지만, 지금은 신경쓰지 않겠습니다.
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const TaskBox = () => {
  // 일부 초기 데이터로 채워진 새로운 writable 스토어를 생성합니다.
  const { subscribe, update } = writable({
    tasks: defaultTasks,
    status: 'idle',
    error: false,
  });

  return {
    subscribe,
    // Task를 보관(archive)하는 메서드로, Redux나 Pinia의 액션과 유사합니다.
    archiveTask: (id) =>
      update((store) => {
        const filteredTasks = store.tasks
          .map((task) =>
            task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task
          )
          .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');

        return { ...store, tasks: filteredTasks };
      }),
    // Task를 고정(pin)하는 메서드로, Redux나 Pinia의 액션과 유사합니다.
    pinTask: (id) => {
      update((store) => {
        const task = store.tasks.find((t) => t.id === id);
        if (task) {
          task.state = 'TASK_PINNED';
        }
        return store;
      });
    },
  };
};
export const taskStore = TaskBox();
```

다음으로, 스토어에서 데이터를 읽어오도록 `TaskList`를 변경합니다. 먼저 기존의 프레젠테이셔널 버전을 `src/components/PureTaskList.svelte`로 옮기고, 컨테이너 컴포넌트로 감쌉니다:

```html:title=src/components/PureTaskList.svelte
<!--이 파일은 TaskList.svelte에서 옮겨진 것입니다.-->
<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';

  /* 로딩 상태 설정 */
  export let loading = false;

  /* 작업 목록 정의 */
  export let tasks = [];

  /* 반응형 선언 (다른 프레임워크의 computed prop과 유사) */
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
  $: tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];
</script>

{#if loading}
  <div class="list-items">
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </div>
{/if}
{#if emptyTasks}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check" />
      <p class="title-message">You have no tasks</p>
      <p class="subtitle-message">Sit back and relax</p>
    </div>
  </div>
{/if}
{#each tasksInOrder as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}
```

기존의 `src/components/TaskList.svelte` 내용은 다음과 같이 변경합니다:

```html:title=src/components/TaskList.svelte
<script>
  import PureTaskList from './PureTaskList.svelte';
  import { taskStore } from '../store';

  function onPinTask(event) {
    taskStore.pinTask(event.detail.id);
  }
  function onArchiveTask(event) {
    taskStore.archiveTask(event.detail.id);
  }
</script>

<PureTaskList
  tasks={$taskStore.tasks}
  on:onPinTask={onPinTask}
  on:onArchiveTask={onArchiveTask}
/>
```

프레젠테이셔널 버전을 분리해두는 이유는 컴포넌트를 격리시켜서 더 쉽게 테스트하기 위함입니다. `PureTaskList` 컴포넌트는 스토어의 존재에 의존하지 않기 때문에 테스트에서 다루기가 훨씬 수월합니다. `src/components/TaskList.stories.js` 파일 이름을 `src/components/PureTaskList.stories.js`로 수정하고, 스토리가 프레젠테이셔널 버전을 사용하도록 합니다:

```js:title=src/components/PureTaskList.stories.js
import PureTaskList from './PureTaskList.svelte';
import MarginDecorator from './MarginDecorator.svelte';

import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'PureTaskList',
  tags: ['autodocs'],
  decorators: [() => MarginDecorator],
  render: (args) => ({
    Component: PureTaskList,
    props: args,
    on: {
      ...TaskStories.actionsData,
    },
  }),
};

export const Default = {
  args: {
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
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>

이제 스토어에서 가져온 실제 데이터로 컴포넌트를 채웠습니다. `src/App.svelte`에 연결하여 렌더링 할 차례입니다. 다음 챕터에서 다룰 예정이니 걱정하지 마세요.
