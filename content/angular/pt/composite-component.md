---
title: "Construção de um componente composto"
tocTitle: "Componente composto"
description: "Construção de um componente composto a partir de componentes simples"
---

No capitulo anterior, construímos o nosso primeiro componente, neste capitulo iremos estender o que foi dito até agora, para que possamos construir a nossa TaskListComponent, ou seja uma lista de TaskComponents. Vamos combinar componentes e ver o que irá acontecer quando é adicionada alguma complexidade.

## TasklistComponent

A Taskbox dá prioridade a tarefas que foram confirmadas através do seu posicionamento acima de quaisquer outras.
Isto gera duas variações da `TaskListComponent`, para o qual será necessária a criação de estórias:
os itens normais e itens normais e itens confirmados.

![tarefas confirmadas e padrão](/tasklist-states-1.png)

Visto que os dados para a `TaskComponent` podem ser enviados de forma assíncrona, **irá ser** necessário um estado no componente para lidar com a ausência de qualquer tipo de conexão. E além deste um estado extra para lidar com a inexistência de tarefas.

![Tarefas vazias e carregamento](/tasklist-states-2.png)

## Preparação

Um componente composto não é em nada diferente do componente básico contido dentro deste. Comece por criar um componente `TaskListComponent` e o ficheiro estória que o acompanha em:
`src/tasks/task-list.component.ts` e `src/tasks/task-list.stories.ts` respetivamente.

Comece por uma implementação em bruto da `TaskListComponent`. Será necessário importar o componente `TaskComponent` criado anteriormente e injetar os atributos e as respetivas ações como inputs, assim como os eventos.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Task } from "./task.model";

@Component({
  selector: "task-list",
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
  `
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

Em seguida iremos criar os estados de teste do `TaskList` no ficheiro de estórias respetivo.

```typescript
import { storiesOf, moduleMetadata } from "@storybook/angular";
import { CommonModule } from "@angular/common";

import { TaskComponent } from "./task.component";
import { TaskListComponent } from "./task-list.component";
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
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule]
    })
  )
  .add("default", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props
    };
  })
  .add("withPinnedTasks", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
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
          <task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props
    };
  })
  .add("empty", () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props
    };
  });
```

A função `addDecorator()` permite que seja adicionado algum "contexto" á renderização de cada tarefa. Neste caso adicionam-se os metadados do módulo de forma a ser possível o uso de todos os componentes Angular dentro das estórias.

<div class="aside">
    Os <a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decoradores</b></a>, oferecem uma forma de embrulho arbitrária ás estórias. Neste caso estamos a usar um decorador para adicionar metadados.
</div>

O elemento `task` irá definir a forma da `Task` que foi criada e exportada a partir do ficheiro `task.stories.ts`. E como tal, as `actions` irão definir quais as ações (através de uma callback simulada) que o componente `TaskComponent` se encontra á espera. Cujas quais também necessárias á `TaskListComponent`.

Pode agora verificar-se o Storybook com as estórias novas associadas á `Tasklist`.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Definir os estados

O componente ainda se encontra num estado bruto, mas temos já uma ideia de quais são as estórias com que temos que trabalhar. Poderá estar a pensar que o embrulho `.list-items` é deveras simples. Mas tem razão, na maioria dos casos não iria ser criado um novo componente somente para adicionar um embrulho. A **verdadeira complexidade** do componente `TaskListComponent` é revelada com os casos extremos `withPinnedTasks`, `loading` e `empty`.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Task } from "./task.model";

@Component({
  selector: "task-list",
  template: `
    <div class="list-items">
      <task-item
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </task-item>

      <div
        *ngIf="tasksInOrder.length === 0 && !loading"
        class="wrapper-message"
      >
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>

      <div *ngIf="loading">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text">
            <span>Loading</span> <span>cool</span> <span>state</span>
          </span>
        </div>
      </div>
    </div>
  `
})
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading: boolean = false;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  @Input()
  set tasks(arr: Task[]) {
    this.tasksInOrder = [
      ...arr.filter(t => t.state === "TASK_PINNED"),
      ...arr.filter(t => t.state !== "TASK_PINNED")
    ];
  }

  constructor() {}

  ngOnInit() {}
}
```

O markup adicional irá resultar no seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Reparem na posição do item confirmado na lista. Pretende-se que este item seja renderizado no topo da lista e torná-lo uma prioridade aos utilizadores.

## Requisitos de dados

Á medida que o componente tem tendência em crescer, o mesmo irá acontecer com os seus requisitos. Defina os requisitos de dados de `TaskListComponent`, através do uso de TypeScript. Visto que `TaskComponent` é um componente filho, é necessário fornecer os dados estruturados correctamente de forma que possa ser renderizado correctamente.
De forma a poupar tempo podemos reutilizar o modelo que foi definido anteriormente no ficheiro `task.model.ts`.

## Testes automatizados

No capitulo anterior, aprendeu-se a usar o Storyshots para implementar estórias de testes snapshot. Com o componente `TaskComponent` não existia muita complexidade para testar além do sucesso da renderização. Visto que o componente `TaskListComponent` adiciona uma camada extra de complexidade, pretende-se verificar que determinados valores de entrada produzam determinados valores de saída, isto implementado de forma responsável para os testes automáticos. Para tal irão ser criados testes unitários utilizando [Jest](https://facebook.github.io/jest/) em conjunção com um renderizador de testes.

![Jest logo](/logo-jest.png)

## Testes unitários com Jest

As estórias criadas com o Storybook em conjunção com os testes visuais manuais e testes de snapshot (tal como mencionado acima) irão prevenir em larga escala problemas futuros no interface de utilizador. Se as estórias definidas abrangerem uma ampla variedade de casos do componente e forem usadas ferramentas que garantam verificações por parte humana, irá resultar num decréscimo de erros.

No entanto, por vezes o diabo encontra-se nos detalhes. É necessária uma framework de testes explicita acerca deste tipo de detalhes. O que nos leva aos testes unitários.

Neste caso pretende-se que o nosso `TaskListComponent` faça a renderização de quaisquer tarefas que foram confirmadas **antes** das não confirmadas que são fornecidas ao adereço (prop) `tasks`.
Apesar de existir uma estória (`withPinnedTasks`) que testa este cenário em particular; este poderá levar a alguma ambiguidade da parte humana, ou seja se o componente **parar** de ordenar as tarefas desta forma, logo existe um problema. Mas ao olho destreinado não irá gritar **"Erro!"**.

De forma a evitar este problema em concreto, podemos usar o Jest, de forma que este renderize a estória na DOM e efetue pesquisas de forma a verificar o output.

Iremos começar por criar um ficheiro de testes denominado `task-list.component.spec.ts`. Neste ficheiro estarão contidos os testes que irão fazer asserções acerca do valor de saída.

```typescript
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { TaskListComponent } from "./task-list.component";
import { TaskComponent } from "./task.component";

import { withPinnedTasks } from "./task-list.stories";
import { By } from "@angular/platform-browser";

describe("TaskList component", () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TaskComponent, TaskListComponent]
    }).compileComponents();
  }));

  it("renders pinned tasks at the start of the list", () => {
    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    component.tasks = withPinnedTasks;

    fixture.detectChanges();
    const lastTaskInput = fixture.debugElement.query(
      By.css(".list-item:nth-child(1)")
    );

    // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
    expect(lastTaskInput.nativeElement.id).toEqual("6");
  });
});
```

![Execução de testes da TaskList](/tasklist-testrunner.png)

Podemos verificar que foi possível reutilizar a lista de tarefas `withPinnedTasks` quer na estória, quer no teste unitário. Desta forma podemos continuar a aproveitar um recurso existente (os exemplos que representam configurações de um componente) de cada vez mais formas.

Mas também que este teste é algo frágil. É possível que á medida que o projeto amadurece, a implementação concreta do componente `TaskComponent` seja alterada; isto quer pelo uso de uma classe com um nome diferente ou um elemento `textarea` ao invés de um `input`, por exemplo--com isto, este teste específico irá falhar e será necessária uma atualização. Isto não é necessariamente um problema, mas um indicador para ser cuidadoso no uso liberal de testes unitários para o interface de utilizador. Visto que não são de fácil manutenção. Ao invés deste tipo de testes, é preferível depender de testes visuais, snapshot ou de regressão visual (ver [capitulo de testes](/angular/pt/test/)) sempre que for possível.
