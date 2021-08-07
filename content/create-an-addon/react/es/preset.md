---
title: 'Preajuste'
tocTitle: 'Preajuste'
description: 'Habilita Outline (contorno) para cada historia'
commit: 'bdb7aaa'
---

Ahora que terminamos el decorador, usemos un preajuste que envuelva cada historia.

   preset-create-react-app y preset-nuxt. Estos se denominan complementos preestablecidos.

Los preajustes permiten combinar varias configuraciones diferentes de Storybook y aplicarlas de una vez. Algunos complementos son puramente responsables de configurar Storybook y no contienen UI.Por ejemplo, <a href="https://www.npmjs.com/package/@storybook/preset-create-react-app">preset-create-react-app</a> y <a href="https://www.npmjs.com/package/storybook-preset-nuxt">preset-nuxt</a>. Estos se denominan <a href="https://storybook.js.org/docs/react/addons/writing-presets">Preset addons</a> (Complementos preajustados).

Nuestro preajuste se divide en dos partes:

1. `manager.js` para registrar el complemento
2. `preview.js` Para especificar decoradores globales

Actualiza la vista previa para usar solo el decorador `withGlobals`, que automáticamente envolverá todas las historias.

```js:title=src/preset/preview.js
import { withGlobals } from '../withGlobals';

export const decorators = [withGlobals];
```

<div class="aside"><b>Nota:</b> el decorador <code>withRoundTrip</code> del Addon Kit es un ejemplo de comunicación bidireccional entre la historia y un complemento. Sin embargo, no es necesario para nuestro complemento y podemos eliminarlo.</div>

¡Éxitos! Ahora tienes un complemento completamente funcional en tu Storybook local. En el capítulo final, aprende a incluir tu complemento en el catálogo. De esa manera, puedes compartirlo con tu equipo y con la comunidad de Storybook.

![toggling the tool toggles the outlines](../../images/toggle.gif)
