---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
commit: 'b4ebe43'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom-up”, starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` is the core component of our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in, and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to create the component in isolation using mocked data. We’ll manually test the component’s appearance given each state as we go.

## Get set up

First, let’s create the task component and its accompanying story file: `src/app/components/task.component.ts` and `src/app/components/task.stories.ts`.

We’ll begin with the baseline implementation of the `Task` component, simply taking in the inputs we know we’ll need and the two actions you can take on a task (to move it between lists):

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
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
  `,
})
export default class TaskComponent {
  /**
   * The shape of the task object
  */
  @Input() task: any;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Above, we render straightforward markup for the `Task` component based on the existing HTML structure of the Todos app.

Below we build out Task’s three test states in the story file:

```ts:title=src/app/components/task.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate } from '@storybook/angular';

import { action } from '@storybook/addon-actions';

import TaskComponent from './task.component';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

const meta: Meta<TaskComponent> = {
  title: 'Task',
  component: TaskComponent,
  excludeStories: /.*Data$/,
  tags: ['autodocs'],
  render: (args: TaskComponent) => ({
    props: {
      ...args,
      onPinTask: actionsData.onPinTask,
      onArchiveTask: actionsData.onArchiveTask,
    },
    template: `<app-task ${argsToTemplate(args)}></app-task>`,
  }),
};

export default meta;
type Story = StoryObj<TaskComponent>;

export const Default: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived: Story = {
  args: {
    task: {
      ...Default.args?.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/essentials/actions"><b>Actions</b></a> help you verify interactions when building UI components in isolation. Oftentimes you won't have access to the functions and state you have in context of the app. Use <code>action()</code> to stub them in.
</div>

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component` -- the component itself
- `title` -- how to group or categorize the component in the Storybook sidebar
- `tags` -- to automatically generate documentation for our components
- `excludeStories`-- additional information required by the story but should not be rendered in Storybook
- `render` -- a custom [render function](https://storybook.js.org/docs/angular/api/csf#custom-render-functions) that allows us how the component is rendered in Storybook
- `argsToTemplate` -- a helper function that converts the args to property and event bindings for the component, providing robust workflow support for Storybook's controls and the component's inputs and outputs

To define our stories, we'll use Component Story Format 3 (also known as [CSF3](https://storybook.js.org/docs/angular/api/csf) ) to build out each of our test cases. This format is designed to build out each of our test cases in a concise way. By exporting an object containing each component state, we can define our tests more intuitively and author and reuse stories more efficiently.

Arguments or [`args`](https://storybook.js.org/docs/angular/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/angular/writing-stories/args) value changes, so does the component.

`action()` allows us to create a callback that appears in the **actions** panel of the Storybook UI when clicked. So when we build a pin button, we’ll be able to determine if a button click is successful in the UI.

As we need to pass the same set of actions to all permutations of our component, it is convenient to bundle them up into a single `actionsData` variable and pass them into our story definition each time. Another nice thing about bundling the `actionsData` that a component needs is that you can `export` them and use them in stories for components that reuse this component, as we'll see later.

When creating a story, we use a base `task` arg to build out the shape of the task the component expects. Typically modeled from what the actual data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

## Config

We'll also need to make one small change to the Storybook configuration to notice our recently created stories. Change your configuration file (`.storybook/main.ts`) to the following:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/app/components/**/*.stories.ts'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;
```

Once we’ve done this, restarting the Storybook server should yield test cases for the three states of TaskComponent:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Specify data requirements

It’s best practice to specify the shape of data that a component expects. Not only is it self documenting, but it also helps catch problems early. Here, we'll use Typescript and create an interface for the `Task` model.

Inside the `app` directory, add a new directory called `models`, followed by a new file called `task.model.ts`:

```ts:title=src/app/models/task.model.ts
export interface Task {
  id?: string;
  title?: string;
  state?: string;
}
```

## Build out the states

Now that we have Storybook set up, styles imported, and test cases built out, we can quickly start implementing the HTML of the component to match the design.

The component is still rudimentary at the moment. First, write the code that achieves the design without going into too much detail:

```ts:title=src/app/components/task.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task',
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
export default class TaskComponent {
  /**
   * The shape of the task object
  */
  @Input() task?: Task;

  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  // tslint:disable-next-line: no-output-on-prefix
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

The additional markup from above, combined with our existing CSS (see src/styles.css and angular.json for configuration), yields the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Component built!

We’ve now successfully built out a component without needing a server or running the entire frontend application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

## Catch accessibility issues

Accessibility tests refer to the practice of auditing the rendered DOM with automated tools against a set of heuristics based on [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) rules and other industry-accepted best practices. They act as the first line of QA to catch blatant accessibility violations ensuring that an application is usable for as many people as possible, including people with disabilities such as vision impairment, hearing problems, and cognitive conditions.

Storybook includes an official [accessibility addon](https://storybook.js.org/addons/@storybook/addon-a11y). Powered by Deque's [axe-core](https://github.com/dequelabs/axe-core), it can catch up to [57% of WCAG issues](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Let's see how it works! Run the following command to install the addon:

```shell
npm install @storybook/addon-a11y --save-dev
```

Then, update your Storybook configuration file (`.storybook/main.ts`) to enable it:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/angular';
const config: StorybookConfig = {
  stories: ['../src/app/components/**/*.stories.ts'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/angular',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
};
export default config;

```

Finally, restart your Storybook to see the new addon enabled in the UI.

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

Cycling through our stories, we can see that the addon found an accessibility issue with one of our test states. The message [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) essentially means there isn't enough contrast between the task title and the background. We can quickly fix it by changing the text color to a darker gray in our application's CSS (located in `src/styles.css`).

```diff:title=src/styles.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

That's it! We've taken the first step to ensure that UI becomes accessible. As we continue to add complexity to our application, we can repeat this process for all other components without needing to spin up additional tools or testing environments.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
