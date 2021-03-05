---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
---

Last chapter we built our first component; this chapter extends what we learned to build TaskList, a list of Tasks. Let’s combine components together and see what happens when more complexity is introduced.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskList` you need to create stories for: default items and default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskList` component and an accompanying story file: `components/TaskList.js` and `components/TaskList.stories.js`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```javascript
// components/TaskList.js
import * as React from 'react';
import Task from './Task';
import { FlatList, Text, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>loading</Text>
      </SafeAreaView>
    );
  }
  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>empty</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}

export default TaskList;
```

Next create `Tasklist`’s test states in the story file.

```javascript
// components/TaskList.stories.js
import * as React from 'react';
import { View } from 'react-native';
import { styles } from '../constants/globalStyles';
import { storiesOf } from '@storybook/react-native';
import { task, actions } from './Task.stories';
import TaskList from './TaskList';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];
export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

storiesOf('TaskList', module)
  .addDecorator(story => <View style={[styles.TaskBox, { padding: 42 }]}>{story()}</View>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />);
```

As you may have noticed, the `addDecorator()` was used in the previous chapter and in this one, it allows us to add some “context” to the rendering of each task. In this case we add padding around the list to make it easier to visually verify.

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator to add styling. They can also be used to wrap stories in “providers” –i.e. library components that set React context.
</div>

`task` supplies the shape of a `Task` that we created and exported from the `Task.stories.js` file. Similarly, `actions` defines the actions (mocked callbacks) that a `Task` component expects, which the `TaskList` also needs.

Don't forget that this story also needs to be added to `storybook/index.js` so that it can be picked up and displayed.

Change the `configure()` method to the following:

```javascript
// storybook/config.js
configure(() => {
  require('../components/Task.stories.js');
  require('../components/TaskList.stories.js');
}, module);
```

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `listitems` wrapper is overly simplistic. You're right – in most cases we wouldn’t create a new component just to add a wrapper. But the **real complexity** of `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

For the loading edge case, we're going to create a new component that will display the correct markup.

Create a new file called `LoadingRow.js` with the following content:

```javascript
// components/LoadingRow.js
import React, { useState, useEffect } from 'react';
import { Animated, Text, View, Easing, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

const GlowView = props => {
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      })
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: glowAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const LoadingRow = () => (
  <SafeAreaView style={{ padding: 12 }}>
    <GlowView>
      <View style={styles.LoadingItem}>
        <View style={styles.GlowCheckbox} />
        <Text style={styles.GlowText}>Loading</Text>
        <Text style={styles.GlowText}>cool</Text>
        <Text style={styles.GlowText}>state</Text>
      </View>
    </GlowView>
  </SafeAreaView>
);

export default LoadingRow;
```

And update `TaskList.js` to the following:

```javascript
// components/TaskList.js
import * as React from 'react';
import Task from './Task';
import PercolateIcons from '../constants/Percolate';
import LoadingRow from './LoadingRow';
import { FlatList, Text, SafeAreaView, View } from 'react-native';
import { styles } from '../constants/globalStyles';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </SafeAreaView>
    );
  }
  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <View style={styles.WrapperMessage}>
          <PercolateIcons name="check" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>You have no tasks</Text>
          <Text style={styles.SubtitleMessage}>Sit back and relax</Text>
        </View>
      </SafeAreaView>
    );
  }
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasksInOrder}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}

export default TaskList;
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements and props

As the component grows, so too do input requirements. Define the prop requirements of `TaskList`. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the propTypes you defined in `Task` earlier.

```javascript

// components/TaskList.js
import * as React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `Task` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/).

![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it has passed in the `tasks` prop. Although we have a story (`withPinnedTasks`) to test this exact scenario, it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `components/__tests__/TaskList.test.js`. Here, we’ll build out our tests that make assertions about the output.

```javascript
// components/__tests__/TaskList.test.js
import * as React from 'react';
import { create } from 'react-test-renderer';
import TaskList from '../TaskList';
import { withPinnedTasks } from '../TaskList.stories';
import Task from '../Task';
describe('TaskList', () => {
  it('renders pinned tasks at the start of the list', () => {
    const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
    const tree = create(<TaskList tasks={withPinnedTasks} {...events} />);
    const rootElement = tree.root;
    const listofTasks = rootElement.findAllByType(Task);
    expect(listofTasks[0].props.task.title).toBe('Task 6 (pinned)');
  });
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Note that we’ve been able to reuse the `withPinnedTasks` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in many ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `Task` changes --perhaps using a different styling prop or a `Text` rather than an `TextInput`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful about liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot tests where possible.
