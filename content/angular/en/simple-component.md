---
title: "Build a simple component"
tocTitle: "Simple component"
description: "Build a simple component in isolation"
commit: 131aade
---

# Build a simple component

We’ll build our UI following a [Component-Driven Development](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/task-states-learnstorybook.png)

`TaskComponent` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

* `title` – a string describing the task
* `state` - which list is the task currently in and is it checked off?

As we start to build `TaskComponent`, we first write our test states that correspond to the different types of tasks sketch above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://blog.hichroma.com/visual-test-driven-development-aec1c98bed87)”.

## Get setup

First, let’s create the task component and its accompanying story file: `src/tasks/task.component.ts` and `src/tasks/task.stories.ts`.

We’ll begin with a basic implementation of the `TaskComponent`, simply taking in the inputs we know we’ll need and the two actions you can take on a task (to move it between lists):

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'task-item',
  template: `
    <div class="list-item">
      <input type="text" [value]="task.title" readonly="true" />
    </div>
  `,
})
export class TaskComponent implements OnInit {
  title: string;
  @Input() task: any;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}

```

Above, we render straightforward markup for `TaskComponent` based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';

import { TaskComponent } from './task.component';

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
  .addDecorator(
    moduleMetadata({
      declarations: [TaskComponent],
    }),
  )
  .add('default', () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task,
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask,
      },
    };
  })
  .add('pinned', () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task: { ...task, state: 'TASK_PINNED' },
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask,
      },
    };
  })
  .add('archived', () => {
    return {
      template: `<task-item [task]="task" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)" ></task-item>`,
      props: {
        task: { ...task, state: 'TASK_ARCHIVED' },
        onPinTask: actions.onPinTask,
        onArchiveTask: actions.onArchiveTask,
      },
    };
  });

```

There are two basic levels of organization in Storybook. The component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

* **Component**
  * Story
  * Story
  * Story

To initiate Storybook we first call the `storiesOf()` function to register the component. We add a display name for the component –the name that appears on the sidebar in the Storybook app.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine in the test UI if a button click is successful.

It is convenient to bundle the actions up into a single `actions` variable. That way we can `export` them and use them in stories for components that reuse this component, as we'll see later.

To define our stories, we call `add()` once for each of our test states to generate a story. The action story is a function that returns a rendered element (i.e. a component class with a set of props) in a given state.

When creating a story we use a base task (`task`) to build out the shape of the task the component expects. This is typically modelled from what the true data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#2-native-addons"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

## Config

We also have to make one small change to the Storybook configuration setup (`.storybook/config.js`) so it notices our `.stories.ts` files and uses our LESS file. By default Storybook looks for stories in a `/stories` directory; this tutorial uses a naming scheme that is similar to the `.type.extension` naming scheme favoured when developing Angular apps.

```typescript
import {
  configure
} from '@storybook/angular';

import '../src/styles.less';

// automatically import all files ending in *.stories.ts
const req = require.context('../src/', true, /.stories.ts$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);

```

In order to support that LESS import we'll need to play around a bit with webpack. Just create a `webpack.config.js` file inside the `.storybook` folder and paste the following:

```javascript
const path = require("path");

module.exports = {
  module: {
    rules: [{
      test: /\.less$/,
      loaders: ["style-loader", "css-loader", "less-loader"],
      include: path.resolve(__dirname, "../")
    }]
  }
};

```
You'll also need to install the corresponding loaders:

```
yarn add -D less-loader css-loader style-loader
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three TaskComponent states:

<video autoPlay muted playsInline controls >
  <source
    src="/inprogress-task-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now we have Storybook setup, styles imported, and test cases built out, we can quickly start the work of implementing the HTML of the component to match the design.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'task-item',
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
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onPin(id) {
    this.onPinTask.emit(id);
  }

  onArchive(id) {
    this.onArchiveTask.emit(id);
  }
}
```

The additional markup from above combined with the CSS we imported earlier yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/finished-task-states.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to specify the shape of data that a component expects. Not only is it self documenting, it also helps catch problems early. Here, we've done this using TypeScript and creating an interface for the `Task` model:

```typescript
export interface Task {
  id: string;
  title: string;
  state: string;
}
```

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with less bugs and more polish because it’s possible to dig in and test every possible state.

## Automated Testing

Storybook gave us a great way to visually test our application during construction. The ‘stories’ will help ensure we don’t break our Task visually as we continue to develop the app. However, it is a completely manual process at this stage, and someone has to go to the effort of clicking through each test state and ensuring it renders well and without errors or warnings. Can’t we do that automatically?

### Snapshot testing

Snapshot testing refers to the practice of recording the “known good” output of a component for a given input and then flagging the component whenever the output changes in future. This complements Storybook, because it’s a quick way to view the new version of a component and check out the changes.

<div class="aside">
Make sure your components render data that doesn't change, so that your snapshot tests won't fail each time. Watch out for things like dates or randomly generated values.
</div>

With the [Storyshots addon](https://github.com/storybooks/storybook/tree/master/addons/storyshots) a snapshot test is created for each of the stories. Use it by adding a development dependency on the package:

```bash
yarn add -D @storybook/addon-storyshots identity-object-proxy jest jest-preset-angular
```

Then create an `src/storybook.test.ts` file with the following in it:

```typescript
import * as path from 'path';
import initStoryshots, {
  multiSnapshotWithOptions,
} from '@storybook/addon-storyshots';

initStoryshots({
  framework: 'angular',
  configPath: path.join(__dirname, '../.storybook'),
  test: multiSnapshotWithOptions(),
});

```
After that, create a `src/jest-config` folder with two files inside, `globalMocks.ts`: 

```typescript
const mock = () => {
  let storage = {};
  return {
    getItem: key => (key in storage ? storage[key] : null),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {}),
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ['-webkit-appearance'],
});

```
and `setup.ts`:

```typescript
import 'jest-preset-angular';
import './globalMocks';

```
Then we need to add a new field to our `package.json`,

```json
"jest": {
    "coveragePathIgnorePatterns": [
      "/jest-config/",
      "/node_modules/"
    ],
    "preset": "jest-preset-angular",
    "setupTestFrameworkScriptFile": "<rootDir>/src/jest-config/setup.ts",
    "snapshotSerializers": [
      "<rootDir>/node_modules/jest-preset-angular/AngularSnapshotSerializer.js",
      "<rootDir>/node_modules/jest-preset-angular/HTMLCommentSerializer.js"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/build/",
      "/storybook-static/"
    ],
    "transform": {
      "^.+\\.(ts|js|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js"
    },
    "moduleNameMapper": {
      "\\.(css|less)$": "identity-obj-proxy"
    }
  },
  ```
a couple of new scripts to run `jest`

  ```json
  "scripts": {
    ...
    "jest": "jest",
    "jest:watch": "jest --watch"
  }
  ```
and update `src/tsconfig.app.json` to exclude `.test.ts` files

```json
"exclude": [
    "src/test.ts",
    "**/*.stories.ts",
    "**/*.spec.ts",
    "**/*.test.ts"
  ]
```

Once the above is done, we can run `yarn jest` and see the following output:

![Task test runner](/task-testrunner.png)

We now have a snapshot test for each of our `TaskComponent` stories. If we change the implementation of `TaskComponent`, we’ll be prompted to verify the changes.

Additionally, `jest` will also run the test for `app.component.ts`.
