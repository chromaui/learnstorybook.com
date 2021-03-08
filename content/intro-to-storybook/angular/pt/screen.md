---
title: 'Construção de um ecrã'
tocTitle: 'Ecrãs'
description: 'Construção de um ecrã a partir de componentes'
---

Tem sido focada a construção de interfaces de utilizador da base para o topo.
Começando de forma simples e sendo adicionada complexidade á medida que a aplicação é desenvolvida. Com isto permitiu que cada componente fosse desenvolvido de forma isolada, definindo quais os requisitos de dados e "brincar" com ele em Storybook. Isto tudo sem a necessidade de instanciar um servidor ou ser necessária a construção de ecrãs!

Neste capitulo, irá ser acrescida um pouco mais a sofisticação, através da composição de diversos componentes, originando um ecrã, que será desenvolvido no Storybook.

## Componentes contentores

Visto que a aplicação é deveras simples, o ecrã a ser construído é bastante trivial, simplesmente envolvendo o componente `TaskListComponent` (que fornece os seus dados via ngxs), a um qualquer layout e extraindo o campo de topo `erro` oriundo do loja (assumindo que este irá ser definido caso exista algum problema na ligação ao servidor).

Vamos começar por atualizar a nossa loja (no ficheiro (ou arquivo) `src/app/state/task.state.ts`) para incluir o campo de erro que pretendemos:

```typescript
// src/app/state/task.state.ts

import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // defines the new error field we need
  ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
// the class definition for our error field
export class AppError {
  static readonly type = actions.ERROR;
  constructor(public payload: boolean) {}
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
  error: boolean;
}

// sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
    error: false,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel) {
    const { error } = state;
    return error;
  }
  //
  // triggers the PinTask action, similar to redux
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
  // triggers the PinTask action, similar to redux
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

  // function to handle how the state should be updated when the action is triggered
  @Action(AppError)
  setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError) {
    const state = getState();
    patchState({
      error: !state.error,
    });
  }
}
```

Já temos a loja atualizada com o novo campo. Vamos criar um novo ficheiro (ou arquivo) chamado `pure-inbox-screen.component.ts` no interior da pasta (ou diretório) `src/app/components`:

```typescript
// src/app/components/pure-inbox-screen.component.ts

import { Component, OnInit, Input } from '@angular/core';

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
export class PureInboxScreenComponent implements OnInit {
  @Input() error: any;

  constructor() {}

  ngOnInit() {}
}
```

Em seguida podemos criar o contentor, que tal como anteriormente, obtém os dados oriundos da loja para o componente `PureInboxScreenComponent`. Num novo ficheiro (ou arquivo) chamado `inbox-screen.component.ts`:

```typescript
// src/app/components/inbox-screen.component.ts

import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { TasksState } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Select(TasksState.getError) error$: Observable<any>;

  constructor() {}

  ngOnInit() {}
}
```

Vai ser necessário alterar o componente `AppComponent` de forma a ser possível renderizar o `InboxScreenComponent` (eventualmente iria ser usado um roteador para escolher o ecrã apropriado, mas não é necessário preocupar-nos com isto agora):

```typescript
//src/app/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-inbox-screen></app-inbox-screen>
  `,
})
export class AppComponent {
  title = 'taskbox';
}
```

E com isto uma última alteração, esta no ficheiro (ou arquivo) `app.module.ts`:

```typescript
//src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';
import { InboxScreenComponent } from './components/inbox-screen.component';
import { PureInboxScreenComponent } from './components/pure-inbox-screen.component';

@NgModule({
  declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
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

<div class="aside"><p>Não se esqueça de atualizar o ficheiro (ou arquivo) <code>src/app/app.component.spec.ts</code>. Ou na próxima vez que executar os testes, estes irão falhar.</p></div>

No entanto as coisas irão tornar-se interessantes ao renderizar-se a estória no Storybook.

Tal como visto anteriormente, o componente `TaskListComponent` é um **contentor** que renderiza o componente de apresentação `PureTaskListComponent`. Por definição estes componentes, os componentes contentor não podem ser renderizados de forma isolada, estes encontram-se "á espera" de um determinado contexto ou ligação a serviço. O que isto significa, é que para ser feita a renderização de um contentor no Storybook, é necessário simular o contexto ou serviço necessário (ou seja, providenciar uma versão fingida).

Ao colocar-se a `TaskListComponent` no Storybook, foi possível fugir a este problema através da renderização do `PureTaskListComponent` e com isto evitando o contentor por completo.
Irá ser feito algo similar para o `PureInboxScreen` no Storybook também.

No entanto para o `PureInboxScreenComponent` existe um problema, isto porque apesar deste ser de apresentação, o seu "filho", ou seja a `TaskListComponent` não o é. De certa forma o `PureInboxScreenComponent` foi poluído pelo "container-ness". Com isto as estórias no ficheiro `inbox-screen.stories.ts` terão que ser definidas da seguinte forma:

```typescript
// src/app/components/pure-inbox-screen.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';
export default {
  title: 'PureInboxScreen',
  decorators: [
    moduleMetadata({
      imports: [TaskModule],
    }),
  ],
};
// inbox screen default state
export const Default = () => ({
  component: PureInboxScreenComponent,
});

// inbox screen error state
export const error = () => ({
  component: PureInboxScreenComponent,
  props: {
    error: true,
  },
});
```

Pode verificar-se agora existem problemas com as estórias. Isto deve-se ao facto que ambas dependem da loja e apesar de se estar a usar um componente "puro" para o estado erro, ambas ainda precisam do contexto.

Uma forma de evitar este tipo de situações, consiste em evitar por completo a renderização de componentes contentor em qualquer lado na aplicação com a exceção do mais alto nível e injetar os dados ao longo da hierarquia de componentes.

No entanto, algum programador **irá querer** renderizar contentores num nível mais baixo na hierarquia de componentes. Já que pretendemos renderizar a maioria da aplicação no Storybook (sim queremos!), é necessária uma solução para esta situação.

<div class="aside">
    Como aparte, a transmissão de dados ao longo da hierarquia é uma abordagem legitima, particularmente quando é utilizado <a href="http://graphql.org/">GraphQL</a>. Foi desta forma que foi construido o <a href="https://www.chromatic.com">Chromatic</a>, juntamente com mais de 800 estórias.
</div>

## Fornecer contexto ás estórias

As boas notícias é que é extremamente fácil injetar a loja ao `PureInboxScreenComponent` numa estória! Podemos instanciar uma nova instância da loja e fornecê-la como contexto da estória através de um decorador.

```typescript
// src/app/components/pure-inbox-screen.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState } from '../state/task.state';
export default {
  title: 'PureInboxScreen',
  decorators: [
    moduleMetadata({
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  ],
};
// inbox screen default state
export const Default = () => ({
  component: PureInboxScreenComponent,
});

// inbox screen error state
export const error = () => ({
  component: PureInboxScreenComponent,
  props: {
    error: true,
  },
});
```

Existem abordagens semelhantes de forma a fornecer contextos simulados para outras bibliotecas, tais como por exemplo [@ngrx](https://github.com/ngrx/platform) ou [Apollo](https://www.apollographql.com/docs/angular/).

A iteração de estados no Storybook faz com que seja bastante fácil testar, se for feito corretamente:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Desenvolvimento orientado a Componentes

Começou-se do fundo com `TaskComponent`, prosseguindo para `TaskListComponent` e agora chegou-se ao ecrã geral do interface de utilizador. O `InboxScreenComponent`, acomoda um componente contentor que foi adicionado e inclui também estórias que o acompanham.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Desenvolvimento Orientado a Componentes**](https://www.componentdriven.org/) permite a expansão gradual da complexidade á medida que se prossegue de forma ascendente na hierarquia de componentes. Dos benefícios ao utilizar-se esta abordagem, estão o processo de desenvolvimento focado e cobertura adicional das permutações possíveis do interface de utilizador.
Resumidamente esta abordagem ajuda na produção de interfaces de utilizador de uma qualidade extrema e assim como complexidade.

Ainda não finalizamos, o trabalho não acaba quando o interface de utilizador estiver construído. É necessário garantir que resiste ao teste do tempo.
