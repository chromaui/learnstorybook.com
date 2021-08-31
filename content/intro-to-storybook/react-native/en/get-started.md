---
title: 'Storybook for React Native tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of the Intro to Storybook tutorial is for React Native; other editions exist for [React](/intro-to-storybook/react/en/get-started), [Vue](/intro-to-storybook/vue/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started) and [Ember](/intro-to-storybook/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Setup React Native Storybook

We’ll need to follow a few steps to get the build process set up in your environment. To start with, we want to use [Expo](https://expo.io/tools) to setup our build system, and enable [Storybook](https://storybook.js.org/) and [Jest](https://facebook.github.io/jest/) testing in our created app.

Before diving into the tutorial, take into account the following considerations:

- All the code was intended for the Android platform, if you want to use IOS, some components might need to be updated in order to work properly.

- You'll need a working simulator or a physical device correctly setup to maximize your experience, [react-native docs](https://facebook.github.io/react-native/docs/getting-started) has more detailed instructions on how to achieve this.

- Throughout this tutorial, <code>yarn</code> will be used. Should you want to use <code>npm</code>, select the appropriate option when you're initializing the app and replace all subsequent commands with npm.

With that out of the way, let’s run the following commands:

```bash
# Create our application:
expo init --template tabs taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init --type react_native

```

<div class="aside">
  <p>During Storybook's install process, you'll be prompted to install react-native-server, do so as this package will help out immensely throughout the tutorial.</p>
</div>

We'll also want to add another package and make a change to `storybook/rn-addons.js` to allow the actions (you'll see them in action later in the tutorial) to be logged correctly in the Storybook UI.

Run the following command:

```bash
yarn add -D @storybook/addon-ondevice-actions
```

Change `storybook/rn-addons.js` to the following:

```javascript
// storybook/rn-addons.js
import '@storybook/addon-ondevice-actions/register';
```

### Setup Jest with React Native

We have two out of three modalities configured in our app, but we still need one, we need to setup [Jest](https://facebook.github.io/jest/) to enable testing.

Create a new folder called `__mocks__` and inside add a new file `globalMock.js` with the following:

```javascript
jest.mock('global', () => ({
  ...global,
  WebSocket: function WebSocket() {},
}));
```

Update the `jest` field in `package.json`:

```json
"jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!(jest-)?react-native|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base)"
    ],
    "setupFilesAfterEnv": [
      "<rootDir>/__mocks__/globalMock.js"
    ]
  }
```

Now we can quickly check that the various environments of our application are working properly:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 7007:
yarn storybook

# Run the frontend app proper on port 19002:
yarn web
```

![3 modalities](/intro-to-storybook/app-three-modalities-rn.png)

Checking our Storybook at this point, you might see that there's no stories displayed. That's ok, we'll take care of it shortly, for now, let's continue working on getting our application properly setup.

Depending on what part of the app you’re working on, you may want to run one or more of these simultaneously. Since our current focus is creating a single UI component, we’ll stick with running Storybook.

## Reuse CSS

Taskbox reuses design elements from the GraphQL and React Tutorial [example app](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), so we won’t need to write CSS in this tutorial. Contrary to the other tutorials, we wont copy over the compiled CSS, as React Native handles styling in a whole different way, but instead create a new file `constants/globalStyles.js` and add the following:

<details>
  <summary>Click to expand and see the full file contents</summary>

```javascript
// /constants/globalStyles.js
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
  },
  TaskBox: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    backgroundColor: '#26c6da',
  },
  CheckBox: {
    borderColor: '#26c6da',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 1,
    backgroundColor: 'transparent',
    height: 18,
    width: 18,
  },
  GlowCheckbox: {
    borderColor: '#eee',
    borderStyle: 'solid',
    borderWidth: 2,
    borderRadius: 1,
    backgroundColor: '#eee',
    color: 'transparent',
    height: 20,
    width: 20,
  },
  GlowText: {
    backgroundColor: '#eee',
    color: 'transparent',
  },
  ListItem: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    height: 48,
    width: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ListItemInputTask: {
    backgroundColor: 'transparent',
    width: '95%',
    padding: 10,
    fontFamily: 'NunitoSans',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  ListItemInputTaskArchived: {
    color: '#aaa',
    width: '95%',
    padding: 10,
    fontFamily: 'NunitoSans',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'normal',
  },
  LoadingItem: {
    alignItems: 'center',
    backgroundColor: 'white',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    flex: 1,
    height: 48,
    justifyContent: 'space-around',
    paddingLeft: 16,
    width: '100%',
  },
  ListItems: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: 288,
  },
  WrapperMessage: {
    position: 'absolute',
    top: '40%',
    right: 0,
    bottom: 'auto',
    left: 0,
    width: 'auto',
    height: 'auto',
    textAlign: 'center',
  },
  PageListsShow: {
    minHeight: '100vh',
    backgroundColor: 'white',
  },
  PageListsShowhead: {
    backgroundColor: '#d3edf4',
    paddingTop: 24,
    paddingBottom: 24,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  TitleMessage: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'NunitoSans',
    fontWeight: '800',
    color: '#555',
  },
  SubtitleMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    fontFamily: 'NunitoSans',
  },
  titlepage: {
    fontSize: 20,
    lineHeight: 24,
  },
  TitleWrapper: {
    fontFamily: 'NunitoSans',
    fontWeight: '800',
    color: '#1c3f53',
    maxWidth: '100%',
  },
});
```

</details>

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
If you want to modify the styling, the source LESS files are provided in the GitHub repo. And adjust accordingly for React Native styling.
</div>

## Add assets

To match the intended design, you'll need to download both the font and icon directories and place them inside the `assets` folder.

<div class="aside">
<p>We’ve used <code>svn</code> (Subversion) to easily download a folder of files from GitHub. If you don’t have subversion installed or want to just do it manually, you can grab the icons folder directly <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">here</a> and the font <a href="https://github.com/google/fonts/tree/master/ofl/nunitosans">here</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/icon assets/icon
svn export https://github.com/google/fonts/tree/main/ofl/nunitosans assets/font
```

Next the assets need to be loaded into the app, for that we're going to update `hooks/useCachedResources.js` to the following:

```javascript
// hooks/useCachedResources.js
async function loadResourcesAndDataAsync() {
  try {
    SplashScreen.preventAutoHideAsync();

    // Load fonts
    await Font.loadAsync({
      ...Ionicons.font,
      'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
      percolate: require('../assets/icon/percolate.ttf'),
      'NunitoSans-Bold': require('../assets/font/NunitoSans-Bold.ttf'),
      'NunitoSans-Italic': require('../assets/font/NunitoSans-Italic.ttf'),
      NunitoSans: require('../assets/font/NunitoSans-Regular.ttf'),
    });
  } catch (e) {
    // We might want to provide this error information to an error reporting service
    console.warn(e);
  } finally {
    setLoadingComplete(true);
    SplashScreen.hideAsync();
  }
}
```

In order to use the icons from the `percolate` font safely and correctly in React Native we need to create a bridge that will map each individual icon to it's correspondent in the font file.

Create a new file `/constants/Percolate.js` with the following:

<details>
  <summary>Click to expand and see the full file contents</summary>

```javascript
// constants/Percolate.js
/**
 * PercolateIcons icon set component.
 * Usage: <PercolateIcons name="icon-name" size={20} color="#4F8EF7" />
 */

import { createIconSet } from '@expo/vector-icons';
const glyphMap = {
  graphql: 59658,
  redux: 59656,
  grid: 59657,
  redirect: 59655,
  grow: 59651,
  lightning: 59652,
  'request-change': 59653,
  transfer: 59654,
  calendar: 59650,
  sidebar: 59648,
  tablet: 59649,
  atmosphere: 58993,
  browser: 58994,
  database: 58995,
  'expand-alt': 58996,
  mobile: 58997,
  watch: 58998,
  home: 58880,
  'user-alt': 58881,
  user: 58882,
  'user-add': 58883,
  users: 58884,
  profile: 58885,
  bookmark: 58886,
  'bookmark-hollow': 58887,
  star: 58888,
  'star-hollow': 58889,
  circle: 58890,
  'circle-hollow': 58891,
  heart: 58892,
  'heart-hollow': 58893,
  'face-happy': 58894,
  'face-sad': 58895,
  'face-neutral': 58896,
  lock: 58897,
  unlock: 58898,
  key: 58899,
  'arrow-left-alt': 58900,
  'arrow-right-alt': 58901,
  sync: 58902,
  reply: 58903,
  expand: 58904,
  'arrow-left': 58905,
  'arrow-up': 58906,
  'arrow-down': 58907,
  'arrow-right': 58908,
  'chevron-down': 58909,
  back: 58910,
  download: 58911,
  upload: 58912,
  proceed: 58913,
  info: 58914,
  question: 58915,
  alert: 58916,
  edit: 58917,
  paintbrush: 58918,
  close: 58919,
  trash: 58920,
  cross: 58921,
  delete: 58922,
  power: 58923,
  add: 58924,
  plus: 58925,
  document: 58926,
  'graph-line': 58927,
  'doc-chart': 58928,
  'doc-list': 58929,
  category: 58930,
  copy: 58931,
  book: 58932,
  certificate: 58934,
  print: 58935,
  'list-unordered': 58936,
  'graph-bar': 58937,
  menu: 58938,
  filter: 58939,
  ellipsis: 58940,
  cog: 58941,
  wrench: 58942,
  nut: 58943,
  camera: 58944,
  eye: 58945,
  photo: 58946,
  video: 58947,
  speaker: 58948,
  phone: 58949,
  flag: 58950,
  pin: 58951,
  compass: 58952,
  globe: 58953,
  location: 58954,
  search: 58955,
  timer: 58956,
  time: 58957,
  dashboard: 58958,
  hourglass: 58959,
  play: 58960,
  stop: 58961,
  email: 58962,
  comment: 58963,
  link: 58964,
  paperclip: 58965,
  box: 58966,
  structure: 58967,
  commit: 58968,
  cpu: 58969,
  memory: 58970,
  outbox: 58971,
  share: 58972,
  button: 58973,
  check: 58974,
  form: 58975,
  admin: 58976,
  paragraph: 58977,
  bell: 58978,
  rss: 58979,
  basket: 58980,
  credit: 58981,
  support: 58982,
  shield: 58983,
  beaker: 58984,
  google: 58985,
  gdrive: 58986,
  youtube: 58987,
  facebook: 58988,
  'thumbs-up': 58989,
  twitter: 58990,
  github: 58991,
  meteor: 58992,
};

const iconSet = createIconSet(glyphMap, 'percolate');

export default iconSet;

export const Button = iconSet.Button;
export const TabBarItem = iconSet.TabBarItem;
export const TabBarItemIOS = iconSet.TabBarItemIOS;
export const ToolbarAndroid = iconSet.ToolbarAndroid;
export const getImageSource = iconSet.getImageSource;
```

</details>

In order to see Storybook in React Native we're going to update `screens/LinksScreen.js` to the following:

```javascript
// screens/LinksScreen.js
import * as React from 'react';
import StorybookUIRoot from '../storybook';

export default function LinksScreen() {
  return <StorybookUIRoot />;
}
```

And finally `navigation/BottomTabNavigator.js` to the following:

```javascript
// navigation/BottomTabNavigator.js
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'Home';

export default function BottomTabNavigator({ navigation, route }) {
  navigation.setOptions({ headerTitle: getHeaderTitle(route) });
  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME}>
      <BottomTab.Screen
        name="Taskbox"
        component={HomeScreen}
        options={{
          title: 'Taskbox',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-code-working" />,
        }}
      />
      <BottomTab.Screen
        name="Links"
        component={LinksScreen}
        options={{
          title: 'Storybook',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-book" />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;

  switch (routeName) {
    case 'Home':
      return 'How to get started';
    case 'Links':
      return 'Your Storybook';
  }
}
```

And finally, we'll need to make a small change to our Storybook configuration. As we're using Expo to build our app, we can safely remove some items from the configuration as they are not required. Turning the file contents into the following:

```javascript
// /storybook/index.js
import { getStorybookUI, configure } from '@storybook/react-native';

import './rn-addons';

// import stories
configure(() => {
  require('./stories');
}, module);

const StorybookUIRoot = getStorybookUI({
  asyncStorage: null,
});

export default StorybookUIRoot;
```

<div class="aside"><p>We're adding the <code>asyncStorage:null</code> due to the fact that starting with React Native 0.59 Async Storage was deprecated. Should you need to use it in your own app, you'll have to add it manually by installing <code>@react-native-async-storage/async-storage</code> package and adjust the code above accordingly. You can read more about how to setup Storybook with Async Storage in <a href="https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#react-native-async-storage">here</a>. As the tutorial will not use any of the features of Async Storage, we can safely add this element to Storybook configuration.</p></div>

After adding styling and assets, the app will render a bit strangely. That’s OK. We aren’t working on the app right now. We’re starting off with building our first component!
