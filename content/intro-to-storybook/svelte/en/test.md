---
title: 'Visual Tests'
tocTitle: 'Visual Testing'
description: 'Learn the ways to test UI components'
---

No Storybook tutorial would be complete without testing. Testing is essential to creating high-quality UIs. In modular systems, minuscule tweaks can result in major regressions. So far, we have encountered three types of tests:

- **Manual tests** rely on developers to manually look at a component to verify it for correctness. They help us sanity check a component’s appearance as we build.

- **Accessibility tests** with a11y addon verify that the component is accessible to everyone. They're great for allowing us to collect information about how people with certain types of disabilities use our components.

- **Interaction tests** with the play function verify that the component behaves as expected when interacting with it. They're great for testing the behavior of a component when it's in use.

## “But does it look right?”

Unfortunately, the aforementioned testing methods alone aren’t enough to prevent UI bugs. UIs are tricky to test because design is subjective and nuanced. Manual tests are, well, manual. Other UI tests, such as snapshot tests, trigger too many false positives, and pixel-level unit tests are poorly valued. A complete Storybook testing strategy also includes visual regression tests.

## Visual testing for Storybook

Visual regression tests, also called visual tests, are designed to catch changes in appearance. They work by capturing screenshots of every story and comparing them commit-to-commit to surface changes. It's perfect for verifying graphical elements like layout, color, size, and contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual regression testing because every story is essentially a test specification. Each time we write or update a story, we get a spec for free!

There are several tools for visual regression testing. We recommend [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), a free publishing service made by the Storybook maintainers that runs visual tests in a lightning-fast cloud browser environment. It also allows us to publish Storybook online, as we saw in the [previous chapter](/intro-to-storybook/svelte/en/deploy/).

## Catch a UI change

Visual regression testing relies on comparing images of the newly rendered UI code to the baseline images. If a UI change is caught, we'll get notified.

Let's see how it works by tweaking the background of the `Task` component.

Start by creating a new branch for this change:

```shell
git checkout -b change-task-background
```

Change `src/components/Task.svelte` to the following:

```diff:title=src/components/Task.svelte
<div class="list-item {task.state}">
  <label
    for={`checked-${task.id}`}
    class="checkbox"
    aria-label={`archiveTask-${task.id}`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      disabled
      name={`checked-${task.id}`}
      id={`archiveTask-${task.id}`}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="checkbox-custom"
      role="button"
      on:click={ArchiveTask}
      tabindex="-1"
      aria-label={`archiveTask-${task.id}`}
    />
  </label>
  <label for={`title-${task.id}`} aria-label={task.title} class="title">
    <input
      type="text"
      value={task.title}
      readonly
      name="title"
      id={`title-${task.id}`}
      placeholder="Input title"
+     style="background-color: red;"
    />
  </label>
  {#if task.state !== 'TASK_ARCHIVED'}
    <button
      class="pin-button"
      on:click|preventDefault={PinTask}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star" />
    </button>
  {/if}
</div>
```

This yields a new background color for the item.

![task background change](/intro-to-storybook/chromatic-task-change-7-0.png)

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

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `Task` is a child of `TaskList` and `Inbox` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual regression testing in addition to other testing methods.

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

Since modern apps are constructed from components, it’s important that we test at the level of the component. Doing so helps us pinpoint the root cause of a change, the component, instead of reacting to symptoms of a change, the screens, and composite components.

## Merge changes

When we’ve finished reviewing, we’re ready to merge UI changes with confidence--knowing that updates won’t accidentally introduce bugs. If you like the new `red` background, then accept the changes. If not, revert to the previous state.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook helps us **build** components; testing helps us **maintain** them. The four types of UI testing covered in this tutorial were manual, snapshot, unit, and visual regression testing. You can automate the last three by adding them to a CI as we've just finished setting up, and it helps us ship components without worrying about stowaway bugs. The whole workflow is illustrated below.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
