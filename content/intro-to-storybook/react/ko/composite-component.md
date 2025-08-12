---
title: '복합적 컴포넌트 조합하기'
tocTitle: '복합적 컴포넌트'
description: '간단한 컴포넌트로 복합적 컴포넌트를 조합해보세요'
commit: 'cfa25b6'
---

지난 챕터에서 첫 번째 컴포넌트를 만들어보았습니다. 이번 챕터에서는 이전에 학습한 내용을 바탕으로 Task의 목록인 TaskList를 만들어보겠습니다. 컴포넌트를 결합하여 복잡성이 커지는 경우 어떤 일이 일어나는지 함께 살펴보겠습니다.

## Tasklist

Taskbox는 핀으로 고정된 task를 일반 task 위에 배치하여 강조합니다. 따라서 일반 task와 핀으로 고정된 task에 대한 두 가지 유형의 `TaskList` 스토리(story)를 만들어야 합니다.

![일반 task과 핀으로 고정된 task](/intro-to-storybook/tasklist-states-1.png)

`Task` 데이터는 비동기식으로 전송될 수 있기 때문에, 연결이 없는 상태를 렌더링 할 수 있도록 로딩 상태(state) **또한** 필요합니다. task가 없는 경우를 위해 비어있는 상태도 필요할 것입니다.

![로딩 중 task과 빈 task](/intro-to-storybook/tasklist-states-2.png)

## 설정하기

복합 컴포넌트는 기본 컴포넌트와 크게 다르지 않습니다. `TaskList` 컴포넌트와 그에 해당하는 스토리 파일을 만들어보겠습니다. `src/components/TaskList.jsx` 와 `src/components/TaskList.stories.jsx`를 생성해 주세요.

우선 `TaskList`의 대략적인 구현부터 시작하겠습니다. 이전의 `Task` 컴포넌트를 가져온 후, 속성과 액션을 입력값으로 전달해 주세요.

```tsx:title=src/components/TaskList.tsx
import type { TaskData } from '../types';

import Task from './Task';

type TaskListProps = {
  /** Checks if it's in loading state */
  loading?: boolean;
  /** The list of tasks */
  tasks: TaskData[];
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void;
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void;
};

export default function TaskList({
  loading = false,
  tasks,
  onPinTask,
  onArchiveTask,
}: TaskListProps) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

그리고, 스토리 파일 안에 `TaskList`의 테스트 상태값들을 만들어 보세요.

```tsx:title=src/components/TaskList.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';

import TaskList from './TaskList';

import * as TaskStories from './Task.stories';

const meta = {
  component: TaskList,
  title: 'TaskList',
  decorators: [(story) => <div style={{ margin: '3rem' }}>{story()}</div>],
  tags: ["autodocs"],
  args: {
    ...TaskStories.ActionsData,
  },
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.tsx.
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

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
  
💡 [**데코레이터(Decorators)**](https://storybook.js.org/docs/writing-stories/decorators)는 스토리에 임의의 래퍼(wrapper)를 제공하는 하나의 방법입니다. 이 예시에서 우리는 데코레이터 `key`를 사용하여 기본 내보내기에서 렌더링 된 컴포넌트에 `padding`을 추가합니다. 또한 데코레이터는 “providers”(React context를 설정하는 라이브러리 컴포넌트)에서 스토리를 감싸 줄 때 사용될 수 있습니다.

</div>

`TaskStories`를 가져옴으로써 최소한의 노력으로 스토리 속의 인수(arguments, 줄임말로 args)를 [구성(compose)](https://storybook.js.org/docs/react/writing-stories/args#args-composition)할 수 있었습니다.

이를 통해 두 컴포넌트가 받을 수 있는 데이터와 액션(mocked callbacks)이 모두 보존됩니다.

이제 스토리북에서 새로운 `TaskList` 스토리를 확인해보겠습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(States) 구현하기

우리의 컴포넌트는 아직 기본 뼈대만을 갖추었지만, 앞으로 작업하게 될 스토리에 대한 아이디어를 얻었습니다. `.list-items` 래퍼(wrapper)가 지나치게 단순하다고 생각할 수도 있습니다. 맞습니다! 대부분의 경우에 우리는 단지 래퍼(wrapper)를 추가하기 위해서 새로운 컴포넌트를 만들지 않습니다. 하지만 `TaskList` 컴포넌트의 **진정한 복잡성**은 `withPinnedTasks`, `loading` 그리고 `empty`에서 드러날 것입니다.

```tsx:title=src/components/TaskList.tsx
import type { TaskData } from '../types';

import Task from './Task';

type TaskListProps = {
  /** Checks if it's in loading state */
  loading?: boolean;
  /** The list of tasks */
  tasks: TaskData[];
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void;
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void;
};

export default function TaskList({
  loading = false,
  tasks,
  onPinTask,
  onArchiveTask,
}: TaskListProps) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

위에서 추가된 마크업으로 다음과 같은 UI가 나타납니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

목록에서 핀으로 고정된 task의 위치를 확인해 주세요. 핀으로 고정된 task를 사용자를 위해 목록의 맨 위에 위치하도록 우선순위를 부여합니다.

<div class="aside">
💡 깃(Git)에 변경된 사항을 commit하는 것을 잊지 마세요!
</div>
