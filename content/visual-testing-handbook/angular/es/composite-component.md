---
title: "Ensambla un componente compuesto"
tocTitle: "Componente Compuesto"
description: "Ensambla un componente compuesto a partir de componentes simples"
commit: d3abd86
---

En el capítulo anterior construimos nuestro primer componente; este capítulo extiende lo que aprendimos para construir `TaskListComponent`, una lista de Tareas. Combinemos varios componentes y veamos qué sucede cuando se añade más complejidad a la ecuación.

## Lista de Tareas

Taskbox enfatiza las tareas fijadas colocándolas por encima de las tareas predeterminadas. Esto produce dos variaciones del `TaskListComponent` para las que necesita crear historias: ítems por defecto e ítems por defecto y fijados.

![default and pinned tasks](/tasklist-states-1.png)

Dado que los datos de nuestro `TaskComponent` pueden enviarse asincrónicamente, **también** necesitamos un estado que denote que la información se está cargando el cual podemos mostrar en ausencia de una conexión o mientras no hayan llegado los datos. Además, se requiere un estado vacío que mostraremos cuando no haya tareas.

![empty and loading tasks](/tasklist-states-2.png)

## Empezar la configuración

Un componente compuesto no es muy diferente de los componentes básicos que contiene. Crea un componente `TaskListComponent` y su correspondiente archivo de historia: `src/tasks/task-list.component.ts` and `src/tasks/task-list.stories.ts`.

Comienza con una implementación aproximada del `TaskListComponent`. Necesitarás utilizar el `TaskComponent` del capítulo anterior y pasarle los atributos y acciones como entradas y eventos.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'task-list',
  template: `
    <div class="list-items">
      <task-item
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </task-item>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  @Input() loading: boolean = false;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

A continuación, crea los estados de prueba de `TasklistComponent` en el archivo de historia.

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { task, actions } from './task.stories';

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

const props = {
  tasks: defaultTasks,
  onPinTask: actions.onPinTask,
  onArchiveTask: actions.onArchiveTask,
};

storiesOf('TaskList', module)
  .addDecorator(
    moduleMetadata({
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  )
  .add('default', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  })
  .add('withPinnedTasks', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props: {
        ...props,
        tasks: withPinnedTasks,
      },
    };
  })
  .add('loading', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  })
  .add('empty', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  });
```

`addDecorator()` nos permite añadir algún "contexto" al renderizado de cada tarea. En este caso añadimos meta datos que sirven para inicializar el módulo de Angular que nos permite utilizar nuestros componentes dentro de las historias.

<div class="aside">
Los <a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decoradores</b></a> son una forma de proporcionar envoltorios arbitrarios a las historias. En este caso estamos usando un decorador para añadir meta datos.
</div>

`task` corresponde a la forma de la Tarea que creamos y exportamos desde el archivo `task.stories.ts`. De manera similar, `actions` define las acciones (comunmente llamadas mockeadas) que espera un `TaskComponent`, el cual también necesita la `TaskListComponent`.

Una vez hecho esto, podemos revisar Storybook y encontraremos las nuevas historias de la lista de tareas.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Construir los estados

Nuestro componente sigue siendo muy rudimentario, pero ahora tenemos una idea de las historias en las que trabajaremos. Podrías estar pensando que el envoltorio de `.list-items` es demasiado simple. Tienes razón, en la mayoría de los casos no crearíamos un nuevo componente sólo para añadir un envoltorio: la **complejidad real** del `TaskListComponent` se revela en los casos extremos `withPinnedTasks`, `loading`, y `empty`.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'task-list',
  template: `
    <div class="list-items">
      <task-item
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </task-item>

      <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>

      <div *ngIf="loading">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text">
            <span>Loading</span> <span>cool</span> <span>state</span>
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading: boolean = false;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  @Input()
  set tasks(arr: Task[]) {
    this.tasksInOrder = [
      ...arr.filter(t => t.state === 'TASK_PINNED'),
      ...arr.filter(t => t.state !== 'TASK_PINNED'),
    ];
  }

  constructor() {}

  ngOnInit() {}
}
```

El HTML añadido da como resultado la siguiente interfaz de usuario:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Toma nota de la posición del elemento fijado en la lista. Queremos que este se muestre en la parte superior de la misma para que sea prioritario para nuestros usuarios.

## Requisitos de datos y propiedades

A medida que el componente crece, también lo hacen los parámetros de entrada requeridos por nuestro `TaskListComponent`. Define las propiedades requeridas de `TaskList` utilizando TypeScript. Debido a que `TaskComponent` es un componente hijo, asegúrate de proporcionar los datos en la forma correcta para renderizarlo. Para ahorrarte tiempo y dolores de cabeza, reutiliza el modelo que definiste en `task.model.ts` anteriormente.

## Pruebas automatizadas

En el capítulo anterior aprendimos a capturar historias de prueba utilizando Storyshots. Con el componente `TaskComponent` no había mucha complejidad para probar más allá de que se renderice correctamente. Dado que `TaskListComponent` añade otra capa de complejidad, queremos verificar que ciertas entradas produzcan ciertas salidas de una manera adecuada con pruebas automáticas. Para hacer esto crearemos test unitarios utilizando [Jest](https://facebook.github.io/jest/) junto con un renderizador de prueba.

![Jest logo](/logo-jest.png)

### Test unitarios con Jest

Las historias de Storybook combinadas con pruebas visuales manuales y pruebas de instantáneas (ver arriba) ayudan a prevenir errores de interfaz de usuario. Si las historias cubren una amplia variedad de casos de uso de los componentes, y utilizamos herramientas que aseguran que un humano compruebe cualquier cambio en la historia, es mucho menos probable que sucedan errores.

Sin embargo, a veces el diablo está en los detalles. Se necesita un framework de pruebas que sea explícito sobre esos detalles. Lo que nos lleva a las pruebas unitarias.

En nuestro caso, queremos que nuestro `TaskListComponent` muestre cualquier tarea fijada **antes de** las tareas no fijadas que sean pasadas por medio de la propiedad `tasks`. Aunque tenemos una historia (`withPinnedTasks`) para probar este escenario exacto; un humano podría pasar por alto el hecho de que el componente **no** ordene las tareas de esta manera es un error. Después de todo, para el ojo no entrenado (y que desconoce los requerimientos), el componente esta renderizandose correctamente.

Por lo tanto, para evitar este problema, podemos usar Jest para renderizar la historia en el DOM y ejecutar algún código de consulta del DOM para verificar que el resultado es el esperado.

Crea un archivo de prueba llamado `task-list.component.spec.ts`. Aquí vamos a escribir nuestras pruebas que, básicamente, constituyen un conjunto de validaciones sobre el resultado.

```typescript
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

import { withPinnedTasks } from './task-list.stories';
import { By } from '@angular/platform-browser';

describe('TaskList component', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TaskComponent, TaskListComponent],
      }).compileComponents();
    }),
  );

  it('renders pinned tasks at the start of the list', () => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = withPinnedTasks;

    fixture.detectChanges();
    const lastTaskInput = fixture.debugElement.query(
      By.css('.list-item:nth-child(1)'),
    );

    // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
    expect(lastTaskInput.nativeElement.id).toEqual('6');
  });
});
```

![TaskList test runner](/tasklist-testrunner.png)

Como puedes notar, hemos sido capaces de reutilizar la lista de tareas `withPinnedTasks` tanto en la prueba de la historia como en el test unitario; de esta manera podemos aprovechar un recurso existente (los ejemplos que representan configuraciones interesantes de un componente) de diferentes formas.

Es necesario resaltar que esta prueba es bastante frágil. Es posible que a medida que el proyecto madure y que la implementación exacta de nuestro `TaskComponent` cambie --quizás usando un nombre de clase diferente o un "área de texto" en lugar de un "input"-- la prueba falle y necesite ser actualizada. Esto no es necesariamente un problema, sino más bien una indicación de que hay que ser bastante cuidadoso cuando se utilizan pruebas unitarias para probar interfaces gráficas. No son fáciles de mantener. En su lugar, confía en las pruebas visuales, de instantáneas y de regresión visual (mira el [capitulo sobre las pruebas](/test/)) siempre que te sea posible.
