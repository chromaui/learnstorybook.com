---
title: 'Testear Componentes UI'
tocTitle: 'Testing'
description: 'Aprende las formas de hacer test a los componentes de la UI'
---

Ningún tutorial de Storybook estaría completo sin hacer test. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

- **Pruebas visuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la aparencia de un componente a medida que lo construimos.
- **Pruebas instantáneas** con Storyshots captura el marcado del renderizado de un componente. Nos ayudan a mantenernos al tanto de los cambios de marcado que causan errores de renderizado y advertencias en los componentes.
- **Pruebas unitarias** con Jest verifica que la salida de un componente permanezca igual a una entrada fija dada. Son ideales para probar las cualidades funcionales de un componente.

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

Storybook es una herramienta fantástica para las pruebas de regresión visual porque cada historia es esencialmente una especificación del test. Cada vez que escribimos o actualizamos una historia recibimos una especificación gratis!

Existen varias herramientas para la prueba de regresión visual. Para equipos profesionales recomendamos [**Chromatic**](https://www.chromatic.com/), un complemento hecho por las personas de Storybook que ejecuta pruebas en la nube.

## Configurar pruebas de regresión visual

Chromatic es un complemento de Storybook para pruebas de regresión visual y revisión en la nube. Dado que es un servicio de pago (con una prueba gratuita), puede que no sea para todos. Sin embargo, Chromatic es un ejemplo instructivo de un flujo de trabajo de pruebas visuales de producción que probaremos gratuitamente. Echemos un vistazo.

### Inicializar repositorio local

En esta etapa todavía no hay una configuración de repositorio todavía. Cambiemos eso y configurémoslo:

```bash
$ git init
```

A continuación, agregue archivos al primer commit.

```bash
$ git add -A
```

Ahora haz commit de los archivos.

```bash
$ git commit -m "taskbox UI"
```

### Añadiendo Chromatic

Agregando el paquete como una dependencia.

```bash
npm install -D chromatic
```

Ahora [logueate en Chromatic](https://www.chromatic.com/start) con tú cuenta de GitHub (Chromatic solo te pedirá algunos permisos simples). Crea un proyecto con nombre "taskbox" y copia tu `project-token` único.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Se requiere un pequeño cambio en el script `build-storybook` para permitir que el complemento `chromatic` muestre correctamente tanto los recursos (iconos y fuentes) como el css que se agregó al comienzo del tutorial.

```json
{
  "scripts": {
    "build-storybook": "build-storybook -s public"
  }
}
```

Ejecuta el comando de prueba en la línea de comandos para configurar las pruebas de regresión visual para Storybook. No olvides añadir tu código de aplicación único en el `<project-token>`.

```bash
 npx chromatic --project-token=<project-token>
```

<div class="aside"> Si su Storybook tiene un script de compilación personalizado, es posible que deba <a href="https://www.chromatic.com/docs/setup#command-options"> agregar opciones </a> a este comando. </div>

Una vez el primer test esté completo, tenemos líneas base de prueba para cada historia. En otras palabras, capturas de cada historia que ya se conocen como "buenas". Los futuros cambios a estas historias serán comparados con estás lineas base.

![Chromatic baselines](/intro-to-storybook/chromatic-baselines.png)

## Capturando un cambio en la interfaz de usuario

La prueba de regresión visual se basa en la comparación de imágenes del nuevo código de la interfaz de usuario renderizado con las imágenes de la línea base. Si se detecta un cambio en la interfaz de usuario, se notificará. Vea cómo funciona ajustando el fondo del componente `Task`:

![code change](/intro-to-storybook/chromatic-change-to-task-component.png)

Esto produce un nuevo color de fondo para el artículo.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Usa el comando de prueba anterior para ejecutar Chromatic de nuevo.

```bash
npx chromatic --project-token=<project-token>
```

Sigue el enlace a la interfaz de usuario web donde verá los cambios.

![UI changes in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

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

Storybook te ayuda a **construir** componentes; las pruebas te ayudan a **mantenerlos**. Los cuatro tipos de pruebas de interfaz de usuario que se tratan en este tutorial son las pruebas visuales, de instantánea, unitarios y de regresión visual. Puede automatizar los tres últimos añadiéndolos a su script CI. Esto le ayuda a enviar componentes sin tener que preocuparse por los bugs polizones. A continuación se ilustra todo el flujo de trabajo.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
