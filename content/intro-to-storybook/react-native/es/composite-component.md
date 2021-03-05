---
title: 'Ensamblar un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensamblar un componente compuesto a partir de componentes simples'
---

En el último capítulo construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir TaskList, una lista de Tasks (o Tareas). Combinemos componentes en conjunto y veamos qué sucede cuando se añade más complejidad.

## Lista de Tareas

Taskbox enfatiza las tareas ancladas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones de `TaskList` para las que necesita crear historias: ítems por defecto e ítems por defecto y anclados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de `Task` pueden enviarse asincrónicamente, **también** necesitamos un estado de cargando para renderizar en ausencia de alguna conexión. Además, también se requiere un estado vacío para cuando no hay tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskList` y un archivo de historia que lo acompañe: `components/TaskList.js` y `components/TaskList.stories.js`.

Comienza con una implementación aproximada de la `TaskList`. Necesitarás importar el componente `Task` del capítulo anterior y pasarle los atributos y acciones como entrada.

```javascript
// components/TaskList.js
import * as React from 'react';
import Task from './Task';
import { FlatList, Text, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>loading</Text>
      </SafeAreaView>
    );
  }
  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <Text>empty</Text>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasks}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}

export default TaskList;
```

A continuación, crea los estados de prueba de `Tasklist` en el archivo de historia.

```javascript
// components/TaskList.stories.js
import * as React from 'react';
import { View } from 'react-native';
import { styles } from '../constants/globalStyles';
import { storiesOf } from '@storybook/react-native';
import { task, actions } from './Task.stories';
import TaskList from './TaskList';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];
export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

storiesOf('TaskList', module)
  .addDecorator(story => <View style={[styles.Taskbox, { padding: 42 }]}>{story()}</View>)
  .add('default', () => <TaskList tasks={defaultTasks} {...actions} />)
  .add('withPinnedTasks', () => <TaskList tasks={withPinnedTasks} {...actions} />)
  .add('loading', () => <TaskList loading tasks={[]} {...actions} />)
  .add('empty', () => <TaskList tasks={[]} {...actions} />);
```

Como habrás notado, el `addDecorator ()` se usó en el capítulo anterior y en este, nos permite agregar algo de “contexto” a la representación de cada tarea. En este caso, agregamos relleno alrededor de la lista para facilitar la verificación visual.

<div class="aside">
    Los <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador en la exportacion predeterminada para añadir estilo. También se pueden usar para envolver historias en "proveedores", es decir, componentes de la biblioteca que establecen el contexto React.
</div>

`task` provee la forma de un `Task` que creamos y exportamos desde el archivo `Task.stories.js`. De manera similar, `actions` define las acciones (llamadas simuladas) que espera un componente `Task`, el cual también necesita la `TaskList`.

No olvide que esta historia también debe agregarse a `storybook/index.js` para poder recogerla y mostrarla.

Cambie el método `configure()` a lo siguiente:

```javascript
// storybook/config.js
configure(() => {
  require('../components/Task.stories.js');
  require('../components/TaskList.stories.js');
}, module);
```

Ahora hay que revisar Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simplista. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio. Pero la **complejidad real** del componente `TaskList` se revela en los casos extremos `WithPinnedTasks`, `loading`, y `empty`.

Para el caso del borde de carga, crearemos un nuevo componente que mostrará el marcado correcto.

Cree un nuevo archivo llamado `LoadingRow.js` con el siguiente contenido:

```javascript
// components/LoadingRow.js
import React, { useState, useEffect } from 'react';
import { Animated, Text, View, Easing, SafeAreaView } from 'react-native';
import { styles } from '../constants/globalStyles';

const GlowView = props => {
  const [glowAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.inOut(Easing.quad),
      })
    ).start();
  }, []);
  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: glowAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const LoadingRow = () => (
  <SafeAreaView style={{ padding: 12 }}>
    <GlowView>
      <View style={styles.LoadingItem}>
        <View style={styles.GlowCheckbox} />
        <Text style={styles.GlowText}>Loading</Text>
        <Text style={styles.GlowText}>cool</Text>
        <Text style={styles.GlowText}>state</Text>
      </View>
    </GlowView>
  </SafeAreaView>
);

export default LoadingRow;
```

Y actualice `TaskList.js` a lo siguiente:

```javascript
// components/TaskList.js
import * as React from 'react';
import Task from './Task';
import PercolateIcons from '../constants/Percolate';
import LoadingRow from './LoadingRow';
import { FlatList, Text, SafeAreaView, View } from 'react-native';
import { styles } from '../constants/globalStyles';

function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </SafeAreaView>
    );
  }
  if (tasks.length === 0) {
    return (
      <SafeAreaView style={styles.ListItems}>
        <View style={styles.WrapperMessage}>
          <PercolateIcons name="check" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>You have no tasks</Text>
          <Text style={styles.SubtitleMessage}>Sit back and relax</Text>
        </View>
      </SafeAreaView>
    );
  }
  const tasksInOrder = [
    ...tasks.filter(t => t.state === 'TASK_PINNED'),
    ...tasks.filter(t => t.state !== 'TASK_PINNED'),
  ];
  return (
    <SafeAreaView style={styles.ListItems}>
      <FlatList
        data={tasksInOrder}
        keyExtractor={task => task.id}
        renderItem={({ item }) => <Task key={item.id} task={item} {...events} />}
      />
    </SafeAreaView>
  );
}

export default TaskList;
```

El marcado agregado da como resultado a la siguiente UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Tenga en cuenta la posición del elemento anclado en la lista. Queremos que el elemento anclado se muestre en la parte superior de la lista para que sea una prioridad para nuestros usuarios.

## Requisitos de datos y props

A medida que el componente crece, también lo hacen los requisitos de entrada. Defina los props requeridos de `TaskList`. Debido a que `Task` es un componente secundario, asegúrese de proporcionar datos en la forma correcta para representarlo. Para ahorrar tiempo y dolor de cabeza, reutilice los propTypes que definió en `Task` anteriormente.

```javascript

// components/TaskList.js
import * as React from 'react';
import PropTypes from 'prop-types';

import Task from './Task';

function TaskList() {
  ...
}


TaskList.propTypes = {
  loading: PropTypes.bool,
  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
  onPinTask: PropTypes.func.isRequired,
  onArchiveTask: PropTypes.func.isRequired,
};

TaskList.defaultProps = {
  loading: false,
};

export default TaskList;
```

## Pruebas automatizadas

En el capítulo anterior aprendimos a capturar historias de prueba utilizando Storyshots. Con el componente `Task` no había mucha complejidad para probar más allá de que se renderice correctamente. Dado que `TaskList` añade otra capa de complejidad, queremos verificar que ciertas entradas produzcan ciertas salidas de una manera adecuada con pruebas automáticas. Para hacer esto crearemos test unitarios utilizando [Jest](https://facebook.github.io/jest/) junto con un renderizador de prueba.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Test unitarios con Jest

Las historias de Storybook combinadas con pruebas visuales manuales y pruebas de instantáneas (ver arriba) ayudan mucho a evitar errores de interfaz de usuario. Si las historias cubren una amplia variedad de casos de uso de los componentes, y utilizamos herramientas que aseguran que un humano compruebe cualquier cambio en la historia, los errores son mucho menos probables.

Sin embargo, a veces el diablo está en los detalles. Se necesita un framework de pruebas que sea explícito sobre esos detalles. Lo que nos lleva a hacer pruebas unitarias.

En nuestro caso, queremos que nuestra `TaskList` muestre cualquier tarea anclada **antes de** las tareas no ancladas que sean pasadas en la prop `tasks`. Aunque tenemos una historia (`WithPinnedTasks`) para probar este escenario exacto; puede ser ambiguo para un revisor humano que si el componente **no** ordena las tareas de esta manera, es un error. Ciertamente no gritará **"¡Mal!"** para el ojo casual.

Por lo tanto, para evitar este problema, podemos usar Jest para renderizar la historia en el DOM y ejecutar algún código de consulta del DOM para verificar las características salientes del resultado.

Crea un archivo de prueba llamado `components/__tests__/TaskList.test.js`. Aquí vamos a construir nuestras pruebas que hacen afirmaciones acerca del resultado.

```javascript
// components/__tests__/TaskList.test.js
import * as React from 'react';
import { create } from 'react-test-renderer';
import TaskList from '../TaskList';
import { withPinnedTasks } from '../TaskList.stories';
import Task from '../Task';
describe('TaskList', () => {
  it('renders pinned tasks at the start of the list', () => {
    const events = { onPinTask: jest.fn(), onArchiveTask: jest.fn() };
    const tree = create(<TaskList tasks={withPinnedTasks} {...events} />);
    const rootElement = tree.root;
    const listofTasks = rootElement.findAllByType(Task);
    expect(listofTasks[0].props.task.title).toBe('Task 6 (pinned)');
  });
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Nota que hemos sido capaces de reutilizar la lista de tareas `withPinnedTasksData` tanto en la prueba de la historia como en el test unitario; de esta manera podemos continuar aprovechando un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de más y más maneras.

Nota también que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de `Task` cambie --quizás usando un prop de estilo diferente o un `Text` en lugar de un`TextInput`--la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso usando pruebas unitarias para la UI. No son fáciles de mantener. En su lugar, confía en las pruebas visuales e instantáneas siempre que te sea posible.
