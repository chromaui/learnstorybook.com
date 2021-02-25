---
title: 'Testear Componentes UI'
tocTitle: 'Testing'
description: 'Aprende las formas de hacer test a los componentes de la UI'
commit: 8bf107e
---

Ningún tutorial de Storybook estaría completo sin hacer test. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

- **Pruebas manuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la aparencia de un componente a medida que lo construimos.
- **Pruebas instantáneas** con Storyshots captura el marcado del renderizado de un componente. Nos ayudan a mantenernos al tanto de los cambios de marcado que causan errores de renderizado y advertencias en los componentes.
- **Pruebas unitarias** con Jest verifica que la salida de un componente permanezca igual a una entrada fija dada. Son ideales para probar las cualidades funcionales de un componente.

## "¿Pero se ve bien?"

Desafortunadamente, los métodos de testing mencionados no son suficientes para prevenir errores de interfaz. Las interfaces de usuario son difíciles de probar porque el diseño es subjetivo y matizado. Las pruebas manuales son, bueno, manuales. Las pruebas instantáneas desencadenan demasiados falsos positivos cuando se utilizan para la interfaz de usuario. Las pruebas unitarias a nivel de píxel son de poco valor. Una estrategia completa de pruebas de Storybook también incluye pruebas de regresión visual.

## Pruebas de regresión visual para Storybook

Las pruebas de regresión visual tambien llamadas pruebas visuales, están diseñadas para detectar cambios en la apariencia. Funcionan haciendo capturas de pantalla de todas las historias y comparando con los cambios superficiales. Esto es perfecto para verificar elementos gráficos como diseño, color, tamaño y contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook es una herramienta fantástica para las pruebas de regresión visual porque cada historia es esencialmente una especificación del test. Cada vez que escribimos o actualizamos una historia recibimos una especificación gratis!

Existen varias herramientas para la prueba de regresión visual. Para equipos profesionales recomendamos [**Chromatic**](https://www.chromatic.com/), un complemento hecho por las personas de Storybook que ejecuta pruebas en la nube. También nos permite publicar Storybook en línea como vimos en el [capítulo anterior](/vue/es/deploy/).

## Detecta cambios en la interfaz de usuario

Las pruebas de regresión visual se basan en comparar imágenes del nuevo código de IU renderizado con las imágenes de referencia. Si se detecta un cambio en la interfaz de usuario, se nos notificará.

Veamos cómo funciona modificando el fondo del componente `Task`.

Comience creando una nueva rama para este cambio:

```bash
git checkout -b change-task-background
```

Cambie "Task" a lo siguiente:

```html
<!-- src/components/Task.vue -->

<input
  type="text"
  :value="task.title"
  readonly
  placeholder="Input title"
  style="background: red;"
/>
```

Esto produce un nuevo color de fondo para el elemento.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Agrega el archivo:

```bash
git add .
```

Comitea:

```bash
git commit -m "change task background to red"
```

Y envia los cambios al repositorio remoto:

```bash
git push -u origin change-task-background
```

Finalmente, abra su repositorio de GitHub y abra un pull request para la rama `change-task-background`.

![Creando un PR en GitHub para la tarea](/github/pull-request-background.png)

Agregue un texto descriptivo a su pull request y haga clic en "Crear pull request". Haga clic en "🟡 Pruebas de IU" en la parte inferior de la página.

![Cree un PR en GitHub para la tarea](/github/pull-request-background-ok.png)

Esto le mostrará los cambios de la interfaz de usuario detectados por su commit.

![Cambios Chromatic capturados](/intro-to-storybook/chromatic-catch-changes.png)

Hay muchos cambios! La jerarquía de componentes donde `Task` es hijo de `TaskList` y `Inbox` significa un pequeño giro de bolas de nieve en regresiones mayores. Esta circunstancia es precisamente la razón por la que los desarrolladores necesitan pruebas de regresión visual además de otros métodos de pruebas.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Revisando cambios

Las pruebas de regresión visual aseguran que los componentes no cambien por accidente. Pero todavía depende de ti determinar si los cambios son intencionales o no.

Si un cambio es intencional, es necesario actualizar la línea base para que las pruebas futuras se comparen con la última versión de la historia. Si un cambio no es intencional, debe ser corregido.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Dado que las aplicaciones modernas se construyen a partir de componentes, es importante que probemos a nivel de componentes. Hacerlo nos ayuda a identificar la causa raíz de un cambio, el componente, en lugar de reaccionar a los síntomas de un cambio, las pantallas y los componentes compuestos.

## Fusionando cambios

Cuando hayamos terminado de revisar, estaremos listos para fusionar o hacer "merge" de los cambios en la interfaz de usuario con confianza, sabiendo que las actualizaciones no introducirán errores accidentalmente. Si te gusta el nuevo fondo `red` entonces acepta los cambios, si no, vuelve al estado anterior.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook te ayuda a **construir** componentes; las pruebas te ayudan a **mantenerlos**. Los cuatro tipos de pruebas de interfaz de usuario que se tratan en este tutorial son las pruebas visuales, de instantánea, unitarios y de regresión visual. Los últimos tres se pueden automatizar agregándolos a un CI cuando acabamos de terminar de configurar. Esto le ayuda a enviar componentes sin tener que preocuparse por los bugs polizones. A continuación se ilustra todo el flujo de trabajo.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
