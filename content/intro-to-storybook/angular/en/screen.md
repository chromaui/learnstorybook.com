---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
commit: 'da405c1'
---

We've concentrated on building UIs from the bottom up, starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter, we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Connected screens

As our application is straightforward, the screen we'll build is pretty trivial. It simply fetches data from a remote API, wraps the `TaskList` component (which supplies its own data via signals) in some layout, and pulls a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server).

We'll start by updating our store (in `src/app/state/store.ts`) to connect to a remote API and handle the various states for our application (i.e., `error`, `succeeded`):

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

const initialState: TaskBoxState = {
  tasks: [],
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
  async fetchTasks(): Promise<void> {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
      const data = await response.json();
      const result = data
        .map((task: { id: number; title: string; completed: boolean }) => ({
          id: `${task.id}`,
          title: task.title,
          state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
        }))
        .filter((task: TaskData) => task.state === 'TASK_INBOX' || task.state === 'TASK_PINNED');

      this.state.update((currentState) => ({
        ...currentState,
        tasks: result,
        status: 'success',
        error: null,
      }));

    } catch (error) {
      this.state.update((currentState) => ({
        ...currentState,
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
      }));
    }
  }
}
```

Now that we've updated our store to retrieve the data from a remote API endpoint and prepared it to handle the various states of our app, let's create our `inbox-screen.component.ts` in the `src/app/components` directory:

```ts:title=src/app/components/inbox-screen.component.ts
import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, computed } from '@angular/core';

import { Store } from '../state/store';

import { TaskListComponent } from './task-list.component';

@Component({
  selector: 'app-inbox-screen',
  standalone: true,
  imports: [CommonModule, TaskListComponent],
  template: `
    <div *ngIf="isError()" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad"></span>
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>

    <div *ngIf="!isError()" class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <app-task-list></app-task-list>
    </div>
  `,
})
export class InboxScreenComponent implements OnInit {
  store = inject(Store);

  isError = computed(() => this.store.status() === 'error');

  ngOnInit(): void {
    this.store.fetchTasks();
  }
}
```

We also need to change the `app.ts` component to render the `InboxScreen` component (eventually, we would use a router to choose the correct screen, but let's not worry about that here):

```diff:title=src/app/app.ts
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

+ import { InboxScreenComponent } from './components/inbox-screen.component';

@Component({
  selector: 'app-root',
- imports: [RouterOutlet],
-  templateUrl: './app.html',
-  styleUrl: './app.css'
+  imports: [RouterOutlet, InboxScreenComponent],
+  template: `<app-inbox-screen></app-inbox-screen>`,
})

export class App {
  protected readonly title = signal('taskbox');
}
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition, container components cannot be rendered in isolation; they expect to be passed some context or connected to a service. What this means is that to render a container in Storybook, we must mock the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. However, as our application grows, it quickly becomes unmanageable to keep the connected components out of Storybook and create presentational components for each. As our `InboxScreen` is a connected component, we'll need to provide a way to mock the store and the data it provides.

So when we set up our stories in `inbox-screen.stories.ts`:

```ts:title=src/app/components/inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { InboxScreenComponent } from './inbox-screen.component';

const meta: Meta<InboxScreenComponent> = {
  component: InboxScreenComponent,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<InboxScreenComponent>;

export const Default: Story = {}

export const Error: Story = {}
```

We can quickly spot an issue with the `Error` story. Instead of displaying the right state, it shows a list of tasks. We could easily apply the same approach as in the last chapter. Instead, we'll use a well-known API mocking library alongside a Storybook addon to help us solve this issue.

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-9-0-angular.png)

## Mocking API services

As our application is pretty straightforward and doesn't depend too much on remote API calls, we're going to use [Mock Service Worker](https://mswjs.io/) and [Storybook's MSW addon](https://storybook.js.org/addons/msw-storybook-addon). Mock Service Worker is an API mocking library. It relies on service workers to capture network requests and provides mocked data in responses.

When we set up our app in the [Get started section](/intro-to-storybook/svelte/en/get-started/) both packages were also installed. All that remains is to configure them and update our stories to use them.

In your terminal, run the following command to generate a generic service worker inside your `public` folder:

```shell
npm run init-msw
```

Then, we'll need to update our `.storybook/preview.ts` and initialize them:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/angular';

import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';

+ import { initialize, mswLoader } from 'msw-storybook-addon';

setCompodocJson(docJson);

+ initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
+ loaders: [mswLoader],
};

export default preview;
```

Finally, update the `InboxScreen` stories and include a [parameter](https://storybook.js.org/docs/writing-stories/parameters) that mocks the remote API calls:

```diff:title=src/app/components/inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

+ import { http, HttpResponse } from 'msw';

import { InboxScreenComponent } from './inbox-screen.component';

+ import * as PureTaskListStories from './pure-task-list.stories';

const meta: Meta<InboxScreenComponent> = {
  component: InboxScreenComponent,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<InboxScreenComponent>;

export const Default: Story = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return HttpResponse.json(PureTaskListStories.TaskListData);
+       }),
+     ],
+   },
+ },
};

export const Error: Story = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return new HttpResponse(null, {
+           status: 403,
+         });
+       }),
+     ],
+   },
+ },
};
```

<div class="aside">

💡 As an aside, passing data down the hierarchy is a legitimate approach, especially when using [GraphQL](http://graphql.org/). It’s how we have built [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) alongside 800+ stories.

</div>

Check your Storybook, and you'll see that the `Error` story is now working as intended. MSW intercepted our remote API call and provided the appropriate response.

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/inbox-screen-with-msw-addon-angular-9-0.mp4"
    type="video/mp4"
  />
</video>

## Interaction tests

So far, we've been able to build a fully functional application from the ground up, starting from a simple component up to a screen and continuously testing each change using our stories. But each new story also requires a manual check on all the other stories to ensure the UI doesn't break. That's a lot of extra work.

Can't we automate this workflow and test our component interactions automatically?

### Write an interaction test using the play function

Storybook's [`play`](https://storybook.js.org/docs/writing-stories/play-function) can help us with that. A play function includes small snippets of code that run after the story renders. It uses framework-agnostic DOM APIs, meaning we can write stories with the play function to interact with the UI and simulate human behavior, regardless of the frontend framework. We'll use them to verify that the UI behaves as expected when we update our tasks.

Update your newly created `InboxScreen` story, and set up component interactions by adding the following:

```diff:title=src/app/components/inbox-screen.stories.ts
import type { Meta, StoryObj } from '@storybook/angular';

import { waitFor, waitForElementToBeRemoved } from 'storybook/test';

import { http, HttpResponse } from 'msw';

import { InboxScreenComponent } from './inbox-screen.component';

import * as PureTaskListStories from './pure-task-list.stories';

const meta: Meta<InboxScreenComponent> = {
  component: InboxScreenComponent,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<InboxScreenComponent>;

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(PureTaskListStories.TaskListData);
        }),
      ],
    },
  },
+ play: async ({ canvas, userEvent }: any) => {
+   await waitForElementToBeRemoved(await canvas.findByTestId('empty'));
+   await waitFor(async () => {
+     await userEvent.click(canvas.getByLabelText('pinTask-1'));
+     await userEvent.click(canvas.getByLabelText('pinTask-3'));
+   });
+ },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

<div class="aside">

💡 The `Interactions` panel helps us visualize our tests in Storybook, providing a step-by-step flow. It also offers a handy set of UI controls to pause, resume, rewind, and step through each interaction.

</div>

Check your newly-created story. Click the `Interactions` panel to see the list of interactions inside the story's play function.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-angular-9-0.mp4"
    type="video/mp4"
  />
</video>

### Automate tests with the test runner

With Storybook's play function, we were able to sidestep our problem, allowing us to interact with our UI and quickly check how it responds if we update our tasks—keeping the UI consistent at no extra manual effort.

But, if we take a closer look at our Storybook, we can see that it only runs the component tests when viewing the story. Therefore, we'd still have to go through each story to run all checks if we make a change. Couldn't we automate it?

The good news is that we can! Storybook's [test runner](https://storybook.js.org/docs/writing-tests/integrations/test-runner) allows us to do just that. It's a standalone utility—powered by [Playwright](https://playwright.dev/)—that runs all our interactions tests and catches broken stories.

Let's see how it works! Run the following command to install it:

```shell
npm install @storybook/test-runner --save-dev
```

Next, update your `package.json` `scripts` and add a new test task:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

Finally, with your Storybook running, open up a new terminal window and run the following command:

```shell
npm run test-storybook -- --url http://localhost:6006/ -- --watch
```

<div class="aside">

💡 Interaction testing with the play function is a fantastic way to test your UI components. It can do much more than we've seen here; we recommend reading the [official documentation](https://storybook.js.org/docs/writing-tests/interaction-testing) to learn more about it.

For an even deeper dive into testing, check out the [Testing Handbook](/ui-testing-handbook/). It covers testing strategies used by scaled-front-end teams to supercharge your development workflow.

</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution-angular-9-0.png)

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
