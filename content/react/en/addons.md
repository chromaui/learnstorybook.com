---
title: "Addons"
tocTitle: "Addons"
description: "Learn how to integrate and use addons using a popular example"
commit: "dac373a"
---

Storybook boasts a robust system of [addons](https://storybook.js.org/addons/introduction/) with which you can enhance the developer experience for
everybody in your team. If you've been following along with this tutorial linearly, we have referenced multiple addons so far, and you will have already implemented one in the [Testing chapter](/react/en/test/).

<div class="aside">
<strong>Looking for a list of potential addons?</strong>
<br/>
😍 You can seen the list of officially-supported and strongly-supported community addons <a href="https://storybook.js.org/addons/addon-gallery/">here</a>.
</div>

We could write forever about configuring and using addons for all of your particular use-cases. For now, let's work towards integrating one of the most popular addons within Storybook's ecosystem: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Setting Up Knobs

Knobs is an amazing resource for designers and developers to experiment and play with components in a controlled environment without the need to code! You essentially provide dynamically defined fields with which a user manipulates the props being passed to the components in yours stories. Here's what we're going to implement...

<video autoPlay muted playsInline loop>
  <source
    src="/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

First, we will need to install all the necessary dependencies.

```bash
yarn add @storybook/addon-knobs
```

Register Knobs in your `.storybook/addons.js` file.

```javascript
// .storybook/addons.js

import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
<strong>📝 Addon registration order matters!</strong>
<br/>
The order you list these addons will dictate the order in which they appear as tabs on your addon panel (for those that appear there).
</div>

That's it! Time to use it in a story.

### Usage

Let's use the object knob type in the `Task` component.

First, import the `withKnobs` decorator and the `object` knob type to `Task.stories.js`:

```javascript
// src/components/Task.stories.js

import React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withKnobs, object } from "@storybook/addon-knobs/react";
```

Next, within the stories of `Task`, pass `withKnobs` as a parameter to the `addDecorator()` function:

```javascript
// src/components/Task.stories.js

storiesOf("Task", module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

Lastly, integrate the `object` knob type within the "default" story:

```javascript
// src/components/Task.stories.js

storiesOf("Task", module)
  .addDecorator(withKnobs)
  .add("default", () => {
    return <Task task={object("task", { ...task })} {...actions} />;
  })
  .add("pinned", () => (
    <Task task={{ ...task, state: "TASK_PINNED" }} {...actions} />
  ))
  .add("archived", () => (
    <Task task={{ ...task, state: "TASK_ARCHIVED" }} {...actions} />
  ));
```

Now a new "Knobs" tab should show up next to the "Action Logger" tab in the bottom pane.

As documented [here](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), the `object` knob type accepts a label and a default object as paramters. The label is constant and shows up to the left of a text field in your addons panel. The object you've passed will be represented as an editable JSON blob. As long as you submit valid JSON, your component will adjust based upon the data being passed to the object!

## Addons Evolve Your Storybook's Scope

Not only does your Storybook instance serve as a wonderful [CDD environment](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), but now we're providing an interactive source of documentation. PropTypes are great, but a designer or somebody completely new to a component's code will be able to figure out its behavior very quickly via Storybook with the knobs addon implemented.

## Using Knobs To Find Edge-Cases

Additionally, with easy access to editing passed data to a component, QA Engineers or preventative UI Engineers can now push a component to the limit! As an example, what happens to `Task` if our list item has a _MASSIVE_ string?

![Oh no! The far right content is cut-off!](/addon-knobs-demo-edge-case.png) 😥

Thanks to quickly being able to try different inputs to a component we can find and fix such problems with relative ease! Let's fix the issue with overflowing by adding a style to `Task.js`:

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: "ellipsis" }}
/>
```

![That's better.](/addon-knobs-demo-edge-case-resolved.png) 👍

## Adding A New Story To Avoid Regressions

Of course we can always reproduce this problem by entering the same input into the knobs, but it's better to write a fixed story for this input. This will increase your regression testing and clearly outline the limits of the component(s) to the rest of your team.

Let's add a story for the long text case in Task.stories.js:

```javascript
// src/components/Task.stories.js

const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;

storiesOf("Task", module)
  .add("default", () => <Task task={task} {...actions} />)
  .add("pinned", () => (
    <Task task={{ ...task, state: "TASK_PINNED" }} {...actions} />
  ))
  .add("archived", () => (
    <Task task={{ ...task, state: "TASK_ARCHIVED" }} {...actions} />
  ))
  .add("long title", () => (
    <Task task={{ ...task, title: longTitle }} {...actions} />
  ));
```

Now we've added the story, we can reproduce this edge-case with ease whenever we want to work on it:

![Here it is in Storybook.](/addon-knobs-demo-edge-case-in-storybook.png)

If we are using [visual regression testing](/react/en/test/), we will also be informed if we ever break our ellipsizing solution. Such obscure edge-cases are always liable to be forgotten!

### Merge Changes

Don't forget to merge your changes with git!

## Sharing Addons With The Team

Knobs is a great way to get non-developers playing with your components and stories. However, it can be difficult for them to run the storybook on their local machine. That's why deploying your storybook to an online location can be really helpful. In the next chapter we'll do just that!
