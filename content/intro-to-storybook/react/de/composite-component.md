---
title: 'Baue eine Komposition'
tocTitle: 'Komposition'
description: 'Setze eine Komposition aus einfachen Komponenten zusammen'
commit: '8db511e'
---

Im letzten Kapitel haben wir unsere erste Komponente entwickelt; in diesem Kapitel erweitern wir das Gelernte, um `TaskList` zu bauen, eine Liste von Aufgaben. Lass uns Komponenten miteinander kombinieren und sehen, was passiert, wenn mehr Komplexität ins Spiel kommt.

## Liste von Aufgaben

Taskbox hebt eine angeheftete Aufgabe hervor, indem es sie über anderen Aufgaben positioniert. Hieraus ergeben sich zwei Varianten der `TaskList`, für die wir Stories anlegen müssen: Normale Aufgaben sowie normale und angeheftete Aufgaben.

![normale und angeheftete Aufgaben](/intro-to-storybook/tasklist-states-1.png)

Da die Daten für `Task` asynchron geladen werden, brauchen wir **auch** einen Ladezustand, der bei fehlender Verbindung gerendert wird. Zusätzlich wird ein leerer Zustand benötigt, wenn es keine Tasks gibt.

![leere und ladende Aufgaben](/intro-to-storybook/tasklist-states-2.png)

## Los geht's

Eine Komposition unterscheidet sich nicht allzu sehr von den einfachen Komponenten, die sie beinhaltet. Erstelle eine `TaskList` Komponente und eine zugehörige Story Datei: `src/components/TaskList.js` und `src/components/TaskList.stories.js`.

Beginne mit einer groben Implementierung der `TaskList`. Du musst die `Task` Komponente importieren, die du zuvor erstellt hast, und die Attribute und Actions als Props übergeben.

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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

export default TaskList;
```

Lege als Nächstes die Test-Zustände für `TaskList` in der Story Datei an.

```javascript
// src/components/TaskList.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';

import TaskList from './TaskList';
import { task, actions } from './Task.stories';

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
  .addDecorator(story => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />);
```

Über `addDecorator()` können wir jeder Aufgabe einen gewissen "Kontext" für das Rendering mitgeben. In diesem Fall fügen wir ein `padding` um die Liste hinzu, um sie visuell schneller erfassen zu können.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decorators</b></a> sind eine Möglichkeit, einer Story beliebige umschließende Elemente hinzuzufügen. In diesem Fall nutzen wir einen Decorator um Styling zu ergänzen. Sie können auch verwendet werden, um Stories in "Provider" einzupacken - z.B. eine Library-Komponente, die einen React Kontext setzt.
</div>

`task` liefert die Struktur einer `Task` Komponente, wie wir es aus `Task.stories.js` exportiert haben. Auf die gleiche Weise definiert `actions` die Actions (gemockte Callbacks), die von einer `Task` Komponente erwartet werden und die wir in `TaskList` ebenfalls benötigen.

Sieh dir jetzt die neuen `TaskList` Stories in Storybook an.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Die Zustände implementieren

Unsere Komponente ist noch sehr roh, aber wir können uns jetzt ein Bild von den Stories machen, auf die wir hinarbeiten wollen. Vielleicht denkst du, dass der `.list-items` Wrapper kaum eine eigene Komponente rechtfertigt. Du hast Recht - in den meisten Fällen würden wir keine neue Komponente erstellen, nur um einen Wrapper hinzuzufügen. Aber die **wahre Komplexität** der `TaskList` Komponente kommt erst mit den Grenzfällen `withPinnedTasks`, `loading` und `empty` zum Vorschein. 

```javascript
// src/components/TaskList.js

import React from 'react';

import Task from './Task';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
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

export default TaskList;
```

Durch das zusätzliche Markup ergibt sich folgende UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Achte auf die Position der angehefteten Aufgabe in der Liste. Wir wollen, dass angeheftete Aufgaben oben in der Liste angezeigt werden, um sie dem Benutzer als Aufgabe mit Priorität kenntlich zu machen.

## Data requirements and props

As the component grows, so too do input requirements. Define the prop requirements of `TaskList`. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the propTypes you defined in `Task` earlier.

```javascript
// src/components/TaskList.js

import React from 'react';
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

In the previous chapter we learned how to snapshot test stories using Storyshots. With `Task` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer such as [Enzyme](http://airbnb.io/enzyme/).

![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it has passed in the `tasks` prop. Although we have a story (`withPinnedTasks`) to test this exact scenario, it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `src/components/TaskList.test.js`. Here, we’ll build out our tests that make assertions about the output.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import TaskList from './TaskList';
import { withPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
  ReactDOM.render(<TaskList tasks={withPinnedTasks} {...events} />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Note that we’ve been able to reuse the `withPinnedTasks` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in many ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `Task` changes --perhaps using a different classname or a `textarea` rather than an `input`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful about liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot, and visual regression (see [testing chapter](/test/)) tests where possible.
