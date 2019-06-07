---
title: "Construção de um componente siples"
tocTitle: "Componente simples"
description: "Construção de um componente simples isolado"
---

Iremos construir o interface de utilizador de acordo com a metodologia de [Desenvolvimento orientada a componentes](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), ou nativamente por (CDD, Component-Driven Development). É um processo que cria interfaces de utilizador a partir da base para o topo, iniciando com componentes e terminando com ecrãs. O DOC(CDD nativamente) ajuda no escalonamento da complexidade á qual o programador é sujeito á medida que constrói o interface de utilizador.

## Tarefa

![Componente Task ao longo de três estados](/task-states-learnstorybook.png)

`TaskComponent` é o componente nuclear da nossa aplicação. Cada tarefa é apresentada de forma diferente dependendo do estado em que se encontra.
O que vai ser apresentado é uma caixa de confirmação, selecionada (ou não), alguma informação adicional acerca da tarefa e um botão "fixador", que permite a movimentação para cima e para baixo das tarefas ao longo da lista.
Para que seja possível implementar isto serão necessárias os seguintes adereços (props):

- `title` - uma cadeia de caracteres que descreve a tarefa
- `state` - qual a lista em que a tarefa se encontra e se está confirmada?

Á medida que construimos a `TaskComponent`, é necessário definir os três estados que correspondem os três tipos de tarefa delineados acima.
Em seguida usa-se o Storybook para construir este componente isolado, usando dados predefinidos. Irá "testar-se visualmente" a aparência do componente para cada estado á medida que prosseguimos.

Este processo é algo similar ao [Desenvolvimento orientado a testes](https://en.wikipedia.org/wiki/Test-driven_development), ou como é conhecido nativamente (TDD), o que neste caso denominamos de "[DOT Visual](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”, nativamente (Visual TDD).

## Configuração Inicial

Primeiro irá ser criado o componente tarefa e o ficheiro de estórias que o acompanha:
`src/tasks/task.component.ts` e `src/tasks/task.stories.ts` respetivamente.

Iremos iniciar por uma implementação básica da `TaskComponent`, que recebe os valores de entrada conhecidos até agora, assim como as duas ações que podem ser desencadeadas (a movimentação entre listas):

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "task-item",
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `
})
export class TaskComponent implements OnInit {
  title: string;
  @Input() task: any;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

O bloco de código acima, quando renderizado, não é nada mais nada menos que a estrutura HTML da `TaskComponent` na aplicação Todos.

Em seguida irão ser criados os três testes ao estado da tarefa no ficheiro de estórias correspondente:

```typescript
import { storiesOf, moduleMetadata } from "@storybook/angular";
import { action } from "@storybook/addon-actions";

import { TaskComponent } from "./task.component";

export const task = {
  id: "1",
  title: "Test Task",
  state: "TASK_INBOX",
  updatedAt: new Date(2018, 0, 1, 9, 0)
};

export const actions = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

storiesOf("Task", module)
  .addDecorator(
    moduleMetadata({
      declarations: [TaskComponent]
    })
  )
  .add("default", () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task,
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask
      }
    };
  })
  .add("pinned", () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task: { ...task, state: "TASK_PINNED" },
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask
      }
    };
  })
  .add("archived", () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task: { ...task, state: "TASK_ARCHIVED" },
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask
      }
    };
  });
```

Existem dois tipos de organização com Storybook. O componente em si e as estórias associadas. É preferível pensar em cada estória como uma permutação de um componente. Como tal podem existir tantas estórias, tantas as que forem necessárias.

- **Component**
  - Story
  - Story
  - Story

Ao ser invocada a função `storiesOf()`, está a registar-se o componente, e com isto o processo de arranque do Storybook. É adicionado um nome, nome esse que será usado na barra lateral da aplicação Storybook para identificar o componente.

A função `action()` permite a criação de um callback, que irá surgir no painel adequado, ou seja o painel **actions** do interface de utilizador Storybook quando for feito o click. Como tal assim que for criado o botão para afixar tarefas, irá ser possível determinar o sucesso ou não do click no interface de utilizador de testes.

É extremamente conveniente agrupar todas as ações numa única variável denominada `actions`, dessa forma, esta variável pode ser exportada através da cláusula `export` e ser usada nas estórias que para um qualquer componente que vá reutilizar este, tal como irá ser visto posteriormente.

Para definir as estórias, invoca-se o metodo `add()`, uma única vez para cada um dos estados de teste, de forma a gerar uma estória. A estória ação é uma função que irá retornar um elemento renderizado( ou seja, uma classe de componente com um conjunto de adereços (props)) para um determinado estado.

Ao ser criada uma estória, é usada uma tarefa base (`task`) para definir a forma da tarefa em questão que é necessária ao componente. Geralmente modelada a partir de dados concretos. Mais uma vez o uso da cláusula `export`, neste caso para a estrutura dos dados irá permitir a sua reutilização em estórias futuras, tal como veremos.

<div class="aside">
    <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Ações</b></a> ajudam na verificação das interações quando são construídos componentes de interface de utilizador isolados. Na grande maioria das vezes não existirá qualquer tipo de acesso ao estado e funções definidas no contexto da aplicação. Como tal é preferível o uso de<code>action()</code> para esta situação.
</div>

## Configuração

Será necessária uma alteração minúscula ao ficheiro de configuração do Storybook (`storybook/config.js`) de forma que este reconheça os ficheiros com extensão `.stories.ts`, mas também utilize o ficheiro LESS.
Por norma o Storybook pesquisa numa pasta denominada `/stories` para conter as estórias; este tutorial usa uma nomenclatura similar a `.type.extension`, cuja qual favorecida quando se está a desenvolver uma aplicação Angular.

```typescript
import { configure } from "@storybook/angular";

import "../src/styles.less";

// automatically import all files ending in *.stories.ts
const req = require.context('../src/', true, /\.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

De forma a que seja possível o suporte ao conteúdo do ficheiro LESS definido acima, será necessário uma pequena modificação no webpack. Para tal será necessário criar um ficheiro denominado `webpack.config.js` dentro da pasta `.storybook` com o seguinte conteúdo:

```javascript
const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        loaders: ["style-loader", "css-loader", "less-loader"],
        include: path.resolve(__dirname, "../")
      }
    ]
  }
};
```

Assim como os loaders necessários terão que ser adicionados, através do seguinte comando:

```
yarn add -D less-loader css-loader style-loader
```

Assim que esta operação for concluída, ao reiniciar o servidor Storybook, deverá produzir os casos de teste que foram definidos para o componente TaskComponent:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construção dos estados

Neste momento já possuímos o Storybook configurado, os elementos de estilo importados, assim como os casos de teste, podemos agora iniciar a implementação HTML do componente de forma a igualar o design.

O componente neste momento ainda é bastante básico. Primeiro irá ser definido o código necessário para atingir o design definido, sem que se entre em grande detalhe:

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Task } from "./task.model";

@Component({
  selector: "task-item",
  template: `
    <div class="list-item {{ task?.state }}">
      <label class="checkbox">
        <input
          type="checkbox"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          disabled="true"
          name="checked"
        />
        <span class="checkbox-custom" (click)="onArchive(task.id)"></span>
      </label>
      <div class="title">
        <input
          type="text"
          [value]="task?.title"
          readonly="true"
          placeholder="Input title"
        />
      </div>

      <div class="actions">
        <a *ngIf="task?.state !== 'TASK_ARCHIVED'" (click)="onPin(task.id)">
          <span class="icon-star"></span>
        </a>
      </div>
    </div>
  `
})
export class TaskComponent implements OnInit {
  title: string;
  @Input() task: Task;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onPin(id) {
    this.onPinTask.emit(id);
  }

  onArchive(id) {
    this.onArchiveTask.emit(id);
  }
}
```

O markup adicional descrito acima, combinado com o CSS que foi importado anteriormente irá originar o seguinte interface de utilizador:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Especificação de requisitos de dados

É boa prática a especificação de qual a forma que os dados tomam para um componente. Não somente é auto documentável, mas ajuda a detectar problemas cedo. Neste caso através do uso de TypeScript, mas também através do uso de um interface para o modelo `Task`:

```typescript
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## Componente construido!

Foi construído com sucesso, sem ser necessário qualquer tipo de servidor, ou que seja necessário executar a aplicação frontend. O próximo passo é construir os restantes componentes da Taskbox um por um de forma similar.

Como se pode ver, começar a construir componentes isoladamente é fácil e rápido.
Com isto espera-se que seja possível construir um interface de utilizador de qualidade superior com um número de problemas menor e mais polido. Isto devido ao facto que é possível aprofundar e testar qualquer estado possível.

## Testes automatizados

O Storybook oferece uma forma fantástica de testar visualmente a aplicação durante o desenvolvimento. As "estórias" irão garantir que a tarefa não seja visualmente destruída á medida que a aplicação continua a ser desenvolvida. Mas no entanto continua a ser um processo manual neste momento e alguém terá que fazer o esforço de clickar em cada estado de teste de forma a garantir que irá renderizar sem qualquer tipo de problemas. Não poderíamos automatizar isto?

### Testes de snapshot

Este tipo de testes refere-se á pratica de guardar o output considerado "bom" de um determinado componente com base num input e marcar o componente caso o output seja alterado. Isto complementa o Storybook, visto que é uma forma rápida de se visualizar a nova versão de um componente e verificar as alterações.

<div class="aside">
  É necessário garantir que os componentes renderizam dados que não serão alterados, de forma a garantir que os testes snapshot não falhem sempre. É necessário ter atenção a datas ou valores gerados aleatoriamente.
</div>

Com o [extra Storyshots](https://github.com/storybooks/storybook/tree/master/addons/storyshots) é criado um teste de snapshot para cada uma das estórias. Para que este possa ser usado, adiciona-se a dependência de desenvolvimento:

```bash
yarn add -D @storybook/addon-storyshots identity-object-proxy jest jest-preset-angular
```

Em seguida é criado o ficheiro `src/storybook.test.ts` com o conteúdo:

```typescript
import * as path from "path";
import initStoryshots, {
  multiSnapshotWithOptions
} from "@storybook/addon-storyshots";

initStoryshots({
  framework: "angular",
  configPath: path.join(__dirname, "../.storybook"),
  test: multiSnapshotWithOptions()
});
```

Quando este processo estiver concluído, será necessário criar uma pasta denominada `jest-config` dentro da pasta `src`, com dois ficheiros dentro desta, `globalMocks.ts` com o conteúdo:

```typescript
const mock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ""),
    removeItem: key => delete storage[key],
    clear: () => (storage = {})
  };
};

Object.defineProperty(window, "localStorage", { value: mock() });
Object.defineProperty(window, "sessionStorage", { value: mock() });
Object.defineProperty(window, "getComputedStyle", {
  value: () => ["-webkit-appearance"]
});
```

e o ficheiro `setup.ts`, com o seguinte conteúdo:

```typescript
import "jest-preset-angular";
import "./globalMocks";
```

Em seguida será necessário adicionar um novo campo ao ficheiro`package.json`,

```json
"jest": {
    "coveragePathIgnorePatterns": [
      "/jest-config/",
      "/node_modules/"
    ],
    "preset": "jest-preset-angular",
    "setupTestFrameworkScriptFile": "<rootDir>/src/jest-config/setup.ts",
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-preset-angular/AngularSnapshotSerializer.js",
      "<rootDir>/node_modules/jest-preset-angular/HTMLCommentSerializer.js"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/build/",
      "/storybook-static/"
    ],
    "transform": {
      "^.+\\.(ts|js|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js"
    },
    "moduleNameMapper": {
      "\\.(css|less)$": "identity-obj-proxy"
    }
  },
```

Além disto, serão necessários alguns scripts novos para que o `jest` possa ser executado:

```json
  "scripts": {
    ...
    "jest": "jest",
    "jest:watch": "jest --watch"
  }
```

E finalmente, atualizar os ficheiro `src/tsconfig.app.json`, de forma que este exclua os ficheiros com extensão `.test.ts`

```json
"exclude": [
    "src/test.ts",
    "**/*.stories.ts",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
```

Assim que os passos descritos acima estiverem concluídos, poderá ser executado `yarn test` e constatar o seguinte output:

![Execução testes da Tarefa](/task-testrunner.png)

Com isto encontra-se agora á disposição um teste snapshot para cada uma das estórias `TaskComponent`. Se a implementação da `TaskComponent` for alterada, será apresentada uma notificação.

Adicionalmente, o `jest` irá executar também testes para `app.component.ts`
