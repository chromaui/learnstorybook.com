---
title: 'Introducir datos'
tocTitle: 'Datos'
description: 'Aprende como introducir datos a tus componentes interfaz gráfica'
commit: '33e3597'
---

Hasta ahora hemos creado componentes aislados que no contienen estado propio, sino que reciben entradas por medio de
sus propiedades y producen un resultado, muy útiles para Storybook, pero no lo son tanto hasta que les
proporcionemos algunos datos dentro de nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en ese tema. Pero nos tomaremos un momento para observar un patrón común para introducir datos por medio de componentes contenedores.

## Componentes contenedores

Nuestro `TaskListComponent` es un componente “presentacional” (ver [este post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) ya que no depende de ningún elemento externo a su implementación. Dicho de otro modo, nuestro componente recibe datos por medio de sus propiedades y produce una salida basada en esos datos. Siempre que estos sean los mismos, la salida será idéntica. Si quisiéramos obtener datos de un servidor externo, por ejemplo, necesitamos un "contenedor".

Este ejemplo usa [ngxs](https://ngxs.gitbook.io/ngxs/), una biblioteca que adopta los principios de Redux/ngrx pero
se centra en reducir el texto estándar y proporciona una mayor _angular-y_ forma de gestionar el estado, para
construir un modelo de datos simple para nuestra aplicación. Sin embargo, el patrón utilizado aquí se aplica
igualmente a otras bibliotecas de gestión de estado como [ngrx/store](https://github.com/ngrx/platform) o [Apollo](https://www.apollographql.com/docs/angular/).

Primero instala ngxs con:

```shell
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

Luego, construiremos un store sencillo que responda a las acciones que cambian el estado de las tareas, en un archivo
llamado `srcappstatetask.state.ts` (intencionalmente mantenido simple):

```ts:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// Define las acciones disponibles para la aplicación.
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

// El estado inicial de nuestro store cuando se carga la aplicación.
// Por lo general, se obtendría esto de un servidor
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
}

// Establece el estado predeterminado
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

  // Activa la acción PinTask, similar a redux
  @Action(PinTask)
  pinTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: PinTask) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }
  // Activa la acción archiveTask, similar a redux
  @Action(ArchiveTask)
  archiveTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: ArchiveTask) {
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

Tenemos el store implementado, necesitamos dar un par de pasos antes de conectarlo a nuestra aplicación.

Vamos a actualizar nuestro `TaskListComponent` para leer datos del store, pero primero vamos a mover nuestra versión de
presentación a un nuevo archivo llamado`pure-task-list.component.ts`, (cambiando el nombre del `selector` a
`app-pure-task-list`) que luego será envuelto en un contenedor.

En `src/app/components/pure-task-list.component.ts`:

```diff:title=src/app/components/pure-task-list.component.ts

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';
@Component({
- selector:'app-task-list',
+ selector: 'app-pure-task-list',
  // mismo contenido que antes con task-list.component.ts
})
- export class TaskListComponent {
+ export class PureTaskListComponent {
  // mismo contenido que antes con task-list.component.ts
 }
```

Luego cambiamos `srcappcomponentstask-list.component.ts` a lo siguiente:

```ts:title=src/app/components/task-list.component.ts
import { Component } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  template: `
    <app-pure-task-list
      [tasks]="tasks$ | async"
      (onArchiveTask)="archiveTask($event)"
      (onPinTask)="pinTask($event)"
    ></app-pure-task-list>
  `,
})
export class TaskListComponent {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  /**
   * Método de componente para activar el evento archiveTask
   */
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  /**
   * Método de componente para activar el evento pinTask
   */
  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Ahora vamos a crear un módulo angular para unir los componentes y el store.

Cree un nuevo archivo llamado `task.module.ts` dentro de la carpeta`components` y agregue lo siguiente:

```ts:title=src/app/components/task.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { TasksState } from '../state/task.state';
import { PureTaskListComponent } from './pure-task-list.component';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent, PureTaskListComponent],
  providers: [],
})
export class TaskModule {}
```

Todas las piezas están en su lugar, todo lo que necesitas es conectar el store a la aplicación. En nuestro módulo de
nivel superior (`srcappapp.module.ts`):

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

+ import { TaskModule } from './components/task.module';
+ import { NgxsModule } from '@ngxs/store';
+ import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
+ import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
+   TaskModule,
+   NgxsModule.forRoot([]),
+   NgxsReduxDevtoolsPluginModule.forRoot(),
+   NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

La razón para mantener la versión de presentación de la `TaskList` separada es porque es más fácil de probar y
aislar. Como no depende de la presencia de un store, es mucho más fácil de manejar desde una perspectiva de prueba.  
También cambiemos el nombre de `srcappcomponentstask-list.stories.ts` a`srcappcomponentspure-task-list.stories.ts`,
y asegurémonos de que nuestras historias usen la versión de presentación:

```ts:title=src/app/components/pure-task-list.stories.ts
import { moduleMetadata, Story, Meta, componentWrapperDecorator } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';

import * as TaskStories from './task.stories';

export default {
  component: PureTaskListComponent,
  decorators: [
    moduleMetadata({
      //👇 Importa ambos componentes para permitir la composición de componentes con Storybook
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Envuelve nuestras historias con un decorador
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'PureTaskListComponent',
} as Meta;

const Template: Story<PureTaskListComponent> = args => ({
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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

De manera similar, necesitamos usar `PureTaskListComponent` en nuestra prueba Jest:

```diff:title= src/app/components/task-list.component.spec.ts
import { render } from '@testing-library/angular';

- import { TaskListComponent } from './task-list.component.ts';
+ import { PureTaskListComponent } from './pure-task-list.component';

import { TaskComponent } from './task.component';

//👇 Nuestra historia importada aquí
- import { WithPinnedTasks } from './task-list.stories';
+ import { WithPinnedTasks } from './pure-task-list.stories';

describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(PureTaskListComponent, {
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

<div class="aside">
💡 Con este cambio, sus instantáneas requerirán una actualización. Vuelva a ejecutar el comando de prueba con la flag 
<code>-u</code> para actualizarlos. ¡Además, no olvides confirmar tus cambios con git!
</div>
