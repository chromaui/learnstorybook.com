---
title: "Construir una pantalla"
tocTitle: "Pantallas"
description: "Construir una pantalla utilizando componentes"
commit: deff6cb
---

Nos hemos concentrado en crear interfaces de usuario desde "abajo hacia arriba"; empezando con los componentes individuales y añadiendo complejidad gradualmente. Esto nos ha permitido desarrollar cada componente de forma aislada, determinar los datos que necesita y jugar con ellos en Storybook. ¡Todo sin necesidad de utilizar un servidor o, siquiera, construir una sola pantalla!

En este capítulo aumentaremos la sofisticación al combinar los componentes que hemos construido en una pantalla y desarrollar esa pantalla dentro de Storybook.

## Componentes "contenedores"

Como nuestra aplicación es muy simple, la pantalla que construiremos es bastante trivial, simplemente envolviendo un `TaskListComponent` y sacando un campo `error` de nuestro contenedor de estado. Ahora crearemos `inbox-screen.component.ts` dentro de `src/tasks/containers`:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'inbox-screen',
  template: `
    <div *ngIf="error$ | async" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>

    <div *ngIf="!(error$ | async)" class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <task-list></task-list>
    </div>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Select(TasksState.getError) error$: Observable<any>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
```

También cambiamos nuestro `AppComponent` para que incluya el `InboxScreenComponent` (en una aplicación real esto sería manejado por el enrutador pero podemos obviarlo):

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

Sin embargo, al intentar mostrar nuestro componente "contenedor" dentro de Storybook las cosas se ponen interesantes.

Como vimos anteriormente, el `InboxScreenComponent` es un **contenedor** que renderiza el componente de presentación `TaskListComponent`. Por definición, los componentes contenedores no pueden renderizarse de manera aislada; esperan que se les pase algún contexto o servicio. Esto significa que para mostrar nuestro componente en Storybook, debemos mockearlo (es decir, proporcionar una versión ficticia) del contexto o servicio que requiere.

Sin embargo, para el `InboxScreenComponent` tenemos un problema porque depende de nuestro contenedor de estado global. Afortunadamente, Storybook para Angular provee el decorador `moduleMetadata` que nos permite configurar el módulo de Angular e inyectar los `provider`s que necesitamos:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

import { Component } from '@angular/core';

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      declarations: [],
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
      template: `<inbox-screen></inbox-screen>`,
    };
  });
```

Vemos que aunque la historia `default` funciona bien, tenemos un problema en la historia `error` porque el campo `error` viene directamente de nuesto contenedor de estado y no podemos simplemente modificarlo desde afuera. Es necesario enviar una acción.

![Broken inbox](/broken-inboxscreen.png)

Una forma de evitar este problema es nunca renderizar componentes contenedores en ninguna parte de tu aplicación excepto en el nivel más alto y en su lugar pasar todos los datos requeridos hacia abajo pasando por toda la jerarquía de componentes.

Sin embargo, los desarrolladores **necesitarán** inevitablemente renderizar contenedores más abajo en la jerarquía de componentes. Si queremos renderizar la mayor parte o la totalidad de la aplicación en Storybook (¡lo cual queremos!), necesitamos solucionar este problema.

<div class="aside">
Por otro lado, la transmisión de datos a nivel jerárquico es un enfoque legítimo, especialmente cuando utilizas <a href="http://graphql.org/">GraphQL</a>. Así es como hemos construido <a href="https://www.chromaticqa.com">Chromatic</a> junto a más de 670+ historias.
</div>

## Suministrando contexto con decoradores

La forma más sencilla de hacer esto es crear un componente que incluya nuestro `InboxScreenComponent` e incluirlo dentro de los meta datos del módulo. De esa forma, las instancias de los `provider`s que hemos configurado estarán disponibles en el constructor del componente que hemos creado. Una vez que tengamos este componente listo, es sencillo enviar una acción a nuestro contenedor de estado para que cree un error:

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
      component: HostDispatchErrorComponent,
    };
  });
```

En Storybook para Angular tenemos dos formas de crear historias: como una referencia a la clase utilizando el campo `component` o como un `template`. En este caso utilizamos la primera pues nos permite acceder a la instancia del contenedor de estado que Angular ha inyectado.

Un recorrido rápido por los estados en Storybook hace que sea fácil comprobar que lo hemos hecho correctamente:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Desarrollo basado en componentes

Empezamos con un `TaskComponent`, progresando a un `TaskListComponent` y, finalmente, hemos construido una pantalla completa. Nuestro `InboxScreenComponent` contiene el resto de los componentes e incluye las historias correspondientes.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**El desarrollo basado en componentes**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) te permite expandir gradualmente la complejidad a medida que asciendes en la jerarquía de componentes. Entre los beneficios están un proceso de desarrollo más enfocado y una mayor cobertura de todas las posibles mutaciones de la interfaz de usuario. En resumen, la CDD te ayuda a construir interfaces de usuario de mayor calidad y complejidad.

Aún no hemos terminado, el trabajo no termina cuando se construye la interfaz de usuario. También tenemos que asegurarnos de que siga siendo funcionando a lo largo del tiempo.
