---
title: 'Bouw een samengestelde component'
tocTitle: 'Samengestelde component'
description: 'Bouw een samengestelde component uit eenvoudigere componenten'
commit: '73d7821'
---

In het vorige hoofdstuk hebben we onze eerste component gebouwd; dit hoofdstuk gaat voort op wat we geleerd hebben bij het bouwen van `TaskList`, een lijst van taken. Laten we nu een aantal componenten combineren en zien wat er gebeurt wanneer de complexiteit toeneemt.

## Tasklist

Taskbox benadrukt gepinde taken door ze boven de standaard taken te plaatsen. Dit resulteert in 2 variaties van `TaskList` waarvoor we _stories_ moeten creëren: standaard taken en gepinde taken.

![standaard en gepinde taken](/intro-to-storybook/tasklist-states-1.png)

Omdat `Task` data asynchroon verzonden kan worden, moeten we **ook** een laadstatus weergeven als er geen verbinding is. Bovendien is een lege status vereist wanneer er geen taken zijn.

![lege en ladende taken](/intro-to-storybook/tasklist-states-2.png)

## Voorbereiding

Een samengestelde component is niet heel verschillend van het basis component die het omvat. Maak bestanden voor het `TaskList` component en de bijhorende _stories_ aan: `src/components/TaskList.js` en `src/components/TaskList.stories.js`.

Start met een ruwe implementatie van `TaskList`. Je zal de `Task` component van eerder moeten importeren en de attributen en acties als input doorgeven.

```js:title=src/components/TaskList.js
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
      {tasks.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

Maak vervolgens de teststatussen van `TaskList` aan in het `stories` bestand.

```js:title=src/components/TaskList.stories.js
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
  .addDecorator((story) => <div style={{ padding: '3rem' }}>{story()}</div>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />);
```

`addDecorator()` stelt ons in staat om "context" toe te voegen aan het renderen van elke taak. In dit geval voegen we padding toe rond de lijst zodat het makkelijker is om deze visueel te verifiëren.

<div class="aside">
<a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decorators</b></a> zijn een manier om willekeurige wrappers toe te voegen aan _stories_. In dit geval gebruiken we een decorator om styling toe te voegen. Ze kunnen ook gebruikt worden om _stories_ te wrappen in "providers" – d.w.z library componenten die een React context aanmaken.
</div>

`task` voorziet de vorm van een `Task` die we gemaakt en geëxporteerd hebben van het `Task.stories.js` bestand. Op een gelijkaardige manier definieren `actions` de acties (mocked callbacks) die een `Task` component verwacht, en de `TaskList` ook nodig heeft.

Controleer nu Storybook voor de nieuwe `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Statussen uitbouwen

Onze component is nog steeds onvolledig, maar nu hebben we een idee van de _stories_ waar we naartoe willen werken. Misschien denk je dat de `.list-items` wrapper te simplistisch is. Dat klopt - in de meeste gevallen zouden we geen nieuwe component aanmaken alleen maar om een wrapper toe te voegen. De **echte complexiteit** van de `TaskList` component wordt echter pas zichtbaar in de randgevallen `withPinnedTasks`, `loading` en `empty`.

```js:title=src/components/TaskList.js
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
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
  ];

  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}

export default TaskList;
```

De toegevoegde markup resulteert in de volgende UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Merk de positie van de gepinde item in de lijst op. We willen het gepinde item bovenaan de lijst tonen om het een prioriteit te geven voor de gebruiker.

## Data vereisten en props

Naarmate de component groeit, doen de input vereisten dat ook. Definieer nu de vereiste _props_ van `TaskList`. Omdat `Task` een child component is, moeten we zeker zijn dat de data in de juiste vorm wordt aangeleverd om deze te renderen. Om tijd en zorgen te besparen, kunnen we de `propTypes` herbruiken die je eerder in `Task` gedefinieerd hebt.

```js:title=src/components/TaskList.js
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

## Geautomatiseerde testen

In het vorige hoofdstuk leerden we test _stories_ te _snapshotten_ aan de hand van Storyshots. Voor `Task` was er niet veel complexiteit om te testen behalve om te kijken of dit normaal rendert. Omdat `TaskList` een extra laag complexiteit toevoegt, willen we verifiëren dat bepaalde inputs zekere outputs teruggeven op een manier die gebruikt kan worden voor geautomatiseerde testen. Om dit mogelijk te maken zullen we unit tests toevoegen aan de hand van [Jest](https://facebook.github.io/jest/) gekoppeld aan een test renderer zoals [Enzyme](http://airbnb.io/enzyme/).
![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests met Jest

Storybook _stories_ gekoppeld met handmatige visuele testen en snapshot tests (zie hierboven) zijn een goede manier om UI bugs te voorkomen. Als _stories_ een grote diversiteit aan component use cases voor hun rekening nemen, en we gebruiken tools om er zeker van te zijn dat een mens een verandering aan een story controleert, zijn fouten minder waarschijnlijk.

Het gevaar zit echter in de details. We hebben daarom tests nodig die alle details controleren. Dit brengt ons bij unit tests.

In ons geval willen we de `TaskList` elke gepinde taak laten renderen **voor** niet gepinde taken die deze doorgegeven heeft in de `tasks` prop. Ook al hebben we een story (`withPinnedTasks`) om exact dit scenario te testen, kan het onduidelijk zijn voor een menselijke reviewer dat indien de component **stopt** met taken op deze manier te sorteren, het een bug is. Voor het menselijk oog zal dit niet opvallen als foutief gedrag.

Om dit probleem te voorkomen, kunnen we Jest gebruiken om de story te renderen naar de DOM en wat code uit te voeren om opvallende kenmerken van de output te verifiëren.

Maak een test bestand `src/components/TaskList.test.js` aan. Hier zullen we onze testen schrijven die de output controleren.

```js:title=src/components/TaskList.test.js
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

Merk op dat we de `withPinnedTasks` lijst van taken hebben kunnen herbruiken in zowel de story als de unit test; zo kunnen we doorgaan met het benutten van een bestaande bron, namelijk de voorbeelden die relevante variaties van een component vertegenwoordigen.

Merk ook op dat deze test veel onderhoud vereist. Het is mogelijk dat naarmate het project volwassen wordt en de exacte implementatie van de `Task` verandert - misschien door gebruik van een andere klassenaam of een`textarea` in plaats van een `input` - de test mislukt en moet worden bijgewerkt. Dit is niet noodzakelijk een probleem, maar eerder een indicatie om voorzichtig te zijn met het royaal gebruiken van unit-tests voor UI componenten. Ze zijn niet makkelijk te onderhouden. Vertrouw in plaats daarvan waar mogelijk op snapshot tests en visuele regressie tests (zie [testhoofdstuk](/intro-to-storybook/react/nl/test/)).
