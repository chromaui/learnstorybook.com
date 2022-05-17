---
title: "Suivre l'état"
tocTitle: "Suivre l'état"
description: "Gérer l'état de l'addon entre le Manager et la Prévisualisation"
commit: 'ffd9ccb'
---

React intègre des [hooks](https://fr.reactjs.org/docs/hooks-state.html#gatsby-focus-wrapper) tels que `useState` pour gérer l'état. C'est souvent suffisant. Cependant, dans notre cas, les choses sont un peu plus compliquées. Prenons un moment pour évoquer la façon dont Storybook est architecturé.

## Les bases de l'architecture de Storybook

![](../../images/manager-preview.jpg)

Vu de l'extérieur, Storybook présente une interface utilisateur dans son ensemble. Cette interface est en fait composée de deux segments qui communiquent grâce à un **canal de communication:**

- **Un Manager:** l'interface utilisateur où sont rendues la recherche, la navigation, les barres d'outils et les addons de Storybook.
- **La Prévisualisation:** une iframe où sont rendues les stories.

Nous devons suivre l'état actif/inactif **et** nous devons également partager cet état entre le Manager et la Prévisualisation. Par conséquent, plutôt que d'utiliser le hook `useState`, nous allons utiliser `useGlobals` mis à disposition par `@storybook/api`.

## Suivre l'état global

Les [globales](https://storybook.js.org/docs/react/essentials/toolbars-and-globals/#globals) représentent le contexte “global” (comprenez ici indépendant des stories) de Storybook. C'est une façon pratique de partager des informations entre différentes stories, différents addons et décorateurs. Le hook `useGlobals` vous permet d'accéder à ce contexte depuis l'addon que vous êtes en train de créer.

<div class="aside">Jetez un œil à <a href="https://storybook.js.org/docs/react/addons/addons-api">@storybook/addons</a> pour plus d'informations concernant les APIs dédiées aux addons.</div>

L'Addon Kit pré-configure `Tool` pour utiliser les globales. Renommons la globale pour retranscrire avec plus de précision ce qu'elle fait. La fonction `toggleOutline` permet à l'utilisateur d'activer ou de désactiver l'addon Outline 👉🏽🔘

![L'outil suit l'état actif/inactif](../../images/track-state.gif)

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
       title="Appliquer des contours à la prévisualisation"
+      onClick={toggleOutline}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```
