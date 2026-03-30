---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면을 구성해봅시다'
commit: '12a7932'
---

우리는 지금까지 작은 것에서부터 시작하여 복잡성을 점점 더하는 방식으로 UI를 만들었습니다. 이를 통해 각 컴포넌트를 독립적으로 개발하고 데이터의 요구 사항을 파악하며 스토리북(Storybook)에서 사용해 볼 수 있었습니다. 모두 서버를 구축하거나 화면을 만들 필요가 없었습니다!

이번 챕터에서는 화면에서 컴포넌트를 결합하고 스토리북에서 그 화면을 개발함으로써 계속하여 완성도를 높여보겠습니다.

## 화면에 연결하기

우리 애플리케이션은 간단하기 때문에 만들 화면도 매우 간단합니다. 원격 API에서 데이터를 가져와 `TaskList` 컴포넌트(리덕스(Redux)를 통해 자체적으로 데이터를 제공함)를 레이아웃으로 감싸고, 최상위 레벨의 `error` 필드를 스토어에서 가져오는 것입니다. (서버 연결에 문제가 발생할 경우를 대비해 해당 필드를 설정한다고 가정해 봅시다.)

우리는 먼저 Redux 스토어(`src/lib/store.ts`)를 업데이트하여 원격 API에 연결하고, 애플리케이션의 다양한 상태(예: `error`, `succeeded`)를 처리하도록 하겠습니다.

```ts:title=src/lib/store.ts
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import type { TaskData } from '../types';

import {
  configureStore,
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from '@reduxjs/toolkit';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const TaskBoxData: TaskBoxState = {
  tasks: [],
  status: 'idle',
  error: null,
};
/*
 * Creates an asyncThunk to fetch tasks from a remote endpoint.
 * You can read more about Redux Toolkit's thunks in the docs:
 * https://redux-toolkit.js.org/api/createAsyncThunk
 */
export const fetchTasks = createAsyncThunk('taskbox/fetchTasks', async () => {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/todos?userId=1'
  );
  const data = await response.json();
  const result = data.map(
    (task: { id: number; title: string; completed: boolean }) => ({
      id: `${task.id}`,
      title: task.title,
      state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
    })
  );
  return result;
});

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (
      state,
      action: PayloadAction<{ id: string; newTaskState: TaskData['state'] }>
    ) => {
      const task = state.tasks.find((task) => task.id === action.payload.id);
      if (task) {
        task.state = action.payload.newTaskState;
      }
    },
  },
  /*
   * Extends the reducer for the async actions
   * You can read more about it at https://redux-toolkit.js.org/api/createAsyncThunk
   */
  extraReducers(builder) {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
        state.tasks = [];
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        // Add any fetched tasks to the array
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.status = 'failed';
        state.error = 'Something went wrong';
        state.tasks = [];
      });
  },
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

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
```

이제 원격 API 엔드포인트에서 데이터를 검색하여 스토어를 새롭게 업데이트 하고 앱의 다양한 상태를 처리하도록 준비했습니다. 이제 `src/components` 폴더에 `InboxScreen.tsx` 파일을 만들어봅시다:

```tsx:title=src/components/InboxScreen.tsx
import type { RootState, AppDispatch } from '../lib/store';

import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { fetchTasks } from '../lib/store';

import TaskList from './TaskList';

export default function InboxScreen() {
  const dispatch = useDispatch<AppDispatch>();
  // We're retrieving the error field from our updated store
  const { error } = useSelector((state: RootState) => state.taskbox);
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

```diff:title=src/App.tsx
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

앞에서 살펴보았듯이 `TaskList` 컴포넌트는 이제 **연결된** 컴포넌트가 되었습니다. 그리고 Redux 저장소에 의존하여 작업을 렌더링하고 있습니다.`InboxScreen` 또한 연결된 컴포넌트이므로 비슷한 작업을 수행하고 따라서 `InboxScreen.stories.tsx`에서 스토리를 설정할 때에도 스토어를 제공할 수 있습니다:

```tsx:title=src/components/InboxScreen.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Provider } from 'react-redux';

import InboxScreen from './InboxScreen';

import store from '../lib/store';

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Error: Story = {};
```

`error` 스토리에서 문제를 빠르게 찾아 낼 수 있습니다. 올바른 상태를 표시하는 대신 작업 목록을 표시해 줍니다. 이 문제를 피하는 한 가지 방법은 지난 장에서와 유사하게 각 상태에 대해 모의 버전을 제공하는 것이지만, 대신 이 문제를 해결하는데 도움이 되도록 잘 알려진 API mocking 라이브러리를 스토리북 애드온과 함께 사용합니다.

<!-- TODO:
  - Follow up with Design to get an updated image that showcases Task, TaskList, and InboxScreen
-->

![고장난 inbox 스크린 상태](/intro-to-storybook/broken-inbox-error-state-9-0-optimized.png)

## API 서비스 모킹(Mocking)

우리의 애플리케이션은 매우 간단하고 원격 API 호출에 크게 의존하지 않기 때문에 [Mock Service Worker](https://mswjs.io/) 와 [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon)를 사용할 예정입니다. Mock Service Worker 는 모의 API 라이브러리입니다. 서비스 워커에 의존하여 네트워크 요청을 캡처하고 그 응답으로 모의 데이터를 제공합니다.

[Get started section](/intro-to-storybook/react/ko/get-started)에서 앱을 설정할 때 두 패키지들이 함께 설치됩니다. 남은 것은 이를 구성하고 사용하도록 스토리를 업데이트 하는 것입니다.

터미널에서 다음 명령을 실행하여 `public` 폴더 안에 일반 서비스 워커를 생성합니다:

```shell
yarn init-msw
```

그리고 나서, `.storybook/preview.ts` 를 업데이트 하고 초기화해야 합니다:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/react-vite';

import { initialize, mswLoader } from 'msw-storybook-addon';

import '../src/index.css';

// Registers the msw addon
initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  loaders: [mswLoader],
};

export default preview;
```

마지막으로 `InboxScreen` 스토리를 업데이트하고 모의 원격 API 호출 [파라미터(parameter)](https://storybook.js.org/docs/writing-stories/parameters)를 포함합니다.

```diff:title=src/components/InboxScreen.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

+ import { http, HttpResponse } from 'msw';

+ import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

import InboxScreen from './InboxScreen';

import store from '../lib/store';

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
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

export const Error: Story = {
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
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-9.0.mp4"
    type="video/mp4"
  />
</video>

## 상호작용 테스트

지금까지 간단한 구성 요소에서 시작하여 화면에 이르기까지 완전히 작동하는 응용 프로그램을 처음부터 구축하고 스토리를 사용하여 각 변경 사항을 지속적으로 테스트할 수 있었습니다. 그러나 각각의 새로운 스토리는 UI가 깨지지 않도록 다른 모든 스토리를 수동으로 확인해야 합니다. 그것은 많은 추가 작업입니다.

이 워크플로우를 자동화하고 컴포넌트 상호작용을 자동으로 테스트할 수 없을까요?

### play 함수를 사용하여 상호작용 테스트 작성하기

스토리북의 [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) 함수가 이를 돕습니다. play 함수는 스토리가 렌더링된 후 실행되는 작은 코드 스니펫이 포함됩니다.이 함수는 프레임워크에 구애받지 않는 DOM API를 사용하므로, 프론트엔드 프레임워크의 종류와 상관없이 play 함수를 작성하여 UI와 상호작용하고 사용자의 동작을 시뮬레이션하는 스토리를 작성할 수 있습니다. 우리는 이 함수를 사용하여 태스크를 업데이트할 때 UI가 예상대로 작동하는지 확인할 것입니다.

새로 만든 `InboxScreen` 스토리를 업데이트하고 다음을 추가하여 컴포넌트 상호작용을 추가해 봅시다:

```diff:title=src/components/InboxScreen.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

+ import { waitFor, waitForElementToBeRemoved } from 'storybook/test';

import { http, HttpResponse } from 'msw';

import { MockedState } from './TaskList.stories';

import { Provider } from 'react-redux';

import InboxScreen from './InboxScreen';

import store from '../lib/store';

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(MockedState.tasks);
        }),
      ],
    },
  },
+ play: async ({ canvas, userEvent }) => {
+   // Waits for the component to transition from the loading state
+   await waitForElementToBeRemoved(await canvas.findByTestId('loading'));
+   // Waits for the component to be updated based on the store
+   await waitFor(async () => {
+     // Simulates pinning the first task
+     await userEvent.click(canvas.getByLabelText('pinTask-1'));
+     // Simulates pinning the third task
+     await userEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ },
};

export const Error: Story = {
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

💡 `Interactions` 패널은 각 단계별 흐름을 제공해 스토리북 테스트를 시각화하는데 도움을 줍니다. 또한 상호작용을 일시 정지하고, 재개하고, 되감기 하거나 각 단계별로 실행할 수 있는 유용한 UI 제어 기능을 제공합니다.

</div>

`Default` 스토리를 확인해보세요. 상호작용 패널을 클릭하여 스토리의 play function 안에 있는 상호작용 목록을 확인해보세요.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-react.mp4"
    type="video/mp4"
  />
</video>

## Vitest 애드온을 사용한 테스트 자동화

play function을 통해 우리는 빠르게 컴포넌트와 사용자 의 상호작용을 시뮬레이션 하고, 작업을 업데이트할 때 컴포넌트가 어떻게 동작하는지 검증하여 UI 일관성을 유지할 수 있었습니다.
하지만 스토리북을 자세히 살펴보면, 상호작용 테스트는 스토리를 볼 때만 실행되는 것을 알 수 있습니다. 이는 변경사항이 있을때마다 모든 스토리를 직접 살펴봐야 한다는 뜻입니다. 자동화할 수 없을까요?

가능합니다! 스토리북의 [Vitest 애드온](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)은 상호작용 테스트를 더 자동화된 방식으로 실행할 수 있도록 해주고 Vitest의 강력한 기능을 활용하여 효율적이고 빠른 테스트를 경험할 수 있게 합니다. 작동 방식을 살펴보겠습니다!

스토리북을 실행한 상태에서 사이드바에서 "Run tests" 버튼을 클릭합니다. 그러면 스토리의 렌더링 방식, 동작 방식, play function에 정의되어있는 상호작용(`InboxScreen`스토리에 방금 추가한 것을 포함)에 대한 테스트가 실행됩니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-vitest-addon-react.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

💡 Vitest 애드온은 여기에서 본 것 외에도 다른 종류의 테스트를 포함하여 훨씬 더 많은 기능을 제공합니다. 이에 대한 더 많은 정보를 얻으려면 [공식 문서](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)를 읽어보는 것이 좋습니다.

더 깊이 있는 테스트를 원하신다면, [테스트 핸드북](/ui-testing-handbook/)을 확인해보세요. 이 핸드북은 규모가 큰 프론트엔드 팀이 사용하는 테스트 전략을 다루고 있어 개발 워크플로우를 향상시키는 데 도움을 줄 것입니다.

</div>

이제 우리는 일일히 확인할 필요 없이 UI 테스트를 자동화하는 도구를 갖게 되었습니다. 이는 우리가 애플리케이션을 만들어가면서 UI의 일관성과 기능성을 유지할 수 있게 해주는 훌륭한 방식입니다. 무엇보다도 테스트가 실패할 경우에 즉시 알 수 있어 해결하지 못한 문제들을 쉽고 빠르게 해결할 수 있습니다.

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
