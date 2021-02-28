---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Get setup

First, let’s create the necessary files for our task component and its accompanying story file: `app/components/task.hbs` and `app/components/task.stories.js`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```hbs:title=app/components/task.hbs
<div class="list-item">
  <input type="text" value={{@task.title}} readonly={{true}}/>
</div>
```

Above, we render straightforward markup for `Task` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```js:title=app/components/task.stories.js
import { hbs } from 'ember-cli-htmlbars';

import { action } from '@storybook/addon-actions';

export default {
  title: 'Task',
  component: 'task',
  excludeStories: /.*Data$/,
};

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template = args => ({
  template: hbs`<Task @task={{this.task}} @pin={{fn this.onPinTask}} @archive={{fn this.onArchiveTask}}/>`,
  context: args,
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
  ...actionsData,
};

export const Pinned = Template.bind({});
Pinned.args = {
  ...Default.args,
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  ...Default.args,
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
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
- `argTypes` -- specify the [args](https://storybook.js.org/docs/ember/api/argtypes) behavior in each story.

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e. a component with a set of props) in a given state---exactly like a [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

As we have multiple permutations of our component, it's convenient to assign it to a `Template` variable. Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/ember/essentials/actions"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

Arguments or [`args`](https://storybook.js.org/docs/ember/writing-stories/args) for short, allow us to live edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/ember/writing-stories/args) value changes so does the component.

When creating a story we use a base `task` arg to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/ember/essentials/actions"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We'll also need to make one small change to the Storybook configuration so it notices our recently created stories. Change your configuration file (`.storybook/main.js`) to the following:

```diff:title=.storybook/main.js
module.exports = {
+ stories: ['../app/components/**/*.stories.js'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links'],
};
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```diff:title=app/components/task.hbs
+ <div class="list-item {{@task.state}}" data-test-task>
+   <label class="checkbox">
+     <input
+       type="checkbox"
+       disabled
+       name="checked"
+       checked={{this.isArchived}}
+     />
+     <span
+       class="checkbox-custom"
+       data-test-task-archive
+       {{on "click" this.archive}}
+     ></span>
+   </label>
+   <div class="title">
+     <input
+       type="text"
+       readonly
+       value={{@task.title}}
+       placeholder="Input title"
+     />
+   </div>
+   <div class="actions">
+     {{#unless this.isArchived}}
+       <span data-test-task-pin {{on "click" this.pin}}>
+         <span class="icon-star"></span>
+       </span>
+     {{/unless}}
+   </div>
+ </div>
```

Then we'll need create a new file called `app/components/task.js` with the following:

```js:title=app/components/task.js
import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class Task extends Component {
  // Computed property for the component (to assign a value to the task state checkbox)
  get isArchived() {
    return this.args.task.state === 'TASK_ARCHIVED';
  }

  @action
  pin() {
    this.args.pin?.(this.args.task.id);
  }

  @action
  archive() {
    this.args.archive?.(this.args.task.id);
  }
}
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
