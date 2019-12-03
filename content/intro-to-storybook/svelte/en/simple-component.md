---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
---

We’ll build our UI following a [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/components/Task.svelte` and `src/components/Task.stories.js`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```html
<!--src/components/Task.svelte-->
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updated_at: new Date(2019, 0, 1, 9, 0),
  };
</script>

<div class="list-item">
  <input type="text" value="{task.title}" readonly />
</div>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```javascript
// src/components/Task.stories.js
import Task from './Task.svelte';
import { actions, task } from './storybook-helper';

export default {
  title: 'Task',
  excludeStories: /.*Data$/,
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'Task_INBOX',
  updated_at: new Date(2019, 0, 1, 9, 0),
};

// default task state
export const Default = () => ({
  Component: Task,
  props: {
    task: taskData,
  },
  on: {
    ...actionsData,
  },
});
// pinned task state
export const Pinned = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: 'TASK_PINNED',
    },
  },
  on: {
    ...actionsData,
  },
});
// archived task state
export const Archived = () => ({
  Component: Task,
  props: {
    task: {
      ...taskData,
      state: 'TASK_ARCHIVED',
    },
  },
  on: {
    ...actionsData,
  },
});
```

Due to some language restraints the default action was named `Default` as the lowercase it's a reserved word, the `excludeStories` prop was added to avoid Storybook treating both the `taskData` and `actionsData` as actual stories, you can read more about it [here](https://storybook.js.org/docs/formats/component-story-format/#non-story-exports).

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

Up until now, to initiate Storybook we first had to call the `storiesOf()` function to register the component. Then set a display name for the component –the name that appears on the sidebar in the Storybook app. As of now you can simplify the way the stories are written and later consumed by Storybook, by using standard ES6 exports. You can read more about it [here](https://storybook.js.org/docs/formats/component-story-format/).

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actions` variable and pass them into our story definition each time (where they will be accessed when the `dispatch` function is invoked).

Another nice thing about bundling the `actions` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

When creating a story we use a base task (`task`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We also have to make one small change to the Storybook configuration setup (`.storybook/config.js`) so it notices our `.stories.js` files and uses our CSS file. By default Storybook looks for stories in a `/stories` directory; this tutorial uses a naming scheme that is similar to the `.test.js` or `.spec.js` naming scheme favoured by CRA or Vue CLI for automated tests.

```javascript
// .storybook/config.js
import { configure } from '@storybook/svelte';
import '../src/index.css';
configure(require.context('../src/components', true, /\.stories\.js$/), module);
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

```html
<!--src/components/Task.svelte-->

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // event handler for Pin Task
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }
  // event handler for Archive Task
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  // Task props
  export let task = {
    id: '',
    title: '',
    state: '',
    updated_at: new Date(2019, 0, 1, 9, 0),
  };

  // reactive declaration (computed prop in other frameworks)
  $: isChecked = task.state === 'TASK_ARCHIVED';
</script>
<div class="{`list-item" ${task.state}`}>
  <label class="checkbox">
    <input type="checkbox" checked="{isChecked}" disabled name="checked" />
    <span class="checkbox-custom" on:click="{ArchiveTask}" />
  </label>
  <div class="title">
    <input type="text" readonly value="{task.title}" placeholder="Input title" />
  </div>
  <div class="actions">
    {#if task.state !== 'TASK_ARCHIVED'}
    <a href="/" on:click|preventDefault="{PinTask}">
      <span class="icon-star" />
    </a>
    {/if}
  </div>
</div>
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

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

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding the following development dependencies:

```bash
npm install -D @storybook/addon-storyshots babel-plugin-require-context-hook
```

Then create an `src/storybook.test.js` file with the following in it:

```javascript
// src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

And enable it by changing the `.babelrc` file in the root folder of your app (same level as `package.json`) to the following:

```json
// .babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "env": {
    "test": {
      "plugins": ["require-context-hook"]
    }
  }
}
```

Then update `.storybook/config.js` to have:

```js
// .storybook/config.js
import { configure } from '@storybook/svelte';
import '../src/index.css';

const req = require.context('../src/components', true, /\.stories\.js$/);

configure(req, module);
```

We have almost everything in place to allow snapshot testing with jest and Storybook. We need to take a couple of final steps for our environment to work correctly.

First create a new file `.jest/register-context.js` and add the following content:

```javascript
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
registerRequireContextHook();
```

With this file we're making sure Storybook and Jest can introspect our project and make the necessary snapshot tests.

And finally we need to make a small adjustment to our `jest` key in `package.json`:

```json
{
  .....
  "jest":{
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.stories\\.[jt]sx?$": "<rootDir>node_modules/@storybook/addon-storyshots/injectFileName",
      "^.+\\.svelte$": "jest-transform-svelte"
    },
    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect",
      "<rootDir>/.jest/register-context.js"
    ],
  }
}
```

Once all the above is done, we can run `npm run test` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.
