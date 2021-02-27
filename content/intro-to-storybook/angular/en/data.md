---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: 34f1938
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [ngxs](https://ngxs.gitbook.io/ngxs/), a library that embraces Redux/ngrx principles but focuses on reducing boilerplate and provides a more _angular-y_ way of managing state, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [ngrx/store](https://github.com/ngrx/platform) or [Apollo](https://www.apollographql.com/docs/angular/).

First install ngxs with:

```bash
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

Then we'll construct a straightforward store that responds to actions that change the state of tasks, in a file called `src/app/state/task.state.ts` (intentionally kept simple):

```typescript
// src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}

// The initial state of our store when the app loads.
// Usually you would fetch this from a server
const defaultTasks = {
  1: { id: '1', title: 'Something', state: 'TASK_INBOX' },
  2: { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  3: { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  4: { id: '4', title: 'Something again', state: 'TASK_INBOX' },
};

export class TaskStateModel {
  entities: { [id: number]: Task };
}

// sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // triggers the PinTask action, similar to redux
  @Action(PinTask)
  pinTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: PinTask) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }
  // triggers the archiveTask action, similar to redux
  @Action(ArchiveTask)
  archiveTask({ patchState, getState }: StateContext<TaskStateModel>, { payload }: ArchiveTask) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_ARCHIVED' },
    };

    patchState({
      entities,
    });
  }
}
```

We have the store implemented, we need to take a couple of steps before connecting it to our app.

We're going to update our `TaskListComponent` to read data from the store, but first we're going to move our presentational version to a new file called `pure-task-list.component.ts`, (renaming the `selector` to `app-pure-task-list`) which will be later wrapped in a container.

In `src/app/components/pure-task-list.component.ts`:

```typescript
//src/app/components/pure-task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-pure-task-list',
  // same content as before with the task-list.component.ts
})
export class PureTaskListComponent implements OnInit {
  // same content as before with the task-list.component.ts
}
```

Afterwards we change `src/app/components/task-list.component.ts` to the following:

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  template: `
    <app-pure-task-list
      [tasks]="tasks$ | async"
      (onArchiveTask)="archiveTask($event)"
      (onPinTask)="pinTask($event)"
    ></app-pure-task-list>
  `,
})
export class TaskListComponent implements OnInit {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Now we're going to create a angular module to bridge the components and the store.

Create a new file called `task.module.ts` inside the `components` folder and add the following:

```typescript
//src/app/components/task.module.ts

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { TasksState } from '../state/task.state';
import { PureTaskListComponent } from './pure-task-list.component';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent, PureTaskListComponent],
  providers: [],
})
export class TaskModule {}
```

All the pieces are in place, all that is needed is wire the store to the app. In our top level module (`src/app/app.module.ts`):

```typescript
// src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TaskModule,
    NgxsModule.forRoot([]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The reason to keep the presentational version of the `TaskList` separate is because it is easier to test and isolate. As it doesn't rely on the presence of a store it is much easier to deal with from a testing perspective. Let's also rename `src/app/components/task-list.stories.ts` into `src/app/components/pure-task-list.stories.ts`, and ensure our stories use the presentational version:

```typescript
// src/app/components/pure-task-list.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'PureTaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  ],
};

export const defaultTasksData = [
  { ...taskData, id: '1', title: 'Task 1' },
  { ...taskData, id: '2', title: 'Task 2' },
  { ...taskData, id: '3', title: 'Task 3' },
  { ...taskData, id: '4', title: 'Task 4' },
  { ...taskData, id: '5', title: 'Task 5' },
  { ...taskData, id: '6', title: 'Task 6' },
];
export const withPinnedTasksData = [
  ...defaultTasksData.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];
// default TaskList state
export const Default = () => ({
  component: PureTaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
  </div>
`,
  props: {
    tasks: defaultTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist with pinned tasks
export const WithPinnedTasks = () => ({
  component: PureTaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
    </div>
  `,
  props: {
    tasks: withPinnedTasksData,
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
// tasklist in loading state
export const Loading = () => ({
  template: `
        <div style="padding: 3rem">
          <app-pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-pure-task-list>
        </div>
      `,
});
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskListComponent` in our Jest test:

```typescript
// src/app/components/task-list.component.spec.ts

import { render } from '@testing-library/angular';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './pure-task-list.stories';
describe('PureTaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(PureTaskListComponent, {
      declarations: [TaskComponent],
      componentProperties: {
        tasks: withPinnedTasksData,
        loading: false,
        onPinTask: {
          emit: mockedActions,
        } as any,
        onArchiveTask: {
          emit: mockedActions,
        } as any,
      },
    });
    const component = tree.fixture.componentInstance;
    expect(component.tasksInOrder[0].id).toBe('6');
  });
});
```

<div class="aside">
💡 With this change your snapshots will require an update. Re-run the test command with the <code>-u</code> flag to update them. Also don't forget to commit your changes with git!
</div>
