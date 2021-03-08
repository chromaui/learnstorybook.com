---
title: 'Construção de um componente composto'
tocTitle: 'Componente composto'
description: 'Construção de um componente composto a partir de componentes simples'
---

No capitulo anterior, construímos o nosso primeiro componente, neste capitulo iremos estender o que foi dito até agora, para que possamos construir a nossa TaskListComponent, ou seja uma lista de TaskComponents. Vamos combinar componentes e ver o que irá acontecer quando é adicionada alguma complexidade.

## TasklistComponent

A Taskbox dá prioridade a tarefas que foram confirmadas através do seu posicionamento acima de quaisquer outras.
Isto gera duas variações da `TaskListComponent`, para o qual será necessária a criação de estórias:
os itens normais e itens normais e itens confirmados.

![tarefas confirmadas e padrão](/intro-to-storybook/tasklist-states-1.png)

Visto que os dados para a `TaskComponent` podem ser enviados de forma assíncrona, **irá ser** necessário um estado no componente para lidar com a ausência de qualquer tipo de conexão. E além deste um estado extra para lidar com a inexistência de tarefas.

![Tarefas vazias e carregamento](/intro-to-storybook/tasklist-states-2.png)

## Preparação

Um componente composto não é em nada diferente do componente básico contido dentro deste. Comece por criar um componente `TaskListComponent` e o ficheiro estória que o acompanha em:
`src/app/components/task-list.component.ts` e `src/app/components/task-list.stories.ts` respetivamente.

Comece por uma implementação em bruto da `TaskList`. Será necessário importar o componente `Task` criado anteriormente e injetar os atributos e as respetivas ações como inputs, assim como os eventos.

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

Em seguida iremos criar os estados de teste do `TaskList` no ficheiro de estórias respetivo.

```typescript
// src/app/components/task-list.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [TaskListComponent, TaskComponent],
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
  component: TaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
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
  component: TaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
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
          <app-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
```

<div class="aside">
    Os <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>decoradores</b></a>, oferecem uma forma para envolver arbitrariamente as estórias. Neste caso estamos a usar um decorador para adicionar alguns metadados necessários. Mas podem ser usados para adicionar outras formas de contexto aos componentes, tal como irá ser visto posteriormente.
</div>

Com a importação da `taskData` para este ficheiro, está a ser adicionada a forma que uma `Task` assume, isto a partir do ficheiro (ou arquivo) `task.stories.ts` criado anteriormente.
Como tal também a `actionsData` que irá definir quais as ações (através de uma callback simulada) que o componente `Task` se encontra á espera.

Estes também necessários á `TaskList`.

Pode agora verificar-se o Storybook com as estórias novas associadas á `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Definir os estados

O componente ainda se encontra num estado bruto, mas já temos uma ideia de quais são as estórias com que temos que trabalhar. Poderá estar a pensar que ao usar-se o `.list-items` no componente como invólucro é deveras simples. Mas tem razão, na maioria dos casos não iria ser criado um novo componente somente para adicionar um invólucro. A **verdadeira complexidade** do componente `TaskList` é revelada com os casos extremos `WithPinnedTasks`, `loading` e `empty`.

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <app-task
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>

      <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>

      <div *ngIf="loading">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
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

O markup adicional irá resultar no seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Repare na posição do item que está confirmado na lista. Pretende-se que este item seja renderizado no topo da lista e torná-lo uma prioridade aos utilizadores.

## Requisitos de dados

Á medida que o componente tem tendência em crescer, o mesmo irá acontecer com os seus requisitos. Defina os requisitos de dados de `TaskListComponent`, através do uso de TypeScript. Visto que `TaskComponent` é um componente filho, é necessário fornecer os dados estruturados corretamente de forma que possa ser renderizado sem problemas.
De forma a poupar tempo podemos reutilizar o modelo que foi definido anteriormente no ficheiro `task.model.ts`.

## Testes automatizados

No capítulo anterior, aprendemos a usar o Storyshots para efetuar testes snapshot nas estórias. Com o `TaskComponent` não existia muita complexidade para testar além do sucesso da renderização. Visto que o `TaskListComponent` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída, isto implementado de forma responsável para os testes automáticos. Para tal irão ser criados testes unitários utilizando [Jest](https://facebook.github.io/jest/) em conjunção com um renderizador de testes.

![Jest logo](/intro-to-storybook/logo-jest.png)

## Testes unitários com Jest

As estórias criadas com o Storybook em conjunção com os testes visuais manuais e testes de snapshot (tal como mencionado acima) irão prevenir em larga escala problemas futuros no interface de utilizador. Se as estórias definidas abrangerem uma ampla variedade de casos do componente e forem usadas ferramentas que garantam verificações por parte humana, irá resultar num decréscimo de erros.

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma framework de testes explicita acerca deste tipo de detalhes. O que nos leva aos testes unitários.

Neste caso pretende-se que o nosso `TaskListComponent` faça a renderização de quaisquer tarefas que foram confirmadas **antes** das não confirmadas que são fornecidas ao adereço (prop) `tasks`.
Apesar de existir uma estória (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o Jest, de forma que este renderize a estória na DOM e efetue pesquisas de forma a verificar o output.

Iremos começar por criar um ficheiro de testes denominado `task-list.component.spec.ts`. Neste ficheiro estarão contidos os testes que irão fazer asserções acerca do valor de saída.

```typescript
// src/app/components/task-list.component.spec.ts

import { render } from '@testing-library/angular';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './task-list.stories';
describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(TaskListComponent, {
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

![Execução de testes da TaskList](/intro-to-storybook/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar a lista de tarefas `withPinnedTasks` quer na estória, quer no teste unitário. Desta forma podemos continuar a aproveitar um recurso existente (os exemplos que representam configurações de um componente) de cada vez mais formas.

Mas também que este teste é algo frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `TaskComponent` seja alterada; isto quer pelo uso de uma classe com um nome diferente ou um elemento `textarea` ao invés de um `input`, por exemplo--com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para o interface de utilizador. Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/intro-to-storybook/angular/pt/test/)) sempre que for possível.
