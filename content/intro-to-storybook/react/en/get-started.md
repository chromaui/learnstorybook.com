---
title: 'Storybook for React tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
commit: 'b935904'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for React; other editions exist for [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup React Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [Create React App](https://github.com/facebook/create-react-app) (CRA) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app. Let’s run the following commands:

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Throughout this version of the tutorial, we'll be using <code>yarn</code> to run the majority of our commands. 
If you have Yarn installed, but prefer to use <code>npm</code> instead, don't worry, you can still go through the tutorial without any issues. Just add the <code>--use-npm</code> flag to the first command above and both CRA and Storybook will initialize based on this. Also while you progress through the tutorial, don't forget to adjust the commands used to their <code>npm</code> counterparts.
</div>

After running the commands we'll need to make a small change to our app. In the root folder of the project add a new file called `.env` with the following content:

```
SKIP_PREFLIGHT_CHECK=true
```

Now we can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
You may have noticed we've added the <code>--watchAll</code> flag to our test command, don't worry it's intentional, this small change will ensure that all tests run and everything is ok with our application. While you progress through this tutorial you will be introduced to different test scenarios, so probably you might want to consider and add the flag to your test script in your <code>package.json</code> to ensure your entire test suite runs.
</div>

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the `src/index.css` file.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">here</a>.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place its contents inside your `src/assets` folder. Issue the following commands in your terminal:

```bash
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
We use <a href="https://github.com/Rich-Harris/degit">degit</a> to download folders from GitHub. If you want to do it manually, you can grab them <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets/">here</a>.
</div>

We've successfully configured our app. Let's start building our first component!
