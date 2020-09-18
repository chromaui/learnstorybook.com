---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [ember redux](https://ember-redux.com/), a predictable state management library for Ember, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [Apollo](https://github.com/ember-graphql/ember-apollo-client).

Add the necessary dependency to your project with:

```bash
ember install ember-redux
```

First we’ll construct a simple Redux store that responds to actions that change the state of tasks, in a file called `reducers/index.js` (intentionally kept simple):

```javascript
// app/reducers/index.js

import { combineReducers } from 'redux';
// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const initialState = {
  tasks: defaultTasks,
};
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
      return state || initialState;
  }
};

export default combineReducers({
  reducer,
});
```

Then we'll update our `TaskList` to read data out of the store. First let's move our existing presentational version to `app/components/pure-task-list.hbs` and `app/components/pure-task-list.js` and wrap it with a container.

In `app/components/PureTaskList.hbs`:

```handlebars
{{!--app/components/pure-task-list.hbs --}}

{{#if @loading}}
 <LoadingRow />
 <LoadingRow />
 <LoadingRow/>
 <LoadingRow />
 <LoadingRow />
{{else if this.tasksInOrder}}
  {{#each this.tasksInOrder as |task|}}
    <Task
      @task={{task}}
      @pin={{fn @pinTask task.id}}
      @archive={{fn @archiveTask task.id}}
    />
  {{/each}}
{{else}}
  <div class="list-items">
    <div class="wrapper-message">
      <span class="icon-check" />
      <div class="title-message">You have no tasks</div>
      <div class="subtitle-message">Sit back and relax</div>
    </div>
  </div>
{{/if}}
```

In `app/components/task-list.hbs`:

```handlebars
{{!!-- app/components/task-list.hbs --}}

<div>
  <PureTaskList
    @tasks={{this.tasks}}
    @pinTask={{this.pinTask}}
    @archiveTask={{this.archiveTask}}
  />
</div>

```

And `app/components/task-list.js` :

```js
//app/components/task-list.js

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { connect } from 'ember-redux';
import { archiveTask, pinTask } from '../reducers/index';

const stateToComputed = state => {
  const { reducer } = state;
  const { tasks } = reducer;

  return {
    tasks: tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'),
  };
};

class TaskList extends Component {
  @action
  pinTask(taskID) {
    this.actions.onPinTask(taskID);
  }

  @action
  archiveTask(taskID) {
    this.actions.onArchiveTask(taskID);
  }
}

export default connect(
  stateToComputed,
  dispatch => ({
    onArchiveTask: id => dispatch(archiveTask(id)),
    onPinTask: id => dispatch(pinTask(id)),
  })
)(TaskList);
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's rename `app/components/task-list.stories.js` into `app/components/pure-task-list.stories.js`, and ensure our stories use the presentational version:

```javascript
// app/components/pure-task-list.stories.js

import { hbs } from 'ember-cli-htmlbars';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'PureTaskList',
  component: 'task-list',
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

export const Default = () => ({
  template: hbs`<div style="padding: 3rem"><PureTaskList @tasks={{this.tasks}} @pinTask={{fn this.onPinTask}} @archiveTask={{fn this.onArchiveTask}}/></div>`,
  context: {
    tasks: defaultTasksData,
    ...actionsData,
  },
});

export const withPinnedTasks = () => ({
  template: hbs`<div style="padding: 3rem"><PureTaskList @tasks={{this.tasks}} @pinTask={{fn this.onPinTask}} @archiveTask={{fn this.onArchiveTask}}/></div>`,
  context: {
    tasks: withPinnedTasksData,
    ...actionsData,
  },
});
export const Loading = () => ({
  template: hbs`<div style="padding: 3rem"><PureTaskList @tasks={{this.tasks}} @loading={{true}}/></div>`,
  context: {
    tasks: [],
  },
});
export const Empty = () => ({
  template: hbs`<div style="padding: 3rem"><PureTaskList @tasks={{this.tasks}}/></div>`,
  context: {
    tasks: [],
  },
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskList` in our Qunit test:

```javascript
// tests/integration/task-list-test.js

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
module('Integration | Component | TaskList', function(hooks) {
  setupRenderingTest(hooks);
  const taskData = {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  };
  const tasklist = [
    { ...taskData, id: '1', title: 'Task 1' },
    { ...taskData, id: '2', title: 'Task 2' },
    { ...taskData, id: '3', title: 'Task 3' },
    { ...taskData, id: '4', title: 'Task 4' },
    { ...taskData, id: '5', title: 'Task 5' },
    { ...taskData, id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ];

  test('renders pinned tasks at the start of the list', async function(assert) {
    this.tasks = tasklist;
    await render(hbs`<PureTaskList @tasks={{this.tasks}}/>`);
    assert.dom('[data-test-task]:nth-of-type(1)').hasClass('TASK_PINNED');
  });
});
```
