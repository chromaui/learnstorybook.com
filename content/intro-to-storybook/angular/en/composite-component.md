---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
commit: 'd6ccebb'
---

Last chapter, we built our first component; this chapter extends what we learned to make TaskList, a list of Tasks. Let’s combine components together and see what happens when we introduce more complexity.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. It yields two variations of `TaskList` you need to create stories for, default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, we require an empty state for when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get set up

A composite component isn’t much different from the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/app/components/task-list.component.ts` and `src/app/components/task-list.stories.ts`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```ts:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <div *ngIf="loading">loading</div>
      <div *ngIf="!loading && tasks.length === 0">empty</div>
      <app-task
        *ngFor="let task of tasks"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
    </div>
  `,
})
export default class TaskListComponent {
  /** The list of tasks */
  @Input() tasks: Task[] = [];

  /** Checks if it's in loading state */
  @Input() loading = false;

  /** Event to change the task to pinned */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  /** Event to change the task to archived */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Next, create `Tasklist`’s test states in the story file.

```ts:title=src/app/components/task-list.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { argsToTemplate, componentWrapperDecorator, moduleMetadata } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import TaskListComponent from './task-list.component';
import TaskComponent from './task.component';

import * as TaskStories from './task.stories';

const meta: Meta<TaskListComponent> = {
  component: TaskListComponent,
  title: 'TaskList',
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(
      (story) => `<div style="margin: 3em">${story}</div>`
    ),
  ],
  render: (args: TaskListComponent) => ({
    props: {
      ...args,
      onPinTask: TaskStories.actionsData.onPinTask,
      onArchiveTask: TaskStories.actionsData.onArchiveTask,
    },
    template: `<app-task-list ${argsToTemplate(args)}></app-task-list>`,
  }),
};
export default meta;
type Story = StoryObj<TaskListComponent>;

export const Default: Story = {
  args: {
    tasks: [
      { ...TaskStories.Default.args?.task, id: '1', title: 'Task 1' },
      { ...TaskStories.Default.args?.task, id: '2', title: 'Task 2' },
      { ...TaskStories.Default.args?.task, id: '3', title: 'Task 3' },
      { ...TaskStories.Default.args?.task, id: '4', title: 'Task 4' },
      { ...TaskStories.Default.args?.task, id: '5', title: 'Task 5' },
      { ...TaskStories.Default.args?.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks: Story = {
  args: {
    tasks: [
      // Shaping the stories through args composition.
      // Inherited data coming from the Default story.
      ...(Default.args?.tasks?.slice(0, 5) || []),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
    ],
  },
};

export const Loading: Story = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator key on the default export to add some <code>padding</code> around the rendered component. They can also be used to wrap stories in “providers”–-i.e., library components that set some context.
</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/angular/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort. That way, the data and actions (mocked callbacks) expected by both components are preserved.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough, but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases, we wouldn’t create a new component just to add a wrapper. But the **real complexity** of the `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```diff:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
+ template: `
+   <div class="list-items">
+     <app-task
+       *ngFor="let task of tasksInOrder"
+       [task]="task"
+       (onArchiveTask)="onArchiveTask.emit($event)"
+       (onPinTask)="onPinTask.emit($event)"
+     >
+     </app-task>
+     <div
+       *ngIf="tasksInOrder.length === 0 && !loading"
+       class="wrapper-message"
+     >
+       <span class="icon-check"></span>
+       <p class="title-message">You have no tasks</p>
+       <p class="subtitle-message">Sit back and relax</p>
+     </div>
+     <div *ngIf="loading">
+       <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
+         <span class="glow-checkbox"></span>
+         <span class="glow-text">
+           <span>Loading</span> <span>cool</span> <span>state</span>
+         </span>
+       </div>
+     </div>
+   </div>
  `,
})
export default class TaskListComponent {
- /** The list of tasks */
- @Input() tasks: Task[] = [];

+  /**
+  * @ignore
+  * Component property to define ordering of tasks
+  */
+ tasksInOrder: Task[] = [];

  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

+ @Input()
+ set tasks(arr: Task[]) {
+   const initialTasks = [
+     ...arr.filter(t => t.state === 'TASK_PINNED'),
+     ...arr.filter(t => t.state !== 'TASK_PINNED'),
+   ];
+   const filteredTasks = initialTasks.filter(
+     t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
+   );
+   this.tasksInOrder = filteredTasks.filter(
+     t => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
+   );
+ }
}
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements

As the component grows, so too do input requirements. Define the data requirements of `TaskList` component using TypeScript. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the model you defined in `task.model.ts` earlier.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
