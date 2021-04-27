---
title: 'Baue eine einfache Komponente'
tocTitle: 'Einfache Komponente'
description: 'Baue eine einfache Komponente in Isolation'
commit: '97d6750'
---

Beim Bauen unserer UI werden wir nach der [Component-Driven Development](https://www.componentdriven.org/) (CDD) Methodik vorgehen. Das it ein Vorgehen, in dem UIs "bottom up" entwickelt werden. Man beginnt mit Komponenten und endet mit Screens. CDD hilft dabei, die Komplexität zu begrenzen, mit der man beim Bauen einer UI konfrontiert wird.

## Task

![Task-Komponente in drei Zuständen](/intro-to-storybook/task-states-learnstorybook.png)

`Task` ist die zentrale Komponente in unserer App. Jede Aufgabe wird ein wenig anders angezeigt, abhängig davon, in welchem Zustand sie sich befindet. Wir zeigen eine ausgewählte (oder nicht ausgewählte) Checkbox an, einige Informationen über die Aufgabe und einen "Pin"-Button, der uns erlaubt, Aufgaben in der Liste hoch oder runter zu bewegen. Daraus ergeben sich folgende Props:

- `title` – ein String, der die Aufgabe beschreibt
- `state` - In welcher Liste befindet sich die Aufgabe aktuell und ist sie abgeschlossen?

Beim Entwickeln der `Task`-Komponente schreiben wir zunächst unsere Test-Zustände, die den oben skizzierten möglichen Aufgaben-Typen entsprechen. Anschließend verwenden wir Storybook, um die Komponente mit gemockten Daten isoliert zu entwickeln. Wärend wir entwickeln, prüfen wir die Komponente in jedem möglichen Zustand auf ihre visuelle Erscheinung.

Dieses Vorgehen ähnelt der [testgetriebenen Entwicklung](https://de.wikipedia.org/wiki/Testgetriebene_Entwicklung) (TDD). Wir nennen es “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Los geht's

Lass uns zunächst eine Komponente für die Aufgaben anlegen sowie die zugehörige Story-Datei: `src/components/Task.js` und `src/components/Task.stories.js`.

Zunächst starten wir mit dem Grundgerüst von `Task`, in dem wir einfach die benötigten Attribute und die zwei Aktionen mitnehmen, die auf einer Aufgabe ausgeführt werden können (um sie zwischen Listen hin und her zu bewegen):

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Oben rendern wir ein einfaches Markup für `Task`, basierend auf der bestehenden HTML-Struktur in der Todos-App.

Unten bilden wir die drei Test-Zustände, die `Task` einnehmen kann, in einer Story-Datei ab:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Task from './Task';
export default {
  component: Task,
  title: 'Task',
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => {
  return <Task task={{ ...taskData }} {...actionsData} />;
};

export const Pinned = () => <Task task={{ ...taskData, state: 'TASK_PINNED' }} {...actionsData} />;

export const Archived = () => (
  <Task task={{ ...taskData, state: 'TASK_ARCHIVED' }} {...actionsData} />
);
```

Es gibt zwei grundlegende Ebenen, in denen Komponenten in Storybook origanisiert werden können: Die Komponente selbst und ihr untergeordnete Stories. Stell dir eine Story als Ausprägung einer Komponente vor. Du kannst so viele Stories für eine Komponente anlegen, wie du brauchst.

- **Komponente**
  - Story
  - Story
  - Story

Um Storybook die Komponente, die wir dokumentieren, zugänglich zu machen, erstellen wir einen `default` Export. Dieser beinhaltet:

- `component` -- die Komponente selbst,
- `title` -- wie die Komponente in der Sidebar der Storybook App referenziert werden soll,
- `excludeStories` -- Exporte in der Story Datei, die von Storybook nicht als Stories gerendert werden sollen.


Unsere Stories definieren wir, indem wir für jeden unserer Test-Zustände eine Funktion exportieren, um eine Story zu generieren. Die Story ist eine Funktion, die ein gerendertes Element in einem definierten Zustand zurückgibt (z.B. eine Komponenten-Klasse mit einer Menge an Props) --- genau wie eine [Functional Component](https://reactjs.org/docs/components-and-props.html#function-and-class-components) in React.

`action()` erlaubt uns, ein Callback zu erstellen, das im **Actions**-Panel der Storybook-UI erscheint, wenn man auf dieses klickt. Wenn wir also einen Pin-Button bauen, können wir so in der Test-UI sehen, ob ein Button-Klick erfolgreich war.

Da wir allen Ausprägungen unserer Komponente immer das selbe Menge an Actions übergeben müssen, ist es naheliegend, sie in einer einzigen `actionsData`-Variable zusammenzufassen und die `{...actionsData}` Syntax von JSX ("spread attributes") zu verwenden, um alle Props auf einmal zu übergeben. `<Task {...actionsData}>` ist äquivalent zu `<Task onPinTask={actionsData.onPinTask} onArchiveTask={actionsData.onArchiveTask}>`.

Ein weiterer Vorteil, die Actions in `actionsData` zusammenzufassen ist, wie wir später sehen werden, dass man diese Variable dann `export`-ieren und die Actions in Stories anderer Komponenten zur Verfügung stellen kann, die diese Komponente wiederverwenden.

Beim Erstellen einer Story nutzen wir eine Basis-Aufgabe (`taskData`), um die Struktur der Aufgabe zu definieren, die unsere Komponente erwartet. Diese basiert üblicherweise auf realitätsnahen Beispiel-Daten. Noch einmal: Diese Struktur zu `export`-ieren erlaubt uns, sie später in weiteren Stories zu verwenden, wie wir noch sehen werden.

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> helfen dir, Interaktionen zu verifizieren, wenn du UI-Komponenten isoliert entwickelst. Oftmals hast du bei der Entwicklung keinen Zugriff auf die Funktionen und den Zustand, die im Kontext deiner App existieren. Nutze <code>action()</code>, um sie als Stub zur Verfügung zu haben.
</div>

## Konfiguration

Wir müssen auch noch eine kleine Anpassung an der Storybook-Konfiguration (`.storybook/config.js`) vornehmen, so dass unsere `.stories.js`-Dateien und unsere CSS-Datei berücksichtigt werden. Standardmäßig sucht Storybook im Verzeichnis `/stories` nach Stories; dieses Tutorial verwendet ein Namens-Schema äquivalent zum `.test.js`-Namens-Schema, das von CRA für automatisierte Tests bevorzugt wird.

```javascript
// .storybook/config.js

import { configure } from '@storybook/react';
import '../src/index.css';

configure(require.context('../src/components', true, /\.stories\.js$/), module);
```

Sobald wir das erledigt und den Storybook Server neu gestartet haben, sollten die Testfälle für die drei Zustände von `Task` angezeigt werden:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Die Zustände implementieren

Da wir Storybook jetzt eingerichtet, die Styles importiert und die Testfälle angelegt haben, können wir einfach damit loslegen, das HTML der Komponente zu implementieren, so dass es dem Design entspricht.

Die Komponente ist noch immer sehr einfach gehalten. Schreib zunächst den Code, um das Design zu erhalten, ohne dass wir zu sehr ins Detail gehen:

```javascript
// src/components/Task.js

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

      <div className="actions" onClick={event => event.stopPropagation()}>
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

Das obige zusätzliche Markup, zusammen mit dem CSS, das wir zuvor imporiert haben, resultiert in folgender Darstellung:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Datenstruktur spezifizieren

Es ist üblich, `propTypes` in React zu verwenden, um die Struktur der Daten zu spezifizieren, die eine Komponente erwartet. Das dient nicht nur als Dokumentation, sondern hilft auch dabei, Probleme früh abzufangen.

```javascript
// src/components/Task.js

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

Nun wird beim Entwickeln eine Warnung angezeigt, wenn die `Task`-Komponente falsch verwendet wird.

<div class="aside">
Alternativ kann man hierfür auch JavaScript-Typisierung verwenden, wie z.B. TypeScript, um den Props der Komponente Typen zuzuweisen.
</div>

## Komponente erstellt!

Jetzt haben wir erfolgreich eine Komponente gebaut, ohne dass wir einen Server oder unsere gesamte Frontend-App dazu benötigt hätten. Als nächstes müssen wir die verbleibenden Taskbox-Komponenten auf die gleiche Weise bauen, eine nach der anderen.

Wie du siehst, ist es recht schnell und einfach möglich, eine Komponente in Isolation zu bauen. Dadurch können wir UIs bauen, die schicker, qualitativ hochwertiger und weniger fehleranfällig sind, weil es möglich ist, in die Tiefe zu gehen und jeden möglichen Zustand abzutesten.

## Automatisiertes Testen

Storybook hat uns eine tolle Möglichkeit gegeben, unsere Anwendung visuell zu testen während wir sie entwickeln. Die 'Stories' werden uns dabei helfen, sicherzustellen, dass die Darstellung unserer `Task`-Komponente nicht zerschossen wird, während wir unsere App weiter entwickeln. Allerdings ist das im Moment noch ein vollständig manueller Vorgang und irgendjemand muss sich die Mühe machen, alle Testzustände durchzuklicken, um sicherzustellen, dass alles korrekt gerendert wird und keine Fehler oder Warnungen auftreten. Können wir das nicht automatisieren?

### Snapshot-Tests

Snapshot-Tests beziehen sich darauf, den "wohlbekannten" Output einer Komponente für eine definierten Input festzuhalten und dann die Komponente hervorzuheben, wann immer sich der Output in Zukunft verändert. Das ergänzt Storybook, denn es ist eine schnelle Möglichkeit, die neue Version einer Komponente zu begutachten und ihre Änderungen zu überprüfen.

<div class="aside">
Stelle sicher, dass deine Kompoenten ein Output rendern, das sich nicht verändert, damit deine Snapshot-Tests nicht jedes mal fehlschlagen. Achte auf Dinge wie Datumsausgaben oder zufällig generierte Werte.
</div>

Mit dem [Storyshots-Addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) wird ein Snapshot-Test für jede deiner Stories generiert. Um es zu verwenden, füge eine `devDependency` in deiner `package.json` hinzu:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer require-context.macro
```

Erstelle dann die Datei `src/storybook.test.js` mit folgendem Inhalt:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

Du wirst auch ein [babel-Macro](https://github.com/kentcdodds/babel-plugin-macros) verwenden müssen, um sicherzustellen, dass `require.context` (etwas Webpack-Magie) in Jest (unser Test-Kontext) ausgeführt wird. Installiere es mit:

```bash
yarn add --dev babel-plugin-macros
```

Und aktiviere es, indem du eine `.babelrc` Datei im Root-Ordner deiner App (dieselbe Ebene wie die `package.json`) erstellst:

```json
// .babelrc

{
  "plugins": ["macros"]
}
```

Danach aktualisiere `.storybook/config.js` wie folgt:

```js
// .storybook/config.js

import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';

import '../src/index.css';

configure(requireContext('../src/components', true, /\.stories\.js$/), module);
```

(Beachte, dass wir `require.context` ersetzt haben mit einem Aufruf von `requireContext`, das vom Makro importiert wird.)

Wenn das erledigt ist, können wir `yarn test` ausführen und sehen die folgende Ausgabe:

![Task-Test-Runner](/intro-to-storybook/task-testrunner.png)

Wir haben jetzt einen Snapshot-Test für jede unserer `Task`-Stories. Ändern wir die Implementierung von `Task`, werden wir aufgefordert, die Änderungen zu verifizieren.
