---
title: 'Storybook for Ember tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Ember; other editions exist for [React](/react/en/get-started), [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Ember Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [ember-cli](https://github.com/ember-cli/ember-cli) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Qunit](https://qunitjs.com/) testing in our app. Let’s run the following commands:

```shell
# Create our application:
ember new taskbox --yarn

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init

# Add Ember storybook adapter
ember install @storybook/ember-cli-storybook
```

<div class="aside">
At the time of writing this version of the tutorial, adding the <code>@storybook/ember-cli-storybook</code> will yield the following message:

The <code>ember generate entity-name command</code> requires an entity name to be specified. For more details, use <code>ember help</code>.

This is just a warning! Everything is properly installed and configured.

Throughout this version of the tutorial we'll be using <code>yarn</code> to run the majority of our commands. If you don't have <code>yarn</code> installed, you can still go through the tutorial without any issues. You'll need to adjust the commands to their <code>npm</code> counterparts.

</div>

We'll need to install some additional packages in our app, more specifically one Ember addon and one package. Run the following commands:

```shell
ember install ember-truth-helpers
```

Followed by:

```shell
yarn add -D npm-run-all
```

And finally make a small change to our <code>package.json</code> to allow Storybook to work properly with our Ember app.

Add the following entries to your scripts:

```json
{
  "scripts": {
    "start": "ember serve",
    "storybook": "start-storybook -p 6006 -s dist --ci",
    "storybook-dev": "npm-run-all --continue-on-error --parallel start storybook",
    "prebuild-storybook": "ember build",
    "build-storybook": "build-storybook -s dist"
  }
}
```

These changes are necessary based on how both Storybook and Ember handle their build processes. Going over them:

- `storybook`'s script was updated to include the [ci](https://storybook.js.org/docs/react/api/cli-options#start-storybook) flag to prevent it from opening before Ember finishes building the app
- Both `storybook-dev` and `prebuild-storybook` `scripts` were introduced to help streamline our workflow throughout the tutorial

Now we can quickly check that the various environments of our application are working properly:

```shell
# Run the test runner (Qunit) in a terminal:
ember test --server

# Start the component explorer on port 6006:
npm run storybook-dev

# Run the frontend app proper on port 4200:
ember start
```

Our three frontend app modalities: automated test (Qunit), component development (Storybook), and the app itself.

![3 modalities](/intro-to-storybook/app-three-modalities-ember.png)

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), so we won’t need to write CSS in this tutorial. Copy and paste [this compiled CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) into the `app/styles/app.css` file.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place its contents inside your `public` folder. Issue the following commands in your terminal:

```shell
npx degit chromaui/learnstorybook-code/public/font public/font
npx degit chromaui/learnstorybook-code/public/icon public/icon
```

<div class="aside">
We use <a href="https://github.com/Rich-Harris/degit">degit</a> to download folders from GitHub. If you want to do it manually, you can grab them <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.
</div>

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now.

## Commit Changes

When our project was initialized, Ember's CLI already created a local repository for us. At this stage it's safe to add our files to the first commit.

Run the following commands to add and commit the changes we've done so far.

```shell
$ git add .
```

Followed by:

```shell
$ git commit -m "first commit"
```

That's it. Let's start building our first component!
