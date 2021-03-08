---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
commit: d3abd86
---

Last chapter we built our first component; this chapter extends what we learned to build TaskListComponent, a list of TaskComponents. Let’s combine components together and see what happens when more complexity is introduced.

## TasklistComponent

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskList` you need to create stories for: default items and default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/app/components/task-list.component.ts` and `src/app/components/task-list.stories.ts`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs and events.

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <div *ngIf="loading">loading</div>
      <div *ngIf="!loading && tasks.length === 0">empty</div>
      <app-task
        *ngFor="let task of tasks"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  @Input() tasks: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

Next create `Tasklist`’s test states in the story file.

```typescript
// src/app/components/task-list.stories.ts

import { moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { taskData, actionsData } from './task.stories';

export default {
  title: 'TaskList',
  excludeStories: /.*Data$/,
  decorators: [
    moduleMetadata({
      // imports both components to allow component composition with storybook
      declarations: [TaskListComponent, TaskComponent],
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
  component: TaskListComponent,
  template: `
  <div style="padding: 3rem">
    <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
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
  component: TaskListComponent,
  template: `
    <div style="padding: 3rem">
      <app-task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
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
          <app-task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
// tasklist no tasks
export const Empty = () => ({
  template: `
        <div style="padding: 3rem">
          <app-task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></app-task-list>
        </div>
      `,
});
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator `key` on the default export to add some `padding` around the rendered component. They can also be used to wrap stories in “providers” –i.e. library components that set React context.
</div>

`taskData` supplies the shape of a `Task` that we created and exported from the `task.stories.ts` file. Similarly, `actionsData` defines the actions (mocked callbacks) that a `TaskComponent` expects, which the `TaskListComponent` also needs.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases we wouldn’t create a new component just to add a wrapper. But the **real complexity** of `TaskListComponent` is revealed in the edge cases `WithPinnedTasks`, `loading`, and `empty`.

```typescript
// src/app/components/task-list.component.ts

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
    <div class="list-items">
      <app-task
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </app-task>

      <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
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
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  @Input()
  set tasks(arr: Task[]) {
    this.tasksInOrder = [
      ...arr.filter(t => t.state === 'TASK_PINNED'),
      ...arr.filter(t => t.state !== 'TASK_PINNED'),
    ];
  }

  constructor() {}

  ngOnInit() {}
}
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements

As the component grows, so too do input requirements. Define the data requirements of `TaskListComponent` using TypeScript. Because `TaskComponent` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the model you defined in `task.model.ts` earlier.

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `TaskComponent` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskListComponent` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer.

![Jest logo](/intro-to-storybook/logo-jest.png)

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskListComponent` to render any pinned tasks **before** unpinned tasks that it is passed in the `tasks` prop. Although we have a story (`WithPinnedTasks`) to test this exact scenario; it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `task-list.component.spec.ts`. Here we’ll build out our tests that make assertions about the output.

```typescript
// src/app/components/task-list.component.spec.ts

import { render } from '@testing-library/angular';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';
import { withPinnedTasksData } from './task-list.stories';
describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(TaskListComponent, {
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

![TaskList test runner](/intro-to-storybook/tasklist-testrunner.png)

Note that we’ve been able to reuse the `withPinnedTasksData` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in more and more ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `TaskComponent` changes --perhaps using a different class name or a `textarea` rather than an `input`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot, and visual regression (see [testing chapter](/intro-to-storybook/angular/en/test/)) tests where possible.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
