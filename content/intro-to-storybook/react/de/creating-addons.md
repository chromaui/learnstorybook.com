---
title: "Addons erstellen"
tocTitle: "Addons erstellen"
description: "Lerne, eigene Addons zu bauen, die deine Entwicklung beschleunigen"
---

Im letzten Kapitel haben wir eines der wichtigsten Features von Storybook kennengelernt, nämlich sein robustes [Addon-System](https://storybook.js.org/addons/introduction/), das nicht nur deine eigene, sondern auch die Entwicklungserfahrung und Prozesse in deinem ganzen Team verbessern kann.

In diesem Kapitel werfen wir einen Blick darauf, wie wir unser eigenes Accon erstellen können. Vielleicht denkst du, dass es umständlich sein wird, das selbst zu schreiben, aber das stimmt nicht. In nur ein paar wenigen Schritten können wir schon damit loslegen, ein Addon zu entwickeln.

Aber eins nach dem anderen. Lass uns zunächst festlegen, was wir mit unserem Addon erreichen wollen.

## Das Addon, das wir schreiben werden

Lass und für dieses Beispiel annehmen, dass unser Team einige Design Assets hat, die in irgendeiner Weise mit unseren existierenden UI-Komponenten in Verbindung stehen. Wenn wir uns die aktuelle Storybook UI ansehen, scheint es, dass solche Verbindungen nicht abgebildet werden können. Wie können wir das lösen?

Wir haben unser Ziel, nun lass uns definieren, welche Features unser Addon unterstützen wird:

- Die Design Assets in einem Panel anzeigen
- Sowohl Bilder als auch URLs zum Einbetten unterstützen
- Sollte mehrere Assets unterstützen, nur für den Fall dass es mehrere Versionen oder Themes geben wird

Wir werden [Parameter](https://storybook.js.org/docs/configurations/options-parameter/) verwenden, um eine Liste von Assets an unsere Story anzufügen. Dies ist eine Storybook Option, die uns ermöglicht, benutzerdefinierte Parameter an unsere Stories zu injecten. Das macht man auf ähnliche Weise, wie wir in den vorherigen Kapiteln schon einen Decorator verwendet haben.

<!-- this is probably not needed as it's used below-->

```javascript
storiesOf("your-component", module)
  .addParameters({
    assets: ["path/to/your/asset.png"]
  })
  .addDecorator(/*...*/)
  .add(/*...*/);
```

<!-- -->

## Einrichtung

Wir haben umrissen, was unser Addon können soll, jetzt ist es Zeit, unsere lokale Entwicklungsumgebung aufzusetzen. Wir brauche ein paar zusätzliche Pakete in unserem Projekt. Genauer:

<!-- it would be nice that the readme files would have some minimal information for each package-->

- 📦 [@storybook/api](https://www.npmjs.com/package/@storybook/api) für die Verwendung der Storybook API.
- 📦 [@storybook/components](https://www.npmjs.com/package/@storybook/components) um die UI-Komponenten von Storybook nutzen zu können.
- 📦 [@storybook/theming ](https://www.npmjs.com/package/@storybook/theming) für das Styling.
- 🛠 [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react) um einige neue React Features korrekt zu transpilieren.

Öffne eine Konsole, navigiere zum Projekt Verzeichnis und führe folgenden Befehl aus:

<!--using npm here until the whole tutorial set is moved into npm or yarn issue #153-->

```bash
  npm install --save-dev @storybook/api @storybook/components @storybook/theming @babel/preset-react
```

Wir müssen eine kleine Anpassung an der `.babelrc` Datei vornehmen, die wir in einem vorangeganenen Kapitel ja bereits angelegt haben. Und zwar müssen wir eine Referenz auf das Paket `@babel/preset-react` hinzufügen.

Die angepasste Datei sollte wie folgt aussehen:

```json
{
  "presets": ["@babel/preset-react"],
  "plugins": ["macros"]
}
```

## Das Addon entwickeln

Wir haben, was wir brauchen. Zeit, am eigentlichen Addon zu arbeiten.

Erstelle innerhalb des `.storybook` Verzeichnisses einen neuen Ordner namens `addons` und darin eine Datei namens `design-assets.js` mit folgendem Inhalt:

```javascript
//.storybook/addons/design-assets.js
import React from "react";
import { AddonPanel } from "@storybook/components";
import { addons, types } from "@storybook/addons";

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    )
  });
});
```

<div class="aside">
Wir werden das <code>.storybook</code> Verzeichnis als Speicherort für unser Addon verwenden. Und zwar einfach, weil wir einen möglichst unkomplizierten Ansatz fahren und verhindern wollen, es unnötig kompliziert zu machen. Sollte dieses Addon in ein tatsächliches Addon umgewandelt werden, sollte es am besten in ein separates Paket verschoben werden, mit eigener Datei- und Verzeichnisstruktur.
</div>

Das ist der typische Boilerplate-Code, um loslegen zu können. Hier kurz, was im Code geschieht:

- Registriere ein neues Addon in unserem Storybook.
- Füge ein neues UI-Element für unser Addon mit ein paar Optionen hinzu (ein Titel, der unser Addon benennt, und der verwendete Element-Typ) und rendere es mit einem kleinen Text.

Wenn wir Storybook jetzt starten, werden wir unser Addon noch nicht sehen können. Wie zuvor mit dem Knobs Addon, müssen wir auch jetzt unser Addon zunächst in der Datei `.storybook/addons.js` registrieren. Füge einfach folgende Zeile hinzu und unser Addon sollte angezeigt werden:

```js
import "./addons/design-assets";
```

![Das Design-Assets Addon läuft in Storybook](/intro-to-storybook/create-addon-design-assets-added.png)

Erfolg! Wir haben unser neu erzeugtes Addon zur Storybook UI hinzugefügt.

<div class="aside">
Storybook erlaubt dir, nicht nur Panels, sondern eine ganze Reihe unterschiedlicher Typen von UI-Komponenten hinzuzufügen. Und die meisten, wenn nicht sogar alle von ihnen, existieren bereits im <code>@storybook/components</code> Paket. Du musst deine Zeit also nicht mit der Entwicklung der UI verschwenden, sondern kannst dich auf Features konzentrieren.
</div>

### Creating the content component

We've completed our first objective. Time to start working on the second one.

To complete it, we need to make some changes to our imports and introduce a new component that will display the asset information.

Make the following changes to the addon file:

```javascript
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
/* same as before */
import { useParameter } from "@storybook/api";

//.storybook/addons/design-assets.js
const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here

  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```


We've created the component, modified the imports, all that's missing is to connect the component to our panel and we'll have a working addon capable of displaying information relative to our stories.

Your code should look like the following:

```javascript
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
import { AddonPanel } from "@storybook/components";
import { useParameter } from "@storybook/api";
import { addons, types } from "@storybook/addons";

const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here

  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    )
  });
});
```

Notice that we're using the [useParameter](https://storybook.js.org/docs/addons/api/#useparameter), this handy hook will allow us to read the information supplied by the `addParameters` option for each story, which in our case will be either a single path to a asset or a list of paths. You'll see it in effect shortly.


### Using our addon with a story

We've connected all the necessary pieces. But how can we see if it's actually working and showing anything?

To do so, we're going to make a small change to the `Task.stories.js` file and add the [addParameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options) option.

```javascript
// src/components/Task.stories.js
storiesOf("Task", module)
  .addDecorator(withKnobs)
  .addParameters({
    assets: [
      "path/to/your/asset.png",
      "path/to/another/asset.png",
      "path/to/yet/another/asset.png"
    ]
  });
/* same as before  */
```

Go ahead and restart your Storybook and select the Task story, you should see something like this:

![storybook story showing contents with design assets addon](/intro-to-storybook/create-addon-design-assets-inside-story.png)


### Showing the actual assets

At this stage we can see that the addon is working as it should our stories, but now let's change the `Content` component to actually display the assets:


```javascript
//.storybook/addons/design-assets.js
import React, { Fragment } from "react";
import { AddonPanel } from "@storybook/components";
import { useParameter, useStorybookState } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { styled } from "@storybook/theming";

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

export const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter("assets", []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );

};
```

If you take a closer look, you'll see that we're using the `styled` tag, this tag comes from the `@storybook/theming` package. Using this tag, will allow us to customize not only Storybook's theme but also the UI to our needs. Also [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate), which is a real handy hook, that allows us to tap into Storybook's internal state so that we can fetch any bit of information present. In our case we're using it to fetch only the id of each story created.

### Displaying actual assets

To actually see the assets displayed in our addon, we need to copy them over to the `public` folder and adjust the `addParameter` option to reflect these changes.

Storybook will pick up on the change and will load the assets, but for now, only the first one.

![actual assets loaded](/intro-to-storybook/design-assets-image-loaded.png) <!--needs to be created-->

## Stateful addons

Going over our initial objectives:


- ✔️ Display the design asset in a panel
- ✔️ Support images, but also urls for embedding
- ❌ Should support multiple assets, just in case there will be multiple versions or themes


We're almost there, only one goal remaining.

For the final one, we're going to need some sort of state, we could use React's `useState`, or if we were working with class components `this.setState()`. But instead we're going to use Storybook's own `useAddonState`, which gives us a means to persist the addon state, and avoid creating extra logic to persist the local state. We'll also use another UI element from Storybook, the `ActionBar`, which will allow us to change between items.

We need to adjust our imports for our needs:

```javascript
//.storybook/addons/design-assets.js
import { useParameter, useStorybookState, useAddonState } from "@storybook/api";
import { AddonPanel, ActionBar } from "@storybook/components";
/* same as before */
```

And modify our `Content` component, so that we can change between assets:

```javascript
//.storybook/addons/design-assets.js
export const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter("assets", []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState("my/design-assets", 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace("{id}", storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Addon built

We've accomplished what we set out to do, which is to create a fully functioning Storybook addon that displays the design assets related to the UI components.

<details>
  <summary>Click to expand and see the full code used in this example</summary>

```javascript
// .storybook/addons
import React, { Fragment } from "react";

import { useParameter, useStorybookState, useAddonState } from "@storybook/api";
import { addons, types } from "@storybook/addons";
import { AddonPanel, ActionBar } from "@storybook/components";
import { styled } from "@storybook/theming";

const getUrl = input => {
  return typeof input === "string" ? input : input.url;
};

const Iframe = styled.iframe({
  width: "100%",
  height: "100%",
  border: "0 none"
});
const Img = styled.img({
  width: "100%",
  height: "100%",
  border: "0 none",
  objectFit: "contain"
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};



export const Content = () => {
  const results = useParameter("assets", []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState("my/design-assets", 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace("{id}", storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === "string" ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index)
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register("my/design-assets", () => {
  addons.add("design-assets/panel", {
    title: "assets",
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    )
  });
});
```

</details>

## Next steps

The next logical step for our addon, would be to make it it's own package and allow it to be distributed with your team and possibly with the rest of the community.

But that's beyond the scope of this tutorial. This example demonstrates how you can use the Storybook API to create your own custom addon to further enhance your development workflow.

Learn how to further customize your addon:


- [add buttons in the Storybook toolbar](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [communicate through the channel with the iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [send commands and results](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [perform analysis on the html/css outputted by your component](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [wrap components, re-render with new data](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [fire DOM events, make DOM changes](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [run tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

And much more!

<div class="aside">Should you create a new addon and you're interested in having it featured, feel free to open a PR in the Storybook documentation to have it featured.</div>

### Dev kits


To help you jumpstart the addon development, the Storybook team has developed some `dev-kits`.

These packages are starter-kits to help you start building your own addons.
The addon we've just finished creating is based on one of those starter-sets, more specifically the `addon-parameters` dev-kit.

You can find this one and others here:
https://github.com/storybookjs/storybook/tree/next/dev-kits

More dev-kits will become available in the future.
