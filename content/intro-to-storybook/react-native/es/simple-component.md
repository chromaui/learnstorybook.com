---
title: 'Construye un componente simple'
tocTitle: 'Componente Simple'
description: 'Construye un componente simple en aislamiento'
---

Construiremos nuestra UI siguiendo la metodología (CDD) [Component-Driven Development](https://www.componentdriven.org/). Es un proceso que construye UIs de “abajo hacia arriba”, empezando con los componentes y terminando con las vistas. CDD te ayudará a escalar la cantidad de complejidad con la que te enfrentas a medida que construyes la UI.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` (o Tarea) es el componente principal en nuestra app. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o no marcado), información sobre la tarea y un botón “pin” que nos permite mover la tarea hacia arriba o abajo en la lista de tareas. Poniendo esto en conjunto, necesitaremos estas propiedades -props- :

- `title` – un string que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente y está marcado el checkbox?

A medida que comencemos a construir `Task`, primero escribiremos nuestras pruebas para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizamos Storybook para construir el componente de forma aislada usando datos de prueba. Vamos a “testear visualmente” la apariencia del componente a medida que cambiemos cada estado.

Este proceso es similar a [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) al que podemos llamar “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Ajustes iniciales

Primero, vamos a crear el componente Task y el archivo de historias de Storybook que lo acompaña: `components/Task.js` y `components/Task.stories.js`.

Comenzaremos con una implementación básica de `Task`, simplemente teniendo en cuenta los atributos que sabemos que necesitaremos y las dos acciones que puedes realizar con una tarea (para moverla entre las listas):

```js:title=components/Task.js
import * as React from 'react';
import { TextInput, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <SafeAreaView style={styles.ListItem}>
      <TextInput value={title} editable={false} />
    </SafeAreaView>
  );
}
```

Arriba, renderizamos directamente `Task` basándonos en la estructura HTML existente de la app Todos.

A continuación creamos los tres estados de prueba de Task dentro del archivo de historia:

```js:title=components/Task.stories.js
import * as React from 'react';
import { View } from 'react-native';
import { styles } from '../constants/globalStyles';
import { storiesOf } from '@storybook/react-native';
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
  .addDecorator((story) => <View style={styles.TaskBox}>{story()}</View>)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Piensa en cada historia como una permutación posible del componente. Puedes tener tantas historias por componente como se necesite.

- **Component**
  - Story
  - Story
  - Story

Para iniciar Storybook primero llamamos a la función `storiesOf()` para registrar el componente. Agregamos un nombre para mostrar para el componente, el nombre que aparece en la barra lateral de la aplicación Storybook.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la UI de Storybook cuando es cliqueado. Entonces, cuando construyamos un botón pin, podremos determinar en la UI de prueba si un click en el botón es exitoso o no.

Como necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable de `actions` y usarlas en los `{... actions}` props de React para pasarlas todas cada vez. `<Task {... actions}>` es equivalente a `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Otra cosa interesante acerca de agrupar las `actions` que un componente necesita, es que puedes usar `export` y utilizarlas en historias para otros componentes que reutilicen este componente, como veremos luego.

Para definir nuestras historias, llamaremos `add()` cada vez para cada uno de nuestros estados de prueba para generar una historia. La historia es una función que devuelve un elemento renderizado (es decir, un componente con un conjunto de props) en un estado dado, exactamente como un [Componente funcional sin estado](https://reactjs.org/docs/components-and-props.html).

Al crear una historia utilizamos una historia base (`task`) para construir la forma de la task que el componente espera. Esto generalmente se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ando esta función nos permitirá reutilizarla en historias posteriores, como veremos.

<div class="aside">
<a href="https://storybook.js.org/docs/react/essentials/actions"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes UI en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para agregarlas.
</div>

## Configuración

Es necesario realizar algunos cambios en la configuración del Storybook (`storybook/index.js`) para que note nuestras historias creadas recientemente.

```js:title=storybook/config.js
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('../components/Task.stories.js');
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
```

Una vez que hayamos hecho esto, reiniciando el servidor de Storybook debería producir casos de prueba para los tres estados de Task en tu simulador:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora tenemos configurado Storybook, los estilos importados y los casos de prueba construidos; podemos comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

Nuestro componente todavía es bastante rudimentario en este momento. Vamos a hacer algunos cambios para que coincida con el diseño previsto sin entrar en demasiados detalles:

```js:title=components/Task.js
import * as React from 'react';
import { TextInput, SafeAreaView, View, TouchableOpacity } from 'react-native';
import { styles } from '../constants/globalStyles';
import PercolateIcons from '../constants/Percolate';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <SafeAreaView style={styles.ListItem}>
      <TouchableOpacity onPress={() => onArchiveTask(id)}>
        {state !== 'TASK_ARCHIVED' ? (
          <View style={styles.CheckBox} />
        ) : (
          <PercolateIcons name="check" size={20} color={'#2cc5d2'} />
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Input Title"
        style={
          state === 'TASK_ARCHIVED' ? styles.ListItemInputTaskArchived : styles.ListItemInputTask
        }
        value={title}
        editable={false}
      />
      <TouchableOpacity onPress={() => onPinTask(id)}>
        <PercolateIcons
          name="star"
          size={20}
          color={state !== 'TASK_PINNED' ? '#eee' : '#26c6da'}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
```

El maquetado adicional de arriba, combinado con el CSS que hemos importado antes, produce la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Especificar requisitos de datos

Se recomienda utilizar `propTypes` en React para especificar la forma de los datos que espera un componente. No solo se documenta por sí mismo, sino que también ayuda a detectar problemas temprano.

```js:title=components/Task.js
import * as React from 'react';
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

Ahora aparecerá una advertencia en desarrollo si el componente de Tarea se usa incorrectamente.

<div class="aside">
Una forma alternativa de lograr el mismo propósito es usar un sistema de tipos JavaScript como TypeScript para crear un tipo para las propiedades del componente.
</div>

## Componente construido!

Ahora hemos construido con éxito un componente sin necesidad de un servidor o sin ejecutar toda la aplicación frontend. El siguiente paso es construir los componentes restantes de la Taskbox, uno por uno de manera similar.

Como puedes ver, comenzar a construir componentes de forma aislada es fácil y rápido. Podemos esperar producir una UI de mayor calidad con menos errores y más pulida porque es posible profundizar y probar todos los estados posibles.

## Pruebas automatizadas

Storybook nos dio una excelente manera de probar visualmente nuestra aplicación durante su construcción. Las 'historias' ayudarán a asegurar que no rompamos nuestra Task visualmente, a medida que continuamos desarrollando la aplicación. Sin embargo, en esta etapa, es un proceso completamente manual y alguien tiene que hacer el esfuerzo de hacer clic en cada estado de prueba y asegurarse de que se visualice bien y sin errores ni advertencias. ¿No podemos hacer eso automáticamente?

### Pruebas de instantáneas

La prueba de instantáneas se refiere a la práctica de registrar la salida "correcta" de un componente para una entrada dada y luego en el futuro marcar el componente siempre que la salida cambie. Esto complementa a Storybook, porque es una manera rápida de ver la nueva versión de un componente y verificar los cambios.

<div class="aside">
Asegúrese de que sus componentes muestren datos que no cambien, para que sus pruebas de instantáneas no fallen cada vez. Tenga cuidado con cosas como fechas o valores generados aleatoriamente.
</div>

Con el [complemento Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea una prueba de instantánea para cada una de las historias. Úselo agregando las siguientes dependencias en modo desarrollo:

```shell
yarn add --D @storybook/addon-storyshots
```

Luego crea un archivo `components/__tests__/storybook.test.js` con el siguiente contenido:

```js:title=components/__tests__/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

Una vez hecho lo anterior, podemos ejecutar `yarn test` y veremos el siguiente resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de `Task`. Si cambiamos la implementación de `Task`, se nos pedirá que verifiquemos los cambios.

<div class="aside">Si sus pruebas de instantáneas fallan en esta etapa, debe actualizar las instantáneas existentes ejecutando el script de prueba con el indicador -u. O cree un nuevo script para abordar este problema.</div>
