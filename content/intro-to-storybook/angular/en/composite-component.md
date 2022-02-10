---
title: 'Assemble a composite component'
tocTitle: 'Composite component'
description: 'Assemble a composite component out of simpler components'
commit: 'e79fc03'
---

Last chapter, we built our first component; this chapter extends what we learned to make TaskList, a list of Tasks. Let’s combine components together and see what happens when we introduce more complexity.

## Tasklist

Taskbox emphasizes pinned tasks by positioning them above default tasks. It yields two variations of `TaskList` you need to create stories for, default and pinned items.

![default and pinned tasks](/intro-to-storybook/tasklist-states-1.png)

Since `Task` data can be sent asynchronously, we **also** need a loading state to render in the absence of a connection. In addition, we require an empty state for when there are no tasks.

![empty and loading tasks](/intro-to-storybook/tasklist-states-2.png)

## Get set up

A composite component isn’t much different from the basic components it contains. Create a `TaskList` component and an accompanying story file: `src/app/components/task-list.component.ts` and `src/app/components/task-list.stories.ts`.

Start with a rough implementation of the `TaskList`. You’ll need to import the `Task` component from earlier and pass in the attributes and actions as inputs.

```ts:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';

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
export class TaskListComponent {
  /** The list of tasks */
  @Input() tasks: Task[] = [];

  /** Checks if it's in loading state */
  @Input() loading = false;

  /** Event to change the task to pinned */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onPinTask = new EventEmitter<Event>();

  /** Event to change the task to archived */
  // tslint:disable-next-line: no-output-on-prefix
  @Output()
  onArchiveTask = new EventEmitter<Event>();
}
```

Next, create `Tasklist`’s test states in the story file.

```ts:title=src/app/components/task-list.stories.ts
import { componentWrapperDecorator, moduleMetadata, Meta, Story } from '@storybook/angular';

import { CommonModule } from '@angular/common';

import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

import * as TaskStories from './task.stories';

export default {
  component: TaskListComponent,
  decorators: [
    moduleMetadata({
      //👇 Imports both components to allow component composition with Storybook
      declarations: [TaskListComponent, TaskComponent],
      imports: [CommonModule],
    }),
    //👇 Wraps our stories with a decorator
    componentWrapperDecorator(story => `<div style="margin: 3em">${story}</div>`),
  ],
  title: 'TaskList',
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

<div class="aside">
💡 <a href="https://storybook.js.org/docs/angular/writing-stories/decorators"><b>Decorators</b></a> are a way to provide arbitrary wrappers to stories. In this case we’re using a decorator `key` on the default export to add some `padding` around the rendered component. They can also be used to wrap stories in “providers”–-i.e., library components that set some context.
</div>

By importing `TaskStories`, we were able to [compose](https://storybook.js.org/docs/angular/writing-stories/args#args-composition) the arguments (args for short) in our stories with minimal effort. That way, the data and actions (mocked callbacks) expected by both components are preserved.

Now check Storybook for the new `TaskList` stories.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Build out the states

Our component is still rough, but now we have an idea of the stories to work toward. You might be thinking that the `.list-items` wrapper is overly simplistic. You're right – in most cases, we wouldn’t create a new component just to add a wrapper. But the **real complexity** of the `TaskList` component is revealed in the edge cases `withPinnedTasks`, `loading`, and `empty`.

```diff:title=src/app/components/task-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task.model';

@Component({
  selector: 'app-task-list',
  template: `
+   <div class="list-items">
+     <app-task
+       *ngFor="let task of tasksInOrder"
+       [task]="task"
+       (onArchiveTask)="onArchiveTask.emit($event)"
+       (onPinTask)="onPinTask.emit($event)"
+     >
+     </app-task>
+     <div *ngIf="tasksInOrder.length === 0 && !loading" class="wrapper-message">
+       <span class="icon-check"></span>
+       <div class="title-message">You have no tasks</div>
+       <div class="subtitle-message">Sit back and relax</div>
+     </div>
+     <div *ngIf="loading">
+       <div *ngFor="let i of [1, 2, 3, 4, 5, 6]" class="loading-item">
+         <span class="glow-checkbox"></span>
+         <span class="glow-text"> <span>Loading</span> <span>cool</span> <span>state</span> </span>
+       </div>
+     </div>
+   </div>
  `,
})
export class TaskListComponent {
- @Input() tasks: Task[] = [];

+  /**
+  * @ignore
+  * Component property to define ordering of tasks
+  */
+ tasksInOrder: Task[] = [];

  @Input() loading = false;

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onPinTask: EventEmitter<any> = new EventEmitter();

  // tslint:disable-next-line: no-output-on-prefix
  @Output() onArchiveTask: EventEmitter<any> = new EventEmitter();

+ @Input()
+ set tasks(arr: Task[]) {
+   this.tasksInOrder = [
+     ...arr.filter(t => t.state === 'TASK_PINNED'),
+     ...arr.filter(t => t.state !== 'TASK_PINNED'),
+   ];
+ }
}
```

The added markup results in the following UI:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Note the position of the pinned item in the list. We want the pinned item to render at the top of the list to make it a priority for our users.

## Data requirements

As the component grows, so too do input requirements. Define the data requirements of `TaskList` component using TypeScript. Because `Task` is a child component, make sure to provide data in the right shape to render it. To save time and headache, reuse the model you defined in `task.model.ts` earlier.

## Automated testing

In the previous chapter, we learned how to snapshot test stories using Storyshots. With `Task`, there wasn’t much complexity to test beyond that it renders OK. Since `TaskList` adds another layer of complexity, we want to verify that certain inputs produce certain outputs in a way amenable to automatic testing. To do this, we’ll create unit tests using [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro).

![Testing library logo](/intro-to-storybook/testinglibrary-image.jpeg)

### Unit tests with Angular Testing Library

Storybook stories, manual tests, and snapshot tests go a long way to avoiding UI bugs. If stories cover a wide variety of component use cases, and we use tools that ensure a human checks any change to the story, errors are much less likely.

However, sometimes the devil is in the details. A test framework that is explicit about those details is needed, bringing us to unit tests.

In our case, we want our `TaskList` to render any pinned tasks **before** unpinned tasks that it has passed in the `tasks` prop. Although we have a story (`WithPinnedTasks`) to test this exact scenario, it can be ambiguous to a human reviewer that if the component **stops** ordering the tasks like this, it is a bug. It certainly won’t scream **“Wrong!”** to the casual eye.

So, to avoid this problem, we can use Angular Testing Library to render the story to the DOM and run some DOM querying code to verify salient features of the output. The nice thing about the story format is that we can import the story in our tests and render it there!

Create a test file called `task-list.component.spec.ts`. Here we’ll build out our tests that make assertions about the output.

```ts:title=src/app/components/task-list.component.spec.ts
import { render } from '@testing-library/angular';

import { TaskListComponent } from './task-list.component';
import { TaskComponent } from './task.component';

//👇 Our story imported here
import { WithPinnedTasks } from './task-list.stories';

describe('TaskList component', () => {
  it('renders pinned tasks at the start of the list', async () => {
    const mockedActions = jest.fn();
    const tree = await render(TaskListComponent, {
      declarations: [TaskComponent],
      componentProperties: {
        ...WithPinnedTasks.args,
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

Note that we’ve been able to reuse the `WithPinnedTasks` story in our unit test; in this way, we can continue to leverage an existing resource (the examples that represent interesting configurations of a component) in many ways.

Notice as well that this test is quite brittle. It's possible that as the project matures and the exact implementation of the `Task` changes--perhaps using a different classname or a `textarea` rather than an `input`--the test will fail and need to be updated. It is not necessarily a problem but rather an indication of being careful about using unit tests for UI. They're not easy to maintain. Instead rely on manual, snapshot, and visual regression (see [testing chapter](/intro-to-storybook/angular/en/test/)) tests where possible.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
