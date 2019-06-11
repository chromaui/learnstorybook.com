---
title: "Introducir datos"
tocTitle: "Datos"
description: "Aprende como introducir datos a tus componentes interfaz gráfica"
commit: 34f1938
---

Hasta ahora hemos creado componentes aislados que no contienen estado propio sino que reciben entradas por medio de sus propiedades y producen un resultado, muy útiles para Storybook, pero no lo son tanto hasta que les proporcionemos algunos datos dentro de nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en ese tema. Pero nos tomaremos un momento para observar un patrón común para introducir datos por medio de componentes contenedores.

## Componentes contenedores

Nuestro `TaskListComponent` es un componente “presentacional” (ver [este post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) ya que no depende de ningún elemento externo a su implementación. Dicho de otro modo, nuestro componente recibe datos por medio de sus propiedades y produce una salida basada en esos datos. Siempre que estos sean los mismos, la salida será idéntica. Si quisiéramos obtener datos de un servidor externo, por ejemplo, necesitamos un "contenedor".

Este ejemplo utiliza [ngxs](https://ngxs.gitbook.io/ngxs/), una librería que respeta los principios de Redux/ngrx pero se enfoca en reducir el código repetitivo mientras provee una manera sencilla y más cercana a Angular y sus principios de OOP (programación orientada a objetos) para manejar el estado de la aplicación. Aún así, este patrón aplica para otras librerías como [ngrx/store](https://github.com/ngrx/platform).

Empecemos por cambiar ligeramente la estructura de nuestra aplicación, necesitaremos crear dos directorios `containers` y `components`. Una vez que los hayamos creado, procederemos a mover `task.component.ts` y `task-list.component.ts` (y sus archivos`.stories.ts` correspondientes) dentro de `components`. Una vez hecho esto, recuerda actualizar las referencias a estos componentes (`import`).

Después construiremos un contenedor de estado simple que responde a las acciones que cambian el estado de las tareas en un archivo llamado `src/tasks/state/task.state.ts` (mantenemos esta implementación sencilla intencionalmente):

```typescript
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../task.model';

export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
}

@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  @Action(PinTask)
  pinTask(
    { patchState, getState }: StateContext<TaskStateModel>,
    { payload }: PinTask,
  ) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }

  @Action(ArchiveTask)
  archiveTask(
    { patchState, getState }: StateContext<TaskStateModel>,
    { payload }: ArchiveTask,
  ) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_ARCHIVED' },
    };

    patchState({
      entities,
    });
  }
}
```

Luego necesitaremos conectar el `NgxsModule` dentro de nuestros módulos de Angular. Primero ve a `src/tasks/task.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { TasksState } from './state/task.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent],
  providers: [],
})
export class TaskModule {}
```

después dirígete a `src/app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './tasks/task.module';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TaskModule, NgxsModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Ahora procederemos a convertir nuestro `TaskListComponent` en un contenedor. Esto significa que obtendrá la lista de tareas directamente desde nuestro contenedor de estado. Para lograr esto, necesitaremos crear `src/tasks/containers/task-list.component.ts` y añadir el siguiente código:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'task-list',
  template: `
    <pure-task-list [tasks]="tasks$ | async" (onArchiveTask)="archiveTask($event)" (onPinTask)="pinTask($event)"></pure-task-list>
  `,
})
export class TaskListComponent implements OnInit {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}

  archiveTask(id) {
    this.store.dispatch(new ArchiveTask(id));
  }

  pinTask(id) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Como puedes notar, hemos cambiado el nombre de nuestro `TaskListComponent` que se encontraba en `src/tasks/components/task-list.component.ts` a `src/tasks/components/pure-task-list.component.ts`. También hemos cambiado su selector de `task-list` a `pure-task-list` y el nombre de la clase que define al componente de `TaskListComponent` a `PureTaskListComponent`. Estos cambios se deben, primordialmente, a que queremos separar claramente el componente: ahora tenemos un componente puro que recibe una lista de tareas, algunos eventos y renderiza un resultado y un componente contenedor que depende de nuestro contenedor de estado para obetener los datos que necesita pasarle al componente puro. No olvides cambiar el nombre de `task-list.stories.ts`.

En este momento, nuestras historias han dejado de funcionar pues el `TaskListComponent` ahora es un contenedor y no espera ninguna propiedad. Por el contrario, se conecta directamente a nuestro contenedor de estado y le pasa las propiedades al `PureTaskListComponent` que envuelve.

Afortunadamente podemos resolver esto de manera sencilla: utilizaremos nuestro `PureTaskListComponent` (en lugar de `TaskListComponent`) en las historias:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { TaskComponent } from './task.component';
import { PureTaskListComponent } from './pure-task-list.component';
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
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  )
  .add('default', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  })
  .add('withPinnedTasks', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
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
          <pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  })
  .add('empty', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  });
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

De la misma forma, necesitamos cambiar nuestras pruebas para que utilicen `PureTaskListComponent`:

```typescript
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';

import { withPinnedTasks } from './pure-task-list.stories';
import { By } from '@angular/platform-browser';

describe('TaskList component', () => {
  let component: PureTaskListComponent;
  let fixture: ComponentFixture<PureTaskListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TaskComponent, PureTaskListComponent],
      }).compileComponents();
    }),
  );

  it('renders pinned tasks at the start of the list', () => {
    fixture = TestBed.createComponent(PureTaskListComponent);
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
