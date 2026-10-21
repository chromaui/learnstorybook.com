---
title: 'Ensambla un componente compuesto'
tocTitle: 'Componente Compuesto'
description: 'Ensambla un componente compuesto a partir de componentes simples'
commit: '03a7d0c'
---

En el capítulo anterior construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir `TaskListComponent`, una lista de Tareas. Combinemos varios componentes y veamos qué sucede cuando se añade más complejidad a la ecuación.

## Lista de Tareas

Taskbox enfatiza las tareas fijadas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones del `TaskListComponent` para las que necesita crear historias: ítems por defecto e ítems por defecto y fijados.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Dado que los datos de nuestro `TaskComponent` pueden enviarse asincrónicamente, **también** necesitamos un estado que denote que la información se está cargando el cual podemos mostrar en ausencia de una conexión o mientras no hayan llegado los datos. Además, se requiere un estado vacío que mostraremos cuando no haya tareas.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente
`TaskListComponent` y su correspondiente archivo de historia: `src/tasks/task-list.component.ts` y `src/tasks/task-list.stories.ts`.

Comienza con una implementación aproximada del `TaskListComponent`. Necesitarás utilizar el `TaskComponent` del capítulo anterior y pasarle los atributos y acciones como entradas y eventos.

```ts:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';
@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <div *ngIf="loading">loading</div>
      <div *ngIf="!loading && tasks.length === 0">empty</div>
      <app-task
        *ngFor="let task of tasks"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
    </div>
  `,
})
export class TaskListComponent {
  /** La lista de tareas */
  @Input() tasks: Task[] = [];

  /** Comprueba si está en estado de carga */
  @Input() loading = false;

  /** Evento para cambiar la tarea a anclada */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  /** Evento para cambiar la tarea a archivada */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

A continuación, crea los estados de prueba de `TasklistComponent` en el archivo de historia.

```ts:title=src/app/components/task-list.stories.ts
import { moduleMetadata, Story, Meta, componentWrapperDecorator } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

import * as TaskStories from './task.stories';

export default {
  component: TaskListComponent,
  decorators: [
    moduleMetadata({
      //👇 Importa ambos componentes para permitir la composición de componentes con Storybook
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Envuelve nuestras historias con un decorador
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'TaskList',
} as Meta;

const Template: Story<TaskListComponent> = args => ({
  props: {
    ...args,
    onPinTask: TaskStories.actionsData.onPinTask,
    onArchiveTask: TaskStories.actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Dar forma a las historias a través de la composición de argumentos.
  // Datos heredados que provienen de la historia predeterminada.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Dar forma a las historias a través de la composición de argumentos.
  // Datos heredados que provienen de la historia de carga.
  ...Loading.args,
  loading: false,
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>Los Decoradores</b></a> son una 
forma de proporcionar envoltorios arbitrarios a las historias. En este caso, usamos una `clave` decoradora en la 
exportación predeterminada para configurar los módulos y componentes necesarios. También se pueden utilizar para 
envolver historias en "proveedores", es decir, componentes de la biblioteca que establecen el contexto de React.
</div>

Importando `TaskStories`, fuimos capaces de [componer](https://storybook.js.org/docs/angular/writing-stories/args#args-composition) los argumentos (args para abreviar) en nuestras historias con un mínimo esfuerzo. De esa forma, se conservan los datos y las acciones (devoluciones de llamada simuladas) esperadas por ambos componentes.

Ahora consulte Storybook para ver las nuevas historias de `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simple. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio: la **complejidad real** del `TaskListComponent` se revela en los casos extremos `withPinnedTasks`, `loading`, y `empty`.

```diff:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
+   <div class="list-items">
+     <app-task
+       *ngFor="let task of tasksInOrder"
+       [task]="task"
+       (onArchiveTask)="onArchiveTask.emit($event)"
+       (onPinTask)="onPinTask.emit($event)"
+     >
+     </app-task>
+     <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
+       <span class="icon-check"></span>
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
+     <div *ngIf="loading">
+       <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
+         <span class="glow-checkbox"></span>
+         <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
+       </div>
+     </div>
+   </div>
  `,
})
export class TaskListComponent {
- @Input() tasks: Task[] = [];

+  /**
+  * Propiedad del componente para definir el orden de las tareas.
+  */
+ tasksInOrder: Task[] = [];

  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

+ @Input()
+ set tasks(arr: Task[]) {
+   this.tasksInOrder = [
+     ...arr.filter(t => t.state === 'TASK_PINNED'),
+     ...arr.filter(t => t.state !== 'TASK_PINNED'),
+   ];
+ }
}
```

El HTML añadido da como resultado la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Toma nota de la posición del elemento fijado en la lista. Queremos que este se muestre en la parte superior de la misma para que sea prioritario para nuestros usuarios.

## Requisitos de datos y propiedades

A medida que el componente crece, también lo hacen los parámetros de entrada requeridos por nuestro `TaskListComponent`. Define las propiedades requeridas de `TaskList` utilizando TypeScript. Debido a que `TaskComponent` es un componente hijo, asegúrate de proporcionar los datos en la forma correcta para renderizarlo. Para ahorrarte tiempo y dolores de cabeza, reutiliza el modelo que definiste en `task.model.ts` anteriormente.

## Pruebas automatizadas

En el capítulo anterior aprendimos a capturar historias de prueba utilizando Storyshots. Con el componente `TaskComponent` no había mucha complejidad para probar más allá de que se renderice correctamente. Dado que `TaskListComponent` añade otra capa de complejidad, queremos verificar que ciertas entradas produzcan ciertas salidas de una manera adecuada con pruebas automáticas. Para hacer esto crearemos test unitarios utilizando [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro).

![Testing library logo](/intro-to-storybook/testinglibrary-image.jpeg)

### Test unitarios con Angular Testing Library

Las historias de Storybook combinadas con pruebas visuales manuales y pruebas de instantáneas (ver arriba) ayudan a prevenir errores de interfaz de usuario. Si las historias cubren una amplia variedad de casos de uso de los componentes, y utilizamos herramientas que aseguran que un humano compruebe cualquier cambio en la historia, es mucho menos probable que sucedan errores.

Sin embargo, a veces el diablo está en los detalles. Se necesita un framework de pruebas que sea explícito sobre esos detalles. Lo que nos lleva a las pruebas unitarias.

En nuestro caso, queremos que nuestro `TaskListComponent` muestre cualquier tarea fijada **antes de** las tareas no fijadas que sean pasadas por medio de la propiedad `tasks`. Aunque tenemos una historia (`withPinnedTasks`) para probar este escenario exacto; un humano podría pasar por alto el hecho de que el componente **no** ordene las tareas de esta manera es un error. Después de todo, para el ojo no entrenado (y que desconoce los requerimientos), el componente esta renderizandose correctamente.

Por lo tanto, para evitar este problema, podemos usar Angular Testing Library para renderizar la historia en el DOM y ejecutar algún código de consulta del DOM para verificar que el resultado es el esperado.

Crea un archivo de prueba llamado `task-list.component.spec.ts`. Aquí vamos a escribir nuestras pruebas que, básicamente, constituyen un conjunto de validaciones sobre el resultado.

```ts:title=src/app/components/task-list.component.spec.ts
import { render } from '@testing-library/angular';

import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

//👇 Our story imported here
import { WithPinnedTasks } from './task-list.stories';

describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(TaskListComponent, {
      declarations: [TaskComponent],
      componentProperties: {
        ...WithPinnedTasks.args,
        onPinTask: {
          emit: mockedActions,
        } as any,
        onArchiveTask: {
          emit: mockedActions,
        } as any,
      },
    });
    const component = tree.fixture.componentInstance;
    expect(component.tasksInOrder[0].id).toBe('6');
  });
});
```

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Como puedes notar, hemos sido capaces de reutilizar la lista de tareas `withPinnedTasks` tanto en la prueba de la historia como en el test unitario; de esta manera podemos aprovechar un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de diferentes formas.

Es necesario resaltar que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de nuestro `TaskComponent` cambie --quizás usando un nombre de clase diferente o un "área de texto" en lugar de un "input"-- la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso cuando se utilizan pruebas unitarias para probar interfaces gráficas. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/intro-to-storybook/angular/es/test/)) siempre que te sea posible.
