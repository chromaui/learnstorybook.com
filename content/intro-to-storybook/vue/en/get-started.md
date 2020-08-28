---
title: 'Storybook for Vue tutorial'
tocTitle: 'Get started'
description: 'Setup Vue Storybook in your development environment'
commit: d1c4858
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Vue; other editions exist for [React](/react/en/get-started), [React Native](/react-native/en/get-started/), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Vue Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use the [Vue CLI](https://cli.vuejs.org) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application, using a preset that contains jest:
npx -p @vue/cli vue create taskbox --preset chromaui/vue-preset-learnstorybook

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Throughout this version of the tutorial, we'll be using <code>yarn</code> to run the majority of our commands. 
If you have Yarn installed, but prefer to use <code>npm</code> instead, don't worry, you can still go through the tutorial without any issues. Just add the <code> --packageManager=npm</code> flag to the first command above and both Vue CLI and Storybook will initialize based on this. Also while you progress through the tutorial, don't forget to adjust the commands used to their <code>npm</code> counterparts.
</div>

We can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test:unit

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 8080:
yarn serve
```

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities-vue.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into `src/index.css` and then import the CSS into the app by editing the `<style>` tag in `src/App.vue` so it looks like:

```html
<style>
  @import './index.css';
</style>
```

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">here</a>.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place its contents inside your `public` folder. Issue the following commands in your terminal:

```bash
npx degit chromaui/learnstorybook-code/public/font public/font
npx degit chromaui/learnstorybook-code/public/icon public/icon
```

<div class="aside">
We've used <a href="https://github.com/Rich-Harris/degit">degit</a> to easily download folders from GitHub. If you want to do it manually, you can grab the folders <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.
</div>

We also need to update our storybook script to serve the `public` directory (in `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
