---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Loading Data

With Ember you can use various ways to load data, but two things that you need to keep in mind:

- Where it's being loaded
- How it's being loaded

By default you should use a route and a data persistance layer, such as [ember-data](https://guides.emberjs.com/release/models/) or [Apollo](https://github.com/ember-graphql/ember-apollo-client). For our small example we're going to use [tracked-redux](https://github.com/pzuraq/tracked-redux) to demonstrate how it can be used with a route.

Add the necessary dependency to your project with:

```bash
ember install tracked-redux
```

First we’ll construct a simple Redux store that responds to actions that change the state of tasks, in a file called `redux.js` in the `app` folder (intentionally kept simple):

```js
// app/store.js

import { createStore } from 'tracked-redux';

export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

// A sample set of tasks
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// Store's initial state
const initialState = {
  isError: false,
  isLoading: false,
  tasks: defaultTasks,
};

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
const reducers = (state, action) => {
  switch (action.type) {
    case actions.ARCHIVE_TASK:
      return taskStateReducer('TASK_ARCHIVED')(state, action);
    case actions.PIN_TASK:
      return taskStateReducer('TASK_PINNED')(state, action);
    default:
      return state || initialState;
  }
};

export const store = createStore(reducers);
```

## Using a Route

We have our store setup. We can now declare fields on the objects where required.

For that we're going to use both a [route](https://guides.emberjs.com/release/routing/defining-your-routes/) and a [controller](https://guides.emberjs.com/release/routing/controllers/). The latter will contain the actions we've created earlier so that we can modify our store with ease.

Inside the `app` directory, create a new one called `tasks` and inside add a new file called `route.js` with the following:

```js
// app/tasks/route.js

import Route from '@ember/routing/route';
import { store } from '../store';

export default class TasksRoute extends Route {
  model() {
    // returns the store tracked state
    // whenever the state changes, these will be reflected in the template
    return store
      .getState()
      .tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');
  }
}
```

Next, we'll need the controller. Inside the `tasks` folder create another file called `controller.js` with the following:

```js
// app/tasks/controller.js

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { store, pinTask, archiveTask } from '../store';

export default class TaskController extends Controller {
  @action
  pinTask(task) {
    store.dispatch(pinTask(task));
  }

  @action
  archiveTask(task) {
    store.dispatch(archiveTask(task));
  }
}
```

And one final file called `template.hbs`, in which we'll add the presentational `<TaskList>` component we've created in the [previous chapter](/intro-to-storybook/ember/en/composite-component/):

```hbs
{{!--app/tasks/template.hbs --}}

<TaskList
  @tasks={{@model}}
  @pinTask={{this.pinTask}}
  @archiveTask={{this.archiveTask}}
/>
```

With this we've accomplished what we've set out to do, we've managed to setup a data persistance layer and also we've managed to keep the components decoupled by adopting some best practices.

Our implementation is rather rudimentary and requires additional work if we decide to update our application. In the next chapter we'll introduce screen components, which will improve how the data is handled in our small application.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
