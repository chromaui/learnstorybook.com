---
title: 'Construct a screen'
tocTitle: 'Screens'
description: 'Construct a screen out of components'
---

We've concentrated on building UIs from the bottom up; starting small and adding complexity. Doing so has allowed us to develop each component in isolation, figure out its data needs, and play with it in Storybook. All without needing to stand up a server or build out screens!

In this chapter we continue to increase the sophistication by combining components in a screen and developing that screen in Storybook.

## Nested container components

As our app is very simple, the screen we’ll build is pretty trivial, simply wrapping the `TaskList` component (which supplies its own data via Redux) in some layout and pulling a top-level `error` field out of redux (let's assume we'll set that field if we have some problem connecting to our server). Create `PureInboxScreen.js` in your `components` folder:

```javascript
// components/PureInboxScreen.js
import * as React from 'react';
import PropTypes from 'prop-types';
import PercolateIcons from '../constants/Percolate';
import TaskList from './TaskList';
import { Text, SafeAreaView, View } from 'react-native';
import { styles } from '../constants/globalStyles';
const PureInboxScreen = ({ error }) => {
  if (error) {
    return (
      <SafeAreaView style={styles.PageListsShow}>
        <View style={styles.WrapperMessage}>
          <PercolateIcons name="face-sad" size={64} color={'#2cc5d2'} />
          <Text style={styles.TitleMessage}>Oh no!</Text>
          <Text style={styles.SubtitleMessage}>Something went wrong</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.PageListsShow}>
      <View style={[styles.titlepage, styles.PageListsShowhead]}>
        <Text numberOfLines={1} style={styles.TitleWrapper}>
          Taskbox
        </Text>
      </View>
      <TaskList />
    </SafeAreaView>
  );
};
PureInboxScreen.propTypes = {
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default PureInboxScreen;
```

Then we create a container which grabs the data for `PureInboxScreen` in `screens/InboxScreen.js`

```javascript
// screens/InboxScreen.js
import * as React from 'react';
import { connect } from 'react-redux';
import PureInboxScreen from '../components/PureInboxScreen';

const InboxScreen = ({ error }) => {
  return <PureInboxScreen error={error} />;
};

export default connect(({ error }) => ({ error }))(InboxScreen);
```

We also change the `HomeScreen` component to render the `InboxScreen` (eventually we would use a more complex structure to choose the correct screen, but let's not worry about that here):

```javascript
// screens/HomeScreen.js
import * as React from 'react';
import { Provider } from 'react-redux';
import store from '../lib/redux';

import InboxScreen from './InboxScreen';

export default function HomeScreen() {
  return (
    <Provider store={store}>
      <InboxScreen />
    </Provider>
  );
}
```

However, where things get interesting is in rendering the story in Storybook.

As we saw previously, the `TaskList` component is a **container** that renders the `PureTaskList` presentational component. By definition container components cannot be simply rendered in isolation; they expect to be passed some context or to connect to a service. What this means is that to render a container in Storybook, we must mock (i.e. provide a pretend version) the context or service it requires.

When placing the `TaskList` into Storybook, we were able to dodge this issue by simply rendering the `PureTaskList` and avoiding the container. We'll do something similar and render the `PureInboxScreen` in Storybook also.

However, for the `PureInboxScreen` we have a problem because although the `PureInboxScreen` itself is presentational, its child, the `TaskList`, is not. In a sense the `PureInboxScreen` has been polluted by “container-ness”. So when we setup our stories in `PureInboxScreen.stories.js`:

```javascript
// components/PureInboxScreen.stories.js
import * as React from 'react';
import { storiesOf } from '@storybook/react-native';
import PureInboxScreen from './PureInboxScreen';

storiesOf('PureInboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

We see that although the `error` story works just fine, we have an issue in the `default` story, because the `TaskList` has no Redux store to connect to. (You also would encounter similar problems when trying to test the `PureInboxScreen` with a unit test).

![Broken inbox](/intro-to-storybook/broken-inboxscreen.png)

One way to sidestep this problem is to never render container components anywhere in your app except at the highest level and instead pass all data-requirements down the component hierarchy.

However, developers **will** inevitably need to render containers further down the component hierarchy. If we want to render most or all of the app in Storybook (we do!), we need a solution to this issue.

<div class="aside">
As an aside, passing data down the hierarchy is a legitimate approach, especially when using <a href="http://graphql.org/">GraphQL</a>. It’s how we have built <a href="https://www.chromatic.com">Chromatic</a> alongside 800+ stories.
</div>

## Supplying context with decorators

The good news is that it is easy to supply a Redux store to the `PureInboxScreen` in a story! We can just use a mocked version of the Redux store provided in a decorator:

```javascript
// components/PureInboxScreen.stories.js
import * as React from 'react';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';
import { defaultTasks } from './PureTaskList.stories';
import PureInboxScreen from './PureInboxScreen';

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasks,
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

storiesOf('PureInboxScreen', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

Similar approaches exist to provide mocked context for other data libraries, such as [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) and others.

Cycling through states in Storybook makes it easy to test we’ve done this correctly:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## Component-Driven Development

We started from the bottom with `Task`, then progressed to `TaskList`, now we’re here with a whole screen UI. Our `InboxScreen` accommodates a nested container component and includes accompanying stories.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/) allows you to gradually expand complexity as you move up the component hierarchy. Among the benefits are a more focused development process and increased coverage of all possible UI permutations. In short, CDD helps you build higher-quality and more complex user interfaces.

We’re not done yet - the job doesn't end when the UI is built. We also need to ensure that it remains durable over time.
