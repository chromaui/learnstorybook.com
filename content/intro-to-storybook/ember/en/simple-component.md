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

First, let’s create the necessary files for our task component and its accompanying story file: `app/components/Task.hbs` and `app/components/Task.stories.js`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```handlebars

{{!--  app/components/Task.hbs --}}

<div class="list-item">
  <input type="text" value={{@task.title}} readonly={{true}}/>
</div>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```javascript
//  app/components/Task.stories.js
import { hbs } from 'ember-cli-htmlbars';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Task',
  component: 'Task',
  excludeStories: /.*Data$/,
};

export const taskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  updatedAt: new Date(2018, 0, 1, 9, 0),
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export const Default = () => ({
  template: hbs`{{Task task=task pinTask=(action taskActions.onPinTask) archiveTask=(action taskActions.onArchiveTask)}}`,
  context: {
    task: {
      ...taskData,
    },
    taskActions: {
      ...actionsData,
    },
  },
});

export const Pinned = () => ({
  template: hbs`{{Task task=task pinTask=(action taskActions.onPinTask) archiveTask=(action taskActions.onArchiveTask)}}`,
  context: {
    task: {
      ...taskData,
      state: 'TASK_PINNED',
    },
    taskActions: {
      ...actionsData,
    },
  },
});

export const Archived = () => ({
  template: hbs`{{Task task=task pinTask=(action taskActions.onPinTask) archiveTask=(action taskActions.onArchiveTask)}}`,
  context: {
    task: {
      ...taskData,
      state: 'TASK_ARCHIVED',
    },
    taskActions: {
      ...actionsData,
    },
  },
});
```

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component` -- the component itself,
- `title` -- how to refer to the component in the sidebar of the Storybook app,
- `excludeStories` -- exports in the story file that should not be rendered as stories by Storybook.

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e. a component with a set of props) in a given state---exactly like a [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them into a single `actionData` variable and pass them into our story definition each time (where they accessed when triggered!!!).

Another nice thing about bundling the actions into `actionsData` is that you can `export` that variable and use the actions in stories for components that reuse this component, as we'll see later.

When creating a story we use a base task (`taskData`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We'll also need to make one small change to the Storybook configuration so it notices our recently created stories. Change your configuration file (`.storybook/main.js`) to the following:

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../app/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
};
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

```handlebars

{{!--  app/components/Task.hbs --}}
<div class="list-item {{@task.state}}">
  <label class="checkbox">
    <input type="checkbox" disabled name="checked" checked={{this.isTaskArchived}}/>
    <span class="checkbox-custom" onclick={{this.handleArchiveTask}}/>
  </label>
  <div class="title">
    <input type="text" readonly value={{@task.title}} placeholder="Input title" />
  </div>
  <div class="actions">
    {{#if (not-eq @task.state "TASK_ARCHIVED")}}
      <a href="/" onclick={{this.handlePinTask}}><span class="icon-star"  /></a>
    {{/if}}
  </div>
</div>
```

Then we'll need create a new file called `app/components/Task.js` with the following:

```js
// app/components/Task.js
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Task extends Component {
  constructor() {
    super(...arguments);
  }
  // computed property for the component (to assign a value to the task state checkbox)
  get isTaskArchived() {
    return this.args.task.state === 'TASK_ARCHIVED';
  }
  // actions to emulate the click handlers to call the actions passed down to the component
  @action
  handlePinTask(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.args.pinTask) {
      this.args.pinTask(this.args.task.id);
    }
  }
  @action
  handleArchiveTask() {
    if (this.args.archiveTask) {
      this.args.archiveTask(this.args.task.id);
    }
  }
}
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
