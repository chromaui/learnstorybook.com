---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Loading Data

In Ember you can use various ways to load data. But two things that you need to keep in mind. Where are you loading the data and how you're loading it. Per Ember's conventions, you traditionally use a route and some form of data persistance layer, such as [ember-data](https://guides.emberjs.com/release/models/) or [Apollo](https://github.com/ember-graphql/ember-apollo-client).

In this example we're going take a different approach and use redux and demonstrate how it can be used with a route. Making the necessary improvements as we progress. We're going to use [tracked-redux](https://github.com/pzuraq/tracked-redux) to handle the data persistance while allowing one of Ember's core features, which is it's [reactivity](https://www.pzuraq.com/how-autotracking-works/).

Add the necessary dependency to your project with:

```bash
ember install tracked-redux
```

Once the package is installed we can begin the implementation. Starting with our actions:

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

Then our reducer:

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

That concludes our redux setup. That's the _how_ we are loading data, let's
continue with _where_ we do that.

## Using a Route

We have our redux store setup. Thanks to `tracked-redux` we can explicitely
declare fields on the objects where we need it. For that we're going to
use both a [route](https://guides.emberjs.com/release/routing/defining-your-routes/) and a [controller](https://guides.emberjs.com/release/routing/controllers/), the latter will contain the actions we've
created earlier so that we can modify our store with relative ease.

Inside your app folder, create a new one called `tasks` and inside add a new file called `route.js` with the following:

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

Once the route is created, we can now move onto creating a controller with the necessary actions. Inside the `tasks` folder we've created add a new file called `controller.js` with the following:

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

And finally we create a new file called `template.hbs` inside the `tasks`
folder, in which we'll add the presentational `<TaskList>` component we've created in the [previous chapter](/ember/en/composite-component/):

```hbs
{{!--app/tasks/template.hbs --}}
<TaskList
  @tasks={{@model}}
  @pinTask={{this.pinTask}}
  @archiveTask={{this.archiveTask}}
/>
```

With this we've accomplished what we've set out to do, we've managed to setup a
data persistance layer and also we've managed to keep the components decoupled
by listening to some best practices. But this type of implementation doesn't feel
overall pleasing. We could use a container component instead, which will be
responsible for loading the data and also visually managing its state. And
that's what we'll do in the next chapter when we introduce screen components.
