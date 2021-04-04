---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Screen components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `<TaskList>` component in some layout and apply a data layer with loading and error states from redux (let's assume we'll set that field if we have some problem connecting to our server). We will do that for two reasons: First is to keep data-management and presentation clearly separated and second screen components do help to move things around in the app as well as design reviews within Storybook.

Let's start by updating our store with the necessary fields:

```diff:title=app/store.js

import { createStore } from 'tracked-redux';

export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // The new actions to handle both error and loading state
+ SET_ERROR: 'SET_ERROR',
+ SET_LOADING: 'SET_LOADING',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });

+ export const setError = () => ({ type: actions.SET_ERROR });
+ export const setLoading = () => ({ type: actions.SET_LOADING });

// A sample set of tasks
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

// Store initial state
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
+   case actions.SET_ERROR:
+     return {
+       ...state,
+       isError: true,
+     };
+   case actions.SET_LOADING:
+     return {
+       ...state,
+       isLoading: true,
+     };
    default:
      return state || initialState;
  }
};

export const store = createStore(reducers);
```

Next, create a new component called `inbox-scree.hbs` inside the `app/components` directory:

```handlebars:title=app/components/inbox-screen.hbs
<div>
  <div class="page lists-show">
    <nav>
      <h1 class="title-page">
        <span class="title-wrapper">
          Taskbox
        </span>
      </h1>
    </nav>
    {{#if this.loading}}
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
      <LoadingRow />
    {{else if this.error}}
      <div class="page lists-show">
        <div class="wrapper-message">
          <span class="icon-face-sad"></span>
          <div class="title-message">
            Oh no!
          </div>
          <div class="subtitle-message">
            Something went wrong
          </div>
        </div>
      </div>
    {{else}}
      <TaskList
        @tasks={{this.tasks}}
        @pinTask={{this.pinTask}}
        @archiveTask={{this.archiveTask}}
      />
    {{/if}}
  </div>
</div>
```

We now have a way to handle the various states of our application. We can now move the existing logic for handling the data loading and error handling into the component.

Inside `app/components/inbox-screen.js` add the following:

```js:title=app/components/inbox-screen.js
import Component from '@glimmer/component';
import { action } from '@ember/object';

import { store, pinTask, archiveTask } from '../store';

export default class InboxScreenComponent extends Component {
  get loading() {
    return this.args.loading ?? store.getState().isLoading;
  }

  get error() {
    return this.args.error ?? store.getState().isError;
  }

  get tasks() {
    return store
      .getState()
      .tasks.filter(t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');
  }

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

We can now safely delete the `tasks` folder we created in the [previous chapter](/intro-to-storybook/ember/en/data/) and add the `InboxScreen` to the `application` template.

```handlebars:title=app/templates/aplication.hbs
<InboxScreen />
```

However, where things get interesting is in rendering the story in Storybook.

As `loading` and `error` are states internal to the `InboxScreen` component, they usually aren't controlled from the outside, so we allow those to be passed in as arguments. That will enable us to showcase these variations in Storybook.

So when we setup our stories in `inbox-screen.stories.js`:

```js:title=app/components/inbox-screen.stories.js
import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'InboxScreen',
  component: 'InboxScreen',
};

const Template = args => ({
  template: hbs`<InboxScreen @error={{this.error}} @loading={{this.loading}} />`,
  context: args,
});

export const Default = Template.bind({});
Default.args = {
  loading: false,
  error: false,
};

export const Error = Template.bind({});
Error.args = {
  ...Default.args,
  error: true,
};

export const Loading = Template.bind({});
Loading.args = {
  ...Default.args,
  loading: true,
};
```

We see that both the `Error`, `Loading` and `Default` stories work just fine.

<div class="aside">
💡 In Ember, routes support <code>loading</code> and <code>error</code> states. Though the motivation is go more towards a component based approach. Take a look at <a href="https://exelord.gitbook.io/ember-await/">ember-await</a> which nicely encapsulates the idea of data-management and has mechanisms to indicate each state.
</div>

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
