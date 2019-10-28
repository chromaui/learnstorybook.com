---
title: 'Bouw een samengestelde component'
tocTitle: 'Samengestelde component'
description: 'Bouw een samengestelde component uit simpelere componenten'
commit: '8db511e'
---

In het vorige hoofdstuk hebben we onze eerste component gebouwd; dit hoofdstuk gaat voort op wat we geleerd hebben bij het bouwen van TaskList, een lijst van Tasks. Laten we componenten combineren and zien wat er gebeurt wanneer de graad van complexiteit stijgt.

## Tasklist

Taskbox benadrukt gepinde taken door ze boven de standaard taken te plaatsen. Dit resulteert in 2 variaties van `TaskList` waarvoor we stories moeten creëren: standaard taken en gepinde taken.  

![standaard en gepinde taken](/intro-to-storybook/tasklist-states-1.png)

Omdat `Task` data asynchroon kan verzonden worden, moeten we **ook** een laadstatus weergeven als er geen verbinding is. Bovendien is een lege status vereist wanneer er geen taken zijn.

![lege en ladende taken](/intro-to-storybook/tasklist-states-2.png)

## Voorbereiding

Een samengestelde component is niet heel verschillend van de basis component die hij omvat. Maak een `TaskList` component en een bijhorend story bestand aan: `src/components/TaskList.js` en `src/components/TaskList.stories.js`. 

Start met een ruwe implementatie van `TaskList`. Je zal de `Task` component van eerder moeten importeren en de attributen en acties als input doorgeven.
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

Maak vervolgens de teststatussen van `TaskList` aan in het story bestand.

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

`addDecorator()` laat ons toe om "context" toe te voegen aan het renderen van elke taak. In dit geval voegen we padding toe rond de lijst zodat het makkelijker is om deze visueel te verifiëren. 

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decorators</b></a> zijn een manier om arbitraire wrappers toe te voegen aan stories. In dit geval gebruiken we een decorator om styling toe te voegen. Ze kunnen ook gebruikt worden om stories te wrappen in "providers" – d.w.z library componenten die een React context instellen.
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

Onze component is nog steeds wat ruw, maar nu hebben we een idee van de stories waar we naartoe willen werken. Mogelijks denk je dat de `.list-items` wrapper te simplistisch is. Je hebt gelijk - in de meeste gevallen zouden we geen nieuwe component aanmaken enkel en alleen om een wrapper toe te voegen. De **echte complexiteit** van de `TaskList` component wordt echter pas duidelijk in de randgevallen `withPinnedTasks`, `loading` en `empty`.  

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

De toegevoegde markup resulteert in de volgende UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Merk de positie van de gepinde item in de lijst op. We willen de gepinde item bovenaan de lijst renderen teneinde het een prioriteit te maken voor onze gebruikers.

## Data vereisten en props

Naarmate de component groeit, doen de input vereisten dat ook. Definieer de prop vereisten van `TaskList`. Omdat `Task` een child component is, moeten we verzekeren dat de data in de juiste vorm voorzien wordt om deze te renderen. Om tijd en zorgen te besparen, kunnen we de propTypes herbruiken die je eerder in `Task` gedefinieerd hebt.

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

## Geautomatiseerde testen

In het vorige hoofdstuk leerden we test stories te snapshotten aan de hand van Storyshots. Voor `Task` was er niet veel complexiteit om te testen behalve om te kijken of dit normaal rendert. Omdat `TaskList` een laag complexiteit toevoegt, willen we verifiëren dat bepaalde inputs zekere outputs teruggeven op een manier die vatbaar is voor geautomatiseerde testen. Om dit mogelijk te maken zullen we unit tests toevoegen aan de hand van [Jest](https://facebook.github.io/jest/) gekoppeld aan een test render zoals [Enzyme](http://airbnb.io/enzyme/). 
![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests met Jest

Storybook stories gekoppeld met manuele visuele testen en snapshot tests (zie hierboven) zijn een goede manier om UI bugs te vermijden. Als stories een grote varieteit aan component use cases voor hun rekening nemen, en we gebruiken tools om er zeker van te zijn dat een mens een verandering aan een story controleert, zijn fouten minder waarschijnlijk.

De duivel is echter soms in de details. Een test framework dat expliciet is over deze details is benodigd. Dit brengt ons bij unit tests.

In ons geval, willen we onze `TaskList` elke gepinde taak laten renderen **voor** niet gepinde taken die deze doorgegeven heeft in de `tasks` prop. Ook al hebben we een story (`withPinnedTasks`) om exact dit scenario te testen, kan het dubbelzinnig zijn voor een menselijke reviewer dat indien de component **stopt** met taken op deze manier te sorteren, het een bug is. Voor de normale mens zal dit zeker geen alarmbellen laten afgaan. 

Teneinde dit probleem te voorkomen, kunnen we Jest gebruiken om de story te renderen naar de DOM en wat DOM querycode uit te voeren om opvallende kenmerken van de output te verifiëren.

Maak een test bestand `src/components/TaskList.test.js` aan. Hier zullen we onze testen outbouwen die assertions nagaan over de output.

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

Merk op dat we de `withPinnedTasks` lijst van taken hebben kunnen herbruiken in zowel de story als de unit test; zodanig kunnen we op veel manieren doorgaan met het benutten van een bestaande bron (de voorbeelden die interessante configuraties van een component vertegenwoordigen).

Merk ook op dat deze test behoorlijk broos is. Het is mogelijk dat naarmate het project volwassen wordt en de exacte implementatie van de `Task` verandert - misschien door gebruik van een andere klassenaam of een` textarea` in plaats van een `input` - de test mislukt en moet worden bijgewerkt. Dit is niet noodzakelijk een probleem, maar eerder een indicatie om voorzichtig te zijn met het royaal gebruiken van unit-tests voor UI. Ze zijn niet makkelijk te onderhouden. Vertrouw in plaats daarvan waar mogelijk op visuele, snapshot en visuele regressie tests (zie [testhoofdstuk](/test/)).
