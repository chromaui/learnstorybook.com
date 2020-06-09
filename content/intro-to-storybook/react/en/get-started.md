---
title: 'Storybook for React tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
commit: '8741257'
---

Storybook runs alongside an app in development mode. It helps to build UI components isolated from the business logic and context of an app. This edition of Learn Storybook is for React; there are also editions for [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup React Storybook

We need to follow few steps to get the build process set up in an environment. We are going to use: 
- [Create React App](https://github.com/facebook/create-react-app) (CRA) to setup build system
- [Jest](https://facebook.github.io/jest/) to run tests 
- [Storybook](https://storybook.js.org/) itself 

Let’s run the following commands:

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```
<div class="aside">
Throughout this tutorial, we'll be using <code>yarn</code> to run the majority of commands.
If you have Yarn installed, but prefer to use <code>npm</code> instead, don't worry, you can still go through the tutorial without any issues. Just add the <code>--use-npm</code> flag to the first command above and both CRA and Storybook will be initialized based on this. Also while you progress through the tutorial, don't forget to adjust the commands used to their <code>npm</code> counterparts.
</div>

We can check that the environments of the application works properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 9009:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
<code>--watchAll</code> flag to our test command, this small change will ensure that all tests run and everything is ok with the application. In tutorial used different test scenarios, so probably you might want to consider and add the flag to your test script in <code>package.json</code> to ensure the entire test suite runs.
</div>

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the `src/index.css` file.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

To match the intended design, you need to download both the font and icon directories and place its contents inside project the `public` folder.

<div class="aside">
<p>We’ve used <code>svn</code> (Subversion) to easily download a folder of files from GitHub. If you don’t have subversion installed or want to do it manually, you can grab the folders directly <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
