---
title: "Construct a screen"
tocTitle: "Screens"
description: "Construct a screen out of components"
commit: 9ead5d8
---

# Construct a screen

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Container components

Let's start by refactoring our app a bit, we'll need to create two folders: `containers` and `components`. After that, let's move both `task.component.ts` and `task-list.component.ts` (with their corresponding `.stories.ts` file) inside the latter. After that, update any references in the imports.

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskListComponent` in some layout and pulling a top-level `error` and `entities` fields out of our store. Create `inbox-screen.component.ts` in your `src/tasks/containers` folder:

```typescript
import { Component, OnInit, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { TasksState, ArchiveTask, PinTask } from '../state/task.state';
import { Task } from '../task.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'inbox-screen',
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
      <task-list [tasks]="tasks$ | async" (onArchiveTask)="archiveTask($event)" (onPinTask)="pinTask($event)"></task-list>
    </div>
  `,
})
export class InboxScreenComponent implements OnInit {
  @Input() error: any = null;
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

We also change the `AppComponent` to render the `InboxScreenComponent` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

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

As we saw previously, the `InboxScreenComponent` is a **container** that renders the `TaskListComponent` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

However, for the `InboxScreenComponent` we have a problem because it depends on the store. Luckily, Storybook for Angular provides the `moduleMetadata` decorator that allows us to configure the underlying module:

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { Store, NgxsModule } from '@ngxs/store';
import { TasksState, ErrorFromServer } from '../state/task.state';
import { TaskModule } from '../task.module';

import { Component } from '@angular/core';

storiesOf('InboxScreen', module)
  .addDecorator(
    moduleMetadata({
      declarations: [],
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
      template: `<inbox-screen></inbox-screen>`,
    };
  });
```
We see that although the `default` story works just fine (because we have default data in our store), we have an issue in the `error` story, because the `error` field is connected to the store itself and we can't just modify it from outside. We need to dispatch and action on the store. 

![Broken inbox](/broken-inboxscreen.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://chromaticqa.com">Chromatic</a> alongside 670+ stories.
</div>

## Supplying context with decorators

The easiest way to do this is to create a wrapper component and include it in the declarations of the module. By doing so, the instances of the providers we've configured are also available in out host component's constructor. This will allow us to dispatch an action that will create an error inside the store:

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
      component: HostDispatchErrorComponent,
    };
  });
```
In Storybook for Angular we have two ways of providing stories: as a reference via the `component` field or as a `template`. In this case we use the former since it allow us to 'plug' inside the module and interact with the injected instance of the store.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

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
