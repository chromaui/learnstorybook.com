---
title: 'Test UI components'
tocTitle: 'Testing'
description: 'Learn how to automate testing UI components through GitHub actions'
commit: '3e283f7'
---

<div class="aside"><h4> semantically align the headings </h4></div>

In the [previous chapter](/react/en/deploy), we saw how we could deploy our Storybook both manually and through CI, using GitHub actions.

In this chapter we're going to use what we've learned and see it in action.

## Catch a UI change

Visual regression testing relies on comparing images of the new rendered UI code to the baseline images. If a UI change is caught we'll get notified.

Let's see how it works by tweaking the background of the `Task` component:

```js
// src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
    style={{ textOverflow: 'ellipsis', background: 'red' }}
  />
</div>
```

This yields a new background color for the item.

![task background change](/intro-to-storybook/chromatic-task-change.png)

Now once we commit and push the changes to our remote repo, our action will execute and not only update our Storybook with the new change, but also generate a new set of changes that need to reviewed.

![actions panel](/github/gh-actions-panel.png)

Once our action finishes it's execution we'll see a screen like the following. Scrolling through it we'll see what was done but also we get a link that will redirect us to our Chromatic dashboard. In there we're presented with a multitude of options and amongst them we can also get a link to our deployed Storybook also.

![Storybook deployed via action](/github/gh-action-finished.png)

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

Storybook helps us **build** components; testing helps us **maintain** them. The four types of UI testing covered in this tutorial were visual, snapshot, unit, and visual regression testing. The last three can be automated by adding them to a CI as we've just finished setting up. This helps us ship components without worrying about stowaway bugs. The whole workflow is illustrated below.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
