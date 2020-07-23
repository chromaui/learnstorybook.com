---
title: '데이터 연결'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워봅시다'
commit: 'f05981b'
---

지금까지 우리는 독립된 환경에서 상태를 가지지 않는(stateless) 컴포넌트를 만들어보았습니다. 이는 Storybook에는 적합하지만, 궁극적으로 앱에서 데이터를 제공하 할 때까지는 유용하지 않습니다.

이번 튜토리얼에서는 앱 제작의 세부 사항에 중점을 두지 않으므로 여기서 자세히 설명하지 않을 것입니다. 그보다 컨테이너 컴포넌트에 데이터를 연결하는 일반적인 패턴을 살펴보겠습니다.

## 컨테이너 컴포넌트

현재 작성된 우리의 `TaskList`는 “presentational” 컴포넌트 입니다. ([이 블로그 포스트](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)를 참조해주세요. 이는 데이터를 제공하는 “container”와 대비됩니다.)

이 예제는 데이터 저장을 위해 가장 널리 사용되는 React 라이브러리인 [리덕스(Redux)](https://redux.js.org/)를 사용하여 앱을 위해 간단한 데이터 모델을 만듭니다. 여기서 사용 된 패턴은 [Apollo](https://www.apollographql.com/client/)와 [MobX](https://mobx.js.org/) 같은 다른 데이터 관리 라이브러리에도 적용됩니다.

프로젝트에 필수 디펜던시를 다음과 같이 설치해주세요.

```bash
yarn add react-redux redux
```

먼저 `src` 폴더의`lib / redux.js` 파일 (의도적으로 단순하게 함) 에서 작업 상태를 변경하는 동작에 대응하는 간단한 Redux 저장소를 구성해보겠습니다.

```javascript
// src/lib/redux.js

// 간단한 Redux store / actions / reducer 구현.
// 진정한 앱은 이보다 더 복잡하며 여러 파일로 분리됩니다.
import { createStore } from 'redux';

// actions은 store에 발생할 수있는 변경사항의 "이름"입니다.
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// action creators는 actions을 실행하는데 필요한 데이터와 action을 함께 묶어줍니다.
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// 모든 reducers들은 단순히 하나의 작업에 대한 상태를 변경합니다.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map(task =>
        task.id === action.id ? { ...task, state: taskState } : task
      ),
    };
  };
}

// reducer는 각 action에 대해 store의 내용이 어떻게 변하는지 설명해줍니다.
export const reducer = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state;
  }
};

// 앱이 로딩될때 store가 갖고있는 처음의 상태입니다.
// 보통은 서버에서 이를 가져옵니다
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// 구성된 Redux store를 내보냅니다
export default createStore(reducer, { tasks: defaultTasks });
```

그런 다음 `TaskList` 컴포넌트에서 기본 내보내기를 업데이트하여 redux store에 연결하고 작업을 렌더링합니다.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';
import { connect } from 'react-redux';
import { archiveTask, pinTask } from '../lib/redux';

export function PureTaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  /* previous implementation of TaskList */
}

PureTaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

PureTaskList.defaultProps = {
  loading: false,
};

export default connect(
  ({ tasks }) => ({
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  }),
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(PureTaskList);
```

이 단계에서 Storybook 테스트는 작동을 멈출 것입니다. `TaskList` 컴포넌트는 새로운 컨테이너이기 때문에 더이상 props을 받지 않는 대신 이를 감싸는 `PureTaskList` 컴포넌트에서 store에 연결하고 props를 설정합니다.

하지만, 우리는 이전 단계에서 진행한 Storybook의 스토리의 내보내기 구문에 `PureTaskList`(presentational 컴포넌트)를 간단하게 랜더링함으로써 이 문제를 쉽게 해결할 수 있습니다.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: PureTaskList,
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

export const Default = () => <PureTaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <PureTaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <PureTaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <PureTaskList tasks={[]} {...actionsData} />;
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
이 단계에서 스냅샷 테스트가 실패할 것이며, 여러분은 <code>-u</code> 플래그와 함께 테스트 스크립트를 실행하여 기존의 스냅샷을 업데이트 하셔야 합니다. 또한 앱이 점진적으로 성장함에 따라 <a href="/react/kr/get-started/">시작하기</a> 부분에서 언급된 것처럼 <code> --watchAll</code> 플래그로 테스트를 시작하기에 좋은 장소일 수도 있습니다.
</div>
