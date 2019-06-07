---
title: "Construção de um ecrã"
tocTitle: "Ecrãs"
description: "Construção de um ecrã a partir de componentes"
---

Tem sido focada a construção de interfaces de utilizador da base para o topo.
Começando de forma simples e sendo adicionada complexidade á medida que a aplicação é desenvolvida. Com isto permitiu que cada componente fosse desenvolvido de forma isolada, definindo quais os requisitos de dados e "brincar" com ele em Storybook. Isto tudo sem a necessidade de instanciar um servidor ou ser necessária a construção de ecrãs!

Neste capitulo, irá ser acrescida um pouco mais a sofisticação, através da composição de diversos componentes, originando um ecrã, que será desenvolvido no Storybook.

## Componentes contentores

Visto que a aplicação é deveras simples, o ecrã a ser construído é bastante trivial, simplesmente envolvendo o componente `TaskListComponent` (que fornece os seus dados via ngxs), a um qualquer layout e extraindo o campo de topo `erro` oriundo do loja(assumindo que este irá ser definido caso exista algum problema na ligação ao servidor). Dentro da pasta `src/tasks/containers` vai ser adicionado o ficheiro `inbox-screen.component.ts`:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'inbox-screen',
  template: `
    <pure-inbox-screen [error]="error$ | async"></pure-inbox-screen>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Select(TasksState.getError) error$: Observable<any>;

  constructor() {}

  ngOnInit() {}
}
```
Em seguida vai ser necessária a criação do componente `PureInboxScreenComponent` dentro da pasta `src/tasks/components` com o seguinte código:

```typescript
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pure-inbox-screen',
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
      <task-list></task-list>
    </div>
  `,
})
export class PureInboxScreenComponent implements OnInit {
  @Input() error: any;

  constructor() {}

  ngOnInit() {}
}
```

Vai ser necessário alterar o `AppComponent` de forma a ser possível renderizar o `InboxScreenComponent` (eventualmente iria ser usado um roteador para escolher o ecrã apropriado, mas não e necessário preocupar-se com isso agora):

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <inbox-screen></inbox-screen>
  `,
})
export class AppComponent {
  title = 'app';
}
```

No entanto as coisas irão tornar-se interessantes ao renderizar-se a estória no Storybook.

Tal como visto anteriormente, o componente `TaskListComponent` é um **contentor** que renderiza o componente de apresentação `PureTaskListComponent`. Por definição estes componentes, os componentes contentor não podem ser renderizados de forma isolada, estes encontram-se "á espera" de um determinado contexto ou ligação a serviço. O que isto significa, é que para ser feita a renderização de um contentor em Storybook, é necessário simular o contexto ou serviço necessário(ou seja, providenciar uma versão fingida).

Ao colocar-se a `TaskListComponent` no Storybook, foi possível fugir a este problema através da renderização do `PureTaskListComponent` e com isto evitando o contentor por completo.
Irá ser feito algo similar para o `PureInboxScreen` no Storybook também.

No entanto para o `PureInboxScreenComponent` existe um problema, isto porque apesar deste ser de apresentação, o seu "filho", ou seja a `TaskListComponent` não o é. De certa forma o `PureInboxScreenComponent` foi poluído pelo "container-ness". Com isto as estórias no ficheiro `inbox-screen.stories.ts` terão que ser definidas da seguinte forma:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TaskModule } from '../task.module';

storiesOf('InboxScreen', module)
  moduleMetadata({
    imports: [TaskModule],
    providers: [],
  }),
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  });
```
Pode verificar-se agora existem problemas com as estórias. Isto deve-se ao facto que ambas dependem da loja e apesar de se estar a usar um componente "puro" para o estado erro, ambas ainda precisam do contexto.

![Inbox quebrada](/broken-inboxscreen.png)

Uma forma de evitar este tipo de situações, consiste em evitar por completo a renderização de componentes contentor em qualquer lado na aplicação com a exceção do mais alto nível e injetar os dados ao longo da hierarquia de componentes.

No entanto, algum programador **irá querer** renderizar contentores num nível mais baixo na hierarquia de componentes. Já que pretendemos renderizar a maioria da aplicação no Storybook (sim queremos!), é necessária uma solução para esta situação.

<div class="aside">
    Como aparte, a transmissão de dados ao longo da hierarquia é uma abordagem legitima, particulamente quando é utilizado <a href="http://graphql.org/">GrapQL</a>. Foi desta forma que foi construido o <a href="https://www.chromaticqa.com">Chromatic</a>, juntamente com mais de 670 estórias.
</div>

## Fornecimento do contexto com recurso a decoradores

A forma mais fácil de se atingir isto consiste em fornecer a `Store` ao módulo e inicializar o estado, partindo do pressuposto que é uma aplicação completa:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  )
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  });
```

Existem abordagens semelhantes de forma a fornecer contextos simulados para outras bibliotecas de dados tal como [ngxs](https://ngxs.gitbook.io/ngxs/).

A iteração de estados no Storybook faz com que seja bastante fácil testar, se for feito correctamente:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Método alternativo

Poderá estar a perguntar-se porque foi criado o novo `PureInboxScreenComponent`, somente para testar o atributo `error`. A resposta mais curta é que iriamos querer mostrar um padrão que é bastante comum: ou seja componentes contentores agrupados. Neste caso, o `TaskListComponent` foi ligado á loja e com isto injetado dentro do `InboxScreenComponent` que também se encontra ligado á loja (para se obter o `error`). Foi adicionado o `PureInboxScreenComponent` somente para ilustrar uma forma de se dividir os componentes nas formas pura e ligada, assim como a possibilidade de testar em separado.

Este é um exemplo extremamente simples e como tal adicionar estes componentes puros poderá sugerir algo excessivo. Mas com o Storybook para Angular existe uma outra forma de escrever estórias para o `InboxScreenComponent`:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

import { Component } from '@angular/core';

@Component({
  template: `<inbox-screen></inbox-screen>`,
})
class HostDispatchErrorComponent {
  constructor(store: Store) {
    store.dispatch(new ErrorFromServer('Error'));
  }
}

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      declarations: [HostDispatchErrorComponent],
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  )
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  })
  .add('Connected Error', () => {
    return {
      component: HostDispatchErrorComponent,
    };
  });
```

Como pode ser visto, foi criado um novo componente, componente este que embrulha e irá incluir o componente `InboxScreenComponent` diretamente. Dentro do construtor deste, iremos usar o mecanismo de injeção de dependências do Angular de forma a ser possível o acesso á instância `Store` e com isto despoletar a ação de erro. O que resulta no `error` ser adicionado á loja e como consequencia disso, o componente `InboxScreenComponent` irá renderizar corretamente o estado de erro.

Poderá estar a pensar no porque de se usar `component` ao invés de `template` para definir a estória. O que acontece é que Storybook para Angular permite quer uma, quer a outra metodologia, o que a metodologia usada por `component` faz, não é nada mais nada menos do que o que se pretende: permite fornecer uma referência a uma qualquer classe componente e com isso é possível adicionar como um componente dentro do módulo e renderizar. Como efeito colateral, visto que este componente é agora parte do módulo, tem acesso a todos os fornecedores, assim como todos os módulos que foram importados.

## Desenvolmento orientado a Componentes

Começou-se do fundo com `TaskComponent`, prosseguindo para `TaskListComponent` e agora chegou-se ao ecrã geral do interface de utilizador. O `InboxScreenComponent`, acomoda um componente contentor que foi adicionado e inclui também estórias que o acompanham.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Desenvolvimento Orientado a Componentes**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) permite a expansão gradual da complexidade á medida que se prossegue de forma ascendente na hierarquia de componentes. Dos benefícios ao utilizar-se esta abordagem, estão o processo de desenvolvimento focado e cobertura adicional das permutações possíveis do interface de utilizador.
Resumidamente esta abordagem ajuda na produção de interfaces de utilizador de uma qualidade extrema e assim como complexidade.

Ainda não finalizamos, o trabalho não acaba quando o interface de utilizador estiver construído. É necessário garantir que resiste ao teste do tempo.