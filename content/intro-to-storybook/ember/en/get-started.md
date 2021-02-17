---
title: 'Storybook for Ember tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Ember; other editions exist for [React](/react/en/get-started), [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Ember Storybook

We'll need to follow a few steps to get the build process set up in our environment. To start with, we want to use [degit](https://github.com/Rich-Harris/degit) to setup our build system. Using this package, you can download "templates" (partially built applications with some default configuration) to help you fast track your development workflow.

Let’s run the following commands:

```bash
# Clone the template
npx degit chromaui/intro-storybook-ember-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 This template contains the necessary styles, assets and bare essential configurations for this version of the tutorial.

Worth mentioning that you might encounter the following message during the installation process:

The <code>ember generate entity-name command</code> requires an entity name to be specified. For more details, use <code>ember help</code>.

This is just a warning related to the <code>@storybook/ember-cli-storybook</code> package. Everything is properly set up.

</div>

Now we can quickly check that the various environments of our application are working properly:

```shell
# Run the test runner (Qunit) in a terminal:
ember test --server

# Run the frontend app proper on port 4200:
ember start

# Start the component explorer on port 6006:
npm run storybook-dev

```

Our three frontend app modalities: automated test (Qunit), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities-ember.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Commit changes

At this stage it's safe to add our files to a local repository. Run the following commands to initialize a local repository, add and commit the changes we've done so far.

```shell
$ git init
```

Followed by:

```shell
$ git add .
```

And finally:

```shell
$ git commit -m "first commit"
```

Let's start building our first component!
