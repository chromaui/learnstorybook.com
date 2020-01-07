---
title: 'UI-Komponenten testen'
tocTitle: 'Testen'
description: 'Lerne, wie man UI-Komponenten testen kann'
commit: 78a45d1
---

Kein Storybook Tutorial ist komplett ohne Testen. Testen ist essenziel für die Erstellung hochwertiger UIs. In modularen Systemen können auch kleinste Änderungen einen langen Rattenschwanz nach sich ziehen. Bisher sind uns drei Arten von Tests begegnet: 

- **Visuelle Tests** verlassen sich darauf, dass die Entwickler manuell auf eine Komponente schauen, um deren Korrektheit zu bestätigen. Sie helfen uns dabei, das Erscheinungsbild einer Komponente einem Gesundheitscheck zu unterziehen.
- **Snapshot-Tests** mit Storyshots erfassen das gerenderte Markup einer Komponente. Sie helfen uns, Änderungen am Markup im Blick zu behalten, die Fehler und Warnungen beim Rendering verursachen.
- **Unit-Tests** mit Jest stellen sicher, dass der Output einer Komponente bei einem definierten Input gleich bleibt. Sie sind großartig, um die Funktionen einer Komponente zu testen.

## “Aber sieht es auch gut aus?”

Leider reichen die zuvor erwähnten Arten von Tests nicht aus, um UI Fehler zu vermeiden. UIs zu testen ist knifflig, da Designs subjektiv und detailreich sind. Visuelle Tests sind zu händisch, Snapshot Tests lösen zu viele Fehlalarme aus, wenn man sie für UIs einsetzt, und Unit-Tests auf Pixel-Ebene liefern einen zu geringen Mehrwert. Eine vollständige Storybook Test-Strategie umfasst auch visuelle Regressions-Tests.

## Visual regression testing for Storybook

Visual regression tests are designed to catch changes in appearance. They work by capturing screenshots of every story and comparing them commit-to-commit to surface changes. This is perfect for verifying graphical elements like layout, color, size, and contrast.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook is a fantastic tool for visual regression testing because every story is essentially a test specification. Each time we write or update a story we get a spec for free!

There are a number of tools for visual regression testing. For professional teams we recommend [**Chromatic**](https://www.chromaticqa.com/), an addon made by Storybook maintainers that runs tests in the cloud.

## Setup visual regression testing

Chromatic is a hassle-free Storybook addon for visual regression testing and review in the cloud. Since it’s a paid service (with a free trial), it may not be for everyone. However, Chromatic is an instructive example of a production visual testing workflow that we'll try out for free. Let’s have a look.

### Bring git up to date

Create React App has created a git repo for your project; let's check in the changes we have made:

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
yarn add storybook-chromatic
```

Then [login to Chromatic](https://www.chromaticqa.com/start) with your GitHub account (Chromatic only asks for lightweight permissions). Create a project with name "taskbox" and copy your unique `app-code`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Run the test command in the command line to setup visual regression tests for Storybook. Don't forget to add your unique app code in place of `<app-code>`.

```bash
npx chromatic --app-code=<app-code>
```

<div class="aside">
<code>--do-not-start</code> is an option that tells Chromatic not to start Storybook. Use this if you already have Storybook running. If not omit <code>--do-not-start</code>.
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
npx chromatic --app-code=<app-code>
```

Follow the link to the web UI where you’ll see changes.

![UI changes in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

There are a lot of changes! The component hierarchy where `Task` is a child of `TaskList` and `Inbox` means one small tweak snowballs into major regressions. This circumstance is precisely why developers need visual regression testing in addition to other testing methods.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## Review changes

Visual regression testing ensures components don’t change by accident. But it’s still up to you to determine whether changes are intentional or not.

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
