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

Hemos descrito lo que hará nuestro complemento, es hora de comenzar a trabajar en ella.

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

Este es el típico boilerplate de partida. Repasemos lo que hace el código:

- Estamos registrando una nuevo complemento en nuestro Storybook.
- Añadir un nuevo elemento de interfaz de usuario para nuestro complemento con algunas opciones (un título que definirá nuestro complemento y el tipo de elemento usado) y renderizarlo con algún texto por ahora.
  
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

¡Exito! Hemos añadido nuestro complemento recientemente creado a la interfaz de usuario de Storybook.
<div class="aside">Storybook no solo te permite añadir paneles, sino que además puedes añadir un amplia gama de tipos de componentes de interfaz de usuario diferentes. Y la mayoría si no todos ellos creados dentro de el paquete @storybook/components, así que no necesitas malgastar demasiado tiempo en la implementación de la interfaz de usuario y te puedes centrar en añadir nuevas características.</div>

### Creating the content component

Hemos completado nuestro primer objetivo. Es hora de empezar a trabajar en el segundo.
Para completarlo, necesitamos hacer algunos cambios a nuestros "imports" e introducir un nuevo componente que mostrará la información del "asset".
Realiza los siguientes cambios al archivo del componente:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  const results = useParameter('assets', []); // parametro de historia obtenido aquí
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

Hemos creado el componente, modificado los "imports", lo único que falta es conectar el componente a nuestro panel y tendremos un complemento capaz de mostrar información relativa a nuestras historias.

Tu código debería ser parecido al siguiente:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  const results = useParameter('assets', []); // el parametro de historia se obtiene aquí
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

Fíjate que estamos usando el hook [useParameter](https://storybook.js.org/docs/react/api/addons-api#useparameter), este útil hook nos permitirá leer la información suministrada por la opción `parameters` para cada historia, que en nuestro caso será o una ruta a nuestro asset o una lista de rutas. Lo verás en funcionamiento en breve.

### Usando nuestro complementocon una historia

Hemos conectado todas las partes necesarias. Pero ¿cómo podemos ver si de hecho funciona y muestra algo?
Para hacerlo, vamos a hacer un pequeño cambio al archivo `Task.stories.js` y le añadimos la opción  [parameters](https://storybook.js.org/docs/react/writing-stories/parameters).

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
/* igual que antes  */
```

Reinicia tu Storybook y selecciona la historia de la Tarea, deberías de ver algo así
![historia de storybook que muestra contenidos con complemento de diseño de assets](/intro-to-storybook/create-addon-design-assets-inside-story-6-0.png)

### Mostrando contenido en nuesto complemento

A estas alturas podemos ver que el complemento funciona como debiera, pero ahora cambiemos el componente `Content` para que de hecho muestre lo que queremos:
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
    // hacer visor de imágenes
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // el parámetro de historia se obtiene aquí
  const results = useParameter('assets', []);
  // el id de la historia obtenida del estado global de Storybook
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

Echemos un vistazo al código. Usamos la etiqueta `style` que viene del paquete [`@storybook/theming`](https://storybook.js.org/docs/react/configure/theming). Esto
 nos permite customizar el theme de Storybook y el complemento de interfaz de usuario. [`useStorybookState`](https://storybook.js.org/docs/react/api/addons-api#usestorybookstate) es un hook que nos permite hacer uso del estado interno de Storybook para extraer la más pequeña cantidad de información presente. En nuestro caso estamos usandolo para extraer el id de cada historia creada.

### Mostrar los assets en cuestión
Para ver efectivamente los assets mostrados en nuesto complemento, necesitamos copiarlos a la carpeta `public` y ajustar la opción de `parameters` de la historia para que refleje estos cambios.
Storybook detectará el cambio y cargará los assets, pero por ahora, solo el primero.
![assets cargados](/intro-to-storybook/design-assets-image-loaded-6-0.png)

## Stateful addons
## Complementos Stateful

Repasemos nuestros objetivos iniciales:

- ✔️ Mostrar el asset de diseño en un panel
- ✔️ Soportar imágenes, pero también urls para incrustado.
- ❌ Debería de soportar multiples assets, por si acaso hubieran múltiples versiones o themes.

Ya casi hemos acabado, solo un objetivo final.

Para acabar, vamos a necesitar añadir algún tipo de estado, podríamos usar el hook `useState` de React, o si estuviésemos trabajando con componentes basados en clases `this.setState()`. Pero en su lugar vamos a usar el propio hook de Storybook [`useAddonState`](https://storybook.js.org/docs/react/api/addons-api#useaddonstate), que nos ofrece una manera de guardar de manera persistente el estado del complemento y evitar crear lógica extra para que persista el estado local. También usaremos otro elemento de interfaz de usuario de Storybook, el `ActionBar`, que nos permitirá cambiar de elementos.

Necesitamos ajustar nuestros imports a nuestras necessidades:

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* igual que antes */
```

Y modificar nuestro componente `Content`, de forma que podamos cambiar de assets:

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

## Complemento creado

Hemos conseguido lo que queríamos, que es crear un complemento de Storybook que funciona completamente que muestra los assets de diseño relativos a los componentes de interfaz de usuario.
<details>
  <summary>Hacer click para expandir y ver el código completo usado en este ejemplo</summary>

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
  const results = useParameter('assets', []); // parámetro de historia se obtiene aquí
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // estado de complemento es persistido aquí
  const { storyId } = useStorybookState(); // el identificador único de la historia se obtiene del estado global de Storybook

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

## Próximos paso

El próximo paso lógico para nuestro complemento sería hacerlo su propio paquete y permitir que sea distribuido con tu equipo y posiblemente con el resto de la comunidad.
Pero eso se sale del cometido de este tutorial. Este ejemplo demuestra cómo puedes usar la API de Storybook para crear tu propio complemento a medida para impulsar tu workflow de desarrollo.

Aprende cómo customizar aún más tu complemento:

- [añade botones en la barra de herramientas de Storybook](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [comunícate a través del canal con el iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [envía comandos y resultados](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [realiza análisis del código html/css devuelto por tu componente](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [envuelve componentes, re-renderiza con datos nuevos](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [activa eventos del DOM, haz cambios en el DOM](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [ejecuta tests](https://github.com/storybookjs/storybook/tree/next/addons/jest)

¡Y mucho más!

<div class="aside">Si necesitas crear un nuevo complemento y estás interesado en que aparezca como destacado, abre una PR en la documentación de Storybook para que podamos hacerlo aparecer como destacado.</div>

### Kits de desarrollo

Para ayudare a iniciarte en el desarrollo del complemento, el equipo de Storybook ha desarrollado unos kits de desarrollo llamados `dev-kits`.
Estos paquetes son kits de iniciación que te ayudarán a crear tus propios complementos.
El complemento que acabamos de crear está basado en uno de esos starter-sets, más específicamente el dev-kit llamado `addon-parameters`.
Puedes encontrar este y otros aquí:
<https://github.com/storybookjs/storybook/tree/next/dev-kits>

Más dev-kits se encontrarán disponibles en el futuro.

## Compartiendo complementos con el equipo

Los complementos son algo que añadir a tu workflow que te ahorrará tiempo, pero puede resultarle dificil sacarle partido a sus prestaciones si tus compañeros o quien tuviera que revisarlo no cuenta con un background técnico. No puedes garantizar que la gente ejecute Storybook en sus máquinas locales. Es por esto que el despliegue de tu Storybook a un sitio online para que todo el mundo lo pueda referenciar puede ser muy útil.
