---
title: 'Register addon'
description: 'Build the addon UI and register it in Storybook'
---

Let's start in the `src/Tool.js` file. This is where the UI code for the Outline tool will live. Notice the [@storybook/components](https://www.npmjs.com/package/@storybook/components) import. This is Storybooks own component library, built with React and Emotion. It's used to build, well, Storybook itself ([demo](https://next--storybookjs.netlify.app/official-storybook/)). We can also use it to build our addon.

In this case, we’ll use the `Icons` and `IconButton` components to create the outline selector tool. Modify your code to use the `outline` icon and give it an appropriate title.

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
      title="Apply outlines to the preview"
      onClick={toggleMyTool}
    >
      <Icons icon="outline" />
    </IconButton>
  );
};
```

Moving on to the manager, here we register the addon with Storybook using a unique `ADDON_ID`. We also register the tool with a unique id. I recommend something like `storybook/addon-name`. The Addon Kit also includes tab and panel examples. The Outline addon only uses a tool so, we can delete the others.

```js:title=src/preset/manager.js
import { addons, types } from '@storybook/addons';

import { ADDON_ID, TOOL_ID } from '../constants';
import { Tool } from '../Tool';

// Register the addon
addons.register(ADDON_ID, () => {
  // Register the tool
  addons.add(TOOL_ID, {
    type: types.TOOL,
    title: 'My addon',
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: Tool,
  });
});
```

Notice the match property. It allows you to control which view mode the addon will be enabled in. In this case, the addon will be available in story and docs mode.

At this point you should see the outline selector tool in the toolbar 🎉

![Enable the outline tool](../../images/outline-tool.png)
