---
title: "Introducir datos"
tocTitle: "Datos"
description: "Aprende como introducir datos a tus componentes interfaz gráfica"
commit: ea58e96
---

# Introducir datos

Hasta ahora hemos creado componentes aislados que no contienen estado propio sino que reciben entradas por medio de sus propiedades y producen un resultado, muy útiles para Storybook, pero no lo son tanto hasta que les proporcionemos algunos datos dentro de nuestra aplicación.

Este tutorial no se centra en los detalles de la construcción de una aplicación, por lo que no profundizaremos en ese tema. Pero nos tomaremos un momento para observar un patrón común para introducir datos por medio de componentes contenedores.

## Componentes contenedores

Nuestro `TaskListComponent` es un componente “presentacional” (ver [este post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) ya que no depende de ningún elemento externo a su implementación. Dicho de otro modo, nuestro componente recibe datos por medio de sus propiedades y produce una salida basada en esos datos. Siempre que estos sean los mismos, la salida será idéntica. Si quisiéramos obtener datos de un servidor externo, por ejemplo, necesitamos un "contenedor".

Este ejemplo utiliza [ngxs](https://ngxs.gitbook.io/ngxs/), una librería que respeta los principios de Redux/ngrx pero se enfoca en reducir el código repetitivo mientras provee una manera sencilla y más cercana a Angular y sus principios de OOP (programación orientada a objetos) para manejar el estado de la aplicación. Aún así, este patrón aplica para otras librerías como [ngrx/store](https://github.com/ngrx/platform).

Inicialmente construiremos un contenedor de estado simple que responde a las acciones que cambian el estado de las tareas en un archivo llamado `src/tasks/state/task.state.ts` (mantenemos esta implementación sencilla intencionalmente):

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

En el siguiente capítulo conectaremos nuestro contenedor de estado con un nuevo componente "contenedor".
