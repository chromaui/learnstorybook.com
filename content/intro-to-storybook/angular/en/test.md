---
title: 'Visual Tests'
tocTitle: 'Visual Testing'
description: 'Learn the ways to test UI components'
---

No Storybook tutorial would be complete without testing. Testing is essential to creating high-quality UIs. In modular systems, minuscule tweaks can result in major regressions. So far, we have encountered two types of tests:

- **Manual tests** rely on developers to manually look at a component to verify it for correctness. They help us sanity check a component’s appearance as we build.
- **Component tests** with the play function verify that the component behaves as expected when interacting with it. They're great for testing the behavior of a component when it's in use.

## “But does it look right?”

Unfortunately, the aforementioned testing methods alone aren’t enough to prevent UI bugs. UIs are tricky to test because design is subjective and nuanced. Manual tests are, well, manual. Other UI tests, such as snapshot tests, trigger too many false positives, and pixel-level unit tests are poorly valued. A complete Storybook testing strategy also includes visual regression tests.

## Visual testing with Storybook

Visual tests are designed to catch visual regressions and ensure consistent UI appearance. They work by capturing snapshots of every test and comparing them commit-to-commit to surface changes. It's perfect for verifying graphical elements like layout, color, size, and contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual tests because every story is essentially a test specification. Each time we write or update a story, we get a spec for free!

There are several tools for visual testing. We recommend [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), a free publishing service made by the Storybook maintainers that runs visual tests in a lightning-fast cloud browser environment. It also allows us to publish Storybook online, as we saw in the [previous chapter](/intro-to-storybook/angular/en/deploy/).

## Catch a UI change

Visual tests rely on comparing images of the newly rendered UI code to the baseline images. If a UI change is caught, we'll get notified.

Let's see how it works by tweaking the background of the `Task` component.

Start by creating a new branch for this change:

```shell
git checkout -b change-task-background
```

Change `src/app/components/task.component` to the following:

```diff:title=src/app/components/task.component.ts
import type { TaskData } from '../types';

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="list-item {{ task?.state }}">
      <label
        [attr.aria-label]="'archiveTask-' + task?.id"
        for="checked-{{ task?.id }}"
        class="checkbox"
      >
        <input
          type="checkbox"
          disabled="true"
          [defaultChecked]="task?.state === 'TASK_ARCHIVED'"
          name="checked-{{ task?.id }}"
          id="checked-{{ task?.id }}"
        />
        <span class="checkbox-custom" (click)="onArchive(task?.id)"></span>
      </label>
      <label [attr.aria-label]="task?.title + ''" for="title-{{ task?.id }}" class="title">
        <input
          type="text"
          [value]="task?.title"
          readonly="true"
          id="title-{{ task?.id }}"
          name="title-{{ task?.id }}"
          placeholder="Input title"
+         style="background-color: red;"
        />
      </label>
      <button
        *ngIf="task?.state !== 'TASK_ARCHIVED'"
        class="pin-button"
        [attr.aria-label]="'pinTask-' + task?.id"
        (click)="onPin(task?.id)"
      >
        <span class="icon-star"></span>
      </button>
    </div>
  `,
})
export class TaskComponent {
  /**
   * The shape of the task object
   */
  @Input() task?: TaskData;

  /**
   * Event handler for pinning tasks
   */
  @Output()
  onPinTask = new EventEmitter<Event>();

  /**
   * Event handler for archiving tasks
   */
  @Output()
  onArchiveTask = new EventEmitter<Event>();

  /**
   * @ignore
   * Component method to trigger the onPin event
   * @param id string
   */
  onPin(id: any) {
    this.onPinTask.emit(id);
  }
  /**
   * @ignore
   * Component method to trigger the onArchive event
   * @param id string
   */
  onArchive(id: any) {
    this.onArchiveTask.emit(id);
  }
}
```

This yields a new background color for the item.

![task background change](/intro-to-storybook/chromatic-task-changes-angular-9-0.png)

Add the file:

```shell
git add .
```

Commit it:

```shell
git commit -m "change task background to red"
```

And push the changes to the remote repo:

```shell
git push -u origin change-task-background
```

Finally, open your GitHub repository and open a pull request for the `change-task-background` branch.

![Creating a PR in GitHub for task](/github/pull-request-background.png)

Add a descriptive text to your pull request and click `Create pull request`. Click on the "🟡 UI Tests" PR check at the bottom of the page.

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

It will show you the UI changes caught by your commit.

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
   - A React version of this asset
 -->

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `Task` is a child of `PureTaskList` and `InboxScreen` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual tests and other testing methods.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Review changes

Visual regression testing ensures components don’t change by accident. But it’s still up to us to determine whether changes are intentional or not.

If a change is intentional, we'll need to update the baseline to compare future tests to the latest version of the story. If a change is unintentional, it needs to be fixed.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Since modern apps are constructed from components, it’s important that we test at the level of the component. Doing so helps us pinpoint the root cause of a change, the component, instead of reacting to symptoms of a change: the screens and composite components.

## Merge changes

When we’ve finished reviewing, we’re ready to merge UI changes with confidence--knowing that updates won’t accidentally introduce bugs. Accept the changes if you like the new `red` background. If not, revert to the previous state.

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
   - A React version of this asset
 -->

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook helps us **build** components; testing helps us **maintain** them. So far, the two types of UI testing covered in this tutorial were manual and visual tests. Both can be automated in CI as we've just finished setting up, and it helps us ship components without worrying about stowaway bugs. However, these are not the only ways to test components. We'll need to ensure our components remain accessible to all users, including those with disabilities. This means incorporating accessibility testing into our workflow.
