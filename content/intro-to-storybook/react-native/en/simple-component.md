---
title: 'Build a simple component'
tocTitle: 'Simple component'
description: 'Build a simple component in isolation'
---

We’ll build our UI following a [Component-Driven Development](https://www.componentdriven.org/) (CDD) methodology. It’s a process that builds UIs from the “bottom up” starting with components and ending with screens. CDD helps you scale the amount of complexity you’re faced with as you build out the UI.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task` is the core component in our app. Each task displays slightly differently depending on exactly what state it’s in. We display a checked (or unchecked) checkbox, some information about the task, and a “pin” button, allowing us to move tasks up and down the list. Putting this together, we’ll need these props:

- `title` – a string describing the task
- `state` - which list is the task currently in and is it checked off?

As we start to build `Task`, we first write our test states that correspond to the different types of tasks sketched above. Then we use Storybook to build the component in isolation using mocked data. We’ll “visual test” the component’s appearance given each state as we go.

This process is similar to [Test-driven development](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) that we can call “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Get set up

Let's open `.storybook/main.js` and take a look

```js:title=.storybook/main.js
module.exports = {
  stories: ["../components/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};
```

If you check the `stories` property you'll see that Storybook is looking for stories in the `components` folder.

In React Native Storybook we use the config in `main.js` to generate a file called `storybook.requires`, this is due to some limitations with the metro bundler. This file gets generated when you run `yarn storybook` to start Storybook or `yarn storybook-generate` which just regenerates the `storybook.requires` file. This file is used to load all the stories in the project and it also imports your addons, whenever you find that a story is not being loaded you can try regenerating this file. Since v7 we are now able to dynamically import new stories that match your config so you shouldn't need to regenerate this file unless you change your `main.js` config.

You'll also find the generate function in `metro.config.js` that will run the generation whenever you start metro.

Now let’s create the task component and its accompanying story file: `components/Task.jsx` and `components/Task.stories.jsx`.

We’ll begin with a basic implementation of the `Task`, simply taking in the attributes we know we’ll need and the two actions you can take on a task (to move it between lists):

```jsx:title=components/Task.jsx
import { StyleSheet, TextInput, View } from "react-native";
import { styles } from "./styles";

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TextInput value={title} editable={false} />
    </View>
  );
};
```

Now add the story file:

```jsx:title=components/Task.stories.jsx
import { Task } from "./Task";

export default {
  title: "Task",
  component: Task,
  argTypes: {
    onPinTask: { action: "onPinTask" },
    onArchiveTask: { action: "onArchiveTask" },
  },
};

export const Default = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX"
    },
  },
};

export const Pinned = {
  args: { task: { ...Default.args.task, state: "TASK_PINNED" } },
};

export const Archived = {
  args: { task: { ...Default.args.task, state: "TASK_ARCHIVED" } },
};
```

In our stories files we use a syntax called Component Story Format (CSF). In this case we are using CSF3 which is a new updated version of CSF supported by the latest versions of Storybook. In this version of CSF there is a lot less boilerplate which makes it easier to get started.

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

- **Component**
  - Story
  - Story
  - Story

To tell Storybook about the component we are documenting, we create a `default` export that contains:

- `component` -- the component itself
- `title` -- how to refer to the component in the sidebar of the Storybook app
- `argTypes` -- allows us to specify the types of our args, here we use it to define actions which will log whenever that interaction takes place

To define our stories we export an object with an `args` property. Arguments or [`args`](https://storybook.js.org/docs/react/writing-stories/args) for short, allow us to live-edit our components with the controls addon without restarting Storybook. Once an [`args`](https://storybook.js.org/docs/react/writing-stories/args) value changes, so does the component.

When creating a story, we use a base `task` arg to build out the shape of the task the component expects. Typically modeled from what the actual data looks like. Again, `export`-ing this shape will enable us to reuse it in later stories, as we'll see.

Now that we've set up the basics lets re-run `yarn storybook` and see our changes. If you already have Storybook running you can also run `yarn storybook-generate` to regenerate the `storybook.requires` file.

You should see a UI that looks like this:
![a gif showing the task component in storybook](/intro-to-storybook/react-native-task-component.gif)

You can use the Sidebar tab to swap between stories, the Canvas tab to see the current story and the addons tab to interact with args and actions.

## Build out the states

Now we can start building out our component to match the designs.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

```jsx:title=components/Task.jsx
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => onArchiveTask(id)}>
        {state !== "TASK_ARCHIVED" ? (
          <MaterialIcons
            name="check-box-outline-blank"
            size={24}
            color="#26c6da"
          />
        ) : (
          <MaterialIcons name="check-box" size={24} color="#26c6da" />
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Input Title"
        value={title}
        editable={false}
        style={
          state === "TASK_ARCHIVED"
            ? styles.listItemInputTaskArchived
            : styles.listItemInputTask
        }
      />
      <TouchableOpacity onPress={() => onPinTask(id)}>
        <MaterialIcons
          name="star"
          size={24}
          color={state !== "TASK_PINNED" ? "#eee" : "#26c6da"}
        />
      </TouchableOpacity>
    </View>
  );
};
```

When you're done, it should look like this:

![a gif showing the task component in storybook](/intro-to-storybook/react-native-task-component-completed.gif)

## Component built!

We’ve now successfully built out a component without needing a server or running the entire application. The next step is to build out the remaining Taskbox components one by one in a similar fashion.

As you can see, getting started building components in isolation is easy and fast. We can expect to produce a higher-quality UI with fewer bugs and more polish because it’s possible to dig in and test every possible state.

<div class="aside">
💡 Don't forget to commit your changes with git!
</div>
