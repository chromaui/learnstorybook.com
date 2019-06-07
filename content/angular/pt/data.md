---
title: "Ligação de dados"
tocTitle: "Dados"
description: "Aprendizagem da metodologia de ligação de dados ao componente interface utilizador"
---

Até agora foram criados componentes sem estado e isolados, o que é fantástico para Storybook, mas em última análise não são úteis até que for fornecido algum tipo de dados da aplicação

Este tutorial não foca particularmente na construção de uma aplicação, como tal não vamos aprofundar muito este aspeto. Mas será feito um aparte para olhar para um padrão comum para ligação de dados com componentes contentor.

## Componentes contentor

O componente `TaskListComponent` na sua presente forma é um componente de "apresentação" (ver [este post no blog](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)), de forma que este não comunica com nada externo além de si.
Para conter dados, irá ser necessário um "contentor".

Este exemplo utiliza [ngxs](https://ngxs.gitbook.io/ngxs/), que é a biblioteca que adopta os principios Redux/ngrx, mas foca-se na redução de código denominado padão e oferece uma forma considerada mais _angular-y_ para a gestão do estado, de forma a construir um modelo de dados simples para a aplicação. No entanto o padrão que irá ser usado, pode ser aplicado a outras bibliotecas de gestão de dados tal como [ngrx/store](https://github.com/ngrx/platform).

Irá começar por uma ligeira refactorização da aplicação, será necessário criar duas novas pastas: `containers` e `components` respectivamente. Após isto, irão ser movidos os ficheiros `task.component.ts` and `task-list.component.ts`, (assim como os ficheiros de estórias `.stories.ts` correspondentes) para dentro desta última. Com isto, será necessário atualizar todas e quaisquer referências enumeradas pela cláusula import.

Em seguida irá ser construido um contentor de estados simples que irá responder de acordo a qualquer ação que altere o estado das tarefas, isto num ficheiro denominado `src/tasks/state/task.state.ts` (que é mantido de forma simples intencionalmente):

```typescript
import { State, Selector, Action, StateContext } from "@ngxs/store";
import { Task } from "../task.model";

export const actions = {
  ARCHIVE_TASK: "ARCHIVE_TASK",
  PIN_TASK: "PIN_TASK"
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}

// O estado inicial da loja quando a aplicação é inicializada
// Por norma este valor iria ser obtido do servidor
const defaultTasks = {
  1: { id: "1", title: "Something", state: "TASK_INBOX" },
  2: { id: "2", title: "Something more", state: "TASK_INBOX" },
  3: { id: "3", title: "Something else", state: "TASK_INBOX" },
  4: { id: "4", title: "Something again", state: "TASK_INBOX" }
};

export class TaskStateModel {
  entities: { [id: number]: Task };
}

@State<TaskStateModel>({
  name: "tasks",
  defaults: {
    entities: defaultTasks
  }
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
    { payload }: PinTask
  ) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: "TASK_PINNED" }
    };

    patchState({
      entities
    });
  }

  @Action(ArchiveTask)
  archiveTask(
    { patchState, getState }: StateContext<TaskStateModel>,
    { payload }: ArchiveTask
  ) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: "TASK_ARCHIVED" }
    };

    patchState({
      entities
    });
  }
}
```

Após isto, será necessário ligar o `NgxsModule` aos seguintes elementos do Angular. Primeiro o `src/tasks/task.module.ts`

```typescript
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxsModule } from "@ngxs/store";

import { TaskComponent } from "./task.component";
import { TaskListComponent } from "./task-list.component";
import { TasksState } from "./state/task.state";

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent],
  providers: []
})
export class TaskModule {}
```

e em seguida o `src/app.module.ts`

```typescript
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { TaskModule } from "./tasks/task.module";
import { NgxsModule } from "@ngxs/store";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TaskModule, NgxsModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

Agora o componente `TaskListComponent` pode ser convertido num contentor, o que faz com que este irá receber as tarefas da loja que foi recentemente criada. De forma a conseguir isto, será necessária a criação do novo `src/tasks/containers/task-list.component.ts` e adicionar o bloco de código seguinte:

```typescript
import { Component, OnInit, Input } from "@angular/core";
import { Select, Store } from "@ngxs/store";
import { TasksState, ArchiveTask, PinTask } from "../state/task.state";
import { Task } from "../task.model";
import { Observable } from "rxjs";

@Component({
  selector: "task-list",
  template: `
    <pure-task-list
      [tasks]="tasks$ | async"
      (onArchiveTask)="archiveTask($event)"
      (onPinTask)="pinTask($event)"
    ></pure-task-list>
  `
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

É de notar que o ficheiro antigo `TaskListComponent` residente em `src/tasks/components/task-list.component.ts` foi renomeado para `src/tasks/components/pure-task-list.component.ts`, mas também alterado o seu `selector` de `task-list` para `pure-task-list` e o nome da classe de `TaskListComponent` para `PureTaskListComponent`. Todas estas alterações foram feitas para proporcionar um sentido de clareza: existe agora um componente puro que recebe uma lista de tarefas, alguns eventos e efetua a renderização de um resultado, assim como um componente contentor que depende da loja para obter os dados necessários, que são fornecidos ao componente puro. Não esquecer de renomear o ficheiro `task-list.stories.ts` também.

Nesta altura os testes com Storybook terão deixado de funcionar, visto que `TaskListComponent` é agora um contentor e como tal não está á espera de receber qualquer tipo de adereços (props), ao invés disso conecta-se á loja e define os adereços (props) para o componente `PureTaskListComponent` que está a envolver.

No entanto este problema pode ser resolvido com relativa facilidade, ao renderizar-se o componente de apresentação `PureTaskListComponent` nas estórias do Storybook:

```typescript
import { storiesOf, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { TaskComponent } from "./task.component";
import { PureTaskListComponent } from "./pure-task-list.component";
import { task, actions } from "./task.stories";

export const defaultTasks = [
  { ...task, id: "1", title: "Task 1" },
  { ...task, id: "2", title: "Task 2" },
  { ...task, id: "3", title: "Task 3" },
  { ...task, id: "4", title: "Task 4" },
  { ...task, id: "5", title: "Task 5" },
  { ...task, id: "6", title: "Task 6" }
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" }
];

const props = {
  tasks: defaultTasks,
  onPinTask: actions.onPinTask,
  onArchiveTask: actions.onArchiveTask
};

storiesOf("TaskList", module)
  .addDecorator(
    moduleMetadata({
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule]
    })
  )
  .add("default", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props
    };
  })
  .add("withPinnedTasks", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props: {
        ...props,
        tasks: withPinnedTasks
      }
    };
  })
  .add("loading", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props
    };
  })
  .add("empty", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props
    };
  });
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarmente, será usado o `PureTaskListComponent` nos testes com Jest:

```typescript
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { PureTaskListComponent } from "./pure-task-list.component";
import { TaskComponent } from "./task.component";

import { withPinnedTasks } from "./pure-task-list.stories";
import { By } from "@angular/platform-browser";

describe("TaskList component", () => {
  let component: PureTaskListComponent;
  let fixture: ComponentFixture<PureTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent, PureTaskListComponent]
    }).compileComponents();
  }));

  it("renders pinned tasks at the start of the list", () => {
    fixture = TestBed.createComponent(PureTaskListComponent);
    component = fixture.componentInstance;
    component.tasks = withPinnedTasks;

    fixture.detectChanges();
    const lastTaskInput = fixture.debugElement.query(
      By.css(".list-item:nth-child(1)")
    );
    // Pretende-se que a tarefa denominada "Task 6 (pinned), seja renderizada em primeiro lugar não no fim
    expect(lastTaskInput.nativeElement.id).toEqual("6");
  });
});
```
