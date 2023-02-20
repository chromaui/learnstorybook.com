---
title: 'Testear Componentes UI'
tocTitle: 'Testing'
description: 'Aprende las formas de hacer test a los componentes de la UI'
---

Ningún tutorial de Storybook estaría completo sin hacer testing. Las pruebas son esenciales para crear interfaces de usuario de alta calidad. En los sistemas modulares, los ajustes minúsculos pueden dar lugar a regresiones importantes. Hasta ahora hemos encontrado tres tipos de pruebas:

- **Pruebas visuales** confían en que los desarrolladores examinen manualmente un componente para verificar que esté correcto. Nos ayudan a comprobar la aparencia de un componente a medida que lo construimos.
- **Pruebas de accessibilidad** verifican que los componentes sean accesible a todos usando el complemento a11y. Nos ayudan recolectar información sobre cómo las personas con ciertos tipos de discapacidades usan nuestros componentes.
- **Pruebas de interacción** con la función de play verifican que el componente se comporta como se espera al interactuar con él. Son excelentes para probar el comportamiento de un componente cuando está en uso.

## "¿Pero se ve bien?"

Desafortunadamente, los métodos de testing mencionados no son suficientes para prevenir errores de interfaz. Las interfaces de usuario son difíciles de probar porque el diseño es subjetivo y matizado. Otras pruebas de interfaz como pruebas instantáneas desencadenan demasiados falsos positivos, y las pruebas unitarias a nivel de píxel son de poco valor. Una estrategia completa de pruebas de Storybook también incluye pruebas de regresión visual.

## Pruebas de regresión visual para Storybook

Las pruebas de regresión visual están diseñadas para detectar cambios en la apariencia. Funcionan haciendo capturas de pantalla de todas las historias y comparándolas de commit a commit con los cambios superficiales. Esto es perfecto para verificar elementos gráficos como diseño, color, tamaño y contraste.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook es una herramienta fantástica para las pruebas de regresión visual porque cada historia es esencialmente una especificación del test. Cada vez que escribimos o actualizamos una historia recibimos una especificación gratis!

Existen varias herramientas para la prueba de regresión visual. Recomendamos [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un servicio de publicación gratuito creado por los mantenedores de Storybook que ejecuta pruebas visuales en un entorno de navegador en la nube. También nos permite publicar Storybook en línea, como vimos en el [capítulo anterior](/intro-to-storybook/react/es/deploy/).

## Capturando un cambio en la interfaz de usuario

La prueba de regresión visual se basa en la comparación de imágenes del nuevo código de la interfaz de usuario renderizado con las imágenes de la línea base. Si se detecta un cambio en la interfaz de usuario, se notificará. 

Vea cómo funciona ajustando el fondo del componente `Task`:

Empieza creando una nueva rama para este cambio:

```shell
git checkout -b change-task-background
```

Cambia `src/components/Task.js` al siguiente:

```diff:title=src/components/Task.js
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>
      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
+         style={{ background: 'red' }}
        />
      </label>
      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

Esto produce un nuevo color de fondo para el elemento.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Agrega el archivo:

```shell
git add .
```

Haz commit del archivo:

```shell
git commit -m "change task background to red"
```

Y haz push a los cambios al repositorio remoto:

```shell
git push -u origin change-task-background
```

Por último, abre tu repositorio de GitHub y abre un pull request para la rama `change-task-background`.

![Creating a PR in GitHub for task](/github/pull-request-background.png)

Agrega un texto descriptivo a tu pull request y haz clic en "Create pull request". Haga click en el PR check "🟡 UI Tests" en la parte inferior de la página.

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

Le mostrará los cambios en la interfaz de usuario detectados por su commit.

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

Hay muchos cambios. La jerarquía de componentes donde `Task` es hijo de `TaskList` y `Inbox` significa que un pequeño cambio se convierte en grandes regresiones. Esta circunstancia es precisamente la razón por la que los desarrolladores necesitan pruebas de regresión visual además de otros métodos de prueba.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Revisando cambios

Las pruebas de regresión visual aseguran que los componentes no cambien por accidente. Pero todavía depende de nosotros determinar si los cambios son intencionales o no.

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

Storybook te ayuda a **construir** componentes; las pruebas te ayudan a **mantenerlos**. Los cuatro tipos de pruebas de interfaz de usuario que se tratan en este tutorial son las pruebas visuales, de accessibilidad, de interacción y de regresión visual. Puedes automatizar los últimos tres añadiéndolos a un CI como acabamos de terminar de configurar, y nos ayuda a crear componentes sin preocuparnos por los errores ocultos. Todo el flujo de trabajo se ilustra a continuación.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
