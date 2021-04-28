---
title: '外掛'
tocTitle: '外掛'
description: '了解整合、使用熱門功能：Control 外掛的方法'
commit: 'a23f4d0'
---

Storybook has a robust ecosystem of [addons](https://storybook.js.org/docs/react/configure/storybook-addons) that you can use to enhance the developer experience for everybody in your team. View them all [here](https://storybook.js.org/addons),

If you've been following along with this tutorial, you've already encountered multiple addons, and set one up in the [Testing](/intro-to-storybook/react/en/test/) chapter.

There are addons for every possible use case. It would take forever to write about them all. Let's integrate one of the most popular addons: [Controls](https://storybook.js.org/docs/react/essentials/controls).

## What is Controls?

Controls allows designers and developers to easily explore component behavior by _playing_ with its arguments. No code required. Controls creates an addon panel next to your stories, so you can edit their arguments live.

Fresh installs of Storybook include Controls out of the box. No extra configuration needed.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Addons unlock new Storybook workflows

Storybook is a wonderful [component-driven development environment](https://www.componentdriven.org/). The Controls addon evolves Storybook into an interactive documentation tool.

### Using Controls to find edge cases

With Controls QA Engineers, UI Engineers, or any other stakeholder can push the component to the limit! Let's consider the following example, what would happen to our `Task` if we added a **MASSIVE** string?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case.png)

That's not right! It looks like the text overflows beyond the bounds of the Task component.

Controls allowed us to quickly verify different inputs to a component. In this case a long string. This reduces the work required to discover UI problems.

Now let's fix the issue with overflowing by adding a style to `Task.js`:

```diff:title=src/components/Task.js
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
+ style={{ textOverflow: 'ellipsis' }}
/>
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls.png)

Problem solved! The text is now truncated when it reaches the boundary of the Task area using a handsome ellipsis.

### Adding a new story to avoid regressions

In the future, We can manually reproduce this problem by entering the same string via Controls. But it's easier to write a story that showcases this edge case. That expands our regression test coverage and clearly outlines the limits of the component(s) for the rest of the team.

Add a new story for the long text case in `Task.stories.js`:

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

Now we can reproduce and work on this edge case with ease.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

If we are [visual testing](/intro-to-storybook/react/en/test/), we'll also be informed if the ellipsizing solution breaks. Obscure edge-cases are liable to be forgotten without test coverage!

<div class="aside"><p>💡 Controls is a great way to get non-developers playing with your components and stories, and much more than we've seen here, we recommend reading the <a href="https://storybook.js.org/docs/react/essentials/controls">official documentation</a> to learn more about it. However, there are many more ways you can customize Storybook to fit your workflow with addons. In the <a href="/create-an-addon/react/en/introduction/">create an addon guide</a> we'll teach you that, by creating an addon that will help you supercharge your development workflow.</p></div>

### Merge Changes

Don't forget to merge your changes with git!
