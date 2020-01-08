---
title: 'Addons'
tocTitle: 'Addons'
description: 'Lerne an einem bekannten Beispiel, Addons zu integrieren und zu nutzen'
commit: 'dac373a'
---

Storybook rühmt sich eines robuten [Addon-Systems](https://storybook.js.org/addons/introduction/), über das sich die Entwicklungserfahrung all deiner Teammitglieder verbessern lässt. Wenn du diesem Tutorial linear gefolgt bist, haben wir bereits einige Addons erwähnt und du hast bereits eines im [Kapitel über Tests](/react/de/test/) implementiert.

<div class="aside">
<strong>Auf der Suche nach einer Liste verfügbarer Addons?</strong>
<br/>
😍 <a href="https://storybook.js.org/addons/addon-gallery/">Hier</a> findest du die Liste offiziell unterstützter und aktiv unterstützer Community Addons.
</div>

Wir könnten unendlich viel über die Verwendung von Addons für all deine speziellen Anwendungsfälle schreiben. Für's Erste, lass uns auf die Integration eines der am weitesten verbreiteten Addons innerhalb des Storybook-Ökosystems hinarbeiten: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Knobs einrichten

Knobs ist eine tolle Ressource für Designer und Entwickler, um in einer kontrollierten Umgebung mit Komponenten herum zu experimentieren und zu spielen, ohne die Notwendigkeit von Code! Im Grunde stellst du dynamisch definierte Felder zur Verfügung, mit denen ein Benutzer die Props manipulieren kann, die den Komponenten deiner Stories übergeben werden. Folgendes werden wir entwickeln...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

First, we will need to install all the necessary dependencies.

```bash
yarn add @storybook/addon-knobs
```

Register Knobs in your `.storybook/addons.js` file.

```javascript
// .storybook/addons.js

import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
<strong>📝 Addon registration order matters!</strong>
<br/>
The order you list these addons will dictate the order in which they appear as tabs on your addon panel (for those that appear there).
</div>

That's it! Time to use it in a story.

### Usage

Let's use the object knob type in the `Task` component.

First, import the `withKnobs` decorator and the `object` knob type to `Task.stories.js`:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

Next, within the `default` export of `Task.stories.js` file, add `withKnobs` to the `decorators` key:

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

Lastly, integrate the `object` knob type within the "default" story:

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

Now a new "Knobs" tab should show up next to the "Action Logger" tab in the bottom pane.

As documented [here](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), the `object` knob type accepts a label and a default object as parameters. The label is constant and shows up to the left of a text field in your addons panel. The object you've passed will be represented as an editable JSON blob. As long as you submit valid JSON, your component will adjust based upon the data being passed to the object!

## Addons Evolve Your Storybook's Scope

Not only does your Storybook instance serve as a wonderful [CDD environment](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), but now we're providing an interactive source of documentation. PropTypes are great, but a designer or somebody completely new to a component's code will be able to figure out its behavior very quickly via Storybook with the knobs addon implemented.

## Using Knobs To Find Edge-Cases

Additionally, with easy access to editing passed data to a component, QA Engineers or preventative UI Engineers can now push a component to the limit! As an example, what happens to `Task` if our list item has a _MASSIVE_ string?

![Oh no! The far right content is cut-off!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Thanks to quickly being able to try different inputs to a component we can find and fix such problems with relative ease! Let's fix the issue with overflowing by adding a style to `Task.js`:

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![That's better.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Adding A New Story To Avoid Regressions

Of course we can always reproduce this problem by entering the same input into the knobs, but it's better to write a fixed story for this input. This will increase your regression testing and clearly outline the limits of the component(s) to the rest of your team.

Let's add a story for the long text case in Task.stories.js:

```javascript
// src/components/Task.stories.js

const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

Now we've added the story, we can reproduce this edge-case with ease whenever we want to work on it:

![Here it is in Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

If we are using [visual regression testing](/react/en/test/), we will also be informed if we ever break our ellipsizing solution. Such obscure edge-cases are always liable to be forgotten!

### Merge Changes

Don't forget to merge your changes with git!

## Sharing Addons With The Team

Knobs is a great way to get non-developers playing with your components and stories. However, it can be difficult for them to run the storybook on their local machine. That's why deploying your storybook to an online location can be really helpful. In the next chapter we'll do just that!
