---
title: '복합 컴포넌트 조립하기'
tocTitle: '복합 컴포넌트'
description: '간단한 컴포넌트로 복합 컴포넌트 조립하기'
---

지난 챕터에서는 첫 번째 컴포넌트를 만들었습니다; 이 챕터에서는 이전에 학습한 내용을 확장해 TaskList, 즉 Task 목록을 만듭니다. 컴포넌트들을 결합했을 때 어떤 일이 벌어지는지 살펴봅시다.

## Tasklist

Taskbox는 핀 된 작업을 기본 작업 위에 위치시켜서 강조합니다. 이를 위해, 기본 항목과 핀 된 항목에 대한 두 가지 변형의 `TaskList` 스토리를 만들어야 합니다.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

`Task` 데이터는 비동기적으로 전송될 수 있으므로, 연결이 없을 때 렌더링할 로딩 상태도 필요합니다.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## 준비하기

복합 컴포넌트는 그것이 포함하는 기본 컴포넌트와 크게 다르지 않습니다. `TaskList` 컴포넌트, 올바른 마크업을 표시하는 보조 컴포넌트, 그리고 이에 수반되는 스토리 파일을 생성하세요: `src/components/TaskList.svelte`, `src/components/MarginDecorator.svelte`, `src/components/TaskList.stories.js`.

대략적인 `TaskList` 구현부터 시작합니다. 이전에 만든 `Task` 컴포넌트를 `import`하고 속성과 액션을 입력(inputs)으로 전달해야 합니다.

```html:title=src/components/TaskList.svelte
<script>
  import Task from './Task.svelte';

  /* 로딩 상태를 설정합니다 */
  export let loading = false;

  /* 작업 목록을 정의합니다 */
  export let tasks = [];

  /* 반응형 선언(다른 프레임워크의 computed prop) */
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
</script>

{#if loading}
  <div class="list-items">loading</div>
{/if}
{#if emptyTasks}
  <div class="list-items">empty</div>
{/if}
{#each tasks as task}
  <Task {task} on:onPinTask on:onArchiveTask />
{/each}

```

다음으로, `MarginDecorator`를 다음과 같이 생성합니다:

```html:title=src/components/MarginDecorator.svelte
<div>
  <slot />
</div>

<style>
  div {
    margin: 3em;
  }
</style>
```

마지막으로, 스토리 파일에서 `TaskList`의 테스트 상태들을 생성합니다.

```js:title=src/components/TaskList.stories.js
import TaskList from './TaskList.svelte';

import MarginDecorator from './MarginDecorator.svelte';

import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  tags: ['autodocs'],
  //👇 보조 컴포넌트가 데코레이터로 추가되어 UI를 올바르게 표시할 수 있습니다.
  decorators: [() => MarginDecorator],
  render: (args) => ({
    Component: TaskList,
    props: args,
    on: {
      ...TaskStories.actionsData,
    },
  }),
};

export const Default = {
  args: {
    // args를 조합해서 스토리를 구성합니다.
    // 데이터는 Task.stories.js의 Default 스토리에서 상속되었습니다.
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
    // args를 조합해서 스토리를 구성합니다.
    // Default 스토리에서 상속된 데이터입니다.
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
    // args를 조합해서 스토리를 구성합니다.
    // Loading 스토리에서 상속된 데이터입니다.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">

[**Decorators**](https://storybook.js.org/docs/writing-stories/decorators)는 스토리에 임의의 래퍼(wrapper)를 제공하는 방법입니다. 위에서는 `default export`에 `decorators` 키(key)를 사용해 렌더링 된 컴포넌트 주위에 스타일을 추가하고 있습니다. 데코레이터는 컴포넌트에 다른 컨텍스트를 추가할 때도 사용할 수 있습니다.

</div>

`TaskStories`를 `import`해서 인수(args)로서 [조합](https://storybook.js.org/docs/writing-stories/args#args-composition)하여 스토리를 구성할 수 있었습니다. 이렇게 하면 두 컴포넌트의 데이터와 액션(모의 콜백)이 그대로 유지됩니다.

이제 Storybook에서 새로 추가된 `TaskList` 스토리를 확인해봅시다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(states) 구현하기

`TaskList` 컴포넌트에는, `.list-items` 래퍼에 아무것도 들어있지 않고, 핀 된 Task 컴포넌트도 그저 나열되어 있습니다. 어떤 스토리를 만들지에 대한 아이디어만 `WithPinnedTasks`, `Loading`, `Empty`와 같이 선언해 두었습니다. 이 아이디어를 구현해보며 `TaskList` 컴포넌트가 어떻게 **복잡해지는지** 살펴봅시다.

로딩 엣지 케이스를 위해 올바른 마크업을 표시할 새 컴포넌트를 만들겠습니다.

`LoadingRow.svelte`라는 새 파일을 만들고 다음의 마크업을 추가해주세요:

```html:title=src/components/LoadingRow.svelte
<div class="loading-item">
  <span class="glow-checkbox" />
  <span class="glow-text">
    <span>Loading</span>
    <span>cool</span>
    <span>state</span>
  </span>
</div>
```

그리고 `TaskList.svelte`를 다음과 같이 업데이트합니다.

```html:title=src/components/TaskList.svelte
<script>
  import Task from './Task.svelte';
  import LoadingRow from './LoadingRow.svelte';

  /* 로딩 상태 설정 */
  export let loading = false;

  /* 작업 목록 정의 */
  export let tasks = [];

  /* 반응형 선언(다른 프레임워크의 computed prop) */
  $: noTasks = tasks.length === 0;
  $: emptyTasks = noTasks && !loading;
  $: tasksInOrder = [
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED')
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

추가된 마크업은 다음과 같은 UI를 만듭니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

목록에서 핀 된 항목의 위치를 확인해보세요. 사용자에게 우선순위로 보여주기 위해 핀 된 항목이 목록의 상단에 렌더링 되도록 했습니다.

<div class="aside">
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>
