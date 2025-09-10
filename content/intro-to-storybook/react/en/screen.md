---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '6262d7f'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Connected screens

As our application is straightforward, the screen we'll build is pretty trivial. It simply fetches data from a remote API, wraps the `TaskList` component (which supplies its own data from Redux) in some layout, and pulls a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server).

We'll start by updating our Redux store (in `src/lib/store.ts`) to connect to a remote API and handle the various states for our application (i.e., `error`, `succeeded`):

```ts:title=src/lib/store.ts
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import type { TaskData } from '../types';

import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
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

Now that we've updated our store to retrieve the data from a remote API endpoint and prepared it to handle the various states of our app, let's create our `InboxScreen.tsx` in the `src/components` directory:

```tsx:title=src/components/InboxScreen.tsx
import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, fetchTasks, RootState } from '../lib/store';

import TaskList from "./TaskList";

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

We also need to change our `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

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

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is now a **connected** component and relies on a Redux store to render the tasks. As our `InboxScreen` is also a connected component, we'll do something similar and provide a store to the story. So when we set our stories in `InboxScreen.stories.tsx`:

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

We can quickly spot an issue with the `error` story. Instead of displaying the right state, it shows a list of tasks. One way to sidestep this issue would be to provide a mocked version for each state, similar to what we did in the last chapter. Instead, we'll use a well-known API mocking library alongside a Storybook addon to help us solve this issue.

<!-- TODO:
  - Follow up with Design to get an updated image that showcases Task, TaskList, and InboxScreen
-->

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-9-0-optimized.png)

## Mocking API Services

As our application is pretty straightforward and doesn't depend too much on remote API calls, we're going to use [Mock Service Worker](https://mswjs.io/) and [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker is an API mocking library. It relies on service workers to capture network requests and provides mocked data in responses.

When we set up our app in the [Get started section](/intro-to-storybook/react/en/get-started) both packages were also installed. All that remains is to configure them and update our stories to use them.

In your terminal, run the following command to generate a generic service worker inside your `public` folder:

```shell
yarn init-msw
```

Then, we'll need to update our `.storybook/preview.ts` and initialize them:

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

Finally, update the `InboxScreen` stories and include a [parameter](https://storybook.js.org/docs/writing-stories/parameters) that mocks the remote API calls:

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

💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using [GraphQL](http://graphql.org/). It’s how we have built [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) alongside 800+ stories.

</div>

Check your Storybook, and you'll see that the `error` story is now working as intended. MSW intercepted our remote API call and provided the appropriate response.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-9.0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/writing-stories/play-function) can help us with that. A play function includes small snippets of code that run after the story renders. It uses framework-agnostic DOM APIs, meaning we can write stories with the play function to interact with the UI and simulate human behavior, regardless of the frontend framework. We'll use them to verify that the UI behaves as expected when we update our tasks.

Update your newly created `InboxScreen` story, and set up component interactions by adding the following:

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

💡 The `Interactions` panel helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

</div>

Check the `Default` story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-react.mp4"
    type="video/mp4"
  />
</video>

### Automate test with the Vitest addon

With the play function, we were able to quickly simulate user interactions with our component and verify how it behaves when we update our tasks—keeping the UI consistent. However, if we look into our Storybook, we can see that our interaction tests only run when viewing the story. This means that if we make a change, we still have to go through each story to run all checks manually. Couldn't we automate it?

We can! Storybook's [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) allows us to run our interaction tests in a more automated way, leveraging the power of Vitest for a faster and more efficient testing experience. Let's see how it works!

With your Storybook running, click the "Run Tests" in the sidebar. This will run tests on our stories, how they render, their behavior, and the interactions defined in the play function, including the one we just added to the `InboxScreen` story.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-vitest-addon-react.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

💡 The Vitest addon can do much more than we've seen here, including other types of testing. We recommend reading the [official documentation](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon) to learn more about it.

</div>

Now, we have a tool that helps us automate our UI testing without the need for manual checks. This is a great way to ensure that our UI remains consistent and functional as we continue to build out our application. What's more, if our tests fail, we'll be notified immediately, allowing us to fix any outstanding issues quickly and easily.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, and now we’re here with a whole screen UI. Our `InboxScreen` accommodates connected components and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
