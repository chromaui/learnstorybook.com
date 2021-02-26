---
title: 'Baue eine Komposition'
tocTitle: 'Komposition'
description: 'Setze eine Komposition aus einfachen Komponenten zusammen'
commit: 'f9b2cfb'
---

Im letzten Kapitel haben wir unsere erste Komponente entwickelt; in diesem Kapitel erweitern wir das Gelernte, um `TaskList` zu bauen, eine Liste von Aufgaben. Lass uns Komponenten miteinander kombinieren und sehen, was passiert, wenn mehr Komplexität ins Spiel kommt.

## Liste von Aufgaben

Taskbox hebt eine angeheftete Aufgabe hervor, indem es sie über anderen Aufgaben positioniert. Hieraus ergeben sich zwei Varianten der `TaskList`, für die wir Stories anlegen müssen: Erstens "normale" Aufgaben sowie zweitens "normale und angeheftete" Aufgaben.

![normale und angeheftete Aufgaben](/intro-to-storybook/tasklist-states-1.png)

Da die Daten für `Task` asynchron geladen werden, brauchen wir **auch** einen Ladezustand, der bei fehlender Verbindung gerendert wird. Zusätzlich wird ein leerer Zustand benötigt, wenn es keine Tasks gibt.

![leere und ladende Aufgaben](/intro-to-storybook/tasklist-states-2.png)

## Los geht's

Eine Komposition unterscheidet sich nicht allzu sehr von den einfachen Komponenten, die sie beinhaltet. Erstelle eine `TaskList`-Komponente und eine zugehörige Story-Datei: `src/components/TaskList.js` und `src/components/TaskList.stories.js`.

Beginne mit einer groben Implementierung der `TaskList`. Du musst die `Task`-Komponente importieren, die du zuvor erstellt hast, und die Attribute und Actions als Props übergeben.

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

Lege als Nächstes die Test-Zustände für `TaskList` in der Story-Datei an.

```javascript
// src/components/TaskList.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';

import TaskList from './TaskList';
import { taskData, actionsData } from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
  excludeStories: /.*Data$/,
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];

export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

export const Default = () => <TaskList tasks={defaultTasksData} {...actionsData} />;

export const WithPinnedTasks = () => <TaskList tasks={withPinnedTasksData} {...actionsData} />;

export const Loading = () => <TaskList loading tasks={[]} {...actionsData} />;

export const Empty = () => <TaskList tasks={[]} {...actionsData} />;
```

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> sind eine Möglichkeit, einer Story beliebige umschließende Elemente hinzuzufügen. In diesem Fall nutzen wir einen Decorator `key` im `default export`, um ein `padding` um die gerenderte Komponente hinzuzufügen. Sie können auch verwendet werden, um Stories in "Provider" einzupacken - z.B. eine Library-Komponente, die einen React-Kontext setzt.
</div>

`taskData` liefert die Struktur einer `Task`-Komponente, wie wir es aus `Task.stories.js` exportiert haben. Auf die gleiche Weise definiert `actionsData` die Actions (gemockte Callbacks), die von einer `Task`-Komponente erwartet werden und die wir in `TaskList` ebenfalls benötigen.

Sieh dir jetzt die neuen `TaskList`-Stories in Storybook an.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Die Zustände implementieren

Unsere Komponente ist noch sehr roh, aber wir können uns jetzt ein Bild von den Stories machen, auf die wir hinarbeiten wollen. Vielleicht denkst du, dass der `.list-items`-Wrapper kaum eine eigene Komponente rechtfertigt. Du hast Recht - in den meisten Fällen würden wir keine neue Komponente erstellen, nur um einen Wrapper hinzuzufügen. Aber die **wahre Komplexität** der `TaskList`-Komponente kommt erst mit den Grenzfällen `withPinnedTasks`, `loading` und `empty` zum Vorschein.

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

## Anforderungen an die Daten und Props

Mit einer wachsenden Komponente wachsen auch die Anforderungen an ihren Input. Definiere die Prop-Anforderungen der `TaskList`. Da `Task` eine Kind-Komponente ist, sollte sichergestellt sein, dass Daten in der passenden Struktur geliefert werden, um diese zu rendern. Um Zeit zu sparen und Kopfschmerzen vorzubeugen, solltest du die propTypes wiederverwenden, die du zuvor in `Task` definiert hast.

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

## Automatisiertes Testen

Im letzten Kapitel haben wir gelernt, wie man Snapshot-Tests für Stories mit Storyshots erstellt. Bei `Task` musste nicht viel Komplexität getestet werden, außer dass die Komponente richtig rendert. Da mit `TaskList` zusätzliche Komplexität einhergeht, wollen wir auf für Test-Automatisierung verträgliche Weise verifizieren, dass ein bestimmter Input einen bestimmten Output liefert. Um das zu erreichen, werden wir Unit-Tests mit [Jest](https://facebook.github.io/jest/) erstellen, in Verbindung mit einem Test-Renderer.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit-Tests mit Jest

Storybook-Stories zusammen mit manuellen visuellen Tests und Snapshot-Tests (siehe oben) sind sehr hilfreich, um UI-Fehler zu vermeiden. Wenn Stories viele Anwendungsfälle einer Komponente abdecken und wir Werkzeuge nutzen, die sicherstellen, dass ein Mensch alle Änderungen an einer Story gegencheckt, sind Fehler wesentlich unwahrscheinlicher.

Nichtsdestotrotz steckt der Teufel manchmal im Detail. Daher wird ein Test-Framework benötigt, das sich genau um solche Details kümmert. Das führt uns zu Unit-Tests.

In unserem Fall wollen wir, dass unsere `TaskList` alle angehefteten Aufgaben **vor** anderen Aufgaben rendert, die ihr über die `tasks`-Prop übergeben werden. Auch wenn wir eine Story haben (`WithPinnedTasks`), die genau das abdeckt, ist es für einen menschlichen Tester vielleicht nicht sofort ersicht, dass ein Bug vorliegt, wenn die Komponente **aufhört**, Aufgaben auf diese Weise zu sortieren. Sicherlich wird es einem nicht sofort als **Falsch!** ins Auge springen.

Um diesem Problem entgegenzuwirken, können wir Jest verwenden, um die Story im DOM zu rendern und per Code einige DOM Abfragen zu erstellen, die solche typischen Merkmale des Ouputs verifizieren. Das Schöne am Story-Format ist, dass wir die Story einfach in unserem Test importieren und dort rendern können!

Erstelle eine Test-Datei namens `src/components/TaskList.test.js`. Darin schreiben wir unsere Tests, die Annahmen über den Output treffen.

```javascript
// src/components/TaskList.test.js

import React from 'react';
import ReactDOM from 'react-dom';
import { WithPinnedTasks } from './TaskList.stories';

it('renders pinned tasks at the start of the list', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WithPinnedTasks />, div);

  // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
  const lastTaskInput = div.querySelector('.list-item:nth-child(1) input[value="Task 6 (pinned)"]');
  expect(lastTaskInput).not.toBe(null);

  ReactDOM.unmountComponentAtNode(div);
});
```

![TaskList Test Runner](/intro-to-storybook/tasklist-testrunner.png)

Beachte, dass wir die `WithPinnedTasks`-Story im Unit-Test wiederverwenden konnten; auf diese Weise können wir bestehende Ressourcen (die Beispiele, die relevante Konfigurationen einer Komponente repräsentieren) auf verschiedene Weisen nutzen.

Beachte auch, dass dieser Test ziemlich instabil ist. Es ist möglich, dass mit der Weiterentwicklung des Projekts und einer Änderung an der Implementierung von `Task` -- vielleicht die Änderung des Klassen-Namens oder der Verwendung von `textarea`, statt `input` -- der Test fehlschlagen wird und aktualisiert werden muss. Das ist nicht unbedingt ein Problem, vielmehr ein Hinweis darauf, dass man vorsichtig sein sollte damit, Unit-Tests allzu großzügig für die UI zu nutzen. Ihre Wartung ist nicht einfach. Stattdedden solltest du lieber visuelle, Snapshot- und visuelle Regressions-Tests (siehe [Kapitel "Testen"](/intro-to-storybook/react/de/test/)) verwenden, wo möglich.
