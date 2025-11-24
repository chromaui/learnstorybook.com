---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면을 구성해봅시다'
commit: '6262d7f'
---

우리는 지금까지 작은 것에서부터 시작하여 복잡성을 점점 더하는 방식으로 UI를 만들었습니다. 이를 통해 각 컴포넌트를 독립적으로 개발하고 데이터의 요구 사항을 파악하며 스토리북(Storybook)에서 사용해 볼 수 있었습니다. 모두 서버를 구축하거나 화면을 만들 필요가 없었습니다!

이번 챕터에서는 화면에서 컴포넌트를 결합하고 스토리북에서 그 화면을 개발함으로써 계속하여 완성도를 높여보겠습니다.

## 화면에 연결하기

우리 앱은 간단하기 때문에 만들 화면도 매우 간단합니다. 원격 API에서 데이터를 가져와 `TaskList` 컴포넌트(리덕스(Redux)를 통해 자체적으로 데이터를 제공함)를 감싸고, 최상위 레벨의 `error` 필드를 리덕스에서 가져오는 것입니다.

우리는 먼저 Redux 스토어(src/lib/store.js)를 업데이트하여 원격 API에 연결하고, 애플리케이션의 다양한 상태(예: `error`, `succeeded`)를 처리하도록 하겠습니다.

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
  status: 'idle',
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

이제 원격 API 엔드포인트에서 데이터를 검색하여 스토어를 새롭게 업데이트 하고 앱의 다양한 상태를 처리하도록 준비했습니다. 이제 `src/components` 폴더에 `InboxScreen.jsx` 파일을 만들어봅시다:

```jsx:title=src/components/InboxScreen.jsx
import { useEffect } from 'react';

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
          <p className="title-message">Oh no!</p>
          <p className="subtitle-message">Something went wrong</p>
        </div>
      </div>
    );
  }
  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  );
}
```

또한 `App` 컴포넌트를 변경하여 `InboxScreen`을 렌더링 합니다. (올바른 화면 선택을 위하여 router를 사용해도 되지만 여기서는 고려하지 않도록 하겠습니다.)

```diff:title=src/App.jsx
- import { useState } from 'react'
- import reactLogo from './assets/react.svg'
- import viteLogo from '/vite.svg'
- import './App.css'

+ import './index.css';
+ import store from './lib/store';

+ import { Provider } from 'react-redux';
+ import InboxScreen from './components/InboxScreen';

function App() {
- const [count, setCount] = useState(0)
  return (
-   <div className="App">
-     <div>
-       <a href="https://vitejs.dev" target="_blank">
-         <img src={viteLogo} className="logo" alt="Vite logo" />
-       </a>
-       <a href="https://reactjs.org" target="_blank">
-         <img src={reactLogo} className="logo react" alt="React logo" />
-       </a>
-     </div>
-     <h1>Vite + React</h1>
-     <div className="card">
-       <button onClick={() => setCount((count) => count + 1)}>
-         count is {count}
-       </button>
-       <p>
-         Edit <code>src/App.jsx</code> and save to test HMR
-       </p>
-     </div>
-     <p className="read-the-docs">
-       Click on the Vite and React logos to learn more
-     </p>
-   </div>
+   <Provider store={store}>
+     <InboxScreen />
+   </Provider>
  );
}
export default App;
```

그러나 여기서 흥미로운 점은 스토리북에서 스토리를 렌더링 할 때입니다.

앞에서 살펴보았듯이 `TaskList` 컴포넌트는 이제 **연결된** 컴포넌트가 되었습니다. 그리고 Redux 저장소에 의존하여 작업을 렌더링하고 있습니다.`InboxScreen` 또한 연결된 컴포넌트이므로 비슷한 작업을 수행하고 따라서 `InboxScreen.stories.jsx`에서 스토리를 설정할 때에도 스토어를 제공할 수 있습니다:

```jsx:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';
import store from '../lib/store';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {};
```

`error` 스토리에서 문제를 빠르게 찾아 낼 수 있습니다. 올바른 상태를 표시하는 대신 작업 목록을 표시해 줍니다. 이 문제를 피하는 한 가지 방법은 지난 장에서와 유사하게 각 상태에 대해 모의 버전을 제공하는 것이지만, 대신 이 문제를 해결하는데 도움이 되도록 잘 알려진 API mocking 라이브러리를 스토리북 애드온과 함께 사용합니다.

![고장난 inbox 스크린 상태](/intro-to-storybook/broken-inbox-error-state-7-0-optimized.png)

## API 서비스 모킹(Mocking)

우리의 애플리케이션은 매우 간단하고 원격 API 호출에 크게 의존하지 않기 때문에 [Mock Service Worker](https://mswjs.io/) 와 [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon)를 사용할 예정입니다. Mock Service Worker 는 모의 API 라이브러리입니다. 서비스 워커에 의존하여 네트워크 요청을 캡처하고 그 응답으로 모의 데이터를 제공합니다.

[Get started section](/intro-to-storybook/react/ko/get-started)에서 앱을 설정할 때 두 패키지들이 함께 설치됩니다. 남은 것은 이를 구성하고 사용하도록 스토리를 업데이트 하는 것입니다.

터미널에서 다음 명령을 실행하여 `public` 폴더 안에 일반 서비스 워커를 생성합니다:

```shell
yarn init-msw
```

그리고 나서, `.storybook/preview.js` 를 업데이트 하고 초기화해야 합니다:

```diff:title=.storybook/preview.js
import '../src/index.css';

// Registers the msw addon
+ import { initialize, mswLoader } from 'msw-storybook-addon';

// Initialize MSW
+ initialize();

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
+ loaders: [mswLoader],
};

export default preview;
```

마지막으로 `InboxScreen` 스토리를 업데이트하고 모의 원격 API 호출 [파라미터(parameter)](https://storybook.js.org/docs/writing-stories/parameters)를 포함합니다.

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';

import store from '../lib/store';

+ import { http, HttpResponse } from 'msw';

+ import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return HttpResponse.json(MockedState.tasks);
+       }),
+     ],
+   },
+ },
};

export const Error = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return new HttpResponse(null, {
+           status: 403,
+         });
+       }),
+     ],
+   },
+ },
};
```

<div class="aside">

💡 또 다른 방법으로, 가능한 접근 방식은 데이터를 계층 구조 아래로 전달하는 것입니다. 특히 [GraphQL](http://graphql.org/)을 사용할 때. 이것은 저희 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)이 800개 이상의 스토리를 구축한 방법입니다.

</div>

스토리북을 확인하면 `error` 스토리가 의도한 대로 작동하는지 확인 할 수있습니다. MSW 는 원격 API 호출을 가로채 적절한 응답을 제공합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-7.0.mp4"
    type="video/mp4"
  />
</video>

## 컴포넌트 테스트

지금까지 간단한 구성 요소에서 시작하여 화면에 이르기까지 완전히 작동하는 응용 프로그램을 처음부터 구축하고 스토리를 사용하여 각 변경 사항을 지속적으로 테스트할 수 있었습니다. 그러나 각각의 새로운 스토리는 UI가 깨지지 않도록 다른 모든 스토리를 수동으로 확인해야 합니다. 그것은 많은 추가 작업입니다.

이 워크플로우를 자동화하고 컴포넌트 상호작용을 자동으로 테스트할 수 없을까요?

### play 함수를 사용하여 컴포넌트 테스트 작성하기

스토리북의 [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 함수와 [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/component-testing)가 이를 돕습니다. play 함수는 스토리가 렌더링된 후 실행되는 작은 코드 스니펫이 포함됩니다.

play 함수는 작업이 업데이트 될 때 UI에 어떤 일이 발생하는지 확인하는 데 도움이 됩니다. 이 기능은 프레임워크에 구애받지 않는 DOM API를 사용합니다. 따라서 play 함수를 사용하면 프레임워크에 구애받지 않고 UI와 상호작용하고 사용자의 동작을 시뮬레이션하는 스토리를 작성할 수 있습니다.

이제 실제로 살펴보겠습니다! 새로 만든 `InboxScreen` 스토리를 업데이트하고 다음을 추가하여 컴포넌트 상호작용을 추가해 봅시다:

```diff:title=src/components/InboxScreen.stories.jsx
import InboxScreen from './InboxScreen';

import store from '../lib/store';

import { http, HttpResponse } from 'msw';

import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

+ import {
+  fireEvent,
+  waitFor,
+  within,
+  waitForElementToBeRemoved
+ } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
};

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
+ play: async ({ canvasElement }) => {
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
+ },
};

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

<div class="aside">

💡 `@storybook/test` 패키지는 `@storybook/jest`와 `@storybook/testing-library` 테스트 패키지를 대체하며, [Vitest](https://vitest.dev/) 패키지를 기반으로 더 작은 번들 크기와 더 간단한 API를 제공합니다.

</div>

`Default` 스토리를 확인해보세요. 상호작용 패널을 클릭하여 스토리의 play function 안에 있는 상호작용 목록을 확인해보세요.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

## 테스트 러너를 사용한 테스트 자동화

스토리북의 play function을 통해 UI와 상호작용하면서 작업을 업데이트할 때 UI가 어떻게 반응하는지 빠르게 확인할 수 있었고, 추가적인 수작업 없이 UI 일관성을 유지할 수 있었습니다.

하지만 스토리북을 자세히 살펴보면, 상호작용 테스트는 스토리를 볼 때만 실행되는 것을 알 수 있습니다. 따라서 변경 사항이 있을 경우 모든 검사를 위해 각 스토리를 살펴봐야 합니다. 자동화할 수 없을까요?

좋은 소식은 가능하다는 것입니다! 스토리북의 [test runner](https://storybook.js.org/docs/writing-tests/test-runner)가 바로 그 역할을 수행할 수 있습니다. 이는 [Playwright](https://playwright.dev/)로 구동되는 독립형 유틸리티로, 모든 상호작용 테스트를 실행하고 오류가 있는 스토리를 포착합니다.

작동 방식을 살펴보겠습니다! 아래 명령어를 실행하여 설치하세요:

```shell
yarn add --dev @storybook/test-runner
```

그 다음, `package.json`의 `scripts`를 업데이트하고 새로운 테스트 작업을 추가합니다:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

마지막으로, 스토리북을 실행한 상태에서 새 터미널 창을 열고 다음 명령을 실행합니다:

```shell
yarn test-storybook --watch
```

<div class="aside">

💡 play 함수를 이용한 컴포넌트 테스트는 UI 컴포넌트를 테스트하는 훌륭한 방법입니다. 여기에서 본 것보다 훨씬 더 많은 기능을 수행할 수 있으며, 이에 대한 더 많은 정보를 얻으려면 [공식 문서](https://storybook.js.org/docs/writing-tests/component-testing)를 읽어보는 것이 좋습니다.

더 깊이 있는 테스트를 원하신다면, [테스트 핸드북](/ui-testing-handbook/)을 확인해보세요. 이 핸드북은 규모가 큰 프론트엔드 팀이 사용하는 테스트 전략을 다루고 있어 개발 워크플로우를 향상시키는 데 도움을 줄 것입니다.

</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

성공입니다! 이제 모든 스토리가 오류 없이 렌더링되고 자동으로 모든 검증이 통과되는지 확인할 수 있는 도구를 갖게 되었습니다. 더군다나, 만약 테스트가 실패하면, 실패한 스토리를 브라우저에서 열 수 있는 링크를 제공합니다.

## 컴포넌트 주도 개발

우리는 맨처음 `Task` 컴포넌트에서 시작했고, `TaskList`로 진행했고, 이제 전체 화면 UI를 다룰 수 있습니다. `InboxScreen` 은 연결된 컴포넌트들을 포함하며 스토리를 포함하고 있습니다.

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
