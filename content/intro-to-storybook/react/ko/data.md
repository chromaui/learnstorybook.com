---
title: '데이터 연결하기'
tocTitle: '데이터'
description: 'UI 컴포넌트에 데이터를 연결하는 방법을 배워봅시다'
commit: 'd2fca1f'
---

지금까지 우리는 독립된 환경에서 상태를 가지지 않는(stateless) 컴포넌트를 만들어보았습니다. 이는 Storybook에는 적합하지만 앱에 데이터를 제공하기 전까지는 유용하지 않습니다.

이번 튜토리얼에서는 앱 제작의 세부 사항에 중점을 두지 않기 때문에 자세히 설명하지 않을 것입니다. 그보다 컨테이너 컴포넌트(container components)에 데이터를 연결하는 일반적인 패턴을 살펴보도록 하겠습니다.

## 컨테이너 컴포넌트

현재 작성된 `TaskList`는 구현됨에 있어서 외부와 어떠한 대화도 하지 않기 때문에 “표상적(presentational)”이라고 할 수 있습니다. ([이 블로그 포스트](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)를 참조해주세요. 데이터를 얻기 위해서는 “컨테이너(container)”가 필요합니다.)

이 예제는 데이터 저장을 위해 가장 널리 사용되는 React 라이브러리인 [Redux](https://redux.js.org/)를 사용하여 앱을 위해 간단한 데이터 모델을 만듭니다. 여기서 사용된 패턴은 [Apollo](https://www.apollographql.com/client/)와 [MobX](https://mobx.js.org/) 같은 다른 데이터 관리 라이브러리에도 적용됩니다.

프로젝트에 필수 dependency를 다음과 같이 설치해주세요.

```bash
yarn add react-redux redux
```

먼저 `src` 폴더의 `lib / redux.js` 파일 (의도적으로 단순하게 작성함)에서 task의 state를 변경하는 동작에 대응하는 간단한 Redux 저장소를 구성해보겠습니다.

```javascript
// src/lib/redux.js

// A simple redux store/actions/reducer implementation.
// A true app would be more complex and separated into different files.
import { createStore } from 'redux';

// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// All our reducers simply change the state of a single task.
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

// The reducer describes how the contents of the store change for each action
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

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// We export the constructed redux store
export default createStore(reducer, { tasks: defaultTasks });
```

그런 다음 `TaskList` 컴포넌트에서 default export를 업데이트하여 redux store에 연결하고 task를 렌더링 합니다.

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
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
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

이제 Redux에서 받은 실제 데이터로 생성된 컴포넌트가 있으므로, 이를 `src/app.js`에 연결하여 컴포넌트를 렌더링 할 수 있습니다. 그러나 지금은 먼저 컴포넌트 중심의 여정을 계속해나가도록 하겠습니다.

그에 대한 내용은 다음 챕터에서 다룰 것이므로 걱정하지 않으셔도 됩니다.

이 단계에서 `TaskList`는 컨테이너이며 더이상 어떠한 props도 받지 않기 때문에 Storybook 테스트는 작동을 멈추었을 것입니다. 대신 `TaskList`는 Redux store에 연결하고 이를 감싸는 `PureTaskList`에서 props를 설정합니다.

하지만 이전 단계에서 진행한 Storybook 스토리의 내보내기 구문에 `PureTaskList`(표상적인 컴포넌트)를 간단하게 렌더링함으로써 이러한 문제를 쉽게 해결할 수 있습니다.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import { PureTaskList } from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: PureTaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <PureTaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
이 단계에서 스냅샷 테스트가 실패하는 경우, <code>-u</code> 플래그와 함께 테스트 스크립트를 실행하여 기존의 스냅샷을 업데이트해야 합니다. 또한 앱이 점진적으로 성장함에 따라 <a href="/react/ko/get-started/">시작하기</a> 부분에서 언급된 것처럼 <code> --watchAll</code> 플래그로 테스트를 시작하기에 좋은 시점일 수 있습니다.
</div>
