---
title: "Testing"
description: "Aprende las formas de hacer test a los componentes de la UI"
commit: bd69176
---

# Testear Componentes UI

Ningún tutorial de Storybook estaría completo sin hacer test. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

* **Pruebas visuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la aparencia de un componente a medida que lo construimos.
* **Pruebas instantáneas** con Storyshots captura el marcado del renderizado de un componente. Nos ayudan a mantenernos al tanto de los cambios de marcado que causan errores de renderizado y advertencias en los componentes.
* **Pruebas unitarias** con Jest verifica que la salida de un componente permanezca igual a una entrada fija dada. Son ideales para probar las cualidades funcionales de un componente.

## "¿Pero se ve bien?"

Desafortunadamente, los métodos de testing mencionados no son suficientes para prevenir errores de interfaz. Las interfaces de usuario son difíciles de probar porque el diseño es subjetivo y matizado. Las pruebas visuales son demasiado manuales, las pruebas instantáneas desencadenan demasiados falsos positivos cuando se utilizan para la interfaz de usuario, y las pruebas unitarias a nivel de píxel son de poco valor. Una estrategia completa de pruebas de Storybook también incluye pruebas de regresión visual.

## Pruebas de regresión visual para Storybook

Las pruebas de regresión visual están diseñadas para detectar cambios en la apariencia. Funcionan haciendo capturas de pantalla de todas las historias y comparando con los cambios superficiales. Esto es perfecto para verificar elementos gráficos como diseño, color, tamaño y contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual regression testing because every story is essentially a test specification. Each time we write or update a story we get a spec for free!

There are a number of tools for visual regression testing. For professional teams we recommend [**Chromatic**](https://www.chromaticqa.com/), an addon made by Storybook maintainers that runs tests in the cloud.

## Setup visual regression testing

Chromatic is a hassle-free Storybook addon for visual regression testing and review in the cloud. Since it’s a paid service (with a free trial), it may not be for everyone. However, Chromatic is an instructive example of a production visual testing workflow that we'll try out for free. Let’s have a look.

### Initiate Git

First you want to setup Git for your project in the local directory. Chromatic uses Git history to keep track of your UI components.

```bash
$ git init
```

Next add files to the first commit.

```bash
$ git add .
```

Now commit the files.

```bash
$ git commit -m "taskbox UI"
```

### Get Chromatic

Add the package as a dependency.

```bash
yarn add react-chromatic
```

Import Chromatic in your `.storybook/config.js` file.

```javascript
import { configure } from '@storybook/react';
import 'react-chromatic/storybook-addon';

import '../src/index.css';

const req = require.context('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Then [login to Chromatic](https://bit.ly/2Is93Ez) with your GitHub account (Chromatic only asks for lightweight permissions). Create a project with name "taskbox" and copy your unique `app-code`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Run the test command in the command line to setup visual regression tests for Storybook. Don't forget to add your unique app code in place of `<app-code>`.

```bash
./node_modules/.bin/chromatic test --storybook-addon --app-code=<app-code> --do-not-start
```

<div class="aside">
<code>--do-not-start</code> is an option that tells Chromatic not to start Storybook. Use this if you already have Storybook running. If not omit <code>--do-not-start</code>.
</div>

Once the first test is complete, we have test baselines for each story. In other words, screenshots of each story known to be “good”. Future changes to those stories will be compared to the baselines.

![Chromatic baselines](/chromatic-baselines.png)

## Catch a UI change

Visual regression testing relies on comparing images of the new rendered UI code to the baseline images. If a UI change is caught you get notified. See how it works by tweaking the background of the `Task` component:

![code change](/chromatic-change-to-task-component.png)

This yields a new background color for the item.

![task background change](/chromatic-task-change.png)

Use the test command from earlier to run another Chromatic test.

```bash
./node_modules/.bin/chromatic test --storybook-addon --app-code=<app-code> --do-not-start
```

Follow the link to the web UI where you’ll see changes.

![UI changes in Chromatic](/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `Task` is a child of `TaskList` and `Inbox` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual regression testing in addition to other testing methods.

![UI minor tweaks major regressions](/minor-major-regressions.gif)

## Review changes

Visual regression testing ensures components dont change by accident. But it’s still up to you to determine whether changes are intentional or not.

If a change is intentional you need to update the baseline so that future tests are compared to the latest version of the story. If a change is unintentional it needs to be fixed.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Since modern apps are constructed from components, it’s important that we test at the level of component. Doing so helps us pinpoint the root cause of a change, the component, instead of reacting to symptoms of a change, the screens and composite components.

## Merge changes

When we’ve finished reviewing we’re ready to merge UI changes with confidence --knowing that updates won’t accidentally introduce bugs. If you like the new `papayawhip` background then accept the changes, if not revert to the previous state.

![Changes ready to be merged](/chromatic-review-finished.png)

Storybook helps you **build** components; testing helps you **maintain** them. The four types of UI testing are covered in this tutorial are visual, snapshot, unit, and visual regression testing. You can automate the last three by adding them to your CI script. This helps you ship components without worrying about stowaway bugs. The whole workflow is illustrated below.

![Visual regression testing workflow](/cdd-review-workflow.png)
