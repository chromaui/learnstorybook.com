---
title: 'Addons'
tocTitle: 'Addons'
description: 'Learn how to integrate and use the Controls addon using a popular example'
commit: 'b3bca4a'
---

Storybook has a robust ecosystem of [addons](https://storybook.js.org/docs/react/configure/storybook-addons) that you can use to enhance the developer experience for
everybody in your team. If you've been following along with this tutorial linearly, we have referenced multiple addons so far, and you will have already implemented one in the [Testing chapter](/react/en/test/).

<div class="aside">
<strong>Looking for a list of potential addons?</strong>
<br/>
😍 You can see the list of officially-supported and strongly-supported community addons <a href="https://storybook.js.org/addons">here</a>.
</div>

We could write forever about every use case for addons. For now, let's work towards integrating the popular addon [Controls](https://storybook.js.org/docs/react/essentials/controls).

If you've been following this tutorial, you already have Controls setup. Fresh installs of Storybook include [essential addons](https://storybook.js.org/docs/react/essentials/introduction) to the Storybook experience. Thus, there's no extra configuration.

### Using Controls to find edge cases

With Controls QA Engineers, UI Engineers, or any other stakeholder can push the component to the limit! Let's consider the following example, what would happen to our `Task` if we added a **MASSIVE** string?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case.png)

Ohh no 😥 !

Looks like we have a problem with our component.

This is where Controls comes in. We can use it to try different inputs in a component to find and fix such problems with minimal effort. Let's fix the issue with overflowing by adding styling to `Task.js`:

```js
// src/components/Task.js

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask, inputStyle }) {
  return (
    <div className={`list-item ${state}`}>
      /* same as before */
      <div className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
          /* Our new styling added */
          style={{ textOverflow: inputStyle }}
        />
      </div>
      /* same as before */
    </div>
  );
}
Task.propTypes = {
  /** same as before */
  /**  Our new propType to configure the styling for the input */
  inputStyle: PropTypes.string,
};
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls.png)

That's it! 👍

With this small change, we made our component more robust and introduced a way to visually test and fix any existing edge cases.

## Addons unlock new Storybook workflows

Storybook already serves as a wonderful [component-driven development environment](https://www.componentdriven.org/). With Controls we also created documentation that is interactive. Now anyone can easily figure out component behavior by _playing_ with its arguments.

![New docs for styling](/intro-to-storybook/task-style-docs.png)

### Adding a new story to avoid regressions

It's always a good practice to write a fixed story for inputs like this. This will increase your regression testing and outline the limits of the component(s) for all stakeholders.

Let's add a story for the long text case in `Task.stories.js`:

```js
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
  inputStyle: 'ellipsis',
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/using-addons-example-complete.mp4"
    type="video/mp4"
  />
</video>

With this new story, we can now reduce the amount of edge cases that could have easily be forgotten.

Now your team members will thank you.

### Merge Changes

Don't forget to merge your changes with git!

<div class="aside"><p>Controls is a great way to get non-developers playing with your components and stories, and much more than we've seen here, we recommend reading the <a href="https://storybook.js.org/docs/react/essentials/controls">official documentation</a> to learn more about it. However, there are many more ways you can customize Storybook to fit your workflow with addons. In the <a href="/intro-to-storybook/react/en/creating-addons">create addons</a> bonus chapter we'll teach you that, by creating a addon that will help you supercharge your development workflow.</p></div>
