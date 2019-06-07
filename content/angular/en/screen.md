---
title: "Construct a screen"
tocTitle: "Screens"
description: "Construct a screen out of components"
commit: deff6cb
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskListComponent` (which supplies its own data via ngxs) in some layout and pulling a top-level `error` field out of our store (let's assume we'll set that field if we have some problem connecting to our server). Create `inbox-screen.component.ts` in your `src/tasks/containers` folder:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'inbox-screen',
  template: `
    <pure-inbox-screen [error]="error$ | async"></pure-inbox-screen>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Select(TasksState.getError) error$: Observable<any>;

  constructor() {}

  ngOnInit() {}
}
```

Then, we need to create the `PureInboxScreenComponent` inside the `src/tasks/components` folder:

```typescript
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'pure-inbox-screen',
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
      <task-list></task-list>
    </div>
  `,
})
export class PureInboxScreenComponent implements OnInit {
  @Input() error: any;

  constructor() {}

  ngOnInit() {}
}
```

We also need to change the `AppComponent` to render the `InboxScreenComponent` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <inbox-screen></inbox-screen>
  `,
})
export class AppComponent {
  title = 'app';
}
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskListComponent` component is a **container** that renders the `PureTaskListComponent` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

When placing the `TaskListComponent` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskListComponent` and avoiding the container. We'll do something similar and create and render the `PureInboxScreen` in Storybook also.

However, for the `PureInboxScreenComponent` we have a problem because although the `PureInboxScreenComponent` itself is presentational, its child, the `TaskListComponent`, is not. In a sense the `PureInboxScreenComponent` has been polluted by “container-ness”. So when we setup our stories in `inbox-screen.stories.ts`:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TaskModule } from '../task.module';

storiesOf('InboxScreen', module)
  moduleMetadata({
    imports: [TaskModule],
    providers: [],
  }),
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  });
```

We see that our stories are broken now. This is due to the fact that both depend on our store and, even though, we're using a "pure" component for the error both stories still need the context.

![Broken inbox](/broken-inboxscreen.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromaticqa.com">Chromatic</a> alongside 670+ stories.
</div>

## Supplying context with decorators

The easiest way to do this is to supply the `Store` to our module and initialise the state as if this were a full app:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  )
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  });
```

Similar approaches exist to provide mocked context for other data libraries, such as [ngxs](https://ngxs.gitbook.io/ngxs/).

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Alternative method

You may be asking yourself why we created a new `PureInboxScreenComponent` just to test the `error` field. The short answer is that we wanted to show a pattern that's fairly common: nested container components. In this case, our `TaskListComponent` was connected to the store and it was contained inside the `InboxScreenComponent` which was also connected to the store (to get the `error`). We added the `PureInboxScreenComponent` to showcase how you could split components into their pure and connected parts and test them separately.

This is a very simple example so adding these pure components might seem like an overkill. In Storybook for Angular there's another way of writing stories for the `InboxScreenComponent`:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

import { Component } from '@angular/core';

@Component({
  template: `<inbox-screen></inbox-screen>`,
})
class HostDispatchErrorComponent {
  constructor(store: Store) {
    store.dispatch(new ErrorFromServer('Error'));
  }
}

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      declarations: [HostDispatchErrorComponent],
      imports: [TaskModule, NgxsModule.forRoot([TasksState])],
      providers: [Store],
    }),
  )
  .add('default', () => {
    return {
      template: `<inbox-screen></inbox-screen>`,
    };
  })
  .add('error', () => {
    return {
      template: `<pure-inbox-screen [error]="error"></pure-inbox-screen>`,
      props: {
        error: 'Something!',
      },
    };
  })
  .add('Connected Error', () => {
    return {
      component: HostDispatchErrorComponent,
    };
  });
```

As you can see, we've created a new wrapper component that includes our `InboxScreenComponent` directly. Inside its constructor we make use of Angular's dependency injection mechanism to access the `Store` instance and dispatch an error action. This results in the `error` being added to the store and, as a consequence, our `InboxScreenComponent properly renders the error state.

You might be wondering why we're using `component` instead of `template` to define our story. It turns out Storybook for Angular allows both methods and the `component` one does exactly what we need: it allow us to provide a reference to a component class and it will boostrap it as a component inside the module and render it. As a side effect, since this component is now part of our module it has access to all the providers and imported modules.

## Component-Driven Development

We started from the bottom with `TaskComponent`, then progressed to `TaskListComponent`, now we’re here with a whole screen UI. Our `InboxScreenComponent` accommodates a nested component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.
