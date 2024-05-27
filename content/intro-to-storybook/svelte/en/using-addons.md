---
title: 'Addons'
tocTitle: 'Addons'
description: 'Learn how to integrate and use the popular Controls addon'
---

Storybook has a robust ecosystem of [addons](https://storybook.js.org/docs/configure/storybook-addons) that you can use to enhance the developer experience for everybody in your team. View them all [here](https://storybook.js.org/integrations).

If you've been following this tutorial, you've already encountered multiple addons and set one up in the [Testing](/intro-to-storybook/svelte/en/test/) chapter.

There are addons for every possible use case, and it would take forever to write about them all. Let's integrate one of the most popular addons: [Controls](https://storybook.js.org/docs/essentials/controls).

## What is Controls?

Controls allows designers and developers to easily explore component behavior by _playing_ with its arguments. No code required. Controls creates an addon panel next to your stories, so you can edit their arguments live.

Fresh installs of Storybook include Controls out of the box. No extra configuration needed.

<!-- record video  -->
<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

## Addons unlock new Storybook workflows

Storybook is a wonderful [component-driven development environment](https://www.componentdriven.org/). The Controls addon evolves Storybook into an interactive documentation tool.

### Using Controls to find edge cases

With Controls, QA Engineers, UI Engineers, or any other stakeholder can push the component to the limit! Considering the following example, what would happen to our `Task` if we added a **MASSIVE** string?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case-7-0.png)

That's not right! It looks like the text overflows beyond the bounds of the Task component.

Controls allowed us to quickly verify different inputs to a component--in this case, a long string--and reduced the work required to discover UI problems.

Now let's fix the issue with overflowing by adding a style to `Task.svelte`:

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
+     style="text-overflow: ellipsis;"
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

![That's better.](/intro-to-storybook/edge-case-solved-with-controls-7-0.png)

Problem solved! The text is now truncated when it reaches the boundary of the Task area using a handsome ellipsis.

### Adding a new story to avoid regressions

In the future, we can manually reproduce this problem by entering the same string via Controls. But it's easier to write a story that showcases this edge case. That expands our regression test coverage and clearly outlines the limits of the component(s) for the rest of the team.

Add a new story for the long text case in `Task.stories.js`:

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};
```

Now we can reproduce and work on this edge case with ease.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

If we are [visual testing](/intro-to-storybook/svelte/en/test/), we'll also be informed if the truncating solution breaks. Obscure edge cases are liable to be forgotten without test coverage!

<div class="aside">

💡 Controls is a great way to get non-developers playing with your components and stories. It can do much more than we've seen here; we recommend reading the [official documentation](https://storybook.js.org/docs/essentials/controls) to learn more about it. However, there are many more ways you can customize Storybook to fit your workflow with addons. In the [create an addon guide](https://storybook.js.org/docs/addons/writing-addons) we'll teach you that, by creating an addon that will help you supercharge your development workflow.

</div>

### Merge Changes

Don't forget to merge your changes with git!
