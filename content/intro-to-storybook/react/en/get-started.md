---
title: 'Storybook for React tutorial'
tocTitle: 'Get started'
description: 'Set up Storybook in your development environment'
commit: '9245261'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of the Intro to Storybook tutorial is for React; other editions exist for [React Native](/intro-to-storybook/react-native/en/get-started), [Vue](/intro-to-storybook/vue/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started) and [Ember](/intro-to-storybook/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Set up React Storybook

We'll need to follow a few steps to get the build process set up in our environment. To start with, we want to use [degit](https://github.com/Rich-Harris/degit) to set up our build system. Using this package, you can download "templates" (partially built applications with some default configuration) to help you fast track your development workflow.

Let’s run the following commands:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 This template contains the necessary styles, assets and bare essential configurations for this version of the tutorial.
</div>

Now we can quickly check that the various environments of our application are working properly:

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
💡 Notice the <code>--watchAll</code> flag in the test command, including this flag ensures all tests run. While you progress through this tutorial you will be introduced to different test scenarios. You might want to consider adjusting your <code>package.json</code>'s scripts accordingly.
</div>

Our three frontend app modalities: automated test (Jest), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Commit changes

At this stage it's safe to add our files to a local repository. Run the following commands to initialize a local repository, add and commit the changes we've done so far.

```shell
git init
```

Followed by:

```shell
git add .
```

Then:

```shell
git commit -m "first commit"
```

And finally:

```shell
git branch -M main
```

Let's start building our first component!
