---
title: 'Construir una pantalla'
tocTitle: 'Pantallas'
description: 'Construir una pantalla utilizando componentes'
commit: 'b4ab0c0'
---

Nos hemos concentrado en crear interfaces de usuario desde "abajo hacia arriba"; empezando con los componentes individuales y añadiendo complejidad gradualmente. Esto nos ha permitido desarrollar cada componente de forma aislada, determinar los datos que necesita y jugar con ellos en Storybook. ¡Todo sin necesidad de utilizar un servidor o, siquiera, construir una sola pantalla!

En este capítulo aumentaremos la sofisticación al combinar los componentes que hemos construido en una pantalla y desarrollar esa pantalla dentro de Storybook.

## Componentes "contenedores"

Como nuestra aplicación es muy simple, la pantalla que crearemos es bastante trivial, simplemente envuelve el
`TaskListComponent` (que proporciona sus propios datos a través de ngxs) en un layout y mostrar un campo de`error` de
nivel superior de nuestro store (supongamos que estableceremos ese campo si tenemos algún problema para conectarnos a nuestro servidor).

Comencemos actualizando el store (en `srcappstatetask.state.tx`) para incluir el campo de error que queremos:

```diff:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// define las acciones disponibles para la aplicación
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // Define el nuevo campo de error que necesitamos
+ ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
+ // La definición de clase para nuestro campo de error.
+ export class AppError {
+   static readonly type = actions.ERROR;
+   constructor(public payload: boolean) {}
+ }

// El estado inicial de nuestra tienda cuando se carga la aplicación.
// Por lo general, obtendría esto de un servidor
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
+ error: boolean;
}

// Establece el estado predeterminado
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
+   error: false,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // Define un nuevo selector para el campo de error.
  @Selector()
  static getError(state: TaskStateModel) {
    const { error } = state;
    return error;
  }
  //
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
  // Activa la acción PinTask, similar a redux
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

+ // Función para manejar cómo se debe actualizar el estado cuando se activa la acción
+ @Action(AppError)
+ setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError) {
+   const state = getState();
+   patchState({
+     error: !state.error,
+   });
+ }
}
```

El store se actualiza con el nuevo campo. Vamos a crear un presentacional `pure-inbox-screen.component.ts` en la
carpeta `src/app/components`:

```ts:title=src/app/components/pure-inbox-screen.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pure-inbox-screen',
  template: `
    <div *ngIf="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>

    <div *ngIf="!error" class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export class PureInboxScreenComponent {
  @Input() error: any;
}
```

Luego podemos crear el contenedor, que como antes, toma los datos para `PureInboxScreenComponent`. En un nuevo
archivo llamado `inbox-screen.component.ts`:

```ts:title=src/app/components/inbox-screen.component.ts
import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { TasksState } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent {
  @Select(TasksState.getError) error$: Observable<any>;
}
```

También necesitamos cambiar el `AppComponent` para renderizar el `InboxScreenComponent` (eventualmente usaríamos un
enrutador para elegir la pantalla correcta, pero no nos preocupemos por eso aquí):

```diff:title=src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
- templateUrl: './app.component.html',
- styleUrls: ['./app.component.css']
+ template: `
+   <app-inbox-screen></app-inbox-screen>
+ `,
})
export class AppComponent {
- title = 'intro-storybook-angular-template';
+ title = 'taskbox';
}
```

Y finalmente el `app.module.ts`:

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

+ import { InboxScreenComponent } from './components/inbox-screen.component';
+ import { PureInboxScreenComponent } from './components/pure-inbox-screen.component';

@NgModule({
+ declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
  imports: [
    BrowserModule,
    TaskModule,
    NgxsModule.forRoot([]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

<div class="aside"><p>No olvide actualizar el archivo de prueba <code>src/app/app.component.spec.ts</code>. O la 
próxima vez que ejecute sus pruebas fallarán.</p></div>

Sin embargo, donde las cosas se ponen interesantes es en el renderizado de la historia en Storybook.

Como vimos anteriormente, el componente `TaskListComponent` es un contenedor que muestra el componente de
presentación `PureTaskListComponent`. Por definición, los componentes del contenedor no se pueden representar
simplemente de forma aislada; esperan que se les pase algún contexto o que se conecten a un servicio. Lo que esto
significa es que para renderizar un contenedor en Storybook, debemos simular (es decir, proporcionar una versión
simulada) del contexto o servicio que requiere.

Al colocar el `TaskListComponent` en Storybook, pudimos evitar este problema simplemente renderizando el
`PureTaskListComponent` y evitando el contenedor. Haremos algo similar, crearemos y renderizaremos el
`PureInboxScreen` en Storybook también.

Sin embargo, para el `PureInboxScreenComponent` tenemos un problema porque aunque el `PureInboxScreenComponent` en
sí mismo es presentacional, su hijo, el `TaskListComponent`, no lo es. En cierto sentido, el
"PureInboxScreenComponent" ha sido contaminado por "container-ness". Entonces, cuando configuramos nuestras
historias en `pure-inbox-screen.stories.ts`:

```ts:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

export default {
  component: PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
      declarations: [PureInboxScreenComponent],
      imports: [CommonModule, TaskModule],
    }),
  ],
  title: 'PureInboxScreen',
} as Meta;

const Template: Story<PureInboxScreenComponent> = args => ({
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

Vemos que nuestras historias están rotas ahora. Esto se debe al hecho de que ambos dependen de nuestro store y,
aunque estamos usando un componente "puro" para el error, ambas historias aún necesitan el contexto.

Una forma de evitar este problema es no representar nunca los componentes del contenedor en ninguna parte de su
aplicación, excepto en el nivel más alto y, en su lugar, pasar todos los requisitos de datos hacia abajo en la jerarquía de componentes.

Sin embargo, los desarrolladores inevitablemente **necesitarán** renderizar contenedores más abajo en la jerarquía
de componentes. Si queremos renderizar la mayor parte o la totalidad de la aplicación en Storybook (¡lo hacemos!).
Necesitamos una solución a este problema.

<div class="aside">
Aparte, pasar datos por la jerarquía es un enfoque legítimo, especialmente cuando se usa <a href="http://graphql.org/">GraphQL</a>. Así es como hemos construido <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a> junto a más de 800 historias.
</div>

## Proporcionar contexto con decoradores

¡La buena noticia es que es bastante sencillo suministrar el `Store` al`PureInboxScreenComponent` en una historia!
Podemos suministrar el "Store" proporcionado con un decorador:

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';

+ import { Store, NgxsModule } from '@ngxs/store';
+ import { TasksState } from '../state/task.state';

export default {
  title: 'PureInboxScreen',
  component:PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
-     imports: [CommonModule,TaskModule],
+     imports: [CommonModule,TaskModule,NgxsModule.forRoot([TasksState])],
+     providers: [Store],
    }),
  ],
} as Meta;

const Template: Story<PureInboxScreenComponent> = (args) => ({
  component: PureInboxScreenComponent,
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

Existen enfoques similares para proporcionar un contexto simulado para otras bibliotecas de datos, como [@ngrx](https://github.com/ngrx/platform) o [Apollo](https://www.apollographql.com/docs/angular/).

Recorrer los estados en Storybook facilita la comprobación de que lo hemos hecho correctamente:

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

Comenzamos desde abajo con `TaskComponent`, luego progresamos a`TaskListComponent`, ahora estamos aquí con una
interfaz de usuario de pantalla completa. Nuestro `InboxScreenComponent` acomoda un componente anidado e incluye
historias que lo acompañan.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) le permite expandir gradualmente la complejidad
a medida que asciende en la jerarquía de componentes. Entre los beneficios se encuentran un proceso de desarrollo
más enfocado y una mayor cobertura de todas las posibles permutaciones de UI. En resumen, CDD le ayuda a crear
interfaces de usuario más complejas y de mayor calidad.

Aún no hemos terminado; el trabajo no termina cuando se crea la interfaz de usuario. También debemos asegurarnos de
que siga siendo duradero en el tiempo.

<div class="aside">
💡 ¡No olvides confirmar tus cambios con git!
</div>
