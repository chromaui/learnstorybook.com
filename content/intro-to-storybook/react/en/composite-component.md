---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
commit: 'c43580d'
---

Last chapter we built our first component; this chapter extends what we learned to build TaskList, a list of Tasks. Let’s combine components together and see what happens when more complexity is introduced.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskList` you need to create stories for: default items and default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/components/TaskList.js` and `src/components/TaskList.stories.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Next create `Tasklist`’s test states in the story file.

```javascript
// src/components/TaskList.stories.js

import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited the Default story in task.stories.js.
  tasks: [
    { ...TaskStories.default.args, id: '1', title: 'Task 1' },
    { ...TaskStories.default.args, id: '2', title: 'Task 2' },
    { ...TaskStories.default.args, id: '3', title: 'Task 3' },
    { ...TaskStories.default.args, id: '4', title: 'Task 4' },
    { ...TaskStories.default.args, id: '5', title: 'Task 5' },
    { ...TaskStories.default.args, id: '6', title: 'Task 6' },
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

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator `key` on the default export to add some `padding` around the rendered component. They can also be used to wrap stories in “providers” –i.e. library components that set React context.
</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/react/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort, preserving the same shape for the data and actions (mocked callbacks) expected for both components.

<!--
`taskData` supplies the shape of a `Task` that we created and exported from the `Task.stories.js` file. Similarly, `actionsData` defines the actions (mocked callbacks) that a `Task` component expects, which the `TaskList` also needs. -->

Now check Storybook for the new `TaskList` stories.

<div class="aside">
TODO: vet video
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases we wouldn’t create a new component just to add a wrapper. But the **real complexity** of `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items">
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items">
        <div className="wrapper-message">
          <span className="icon-check" />
          <div className="title-message">You have no tasks</div>
          <div className="subtitle-message">Sit back and relax</div>
        </div>
      </div>
    );
  }
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

The added markup results in the following UI:

<div class="aside">
TODO: vet video
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements and props

As the component grows, so too do input requirements. Define the prop requirements of `TaskList`. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the propTypes you defined in `Task` earlier.

```javascript
// src/components/TaskList.js

import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList() {
  ...
}

TaskList.propTypes = {
  /** Checks if it's in loading state */
  loading: PropTypes.bool,
  /** The list of tasks */
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func.isRequired,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func.isRequired,
};
TaskList.defaultProps = {
  loading: false,
};
```

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `Task` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests with Jest

Storybook stories, manual tests, and snapshot tests go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it has passed in the `tasks` prop. Although we have a story (`WithPinnedTasks`) to test this exact scenario, it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output. The nice thing about the story format is that we can simply import the story in our tests, and render it there!

Create a test file called `src/components/TaskList.test.js`. Here, we’ll build out our tests that make assertions about the output.

<div class="aside">
TODO: Vet this, leads to warning on console about the actions not being defined. (Probably required prop could be dropped?)
</div>

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import '@testing-library/jest-dom/extend-expect';

import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  // Our story will be used for the test.
  // With the arguments that were created.
  ReactDOM.render(<WithPinnedTasks {...WithPinnedTasks.args} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Note that we’ve been able to reuse the `WithPinnedTasks` story in our unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in many ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `Task` changes --perhaps using a different classname or a `textarea` rather than an `input`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful about liberally using unit tests for UI. They're not easy to maintain. Instead rely on manual, snapshot, and visual regression (see [testing chapter](/test/)) tests where possible.
