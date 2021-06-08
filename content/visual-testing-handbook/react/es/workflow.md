---
title: 'Flujo de trabajo'
description: 'Un flujo de trabajo guiado por pruebas para la construcción de componentes'
---

El desarrollo de interfaces de usuario siempre ha estado mal definido. La naturaleza subjetiva de la interfaz de usuario conduce a flujos de trabajo de desarrollo ad-hoc y a interfaces de usuario con errores. Este capítulo comparte cómo los equipos profesionales construyen la UI de una manera rigurosa y basada en pruebas visuales.

## Desarrollo guiado por pruebas

Antes de comenzar, recapitulemos **[test-driven development (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)**, una práctica popular de ingeniería. La idea central detrás de TDD es que usted escribe sus pruebas antes de desarrollar la funcionalidad bajo prueba.

1. Construya un conjunto de pruebas unitarias automatizadas para su código
2. Escriba el código en sí para "convertir las pruebas en verde".

TDD te permite pensar claramente sobre lo que su código necesita hacer en términos de entradas concretas (para los componentes, nos referimos a estos como "estados"). De esa manera, puede cubrir todos los casos de uso de su módulo.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/test-driven-development.mp4"
    type="video/mp4">
</video>

Veamos un ejemplo. Supongamos que tenemos una función `relativize` que convierte un objeto de fecha sin formato al formato de fecha relativa del formulario "hace 2 semanas". Es bastante sencillo delinear todos los diversos tipos de entrada que desea cubrir. Y luego, presione el botón "test" cada vez que crea que ha avanzado hacia una solución.

Su framework de prueba le permite ejecutar la función `relativize` de forma aislada sin necesidad de proporcionar información para toda su aplicación solo para probar esa parte.

Sin embargo, TDD fracasa al desarrollar interfaces de usuario porque es difícil definir las pruebas con anticipación, los módulos son difíciles de aislar y los resultados son subjetivos. Estas deficiencias se resuelven mediante componentes de prueba visual de forma aislada.

## Pruebas visuales

La parte complicada de las pruebas de interfaz de usuario es que no es posible verificar los detalles visuales relevantes solo con el código. Las pruebas visuales eluden esto al involucrar el juicio de un humano de una manera rápida y enfocada.

#### Flujo de trabajo de pruebas visuales

En la práctica, las pruebas visuales utilizan Storybook para probar "visualmente" un componente en un conjunto de estados de prueba definidos. Las pruebas visuales comparten los mismos pasos de configuración, ejecución y desmontaje que cualquier otro tipo de prueba, pero el paso de verificación recae en el usuario.

```
test do
  setup
  execute 👈 Storybook renderiza historias
  verify 👈 miras historias
  teardown
end
```

Y posteriormente, cualquier regresión es atrapada, capturando y comparando instantáneas de imágenes automáticamente.

```
test do
  setup
  execute 👈 Storybook renderiza historias
  verify 👈 captura instantáneas y las compara con las líneas base
  teardown
end
```

Se utiliza el mismo caso de prueba en ambos escenarios, solo cambia el método de verificación.

#### Cómo escribir casos de prueba visuales

Centrémonos en ese primer escenario por ahora. En Storybook, una prueba es tan simple como renderizar un elemento React. Para escribir un caso de prueba visual, una "historia" en el lenguaje de Storybook, describimos los estados del componente que nos interesa. El siguiente ejemplo de código muestra cómo escribirías pruebas visuales para `InboxTask`,` SnoozedTask` y `PinnedTask`.

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const InboxTask = Template.bind({});
InboxTask.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
    boardName: 'on Test Board',
  },
};

export const SnoozedTask = Template.bind({});
SnoozedTask.args = {
  task: {
    // Dar forma a las historias a través de la composición de argumentos.
    ...InboxTask.args.task,
    state: 'TASK_SNOOZED',
  },
};

export const PinnedTask = Template.bind({});
PinnedTask.args = {
  task: {
    // Dar forma a las historias a través de la composición de argumentos.
    ...InboxTask.args.task,
    state: 'TASK_PINNED',
  },
};
```

En Storybook,`Task` y sus variaciones aparecerán en la barra lateral. Esto corresponde a la fase _“ejecución”_ de un ciclo de prueba; la fase _"verificar"_ la hacemos a ojo en Storybook.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/task-stories-snoozed-optimized.mp4"
    type="video/mp4"/>
</video>
 
Para probar la interfaz de usuario, la verificación humana es un enfoque pragmático porque es robusto para los cambios de código en el componente que no afectan la apariencia visual. Además, debido a que solo necesitamos escribir nuestras entradas con anticipación y verificar visualmente la salida, estamos creando interfaces de usuario automáticamente en un estilo TDD.

## Aprende el desarrollo guiado por pruebas visuales

Si está creando una aplicación a partir de un diseño bien pensado, lo más probable es que haya un conjunto de componentes bien especificados con entradas y salidas integradas en el artefacto de diseño. Combine esta "especificación de diseño" con el proceso de prueba visual y podrá ejecutar una analogía exacta con TDD.

En el próximo capítulo, aplicaremos lo que aprendimos hasta ahora desarrollando un componente de ejemplo usando TDD Visual.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/visual-test-driven-development.mp4"
    type="video/mp4">
</video>
