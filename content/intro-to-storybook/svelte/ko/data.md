---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법 배우기'
---

지금까지는 격리되어 있고, 상태가 없는(stateless) 컴포넌트를 만들었습니다-Storybook에는 훌륭하지만, 궁극적으로는 앱에 데이터를 연결해주기 전까지는 쓸모가 없습니다.

이 튜토리얼은 앱을 실제로 구축하는 세부사항을 다루지는 않겠지만, 컨테이너 컴포넌트를 사용하여 데이터를 연결하는 일반적인 패턴을 잠시 살펴보겠습니다.

## 컨테이너 컴포넌트

현재 작성된 `TaskList` 컴포넌트는 자체적으로는 외부와 통신하지 않는 "프레젠테이셔널(presentational)" 컴포넌트입니다. 여기에 데이터를 전달하려면 "컨테이너"가 필요합니다.

이 예제에서는 간단한 스토어를 구현하기 위해 Svelte의 [룬(runes)](https://svelte.dev/docs/svelte/what-are-runes)을 사용할 것입니다. 룬(runes)은 명시적이고, 세밀한 반응형 프리미티브를 제공하는 강력한 반응성 시스템입니다. [`$state`](https://svelte.dev/docs/svelte/$state) 룬을 사용하여 애플리케이션을 위한 간단한 데이터 모델을 만들고, 작업의 상태를 관리하도록 할 것입니다.

먼저, `src/lib/state` 디렉토리의 `store.svelte.ts` 파일에서 작업의 상태를 변경하는 액션에 반응하는 간단한 스토어를 구성합니다(의도적으로 단순하게 만든 예제입니다):

```ts:title=src/lib/state/store.svelte.ts
// 룬(상태 업데이트)과 초기 데이터를 이용한 간단한 Svelte 상태 관리 구현.
// 실제 앱은 더 복잡하고 다른 파일로 분리되어 있을 것 입니다.
import type { TaskData } from '../../types';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}
/*
 * 앱이 로드되었을 때의 초기 상태.
 * 보통은 이것을 서버에서 불러오지만(fetch), 지금은 신경쓰지 맙시다.
 */
const defaultTasks: TaskData[] = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const initialState: TaskBoxState = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};


export const store = $state<TaskBoxState>(initialState);

// 작업을 보관하는 함수
export function archiveTask(id: string) {
  const filteredTasks = store.tasks
    .map((task): TaskData =>
      task.id === id ? { ...task, state: 'TASK_ARCHIVED' as TaskData['state'] } : task
    )
    .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');
  store.tasks = filteredTasks;
}

// 작업을 고정시키는 함수
export function pinTask(id: string) {
  const task = store.tasks.find((task) => task.id === id);
  if (task) {
    task.state = 'TASK_PINNED';
  }
}
```

다음으로, 스토어에서 데이터를 읽어오도록 `TaskList`를 변경합니다. 먼저 기존의 프레젠테이셔널 버전을 `src/lib/components/PureTaskList.svelte`로 옮기고, 컨테이너로 감쌉니다:

`src/lib/components/PureTaskList.svelte`에서:

```html:title=src/lib/components/PureTaskList.svelte
<!--이 파일은 TaskList.svelte에서 옮겨졌습니다-->
<script lang="ts">
  import type { TaskData } from '../../types';

  import Task from './Task.svelte';

  import LoadingRow from './LoadingRow.svelte';

  interface Props {
    /** 로딩 상태인지 아닌지 확인 */
    loading?: boolean;
    /** 작업 목록 */
    tasks: TaskData[];
    /** 작업을 고정시키는 이벤트 */
    onPinTask: (id: string) => void;
    /** 작업을 보관하는 이벤트 */
    onArchiveTask: (id: string) => void;
  }

  const {
    loading = false,
    tasks = [],
    onPinTask,
    onArchiveTask,
  }: Props = $props();

  const noTasks = $derived(tasks.length === 0);
  const tasksInOrder = $derived([
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ]);
</script>

{#if loading}
  <<div class="list-items" data-testid="loading" id="loading">
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
    <LoadingRow />
  </div>
{/if}
{#if !loading && noTasks}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check"></span>
      <p class="title-message">You have no tasks</p>
      <p class="subtitle-message">Sit back and relax</p>
    </div>
  </div>
{/if}

{#each tasksInOrder as task}
  <Task {task} {onPinTask} {onArchiveTask} />
{/each}
```

`src/lib/components/TaskList.svelte`에서는:

```html:title=src/lib/components/TaskList.svelte
<script lang="ts">
  import { archiveTask, pinTask, store } from '../state/store.svelte';

  import PureTaskList from './PureTaskList.svelte';
</script>

<PureTaskList
  loading={store.status === "loading"}
  tasks={store.tasks}
  onPinTask={pinTask}
  onArchiveTask={archiveTask}
/>
```

`TaskList`의 프레젠테이셔널 버전을 분리해두는 이유는 컴포넌트를 격리시켜서 더 쉽게 테스트하기 위함입니다. `PureTaskList` 컴포넌트는 스토어의 존재에 의존하지 않기 때문에 테스트에서 다루기가 훨씬 수월합니다. `src/lib/components/TaskList.stories.svelte` 파일 이름을 `src/lib/components/PureTaskList.stories.svelte`로 수정하고, 스토리가 프레젠테이셔널 버전을 사용하도록 합니다:

```html:title=src/lib/components/PureTaskList.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import PureTaskList from './PureTaskList.svelte';
  import MarginDecorator from './MarginDecorator.svelte';

  import * as TaskStories from './Task.stories.svelte';

  export const TaskListData = [
    { ...TaskStories.TaskData, id: '1', title: 'Task 1' },
    { ...TaskStories.TaskData, id: '2', title: 'Task 2' },
    { ...TaskStories.TaskData, id: '3', title: 'Task 3' },
    { ...TaskStories.TaskData, id: '4', title: 'Task 4' },
    { ...TaskStories.TaskData, id: '5', title: 'Task 5' },
    { ...TaskStories.TaskData, id: '6', title: 'Task 6' },
  ];

  const { Story } = defineMeta({
    component: PureTaskList,
    title: 'PureTaskList',
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
    decorators: [() => MarginDecorator],
    args: {
      ...TaskStories.TaskData.events,
    },
  });
</script>

<Story
  name="Default"
  args={{
    tasks: TaskListData,
    loading: false,
  }}
/>
<Story
  name="WithPinnedTasks"
  args={{
    tasks: [
      ...TaskListData.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  }}
/>

<Story
  name="Loading"
  args={{
    tasks: [],
    loading: true,
  }}
/>

<Story
  name="Empty"
  args={{
    tasks: TaskListData.slice(0, 0),
    loading: false,
  }}
/>
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-puretasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>

이제 Svelte 스토어에서 가져온 실제 데이터로 컴포넌트를 채웠습니다. `src/App.svelte`에 연결하여 렌더링 할 차례입니다. 다음 챕터에서 다룰 예정이니 걱정하지 마세요.
