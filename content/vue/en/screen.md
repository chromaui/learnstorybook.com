---
title: "Construct a screen"
tocTitle: "Screens"
description: "Construct a screen out of components"
commit: b62db62
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` container component (which supplies its own data via Vuex) in some layout and pulling a top-level `error` field out of the store (let's assume we'll set that field if we have some problem connecting to our server). Let's create a presentational `PureInboxScreen.vue` in your `src/components/` folder:

```html
<template>
  <div>
    <div class="page lists-show" v-if="error">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <div class="title-message">Oh no!</div>
        <div class="subtitle-message">Something went wrong</div>
      </div>
    </div>
    <div class="page lists-show" v-else>
      <nav>
        <h1 class="title-page">
          <span class="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <task-list />
    </div>
  </div>
</template>

<script>
  import TaskList from "./TaskList.vue";

  export default {
    name: "pure-inbox-screen",
    props: {
      error: {
        type: Boolean,
        default: false
      }
    },
    components: {
      TaskList
    }
  };
</script>
```

Then, we can create a container, which again grabs the data for the `PureInboxScreen` in `src/components/InboxScreen.vue`:

```html
<template>
  <div>
    <pure-inbox-screen :error="error" />
  </div>
</template>

<script>
  import PureInboxScreen from "./PureInboxScreen";
  import { mapState } from "vuex";

  export default {
    name: "inbox-screen",
    components: {
      PureInboxScreen
    },
    computed: {
      ...mapState(["error"])
    }
  };
</script>
```

We also change the `App` component to render the `InboxScreen` (eventually we would use a router to choose the correct screen, but let's not worry about that here):

```html
<template>
  <div id="app">
    <inbox-screen />
  </div>
</template>

<script>
  import store from "./store";
  import InboxScreen from "./components/InboxScreen.vue";
  import "../src/index.css";

  export default {
    name: "app",
    store,
    components: {
      InboxScreen
    }
  };
</script>
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, for the `PureInboxScreen` we have a problem because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense the `PureInboxScreen` has been polluted by “container-ness”. So when we setup our stories in `src/components/PureInboxScreen.stories.js`:

```javascript
import { storiesOf } from "@storybook/vue";
import PureInboxScreen from "./PureInboxScreen";

storiesOf("PureInboxScreen", module)
  .add("default", () => {
    return {
      components: { PureInboxScreen },
      template: `<pure-inbox-screen/>`
    };
  })
  .add("error", () => {
    return {
      components: { PureInboxScreen },
      template: `<pure-inbox-screen :error="true"/>`
    };
  });
```

We see that although the `error` story works just fine, we have an issue in the `default` story, because the `TaskList` has no Vuex store to connect to. (You also would encounter similar problems when trying to test the `PureInboxScreen` with a unit test).

![Broken inbox](/broken-inboxscreen-vue.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromaticqa.com">Chromatic</a> alongside 670+ stories.
</div>

## Supplying context to stories

The good news is that it is easy to supply a Vuex store to the `PureInboxScreen` in a story! We can create a new store in our story file and pass it in as the context of the story:

```javascript
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/vue";
import Vue from "vue";
import Vuex from "vuex";

import { defaultTaskList } from "./PureTaskList.stories";
import PureInboxScreen from "./PureInboxScreen.vue";

Vue.use(Vuex);
export const store = new Vuex.Store({
  state: {
    tasks: defaultTaskList
  },
  actions: {
    pinTask(context, id) {
      action("pinTask")(id);
    },
    archiveTask(context, id) {
      action("archiveTask")(id);
    }
  }
});

storiesOf("PureInboxScreen", module)
  .add("default", () => {
    return {
      components: { PureInboxScreen },
      template: `<pure-inbox-screen/>`,
      store
    };
  })
  .add("error", () => {
    return {
      components: { PureInboxScreen },
      template: `<pure-inbox-screen :error="true"/>`
    };
  });
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.
