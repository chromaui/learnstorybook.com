---
title: 'Seguimiento de Estado'
tocTitle: 'Seguimiento de Estado'
description: 'Administra el estado del complemento en el Administrador y en la Vista Previa'
commit: 'ffd9ccb'
---

React tiene [hooks](https://reactjs.org/docs/hooks-state.html#gatsby-focus-wrapper) incorporados, como `useState`, para administrar el estado. Por lo general, esto sería suficiente. Sin embargo, en este caso las cosas son un poco más complicadas. Dediquemos un momento a hablar sobre la arquitectura de Storybook.

## Conceptos básicos de la arquitectura de Storybook

![](../../images/manager-preview.jpg)

A primera vista, Storybook presenta una interfaz de usuario unificada. Sin embargo, detrás de escena se divide en dos segmentos que se comunican entre sí a través de un **canal de comunicación:**

- **Administrador:** el UI donde se procesan la búsqueda, la navegación, las barras de herramientas y los complementos de Storybook.
- **Vista Previa:** un iframe donde se renderizan las historias.

Necesitamos rastrear el estado de alternancia **y al mismo tiempo** también compartir ese estado tanto en el Administrador como en la Vista previa. Por lo tanto, en lugar de `useState`, usaremos `useGlobals` de `@storybook/api`.

## Seguimiento del estado global

Los [Globals](https://storybook.js.org/docs/react/essentials/toolbars-and-globals/#globals) representan el contexto "global" (o sea, que no son específicos de la historia) en Storybook. Son una forma práctica de compartir información entre diferentes historias, complementos y decoradores. El hook `useGlobals` permite acceder a este contexto global dentro de la herramienta que se está creando.

<div class="aside">Echa un vistazo en <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a> para más APIs relacionados con addons</div>

El kit Addon preconfigura `Tool` (herramienta) para utilizar globals. Cambiemos el nombre del global para reflejar con mayor precisión lo que hace. La función `toggleOutline` permite al usuario activar y desactivar el complemento Outline. 👉🏽🔘

![The tool track toggle state](../../images/track-state.gif)

```diff:title=src/Tool.js
import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/addons';
import { Icons, IconButton } from '@storybook/components';
import { TOOL_ID } from './constants';

export const Tool = () => {
+  const [{ outlineActive }, updateGlobals] = useGlobals();

+  const toggleOutline = useCallback(
    () =>
      updateGlobals({
+        outlineActive: !outlineActive,
      }),
+    [outlineActive]
  );

  return (
    <IconButton
      key={TOOL_ID}
+      active={outlineActive}
      title="Apply outlines to the preview"
+      onClick={toggleOutline}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```
