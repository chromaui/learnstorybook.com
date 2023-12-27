---
title: 'Bouw een eenvoudige component'
tocTitle: 'Eenvoudige component'
description: 'Bouw een eenvoudige component in isolatie'
commit: '9b36e1a'
---

We zullen onze gebruikersinterface bouwen volgens de [Component-Driven Development](https://www.componentdriven.org/)-methodologie. Het is een proces dat UI's van onderaf opbouwt, beginnend met losse componenten en eindigend met schermen. CDD helpt je grip te houden op de complexiteit naarmate je de applicatie verder uitbouwt.

## Task

![Task component in drie states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` is de kerncomponent van onze app. Een taak wordt anders weergegeven afhankelijk van de staat waarin deze zich bevindt. We geven een aangevinkte (of niet-aangevinkte) checkbox weer, wat informatie over de taak en een "pin"-knop, waarmee we taken naar boven en naar beneden in de lijst kunnen verplaatsen. Samenvattend hebben we deze props nodig:

- `title` – een string die de taak beschrijft
- `state` - in welke lijst bevindt de taak zich momenteel en is deze aangevinkt?

Wanneer we beginnen met het bouwen van `Task`, schrijven we eerst onze test states die overeenkomen met de verschillende soorten taken die hierboven zijn beschreven. Vervolgens gebruiken we Storybook om de component in isolatie te bouwen met behulp van gemockte data. We zullen het uiterlijk van de component visueel testen voor elke _state_ terwijl we verder gaan.

Dit proces is vergelijkbaar met [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD); je zou het "[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)" kunnen noemen.

## Laten we beginnen

Laten we eerst de task component en het bijbehorende story bestand aanmaken: `src/components/Task.js` en `src/components/Task.stories.js`.

We beginnen met een basisimplementatie van de `Task`, waarbij we gewoon de attributen opnemen waarvan we weten dat we ze nodig hebben en de twee acties die je kan uitvoeren voor een taak (om deze tussen lijsten te verplaatsen):

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Hierboven renderen we de eenvoudige markup voor `Task` op basis van de bestaande HTML-structuur van de Todos-app.

Hieronder bouwen we de drie test states van Task uit in het story bestand:

```js:title=src/components/Task.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Er zijn twee basisniveaus van organisatie in Storybook: de component en zijn _child stories_. Beschouw elke _story_ als een variant van de component. Je kunt zoveel stories per component hebben als je er nodig hebt.

- **Component**
  - Story
  - Story
  - Story

Om Storybook te initiëren roepen we eerst de functie `storiesOf()` aan om de component te registreren. We voegen een display name toe voor de component - de naam die wordt weergegeven in de zijbalk in de Storybook-app.

Met `action()` kunnen we een callback aanmaken die verschijnt in het **acties**-paneel van de UI van Storybook wanneer erop wordt geklikt. Dus wanneer we een pin-knop bouwen, kunnen we in de test-UI bepalen of een klik op deze knop succesvol is.

Omdat we dezelfde reeks acties moeten doorgeven aan alle permutaties van onze component, is het handig om ze te bundelen in een enkele `actions` variabele en React's`{...actions}` props uitbreiding te gebruiken om ze allemaal in één keer door te geven. `<Task {...actions}>` is gelijk aan `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Nog iets leuks over het bundelen van de `actions` die een component nodig heeft, is dat je ze kunt `export`-en en ze in stories kunt gebruiken voor componenten die deze component hergebruiken, zoals we later zullen zien.

Om onze stories te definiëren, roepen we eenmaal `add()` op voor elk van onze test states om een story te genereren. De action story is een functie die een gerenderd element (dwz een component class met een set props) teruggeeft in een bepaalde state --- precies zoals een React [Functional Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components).

Bij het aanmaken van een story gebruiken we een basistaak (`task`) om de vorm van de taak uit te bouwen die de component verwacht. Dit wordt typisch gemodelleerd naar hoe de echte data eruit ziet. Nogmaals, als we deze vorm `export`-en, kunnen we deze in latere stories hergebruiken, zoals we zullen zien.

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> helpen je bij het verifiëren van interacties bij het geisoleerd bouwen van UI-componenten. Vaak heb je geen toegang tot de functies en state die je hebt in de context van de app. Gebruik <code>action()</code> om ze in te stubben.
</div>

## Configuratie

We moeten ook een kleine wijziging aanbrengen in de configuratie van de Storybook (`.storybook/config.js`) zodat het onze `.stories.js`-bestanden opmerkt en ons CSS-bestand gebruikt. Standaard zoekt Storybook naar stories in een folder `/stories`; deze tutorial gebruikt een naamgevingsschema dat vergelijkbaar is met het `.test.js` naamgevingsschema waaraan CRA de voorkeur geeft voor geautomatiseerde tests.

```js:title=.storybook/config.js
import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
```

Zodra we dit hebben gedaan, zou het opnieuw opstarten van de Storybook-server testcases moeten opleveren voor de drie Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## States uitbouwen

Nu we Storybook opgezet hebben, styles geīmporteerd en testcases hebben uitgebouwd, kunnen we snel beginnen met het implementeren van de HTML van de component om met het ontwerp overeen te komen.

De component is momenteel nog basaal. Schrijf eerst de code waarmee het ontwerp wordt bereikt zonder al te veel in detail te treden:

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={(event) => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

De extra markup van hierboven in combinatie met de CSS die we eerder hebben geïmporteerd, levert de volgende UI op:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Specifieer data requirements

Het is een best practice om `propTypes` in React te gebruiken om de vorm van data te specificeren die een component verwacht. Het documenteert niet alleen zichzelf, het helpt ook problemen vroegtijdig op te vangen.

```js:title=src/components/Task.js
import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

Nu verschijnt een waarschuwing in development als de Task component verkeerd wordt gebruikt.

<div class="aside">
Een alternatieve manier om hetzelfde doel te bereiken, is om een JavaScript-type systeem zoals TypeScript te gebruiken om een type voor de component properties aan te maken.
</div>

## Component gebouwd!

We hebben nu met succes een component gebouwd zonder dat we een server nodig hebben of de hele frontend-applicatie moeten runnen. De volgende stap is om de resterende Taskbox-componenten één voor één op dezelfde manier uit te bouwen.

Zoals je ziet, is het eenvoudig en snel om aan de slag te gaan met het bouwen van componenten in isolatie. We kunnen verwachten om een UI van hogere kwaliteit te produceren met minder bugs en meer detail, omdat het mogelijk is om in detail te gaan en elke mogelijke state te testen.

## Geautomatiseerd testen

Storybook gaf ons een geweldige manier om onze applicatie visueel te testen tijdens het bouwen. De _stories_ helpen ervoor te zorgen dat onze component niet onbedoeld visueel veranderd tijdens het ontwikkelen van onze applicatie. Het is in dit stadium echter een volledig handmatig proces en iemand moet de moeite nemen om door elke test state te klikken en na te gaan dat deze goed en zonder fouten of waarschuwingen wordt gerenderd. Kunnen we dat niet automatisch doen?

### Snapshot testing

Snapshot testing verwijst naar de praktijk van het opnemen van de "bekend juiste" output van een component voor een gegeven input en het markeren van de component wanneer de output in de toekomst verandert. Dit is een aanvulling op Storybook, omdat het een snelle manier is om de nieuwe versie van een component te bekijken en de wijzigingen te bekijken.

<div class="aside">
Zorg ervoor dat je componenten data renderen die niet verandert, zodat je snapshot tests niet elke keer mislukken. Pas op voor dingen als datums of willekeurig gegenereerde waarden.
</div>

Met de [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) wordt een snapshot-test gemaakt voor elk van de stories. Gebruik het door een development dependency aan de package toe te voegen:

```shell
yarn add --dev @storybook/addon-storyshots react-test-renderer require-context.macro
```

Maak vervolgens een `src/storybook.test.js` bestand aan met het volgende erin:

```js:title=src/storybook.test.js
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

Je zal ook een [babel-macro](https://github.com/kentcdodds/babel-plugin-macros) moeten gebruiken om er zeker van te zijn dat `require.context` (webpack magie) in Jest (onze testcontext) wordt uitgevoerd. Installeer het met:

```shell
yarn add --dev babel-plugin-macros
```

En schakel het in door een `.babelrc`-bestand toe te voegen in de root folder van je app (hetzelfde niveau als `package.json`)

```json
// .babelrc

{
  "plugins": ["macros"]
}
```

Werk vervolgens `.storybook/config.js` bij als volgt:

```js:title=.storybook/config.js
import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
```

(Merk op dat we `require.context` hebben vervangen door een aanroep van `requireContext` geïmporteerd vanuit de macro).

Zodra het bovenstaande gedaan is, kunnen we `yarn test` uitvoeren en de volgende output zien:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We hebben nu een snapshot-test voor elk van onze `Task`-stories. Als we de implementatie van `Task` wijzigen, wordt ons gevraagd de wijzigingen te verifiëren.
