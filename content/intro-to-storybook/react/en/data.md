---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: '97fc9a6'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [Redux](https://redux.js.org/), the most popular React library for storing data, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://www.apollographql.com/client/) and [MobX](https://mobx.js.org/).

Add the necessary dependencies to your project with:

```bash
yarn add react-redux redux
```

First we’ll construct a simple Redux store that responds to actions that change the state of tasks, in a file called `lib/redux.js` in the `src` folder (intentionally kept simple):

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

Then we’ll update the default export from the `TaskList` component to connect to the Redux store and render the tasks we are interested in:

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

Now that we have some real data populating our component, obtained from Redux, we could have wired it to `src/app.js` and render the component there. But for now let's hold off doing that and continue on our component-driven journey.

Don't worry about it we'll take care of it in the next chapter.

At this stage, our Storybook tests will have stopped working because `TaskList` is now a container and no longer expects any props. Instead `TaskList` connects to the store and sets the props on the `PureTaskList` component it wraps.

However, we can easily solve this problem by simply rendering the `PureTaskList` --the presentational component, to which we've just added the `export` statement in the previous step-- in our Storybook stories:

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
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
Should your snapshot tests fail at this stage, you must update the existing snapshots by running the test script with the <code>-u</code> flag. Also as our app is progressively growing it might also a good place to run the tests with the <code> --watchAll</code> flag like mentioned in the <a href="/react/en/get-started/">Get Started</a> section.
</div>
