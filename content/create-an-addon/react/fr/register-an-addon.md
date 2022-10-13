---
title: "Enregistrer l'addon"
description: "Créer l'UI de l'addon et l'enregistrer dans Storybook"
commit: '5db9bc9'
---

Commençons par le fichier `src/Tool.js`. C'est dans ce fichier que se trouvera tout le code de l'UI pour l'outil Outline. Notez l'import de [@storybook/components](https://www.npmjs.com/package/@storybook/components). Il s'agit de la bibliothèque de composants de Storybook, créée avec React et Emotion. Elle sert à construire, eh bien, Storybook lui-même. Nous pouvons également l'utiliser pour créer notre addon.

Dans notre cas, nous utiliserons les composants `Icons` et `IconButton` pour créer le bouton de notre outil de contour. Modifiez votre code afin d'utiliser l'icône `outline` et donnez au bouton un nom approprié.

```js:title=src/Tool.js
import React, { useCallback } from 'react';
import { useGlobals } from '@storybook/api';
import { Icons, IconButton } from '@storybook/components';
import { TOOL_ID } from './constants';

export const Tool = () => {
  const [{ myAddon }, updateGlobals] = useGlobals();

  const toggleMyTool = useCallback(
    () =>
      updateGlobals({
        myAddon: !myAddon,
      }),
    [myAddon]
  );

  return (
    <IconButton
      key={TOOL_ID}
      active={myAddon}
      title="Appliquer des contours à la prévisualisation"
      onClick={toggleMyTool}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```

Passons maintenant au manager. C'est ici que nous enregistrons l'addon dans Storybook en utilisant une constante `ADDON_ID` unique. Nous enregistrons également l'outil à l'aide d'un identifiant unique défini par la constante `TOOL_ID`. Je recommande quelque chose comme `storybook/mon-addon`. L'Addon Kit inclut également des exemples pour ajouter un onglet et un panneau. L'addon Outline ne mettant à disposition qu'un outil, nous pouvons supprimer le reste.

```js:title=src/preset/manager.js
import { addons, types } from '@storybook/addons';

import { ADDON_ID, TOOL_ID } from '../constants';
import { Tool } from '../Tool';

// Enregistrement de l'addon
addons.register(ADDON_ID, () => {
  // Enregistrement de l'outil
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'Mon addon',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  });
});
```

Notez la présence d'une propriété `match`. Elle vous permet de contrôler dans quel mode de visualisation l'addon sera actif. Dans notre cas, l'addon sera disponible dans le mode story et le mode docs.

À ce stade, vous devriez voir l'outil de contour apparaître dans la barre d'outils 🎉

![Activer l'outil de contour](../../images/outline-tool.png)
