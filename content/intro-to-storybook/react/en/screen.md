---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '05aa2ef'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Redux) in some layout and pulling a top-level `error` field out of Redux (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating our Redux store (in `src/lib/store.js`) to include the error field we want:

```diff:title=src/lib/store.js
 /* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

+ // Our new error field is configured here
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
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server.
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
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


// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

// The actions contained in the new slice are exported to be used in our components
+ export const { updateAppState } = AppStateSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
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

Now that we have the store updated with the new field. Let's create our `InboxScreen.js` in the `src/components` directory:

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
  /** The error message */
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export function InboxScreen() {
  // We're retrieving the error field from our updated store
  const isError = useSelector(state => state.isError);

  return <PureInboxScreen error={isError} />;
}
```

We also need to change the `App` component to render the `InboxScreen` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

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

<div class="aside"><p>Don't forget to update the test file <code>src/App.test.js</code>. Or the next time you run your tests they will fail.</p></div>

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be simply rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock (i.e., provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, we have a problem with the `PureInboxScreen` because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense, the `PureInboxScreen` has been polluted by “container-ness”. So when we set up our stories in `PureInboxScreen.stories.js`:

```js:title=src/components/PureInboxScreen.stories.js
import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

We see that although the `error` story works just fine, we have an issue in the `default` story because the `TaskList` has no Redux store to connect to. (You also would encounter similar problems when trying to test the `PureInboxScreen` with a unit test).

![Broken inbox](/intro-to-storybook/broken-inboxscreen.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context with decorators

The good news is that it is easy to supply a Redux store to the `PureInboxScreen` in a story! We can just use a mocked version of the Redux store provided in a decorator:

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
+ decorators: [story => <Provider store={Mockstore}>{story()}</Provider>],
  title: 'PureInboxScreen',
};

const Template = args => <PureInboxScreen {...args} />;

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: 'Something',
};
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Interactive stories

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and interact with our components automatically?

Storybook's [`play`](https://storybook.js.org/docs/react/writing-stories/play-function) function allows us to do just that. A play function includes small snippets of code that are run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, that means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

Let's see it in action! Update your newly created `PureInboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/components/PureInboxScreen.stories.js
import React from 'react';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
+ import { fireEvent, within } from '@storybook/testing-library';

import { PureInboxScreen } from './InboxScreen';

import * as TaskListStories from './TaskList.stories';

 // A super-simple mock of a redux store
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
+   // Simulates pinning the first task
+   await fireEvent.click(canvas.getByLabelText("pinTask-1"));
+   // Simulates pinning the third task
+   await fireEvent.click(canvas.getByLabelText("pinTask-3"));
+ };
```

Check your newly created story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

The play function allows us to interact with our UI and quickly check how it responds if we update our tasks. That keeps the UI consistent at no extra manual effort. All without needing to spin up a testing environment or add additional packages.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

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
