---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
commit: '27e1538'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`TaskComponent` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `TaskComponent`, we first write our test states that correspond to the different types of tasks sketch above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/app/components/task.component.ts` and `src/app/components/task.stories.ts`.

We’ll begin with the baseline implementation of the `TaskComponent`, simply taking in the inputs we know we’ll need and the two actions you can take on a task (to move it between lists):

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `,
})
export class TaskComponent {
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Above, we render straightforward markup for `TaskComponent` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```ts:title=src/app/components/task.stories.ts
import { moduleMetadata, Story, Meta } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { action } from '@storybook/addon-actions';

import { TaskComponent } from './task.component';

export default {
  component: TaskComponent,
  decorators: [
    moduleMetadata({
      declarations: [TaskComponent],
      imports: [CommonModule],
    }),
  ],
  excludeStories: /.*Data$/,
  title: 'Task',
} as Meta;

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const Template: Story<TaskComponent> = args => ({
  props: {
    ...args,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
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

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e. a component class with a set of props) in a given state---exactly like a [Functional Component](https://angular.io/guide/component-interaction).

As we have multiple permutations of our component, it's convenient to assign it to a `Template` variable. Introducing this pattern in your stories will reduce the amount of code you need to write and maintain.

<div class="aside">
💡 <code>Template.bind({})</code> is a <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">standard JavaScript</a> technique for making a copy of a function. We use this technique to allow each exported story to set its own properties, but use the same implementation.
</div>

Arguments or [`args`](https://storybook.js.org/docs/angular/writing-stories/args) for short, allow us to live edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/vue/writing-stories/args) value changes so does the component.

When creating a story we use a base `task` arg to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and pass them into our story definition each time.

Another nice thing about bundling the `actionsData` that a component needs, is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/essentials/actions"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We'll also need to make one small change to the Storybook configuration so it notices our recently created stories. Change your configuration file (`.storybook/main.js`) to the following:

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
};
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three states of TaskComponent:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to specify the shape of data that a component expects. Not only is it self documenting, it also helps catch problems early. Here, we'll use Typescript and create an interface for the `Task` model.

Create a new folder called `models` inside `app` folder and inside a new file called `task.model.ts` with the following content:

```ts:title=src/app/models/task.model.ts
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

Our component is still rather rudimentary at the moment. We're going to make some changes so that it matches the intended design without going into too much detail:

```diff:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

+ import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  template: `
+   <div class="list-item {{ task?.state }}">
+     <label class="checkbox">
+       <input
+         type="checkbox"
+         [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
+         disabled="true"
+         name="checked"
+       />
+       <span class="checkbox-custom" (click)="onArchive(task.id)"></span>
+     </label>
+     <div class="title">
+       <input
+         type="text"
+         [value]="task?.title"
+         readonly="true"
+         placeholder="Input title"
+       />
+     </div>
+     <div class="actions">
+       <a *ngIf="task?.state !== 'TASK_ARCHIVED'" (click)="onPin(task.id)">
+         <span class="icon-star"></span>
+       </a>
+     </div>
+   </div>
  `,
})
export class TaskComponent {
+ @Input() task: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();

+ /**
+  * Component method to trigger the onPin event
+  * @param id string
+  */
+ onPin(id: any) {
+   this.onPinTask.emit(id);
+ }
+ /**
+  * Component method to trigger the onArchive event
+  * @param id string
+  */
+ onArchive(id: any) {
+   this.onArchiveTask.emit(id);
+ }
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

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because it’s a quick way to view the new version of a component and check out the changes.

<div class="aside">
💡 Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding the following development dependency:

```bash
npm install -D @storybook/addon-storyshots
```

Then create the `src/storybook.test.js` file with the following in it:

```ts:title=src/storybook.test.js
import initStoryshots from '@storybook/addon-storyshots';

initStoryshots();
```

Finally we need to make a small change in the `jest` key in our `package.json`:

```diff:title=package.json
{
   "transform": {
      "^.+\\.(ts|html)$": "ts-jest",
      "^.+\\.js$": "babel-jest",
+     "^.+\\.stories\\.[jt]sx?$": "@storybook/addon-storyshots/injectFileName"
    },
}
```

Once the above is done, we can run `npm run test` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `TaskComponent` stories. If we change the implementation of `TaskComponent`, we’ll be prompted to verify the changes.

Additionally, `jest` will also run the test for `app.component.ts`.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
