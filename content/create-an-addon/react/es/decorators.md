---
title: 'Decoradores'
tocTitle: 'Decoradores'
description: 'Interactuando con las historias'
commit: '0e7246a'
---

Ya casi. Hasta ahora, creamos una herramienta, la agregamos a la barra de herramientas e incluso rastrea el estado. Ahora debemos responder a ese estado y mostrar u ocultar los contornos.

Los [Decoradores](https://storybook.js.org/docs/react/writing-stories/decorators) envuelven historias y agregan funcionalidad adicional de renderizado. Crearemos un decorador que responda al esquema global y maneje la inyección de CSS. Lo que a su vez, dibuja contornos alrededor de todos los elementos HTML.

En el paso anterior definimos el `outlineActive` (esquema activo) global, ¡ahora conectémoslo! Podemos consumir globales en un decorador usando el hook `useGlobals`.


```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useGlobals } from '@storybook/addons';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // ¿Se está utilizando el complemento en el panel de documentación?
  const isInDocs = context.viewMode === 'docs';

  useEffect(() => {
    // Ejecuta tu efecto secundario aquí
    // Por ejemplo, para manipular el contenido de la vista previa.
    const selectorId = isInDocs ? `#anchor--${context.id} .docs-story` : `root`;

    displayToolState(selectorId, { outlineActive, isInDocs });
  }, [outlineActive]);

  return StoryFn();
};

function displayToolState(selector, state) {
  const rootElement = document.getElementById(selector);
  let preElement = rootElement.querySelector('pre');

  if (!preElement) {
    preElement = document.createElement('pre');
    preElement.style.setProperty('margin-top', '2rem');
    preElement.style.setProperty('padding', '1rem');
    preElement.style.setProperty('background-color', '#eee');
    preElement.style.setProperty('border-radius', '3px');
    preElement.style.setProperty('max-width', '600px');
    rootElement.appendChild(preElement);
  }

  preElement.innerText = `Este snippet es inyectado por el decorador withGlobals.
Se actualiza a medida que el usuario interactúa con la herramienta ⚡ en la barra de herramientas de arriba.
${JSON.stringify(state, null, 2)}
`;
}
```

## Inyectando el CSS del contorno

Agregar y borrar estilos es un efecto secundario, por lo tanto, necesitamos envolver esa operación usando useEffect; que a su vez es activado por el `outlineActive` global. El código del kit viene con un ejemplo, pero actualicémoslo para manejar la inyección CSS del contorno.

```js:title=src/withGlobals.js
/* eslint-env browser */
import { useEffect, useMemo, useGlobals } from '@storybook/addons';

import { clearStyles, addOutlineStyles } from './helpers';
import outlineCSS from './outlineCSS';

export const withGlobals = (StoryFn, context) => {
  const [{ outlineActive }, updateGlobals] = useGlobals();
  // ¿Se está utilizando el complemento en el panel de documentación?
  const isInDocs = context.viewMode === 'docs';

  const outlineStyles = useMemo(() => {
    const selector = isInDocs ? `#anchor--${context.id} .docs-story` : '.sb-show-main';

    return outlineCSS(selector);
  }, [context.id]);

  useEffect(() => {
    const selectorId = isInDocs ? `addon-outline-docs-${context.id}` : `addon-outline`;

    if (!outlineActive) {
      clearStyles(selectorId);
      return;
    }

    addOutlineStyles(selectorId, outlineStyles);

    return () => {
      clearStyles(selectorId);
    };
  }, [outlineActive, outlineStyles, context.id]);

  return StoryFn();
};
```

Ok, parece un gran salto. Repasemos todos los cambios.

El complemento puede estar activo en los modos de vista de documentación y de historia. El nodo DOM real para el `iframe` de vista previa es diferente en estos dos modos. De hecho, el modo de documentación muestra varias vistas previas de historias en una página. Por lo tanto, debemos elegir el selector apropiado para el nodo DOM donde se inyectarán los estilos. Además, el CSS debe ajustarse a ese selector en particular.

<div class="aside"><b>Nota:</b> El <code>useMemo</code> y <code>useEffect</code> aquí provienen de <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a> y no de React. Esto se debe a que el código del decorador se ejecuta en la parte de vista previa de Storybook. Ahí es donde se carga el código del usuario que puede no contener React. Por lo tanto, para ser independiente del framework (marco), Storybook implementa una biblioteca de hooks similar a React que podemos utilizar.</div>

A continuación, a medida que inyectamos los estilos en el DOM, debemos realizarles un seguimiento para borrarlos cuando el usuario lo desactiva o cuando cambia el modo de visualización.

Para administrar toda esta lógica de CSS, necesitamos algunos ayudantes. Éstos utilizan APIs de DOM para inyectar y eliminar hojas de estilo.

```js:title=src/helpers.js
/* eslint-env browser */
export const clearStyles = selector => {
  const selectors = Array.isArray(selector) ? selector : [selector];
  selectors.forEach(clearStyle);
};

const clearStyle = selector => {
  const element = document.getElementById(selector);
  if (element && element.parentElement) {
    element.parentElement.removeChild(element);
  }
};

export const addOutlineStyles = (selector, css) => {
  const existingStyle = document.getElementById(selector);
  if (existingStyle) {
    if (existingStyle.innerHTML !== css) {
      existingStyle.innerHTML = css;
    }
  } else {
    const style = document.createElement('style');
    style.setAttribute('id', selector);
    style.innerHTML = css;
    document.head.appendChild(style);
  }
};
```

El CSS del contorno en sí mismo se basa en lo que usa [Pesticide](https://github.com/mrmrs/pesticide). Tómalo del archivo [outlineCSS.js](https://github.com/chromaui/learnstorybook-addon-code/blob/main/src/outlineCSS.js).

En conjunto, esto nos permite trazar contornos alrededor de los elementos UI.

![toggling the tool toggles the outlines](../../images/outlines.png)
