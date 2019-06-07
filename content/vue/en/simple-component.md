---
title: "Build a simple component"
tocTitle: "Simple component"
description: "Build a simple component in isolation"
commit: b2274bd
---

We’ll build our UI following a [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/task-states-learnstorybook.png)

`Task` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketch above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/components/Task.vue` and `src/components/Task.stories.js`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```html
<template>
  <div class="list-item">
    <input type="text" :readonly="true" :value="this.task.title" />
  </div>
</template>

<script>
  export default {
    name: "task",
    props: {
      task: {
        type: Object,
        required: true
      }
    }
  };
</script>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```javascript
import { storiesOf } from "@storybook/vue";
import { action } from "@storybook/addon-actions";

import Task from "./Task";

export const task = {
  id: "1",
  title: "Test Task",
  state: "TASK_INBOX",
  updatedAt: new Date(2018, 0, 1, 9, 0)
};

export const methods = {
  onPinTask: action("onPinTask"),
  onArchiveTask: action("onArchiveTask")
};

storiesOf("Task", module)
  .add("default", () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task }),
      methods
    };
  })
  .add("pinned", () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: "TASK_PINNED" } }),
      methods
    };
  })
  .add("archived", () => {
    return {
      components: { Task },
      template: `<task :task="task" @archiveTask="onArchiveTask" @pinTask="onPinTask"/>`,
      data: () => ({ task: { ...task, state: "TASK_ARCHIVED" } }),
      methods
    };
  });
```

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To initiate Storybook we first call the `storiesOf()` function to register the component. We add a display name for the component –the name that appears on the sidebar in the Storybook app.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `methods` variable and use pass them into our story defintion each time (where they are accessed via the `methods` property).

Another nice thing about bundling the `methods` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

To define our stories, we call `add()` once for each of our test states to generate a story. The action story is a function that returns a set of properties that define the story -- in this case a `template` string for the story alongside the `components`, `data` and `methods` that template consumes.

When creating a story we use a base task (`task`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We also have to make one small change to the Storybook configuration setup (`.storybook/config.js`) so it notices our `.stories.js` files and uses our CSS file. By default Storybook looks for stories in a `/stories` directory; this tutorial uses a naming scheme that is similar to the `.spec.js` naming scheme favoured by the Vue CLI for automated tests.

```javascript
import { configure } from "@storybook/vue";

import "../src/index.css";

const req = require.context('../src', true, /\.stories.js$/);
function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```html
<template>
  <div :class="taskClass">
    <label class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        :disabled="true"
        name="checked"
      />
      <span class="checkbox-custom" @click="$emit('archiveTask', task.id)" />
    </label>
    <div class="title">
      <input
        type="text"
        :readonly="true"
        :value="this.task.title"
        placeholder="Input title"
      />
    </div>
    <div class="actions">
      <a @click="$emit('pinTask', task.id)" v-if="!isChecked">
        <span class="icon-star" />
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: "task",
    props: {
      task: {
        type: Object,
        required: true
      }
    },
    computed: {
      taskClass() {
        return `list-item ${this.task.state}`;
      },
      isChecked() {
        return this.task.state === "TASK_ARCHIVED";
      }
    }
  };
</script>
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because Storybook is a quick way to view the new version of a component and visualize the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding a development dependency on the package:

```bash
yarn add --dev @storybook/addon-storyshots jest-vue-preprocessor babel-plugin-require-context-hook
```

Then create a `tests/unit/storybook.spec.js` file with the following in it:

```javascript
import registerRequireContextHook from "babel-plugin-require-context-hook/register";
import initStoryshots from "@storybook/addon-storyshots";

registerRequireContextHook();
initStoryshots();
```

We need to add a line to our `jest.config.js`:

```js
  transformIgnorePatterns: ["/node_modules/(?!(@storybook/.*\\.vue$))"],
```

Finally, we need to make a tweak to our `babel.config.js`:

```js
module.exports = api => ({
  presets: ["@vue/app"],
  ...(api.env("test") && { plugins: ["require-context-hook"] })
});
```

Once the above is done, we can run `yarn test:unit` and see the following output:

![Task test runner](/task-testrunner.png)

We now have a snapshot test for each of our `Task` stories. If we change the implementation of `Task`, we’ll be prompted to verify the changes.
