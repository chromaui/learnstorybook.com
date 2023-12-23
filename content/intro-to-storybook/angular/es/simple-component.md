---
title: 'Construye un componente simple'
tocTitle: 'Componente simple'
description: 'Construye un componente simple en aislamiento'
commit: 'b4ebe43'
---

Construiremos nuestra UI siguiendo la metodología [Component-Driven Development](https://www.componentdriven.org/)
(CDD). Es un proceso que crea interfaces de usuario "de abajo hacia arriba", comenzando con componentes y terminando
con pantallas. CDD nos ayudará a escalar la cantidad de complejidad a la que nos enfrentamos a medida que creamos la interfaz de usuario.

## Task - Tarea

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`TaskComponent` (o Tarea) es el componente principal de nuestra aplicación. Cada tarea se muestra de forma
ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o sin marcar),
información sobre la tarea y un botón “pin” que nos permite fijar dicha tarea en la parte superior de la lista. Con
estas especificaciones en mente, necesitaremos las siguientes propiedades (props):

- `title` – una cadena de caracteres que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente? y, ¿está marcado el checkbox?

Mientras comenzamos a construir nuestro `TaskComponent`, Primero escribimos nuestros estados de prueba que
corresponden a los diferentes tipos de tareas descritas anteriormente. Luego, utilizaremos Storybook para construir el
componente de forma aislada usando datos simulados. Realizaremos una "prueba visual" de la apariencia del componente
en cada estado a medida que avanzamos.

Este proceso es similar al [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD)
que podríamos denominar ["Visual TDD"](https://www.chromatic.com/blog/visual-test-driven-development).

## Ajustes iniciales

Primero, creemos el componente de la tarea y el archivo de historia que lo acompaña: `src/app/components/task.component.ts` y `src/app/components/task.stories.ts`.

Comenzaremos con la implementación básica del `TaskComponent`, simplemente tomando las entradas que sabemos que
necesitaremos (título y estado de la misma) y las dos acciones que puede realizar en una tarea (moverla entre las listas y fijarla):

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `,
})
export class TaskComponent {
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Arriba, renderizamos directamente nuestro `TaskComponent` basándonos en la estructura HTML existente de la app TODOs.

A continuación creamos los tres estados de prueba del componente dentro del archivo de historia:

```ts:title=src/app/components/task.stories.ts
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { Story, Meta } from '@storybook/angular';

import { action } from '@storybook/addon-actions';

import { TaskComponent } from './task.component';

export default {
  component: TaskComponent,
  decorators: [
    moduleMetadata({
      declarations: [TaskComponent],
      imports: [CommonModule],
    }),
  ],
  excludeStories: /.*Data$/,
  title: 'Task',
} as Meta;

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template: Story<TaskComponent> = args => ({
  component: TaskComponent,
  props: {
    ...args,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Puedes pensar en cada
historia como una permutación del componente (todos los estados posibles que puede tener, basándose en las
entradas que se le pueden proporcionar). Puedes crear tantas historias por componente como sean necesarias.

- **Component**
  - Story
  - Story
  - Story

Para informar a Storybook sobre el componente que estamos documentando, creamos una exportación `por defecto` que contendrá:

- `component` -- el componente en sí,
- `title` -- cómo hacer referencia al componente en la barra lateral de la aplicación Storybook,
- `excludeStories` -- exporta en el archivo de la historia las partes que Storybook no debería representar como
  historias.

Para definir nuestras historias, exportamos una función para cada uno de nuestros estados de prueba para generar una
historia. La historia es una función que devuelve un elemento renderizado. (ej. un componente de clase con un
conjunto de propiedades) en un estado dado, exactamente como un [Functional Component](https://angular.io/guide/component-interaction).

Como tenemos múltiples permutaciones de nuestro componente, es conveniente asignarlo a una variable `template`. La introducción de este patrón en sus historias reducirá la cantidad de código que necesita escribir y mantener.

<div class="aside">
💡 <code>Template.bind({})</code> es la técnica <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">estándar de JavaScript</a> para hacer una 
copia de una función. Usamos esta técnica para permitir que cada historia exportada establezca sus propias propiedades, pero usamos la misma implementación.
</div>

Argumentos o [`args`](https://storybook.js.org/docs/angular/writing-stories/args) para abreviar, nos permite editar en
vivo nuestros componentes con un complemento de controles sin reiniciar Storybook. Cuando los valores de los [`args`](https://storybook.js.org/docs/vue/writing-stories/args) cambian, también lo hace el componente.

Al crear una historia usamos un argumento base `task` para construir la forma de la tarea que el componente espera.
Esto generalmente se modela a partir de cómo se ven los datos reales. De nuevo, `export` esta forma nos permitirá reutilizarla en historias posteriores, como veremos.

`action()` nos permite crear una devolución de la llamada que aparece en el panel **actions** de la UI de Storybook al hacer clic. Entonces, cuando creamos un botón de marcador, podremos determinar en la UI de prueba si el clic de un botón es exitoso.

Como necesitamos pasar el mismo conjunto de acciones a todas las permutaciones de nuestro componente, es conveniente agruparlas en una sola variable `actionsData` y pasarlas a nuestra definición de historia cada vez.

Otra cosa buena de agrupar los `actionsData` que necesita un componente, es que puedes`exportarlos` y usarlos en historias para componentes que reutilizan este componente, como veremos más adelante.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/essentials/actions"><b>Actions</b></a> nos ayuda a verificar las 
interacciones al crear componentes de UI de forma aislada. A menudo, no tendremos acceso a las funciones y el estado 
que tiene el contexto de la aplicación. Use <code>action()</code> para simularlas.
</div>

## Configuración

También tendremos que hacer un pequeño cambio en la configuración de Storybook, por lo que nota nuestras historias recientemente creadas. Cambia tu archivo de configuración (`.storybook/main.js`) a lo siguiente:

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

Una vez que hemos hecho esto, reiniciar el servidor de Storybook debe producir casos de prueba para los tres estados de TaskComponent:

<video autoPlay muted playsInline loop>
  <source
      src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Especificar los requisitos de datos

Es una buena práctica especificar la forma de los datos que espera un componente. No solo se documenta por sí mismo,
sino que también ayuda a detectar problemas de manera temprana. Aquí, usaremos TypeScript y crearemos una interfaz para el modelo `Task`.

Cree una nueva carpeta llamada `models` dentro de la carpeta`app` y dentro de un nuevo archivo llamado `task.model. ts` con el siguiente contenido:

```ts:title=src/app/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## Construye los estados

Ahora que tenemos la configuración de Storybook, los estilos importados y los casos de prueba construidos, podemos
comenzar rápidamente el trabajo de implementar el HTML del componente para que coincida con el diseño.

Nuestro componente es todavía bastante rudimentario en este momento. Vamos a hacer algunos cambios para que coincida
con el diseño deseado sin entrar en demasiados detalles:

```diff:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

+ import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  template: `
+   <div class="list-item {{ task?.state }}">
+     <label class="checkbox">
+       <input
+         type="checkbox"
+         [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
+         disabled="true"
+         name="checked"
+       />
+       <span class="checkbox-custom" (click)="onArchive(task.id)"></span>
+     </label>
+     <div class="title">
+       <input
+         type="text"
+         [value]="task?.title"
+         readonly="true"
+         placeholder="Input title"
+       />
+     </div>
+     <div class="actions">
+       <a *ngIf="task?.state !== 'TASK_ARCHIVED'" (click)="onPin(task.id)">
+         <span class="icon-star"></span>
+       </a>
+     </div>
+   </div>
  `,
})
export class TaskComponent {
+ @Input() task: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();

+ /**
+  * Component method to trigger the onPin event
+  * @param id string
+  */
+ onPin(id: any) {
+   this.onPinTask.emit(id);
+ }
+ /**
+  * Component method to trigger the onArchive event
+  * @param id string
+  */
+ onArchive(id: any) {
+   this.onArchiveTask.emit(id);
+ }
}
```

El marcado adicional de arriba combinado con el CSS que importamos anteriormente produce la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## ¡Componente construido!

Ahora hemos construido con éxito un componente sin necesidad de un servidor o ejecutar toda la aplicación frontend.
El siguiente paso es construir los componentes restantes de Taskbox uno por uno de manera similar.

Como puede ver, comenzar a construir componentes de forma aislada es fácil y rápido. Podemos esperar producir una
interfaz de usuario de mayor calidad con menos errores y más pulida porque es posible profundizar y probar todos los estados posibles.

## Pruebas automatizadas

Storybook proporciona una excelente forma de probar visualmente nuestra aplicación durante su construcción. Las
'historias' ayudarán a asegurar que no rompamos nuestro TaskComponent y que cada estado posible siempre se vea
como debe ser, a medida que continuamos desarrollando la aplicación. Sin embargo, en esta etapa, es un proceso
completamente manual y alguien tiene que hacer el esfuerzo de hacer clic en cada estado de prueba y asegurarse de
que se visualice bien y sin errores ni advertencias. ¿No podemos hacer eso automáticamente?

### Pruebas de instantáneas

La prueba de instantáneas se refiere a la práctica de registrar la salida "correcta" de un componente (como debe
mostrarse en el navegador) para una determinada serie de entradas (datos que recibe el componente) y luego en el
futuro marcar el componente siempre que la salida cambie. Estas pruebas complementan el trabajo que Storybook hace,
pues constituyen una manera rápida de visualizar la nueva versión de un componente y verificar los cambios.

<div class="aside">
💡 Asegúrate de que tus componentes rendericen datos que no cambien. De otro modo, cada vez que los datos cambien tus 
pruebas fallarán. Presta especial atención a fechas o valores generados de manera aleatoria.
</div>

Con [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea,
automáticamente, una prueba de instantánea para cada una de las historias. Úsalo agregando el siguiente paquete en
modo desarrollo a las dependencias del proyecto:

```shell
npm install -D @storybook/addon-storyshots
```

Luego crea un archivo `src/storybook.test.js` con el siguiente contenido:

```ts:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

Finalmente, necesitamos hacer un pequeño cambio para `jest` en nuestro `package.json`:

```diff:title=package.json
"transform": {
  "^.+\\.(ts|html)$": "ts-jest",
   "^.+\\.js$": "babel-jest",
+   "^.+\\.stories\\.[jt]sx?$": "@storybook/addon-storyshots/injectFileName"
},
```

Una vez hecho lo anterior, podemos ejecutar `npm run test` y ver el siguiente resultado:

![Task test runner](/intro-to-storybook/task-testrunner.png)

Ahora tenemos una prueba instantánea para cada una de nuestras historias de "TaskComponent". Si cambiamos la
implementación de `TaskComponent`, se nos pedirá que verifiquemos los cambios.

Adicionalmente, `jest` también ejecutará la prueba para `app.component.ts`.

<div class="aside">
💡 ¡No olvides confirmar tus cambios en git!
</div>
