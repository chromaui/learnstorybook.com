---
title: 'Baue eine einfache Komponente'
tocTitle: 'Einfache Komponente'
description: 'Baue eine einfache Komponente in Isolation'
commit: 403f19a
---

Beim Bauen unserer UI werden wir nach der [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) Methodik vorgehen. Das it ein Vorgehen, in dem UIs "buttom up" entwickelt werden. Man beginnt mit Komponenten und endet mit Screens. CDD hilft dabei, die Komplexität zu begrenzen, mit der man beim Bauen einer UI konfrontiert wird.

## Task

![Task-Komponente in drei Zuständen](/intro-to-storybook/task-states-learnstorybook.png)

`Task` ist die zentrale Komponente in unserer App. Jede Aufgabe wird ein wenig anders angezeigt, abhängig davon, in welchem Zustand sie sich befindet. Wir zeigen eine ausgewählte (oder nicht ausgewählte) Checkbox an, einige Informationen über die Aufgabe und einen "Pin"-Button, der uns erlaubt, Aufgaben in der Liste hoch oder runter zu bewegen. Daraus ergeben sich folgende Props:

- `title` – ein String, der die Aufgabe beschreibt
- `state` - In welcher Liste befindet sich die Aufgabe aktuell und ist sie abgeschlossen?

Beim Entwickeln der `Task`-Komponente, schreiben wir zunächst unsere Test-Zustände, die den oben skizzierten möglichen Aufgaben-Typen entsprechen. Anschließend verwenden wir Storybook, um die Komponente mit gemockted Daten isoliert zu entwickeln. Wärend wir entwickeln, prüfen wir die Komponente in jedem möglichen Zustand auf ihre visuelle Erscheinung.

Dieses Vorgehen ähnelt der [testgetriebenen Entwicklung](https://de.wikipedia.org/wiki/Testgetriebene_Entwicklung) (TDD). Wir nennen es “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/components/Task.js` and `src/components/Task.stories.js`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <input type="text" value={title} readOnly={true} />
    </div>
  );
}
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import Task from './Task';

export const task = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actions = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To initiate Storybook we first call the `storiesOf()` function to register the component. We add a display name for the component –the name that appears on the sidebar in the Storybook app.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actions` variable and use React's `{...actions}` props expansion to pass them all at once. `<Task {...actions}>` is equivalent to `<Task onPinTask={actions.onPinTask} onArchiveTask={actions.onArchiveTask}>`.

Another nice thing about bundling the `actions` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

To define our stories, we call `add()` once for each of our test states to generate a story. The action story is a function that returns a rendered element (i.e. a component class with a set of props) in a given state---exactly like a React [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

When creating a story we use a base task (`task`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We also have to make one small change to the Storybook configuration setup (`.storybook/config.js`) so it notices our `.stories.js` files and uses our CSS file. By default Storybook looks for stories in a `/stories` directory; this tutorial uses a naming scheme that is similar to the `.test.js` naming scheme favoured by CRA for automated tests.

```javascript
// .storybook/config.js

import { configure } from '@storybook/react';
import '../src/index.css';

const req = require.context('../src', true, /\.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```javascript
// src/components/Task.js

import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input type="text" value={title} readOnly={true} placeholder="Input title" />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to use `propTypes` in React to specify the shape of data that a component expects. Not only is it self documenting, it also helps catch problems early.

```javascript
// src/components/Task.js

import React from 'react';
import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
  }),
  onArchiveTask: PropTypes.func,
  onPinTask: PropTypes.func,
};
```

Now a warning in development will appear if the Task component is misused.

<div class="aside">
An alternative way to achieve the same purpose is to use a JavaScript type system like TypeScript to create a type for the component properties.
</div>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because it’s a quick way to view the new version of a component and check out the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding a development dependency on the package:

```bash
yarn add --dev @storybook/addon-storyshots react-test-renderer require-context.macro
```

Then create an `src/storybook.test.js` file with the following in it:

```javascript
// src/storybook.test.js

import initStoryshots from '@storybook/addon-storyshots';
initStoryshots();
```

You'll also need to use a [babel macro](https://github.com/kentcdodds/babel-plugin-macros) to ensure `require.context` (some webpack magic) runs in Jest (our test context). Install it with:

```bash
yarn add --dev babel-plugin-macros
```

And enable it by adding a `.babelrc` file in the root folder of your app (same level as `package.json`)

```json
// .babelrc

{
  "plugins": ["macros"]
}
```

Then update `.storybook/config.js` to have:

```js
// .storybook/config.js

import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

(Notice we've replaced `require.context` with a call to `requireContext` imported from the macro).

Once the above is done, we can run `yarn test` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.
