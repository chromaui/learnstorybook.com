---
title: 'Einen Screen erstellen'
tocTitle: 'Screens'
description: 'Stelle einen Screen aus Komponenten zusammen'
commit: 'fef715f'
---

Bisher haben wir uns darauf konzentriert, UIs bottom-up zu bauen; klein starten und Komplexität hinzufügen. Das erlaubte uns, jede Komponente in Isolation zu entwickeln, ihre Anforderungen an Daten zu ermitteln und damit in Storybook herumzuspielen. All das, ohne einen Server aufzusetzen oder Screens zu erstellen.

In diesem Kapitel werden wir den Schwierigkeitsgrad weiter erhöhen, indem wir Komponenten in einem Screen kombinieren, den wir in Storybook entwickeln.

## Verschachtelte Container-Komponenten

Da unsere App sehr einfach ist, wird auch unser Screen ziemlich trivial sein. Wir fügen die `TaskList`-Komponente (die ihre Daten via Redux zur Verfügung stellt) in ein Layout ein und holen uns ein top-level `error`-Feld aus Redux (lass uns annehmen, wir setzten dieses Feld, wenn wir Probleme mit der Verbindung zu unserem Server haben). Lege `InboxScreen.js` in deinem `components`-Verzeichnis an:

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

Außerdem ändern wir die `App`-Komponente so, dass sie den `InboxScreen` rendert (vermutlich würden wir einen Router nutzen, um den richtigen Screen zu wählen, aber das soll jetzt nicht unsere Sorge sein):

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

Es wird jedoch erst interessant, wenn wir die Story in Storybook rendern.

Wie zuvor gesehen, ist die `TaskList`-Komponente ein **Container**, der die darstellende `PureTaskList`-Komponente rendert. Laut Definition können Container-Komponenten nicht einfach in Isolation gerendert werden; sie erwarten, dass ihnen ein Kontext übergeben wird, oder dass sie sich zu einem Service verbinden. Das bedeutet, dass wir den Kontext oder den Service, den ein Container erwartet, mocken (sprich eine vorgetäusche Version bereitstellen) müssen, um einen Container in Storybook zu rendern.

Als wir die `TaskList` in Storybook eingefügt haben, konnten wir dieses Problem einfach umgehen, indem wir die `PureTaskList` gerendert und so die Einbindung des Containers vermieden haben. Jetzt machen wir es genauso und rendern auch den `PureInboxScreen` in Storybook.

Trotzdem haben wir dabei ein Problem, denn auch wenn der `PureInboxScreen` rein darstellend ist, ist es sein Kind, die `TaskList`, nicht. In gewisser Weise wurde der `PureInboxScreen` also mit "Container-haftigkeit" verschmutzt. Wenn wir also unsere Stories in `InboxScreen.stories.js` aufsetzen, ...

```js:title=src/components/InboxScreen.stories.js
import React from 'react';

import { PureInboxScreen } from './InboxScreen';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
};

export const Default = () => <PureInboxScreen />;

export const Error = () => <PureInboxScreen error="Something" />;
```

... merken wir, dass auch wenn unsere `error`-Story richtig funktioniert, wir ein Problem mit der `default`-Story haben. Das liegt daran, dass die `TaskList` keinen Redux Store hat, zu dem sie sich verbinden kann. (Ähnliche Probleme würden auch auftreten, wenn du versuchen würdest, den `PureInboxScreen` mit einem Unit-Test zu testen.)

![Fehlerhafte Inbox](/intro-to-storybook/broken-inboxscreen.png)

Ein Weg, dieses Problem zu umgehen, ist niemals eine Container-Komponente irgendwo in deiner App zu rendern, außer auf oberster Ebene, und stattdessen alle benötigten Daten durch die Komponenten-Hierarchie nach unten durchzureichen.

Entwickler **müssen** Container aber auch zwangsläufig weiter unten in der Komponenten-Hierarchie rendern. Wenn wir also den Großteil oder alles von unserer App in Storybook rendern wollen (und das wollen wir!), brauchen wir hierfür eine Lösung.

<div class="aside">
Im Übrigen ist es durchaus ein legitimer Ansatz, Daten die Hierarchie hinunter zu reichen, insbesondere beim Einsatz von <a href="http://graphql.org/">GraphQL</a>. So haben wir auch <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> entwickelt, neben 800+ weiteren Stories.
</div>

## Kontext über Decorators zur Verfügung stellen

Die gute Nachricht ist, dass es einfach ist, dem `InboxScreen` einen Redux Store in einer Story zur Verfügung zu stellen. Wir können einfach eine gemockte Version des Redux Stores nutzen, die über einen Decorator zur Verfügung gestellt wird:

```js:title=src/components/InboxScreen.stories.js
import React from 'react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
import { defaultTasksData } from './TaskList.stories';

export default {
  component: PureInboxScreen,
  title: 'InboxScreen',
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasksData,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

export const Default = () => <PureInboxScreen />;

export const Error = () => <PureInboxScreen error="Something" />;
```

Auch für andere Bibliotheken gibt es ähnliche Ansätze, um einen gemockten Kontext zur Verfügung zu stellen, z.B. für [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) und weitere.

Indem wir uns durch die Zustände in Storybook klicken, können wir leicht prüfen, ob wir alles richtig gemacht haben:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Komponent-getriebene Entwicklung

Wir haben ganz unten mit `Task` angefangen, schritten dann vorwärts zur `TaskList` und sind nun hier angelangt, bei einer vollwertigen Screen-UI. Unser `InboxScreen` beherbergt eine verschachtelte Container-Komponente und kommt inklusive der zugehörigen Stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Komponent-getriebene Entwicklung**](https://www.componentdriven.org/) (CDD) erlaubt uns, schrittweise die Komplexität zu erhöhen, während wir uns in der Komponenten-Hierarchie nach oben bewegen. Ein besserer Fokus im Entwicklungs-Prozess und eine erhöhte Abdeckung aller möglichen Permutationen in der UI zählen zu den Vorzügen. Kurz, CDD hilft dir dabei, komplexere Benutzeroberflächen mit höherer Qualität zu entwickeln.

Wir sind noch nicht fertig - der Job ist nicht erledigt, wenn die UI gebaut ist. Wir müssen auch sicherstellen, dass sie über die Zeit stabil bleibt.
