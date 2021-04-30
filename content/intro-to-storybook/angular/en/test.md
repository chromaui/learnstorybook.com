---
title: 'Test UI components'
tocTitle: 'Testing'
description: 'Learn the ways to test UI components'
commit: 8fdc779
---

No Storybook tutorial would be complete without testing. Testing is essential to creating high quality UIs. In modular systems, miniscule tweaks can result in major regressions. So far we encountered three types of tests:

- **Manual tests** rely on developers to manually look at a component to verify it for correctness. They help us sanity check a component’s appearance as we build.
- **Snapshot tests** with Storyshots capture a component’s rendered markup. They help us stay abreast of markup changes that cause rendering errors and warnings.
- **Unit tests** with Jest verify that the output of a component remains the same given a fixed input. They’re great for testing the functional qualities of a component.

## “But does it look right?”

Unfortunately, the aforementioned testing methods alone aren’t enough to prevent UI bugs. UIs are tricky to test because design is subjective and nuanced. Manual tests are, well, manual. Snapshot tests trigger too many false positives when used for UI. Pixel-level unit tests are poor value. A complete Storybook testing strategy also includes visual regression tests.

## Visual testing for Storybook

Visual regression tests, also called visual tests, are designed to catch changes in appearance. They work by capturing screenshots of every story and comparing them commit-to-commit to surface changes. This is perfect for verifying graphical elements like layout, color, size, and contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual regression testing because every story is essentially a test specification. Each time we write or update a story we get a spec for free!

There are a number of tools for visual regression testing. We recommend [**Chromatic**](https://www.chromatic.com/), a free publishing service made by the Storybook maintainers that runs visual tests in parallelized cloud. It also allows us to publish Storybook online as we saw in the [previous chapter](/intro-to-storybook/angular/en/deploy/).

## Catch a UI change

Visual regression testing relies on comparing images of the new rendered UI code to the baseline images. If a UI change is caught we'll get notified.

Let's see how it works by tweaking the background of the `Task` component.

Start by creating a new branch for this change:

```bash
git checkout -b change-task-background
```

Change `TaskComponent` to the following:

```diff:title=src/app/components/task.component.ts
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
+ style="background: red;"
/>
```

This yields a new background color for the item.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Add the file:

```bash
git add .
```

Commit it:

```bash
git commit -m "change task background to red"
```

And push the changes to the remote repo:

```bash
git push -u origin change-task-background
```

Finally, open your GitHub repository and open a pull request for the `change-task-background` branch.

![Creating a PR in GitHub for task](/github/pull-request-background.png)

Add a descriptive text to your pull request and click `Create pull request`. Click on the "🟡 UI Tests" PR check at the bottom of the page.

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

This will show you the UI changes caught by your commit.

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `TaskComponent` is a child of `TaskListComponent` and `InboxScreenComponent` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual regression testing in addition to other testing methods.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Review changes

Visual regression testing ensures components don’t change by accident. But it’s still up to us to determine whether changes are intentional or not.

If a change is intentional we'll need to update the baseline so that future tests are compared to the latest version of the story. If a change is unintentional it needs to be fixed.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

Since modern apps are constructed from components, it’s important that we test at the level of component. Doing so helps us pinpoint the root cause of a change, the component, instead of reacting to symptoms of a change, the screens and composite components.

## Merge changes

When we’ve finished reviewing we’re ready to merge UI changes with confidence --knowing that updates won’t accidentally introduce bugs. If you like the new `red` background then accept the changes, if not revert to the previous state.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook helps us **build** components; testing helps us **maintain** them. The four types of UI testing covered in this tutorial were manual, snapshot, unit, and visual regression testing. The last three can be automated by adding them to a CI as we've just finished setting up. This helps us ship components without worrying about stowaway bugs. The whole workflow is illustrated below.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
