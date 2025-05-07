---
title: 'Storybook for Vue tutorial'
tocTitle: 'Get started'
description: 'Set up Vue Storybook in your development environment'
commit: 'e2984d1'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of the Intro to Storybook tutorial is for Vue; other editions exist for [React](/intro-to-storybook/react/en/get-started), [React Native](/intro-to-storybook/react-native/en/get-started/), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Set up Vue Storybook

We'll need to follow a few steps to get the build process set up in our environment. To start with, we want to use [degit](https://github.com/Rich-Harris/degit) to set up our build system. Using this package, you can download "templates" (partially built applications with some default configuration) to help you fast track your development workflow.

Let’s run the following commands:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 This template contains the necessary styles, assets and bare essential configurations for this version of the tutorial.
</div>

Now we can quickly check that the various environments of our application are working properly:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

Our main frontend app modalities: component development (Storybook), and the application itself.

![Main modalities](/intro-to-storybook/app-main-modalities-vue.png)

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
