---
title: 'Storybook for React Native tutorial'
tocTitle: 'Get started'
description: 'Set up Storybook in your development environment'
---

Storybook helps you build UI components isolated from the business logic and context of your app. This edition of the Intro to Storybook tutorial is for React Native; other editions exist for [React](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/) [Vue](https://storybook.js.org/tutorials/intro-to-storybook/vue/en/get-started), [Angular](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started), [Svelte](https://storybook.js.org/tutorials/intro-to-storybook/svelte/en/get-started) and [Ember](https://storybook.js.org/tutorials/intro-to-storybook/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Set Up React Native Storybook

We’ll need to follow a few steps to get started. In this tutorial we'll be using this [template](https://github.com/chromaui/intro-storybook-react-native-template) where we've already setup a React Native app using [Expo](https://expo.io/tools) and added [Storybook](https://storybook.js.org/) the project.

Before we get started, there are some things we’ll need to consider:

- To help you throughout the tutorial, you’ll need a phone or a simulator already configured to allow you to run the application. For more information see the Expo documentation on [running on ios](https://docs.expo.dev/workflow/ios-simulator/) and [android](https://docs.expo.dev/workflow/android-studio-emulator/).
- This tutorial will be focused on IOS/Android. React Native can target other platforms that this tutorial won't cover.
- You’ll also need [nodejs](https://nodejs.org/en/download/) configured on your machine.

First download the template we've created for this tutorial.

```shell
# Clone the template
npx degit chromaui/intro-storybook-react-native-template#main taskbox
```

Now you have the app lets run it to make sure everything is working as expected.

You can pick ios or android, just run either and make sure the app is working.

```shell:clipboard=false

# Run the application on IOS
yarn ios

# Run the application on Android
yarn android

# Run storybook on ios
yarn storybook:ios

# Run storybook on android
yarn storybook:android
```

<div class="aside">
💡 Throughout this tutorial, Yarn will be used. If you're following along this tutorial but don't have it configured, you can easily swap out the commands to match your package manager of choice (e.g., npm, pnpm)(add links to both package managers
</div>

When running the application with `yarn ios` you should see this rendered on the device:

<img src="/intro-to-storybook/react-native-expo-getting-started.png" alt="expo starter screen" height="600">

When running storybook with `yarn storybook:ios` you should see this:

<img src="/intro-to-storybook/react-native-hello-world.png" alt="Storybook UI" height="600">

## How it works

When initialized the template already provides the required configuration to help us get started developing our application with React Native. Before we start to build our UI from the ground up, let's take a moment and see how Storybook functions inside a React Native application and whats different.

Storybook in react native is a component that you can render in your app, as opposed to other framework versions where Storybook runs on its own.

Because of this distinction we need a way to switch between the app and storybook. To do this we use environment variables, and we'll go over that quickly now.

<div class="aside">
💡 See the <a href="https://docs.expo.dev/guides/environment-variables/">expo documentation</a> for more details on how to use environment variables.
</div>

In our project there is a configuration file for expo called `app.config.js` this file is where we configure things like our app name and constants that we can use throughout the app.

In this file we set the `storybookEnabled` constant to the value of the environment variable `STORYBOOK_ENABLED` which we'll go over shortly.

```js:title=app.config.js
export default ({ config }) => ({
  ...config,
  name: "Storybook Tutorial Template",
  slug: "storybook-tutorial-template",
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
});
```

This lets us access the `storybookEnabled` variable in our app using the `expo-constants` package and we use this to determine whether we render Storybook or your app.

```jsx:title=App.js
import Constants from 'expo-constants';

function App() {
  // ... removed for brevity
}

// Default to rendering your app
let AppEntryPoint = App;

// Render storybook if storybookEnabled is true
if (Constants.expoConfig.extra.storybookEnabled === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

export default AppEntryPoint;
```

In package.json we see a few Storybook scripts. We use these to pass that environment variable to our app and run some setup.

```json:title=package.json
"scripts": {
  "storybook": "sb-rn-get-stories && STORYBOOK_ENABLED='true' expo start",
  "storybook:ios": "sb-rn-get-stories && STORYBOOK_ENABLED='true' expo ios",
  "storybook:android": "sb-rn-get-stories && STORYBOOK_ENABLED='true' expo android"
}
```

This is where our `STORYBOOK_ENABLED` environment variable is set to true, which then tells our app to render Storybook instead of our app.

<div class="aside">
💡 There are other ways to configure storybook, this is just the simplest way to get started.
</div>

Now that we've seen how Storybook works in a React Native application, let's start building our UI!
