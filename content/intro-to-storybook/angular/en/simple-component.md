---
title: 'Build the core component'
tocTitle: 'Core component'
description: 'Build the core component in isolation'
commit: 1a14919
---

We’ll build our UI following a [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`TaskComponent` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `TaskComponent`, we first write our test states that correspond to the different types of tasks sketch above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/app/tasks/task.component.ts` and `src/app/tasks/task.stories.ts`.

We’ll begin with the baseline implementation of the `TaskComponent`, simply taking in the inputs we know we’ll need and the two actions you can take on a task (to move it between lists):

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `,
})
export class TaskComponent implements OnInit {
  title: string;
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

Above, we render straightforward markup for `TaskComponent` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```typescript
import { action } from '@storybook/addon-actions';
import { TaskComponent } from './task.component';
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
export const Default = () => ({
  component: TaskComponent,
  props: {
    task: taskData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// pinned task state
export const Pinned = () => ({
  component: TaskComponent,
  props: {
    task: {
      ...taskData,
      state: 'TASK_PINNED',
    },
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// archived task state
export const Archived = () => ({
  component: TaskComponent,
  props: {
    task: {
      ...taskData,
      state: 'TASK_ARCHIVED',
    },
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
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
- `excludeStories` -- information required by the story, but should not be rendered by the Storybook app.

To define our stories, we export a function for each of our test states to generate a story. The story is a function that returns a rendered element (i.e. a component class with a set of props) in a given state---exactly like a React [Stateless Functional Component](https://reactjs.org/docs/components-and-props.html).

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and use pass them into our story definition each time.

Another nice thing about bundling the `actionsData` that a component needs, is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

When creating a story we use a base task (`taskData`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We also have to make one small change to the Storybook configuration setup (`.storybook/config.js`) so it notices our `.stories.ts` files and uses our CSS file. By default Storybook looks for stories in a `/stories` directory; this tutorial uses a naming scheme that is similar to the `.type.extension` naming scheme favoured when developing Angular apps.

```javascript
import { configure } from '@storybook/angular';

import '../src/styles.css';
configure(require.context('../src/app/', true, /\.stories\.ts$/), module);
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three states of TaskComponent:

<video autoPlay muted playsInline controls >
  <source
    src="/intro-to-storybook//inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to specify the shape of data that a component expects. Not only is it self documenting, it also helps catch problems early. Here, we'll use Typescript and create a interface for the `Task` model.

Create a new folder called `models` inside `app` folder and inside a new file called `task.model.ts` with the following content:

```typescript
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

Our component is still rather rudimentary at the moment. We're going to make some changes so that it matches the intended design without going into too much detail:

```typescript
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
  template: `
    <div class="list-item {{ task?.state }}">
      <label class="checkbox">
        <input
          type="checkbox"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          disabled="true"
          name="checked"
        />
        <span class="checkbox-custom" (click)="onArchive(task.id)"></span>
      </label>
      <div class="title">
        <input type="text" [value]="task?.title" readonly="true" placeholder="Input title" />
      </div>
      <div class="actions">
        <a *ngIf="task?.state !== 'TASK_ARCHIVED'" (click)="onPin(task.id)">
          <span class="icon-star"></span>
        </a>
      </div>
    </div>
  `,
})
export class TaskComponent implements OnInit {
  title: string;
  @Input() task: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onPin(id: any) {
    this.onPinTask.emit(id);
  }

  onArchive(id: any) {
    this.onArchiveTask.emit(id);
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

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because it’s a quick way to view the new version of a component and check out the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding a development dependency on the package:

```bash
npm install -D @storybook/addon-storyshots babel-plugin-require-context-hook
```

Update the `babel.config.js` that was created in the previous section to the following:

```javascript
module.exports = function(api) {
  const isTest = api.env('test');
  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ];
  return {
    presets,
    plugins: isTest ? ['require-context-hook'] : [],
  };
};
```

Then create the `src/storybook.test.js` file with the following in it:

```typescript
import registerRequireContextHook from 'babel-plugin-require-context-hook/register';
import initStoryshots from '@storybook/addon-storyshots';

registerRequireContextHook();
initStoryshots();
```

Finally we need to make a small change in the `jest` key in our `package.json`:

```json
{
  ....
   "transform": {
      "^.+\\.(ts|html)$": "ts-jest",
      "^.+\\.js$": "babel-jest",
      "^.+\\.stories\\.[jt]sx?$": "@storybook/addon-storyshots/injectFileName"

    },
}
```

Once the above is done, we can run `npm run jest` and see the following output:

![Task test runner](/intro-to-storybook/task-testrunner.png)

We now have a snapshot test for each of our `TaskComponent` stories. If we change the implementation of `TaskComponent`, we’ll be prompted to verify the changes.

Additionally, `jest` will also run the test for `app.component.ts`.
