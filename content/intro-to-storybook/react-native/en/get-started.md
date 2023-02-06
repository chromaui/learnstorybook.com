---
title: 'Storybook for React Native tutorial'
tocTitle: 'Get started'
description: 'Set up Storybook in your development environment'
---

Storybook helps you build UI components isolated from the business logic and context of your app. This edition of the Intro to Storybook tutorial is for React; other editions exist for [React](https://storybook.js.org/tutorials/intro-to-storybook/react/en/get-started/) [Vue](https://storybook.js.org/tutorials/intro-to-storybook/vue/en/get-started), [Angular](https://storybook.js.org/tutorials/intro-to-storybook/angular/en/get-started), [Svelte](https://storybook.js.org/tutorials/intro-to-storybook/svelte/en/get-started) and [Ember](https://storybook.js.org/tutorials/intro-to-storybook/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Set Up React Native Storybook

We’ll need to follow a few steps to get started. In this tutorial we'll be using [Expo](https://expo.io/tools) to set up our React Native app and we'll add [Storybook](https://storybook.js.org/) to the project.

Before starting heres some things to take into consideration:

- This tutorial will be focused on ios/android. React Native can target other platforms but that won't be covered in this tutorial.
- You'll need a phone, ios simulator or android emulator to run the app.
- You need nodejs setup on your machine
- Throughout this tutorial yarn will be used, you can swap out yarn for the subsequent command in npm or pnpm.
- In this tutorial we use Expo because its great but its not required to use storybook.

First lets initialise a react native app

```shell
yarn create expo-app my-app
cd my-app
```

There are 2 other libraries we want to use in this tutorial so add them like this:

```shell
npx expo install expo-constants @expo/vector-icons
```

Now that the project is created lets run the app to make sure everything is working as expected.

You can pick ios or android, just run either and make sure the app is working.

For ios

```
yarn ios
```

For android

```
yarn android
```

You should see this rendered on the device:

![iphone with the text open up app.js to start working on your app!](/intro-to-storybook/react-native-expo-getting-started.png)

If your screen looks like this then your expo app intialized started correctly.

## Lets setup storybook

Run this command to automatically add the files needed.

```shell
npx -p @storybook/cli sb init --type react_native
```

This should generate a folder in your project called .storybook, this is where the config for storybook goes.

Now add this to your App.js file and comment out the App function for now.

```js:title=App.js
export { default } from './.storybook';
```

If you run the app again with `yarn ios` you should now see this:

![image showing button in the storybook ui](/intro-to-storybook/react-native-hello-world.png)

If what you see on your device matches this image then you've successfully setup storybook.

## Swap between storybook and app development

Storybook in react native is a component that you can slot into your app and isn't its own separate runtime which you might be used to on the web.

If you want to run storybook in the same environment as your app we're going to need a simple way to switch between them.

One way we can do that is to use an environment variable, for this we'll follow the steps from [expo](https://docs.expo.dev/guides/environment-variables/). If you aren't using expo I still recommend following that link to the expo docs since they show the steps to use babel-plugin-transform-inline-environment-variables which should work for any setup.

First we want to rename our app.json to app.config.js and edit the file so it looks something like this:

```js:title=app.config.js
module.exports = {
  name: 'my-app',
  slug: 'my-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#FFFFFF',
    },
  },
  web: {
    favicon: './assets/favicon.png',
  },
};
```

Add the `extra` config option like this

```js:title=app.config.js
module.exports = {
  name: 'MyApp',
  version: '1.0.0',
  extra: {
    storybookEnabled: process.env.STORYBOOK_ENABLED,
  },
  ...
};
```

Now we can access the storybookEnabled variable from our app using expo constants like this:

```js
import Constants from 'expo-constants';
const apiUrl = Constants.expoConfig.extra.storybookEnabled;
```

Earlier I said to comment out the app function in the App.js file and this where we go back and fix that.

Edit App.js so that it looks like this:

```jsx:title=App.js
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';

function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

let AppEntryPoint = App;

if (Constants.expoConfig.extra.storybookEnabled === 'true') {
  AppEntryPoint = require('./.storybook').default;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppEntryPoint;
```

Now in package.json we can add a script like this

```json:title=package.json
"scripts": {
	"storybook": "sb-rn-get-stories && STORYBOOK_ENABLED='true' expo start",
}
```

We've added a new command that will update our stories and run our app with the STORYBOOK_ENABLED flag set to true.

Now when you run `yarn start` you should see the app code and `yarn storybook` should show you storybook.

You can pass the option `--ios` or `--android` to have the simulator autmatically open up otherwise press `i` or `a` after the command finishes running to open the simulator.
