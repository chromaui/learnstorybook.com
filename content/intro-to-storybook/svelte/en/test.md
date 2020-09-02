---
title: 'Test UI components'
tocTitle: 'Testing'
description: 'Learn the ways to test UI components'
---

No Storybook tutorial would be complete without testing. Testing is essential to creating high quality UIs. In modular systems, miniscule tweaks can result in major regressions. So far we encountered three types of tests:

- **Visual tests** rely on developers to manually look at a component to verify it for correctness. They help us sanity check a component’s appearance as we build.
- **Snapshot tests** with Storyshots capture a component’s rendered markup. They help us stay abreast of markup changes that cause rendering errors and warnings.
- **Unit tests** with Jest verify that the output of a component remains the same given an fixed input. They’re great for testing the functional qualities of a component.

## “But does it look right?”

Unfortunately, the aforementioned testing methods alone aren’t enough to prevent UI bugs. UIs are tricky to test because design is subjective and nuanced. Visual tests are too manual, snapshot tests trigger too many false positives when used for UI, and pixel-level unit tests are poor value. A complete Storybook testing strategy also includes visual regression tests.

## Visual regression testing for Storybook

Visual regression tests are designed to catch changes in appearance. They work by capturing screenshots of every story and comparing them commit-to-commit to surface changes. This is perfect for verifying graphical elements like layout, color, size, and contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual regression testing because every story is essentially a test specification. Each time we write or update a story we get a spec for free!

There are a number of tools for visual regression testing. For professional teams we recommend [**Chromatic**](https://www.chromatic.com/), an addon made by Storybook maintainers that runs tests in the cloud.

## Setup visual regression testing

Chromatic is a hassle-free Storybook addon for visual regression testing and review in the cloud. Since it’s a paid service (with a free trial), it may not be for everyone. However, Chromatic is an instructive example of a production visual testing workflow that we'll try out for free. Let’s have a look.

### Initialize local repository

At this stage there's still no repository setup just yet. Let's change that and set it up:

```bash
$ git init
```

Next add files to the first commit.

```bash
$ git add -A
```

Now commit the files.

```bash
$ git commit -m "taskbox UI"
```

### Get Chromatic

Add the package as a dependency.

```bash
npm install -D chromatic
```

Then [login to Chromatic](https://www.chromatic.com/start) with your GitHub account (Chromatic only asks for lightweight permissions). Create a project with name "taskbox" and copy your unique `project-token`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

A small change is required to the `build-storybook` script to allow the `chromatic` addon to correctly display the both the assets (icons and fonts) and the css that was added in the beginning of the tutorial

```json
{
  "scripts": {
    "build-storybook": "build-storybook -s public"
  }
}
```

Run the test command in the command line to setup visual regression tests for Storybook. Don't forget to add your unique app code in place of `<project-token>`.

```bash
 npx chromatic --project-token=<project-token>
```

<div class="aside">
If your Storybook has a custom build script you may have to <a href="https://www.chromatic.com/docs/setup#command-options">add options</a> to this command.
</div>

Once the first test is complete, we have test baselines for each story. In other words, screenshots of each story known to be “good”. Future changes to those stories will be compared to the baselines.

![Chromatic baselines](/intro-to-storybook/chromatic-baselines.png)

## Catch a UI change

Visual regression testing relies on comparing images of the new rendered UI code to the baseline images. If a UI change is caught you get notified. See how it works by tweaking the background of the `Task` component:

![code change](/intro-to-storybook/chromatic-change-to-task-component.png)

This yields a new background color for the item.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Use the test command from earlier to run another Chromatic test.

```bash
npx chromatic --project-token=<project-token>
```

Follow the link to the web UI where you’ll see changes.

![UI changes in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `Task` is a child of `TaskList` and `Inbox` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual regression testing in addition to other testing methods.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Review changes

Visual regression testing ensures components dont change by accident. But it’s still up to you to determine whether changes are intentional or not.

If a change is intentional you need to update the baseline so that future tests are compared to the latest version of the story. If a change is unintentional it needs to be fixed.

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

Storybook helps you **build** components; testing helps you **maintain** them. The four types of UI testing are covered in this tutorial are visual, snapshot, unit, and visual regression testing. You can automate the last three by adding them to your CI script. This helps you ship components without worrying about stowaway bugs. The whole workflow is illustrated below.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
