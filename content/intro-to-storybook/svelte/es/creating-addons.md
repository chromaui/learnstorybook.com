---
title: 'Bonificación: Crear un complemento'
tocTitle: 'Bonificación: Creando complementos'
description: 'Aprende a construir tus propios complementos que cargarán tu desarrollo'
---

En el capítulo anterior nos presentaron una de las características clave de Storybook, su robusto sistema de [complementos](https://storybook.js.org/addons/introduction/), que puede usarse para mejorar no solo el tuyo sino también la experiencia de desarrollador y los flujos de trabajo de tu equipo.

En este capítulo veremos cómo creamos nuestro propio complemento. Puede pensar que escribirlo puede ser una tarea desalentadora, pero en realidad no lo es, solo tenemos que dar un par de pasos para comenzar y podemos comenzar a escribirlo.

Pero lo primero es lo primero, primero veamos qué hará nuestro complemento.

## El complemento que vamos a escribir

Para este ejemplo, supongamos que nuestro equipo tiene algunos recursos de diseño que de alguna manera están relacionados con los componentes de la interfaz de usuario existentes. Mirando la interfaz de usuario actual de Storybook, parece que la relación no es realmente aparente. ¿Cómo podemos arreglar eso?

Tenemos nuestro objetivo, ahora definamos qué características admitirá nuestro complemento:

- Mostrar el elemento de diseño en un panel
- Imágenes de soporte, pero también urls para incrustar
- Debe admitir múltiples recursos, en caso de que haya múltiples versiones o temas

La forma en que adjuntaremos la lista de recursos a las historias es a través de [parámetros](https://storybook.js.org/docs/configurations/options-parameter/), que es una opción de Storybook que nos permite inyectar parámetros personalizados para nuestras historias. La forma de usarlo es bastante similar a cómo usamos un decorador en capítulos anteriores.

```javascript
export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

<!-- -->

## Configuración

Hemos esbozado lo que hará nuestro complemento, es hora de configurar nuestro entorno de desarrollo local.

Comenzaremos agregando un paquete adicional a nuestro proyecto. Más específicamente `@babel/preset-react`, este paquete nos permitirá usar el código React dentro de nuestra aplicación Svelte sin ningún problema.

Abra una consola, navegue a la carpeta de su proyecto y ejecute el siguiente comando:

```bash
  npm install -D @babel/preset-react
```

Una vez que esté instalado, haremos un pequeño cambio en el archivo `.babelrc` que creamos anteriormente al comienzo del [tutorial](/svelte/es/get-started). Tendremos que agregar una referencia a nuestro paquete agregado recientemente.

El archivo actualizado debería tener el siguiente aspecto:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

Finalmente dentro de su carpeta `.storybook`, cree una nueva carpeta llamada `design-addon` y dentro de ella un nuevo archivo llamado `register.js`.

¡Y eso es! Estamos listos para comenzar a desarrollar nuestro complemento.

<div class = "aside"> Vamos a utilizar la carpeta <code>.storybook</code> como marcador de posición para nuestro complemento. La razón detrás de esto es mantener un enfoque directo y evitar complicarlo demasiado. Si este complemento se transforma en un complemento real, sería mejor moverlo a un paquete separado con su propia estructura de archivos y carpetas. </div>

## Escribiendo el complemento

Agregue lo siguiente a su archivo creado recientemente:

```javascript
//.storybook/design-addon/register.js
import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

Este es un código de un boilerplate típico para comenzar y repasar lo que está haciendo el código:

- Estamos registrando un nuevo complemento en nuestro Storybook.
- Agregue un nuevo elemento de interfaz de usuario para nuestro complemento con algunas opciones (un título que definirá nuestro complemento y el tipo de elemento utilizado) y renderícelo con algo de texto por ahora.

Comenzando Storybook en este punto, aún no podremos ver el complemento. Como hicimos anteriormente con el complemento Knobs, necesitamos registrar el nuestro en el archivo `.storybook/main.js`. Simplemente agregue lo siguiente a la lista de `complementos` ya existente:

```js
// .storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // same as before
    './.storybook/design-addon/register.js', // our addon
  ],
};
```

![design assets addon running inside Storybook](/intro-to-storybook/create-addon-design-assets-added.png)

¡Éxito! Tenemos nuestro complemento recién creado agregado a la interfaz de usuario de Storybook.

<div class="aside">Storybook le permite agregar no solo paneles, sino toda una gama de diferentes tipos de componentes de la interfaz de usuario. Y la mayoría, si no todos, ya están creados dentro del paquete @storybook/components, por lo que no necesita perder demasiado tiempo implementando la interfaz de usuario y centrarse en las características de escritura.</div>

### Crear el componente de contenido

Hemos completado nuestro primer objetivo. Es hora de comenzar a trabajar en el segundo.

Para completarlo, necesitamos hacer algunos cambios en nuestras importaciones e introducir un nuevo componente que muestre la información del recurso.

Realice los siguientes cambios en el archivo de complemento:

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

Creamos el componente, modificamos las importaciones, todo lo que falta es conectar el componente a nuestro panel y tendremos un complemento funcional capaz de mostrar información relativa a nuestras historias.

Su código debería tener el siguiente aspecto:

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
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Tenga en cuenta que estamos usando el [useParameter](https://storybook.js.org/docs/addons/api/#useparameter), este práctico gancho nos permitirá leer la información proporcionada por la opción `parameters` para cada historia, que en nuestro caso será una ruta única a un recuros o una lista de rutas. Lo verás en efecto en breve.

### Usando nuestro complemento con una historia

Hemos conectado todas las piezas necesarias. Pero, ¿cómo podemos ver si realmente funciona y muestra algo?

Para hacerlo, haremos un pequeño cambio en el archivo `task.stories.js` y agregaremos la opción[parameters](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options).

```javascript
// src/components/task.stories.js
export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  parameters: {
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};
/* same as before  */
```

Continúe y reinicie su Storybook y seleccione la historia de la Tarea, debería ver algo como esto:

![storybook story showing contents with design assets addon](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### Mostrar contenido en nuestro complemento

En esta etapa, podemos ver que el complemento está funcionando como debería, pero ahora cambiemos el componente `Content` para mostrar realmente lo que queremos:

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

Si observa más de cerca, verá que estamos usando la etiqueta `styled`, esta etiqueta proviene del paquete `@storybook/theming`. El uso de esta etiqueta nos permitirá personalizar no solo el tema de Storybook sino también la interfaz de usuario según nuestras necesidades. También [useStorybookState](https://storybook.js.org/docs/addons/api/#usestorybookstate), que es un verdadero gancho práctico, que nos permite aprovechar el estado interno de Storybook para que podamos obtener cualquier tipo de información presente. En nuestro caso, lo estamos usando para obtener solo la identificación de cada historia creada.

### Mostrar los recursos actuales

Para ver realmente los activos que se muestran en nuestro complemento, debemos copiarlos en la carpeta `public` y ajustar la opción de parámetros de la historia para reflejar estos cambios.

Storybook recogerá el cambio y cargará los recursos, pero por ahora, solo el primero.

![actual assets loaded](/intro-to-storybook/design-assets-image-loaded.png)

## Complementos con estado

Repasando nuestros objetivos iniciales:

- ✔️ Mostrar el elemento de diseño en un panel
- ✔️ Soporte de imágenes, pero también urls para incrustar
- ❌ Debería admitir múltiples recursos, en caso de que haya múltiples versiones o temas

Ya casi llegamos, solo queda un objetivo.

Para el último, vamos a necesitar algún tipo de estado, podríamos usar el hook `useState` de React, o si estuviéramos trabajando con los componentes de clase `this.setState()`. Pero en su lugar, vamos a usar el propio `useAddonState` de Storybook, que nos brinda un medio para persistir el estado del complemento y evitar crear una lógica adicional para persistir en el estado local. También usaremos otro elemento de la interfaz de usuario de Storybook, el `ActionBar`, que nos permitirá cambiar entre elementos.

Necesitamos ajustar nuestras importaciones a nuestras necesidades:

```javascript
//.storybook/design-addon/register.js
import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

Y modifique nuestro componente `Content`, para que podamos cambiar entre recursos:

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

## Complemento construido

Hemos logrado lo que nos propusimos hacer, que es crear un complemento de Storybook totalmente funcional que muestre los recursos de diseño relacionados con los componentes de la interfaz de usuario.

<details>
  <summary>Haga clic para expandir y ver el código completo utilizado en este ejemplo</summary>

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
    title: 'assets',
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

## Próximos pasos

El siguiente paso lógico para nuestro complemento, sería crear su propio paquete y permitir que se distribuya con su equipo y posiblemente con el resto de la comunidad.

Pero eso está más allá del alcance de este tutorial. Este ejemplo demuestra cómo puede usar la API de Storybook para crear su propio complemento personalizado para mejorar aún más su flujo de trabajo de desarrollo.

Aprenda cómo personalizar aún más su complemento:

- [agregar botones en la barra de herramientas de Storybook](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [comunicarse a través del canal con el iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [enviar comandos y resultados](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [realizar análisis en el html/css generado por su componente](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [envolver componentes, volver a renderizar con nuevos datos](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [disparar eventos DOM, hacer cambios DOM](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [ejecutar pruebas](https://github.com/storybookjs/storybook/tree/next/addons/jest)

¡Y mucho más!

<div class="aside">Si crea un nuevo complemento y está interesado en que aparezca, siéntase libre de abrir un RP en la documentación de Storybook para que aparezca.</div>

### Dev kits

Para ayudarlo a impulsar el desarrollo del complemento, el equipo de Storybook ha desarrollado algunos `dev-kits`.

Estos paquetes son kits de inicio para ayudarlo a comenzar a crear sus propios complementos.
El complemento que acabamos de crear se basa en uno de esos conjuntos de inicio, más específicamente el kit de desarrollo `addon-parameters`.

Puedes encontrar este y otros aquí:
https://github.com/storybookjs/storybook/tree/next/dev-kits

Más kits de desarrollo estarán disponibles en el futuro.

## Compartir complementos con el equipo

Los complementos son adiciones que ahorran tiempo a su flujo de trabajo, pero puede ser difícil para los compañeros de equipo no técnicos y los revisores aprovechar sus características. No puede garantizar que la gente ejecutará Storybook en su máquina local. Es por eso que implementar su Storybook en una ubicación en línea para que todos puedan consultarlo puede ser realmente útil. ¡En el próximo capítulo haremos exactamente eso!
