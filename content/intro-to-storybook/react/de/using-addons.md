---
title: 'Addons'
tocTitle: 'Addons'
description: 'Lerne an einem bekannten Beispiel, Addons zu integrieren und zu nutzen'
---

Storybook rühmt sich eines robuten [Addon-Systems](https://storybook.js.org/docs/react/configure/storybook-addons), über das sich die Entwicklungserfahrung all deiner Teammitglieder verbessern lässt. Wenn du diesem Tutorial linear gefolgt bist, haben wir bereits einige Addons erwähnt und du hast bereits eines im [Kapitel über Tests](/intro-to-storybook/react/de/test/) implementiert.

<div class="aside">
<strong>Auf der Suche nach einer Liste verfügbarer Addons?</strong>
<br/>
😍 <a href="https://storybook.js.org/addons">Hier</a> findest du die Liste offiziell unterstützter und von der Community aktiv unterstützer Addons.
</div>

Wir könnten unendlich viel über die Verwendung von Addons für all deine speziellen Anwendungsfälle schreiben. Fürs Erste, lass uns auf die Integration eines der am weitesten verbreiteten Addons innerhalb des Storybook-Ökosystems hinarbeiten: [knobs](https://github.com/storybookjs/addon-knobs).

## Knobs einrichten

Knobs (Knöpfe) sind eine tolle Möglichkeit für Designer und Entwickler, um in einer kontrollierten Umgebung mit Komponenten herumzuexperimentieren und zu spielen, ohne die Notwendigkeit von Code! Im Grunde stellst du dynamisch definierte Felder zur Verfügung, mit denen ein Benutzer die Props manipulieren kann, die den Komponenten deiner Stories übergeben werden. Folgendes werden wir entwickeln...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

Als Erstes müssen wir die nötigen Abhängigkeiten installieren.

```bash
yarn add -D @storybook/addon-knobs
```

Registriere Knobs in deiner `.storybook/addons.js` Datei.

```javascript
// .storybook/addons.js

import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
<strong>📝 Die Reihenfolge der Addon-Registrierung ist wichtig!</strong>
<br/>
Die Reihenfolge, in der du die Addons auflistest, bestimmt die Reihenfolge, in der sie als Tabs im Addon-Panel erscheinen (für diejenigen, die dort angezeigt werden).
</div>

Das war's! Zeit, das Addon in der Story einzusetzen.

### Verwendung

Lass uns den Knob-Typ "Objekt" in der `Task`-Komponente benutzen.

Importiere zunächst den `withKnobs`-Decorator und den `object`-Knob-Typ in `Task.stories.js`:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

Füge als Nächstes `withKnobs` in das `decorators`-Array des `default`-Exports von `Task.stories.js` hinzu:

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

Zuletzt integriere noch den `object`-Knob-Typ in die "default"-Story:

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

Nun sollte ein "Knobs"-Tab neben dem "Action Logger"-Tab im unteren Bereich der Seite erscheinen.

Wie [hier](https://github.com/storybookjs/addon-knobs#object) dokumentiert, akzeptiert der `object`-Knob-Typ ein Label und ein Standard-Objekt als Parameter. Das Label ist fix und wird links von einem Textfeld in deinem Addons-Panel angezeigt. Das Standard-Objekt, das du definiert hast, wird als editierbarer JSON-Schnipsel angezeigt. So lange du valides JSON darin einträgst, wird deine Komponente basierend aus den im JSON-Objekt enthaltenen Daten aktualisiert.

## Addons erweitern den Umfang deines Storybooks

Deine Storybook-Instanz dient nicht nur als eine wunderbare [CDD-Umgebung](https://www.componentdriven.org/), sondern du bietest damit nun auch eine interaktive Dokumentation an. PropTypes sind toll, aber ein Designer oder jemand, der den Code einer Komponente noch gar nicht kennt, kann über Storybook mit aktiviertem Knobs-Addon das Verhalten der Komponente sehr einfach kennenlernen.

## Knobs nutzen, um Grenzfälle zu identifizieren

Hinzu kommt, dass QA-Engineers oder präventive UI-Engineers mit der einfachen Möglichkeit, die an eine Komponente übergebenen Daten zu bearbeiten, diese nun bis an ihre Grenzen bringen können! Ein Beispiel: Was passiert mit der `Task`-Komponente, wenn eine Aufgabe einen _EXTREM LANGEN_ String beinhaltet?

![Oh nein! Der Inhalt wird rechts abgeschnitten!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Dank der Möglichkeit, sehr schnell verschiedene Inputs an einer Komponente auszuprobieren, können wir solche Probleme relativ einfach finden und lösen. Lass uns das Problem des Überlaufens lösen, indem wir ein `style`-Attribut in `Task.js` ergänzen:

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![Das ist besser.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Eine neue Story hinzufügen, um Regressionen zu vermeiden

Natürlich können wir das Problem immer reproduzieren, indem wir wieder die gleichen Eingaben in den Knobs vornehmen. Besser ist es jedoch, wenn wir eine eigene Story für diesen Input schreiben. Das erhöht den Grad an Regressions-Tests und markiert eindeutig die Grenzen der Komponente(n) für den Rest des Teams.

Lass uns eine Story für den Fall von langem Text in `Task.stories.js` hinzufügen:

```javascript
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

Nun, da wir die Story hinzugefügt haben, können wir diesen Grenzfall ganz einfach reproduzieren, wann immer wir daran arbeiten wollen:

![Hier ist sie in Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Sofern wir [visuelle Regressions-Tests](/intro-to-storybook/react/de/test/) verwenden, werden wir nun auch darauf aufmerksam gemacht, falls wir unsere Umbruch-Lösung je kaputt machen sollten. Solche versteckten Grenzfälle werden nur zu gerne vergessen.

### Änderungen mergen

Vergiss nicht, deine Änderungen in Git zu mergen!
