---
title: 'Testear Componentes interfaz gráfica'
tocTitle: 'Testing'
description: 'Aprende las formas de probar los componentes de la interfaz gráfica'
commit: 8fdc779
---

Ningún tutorial de Storybook estaría completo sin hacer pruebas. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

- **Pruebas visuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la apariencia de un componente a medida que lo construimos.
- **Pruebas instantáneas** con Storyshots se captura "una instantánea" del renderizado de un componente. Nos ayudan a mantenernos al tanto de los cambios que causan errores de renderizado y advertencias en los componentes.
- **Pruebas unitarias** con Jest se verifica que la salida de un componente permanezca igual a una entrada fija dada.
  Son ideales para probar las cualidades funcionales de un componente.

## "¿Pero se ve bien?"

Desafortunadamente, los métodos de testing mencionados no son suficientes para prevenir errores de interfaz. Las interfaces de usuario son difíciles de probar porque el diseño es subjetivo y matizado. Las pruebas visuales son demasiado manuales, las pruebas instantáneas desencadenan demasiados falsos positivos cuando se utilizan para la interfaz de usuario, y las pruebas unitarias a nivel de píxel son de poco valor. Una estrategia completa de pruebas de Storybook también incluye pruebas de regresión visual.

## Pruebas de regresión visual para Storybook

Las pruebas de regresión visual están diseñadas para detectar cambios en la apariencia. Funcionan haciendo capturas de pantalla de todas las historias y comparando con los cambios superficiales. Esto es perfecto para verificar elementos gráficos como diseño, color, tamaño y contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook es una herramienta fantástica para las pruebas de regresión visual porque cada historia es esencialmente una especificación del test. ¡Cada vez que escribimos o actualizamos una historia recibimos una especificación gratis!

Existen varias herramientas para las pruebas de regresión visual. Para equipos profesionales recomendamos [**Chromatic**](https://www.chromatic.com/), un complemento creado por el equipo de Storybook que ejecuta pruebas en la nube. También nos permite publicar Storybook online como vimos en el [capítulo anterior](/intro-to-storybook/angular/es/deploy/).

## Detectar un cambio en la UI

Las pruebas de regresión visual se basan en comparar imágenes del nuevo código de interfaz de usuario renderizado con las imágenes de referencia. Si se detecta un cambio en la interfaz de usuario, se nos notificará.

Veamos cómo funciona modificando el fondo del componente `Task`.

Comience creando una nueva rama para este cambio:

```bash
git checkout -b change-task-background
```

Cambie `TaskComponent` a lo siguiente:

```diff:title=src/app/components/task.component.ts
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
+ style="background: red;"
/>
```

Esto produce un nuevo color de fondo para el elemento.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Agrega el archivo:

```bash
git add .
```

Commit del archivo:

```bash
git commit -m "change task background to red"
```

Y "push" de los cambios al repositorio remoto:

```bash
git push -u origin change-task-background
```

Finalmente, abra su repositorio de GitHub y abra un "pull request" para la rama `change-task-background`.

![Creating a PR in GitHub for task](/github/pull-request-background.png)

Agregue un texto descriptivo a su "pull request" y haga click `Create pull request`. Click en "🟡 UI Tests" PR check al final de la página.

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

Esto le mostrará los cambios de la interfaz de usuario detectados por su commit.

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

¡Hay muchos cambios! La jerarquía de componentes donde `TaskComponent` es un elemento secundario de` TaskListComponent` y `InboxScreenComponent` significa que un pequeño ajuste se convierte en una gran regresión. Esta circunstancia es precisamente la razón por la que los desarrolladores necesitan pruebas de regresión visual además de otros métodos de prueba.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Revisar cambios

Las pruebas de regresión visual garantizan que los componentes no cambien por accidente. Pero aún depende de nosotros determinar si los cambios son intencionales o no.

Si un cambio es intencional, necesitaremos actualizar la línea de base para que las pruebas futuras se comparen con la última versión de la historia. Si un cambio no es intencional, debe corregirse.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Dado que las aplicaciones modernas se crean a partir de componentes, es importante que realicemos pruebas a nivel de componente. Hacerlo nos ayuda a identificar la causa raíz de un cambio, el componente, en lugar de reaccionar a los síntomas de un cambio, las pantallas y los componentes compuestos.

## Mergear cambios

Cuando hayamos terminado de revisar, estamos listos para fusionar los cambios de la interfaz de usuario con confianza, sabiendo que las actualizaciones no introducirán errores accidentalmente. Si le gusta el nuevo fondo `rojo`, acepte los cambios, si no, vuelva al estado anterior.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook nos ayuda a **construir** componentes; las pruebas nos ayudan a **mantenerlos**. Los cuatro tipos de
pruebas de UI que se tratan en este tutorial fueron pruebas de regresión manual, instantánea, unitaria y visual. Las últimas tres se pueden automatizar agregándolos a un CI cuando acabamos de terminar de configurar. Esto nos ayuda a enviar componentes sin preocuparnos por los bugs. El flujo de trabajo completo se ilustra a continuación.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
