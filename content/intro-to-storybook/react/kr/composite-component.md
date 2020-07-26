---
title: '복합적인 컴포넌트 만들기'
tocTitle: '복합적인 컴포넌트'
description: '간단한 컴포넌트로 복합적인 컴포넌트를 만들어봅시다'
commit: 'c43580d'
---

저희는 지난 챕터에서 첫 번째 컴포넌트를 만들어보았습니다. 이번 챕터에서는 이전에 학습한 내용을 바탕으로 Task의 목록인 `TaskList`를 만들어보겠습니다. 컴포넌트를 결합하여 복잡성이 커지는 경우 어떤 일이 일어나는지 함께 살펴보겠습니다.

## Tasklist

Taskbox는 핀으로 고정된 과업들을 일반 과업들 위에 배치하여 강조합니다. 따라서 일반 과업과 핀으로 고정된 과업에 대한 두 가지 유형의 `TaskList` 스토리를 만들어야 합니다.

![일반 과업과 핀으로 고정된 과업](/intro-to-storybook/tasklist-states-1.png)

`Task` 데이터는 비동기식으로 전송될 수 있기 때문에, 연결이 없는 상태를 랜더링 할 수 있도록 로딩 state **또한** 필요합니다. 과업이 없는 경우를 위해 비어있는 state도 필요할 것입니다.

![로딩 중 과업과 비어있는 과업](/intro-to-storybook/tasklist-states-2.png)

## 설정 시작하기

복합적인 컴포넌트는 기본 컴포넌트와 크게 다르지 않습니다. `TaskList` 컴포넌트와 그에 해당하는 스토리 파일을 만들어보겠습니다. `src/components/TaskList.js` 와 `src/components/TaskList.stories.js`를 생성해주세요.

우선 `TaskList`의 대략적인 구현부터 시작하겠습니다. 이전의 `Task` 컴포넌트를 가져오신 후, 속성과 액션을 입력값으로 전달해주세요.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

다음으로 `Tasklist`의 테스트 상태를 스토리 파일에 작성합니다.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
  excludeStories: /.*Data$/,
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];

export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

export const Default = () => <TaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <TaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <TaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <TaskList tasks={[]} {...actionsData} />;
```

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>데코레이터(Decorators)</b></a>는 스토리에 임의의 래퍼(wrapper)를 제공하는 한 방법입니다. 위의 예시에서 우리는 데코레이터 `키`를 사용하여 기본 내보내기에서 랜더링 된 컴포넌트에 `패딩`을 추가합니다. 또한 데코레이터는 “providers”(React context를 설정하는 라이브러리 컴포넌트)에서 스토리를 감싸 줄 때 사용될 수 있습니다.
</div>

`taskData`는 `Task.stories.js`에서 생성 및 내보냈던 `Task` 데이터의 형식을 제공합니다. 마찬가지로 `actionsData`는 `Task` 컴포넌트가 기대하는 액션(mocked callbacks)을 정의하며 이는 `TaskList`에서도 필요합니다.

이제 Storybook에서 새로운 `TaskList` 스토리를 확인해보겠습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## States 구현하기

우리의 컴포넌트는 아직 기본 뼈대만을 갖추었지만, 앞으로 작업하게 될 스토리에 대한 아이디어를 얻었습니다. `.list-items` wrapper가 지나치게 단순하다고 생각하실지도 모르겠습니다. 맞습니다! 대부분의 경우에 우리는 단지 wrapper를 추가하기 위해서 새로운 컴포넌트를 만들지 않습니다. 하지만 `TaskList` 컴포넌트의 **진정한 복잡성**은 `withPinnedTasks`, `loading`, 그리고 `empty`에서 드러날 것입니다.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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
      <div className="list-items">
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
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

위에서 추가된 마크업으로 다음과 같은 UI가 나타납니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

목록에서 핀으로 고정된 과업의 위치를 확인해주세요. 사용자들을 위해 핀으로 고정된 과업을 목록의 맨 위에 위치하도록 하여 우선순위를 부여하려고 합니다.

## 데이터 요구사항 및 props

컴포넌트가 커질수록 입력에 필요한 데이터 요구사항도 함께 커집니다. `TaskList`에서 prop의 요구사항을 정의해봅시다. `Task`는 하위 컴포넌트이기 때문에 렌더링에 필요한 적합한 형태의 데이터가 제공되는지 확인해야 합니다. 시간 절약을 위해서 `Task`에서 사용한 propTypes을 재사용하겠습니다.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## 자동화된 테스트

이전 챕터에서 우리는 Storyshots을 이용하여 스냅샷 테스트하는 법을 배워보았습니다. `Task`에서는 렌더링이 잘 되는지 확인하는 것 이상의 많은 복잡성이 필요하지는 않았습니다. `TaskList`에서는 복잡성이 더해지기 때문에 특정 입력이 자동화된 테스트에 적합한 방식으로 특정 출력을 생성하는지에 대해 확인해야 합니다. 이를 위해 테스트 renderer와 함께 [Jest](https://facebook.github.io/jest/)를 사용하여 단위 테스트를 만들어 보겠습니다.

![Jest 로고](/intro-to-storybook/logo-jest.png)

### Jest를 사용한 단위 테스트(Unit test)

Storybook 스토리, 수동 테스트, 스냅샷 테스트는 UI 버그를 피하는 데 큰 도움이 됩니다. 스토리가 광범위한 컴포넌트 사용 사례를 다루고 있으며 사람이 스토리의 변경 사항을 확인하도록 하는 도구를 사용한다면 오류의 가능성을 훨씬 줄일 수 있습니다.

그러나, 때로는 나쁜 악마는 세부 사항에 있습니다. 그러한 세부 사항을 명확히 하기 위해서 테스트 프레임워크가 필요합니다. 이는 우리에게 단위 테스트의 필요성을 가져다줍니다.

우리의 경우에는 `TaskList`가`tasks` prop에서 전달된 일반 과업보다 핀으로 고정된 과업을 **먼저** 랜더링 하기를 원합니다. 이러한 특정 시나리오를 테스트하는 스토리인 (`WithPinnedTasks`)가 있다 할지라도, 사람이 검토하는 경우에 컴포넌트가 과업의 순서를 바르게 정렬하지 않는 버그의 경우에 판단하기 애매모호할 수 있습니다. 일반적인 시선에는 딱히 **“잘못되었어!”**라고 보이지 않을 것입니다.

따라서 이러한 문제를 피하기 위해, 우리는 Jest를 사용하여 스토리를 DOM에 랜더링 하고 출력의 두드러진 특징을 확인하기 위해 DOM 쿼리 코드를 실행할 수 있습니다. 스토리 형식의 좋은 점은 우리가 간단히 스토리를 테스트에 가져온 후, 거기에서 랜더링 할 수 있다는 점입니다.

`src/components/TaskList.test.js`라는 테스트 파일을 만들어주세요. 여기서, 출력 값을 검증하는 테스트를 만들어보겠습니다.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithPinnedTasks />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList 테스트 러너](/intro-to-storybook/tasklist-testrunner.png)

이와 같이 `WithPinnedTasks` 스토리를 단위 테스트에서 재사용할 수 있었습니다. 이러한 방식으로 기존의 자원(컴포넌트의 흥미로운 구성을 나타내는 예)을 여러가지 방법으로 계속 활용할 수 있습니다.

단위 테스트는 매우 취약할 수 있다는 것도 아셔야 합니다. 프로젝트가 성숙함에 따라, `Task`의 정확한 구현이 변할 수 있습니다. 어쩌면 다른 클래스명을 사용하거나 `input` 대신 `textarea`를 사용하여 테스트가 실패하게 되면 업데이트가 필요할 수 있습니다. 이것이 꼭 문제라기보다는 UI에 대한 단위 테스트를 자유롭게 사용하는 것에 주의해야 한다는 지표입니다. 단위 테스트는 유지 관리하기가 쉽지 않습니다. 가능한 경우 수동, 스냅샷, 시각적 회귀 테스트([테스트 챕터](/react/kr/test/) 보기)를 사용하세요.
