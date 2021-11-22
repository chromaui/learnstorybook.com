---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: 'b5f0de2'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskListComponent` (which supplies its own data via ngxs) in some layout and pulling a top-level `error` field out of our store (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating our store ( in `src/app/state/task.state.ts`) to include the error field we want:

```diff:title=src/app/state/task.state.ts
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Task } from '../models/task.model';

// defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
  // Defines the new error field we need
+ ERROR: 'APP_ERROR',
};

export class ArchiveTask {
  static readonly type = actions.ARCHIVE_TASK;

  constructor(public payload: string) {}
}

export class PinTask {
  static readonly type = actions.PIN_TASK;

  constructor(public payload: string) {}
}
+ // The class definition for our error field
+ export class AppError {
+   static readonly type = actions.ERROR;
+   constructor(public payload: boolean) {}
+ }

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
+ error: boolean;
}

// Sets the default state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    entities: defaultTasks,
+   error: false,
  },
})
export class TasksState {
  @Selector()
  static getAllTasks(state: TaskStateModel) {
    const entities = state.entities;
    return Object.keys(entities).map(id => entities[+id]);
  }

+ // Defines a new selector for the error field
+ @Selector()
+ static getError(state: TaskStateModel) {
+   const { error } = state;
+   return error;
+ }
  //
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
  // Triggers the PinTask action, similar to redux
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

+ // Function to handle how the state should be updated when the action is triggered
+ @Action(AppError)
+ setAppError({ patchState, getState }: StateContext<TaskStateModel>, { payload }: AppError) {
+   const state = getState();
+   patchState({
+     error: !state.error,
+   });
+ }
}
```

Now that we have the store updated with the new field. Let's create `pure-inbox-screen.component.ts` in `src/app/components/` directory:

```ts:title=src/app/components/pure-inbox-screen.component.ts
import { Component, Input } from '@angular/core';

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
export class PureInboxScreenComponent {
  @Input() error: any;
}
```

Then, we can create a container, which again grabs the data for the `PureInboxScreenComponent` in `inbox-screen.component.ts`:

```ts:title=src/app/components/inbox-screen.component.ts
import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { TasksState } from '../state/task.state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent {
  @Select(TasksState.getError) error$: Observable<any>;
}
```

We also need to change the `AppComponent` component to render the `InboxScreenComponent` (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```diff:title=src/app/app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
- templateUrl: './app.component.html',
- styleUrls: ['./app.component.css']
+ template: `
+   <app-inbox-screen></app-inbox-screen>
+ `,
})
export class AppComponent {
- title = 'intro-storybook-angular-template';
+ title = 'taskbox';
}
```

And finally, the `app.module.ts`:

```diff:title=src/app/app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TaskModule } from './components/task.module';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { AppComponent } from './app.component';

+ import { InboxScreenComponent } from './components/inbox-screen.component';
+ import { PureInboxScreenComponent } from './components/pure-inbox-screen.component';

@NgModule({
+ declarations: [AppComponent, InboxScreenComponent, PureInboxScreenComponent],
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

As we saw previously, the `TaskListComponent` component is a **container** that renders the `PureTaskListComponent` presentational component. By definition, container components cannot be simply rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock (i.e., provide a pretend version) the context or service it requires.

When placing the `TaskListComponent` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskListComponent` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, we have a problem with the `PureInboxScreenComponent` because although the `PureInboxScreen` itself is presentational, its child, the `TaskListComponent`, is not. In a sense, the `PureInboxScreen` has been polluted by “container-ness”. So when we set up our stories in `pure-inbox-screen.stories.ts`:

```ts:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata, Meta, Story } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

export default {
  component: PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
      declarations: [PureInboxScreenComponent],
      imports: [CommonModule, TaskModule],
    }),
  ],
  title: 'PureInboxScreen',
} as Meta;

const Template: Story = args => ({
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

We see that all our stories are no longer working. It's to the fact that both depend on our store and, even though we're using a "pure" component for the error, both stories still need context.

![Broken inbox](/intro-to-storybook/broken-inbox-angular.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context with decorators

The good news is that it is easy to supply the `Store` to the `PureInboxScreenComponent` in a story! We can just import our `Store` in a decorator:

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata, Meta, Story } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';

import { TaskModule } from './task.module';

+ import { Store, NgxsModule } from '@ngxs/store';
+ import { TasksState } from '../state/task.state';

export default {
  component:PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
-     imports: [CommonModule,TaskModule],
+     imports: [CommonModule,TaskModule,NgxsModule.forRoot([TasksState])],
+     providers: [Store],
    }),
  ],
  title: 'PureInboxScreen',
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};
```

Similar approaches exist to provide mocked context for other data libraries, such as [@ngrx](https://github.com/ngrx/platform) or [Apollo](https://www.apollographql.com/docs/angular/).

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Interactive stories

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen, continuously testing each change using our stories. But with each story added, we would also need to check each variation manually to ensure the UI doesn't break, which requires extra work.

Couldn't we automate this workflow and interact with our components automatically?

Storybook's [`play`](https://storybook.js.org/docs/6.4/angular/writing-stories/play-function) function allows us to do just that. They are small snippets of code that run after the story renders. Ideal for scenarios such as ours where we would like to see what happens to our UI when we update our tasks. Since they rely on using framework-agnostic DOM APIs, we can write stories with the play function to interact with the UI and automate human behavior no matter the framework we use.

Let's see it in action! Update your newly created `pure-inbox-screen` story, and set up component interactions by adding the following:

```diff:title=src/app/components/pure-inbox-screen.stories.ts
import { moduleMetadata, Meta, Story } from '@storybook/angular';

+ import { fireEvent, within } from '@storybook/testing-library';

import { CommonModule } from '@angular/common';

import { PureInboxScreenComponent } from './pure-inbox-screen.component';
import { TaskModule } from './task.module';

import { Store, NgxsModule } from '@ngxs/store';
import { TasksState } from '../state/task.state';

export default {
  component:PureInboxScreenComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule,TaskModule,NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  ],
  title: 'PureInboxScreen',
} as Meta;

const Template: Story = (args) => ({
  props: args,
});

export const Default = Template.bind({});

export const Error = Template.bind({});
Error.args = {
  error: true,
};

+ export const WithInteractions = Template.bind({});
+ WithInteractions.play = async ({ canvasElement }) => {
+   const canvas = within(canvasElement);
+   // Simulates pinning the first task
+   await fireEvent.click(canvas.getByLabelText("pinTask-1"));
+   // Simulates pinning the third task
+   await fireEvent.click(canvas.getByLabelText("pinTask-3"));
+ };
```

Check your newly created story, and click the `Interactions` panel, and you'll see the following.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

As you've seen, we're able to interact with our UI and quickly check how it responds if we update our tasks, ensuring it stays consistent, all of this without needing to spin up a testing environment or add additional packages.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built, and we also need to ensure that it remains durable over time.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
