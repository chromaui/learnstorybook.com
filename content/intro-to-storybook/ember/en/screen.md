---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Redux) in some layout and pulling a top-level `error` field out of redux (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating the store (in `app/reducers/index.js`) to include the error field we want:

```javascript
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
  isError: false,
  tasks: defaultTasks,
};
// The actions are the "names" of the changes that can happen to the store
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  SET_ERROR: 'SET_ERROR',
};

// The action creators bundle actions with the data required to execute them
export const archiveTask = id => ({ type: actions.ARCHIVE_TASK, id });
export const pinTask = id => ({ type: actions.PIN_TASK, id });
export const setError = () => ({ type: actions.SET_ERROR });
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
    case actions.SET_ERROR:
      return {
        ...state,
        isError: true,
      };
    default:
      return state || initialState;
  }
};

export default combineReducers({
  reducer,
});
```

The store is updated with the new field. Let's create a presentational `PureInboxScreen.hbs` in our `app/components` folder:

```handlebars
{{!--app/components/PureInboxScreen.hbs--}}
{{#if @error}}
  <div class="page lists-show">
    <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
    </div>
  </div>
{{else}}
  <div class="page lists-show">
    <nav>
        <h1 class="title-page">
            <span class="title-wrapper">Taskbox</span>
        </h1>
    </nav>
    {{TaskList}}
  </div>
{{/if}}
```

Then, we can create a container, which again grabs the data for the `PureInboxScreen` in `app/components/InboxScreen.hbs` add the following:

```handlebars
{{!--app/components/InboxScreen.hbs--}}
<div>
    {{PureInboxScreen error=error}}
</div>
```

In `app/components/InboxScreen.js` add the following:

```javascript
// app/components/InboxScreen.js
import Component from '@glimmer/component';
import { connect } from 'ember-redux';
import { computed } from '@ember/object';

const stateToComputed = state => {
  const { reducer } = state;
  const { isError } = reducer;

  return {
    error: isError,
  };
};
class InboxScreen extends Component {
  constructor() {
    super(...arguments);
  }
  @computed('error')
  get error() {
    return this.error;
  }
}
export default connect(stateToComputed)(InboxScreen);
```

We also change the `application` template to render the `InboxScreen` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```handlebars
{{!-- app/templates/aplication.hbs --}}

{{InboxScreen}}
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition with other frameworks, container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service.

When placing the `TaskList` into Storybook, we were able to ilustrate this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

So when we setup our stories in `PureInboxScreen.stories.js`:

```javascript
// app/components/PureInboxScreen.stories.js

import { hbs } from 'ember-cli-htmlbars';

export default {
  title: 'PureInboxScreen',
  component: 'PureInboxScreen',
};

export const Default = () => ({
  template: hbs`{{PureInboxScreen}}`,
});
export const error = () => ({
  template: hbs`{{PureInboxScreen error=true}}`,
});
```

We see that both the `error` and `standard` stories work just fine. (But you will encounter some problems when trying to test the `PureInboxScreen` with a unit test if no data is supplied like we did with `TaskList`).

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromaticqa.com">Chromatic</a> alongside 800+ stories.
</div>

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
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
