---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: '8cb73c6'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is straightforward, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via ngxs) in some layout and pulling a top-level `error` field out of our store (let's assume we'll set that field if we have some problem connecting to our server).

Let's start by updating our store ( in `src/app/state/task.state.ts`) to include the error field we want:

```diff:title=src/app/state/task.state.ts
import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { patch, updateItem } from '@ngxs/store/operators';
import { Task } from '../models/task.model';

// Defines the actions available to the app
export const actions = {
  ARCHIVE_TASK: 'ARCHIVE_TASK',
  PIN_TASK: 'PIN_TASK',
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
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

export interface TaskStateModel {
  tasks: Task[];
  status: 'idle' | 'loading' | 'success' | 'error';
+ error: boolean;
}

// Sets the default state
@State<TaskStateModel>({
  name: 'taskbox',
  defaults: {
    tasks: defaultTasks,
    status: 'idle',
+   error: false,
  },
})
@Injectable()
export class TasksState {
  // Defines a new selector for the error field
  @Selector()
  static getError(state: TaskStateModel): boolean {
    return state.error;
  }

  @Selector()
  static getAllTasks(state: TaskStateModel): Task[] {
    return state.tasks;
  }

  // Triggers the PinTask action, similar to redux
  @Action(PinTask)
  pinTask(
    { getState, setState }: StateContext<TaskStateModel>,
    { payload }: PinTask
  ) {
    const task = getState().tasks.find((task) => task.id === payload);

    if (task) {
      const updatedTask: Task = {
        ...task,
        state: 'TASK_PINNED',
      };
      setState(
        patch({
          tasks: updateItem<Task>(
            (pinnedTask) => pinnedTask?.id === payload,
            updatedTask
          ),
        })
      );
    }
  }
  // Triggers the archiveTask action, similar to redux
  @Action(ArchiveTask)
  archiveTask(
    { getState, setState }: StateContext<TaskStateModel>,
    { payload }: ArchiveTask
  ) {
    const task = getState().tasks.find((task) => task.id === payload);
    if (task) {
      const updatedTask: Task = {
        ...task,
        state: 'TASK_ARCHIVED',
      };
      setState(
        patch({
          tasks: updateItem<Task>(
            (archivedTask) => archivedTask?.id === payload,
            updatedTask
          ),
        })
      );
    }
  }
+ // Function to handle how the state should be updated when the action is triggered
+ @Action(AppError)
+ setAppError(
+   { patchState, getState }: StateContext<TaskStateModel>,
+   { payload }: AppError
+ ) {
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
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>

    <div *ngIf="!error" class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export class PureInboxScreenComponent {
  @Input() error: any;
}
```

Then, we can create a container, which again grabs the data for the `PureInboxScreen` component in `inbox-screen.component.ts`:

```ts:title=src/app/components/inbox-screen.component.ts
import { Component } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-inbox-screen',
  template: `
    <app-pure-inbox-screen [error]="error$ | async"></app-pure-inbox-screen>
  `,
})
export class InboxScreenComponent {
  error$: Observable<boolean>;
  constructor(private store: Store) {
    this.error$ = store.select((state) => state.taskbox.error);
  }
}
```

We also need to change the `AppComponent` component to render the `InboxScreen` component (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

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
    NgxsModule.forRoot([], { developmentMode: !environment.production, }),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production, }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be simply rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock (i.e., provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, we have a problem with the `PureInboxScreen` because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense, the `PureInboxScreen` has been polluted by “container-ness”. So when we set up our stories in `pure-inbox-screen.stories.ts`:

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

We see that all our stories are no longer working. It's to the fact that both depend on our store, and even though we're using a "pure" component for the error, both stories still need context.

![Broken inbox](/intro-to-storybook/broken-inbox-angular-with-accessibility.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context with decorators

The good news is that it is easy to supply the `Store` to the `PureInboxScreen` component in a story! We can just import our `Store` in a decorator:

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

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/angular/writing-stories/play-function) and [`@storybook/addon-interactions`](https://storybook.js.org/docs/angular/writing-tests/interaction-testing) help us with that. A play function includes small snippets of code that run after the story renders.

The play function helps us verify what happens to the UI when tasks are updated. It uses framework-agnostic DOM APIs, which means we can write stories with the play function to interact with the UI and simulate human behavior no matter the frontend framework.

The `@storybook/addon-interactions` helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

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
+   await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+   // Simulates pinning the third task
+   await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+ };
```

Check your newly-created story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function.mp4"
    type="video/mp4"
  />
</video>

### Automate tests with the test runner

With Storybook's play function, we were able to sidestep our problem, allowing us to interact with our UI and quickly check how it responds if we update our tasks—keeping the UI consistent at no extra manual effort.

But, if we take a closer look at our Storybook, we can see that it only runs the interaction tests when viewing the story. Therefore, we'd still have to go through each story to run all checks if we make a change. Couldn't we automate it?

The good news is that we can! Storybook's [test runner](https://storybook.js.org/docs/angular/writing-tests/test-runner) allows us to do just that. It's a standalone utility—powered by [Playwright](https://playwright.dev/)—that runs all our interactions tests and catches broken stories.

Let's see how it works! Run the following command to install it:

```bash
npm install @storybook/test-runner --save-dev
```

Next, update your `package.json` `scripts` and add a new test task:

```json
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Finally, with your Storybook running, open up a new terminal window and run the following command:

```bash
npm run test-storybook -- --watch
```

<div class="aside">
💡 Interaction testing with the play function is a fantastic way to test your UI components. It can do much more than we've seen here; we recommend reading the <a href="https://storybook.js.org/docs/angular/writing-tests/interaction-testing">official documentation</a> to learn more about it. 
<br />
For an even deeper dive into testing, check out the <a href="/ui-testing-handbook">Testing Handbook</a>. It covers testing strategies used by scaled-front-end teams to supercharge your development workflow.
</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

Success! Now we have a tool that helps us verify whether all our stories are rendered without errors and all assertions pass automatically. What's more, if a test fails, it will provide us with a link that opens up the failing story in the browser.

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, and now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
