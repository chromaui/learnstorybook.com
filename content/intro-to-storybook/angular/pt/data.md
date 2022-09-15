---
title: 'Ligação de dados'
tocTitle: 'Dados'
description: 'Aprenda a efetuar a ligação de dados ao seu componente de interface de utilizador'
---

Até agora foram criados componentes sem estado e isolados, o que é fantástico para Storybook, mas em última análise não são úteis até que for fornecido algum tipo de dados da aplicação

Este tutorial não foca particularmente na construção de uma aplicação, como tal não vamos aprofundar muito este aspeto. Mas será feito um aparte para olhar para um padrão comum para ligação de dados com componentes contentor.

## Componentes contentor

O componente `TaskList` na sua presente forma é um componente de "apresentação" (ver [este post no blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), de forma que este não comunica com nada externo além de si.
Para conter dados, irá ser necessário um "contentor".

Este exemplo utiliza [ngxs](https://ngxs.gitbook.io/ngxs/), que é a biblioteca que adota os princípios Redux/ngrx, mas foca-se na redução de código denominado padrão e oferece uma forma considerada mais _angular-y_ para a gestão do estado, de forma a construir um modelo de dados simples para a aplicação. No entanto o padrão que irá ser usado, pode ser aplicado a outras bibliotecas de gestão de dados tal como [ngrx/store](https://github.com/ngrx/platform) ou [Apollo](https://www.apollographql.com/docs/angular/).

Vamos começar por instalar o ngxs através do comando:

```shell
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

Em seguida vamos implementar uma loja considerada padrão, que irá reagir ao desencadear de ações que alteram o estado das tarefas. Num ficheiro (ou arquivo) `src/app/state/task.state.ts` (esta irá manter-se simples intencionalmente)adicione o seguinte:

```ts:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
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

// sets the default state
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
  // triggers the archiveTask action, similar to redux
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

Já temos a nossa loja definida, mas precisamos de efetuar algumas alterações antes de a podermos ligar à nossa aplicação.

Vamos atualizar o nosso `TaskListComponent` para obter dados da nossa loja, mas primeiro vamos mover a versão existente para um novo ficheiro (ou arquivo) chamado `pure-task-list.component.ts` (e renomeando o elemento `selector` para `app-pure-task-list`) que será posteriormente envolvido num contentor.

No ficheiro (ou arquivo) `src/app/components/pure-task-list.component.ts` adicione o seguinte:

```ts:title=src/app/components/pure-task-list.component.ts
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-pure-task-list',
  // same content as before with the task-list.component.ts
})
export class PureTaskListComponent implements OnInit {
  // same content as before with the task-list.component.ts
}
```

Em seguida alteramos o conteúdo do ficheiro (ou arquivo) `src/app/components/task-list.component.ts` para o seguinte:

```ts:title=src/app/components/task-list.component.ts
import { Component, OnInit } from '@angular/core';
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
export class TaskListComponent implements OnInit {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Vamos criar agora um módulo em angular para efetuar a ponte entre os componentes e a loja.

Crie novo ficheiro (ou arquivo) chamado `task.module.ts` dentro da pasta (ou diretório) `components` e adicione o seguinte:

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

Temos as peças todas no seu lugar, ficando somente a faltar ligar a loja à aplicação. Para isto, no módulo de topo (`src/app/app.module.ts`):

```ts:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
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

A razão porque irá ser mantida a versão de apresentação do TaskList em separado, não é nada mais nada menos pelo facto que é mais fácil para testar e isolar. Visto que não depende da existência de uma loja, logo torna-se mais fácil de lidar do ponto de vista de testes. O ficheiro de estórias `src/app/components/task-list.stories.ts` vai ser renomeado para `src/app/components/pure-task-list.stories.ts`, com isto garantimos que as nossas estórias usam a versão de apresentação:

```ts:title=src/app/components/pure-task-list.stories.ts
import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'PureTaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  ],
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];
// default TaskList state
export const Default = () => ({
  component: PureTaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
  </div>
`,
  props: {
    tasks: defaultTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  component: PureTaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
    </div>
  `,
  props: {
    tasks: withPinnedTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist in loading state
export const Loading = () => ({
  template: `
        <div style="padding: 3rem">
          <app-pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarmente, será usado o `PureTaskListComponent` nos testes com Jest.

```ts:title=src/app/components/pure-task-list.component.spec.ts
import { render } from '@testing-library/angular';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './pure-task-list.stories';
describe('PureTaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(PureTaskListComponent, {
      declarations: [TaskComponent],
      componentProperties: {
        tasks: withPinnedTasksData,
        loading: false,
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

<div class="aside">Se os testes snapshot falharem, deverá ter que atualizar os snapshots existentes, executando o comando de testes de novo com a flag -u. Ou criar um novo script para lidar esta situação.</div>
