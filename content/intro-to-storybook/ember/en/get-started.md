---
title: 'Storybook for Ember tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Ember; other editions exist for [React](/react/en/get-started), [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) and [Svelte](/svelte/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup Ember Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [ember-cli](https://github.com/ember-cli/ember-cli) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Qunit](https://qunitjs.com/) testing in our app. Let’s run the following commands:

```bash
# Create our application:
ember new taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init

# Add Ember storybook adapter
ember install @storybook/ember-cli-storybook
```

<div class="aside">
<p>
At the time of writing this tutorial adding the @storybook/ember-cli-storybook, will yield the following message :
</p>
The <code>`ember generate <entity-name>`</code> command requires an entity name to be specified. <br/>For more details, use `ember help`.
<p>Don't worry about it. Everything should be installed and properly configured.</p>
</div>

We'll need to install one additional package in our app, this one will help us out shortly. Run the following command:

```bash
ember install ember-truth-helpers
```

And finally make a small change to our <code>package.json</code> to allow Storybook to work properly with our Ember app.

Add the following entry to your scripts:

```json
"storybook-dev":"npm-run-all --aggregate-output --continue-on-error --parallel start storybook"
```

This change is required based on both Storybook and Ember handle their build processes.

Now we can quickly check that the various environments of our application are working properly:

```bash
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

To match the intended design, you'll need to download both the font and icon directories and place its contents inside your `public` folder.

<div class="aside">
<p>We’ve used <code>svn</code> (Subversion) to easily download a folder of files from GitHub. If you don’t have subversion installed or want to just do it manually, you can grab the folders directly <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">here</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
