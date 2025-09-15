---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 'db7a1a2'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

For this tutorial, we'll use Angular's [signals](https://angular.dev/guide/signals), a powerful reactivity system that provides explicit, fine-grained reactive primitives to implement a simple store. We'll use the `signal` to build a simple data model for our application and help us manage the state of our tasks.

First, we’ll construct a simple store that responds to actions that change the state of tasks in a file called `store.ts` in the `src/app/state` directory (intentionally kept simple):

```ts:title=src/app/state/store.ts
// A simple Angular state management implementation using signals update methods and initial data.
// A true app would be more complex and separated into different files.
import type { TaskData } from '../types';

import { Injectable, signal, computed } from '@angular/core';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'error' | 'success';
  error: string | null;
}

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks: TaskData[] = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const initialState: TaskBoxState = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};

@Injectable({
  providedIn: 'root',
})
export class Store {
  private state = signal<TaskBoxState>(initialState);

  // Public readonly signal for components to subscribe to
  readonly tasks = computed(() => this.state().tasks);
  readonly status = computed(() => this.state().status);
  readonly error = computed(() => this.state().error);

  readonly getFilteredTasks = computed(() => {
    const filteredTasks = this.state().tasks.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
    return filteredTasks;
  });

  archiveTask(id: string): void {
    this.state.update((currentState) => {
      const filteredTasks = currentState.tasks
        .map(
          (task): TaskData =>
            task.id === id ? { ...task, state: 'TASK_ARCHIVED' as TaskData['state'] } : task
        )
        .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');

      return {
        ...currentState,
        tasks: filteredTasks,
      };
    });
  }

  pinTask(id: string): void {
    this.state.update((currentState) => ({
      ...currentState,
      tasks: currentState.tasks.map((task) =>
        task.id === id ? { ...task, state: 'TASK_PINNED' } : task
      ),
    }));
  }
}
```

Then we'll update our `TaskList` to read data out of the store. First, let's move our existing presentational version to the file `src/app/components/pure-task-list.component.ts` and wrap it with a container.

In `src/app/components/pure-task-list.component.ts`:

```ts:title=src/app/components/pure-task-list.component.ts
/* This file was moved from task-list.component.ts */
import type { TaskData } from '../types';

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TaskComponent } from './task.component';

@Component({
  selector: 'app-pure-task-list',
  standalone: true,
  imports: [CommonModule, TaskComponent],
    template: `
    <div class="list-items">
      <app-task
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
      <div
        *ngIf="tasksInOrder.length === 0 && !loading"
        class="wrapper-message"
        data-testid="empty"
      >
        <span class="icon-check"></span>
        <p class="title-message">You have no tasks</p>
        <p class="subtitle-message">Sit back and relax</p>
      </div>
      <div *ngIf="loading">
        <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
        </div>
      </div>
    </div>
  `,
})
export class PureTaskListComponent {
  /**
   * @ignore
   * Component property to define ordering of tasks
   */
  tasksInOrder: TaskData[] = [];

  /**
   * Checks if it's in loading state
   */
  @Input() loading = false;

  /**
   * Event to change the task to pinned
   */
  @Output()
  onPinTask = new EventEmitter<Event>();

  /**
   * Event to change the task to archived
   */
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  /**
   * The list of tasks
   */
  @Input()
  set tasks(arr: TaskData[]) {
    const initialTasks = [
      ...arr.filter((t) => t.state === 'TASK_PINNED'),
      ...arr.filter((t) => t.state !== 'TASK_PINNED'),
    ];
    const filteredTasks = initialTasks.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
    this.tasksInOrder = filteredTasks.filter(
      (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED'
    );
  }
}
```

In `src/app/components/task-list.component.ts`:

```ts:title=src/app/components/task-list.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Store } from '../state/store';

import { PureTaskListComponent } from './pure-task-list.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, PureTaskListComponent],
  template: `
    <app-pure-task-list
      [tasks]="store.getFilteredTasks()"
      (onArchiveTask)="store.archiveTask($event)"
      (onPinTask)="store.pinTask($event)"
    ></app-pure-task-list>
  `,
})
export class TaskListComponent {
  store = inject(Store);
}
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/app/components/task-list.stories.ts` into `src/app/components/pure-task-list.stories.ts` and ensure our stories use the presentational version:

```ts:title=src/app/components/pure-task-list.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { componentWrapperDecorator } from '@storybook/angular';

import { PureTaskListComponent } from './pure-task-list.component';

import * as TaskStories from './task.stories';

export const TaskListData = [
  { ...TaskStories.TaskData, id: '1', title: 'Task 1' },
  { ...TaskStories.TaskData, id: '2', title: 'Task 2' },
  { ...TaskStories.TaskData, id: '3', title: 'Task 3' },
  { ...TaskStories.TaskData, id: '4', title: 'Task 4' },
  { ...TaskStories.TaskData, id: '5', title: 'Task 5' },
  { ...TaskStories.TaskData, id: '6', title: 'Task 6' },
];

const meta: Meta<PureTaskListComponent> = {
  component: PureTaskListComponent,
  title: 'PureTaskList',
  tags: ['autodocs'],
  excludeStories: /.*Data$/,
  decorators: [
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator((story) => `<div style="margin: 3em">${story}</div>`),
  ],
  args: {
    ...TaskStories.TaskData.events,
  },
};

export default meta;
type Story = StoryObj<PureTaskListComponent>;

export const Default: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: TaskListData,
  },
};

export const WithPinnedTasks: Story = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
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

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/angular-finished-puretasklist-states-9-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component obtained from the store, we could have wired it to `src/app.ts` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
