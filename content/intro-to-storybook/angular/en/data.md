---
title: 'Wire in data'
tocTitle: 'Data'
description: 'Learn how to wire in data to your UI component'
commit: '0bf4edf'
---

So far, we have created isolated stateless components-–great for Storybook, but ultimately not helpful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app, so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskList` component as currently written is “presentational” in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [ngxs](https://ngxs.gitbook.io/ngxs/), a library that embraces Redux/ngrx principles but focuses on reducing boilerplate and provides a more _angular-y_ way of managing state to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [ngrx/store](https://github.com/ngrx/platform) or [Apollo](https://www.apollographql.com/docs/angular/).

Add the necessary dependencies to your project with:

```bash
npm install @ngxs/store @ngxs/logger-plugin @ngxs/devtools-plugin
```

First, we'll create a simple store that responds to actions that change the task's state in a file called `task.state.ts` in the `src/app/state` directory (intentionally kept simple):

```ts:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// Defines the actions available to the app
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

// Sets the default state
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

  // Triggers the PinTask action, similar to redux
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
  // Triggers the archiveTask action, similar to redux
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

Then we'll update our `TaskList` component to read data from the store. First, let's move our existing presentational version to the file `src/app/components/pure-task-list.component.ts` and wrap it with a container.

In `src/app/components/pure-task-list.component.ts`:

```diff:title=src/app/components/pure-task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';
@Component({
- selector:'app-task-list',
+ selector: 'app-pure-task-list',
  // same content as before with the task-list.component.ts
})
- export class TaskListComponent {
+ export class PureTaskListComponent {
  // same content as before with the task-list.component.ts
 }
```

In `src/app/components/task-list.component.ts`:

```ts:title=src/app/components/task-list.component.ts
import { Component } from '@angular/core';
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
export class TaskListComponent {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  /**
   * Component method to trigger the archiveTask event
   */
  archiveTask(id: string) {
    this.store.dispatch(new ArchiveTask(id));
  }

  /**
   * Component method to trigger the pinTask event
   */
  pinTask(id: string) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Now we're going to create an Angular module to bridge the components and the store.

Create a new file called `task.module.ts` inside the `src/app/components` directory and add the following:

```ts:title=src/app/components/task.module.ts
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

We have what we need. All that is required is to wire the store to the app. Update your top-level module (`src/app/app.module.ts`):

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

+ import { TaskModule } from './components/task.module';
+ import { NgxsModule } from '@ngxs/store';
+ import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
+ import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
+   TaskModule,
+   NgxsModule.forRoot([]),
+   NgxsReduxDevtoolsPluginModule.forRoot(),
+   NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

The reason to keep the presentational version of the `TaskList` separate is that it is easier to test and isolate. As it doesn't rely on the presence of a store, it is much easier to deal with from a testing perspective. Let's rename `src/app/components/task-list.stories.ts` into `src/app/components/pure-task-list.stories.ts` and ensure our stories use the presentational version:

```ts:title=src/app/components/pure-task-list.stories.ts
import { componentWrapperDecorator, moduleMetadata, Meta, Story } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';

import * as TaskStories from './task.stories';

export default {
  component: PureTaskListComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with storybook
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'PureTaskListComponent',
} as Meta;

const Template: Story = args => ({
  props: {
    ...args,
    onPinTask: TaskStories.actionsData.onPinTask,
    onArchiveTask: TaskStories.actionsData.onArchiveTask,
  },
});

export const Default = Template.bind({});
Default.args = {
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">
💡 With this change, all of our tests will require an update. Update the imports and re-run the test command with the <code>-u</code> flag to update them. Also, don't forget to commit your changes with git!
</div>

Now that we have some actual data populating our component obtained from the store, we could have wired it to `src/app/app.component.ts` and render the component there. Don't worry about it. We'll take care of it in the next chapter.
