---
title: "Construct a screen"
---

# Construct a screen

So far we’ve concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via redux) in some layout and catching errors:

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { compose, withState, lifecycle } from 'recompose';

import TaskList from './TaskList';

function InboxScreen({ error }) {
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

InboxScreen.propTypes = {
  error: PropTypes.object,
};

export default compose(
  withState('error', 'setError', null),
  lifecycle({
    componentDidCatch(error, errorInfo) {
      this.props.setError(errorInfo);
    },
  })
)(InboxScreen);
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a _container_ that renders the `PureTaskList` presentational component. When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList`.

However, for the `InboxScreen` we have a problem in that although the `InboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense the `InboxScreen` has been polluted by “container-ness”. If we were to render the `InboxScreen` directly in Storybook, like so:

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';

import InboxScreen from './InboxScreen';

storiesOf('InboxScreen', module).add('default', () => <InboxScreen />);
```

We would have an issue because the `TaskList` would have no Redux store to connect to. (You also would encounter similar problems when trying to test the `InboxScreen` with a unit test).

![Broken inbox](/broken-inboxscreen.png)

One solution to this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers will inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="www.chromaticqa.com">Chromatic</a> alongside 660+ stories.
</div>

## Supplying context with decorators

The good news is it is easy to supply a Redux store to the `InboxScreen` in a story! We can just use a mocked version of the Redux store provided in a decorator:

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import InboxScreen from './InboxScreen';
import { defaultTasks } from './TaskList.stories';

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasks,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

storiesOf('InboxScreen', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <InboxScreen />);
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Redux](https://github.com/orta/react-storybooks-relay-container) and others.

**XXX: Not sure about the content below????**

## Fleshing out the screen and adding stories

Now that the nested container component renders properly, we’ll flesh out the rest of the screen. We can develop it in exactly the same way as we developed our other components; using Storybook to drive different use cases.

Start by building a set of stories for the different states a user could be in looking at on the `InboxScreen`:

```javascript
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Inbox from './Inbox';

function buildTask(attrs) {
  return {
    id: Math.round(Math.random() * 1000000).toString(),
    title: 'Test Task',
    subtitle: 'on Test Board',
    url: 'http://test.url',
    updatedAt: Date.now(),
    ...attrs,
  };
}

const pinnedTasks = [
  buildTask({ state: 'TASK_PINNED' }),
  buildTask({ state: 'TASK_PINNED' }),
  buildTask({ state: 'TASK_PINNED' }),
];
const inboxTasks = [
  buildTask({ state: 'TASK_INBOX' }),
  buildTask({ state: 'TASK_INBOX' }),
  buildTask({ state: 'TASK_INBOX' }),
];

const onSnoozeTask = action('onSnoozeTask');
const onPinTask = action('onPinTask');
const events = { onSnoozeTask, onPinTask };

storiesOf('Inbox', module)
  .addDecorator(story => <div id="content-container">{story()}</div>)
  .add('loading', () => <Inbox loading={true} />)
  .add('error', () => <Inbox error={new Error('Foobar')} />)
  .add('no tasks', () => <Inbox pinnedTasks={[]} inboxTasks={[]} {...events} />)
  .add('no pinned tasks', () => <Inbox pinnedTasks={[]} {...{ inboxTasks, ...events }} />)
  .add('no inbox tasks', () => (
    <Inbox
      inboxTasks={[]}
      {...{
        pinnedTasks,
        ...events,
      }}
    />
  ))
  .add('full', () => (
    <Inbox
      {...{
        pinnedTasks,
        inboxTasks,
        ...events,
      }}
    />
  ));
```

This isn’t particularly different to how the `Task` and `TaskList` stories were constructed. We already built `TaskList` stories to cope with more “imperfect” states for `loading` and `empty`. We should represent them here as well. `InboxScreen` also has an `error` state that accounts for web server errors.

Once we've built out those stories, use them to build out the component:

```javascript
import React, { PropTypes } from 'react';
import { propType } from 'graphql-anywhere';

import TaskList from '../components/TaskList';

const Inbox = ({ loading, error, inboxTasks, pinnedTasks, onSnoozeTask, onPinTask }) => {
  let title;
  let lists = [];

  const events = {
    onSnoozeTask,
    onPinTask,
  };

  if (loading) {
    title = 'Get the task, put in box';
  } else if (error) {
    title = error.toString();
  } else {
    if (pinnedTasks.length === 0 && inboxTasks.length === 0) {
      title = 'No Tasks';
    } else {
      title = 'Taskbox';

      if (pinnedTasks.length > 0) {
        lists = lists.concat([
          <h4 className="list-heading" key="pinned-title">
            Important
          </h4>,
          <TaskList key="pinned-tasks" tasks={pinnedTasks} {...events} />,
        ]);
      }

      if (inboxTasks.length > 0) {
        lists = lists.concat([
          <h4 className="list-heading" key="inbox-title">
            Tasks
          </h4>,
          <TaskList key="inbox-tasks" tasks={inboxTasks} {...events} />,
        ]);
      }
    }
  }

  return (
    <div className="page lists-show">
      <nav>
        <h3 className="js-edit-list title-page" style={{ textAlign: 'center' }}>
          <span className="title-wrapper">{title}</span>
        </h3>
      </nav>
      {lists && (
        <div className="content-scrollable list-items" style={{ paddingTop: '48px' }}>
          {lists}
        </div>
      )}
    </div>
  );
};

Inbox.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  inboxTasks: PropTypes.arrayOf(propType(TaskList.fragments.task)),
  pinnedTasks: PropTypes.arrayOf(propType(TaskList.fragments.task)),
  onSnoozeTask: PropTypes.func,
  onPinTask: PropTypes.func,
};

export default Inbox;
```

Again, the component isn’t too complicated, and we are careful to deal with all of the different states outlined in our stories. Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
You may notice that this story generates tasks in a very similar way to the <code>Task.story.js</code> file in the previous part. It makes sense to refactor that logic out into a single test helper utility.
</div>

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline controls style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet. A developers job doesn’t end when the UI is built. You also need to ensure that UI remains durable over time.
