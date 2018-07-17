---
title: "Addons"
tocTitle: "Addons"
description: "Learn how to integrate and use addons using a popular example"
---

# Addons

Storybook boasts a robust system of [addons](https://storybook.js.org/addons/introduction/) with which you can enhance the developer experience for
everybody in your team. If you've been following along with this tutorial linearly, we have referenced multiple addons so far, and you will have already implemented one in the [Testing chapter](/test).

<div class="aside">
<strong>Looking for a list of potential addons?</strong>
<br/>
😍 You can seen the list of officially-supported and strongly-supported community addons <a href="https://storybook.js.org/addons/addon-gallery/">here</a>.
</div>

We could write forever about configuring and using addons for all of your particular use-cases. For now, let's work towards integrating one of the most popular addons within Storybook's ecosystem: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Setting Up Knobs

Knobs is an amazing resource for designers and developers to experiment and play with components in a controlled environment without the need to code! You essentially provide dynamically defined fields with which a user manipulates the props being passed to the components in yours stories. Here's what we're going to implement...

![Knobs in action](/addon-knobs-demo.gif)

### Installation

First, we will need to install all the necessary dependencies.

```bash
yarn add @storybook/addon-knobs
```

Register Knobs in your `.storybook/addons.js` file.

```javascript
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
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

Next, within the stories of `Task`, pass `withKnobs` as a parameter to the `addDecorator()` function:

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

Lastly, integrate the `object` knob type within the "default" story:

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return <Task task={object('task', { ...task })} {...actions} />;
  })
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

As documented [here](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), the `object` knob type accepts a label and a default object as paramters. The label is constant and shows up to the left of a text field in your addons panel. The object you've passed will be represented as an editable JSON blob. As long as you submit valid JSON, your component will adjust based upon the data being passed to the object!

## Addons Evolve Your Storybook's Scope

Not only does your Storybook instance serve as a wonderful [CDD environment](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), but now we're providing an interactive source of documentation. PropTypes are great, but a designer or somebody completely new to a component's code will be able to figure out its behavior very quickly via Storybook with the knobs addon implemented.

## Find Edge-Cases

Additionally, with easy access to editing passed data to a component, QA Engineers or preventating UI Engineers can now push their component to the limit! As an example, what happens to `Task` if our list item has *MASSIVE* string? [I hope it doesn't bre-](/addon-knobs-demo-edge-case.png) (NOTE: The far right content is cut-off).

Now that we know how that edge case behaves, you can decide how to handle it:

*Options*:

- Leave it alone - business requirements don't dictate the need to handle massively large task names.

- Add `text-overflow: ellipsis;` to the `.list-item input[type="text"]` stylesheet and indicate the presence of hidden text to a user.

- Remove the height constaint from a `Task` component, and let text overflow vertically.

- Many more options...

## Improve Regression Testing

Depending on your Storybook workflow, if you've found an edge-case and have done something to resolve the issue, it may be in your best interest
to write a fixed story for that situation. This will increase your regression testing and clearly outline the limits of the component(s) to your
storybook audience.

### Merge Changes

Don't forget to merge your changes with git!
