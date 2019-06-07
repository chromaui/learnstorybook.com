---
title: "Assemble a composite component"
tocTitle: "Composite component"
description: "Assemble a composite component out of simpler components"
commit: d3abd86
---

Last chapter we built our first component; this chapter extends what we learned to build TaskListComponent, a list of TaskComponents. Let’s combine components together and see what happens when more complexity is introduced.

## TasklistComponent

Taskbox emphasizes pinned tasks by positioning them above default tasks. This yields two variations of `TaskListComponent` you need to create stories for: default items and default and pinned items.

![default and pinned tasks](/tasklist-states-1.png)

Since `TaskComponent` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, an empty state is required when there are no tasks.

![empty and loading tasks](/tasklist-states-2.png)

## Get setup

A composite component isn’t much different than the basic components it contains. Create a `TaskListComponent` component and an accompanying story file: `src/tasks/task-list.component.ts` and `src/tasks/task-list.stories.ts`.

Start with a rough implementation of the `TaskListComponent`. You’ll need to import the `TaskComponent` component from earlier and pass in the attributes and actions as inputs and events.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'task-list',
  template: `
    <div class="list-items">
      <task-item
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </task-item>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  @Input() loading: boolean = false;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}
}
```

Next create `Tasklist`’s test states in the story file.

```typescript
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';

import { TaskComponent } from './task.component';
import { TaskListComponent } from './task-list.component';
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
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
  )
  .add('default', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  })
  .add('withPinnedTasks', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="tasks" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
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
          <task-list [tasks]="[]" loading="true" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  })
  .add('empty', () => {
    return {
      template: `
        <div style="padding: 3rem">
          <task-list [tasks]="[]" (onPinTask)="onPinTask($event)" (onArchiveTask)="onArchiveTask($event)"></task-list>
        </div>
      `,
      props,
    };
  });
```

`addDecorator()` allows us to add some “context” to the rendering of each task. In this case we add the module metadata so we can use all the Angular components inside out stories.

<div class="aside">
<a href="https://storybook.js.org/addons/introduction/#1-decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator to add metadata.
</div>

`task` supplies the shape of a `Task` that we created and exported from the `task.stories.ts` file. Similarly, `actions` defines the actions (mocked callbacks) that a `TaskComponent` expects, which the `TaskListComponent` also needs.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/inprogress-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases we wouldn’t create a new component just to add a wrapper. But the **real complexity** of `TaskListComponent` is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```typescript
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'task-list',
  template: `
    <div class="list-items">
      <task-item
        *ngFor="let task of tasksInOrder"
        [task]="task"
        (onArchiveTask)="onArchiveTask.emit($event)"
        (onPinTask)="onPinTask.emit($event)"
      >
      </task-item>

      <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
        <span class="icon-check"></span>
        <div class="title-message">You have no tasks</div>
        <div class="subtitle-message">Sit back and relax</div>
      </div>

      <div *ngIf="loading">
        <div *ngFor="let i of [1,2,3,4,5,6]" class="loading-item">
          <span class="glow-checkbox"></span>
          <span class="glow-text">
            <span>Loading</span> <span>cool</span> <span>state</span>
          </span>
        </div>
      </div>
    </div>
  `,
})
export class TaskListComponent implements OnInit {
  tasksInOrder: Task[] = [];
  @Input() loading: boolean = false;
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();
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
    src="/finished-tasklist-states.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements

As the component grows, so too do input requirements. Define the data requirements of `TaskListComponent` using TypeScript. Because `TaskComponent` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the model you defined in `task.model.ts` earlier.

## Automated testing

In the previous chapter we learned how to snapshot test stories using Storyshots. With `TaskComponent` there wasn’t a lot of complexity to test beyond that it renders OK. Since `TaskListComponent` adds another layer of complexity we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this we’ll create unit tests using [Jest](https://facebook.github.io/jest/) coupled with a test renderer.

![Jest logo](/logo-jest.png)

### Unit tests with Jest

Storybook stories paired with manual visual tests and snapshot tests (see above) go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed. Which brings us to unit tests.

In our case, we want our `TaskListComponent` to render any pinned tasks **before** unpinned tasks that it is passed in the `tasks` prop. Although we have a story (`withPinnedTasks`) to test this exact scenario; it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Jest to render the story to the DOM and run some DOM querying code to verify salient features of the output.

Create a test file called `task-list.component.spec.ts`. Here we’ll build out our tests that make assertions about the output.

```typescript
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

import { withPinnedTasks } from './task-list.stories';
import { By } from '@angular/platform-browser';

describe('TaskList component', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [TaskComponent, TaskListComponent],
      }).compileComponents();
    }),
  );

  it('renders pinned tasks at the start of the list', () => {
    fixture = TestBed.createComponent(TaskListComponent);
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

![TaskList test runner](/tasklist-testrunner.png)

Note that we’ve been able to reuse the `withPinnedTasks` list of tasks in both story and unit test; in this way we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in more and more ways.

Notice as well that this test is quite brittle. It's possible that as the project matures, and the exact implementation of the `TaskComponent` changes --perhaps using a different classname or a `textarea` rather than an `input`--the test will fail, and need to be updated. This is not necessarily a problem, but rather an indication to be careful liberally using unit tests for UI. They're not easy to maintain. Instead rely on visual, snapshot, and visual regression (see [testing chapter](/test/)) tests where possible.
