---
title: 'Addons'
tocTitle: 'Addons'
description: 'Learn how to integrate and use the controls addon using a popular example'
commit: 'b3bca4a'
---

Storybook has a robust ecosystem of [addons](https://storybook.js.org/docs/react/configure/storybook-addons) that you can use to enhance the developer experience for
everybody in your team. If you've been following along with this tutorial linearly, we have referenced multiple addons so far, and you will have already implemented one in the [Testing chapter](/react/en/test/).

<div class="aside">
<strong>Looking for a list of potential addons?</strong>
<br/>
😍 You can see the list of officially-supported and strongly-supported community addons <a href="https://storybook.js.org/addons">here</a>.
</div>

We could write forever about configuring and using addons for all your particular use-cases. For now, let's work towards integrating a addon that is rapidly becoming one of the most popular ones within Storybook's ecosystem: [Controls](https://storybook.js.org/docs/react/essentials/controls).


If you've been following this tutorial, you already have it setup. When you installed Storybook this and other popular addons were added as part of the [essential addons library](https://storybook.js.org/docs/react/essentials/introduction) and we don't need to add any extra configuration.

### Get setup

Let's assume the proposed changes in the [testing](/react/en/test) chapter were not accepted, as the color `red` was to ostentatious to use, but we still need to use a background color to define the `Task`'s state.

That's where Controls comes in, it will allow us to interact with our components and live edit them without introducing major regressions in the UI.

### Change the UI with Controls

We've outlined what needs to be done, time to start working on it.

Start by changing the `Task` component to include a new prop for the desired color, we'll keep it simple and call it `backgroundColor`:

```javascript
// src/components/Task.js

export default function Task({
  task: { id, title, state },
  backgroundColor,
  onArchiveTask,
  onPinTask,
}) {
  return (
    <div className={`list-item ${state}`}>
      <label className="checkbox">
        <input
          type="checkbox"
          defaultChecked={state === 'TASK_ARCHIVED'}
          disabled={true}
          name="checked"
        />
        <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
      </label>
      <div className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          placeholder="Input title"
          style={backgroundColor && { backgroundColor }}
        />
      </div>

      <div className="actions" onClick={event => event.stopPropagation()}>
        {state !== 'TASK_ARCHIVED' && (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a onClick={() => onPinTask(id)}>
            <span className={`icon-star`} />
          </a>
        )}
      </div>
    </div>
  );
}
Task.propTypes = {
  /** Composition of the task */
  task: PropTypes.shape({
    /** Id of the task */
    id: PropTypes.string.isRequired,
    /** Title of the task */
    title: PropTypes.string.isRequired,
    /** Current state of the task */
    state: PropTypes.string.isRequired,
    /** Background color for each state */
  }),
  /** Background color for the task */
  backgroundColor: PropTypes.string,
  /** Event to change the task to archived */
  onArchiveTask: PropTypes.func,
  /** Event to change the task to pinned */
  onPinTask: PropTypes.func,
};
```

We have the component updated, time to update `Task.stories.js` to reflect our change.

Add a new element to each story's [`args`](https://storybook.js.org/docs/react/writing-stories/args) with the same name we've used for the component.

```javascript
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
  // Background color added
  backgroundColor: '#e5f9f7',
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
  // Background color added
  backgroundColor: '#c0eef0',
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
  // Background color added
  backgroundColor: '#d7f5f5',
};
```

And that's it. Simple isn't it?

Each time you change the `backgroundColor`'s value the component will re-render and show the new color.

<div class="aside">
TODO: vet video
</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/background-change-with-controls-initial.mp4"
    type="video/mp4"
  />
</video>

## Addons unlock new Storybook workflows

Storybook already serves as a wonderful [component-driven development environment](https://www.componentdriven.org/). With Controls we also created documentation that is interactive. Now anyone can easily figure out component behavior by _playing_ with its arguments.

That's what we're going to do, we're going to improve our existing example and implement a better way to achieve what we've set out to do.

### Using the color picker control type

As we've seen we can use strings. But we can be specific and tell Storybook which type of control we want to use. In our case a color picker.

To do this we'll need to make a small change in our story and add a new [`argType`](https://storybook.js.org/docs/react/essentials/controls#choosing-the-control-type):

```javascript
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
  argTypes: {
    // backgroundColor will now be a color picker instead of a string
    backgroundColor: { control: 'color' },
  },
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2018, 0, 1, 9, 0),
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

<div class="aside">
TODO: vet video

</div>

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/background-change-with-controls-final.mp4"
    type="video/mp4"
  />
</video>

And that's it. Now we can continue interacting with the component and use a dynamic color without introducing major regressions to our UI.

Also our non-technical team members will thank us.

### Merge Changes

Don't forget to merge your changes with git!

<div class="aside"><p>Controls is a great way to get non-developers playing with your components and stories, and much more than we've seen here, we recommend reading the <a href="https://storybook.js.org/docs/react/essentials/controls">official documentation</a> to learn more about it. However, there are many more ways you can customize Storybook to fit your workflow with addons. In the <a href="/intro-to-storybook/react/en/creating-addons">create addons</a> bonus chapter we'll teach you that, by creating a addon that will help you supercharge your development workflow.</p></div>
