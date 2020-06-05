---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: deff6cb
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskListComponent` (which supplies its own data via ngxs) in some layout and pulling a top-level `error` field out of our store (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating the store ( in `src/app/state/task.state.ts`) to include the error field we want:

```typescript
// src/app/state/task.state.ts

import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // defines the new error field we need
  ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
// the class definition for our error field
export class AppError {
  static readonly type = actions.ERROR;
  constructor(public payload: boolean) {}
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
  error: boolean;
}

// sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
    error: false,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

  // defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel) {
    const { error } = state;
    return error;
  }
  //
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
  // triggers the PinTask action, similar to redux
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

  // function to handle how the state should be updated when the action is triggered
  @Action(AppError)
  setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError) {
    const state = getState();
    patchState({
      error: !state.error,
    });
  }
}
```

The store is updated with the new field. Let's create a presentational `pure-inbox-screen.component.ts` in `src/app/components/` folder:

```typescript
// src/app/components/pure-inbox-screen.component.ts

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pure-inbox-screen',
  template: `
    <div *ngIf="error" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>

    <div *ngIf="!error" class="page lists-show">
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export class PureInboxScreenComponent implements OnInit {
  @Input() error: any;

  constructor() {}

  ngOnInit() {}
}
```

Then we can create the container, which like before, grabs the data for `PureInboxScreenComponent`. In a new file called `inbox-screen.component.ts`:

```typescript
// src/app/components/inbox-screen.component.ts

import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { TasksState } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Select(TasksState.getError) error$: Observable<any>;

  constructor() {}

  ngOnInit() {}
}
```

We also need to change the `AppComponent` to render the `InboxScreenComponent` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```typescript
//src/app/app.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-inbox-screen></app-inbox-screen>
  `,
})
export class AppComponent {
  title = 'taskbox';
}
```

And finally the `app.module.ts`:

```typescript
//src/app/app.module.ts

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';
import { InboxScreenComponent } from './components/inbox-screen.component';
import { PureInboxScreenComponent } from './components/pure-inbox-screen.component';

@NgModule({
  declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
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

<div class="aside"><p>Don't forget to update the test file <code>src/app/app.component.spec.ts</code>. Or the next time you run your tests they will fail.</p></div>

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskListComponent` component is a **container** that renders the `PureTaskListComponent` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

When placing the `TaskListComponent` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskListComponent` and avoiding the container. We'll do something similar and create and render the `PureInboxScreen` in Storybook also.

However, for the `PureInboxScreenComponent` we have a problem because although the `PureInboxScreenComponent` itself is presentational, its child, the `TaskListComponent`, is not. In a sense the `PureInboxScreenComponent` has been polluted by “container-ness”. So when we setup our stories in `pure-inbox-screen.stories.ts`:

```typescript
// src/app/components/pure-inbox-screen.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';
export default {
  title: 'PureInboxScreen',
  decorators: [
    moduleMetadata({
      imports: [TaskModule],
    }),
  ],
};
// inbox screen default state
export const Default = () => ({
  component: PureInboxScreenComponent,
});

// inbox screen error state
export const error = () => ({
  component: PureInboxScreenComponent,
  props: {
    error: true,
  },
});
```

We see that our stories are broken now. This is due to the fact that both depend on our store and, even though, we're using a "pure" component for the error both stories still need the context.

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context with decorators

The good news is that is pretty straightforward to supply the `Store` to the `PureInboxScreenComponent` in a story! We can supply the `Store` provided in a decorator:

```typescript
// src/app/components/pure-inbox-screen.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState } from '../state/task.state';
export default {
  title: 'PureInboxScreen',
  decorators: [
    moduleMetadata({
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  ],
};
// inbox screen default state
export const Default = () => ({
  component: PureInboxScreenComponent,
});

// inbox screen error state
export const error = () => ({
  component: PureInboxScreenComponent,
  props: {
    error: true,
  },
});
```

Similar approaches exist to provide mocked context for other data libraries, such as [@ngrx](https://github.com/ngrx/platform) or [Apollo](https://www.apollographql.com/docs/angular/).

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

We started from the bottom with `TaskComponent`, then progressed to `TaskListComponent`, now we’re here with a whole screen UI. Our `InboxScreenComponent` accommodates a nested component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.
