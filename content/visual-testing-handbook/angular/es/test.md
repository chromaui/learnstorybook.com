---
title: "Testear Componentes interfaz gráfica"
tocTitle: "Testing"
description: "Aprende las formas de probar los componentes de la interfaz gráfica"
commit: 8fdc779
---

Ningún tutorial de Storybook estaría completo sin hacer pruebas. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

* **Pruebas visuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la aparencia de un componente a medida que lo construimos.
* **Pruebas instantáneas** con Storyshots se captura "una instantánea" del renderizado de un componente. Nos ayudan a mantenernos al tanto de los cambios que causan errores de renderizado y advertencias en los componentes.
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

Storybook es una herramienta fantástica para las pruebas de regresión visual porque cada historia es esencialmente una especificación del test. ¡Cada vez que escribimos o actualizamos una historia recibimos una especificación gratis!

Existen varias herramientas para las pruebas de regresión visual. Para equipos profesionales recomendamos [**Chromatic**](https://www.chromaticqa.com/), un complemento creado por el equipo de Storybook que ejecuta pruebas en la nube.

## Configurar las pruebas de regresión visual

Chromatic es un complemento de Storybook para pruebas de regresión visual y revisión en la nube. Dado que es un servicio de pago (con un periodo de prueba gratuita), puede que no sea el indicado para todos. Sin embargo, Chromatic es un ejemplo de un flujo de trabajo de pruebas visuales de producción que probaremos gratuitamente. Echemos un vistazo.

### Iniciando Git

Primero tienes que configurar Git para tu proyecto en el directorio local. Chromatic usa el historial de Git para hacer un seguimiento de los componentes de tu interfaz de usuario.

```bash
$ git init
```

Luego agrega archivos al primer commit.

```bash
$ git add .
```

Ahora haz commit de los archivos.

```bash
$ git commit -m "taskbox interfaz gráfica"
```

### Añadiendo Chromatic

Agregando el paquete como una dependencia.

```bash
yarn add -D storybook-chromatic
```

Importa Chromatic en tu archivo `.storybook/config.js`.

```javascript
import { configure } from '@storybook/angular';
import 'storybook-chromatic';
import '../src/styles.less';

// automatically import all files ending in *.stories.ts
const req = require.context('../src/', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Ahora [logueate en Chromatic](https://www.chromaticqa.com/start) con tu cuenta de GitHub (Chromatic solo te pedirá algunos permisos básicos). Crea un proyecto con nombre "taskbox" y copia tu `app-code` único.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Ejecuta el comando de prueba en la línea de comandos para configurar las pruebas de regresión visual para Storybook. No olvides añadir tu código de aplicación único en el `<app-code>`.

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

<div class="aside">
<code>--do-not-start</code> es una opción que le dice a Chromatic que no inicie Storybook. Usa esto si ya tienes a Storybook corriendo. Si no, omite el <code>--do-not-start</code>.
</div>

Una vez el primer test esté completo, tenemos punto de referencia de prueba para cada historia. En otras palabras, capturas de cada historia que son las "correctas". Cualquier cambio a estas historias será comparado contra dichos puntos de referencia.

![Chromatic baselines](/chromatic-baselines.png)

## Capturando un cambio en la interfaz de usuario

La prueba de regresión visual se basa en la comparación de imágenes del nuevo código de la interfaz de usuario renderizado con las imágenes de los puntos de referencia. Si se detecta un cambio en la interfaz de usuario, se te notificará. Observa cómo funciona ajustando el fondo del componente `Tareas`:

![code change](/chromatic-change-to-task-component.png)

Esto produce un nuevo color de fondo para la tarea.

![task background change](/chromatic-task-change.png)

Usa el comando de prueba anterior para ejecutar Chromatic de nuevo.

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

Sigue el enlace a la interfaz de usuario web donde verás los cambios.

![interfaz gráfica changes in Chromatic](/chromatic-catch-changes.png)

¡Hay muchos cambios! La jerarquía de componentes donde `TaskComponent` es hijo de `TaskListComponent` e `InboxScreenComponent` significa que cualquier cambio, por más pequeño que parezca, puede causar un efecto de bola de nieve y provocar regresiones importantes. Precisamente por esto los desarrolladores necesitan pruebas de regresión visual además de los métodos de prueba antes mencionados.

![interfaz gráfica minor tweaks major regressions](/minor-major-regressions.gif)

## Revisa los cambios

Las pruebas de regresión visual aseguran que los componentes no cambien por accidente. Pero todavía depende de ti determinar si los cambios son intencionales o no.

Si un cambio es intencional, es necesario actualizar los puntos de referencia para que las pruebas futuras se comparen con la última versión de la historia. Si un cambio no es intencional, debe ser corregido.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Dado que las aplicaciones modernas se construyen a partir de componentes, es importante que probemos a nivel de componentes. Hacerlo nos ayuda a identificar la causa raíz de un cambio, el componente, en lugar de reaccionar a los síntomas de un cambio, las pantallas y los componentes compuestos.

## Fusionando cambios

Cuando hayamos terminado de revisar los cambios, estaremos listos para fusionar o hacer "merge" de los cambios en la interfaz de usuario, sabiendo que las actualizaciones no introducirán errores accidentalmente. Si te gusta el nuevo fondo `red` entonces acepta los cambios, si no, vuelve al estado anterior.

![Changes ready to be merged](/chromatic-review-finished.png)

Storybook te ayuda a **construir** componentes; las pruebas te ayudan a **mantenerlos**. Los cuatro tipos de pruebas de interfaz de usuario que mencionamos en este tutorial son las pruebas visuales, de instantánea, unitarios y de regresión visual. Es posible automatizar los tres últimos añadiéndolos a su script CI. Esto te ayuda a enviar componentes sin tener que preocuparse por los bugs polizones. A continuación se ilustra el flujo de trabajo completo.

![Visual regression testing workflow](/cdd-review-workflow.png)
