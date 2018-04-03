---
title: "Assemble a composite component"
---

# Assemble a composite component

Last chapter we built our first component, this chapter extends what we learned to build TaskList, a list of Tasks. Let’s combine components together and see what happens when more complexity is introduced.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskList` you need to create stories for: `TaskList` with default items and `TaskList` with both default and pinned items.

![default and pinned tasks](/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we _also_ need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/components/TaskList.js` and `src/components/TaskList.story.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```javascript
import React from 'react'
import PropTypes from 'prop-types'

import Task from './Task'

function TaskList({ tasks, onSnoozeTask, onPinTask, onArchiveTask }) {
  const events = {
    onSnoozeTask,
    onPinTask,
    onArchiveTask,
  }

  return (
    <div className="list-items">
      {tasks.map(task => <Task key={task.id} task={task} {...events} />)}
    </div>
  )
}

export default TaskList
```

Next create `Tasklist`’s test states in the story file.

```javascript
import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import TaskList from './TaskList';
import { TASK_STATES } from '../utils/schema';
import { buildTask } from '../utils/test-helpers';

function buildStory(tasks) {
  const onPinTask = action('onPinTask');
  const onArchiveTask = action('onArchiveTask');
  const onUpdateTaskTitle = action('onUpdateTaskTitle');

  return (
    <TaskList
      {...{ tasks, onPinTask, onSnoozeTask, onArchiveTask, onUpdateTaskTitle }}
    />
  );
}

storiesOf('TaskList', module)
  .addDecorator(story => <div style={{ background: 'white' }}>{story()}</div>)
  .add('default', () => ...)
  .add('w/ pinned tasks', () => ...)
  .add('loading', () => ...)
  .add('empty', () => ...);
```

`addDecorator()` allows us to add some “context” to the rendering of each task. In this case we add padding around the list to make it easier to visually verify.

<div class="aside">
<b>Decorators</b> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator to add styling. They can also be used to wrap stories in “providers” –i.e. library components that set React context.
</div>

`buildStory()` is a helper function that generates the `TaskList` component and populates it with `Task` item variations. Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic; in most cases we wouldn’t create a new component just to add a wrapper. But the real complexity of `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList(
  { tasks, onSnoozeTask, onPinTask, onArchiveTask },
) {
  const events = {
    onSnoozeTask,
    onPinTask,
    onArchiveTask,
  };

if(loading) { return(
    ...
  );}

if(tasks.length === 0) { return(
    ...
  );}

  return (
    <div className="list-items">
      {tasks.map(task => <Task key={task.id} task={task} {...events} />)}
    </div>
  );
}


TaskList.propTypes = {
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onSnoozeTask: PropTypes.func,
  onPinTask: PropTypes.func,
  onArchiveTask: PropTypes.func,
};

export default TaskList;
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list because the Taskbox user has told us that it's more important.

## Data requirements and props

As the component grows, so too do input requirements. Define the prop requirements of `TaskList`. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache reuse the proptypes you defined in `Task` earlier.

```javascript
import React from 'react';
import PropTypes from 'prop-types';

function TaskList() {
  ...
}


TaskList.propTypes = {
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onSnoozeTask: PropTypes.func,
  onPinTask: PropTypes.func,
  onArchiveTask: PropTypes.func,
};

export default TaskList;
```

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `Task` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer such as [Enyzme](http://airbnb.io/enzyme/).

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks _before_ unpinned tasks that it is passed in the `tasks` prop. Although we have a story (`withPinnedTasks`) to test this exact scenario; it can be ambiguous to a human reviewer that if the component _stops_ ordering the tasks like this, it is a bug. It certainly won’t scream _“Wrong!”_ to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `Task.test.js`. Here we’ll build out our tests that make assertions about the output.

...code

Note that we’ve been able to reuse the `withPinnedTasks` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in more and more ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `Task` changes --perhaps using a different classname or a `textarea` rather than an `input`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot, and visual regression (see testing chapter) tests where possible.

[code snippet]
