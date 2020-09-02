---
title: 'Addons'
tocTitle: 'Addons'
description: 'Learn how to integrate and use addons using a popular example'
---

Storybook boasts a robust system of [addons](https://storybook.js.org/addons/introduction/) with which you can enhance the developer experience for
everybody in your team. If you've been following along with this tutorial linearly, we have referenced multiple addons so far, and you will have already implemented one in the [Testing chapter](/angular/en/test/).

<div class="aside">
<strong>Looking for a list of potential addons?</strong>
<br/>
😍 You can see the list of officially-supported and strongly-supported community addons <a href="https://storybook.js.org/addons">here</a>.
</div>

We could write forever about configuring and using addons for all of your particular use-cases. For now, let's work towards integrating one of the most popular addons within Storybook's ecosystem: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Setting Up Knobs

Knobs is an amazing resource for designers and developers to experiment and play with components in a controlled environment without the need to code! You essentially provide dynamically defined fields with which a user manipulates the props being passed to the components in your stories. Here's what we're going to implement...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

First, we will need to add it as a development dependency.

```bash
npm install -D @storybook/addon-knobs
```

Register Knobs in your `.storybook/main.js` file.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-knobs'],
};
```

<div class="aside">
<strong>📝 Addon registration order matters!</strong>
<br/>
The order you list these addons will dictate the order in which they appear as tabs on your addon panel (for those that appear there).
</div>

That's it! Time to use it in a story.

### Usage

Let's use the object knob type in the `Task` component.

First, import the `withKnobs` decorator and the `object` knob type to `task.stories.ts`:

```javascript
// src/app/components/task.stories.ts
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
```

Next, within the `default` export of the `task.stories.ts` file, add `withKnobs` to the `decorators` key:

```javascript
// src/app/components/task.stories.ts
export default {
  title: 'Task',
  decorators: [withKnobs],
  // same as before
};
```

Lastly, integrate the `object` knob type within the "default" story:

```javascript
// src/app/components/task.stories.ts

// default task state
export const Default = () => ({
  component: TaskComponent,
  props: {
    task: object('task', { ...taskData }),
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

// same as before
```

Now a new "Knobs" tab should show up next to the "Action Logger" tab in the bottom pane.

As documented [here](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), the `object` knob type accepts a label and a default object as parameters. The label is constant and shows up to the left of a text field in your addons panel. The object you've passed will be represented as an editable JSON blob. As long as you submit valid JSON, your component will adjust based upon the data being passed to the object!

## Addons Evolve Your Storybook's Scope

Not only does your Storybook instance serve as a wonderful [CDD environment](https://www.componentdriven.org/), but now we're providing an interactive source of documentation. PropTypes are great, but a designer or somebody completely new to a component's code will be able to figure out its behavior very quickly via Storybook with the knobs addon implemented.

## Using Knobs To Find Edge-Cases

Additionally, with easy access to editing passed data to a component, QA Engineers or preventative UI Engineers can now push a component to the limit! As an example, what happens to `TaskComponent` if our list item has a _MASSIVE_ string?

![Oh no! The far right content is cut-off!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Thanks to quickly being able to try different inputs to a component we can find and fix such problems with relative ease! Let's fix the issue with overflowing by adding a style to `task.component.ts`:

```html
<!-- src/app/components/task.component.ts -->

<!-- This is the input for our task title. In practice we would probably update the styles for this element
but for this tutorial, let's fix the problem with an inline style:
 -->
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
  [ngStyle]="{textOverflow:'ellipsis'}"
/>
/>
```

![That's better.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Adding A New Story To Avoid Regressions

Of course we can always reproduce this problem by entering the same input into the knobs, but it's better to write a fixed story for this input. This will increase your regression testing and clearly outline the limits of the component(s) to the rest of your team.

Let's add a story for the long text case in `task.stories.ts`:

```javascript
// src/app/components/task.stories.ts

// tslint:disable-next-line: max-line-length
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

// same as before

export const LongTitle = () => ({
  component: TaskComponent,
  props: {
    task: {
      ...taskData,
      title: longTitle,
    },
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
```

Now we've added the story, we can reproduce this edge-case with ease whenever we want to work on it:

![Here it is in Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

If we are using [visual regression testing](/angular/en/test/), we will also be informed if we ever break our ellipsizing solution. Such obscure edge-cases are always liable to be forgotten!

### Merge Changes

Don't forget to merge your changes with git!

<div class="aside"><p>As we've seen, Knobs is a great way to get non-developers playing with your components and stories. However, there are many more ways you can customize Storybook to fit your workflow with addons. In the <a href="/intro-to-storybook/react/en/creating-addons">create addons bonus chapter</a> we'll teach you that, by creating a addon that will help you supercharge your development workflow.</p></div>
