---
title: "Construye un componente simple"
tocTitle: "Componente Simple"
description: "Construye un componente simple en aislamiento"
commit: 1a14919
---

Construiremos nuestra interfaz gráfica siguiendo la metodología CDD: [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (desarrollo de software guiado por componentes). Es un proceso que construye las interfaces gráficas desde “abajo hacia arriba”, empezando con los componentes individuales y terminando con las vistas. CDD te ayudará a escalar la complejidad con la que te enfrentas a medida que construyes la interfaz gráfica de tu aplicación.

## Task - Tarea

![Task component in three states](/task-states-learnstorybook.png)

`TaskComponent` (o Tarea) es el componente principal de nuestra aplicación. Cada tarea se muestra de forma ligeramente diferente según el estado en el que se encuentre. Mostramos un checkbox marcado (o sin marcar), información sobre la tarea y un botón “pin” que nos permite fijar dicha tarea en la parte superior de la lista. Con estas especificaciones en mente, necesitaremos las siguientes propiedades propiedades (props):

- `title` – una cadena de caracteres que describe la tarea
- `state` - ¿en qué lista se encuentra la tarea actualmente? y, ¿está marcado el checkbox?

Para construir nuestro `TaskComponent`, primero escribiremos tests para los estados que corresponden a los distintos tipos de tareas descritas anteriormente. Luego, utilizaremos Storybook para construir el componente en aislamiento utilizando únicamente datos de prueba. Vamos a “testear visualmente” la apariencia del componente dependiendo de cada estado.

Este es un proceso es al [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) que podemos llamar “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Ajustes iniciales

Primero, vamos a crear el componente que describe una Tarea (`TaskComponent`) y el archivo de historias de Storybook que lo acompaña: `src/tasks/task.component.ts` y `src/tasks/task.stories.ts`.

Comenzaremos con una implementación básica del `TaskComponent`, en la que simplemente recibiremos los atributos que componen una tarea (titulo y estado de la misma) y las dos acciones que puedes realizar: moverla entre las listas y fijarla.

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

Arriba, renderizamos directamente nuestro `TaskComponent` basándonos en la estructura HTML existente de la app TODOs.

A continuación creamos los tres estados de prueba del componente dentro del archivo de historia:

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

Existen dos niveles básicos de organización en Storybook. El componente y sus historias hijas. Puedes pensar en cada historia como una permutación del componente (todos lo estados posibles que puede tener, basándose en las las entradas que se le pueden proporcionar). Puedes crear tantas historias por componente como sean necesarias.

- **Component**
  - Story
  - Story
  - Story

Para iniciar Storybook, primero invocamos a la función `storiesOf()` que registra el componente. Agregamos un nombre para el componente que se muestra en la barra lateral de la aplicación Storybook.

`action()` nos permite crear un callback que aparecerá en el panel **actions** de la interfaz gráfica de Storybook cuando es cliqueado. Entonces, por ejemplo, cuando construyamos el botón de fijar, podremos determinar en la interfaz gráfica de prueba si un click en el botón es exitoso o no.

Es conveniente agrupar las `actions` que un componente necesita ya que puedes `export`-arlas y utilizarlas en historias de otros componentes que reutilicen este componente, como veremos luego.

Para definir nuestras historias, llamamos la función `add()` una vez por cada uno de los estados de la prueba para generar una historia. La historia de acción - action story - es una función que retorna un elemento renderizado (es decir, una clase componente con un conjunto de propiedades) en un estado dado.

Al crear una historia utilizamos una `tarea` (`task`) base que se modela a partir del aspecto de los datos verdaderos. Nuevamente, `export`-ar esta tarea nos permitirá reutilizarla en historias posteriores.

<div class="aside">
Las <a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Acciones</b></a> ayudan a verificar las interacciones cuando creamos componentes interfaz gráfica en aislamiento. A menudo no tendrás acceso a las funciones y el estado que tienes en el contexto de la aplicación. Utiliza <code>action()</code> para simularlas.
</div>

## Configuración

También necesitamos hacer un pequeño cambio en la configuración de Storybook (`.storybook/config.js`) para que tenga en cuenta nuestros archivos `.stories.ts` y use nuestro archivo LESS. Por defecto, Storybook busca historias en el directorio `/stories`; este tutorial usa un esquema de nombres que es similar al esquema de nombres `.tipo.extensión` preferido cuando se desarrollan aplicaciones con Angular.

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

Para que sea posible importar directamente nuestro archivo LESS necesitamos añadir una configuración expecial de Webpack. Basta con crear un archivo `webpack.config.js` dentro del directorio `.storybook` y pegar el siguiente código:

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

También es necesario instalar los siguiente paquetes:

```
yarn add -D less-loader css-loader style-loader
```

Una vez que hayamos hecho esto y reiniciado el servidor de Storybook deberíamos ver los casos de prueba para cada estado de nuestro `TaskComponent`:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Construyendo los estados

Ahora que hemos configurado Storybook, importado los estilos y los casos de prueba están construidos; podemos comenzar a modificar el HTML del componente para que coincida con el diseño final.

Con el siguiente código, lograremos que nuestro componente (que aún es básico) se vea como deseamos:

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

El HTML que hemos agregado anteriormente, combinado con el CSS que hemos importado, produce la siguiente interfaz gráfica:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Especificar los requerimientos de datos

Es una buena práctica especificar la forma de los datos que un componente espera recibir. Esto no sólo permite que sea mucho más sencillo entender los requerimientos del componente al leer su código, sino que también ayuda a detectar problemas rápidamente. En este caso hemos utilizado TypeScript para crear una interfaz que describe el modelo de la tarea (`Task`):

```typescript
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## ¡Componente listo!

Hemos construido, exitosamente, un componente sin necesidad de un servidor y sin ejecutar la aplicación. El siguiente paso es construir los componentes restantes de la Taskbox, uno por uno de manera similar.

Como puedes ver, construir componentes en aislamiento es fácil y rápido. De esta forma nuestras interfaces gráficas serán de mayor calidad, estarán mucho más pulidas y tendrán menos errores ya que es posible profundizar y probar todos los estados posibles de cada componente.

## Pruebas automatizadas

Storybook proporciona una excelente forma de probar visualmente nuestra aplicación durante su construcción. Las 'historias' ayudarán a asegurar que no rompamos nuestro `TaskComponent` y que se cada estado posible siempre se vea como debe ser, a medida que continuamos desarrollando la aplicación. Sin embargo, en esta etapa, es un proceso completamente manual y alguien tiene que hacer el esfuerzo de hacer clic en cada estado de prueba y asegurarse de que se visualice bien y sin errores ni advertencias. ¿No podemos hacer eso automáticamente?

### Pruebas de instantáneas

La prueba de instantáneas se refiere a la práctica de registrar la salida "correcta" de un componente (como debe mostrarse en el navegador) para una determinada serie de entradas (datos que recibe el componente) y luego en el futuro marcar el componente siempre que la salida cambie. Estas pruebas complementan el trabajo que Storybook hace, pues constituyen una manera rápida de visualizar la nueva versión de un componente y verificar los cambios.

<div class="aside">
Asegúrate de que tus componentes rendericen datos que no cambien. De otro modo, cada vez que los datos cambien tus pruebas fallarán. Presta especial atención a fechas o valores generados de manera aleatoria.
</div>

Con [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) se crea, automáticamente, una prueba de instantánea para cada una de las historias. Úsalo agregando el siguiente paquete en modo desarrollo a las dependencias del proyecto:

```bash
yarn add -D @storybook/addon-storyshots identity-object-proxy jest jest-preset-angular
```

Luego crea un archivo `src/storybook.test.ts` con el siguiente contenido:

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

Después de esto, crea un directorio `src/jest-config` que contenga dos archivos, `globalMocks.ts`:

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

y `setup.ts`:

```typescript
import "jest-preset-angular";
import "./globalMocks";
```

Adicionalmente, añade un nuevo campo al `package.json`,

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

dos nuevos scripts para ejecutar `jest`

```json
"scripts": {
  ...
  "jest": "jest",
  "jest:watch": "jest --watch"
}
```

y, finalmente, actualiza `src/tsconfig.app.json` para excluir los archivos terminados en `.test.ts`

```json
"exclude": [
    "src/test.ts",
    "**/*.stories.ts",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
```

Una vez hecho lo anterior, podemos ejecutar `yarn jest` y veremos el siguiente resultado:

![Task test runner](/task-testrunner.png)

Ahora tenemos una prueba de instantánea para cada una de las historias de nuestro `TaskComponent`. Si cambiamos la implementación de `TaskComponent`, se nos pedirá que verifiquemos los cambios.
