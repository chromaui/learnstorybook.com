---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Loading Data

In ember you can use a couple of ways to load data. There is two things to keep
an eye on. First where you load the data and second how you load the data.
Traditionally, you want to use a route and some persistence layer, such as
ember-data or [Apollo](https://github.com/ember-graphql/ember-apollo-client).

In this example we are going to use redux and demonstrate the usage of it at a
route and will improve from here as we proceed. To utilize [ember's
reactivity](https://www.pzuraq.com/how-autotracking-works/)
system, we are going to use [tracked-redux](https://github.com/pzuraq/tracked-redux).

Add the necessary dependency to your project with:

```bash
ember install tracked-redux
```

We'll construct our actions, reducers and finally a tracked redux store. Start
with the actions:

```js
// app/actions/index.js
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK'
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = (id) => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = (id) => ({ type: actions.PIN_TASK, id });
```

Then our reducers:

```js
// app/reducers/index.js
import { actions } from '../actions';

const defaultTasks = [
  { id: "1", title: "Something", state: "TASK_INBOX" },
  { id: "2", title: "Something more", state: "TASK_INBOX" },
  { id: "3", title: "Something else", state: "TASK_INBOX" },
  { id: "4", title: "Something again", state: "TASK_INBOX" },
];

const initialState = {
  tasks: defaultTasks,
};

// All our reducers simply change the state of a single task.
function taskStateReducer(taskState) {
  return (state, action) => {
    return {
      ...state,
      tasks: state.tasks.map((task) =>
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

export default reducers;
```

And finally our store (watch the import):

```js
// app/store.js
import { createStore } from 'tracked-redux';
import reducers from './reducers';

export const store = createStore(reducers);
```

First we’ll construct a simple Redux store that responds to actions that change
the state of tasks, in a file called `reducers/index.js` (intentionally kept
simple):

## Using a Route

With that we are able to connect our route with the redux store. Thanks to
tracked-redux we have no artificial properties put on the prototype of our
objects, instead we can explicitely declare each field we want. Here we are
going to use the route to load the data and a controller with actions to modify
it:

```js
// app/tasks/route.js
import Route from '@ember/routing/route';
import { store } from '../store';

export default class TasksRoute extends Route {
  model() {
    // thanks to tracked redux, store.getState()
    // returns a tracked state
    // whenever the state changes, these will be reflected in the template
    return store.getState().tasks.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
  }
}
```

And the controller with modifications where we are going to use our earlier
defined actions:

```js
// app/tasks/controller.js
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { store } from '../store';
import { pinTask, archiveTask } from '../actions';

export default class TaskController extends Controller {
  @action
  pinTask(task) {
    store.dispatch(pinTask(task.id));
  }

  @action
  archiveTask(task) {
    store.dispatch(archiveTask(task.id));
  }
}
```

And we use our earlier created presentational `<TaskList>` component, mount it
at the route template and connect it with the actions in the controller and the
data from the route.

```hbs
{{!--app/tasks/template.hbs --}}
<TaskList
  @tasks={{@model}}
  @pinTask={{this.pinTask}}
  @archiveTask={{this.archiveTask}}
/>
```

We will keep the presentational `<TaskList>` decoupled from the data-loading
mechanism to enforce separation of concerns and a good architecture overall.
However, also our current implementation of using a route and a controller
doesn't feel overall pleasing. We can use a container component instead, that
is also responsible for data loading and visually managing its state. We will do
this in the next step with the introduction of screen components.
