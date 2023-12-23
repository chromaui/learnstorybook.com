---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면을 구성해봅시다'
commit: '2275632'
---

우리는 지금까지 작은 것에서부터 시작하여 복잡성을 점점 더하는 방식으로 UI를 만들었습니다. 이를 통해 각 컴포넌트를 독립적으로 개발하고 데이터의 요구 사항을 파악하며 스토리북(Storybook)에서 사용해 볼 수 있었습니다. 모두 서버를 구축하거나 화면을 만들 필요가 없었습니다!

이번 챕터에서는 화면에서 컴포넌트를 결합하고 스토리북에서 그 화면을 개발함으로써 계속하여 완성도를 높여보겠습니다.

## 화면에 연결

앱이 매우 간단하므로 우리가 만들 화면은 매우 간단합니다. 간단히 API에서 데이터를 가져와 `TaskList` 컴포넌트(리덕스(Redux)를 통해 자체적으로 데이터를 제공함)를 감싸고, 최상위 레벨의 `error` 필드를 리덕스에서 가져오는 것입니다.

원격 API에 연결하고 애플리케이션의 상태(즉, `error`, `succeeded`) 를 처리하도록 리덕스(Redux) 저장소 (`src/lib/store.js`)를 업데이트하는 것으로 시작하겠습니다.

```diff:title=src/lib/store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import {
  configureStore,
  createSlice,
+ createAsyncThunk,
} from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */

const TaskBoxData = {
  tasks: [],
  status: "idle",
  error: null,
};

/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
+ export const fetchTasks = createAsyncThunk('todos/fetchTodos', async () => {
+   const response = await fetch(
+     'https://jsonplaceholder.typicode.com/todos?userId=1'
+   );
+   const data = await response.json();
+   const result = data.map((task) => ({
+     id: `${task.id}`,
+     title: task.title,
+     state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
+   }));
+   return result;
+ });

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
+  extraReducers(builder) {
+    builder
+    .addCase(fetchTasks.pending, (state) => {
+      state.status = 'loading';
+      state.error = null;
+      state.tasks = [];
+    })
+    .addCase(fetchTasks.fulfilled, (state, action) => {
+      state.status = 'succeeded';
+      state.error = null;
+      // Add any fetched tasks to the array
+      state.tasks = action.payload;
+     })
+    .addCase(fetchTasks.rejected, (state) => {
+      state.status = 'failed';
+      state.error = "Something went wrong";
+      state.tasks = [];
+    });
+ },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

이제 원격 API 엔드포인트에서 데이터를 검색하여 스토어를 새롭게 업데이트 하고 앱의 다양한 상태를 처리하도록 준비했습니다. 이제 `src/components` 폴더에 `InboxScreen.js` 파일을 만들어봅시다:

```js:title=src/components/InboxScreen.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../lib/store';
import TaskList from './TaskList';

export default function InboxScreen() {
  const dispatch = useDispatch();
  // We're retrieving the error field from our updated store
  const { error } = useSelector((state) => state.taskbox);
  // The useEffect triggers the data fetching when the component is mounted
  useEffect(() => {
    dispatch(fetchTasks());
  }, []);

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
```

또한 `App` 컴포넌트를 변경하여 `InboxScreen`을 렌더링 합니다. (올바른 화면 선택을 위하여 router를 사용해도 되지만 여기서는 고려하지 않도록 하겠습니다.)

```diff:title=src/App.js
- import logo from './logo.svg';
- import './App.css';
+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

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
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

<div class="aside">💡 test 파일을 업데이트하는 것을 잊지마세요 <code>src/App.test.js</code>. 그렇지 않으면 테스트에 실패할 수 있습니다.</div>

그러나 여기서 흥미로운 점은 스토리북에서 스토리를 렌더링 할 때입니다.

앞에서 살펴보았듯이 `TaskList` 컴포넌트는 이제 **연결된** 컴포넌트가 되었습니다. 그리고 Redux 저장소에 의존하여 작업을 렌더링하고 있습니다.`InboxScreen` 또한 연결된 컴포넌트 이므로 비슷한 작업을 수행하고 따라서 `InboxScreen.stories.js`에서 스토리를 설정할 때에도 스토어를 제공할 수 있습니다.

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
export const Error = Template.bind({});
```

`error` 스토리에서 문제를 빠르게 찾아 낼 수 있습니다. 올바른 상태를 표시하는 대신 작업 목록을 표시해 줍니다. 이 문제를 피하는 한 가지 방법은 지난 장에서와 유사하게 각 상태에 대해 모의 버전을 제공하는 것이지만, 대신 이 문제를 해결하는데 도움이 되도록 잘 알려진 API mocking 라이브러리를 스토리북 애드온과 함께 사용합니다.

![고장난 inbox 스크린 상태](/intro-to-storybook/broken-inbox-error-state-optimized.png)

## 모의 API 서비스

우리의 애플리케이션은 매우 간단하고 원격 API 호출에 크게 의존하지 않기 때문에 [Mock Service Worker](https://mswjs.io/) 와 [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon)를 사용할 예정입니다. Mock Service Worker 는 모의 API 라이브러리입니다. 서비스 워커에 의존하여 네트워크 요청을 캡처하고 그 응답으로 모의 데이터를 제공합니다.

[Get started section](/intro-to-storybook/react/en/get-started)에서 앱을 설정할 때 두 패키지들이 함께 설치됩니다. 남은것은 이를 구성하고 사용하도록 스토리를 업데이트 하는 것입니다.

터미널에서 다음 명령을 실행하여 `public` 폴더 안에 일반 서비스 워커를 생성합니다:

```shell
yarn init-msw
```

그러면, 이후 `.storybook/preview.js` 를 업데이트 하고 초기화해야 합니다.

```diff:title=.storybook/preview.js
import '../src/index.css';

+ // Registers the msw addon
+ import { initialize, mswDecorator } from 'msw-storybook-addon';

+ // Initialize MSW
+ initialize();

+ // Provide the MSW addon decorator globally
+ export const decorators = [mswDecorator];

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

마지막으로 `InboxScreen` 스토리를 업데이트하고 모의 원격 API 호출 파라미터를 [parameter](https://storybook.js.org/docs/react/writing-stories/parameters) 포함합니다.

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';
import store from '../lib/store';
+ import { rest } from 'msw';
+ import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
+ Default.parameters = {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.json(MockedState.tasks));
+         }
+       ),
+     ],
+   },
+ };

export const Error = Template.bind({});
+ Error.parameters = {
+   msw: {
+     handlers: [
+       rest.get(
+         'https://jsonplaceholder.typicode.com/todos?userId=1',
+         (req, res, ctx) => {
+           return res(ctx.status(403));
+         }
+       ),
+     ],
+   },
+ };
```

<div class="aside">
💡 또 다른 방법으로, 가능한 접근 방식은 데이터를 계층 구조 아래로 전달하는 것입니다. 특히 <a href="http://graphql.org/">GraphQL</a> 을 사용할 때. 이것은 저희 <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> 이 800개 이상의 스토리를 구축한 방법입니다.
</div>

스토리북을 확인하면 `error` 스토리가 의도한 대로 작동하는지 확인 할 수있습니다. MSW 는 원격 API 호출을 가로채 적절한 응답을 제공합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized.mp4"
    type="video/mp4"
  />
</video>

## 인터랙티브 스토리

지금까지 간단한 구성 요소에서 시작하여 화면에 이르기까지 완전히 작동하는 응용 프로그램을 처음부터 구축하고 스토리를 사용하여 각 변경 사항을 지속적으로 테스트할 수 있었습니다. 그러나 각각의 새로운 스토리는 UI가 깨지지 않도록 다른 모든 스토리를 수동으로 확인해야 합니다. 그것은 많은 추가 작업입니다.

이 워크플로우를 자동화하고 구성요소와 자동으로 상호 작용할 수 없을까요?

스토리북의 [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 기능을 사용하면 그렇게 할 수있습니다.재생 기능에는 스토리가 렌더링된 후 실행되는 작은 코드 스니펫이 포함됩니다.

play 기능은 UI가 업데이트 될 때 어떤 일이 발생하는지 확인하는 데 도움이 됩니다. 이 기능은 프레임워크에 구애박지 않는 DOM API 를 사용합니다. 따라서 play 기능을 사용하면 프레임워크에 구애받지 않고 UI에 인터랙트 하고 사용자의 동작을 시뮬레이션 할 수있습니다.

그럼 이제 실행해 봅시다. 새로만든 `InboxScreen` 스토리를 업데이트하고 다음을 추가하여 컴포넌트 상호작용을 추가해 봅시다.

```diff:title=src/components/InboxScreen.stories.js
import React from 'react';

import InboxScreen from './InboxScreen';

import store from '../lib/store';
import { rest } from 'msw';
import { MockedState } from './TaskList.stories';
import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  within,
+  waitFor,
+  waitForElementToBeRemoved
+ } from '@storybook/testing-library';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

const Template = () => <InboxScreen />;

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: [
      rest.get(
        'https://jsonplaceholder.typicode.com/todos?userId=1',
        (req, res, ctx) => {
          return res(ctx.json(MockedState.tasks));
        }
      ),
    ],
  },
};

+ Default.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Waits for the component to transition from the loading state
+   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
+   // Waits for the component to be updated based on the store
+   await waitFor(async () => {
+     // Simulates pinning the first task
+     await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+     // Simulates pinning the third task
+     await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ };
```

새로 생성된 스토리를 확인하고, `Interaction` 패널을 클릭하여 스토리 재생 기능 내부의 상호작용 목록을 확인하세요

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-6-4.mp4"
    type="video/mp4"
  />
</video>

play 기능을 사용하면 작업을 업데이트 한 후 UI 가 어떻게 상호작용하고 응답하는지 빠르게 확인 할 수 있습니다. 추가 작업 없이 UI를 일관되게 유지할 수있으며 테스트 환경을 가동하거나 추가 패키지를 추가할 필요가 없습니다.

## 컴포넌트 주도 개발

처음 `Task` 에서 시작하여 `TaskList`로 진행 해 보았습니다. 이제 전체 화면 UI를 다룰 수 있습니다. 우리의 `InboxScreen` 은 연결된 컴포넌트들을 포함하며 스토리를 포함하고 있습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/)를 사용하면 구성 요소 계층 구조를 위로 이동하면서 복잡성을 점진적으로 확장할 수 있습니다. 다양한 이점 중 특히 개발 프로세스와 가능한 모든 UI 를 적용할 수 있도록 집중 되었습니다. 간단히 말해서 CDD는 고품질의 복잡한 사용자 인터페이스를 구축하는 데 도움이 됩니다.

아직 완료되지 않았습니다. UI가 빌드되었다고 작업이 끝난 것이 아닙니다. 또한 시간이 지나도 내구성이 유지되도록 보장해주어야 합니다.

<div class="aside">
💡 깃(Git)에 변경한 내역들을 commit 하는 것도 잊지 마세요!
</div>
