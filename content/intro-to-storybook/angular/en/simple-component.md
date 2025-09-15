---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
commit: 'a4bf2a8'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom-up”, starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` is the core component of our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in, and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

## Get set up

First, let’s create the task component and its accompanying story file: `src/app/components/task.component.ts` and `src/app/components/task.stories.ts`.

We’ll begin with the baseline implementation of the `Task` component, simply taking in the inputs we know we’ll need and the two actions you can take on a task (to move it between lists):

```ts:title=src/app/components/task.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item">
      <label [attr.aria-label]="task.title + ''" for="title">
        <input
          type="text"
          [value]="task.title"
          readonly="true"
          id="title"
          name="title"
        />
      </label>
    </div>
  `
})

export class TaskComponent {
  /**
  * The shape of the task object
 */
  @Input() task: any;

  @Output()
  onPinTask = new EventEmitter<Event>();

  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Above, we render straightforward markup for the `Task` component based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```ts:title=src/app/components/task.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { fn } from 'storybook/test';

import { TaskComponent } from './task.component';

export const TaskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX',
  events: {
    onArchiveTask: fn(),
    onPinTask: fn(),
  },
};

const meta: Meta<TaskComponent> = {
  title: 'Task',
  component: TaskComponent,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  args: {
    ...TaskData.events
  },
};


export default meta;
type Story = StoryObj<TaskComponent>;

export const Default: Story = {
  args: {
    task: TaskData,
  },
}

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_PINNED',
    },
  },
}

export const Archived: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_ARCHIVED',
    },
  },
}
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions) help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use `fn()` to stub them in.

</div>

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are testing, we create a `default` export that contains:

- `component` -- the component itself
- `title` -- how to group or categorize the component in the Storybook sidebar
- `tags` -- to automatically generate documentation for our components
- `excludeStories`-- additional information required by the story but should not be rendered in Storybook
- `args` -- define the action [args](https://storybook.js.org/docs/essentials/actions#action-args) that the component expects to mock out the custom events

To define our stories, we'll use Component Story Format 3 (also known as [CSF3](https://storybook.js.org/docs/api/csf) ) to build out each of our test cases. This format is designed to build out each of our test cases in a concise way. By exporting an object containing each component state, we can define our tests more intuitively and author and reuse stories more efficiently.

Arguments or [`args`](https://storybook.js.org/docs/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/writing-stories/args) value changes, so does the component.

`fn()` allows us to create a callback that appears in the **Actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `TaskData` variable and pass them into our story definition each time. Another nice thing about bundling the `TaskData` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

## Config

We'll also need to make one small change to the Storybook configuration to notice our recently created stories. Change your configuration file (`.storybook/main.ts`) to the following:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';

const config: StorybookConfig = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
};

export default config;
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three Task states:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/angular-inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Now that we have Storybook set up, styles imported, and test cases built out, we can quickly start implementing the HTML of the component to match the design.

The component is still rudimentary at the moment. First, write the code that achieves the design without going into too much detail:

```ts:title=src/app/components/task.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item {{ task?.state }}">
      <label
        [attr.aria-label]="'archiveTask-' + task?.id"
        for="checked-{{ task?.id }}"
        class="checkbox"
      >
        <input
          type="checkbox"
          disabled="true"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          name="checked-{{ task?.id }}"
          id="checked-{{ task?.id }}"
        />
        <span class="checkbox-custom" (click)="onArchive(task?.id)"></span>
      </label>
      <label
        [attr.aria-label]="task?.title + ''"
        for="title-{{ task?.id }}"
        class="title"
      >
        <input
          type="text"
          [value]="task?.title"
          readonly="true"
          id="title-{{ task?.id }}"
          name="title-{{ task?.id }}"
          placeholder="Input title"
        />
      </label>
      <button
        *ngIf="task?.state !== 'TASK_ARCHIVED'"
        class="pin-button"
        [attr.aria-label]="'pinTask-' + task?.id"
        (click)="onPin(task?.id)"
      >
        <span class="icon-star"></span>
      </button>
    </div>
  `,
})

export class TaskComponent {
  /**
  * The shape of the task object
 */
  @Input() task: any;

  /**
   * Event handler for pinning tasks
   */
  @Output()
  onPinTask = new EventEmitter<Event>();

  /**
   * Event handler for archiving tasks
   */
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  /**
   * @ignore
   * Component method to trigger the onPin event
   * @param id string
   */
  onPin(id: any) {
    this.onPinTask.emit(id);
  }
  /**
   * @ignore
   * Component method to trigger the onArchive event
   * @param id string
   */
  onArchive(id: any) {
    this.onArchiveTask.emit(id);
  }
}
```

The additional markup from above, combined with our existing CSS (see `src/styles.css` and `angular.json` for configuration), yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/angular-finished-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

As we continue to build out our components, we can specify the shape of the data that the `Task` component expects by defining a TypeScript type. This way, we can catch errors early and ensure the component is used correctly when adding more complexity. Start by creating a `types.ts` file in the `src/app` folder and move our existing `TaskData` type there:

```ts:title=src/app/types.ts
export type TaskData = {
  id?: string;
  title?: string;
  state?: string;
};
```

Then, update the `Task` component to use our newly created type:

```ts:title=src/app/components/task.component.ts
import type { TaskData } from '../types';

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item {{ task?.state }}">
      <label
        [attr.aria-label]="'archiveTask-' + task?.id"
        for="checked-{{ task?.id }}"
        class="checkbox"
      >
        <input
          type="checkbox"
          disabled="true"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          name="checked-{{ task?.id }}"
          id="checked-{{ task?.id }}"
        />
        <span class="checkbox-custom" (click)="onArchive(task?.id)"></span>
      </label>
      <label
        [attr.aria-label]="task?.title + ''"
        for="title-{{ task?.id }}"
        class="title"
      >
        <input
          type="text"
          [value]="task?.title"
          readonly="true"
          id="title-{{ task?.id }}"
          name="title-{{ task?.id }}"
          placeholder="Input title"
        />
      </label>
      <button
        *ngIf="task?.state !== 'TASK_ARCHIVED'"
        class="pin-button"
        [attr.aria-label]="'pinTask-' + task?.id"
        (click)="onPin(task?.id)"
      >
        <span class="icon-star"></span>
      </button>
    </div>
  `,
})

export class TaskComponent {
  /**
  * The shape of the task object
 */
  @Input() task?: TaskData;

  /**
   * Event handler for pinning tasks
   */
  @Output()
  onPinTask = new EventEmitter<Event>();

  /**
   * Event handler for archiving tasks
   */
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  /**
   * @ignore
   * Component method to trigger the onPin event
   * @param id string
   */
  onPin(id: any) {
    this.onPinTask.emit(id);
  }
  /**
   * @ignore
   * Component method to trigger the onArchive event
   * @param id string
   */
  onArchive(id: any) {
    this.onArchiveTask.emit(id);
  }
}
```

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
