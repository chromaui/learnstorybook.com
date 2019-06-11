---
title: "Wire in data"
tocTitle: "Data"
description: "Learn how to wire in data to your UI component"
commit: 34f1938
---

So far we created isolated stateless components –great for Storybook, but ultimately not useful until we give them some data in our app.

This tutorial doesn’t focus on the particulars of building an app so we won’t dig into those details here. But we will take a moment to look at a common pattern for wiring in data with container components.

## Container components

Our `TaskListComponent` as currently written is “presentational” (see [this blog post](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)) in that it doesn’t talk to anything external to its own implementation. To get data into it, we need a “container”.

This example uses [ngxs](https://ngxs.gitbook.io/ngxs/), a library that embraces Redux/ngrx principles but focuses on reducing boilerplate and provides a more _angular-y_ way of managing state, to build a simple data model for our app. However, the pattern used here applies just as well to other data management libraries like [ngrx/store](https://github.com/ngrx/platform).

Let's start by refactoring our app a bit, we'll need to create two folders: `containers` and `components`. After that, let's move both `task.component.ts` and `task-list.component.ts` (with their corresponding `.stories.ts` file) inside the latter. After that, update any references in the imports.

After that we’ll construct a simple state container that responds to actions that change the state of tasks, in a file called `src/tasks/state/task.state.ts` (intentionally kept simple):

```typescript
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../task.model';

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

  @Action(PinTask)
  pinTask(
    { patchState, getState }: StateContext<TaskStateModel>,
    { payload }: PinTask,
  ) {
    const state = getState().entities;

    const entities = {
      ...state,
      [payload]: { ...state[payload], state: 'TASK_PINNED' },
    };

    patchState({
      entities,
    });
  }

  @Action(ArchiveTask)
  archiveTask(
    { patchState, getState }: StateContext<TaskStateModel>,
    { payload }: ArchiveTask,
  ) {
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

Then we’ll need to wire up the `NgxsModule` to our root and feature Angular modules. First go to `src/tasks/task.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
import { TasksState } from './state/task.state';

@NgModule({
  imports: [CommonModule, NgxsModule.forFeature([TasksState])],
  exports: [TaskComponent, TaskListComponent],
  declarations: [TaskComponent, TaskListComponent],
  providers: [],
})
export class TaskModule {}
```

then head over to `src/app.module.ts`

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './tasks/task.module';
import { NgxsModule } from '@ngxs/store';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, TaskModule, NgxsModule.forRoot([])],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

Now, we will convert our existing `TaskListComponent` to a container meaning it will get the tasks from our recently created store. In order to achieve that we need to create a new `src/tasks/containers/task-list.component.ts` and add the following code:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'task-list',
  template: `
    <pure-task-list [tasks]="tasks$ | async" (onArchiveTask)="archiveTask($event)" (onPinTask)="pinTask($event)"></pure-task-list>
  `,
})
export class TaskListComponent implements OnInit {
  @Select(TasksState.getAllTasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}

  archiveTask(id) {
    this.store.dispatch(new ArchiveTask(id));
  }

  pinTask(id) {
    this.store.dispatch(new PinTask(id));
  }
}
```

Notice that we've also renamed our old `TaskListComponent` that lives in `src/tasks/components/task-list.component.ts` to `src/tasks/components/pure-task-list.component.ts` we've also changed it's `selector` from `task-list` to `pure-task-list` and the class name from `TaskListComponent` to `PureTaskListComponent`. All these changes are for clarity: now we have a pure component that receives a list of tasks, some events and renders a result as well as a container component that relies on our store to get the data it needs and pass it down to our pure component. Remember to rename the `task-list.stories.ts` file too.

At this stage our Storybook tests will have stopped working, as the `TaskListComponent` is now a container, and no longer expects any props, instead it connects to the store and sets the props on the `PureTaskListComponent` component it wraps.

However, we can easily solve this problem by simply rendering the `PureTaskListComponent` --the presentational component-- in our Storybook stories:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { TaskComponent } from './task.component';
import { PureTaskListComponent } from './pure-task-list.component';
import { task, actions } from './task.stories';

export const defaultTasks = [
  { ...task, id: '1', title: 'Task 1' },
  { ...task, id: '2', title: 'Task 2' },
  { ...task, id: '3', title: 'Task 3' },
  { ...task, id: '4', title: 'Task 4' },
  { ...task, id: '5', title: 'Task 5' },
  { ...task, id: '6', title: 'Task 6' },
];

export const withPinnedTasks = [
  ...defaultTasks.slice(0, 5),
  { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
];

const props = {
  tasks: defaultTasks,
  onPinTask: actions.onPinTask,
  onArchiveTask: actions.onArchiveTask,
};

storiesOf('TaskList', module)
  .addDecorator(
    moduleMetadata({
      declarations: [PureTaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  )
  .add('default', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  })
  .add('withPinnedTasks', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props: {
        ...props,
        tasks: withPinnedTasks,
      },
    };
  })
  .add('loading', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  })
  .add('empty', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <pure-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></pure-task-list>
        </div>
      `,
      props,
    };
  });
```

<video autoPlay muted playsInline loop>
  <source
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Similarly, we need to use `PureTaskListComponent` in our test:

```typescript
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { PureTaskListComponent } from './pure-task-list.component';
import { TaskComponent } from './task.component';

import { withPinnedTasks } from './pure-task-list.stories';
import { By } from '@angular/platform-browser';

describe('TaskList component', () => {
  let component: PureTaskListComponent;
  let fixture: ComponentFixture<PureTaskListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TaskComponent, PureTaskListComponent],
      }).compileComponents();
    }),
  );

  it('renders pinned tasks at the start of the list', () => {
    fixture = TestBed.createComponent(PureTaskListComponent);
    component = fixture.componentInstance;
    component.tasks = withPinnedTasks;

    fixture.detectChanges();
    const lastTaskInput = fixture.debugElement.query(
      By.css('.list-item:nth-child(1)'),
    );

    // We expect the task titled "Task 6 (pinned)" to be rendered first, not at the end
    expect(lastTaskInput.nativeElement.id).toEqual('6');
  });
});
```
