---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면을 구성해봅시다'
commit: '79829b2'
---

지금까지 작은 것에서부터 시작하여 복잡성을 점점 더하는 상향식의 UI를 만드는 것에 집중해왔습니다. 이를 통해 각 컴포넌트를 독립적으로 개발하고 데이터의 요구 사항을 파악하며 Storybook에서 사용해 볼 수 있었습니다. 모두 서버를 구축하거나 화면을 만들 필요가 없었습니다!

이번 챕터에서는 화면에서 컴포넌트를 결합하고 Storybook에서 그 화면을 개발함으로써 계속하여 완성도를 높여보겠습니다.

## 중첩된 컨테이너 컴포넌트

앱이 매우 간단하므로 우리가 만들 화면은 매우 사소합니다. 

일부 레이아웃에서 `TaskList` 컴포넌트 (Redux를 통해 자체적으로 데이터를 제공함)을 감싸고, 최상위 레벨의 `error` 필드를 Redux에서 가져오는 것입니다(이 에러는 서버 연결에 문제가 있으면 설정되는 항목이라고 가정해봅시다). `InboxScreen.js`를 `components`폴더 안에 생성해주세요.

Redux 스토어('src/lib/store.js')를 업데이트하여 설정하고자 하는 에러 필드를 포함시켜봅시다.

```diff:title=src/lib/store.js
 /* 간단한 리덕스 스토어/액션/리듀서 구현
 * 실제 앱은 훨씬 더 복잡하고 파일들이 분리되어 있습니다.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

+ // 새로운 에러 필드는 여기에서 설정합니다.
+ const AppStateSlice = createSlice({
+   name: "appState",
+   initialState: "",
+   reducers: {
+     updateAppState: (state, action) => {
+       return {
+         ...state,
+         isError: action.payload,
+       };
+     },
+   },
+ });

/*
 * 앱이 로드될 때의 저장소 초기 상태
 * 보통은 서버로부터 데이터를 가져옵니다.
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

/*
 * 여기서 저장소는 만들어집니다.
 * 'slice'의 자세한 정보는 아래 문서에서 확인할 수 있습니다.
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'tasks',
  initialState: defaultTasks,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.findIndex(task => task.id === id);
      if (task >= 0) {
        state[task].state = newTaskState;
      }
    },
  },
});


// slice 속 포함된 액션 사용을 위해 컴포넌트로부터 내보내집니다. 
export const { updateTaskState } = TasksSlice.actions;

+ // 새로운 slice에 포함된 액션은 컴포넌트에서 사용하기 위해 선언되었습니다.
+ export const { updateAppState } = AppStateSlice.actions;

/*
 * 앱의 저장소 환경설정은 다음과 같습니다.
 * 리덕스의 configureStore 의 자세한 정보는 아래 문서에서 확인할 수 있습니다.
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    tasks: TasksSlice.reducer,
+   isError: AppStateSlice.reducer,
  },
});

export default store;

```
이제 새롭게 업데이트된 스토어가 생겼습니다. `src/components` 폴더에 `InboxScreen.js` 파일을 만들어봅시다.

```js:title=src/components/InboxScreen.js
import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { TaskList } from './TaskList';

export function PureInboxScreen({ error }) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  /** 에러 메시지 */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export function InboxScreen() {
  // 업데이트한 스토어로부터 에러를 조회합니다.
  const isError = useSelector(state => state.isError);

  return <PureInboxScreen error={isError} />;
}
```

또한 `App` 컴포넌트를 변경하여 `InboxScreen`을 렌더링 합니다. (올바른 화면 선택을 위하여 router를 사용해도 되지만 여기서는 걱정하지 않도록 하겠습니다.)

```diff:title=src/App.js
- import logo from './logo.svg';
- import './App.css';
+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import { InboxScreen } from './components/InboxScreen';

function App() {
  return (
-   <div className="App">
-     <header className="App-header">
-       <img src={logo} className="App-logo" alt="logo" />
-       <p>
-         Edit <code>src/App.js</code> and save to reload.
-       </p>
-       <a
-         className="App-link"
-         href="https://reactjs.org"
-         target="_blank"
-         rel="noopener noreferrer"
-       >
-         Learn React
-       </a>
-     </header>
-    </div>
+  <Provider store={store}>
+    <InboxScreen />
+   </Provider>
  );
}

export default App;
```

<div class="aside"><p>test 파일을 업데이트하는 것을 잊지마세요 <code>src/App.test.js</code>. 그렇지 않으면 테스트에 실패할 수 있습니다.</p></div>

그러나 여기서 흥미로운 점은 Storybook에서 스토리를 렌더링 할 때입니다.

앞에서 살펴보았듯이 `TaskList` 컴포넌트는 `PureTaskList`라는 표상적 컴포넌트를 렌더링 하는 **컨테이너(container)**입니다. 정의에 의하면 컨테이너 컴포넌트는 독립적인 환경에서 간단하게 렌더링 될 수 없습니다. 컨테이너 컴포넌트는 어떠한 컨텍스트가 전달되거나 서비스에 연결되기를 기대하기 때문입니다. 이것이 의미하는 것은 Storybook에서 컨테이너를 렌더링 하기 위해서는 필요한 컨텍스트나 서비스를 mock(예를 들어, 가상 버전을 제공하기)하여야 한다는 것입니다.

`TaskList`을 Storybook에 배치할 때 `PureTaskList`를 렌더링하고 컨테이너를 피함으로써 이 문제에서 벗어날 수 있습니다. 이와 비슷한 방식으로 `PureInboxScreen`을 Storybook에 렌더링 할 것입니다.

하지만 `PureInboxScreen` 자체는 표상적 컴포넌트이지만 그 하위 컴포넌트인 `TaskList`는 아니기 때문에 문제가 발생합니다. 어떤 의미에서 보면 `PureInboxScreen`는 “컨테이너화”되는 것에 의해 오염되었다고 볼 수 있습니다. 따라서 `InboxScreen.stories.js`에서 스토리를 설정할 때:

```js:title=src/components/PureInboxScreen.stories.js
import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
};

const Template = (args) => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

비록 `error` 스토리가 제대로 작동할지라도, `TaskList`에 연결할 Redux store가 없기 때문에 `default` 스토리에 문제가 있음을 알 수 있습니다. (또한 단위 테스트로 `PureInboxScreen`을 테스트할 때도 비슷한 문제가 발생할 것입니다.)

![고장난 inbox](/intro-to-storybook/broken-inboxscreen.png)

이 문제를 피하는 한 가지 방법으로 앱의 최상위 수준에서만 컨테이너 컴포넌트를 렌더링 하는 대신 필요한 모든 데이터를 상위의 컴포넌트에서 하위의 컴포넌트로 전달하는 것입니다.

그러나 개발자가 불가피하게 컴포넌트 계층의 하위 계층에서 컨테이너를 렌더링 할 **필요가 생길 것입니다**. Storybook에서 전체 또는 대부분의 앱을 렌더링하려면 우리는 이러한 문제에 대한 해결책이 필요합니다.

<div class="aside">
여담으로 데이터를 하위 계층에 전달하는 것은 합당한 접근 방식입니다. 특히 <a href="http://graphql.org/">GraphQL</a>을 사용하는 경우에 그렇습니다. 저희는 <a href="https://www.chromatic.com">Chromatic</a>을 만들 때 이러한 방법으로 800개 이상의 스토리를 만들었습니다.
</div>

## decorators와 함께 컨텍스트를 제공하기

좋은 소식은 스토리 내에서 `InboxScreen`에 Redux store를 제공하기가 매우 쉽다는 것입니다! decorators를 통해 모방된 Redux store를 사용하면 됩니다.

```diff:title=src/components/PureInboxScreen.stories.js
import React from 'react';
+ import { Provider } from 'react-redux';
+ import { configureStore, createSlice } from '@reduxjs/toolkit';

import { PureInboxScreen } from './InboxScreen';

+ import * as TaskListStories from './TaskList.stories';

+ // A super-simple mock of a redux store
+  const Mockstore = configureStore({
+    reducer: {
+      tasks: createSlice({
+        name: 'tasks',
+        initialState: TaskListStories.Default.args.tasks,
+        reducers: {
+          updateTaskState: (state, action) => {
+            const { id, newTaskState } = action.payload;
+            const task = state.findIndex((task) => task.id === id);
+            if (task >= 0) {
+              state[task].state = newTaskState;
+            }
+          },
+        },
+      }).reducer,
+    },
+  });

export default {
  component: PureInboxScreen,
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  title: 'InboxScreen',
};

const Template = (args) => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

[Apollo](https://www.npmjs.com/package/apollo-storybook-decorator)와 [Relay](https://github.com/orta/react-storybooks-relay-container) 등 여타 데이터 라이브러리에 대해서도 모방된 컨텍스트를 제공하는 방식은 비슷합니다.

Storybook에서 state를 순환해봄으로써 우리가 올바르게 하고 있는지를 쉽게 테스트할 수 있도록 해줍니다:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>


## 인터랙티브 스토리

지금까지 우리는 간단한 컴포넌트에서 시작하여 화면에 이르기까지 각 변경사항을 지속적으로 테스트하며 처음부터 완벽히 작동하는 애플리케이션을 구축할 수 있었습니다. 그러나 각 새로운 스토리는 UI가 깨지지 않도록 모든 스토리들에 대해 직접 확인되어야 합니다. 추가 작업들이 정말 많네요.

이 워크플로우를 자동화하고 컴포넌트와 자동으로 상호 작용할 수 없을까요?

스토리북의 [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 기능을 활용하면 됩니다. 플레이 기능은 스토리가 렌더링된 후 실행되는 코드 스니핏(snippets)을 포함합니다.

플레이 기능은 업데이트될 때 UI를 추적하는 데 도움이 됩니다. 프레임워크에 구애받지 않는 DOM API를 사용하므로 플레이 기능으로 스토리를 작성하여 UI와 상호 작용하고 프런트엔드 프레임워크에 상관없이 시뮬레이션할 수 있습니다.

그럼 지금부터 살펴봅시다! 새로 만든 `PureInboxScreen` 스토리를 업데이트하고 다음을 추가하여 컴포넌트 상호 작용을 설정합니다.

```diff:title=src/components/PureInboxScreen.stories.js
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
+ import { fireEvent, within } from '@storybook/testing-library';

import { PureInboxScreen } from './InboxScreen';

import * as TaskListStories from './TaskList.stories';

 // Redux store의 아주 간단한 가상 버전(mock)
const Mockstore = configureStore({
  reducer: {
    tasks: createSlice({
      name: 'tasks',
      initialState: TaskListStories.Default.args.tasks,
      reducers: {
        updateTaskState: (state, action) => {
          const { id, newTaskState } = action.payload;
          const task = state.findIndex((task) => task.id === id);
          if (task >= 0) {
            state[task].state = newTaskState;
          }
        },
      },
    }).reducer,
  },
});

export default {
  component: PureInboxScreen,
  decorators: [story => <Provider store={Mockstore}>{story()}</Provider>],
  title: 'PureInboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};

+ export const WithInteractions = Template.bind({});
+ WithInteractions.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // 첫번째 작업을 고정하는 시뮬레이션
+   await fireEvent.click(canvas.getByLabelText("pinTask-1"));
+   // 세번째 작업을 고정하는 시뮬레이션
+   await fireEvent.click(canvas.getByLabelText("pinTask-3"));
+ };
```

새로 만든 스토리를 확인해주세요. `Interactions` 패널을 클릭하면 스토리의 플레이 기능 내부의 상호 작용 목록을 볼 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

플레이 기능을 통해 UI와 상호 작용하고 작업을 업데이트하면 UI가 어떻게 반응하는지 빠르게 확인할 수 있습니다. 따라서 별도의 작업 없이 UI가 똑같이 유지됩니다. 테스트 환경을 가동하거나 패키지를 추가할 필요가 없습니다.

## 컴포넌트 기반 개발

우리는 가장 아래에 해당하는 `Task`로부터 시작하여, `TaskList`로 진행하였고 이제 전체 화면을 구성하는 UI를 완성하였습니다. `InboxScreen`은 중첩된 컨테이너 컴포넌트를 수용하고 그에 수반하는 스토리들을 포함하고 있습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**컴포넌트 기반 개발 (Component-Driven Development)**](https://www.componentdriven.org/)은 컴포넌트의 상위 계층으로 올라감에 따른 복잡성을 점진적으로 확장할 수 있도록 해줍니다. 이것의 이점 중 하나는 보다 개발 과정에 집중할 수 있으며 가능한 모든 UI 순열의 적용 범위가 늘어난다는 것입니다. 간단히 말하면, 컴포넌트 기반 개발(CDD)은 더 높은 품질과 복잡성을 가진 사용자 인터페이스를 만들 수 있도록 도와줍니다.

아직 끝이 아닙니다! UI가 완성되었다고 할 일이 모두 끝난 것은 아닙니다. 또한 우리는 시간이 지나도 UI가 내구성을 유지할 수 있도록 해야 합니다.

<div class="aside">
💡 깃에 변경한 내역들을 커밋 하는 것도 잊지 마세요!
</div>
