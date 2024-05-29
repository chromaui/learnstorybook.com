---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '2275632'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Connected screens

As our app is straightforward, the screen we'll build is pretty trivial, simply fetching data from a remote API, wrapping the `TaskList` component (which supplies its own data from Redux), and pulling a top-level `error` field out of Redux.

We'll start by updating our Redux store (in `src/lib/store.js`) to connect to a remote API and handle the various states for our application (i.e., `error`, `succeeded`):

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

Now that we've updated our store to retrieve the data from a remote API endpoint and prepared it to handle the various states of our app, let's create our `InboxScreen.jsx` in the `src/components` directory:

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

We also need to change our `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

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

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is now a **connected** component and relies on a Redux store to render the tasks. As our `InboxScreen` is also a connected component, we'll do something similar and provide a store to the story. So when we set our stories in `InboxScreen.stories.jsx`:

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

We can quickly spot an issue with the `error` story. Instead of displaying the right state, it shows a list of tasks. One way to sidestep this issue would be to provide a mocked version for each state, similar to what we did in the last chapter. Instead, we'll use a well-known API mocking library alongside a Storybook addon to help us solve this issue.

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-7-0-optimized.png)

## Mocking API Services

As our application is pretty straightforward and doesn't depend too much on remote API calls, we're going to use [Mock Service Worker](https://mswjs.io/) and [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker is an API mocking library. It relies on service workers to capture network requests and provides mocked data in responses.

When we set up our app in the [Get started section](/intro-to-storybook/react/en/get-started) both packages were also installed. All that remains is to configure them and update our stories to use them.

In your terminal, run the following command to generate a generic service worker inside your `public` folder:

```shell
yarn init-msw
```

Then, we'll need to update our `.storybook/preview.js` and initialize them:

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

Finally, update the `InboxScreen` stories and include a [parameter](https://storybook.js.org/docs/writing-stories/parameters) that mocks the remote API calls:

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

💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using [GraphQL](http://graphql.org/). It’s how we have built [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) alongside 800+ stories.

</div>

Check your Storybook, and you'll see that the `error` story is now working as intended. MSW intercepted our remote API call and provided the appropriate response.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inbox-screen-with-working-msw-addon-optimized-7.0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/writing-stories/play-function) and [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/interaction-testing) help us with that. A play function includes small snippets of code that run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, which means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

The `@storybook/addon-interactions` helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

Let's see it in action! Update your newly created `InboxScreen` story, and set up component interactions by adding the following:

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

💡 The `@storybook/test` package replaces the `@storybook/jest` and `@storybook/testing-library` testing packages, offering a smaller bundle size and a more straightforward API based on the [Vitest](https://vitest.dev/) package.

</div>

Check the `Default` story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-7-0.mp4"
    type="video/mp4"
  />
</video>

### Automate tests with the test runner

With Storybook's play function, we were able to sidestep our problem, allowing us to interact with our UI and quickly check how it responds if we update our tasks—keeping the UI consistent at no extra manual effort.

But, if we take a closer look at our Storybook, we can see that it only runs the interaction tests when viewing the story. Therefore, we'd still have to go through each story to run all checks if we make a change. Couldn't we automate it?

The good news is that we can! Storybook's [test runner](https://storybook.js.org/docs/writing-tests/test-runner) allows us to do just that. It's a standalone utility—powered by [Playwright](https://playwright.dev/)—that runs all our interactions tests and catches broken stories.

Let's see how it works! Run the following command to install it:

```shell
yarn add --dev @storybook/test-runner
```

Next, update your `package.json` `scripts` and add a new test task:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Finally, with your Storybook running, open up a new terminal window and run the following command:

```shell
yarn test-storybook --watch
```

<div class="aside">

💡 Interaction testing with the play function is a fantastic way to test your UI components. It can do much more than we've seen here; we recommend reading the [official documentation](https://storybook.js.org/docs/writing-tests/interaction-testing) to learn more about it.

For an even deeper dive into testing, check out the [Testing Handbook](/ui-testing-handbook). It covers testing strategies used by scaled-front-end teams to supercharge your development workflow.

</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

Success! Now we have a tool that helps us verify whether all our stories are rendered without errors and all assertions pass automatically. What's more, if a test fails, it will provide us with a link that opens up the failing story in the browser.

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
