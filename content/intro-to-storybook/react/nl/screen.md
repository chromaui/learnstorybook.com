---
title: 'Bouw een scherm'
tocTitle: 'Schermen'
description: 'Bouw een scherm uit componenten'
commit: 'bb2471f'
---

We hebben ons geconcentreerd op het bouwen van UI's van onderaf; klein beginnen en complexiteit toevoegen. Hierdoor konden we elk onderdeel afzonderlijk ontwikkelen, de data behoeften achterhalen en ermee spelen in Storybook. Allemaal zonder een server op te zetten of schermen uit te bouwen!

In dit hoofdstuk blijven we de complexiteit vergroten door componenten in een scherm te combineren en dat scherm in Storybook te ontwikkelen.

## Geneste containercomponenten

Omdat onze app heel eenvoudig is, is het scherm dat we bouwen vrij triviaal, gewoon de component `TaskList` (die zijn eigen data via Redux levert) in een bepaalde lay-out wrappen en een `error` veld op het hoogste niveau uit redux halen (laten we aannemen dat we dat veld instellen als we een probleem hebben met de verbinding met onze server). Maak `InboxScreen.js` aan in je folder `components`:

```js:title=src/components/InboxScreen.js
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
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

PureInboxScreen.propTypes = {
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

We veranderen ook de component `App` om het`InboxScreen` te renderen (uiteindelijk zouden we een router gebruiken om het juiste scherm te kiezen, maar laten we ons hier geen zorgen over maken):

```js:title=src/App.js
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <InboxScreen />
      </Provider>
    );
  }
}

export default App;
```

Waar het interessant wordt, is het renderen van de story in Storybook.

Zoals we eerder zagen, is de component `TaskList` een **container** die de presentational component `PureTaskList` rendert. Per definitie kunnen containercomponenten niet eenvoudig afzonderlijk worden gerenderd; ze verwachten een context te krijgen of verbinding te maken met een service. Dit betekent dat we, om een container in Storybook te renderen, de context of service die deze nodig heeft moeten mocken (d.w.z. een zogenaamde versie moeten bieden).

Toen we de `TaskList` in Storybook plaatsten, konden we dit probleem omzeilen door eenvoudigweg de`PureTaskList` te renderen en de container te vermijden. We zullen iets soortgelijks doen en ook de `PureInboxScreen` in Storybook renderen.

Voor de `PureInboxScreen` hebben we echter een probleem omdat, hoewel de`PureInboxScreen` zelf presentational is, het child, de `TaskList` dat niet is. In zekere zin is de `PureInboxScreen` vervuild door "container-ness". Dus wanneer we onze stories instellen in `InboxScreen.stories.js`:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';

import { PureInboxScreen } from './InboxScreen';

storiesOf('InboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

We zien dat, hoewel de `error` story prima werkt, we een probleem hebben in de `default` story, omdat de `TaskList` geen Redux store heeft om verbinding mee te maken. (Je zou ook soortgelijke problemen tegenkomen wanneer je probeert de `PureInboxScreen` te testen met een unit test).

![Inbox is kapot](/intro-to-storybook/broken-inboxscreen.png)

Een manier om dit probleem te omzeilen, is om nooit container componenten overal in je app te renderen, behalve op het hoogste niveau, en in plaats daarvan alle data requirements door te geven in de componenthiërarchie.

Developers **zullen** echter onvermijdelijk containers verder naar beneden in de componenthiërarchie moeten renderen. Als we de app vooral of geheel in Storybook willen renderen (dat doen we!), hebben we een oplossing voor dit probleem nodig.

<div class="aside">
Terzijde: het doorgeven van data door de hiërarchie is een legitieme manier, vooral bij het gebruik van <a href="http://graphql.org/">GraphQL</a>. Het is hoe we <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> met 800+ stories hebben gebouwd.
</div>

## Context voorzien van decorators

Het goede nieuws is dat het gemakkelijk is om een Redux store te leveren aan de `InboxScreen` in een story! We kunnen gewoon een gemockte versie van de Redux store gebruiken in een decorator:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
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
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Soortgelijke benaderingen bestaan om gemockte context te voorzien voor andere data libraries, zoals [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) en anderen.

Doorlopen van states in Storybook maakt het gemakkelijk om te testen dat we dit correct hebben gedaan:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

We zijn van onderaf begonnen met `Task` en zijn vervolgens overgegaan naar `TaskList`, nu hebben we een UI voor een volledig scherm. Ons `InboxScreen` biedt plaats aan een geneste containercomponent en bevat bijhorende stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) stelt je in staat om de complexiteit geleidelijk uit te breiden naarmate je hoger gaat in de componenthiërarchie. Één van de voordelen is een meer gericht development proces en een grotere dekking van alle mogelijke UI-permutaties. Kortom, CDD helpt je bij het bouwen van kwalitatief betere en complexere UI's.

We zijn nog niet klaar - het werk is nog niet gedaan wanneer de UI is gebouwd. We moeten er ook voor zorgen dat het na verloop van tijd duurzaam blijft.
