---
title: 'Extra: Crear un complemento'
tocTitle: 'Extra: Creando complementos'
description: 'Aprende cómo crear tus propios complementos que impulsarán tu desarrollo'
commit: '6d1d770'
---

Anteriormente, introdujimos una característica clave en Storybook: el robusto [addons](https://storybook.js.org/docs/react/configure/storybook-addons) ecosistema. Los complementos se usan para mejorar tu experincia y flujos de trabajo como desarrollador.

En este capítulo extra, vamos a echarle un vistazo a cómo creamos nuestro complemento. Podrías pensar que desarrolarla puede ser una tarea ardua, pero en realidad no es así, solamente necesitamos seguir un par de pasos para empezar y podemos comenzar a crearla.

Pero lo primero es lo primero, antes que que nada, establezcamos lo que hará nuestro complemento.

## El complemento que vamos a desarrollar

Para este ejemplo, asumamos que nuestro equipo tiene unos recursos de diseño que están de algún modo relacionados con los componentes de la interfaz de usuario.
Mirando la interfaz de usuario actual de Storybook, parece que la relación no es realmente aparente. ¿Cómo podemos arreglar esto?

Tenemos nuestro objetivo, ahora definamos qué características soportará nuestro complemento:

- Mostrar el recurso de disño en un panel
- Soportar imágenes, pero también urls para incrustaciones
- Debería soportar múltiples recursos, por si acaso hubieran múltiples versiones o themes

Adjuntaremos la lista de recursos a las historias con [parameters](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters), una característica que nos permite añadir metadata extra a nuestros historias.

```javascript
// TuComponente.js

export default {
  title: 'Tu componente',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['ruta/a/tu/recurso.png'],
  },
  //
};
```

## Configuración

Hemos delineado lo que nuestro complemento hará, es hora de comenzar a trabajar en ella.

Dentro de tu carpeta `.storybook` crea una nueva carpeta llamada `design-addon` y dentro de ella un nuevo archivo llamado `register.js`.

¡Y eso es todo! Estamos listos para empezar desarrollar nuestro complemento.

<div class="aside">Vamos a usar la carpeta <code>.storybook</code> como marcador de posición para nuestro complemento. La razón de esto, es mantener un enfoque directo y evitar complicarlo demasiado. Si este complemento se transforma complemento de al uso, sería mejor moverla a un paquete aparte con su propia estructura de archivos.</div>

## Desarrollando la complemento

Añade lo siguiente a nuestro archivo recientemente creado:

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets', // todo assets o recursos ??
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implementar
      </AddonPanel>
    ),
  });
});
```

Este es el típico boilerplate de partida. Repasando lo que el código:

- Estamos registrando una nuevo complemento en nuestro Storybook.
- Añade un nuevo elemento de interfaz de usuario para nuestro complemento con algunas opciones (un título que definirá nuestro complemento y el tipo de elemento usado) y renderízalo con algún texto por ahora.
  
Si iniciamos nuestro Storybook en este momento, no vamos a poder ver el complemento. Necesitamos registrar nuestro propio complemento en el archivo [`.storybook/main.js`](https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project). Solo añade lo siguiente a la ya existente lista de complementos `addons`:

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    './design-addon/register.js', // nuestro complemento
  ],
};
```

![Diseña complementos de recursos corriendo dentro de Storybook](/intro-to-storybook/create-addon-design-assets-added-6-0.png)

Success! We have our newly created addon added to the Storybook UI.

<div class="aside">Storybook allows you to add not only panels, but a whole range of different types of UI components. And most if not all of them are already created inside the @storybook/components package, so that you don't need waste too much time implementing the UI and focus on writing features.</div>

### Creating the content component

We've completed our first objective. Time to start working on the second one.

To complete it, we need to make some changes to our imports and introduce a new component that will display the asset information.

Make the following changes to the addon file:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
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
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
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

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Notice that we're using the [useParameter](https://storybook.js.org/docs/react/api/addons-api#useparameter), this handy hook will allow us to read the information supplied by the `parameters` option for each story, which in our case will be either a single path to a asset or a list of paths. You'll see it in effect shortly.

### Using our addon with a story

We've connected all the necessary pieces. But how can we see if it's actually working and showing anything?

To do so, we're going to make a small change to the `Task.stories.js` file and add the [parameters](https://storybook.js.org/docs/react/writing-stories/parameters) option.

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
};
/* same as before  */
```

Go ahead and restart your Storybook and select the Task story, you should see something like this:

![storybook story showing contents with design assets addon](/intro-to-storybook/create-addon-design-assets-inside-story-6-0.png)

### Showing content in our addon

At this stage we can see that the addon is working as it should, but now let's change the `Content` component to actually display what we want:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
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

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

Let's take a look at the code. We use the `styled` tag that comes from the [`@storybook/theming`](https://storybook.js.org/docs/react/configure/theming) package. This allows us to customize Storybook's theme and the addon UI. [`useStorybookState`](https://storybook.js.org/docs/react/api/addons-api#usestorybookstate) is a hook that allows us to tap into Storybook's internal state to fetch any bit of information present. In our case we're using it to fetch the id of each story created.

### Displaying the actual assets

To actually see the assets displayed in our addon, we need to copy them over to the `public` folder and adjust the story's `parameters` option to reflect these changes.

Storybook will pick up on the change and will load the assets, but for now, only the first one.

![actual assets loaded](/intro-to-storybook/design-assets-image-loaded-6-0.png)

## Stateful addons

Going over our initial objectives:

- ✔️ Display the design asset in a panel
- ✔️ Support images, but also urls for embedding
- ❌ Should support multiple assets, just in case there will be multiple versions or themes

We're almost there, only one goal remaining.

For the final one, we're going to need some sort of state, we could use React's `useState` hook, or if we were working with class components `this.setState()`. But instead we're going to use Storybook's own [`useAddonState`](https://storybook.js.org/docs/react/api/addons-api#useaddonstate), which gives us a means to persist the addon state, and avoid creating extra logic to persist the local state. We'll also use another UI element from Storybook, the `ActionBar`, which will allow us to change between items.

We need to adjust our imports for our needs:

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

And modify our `Content` component, so that we can change between assets:

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
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
// .storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
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

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
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

## Sharing addons with the team

Addons are timesaving additions to your workflow, but it can be difficult for non-technical teammates and reviewers to take advantage of their features. You can't guarantee folks will run Storybook on their local machine. That's why deploying your Storybook to an online location for everyone to reference can be really helpful.
