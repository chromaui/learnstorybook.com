---
title: '构建一个页面'
tocTitle: '页面'
description: '用组件构建一个页面'
commit: e56e345
---

# 构建一个页面

我们专注于从下到上构建 UI; 从小做起，并增加复杂性。这样做使我们能够独立，开发每个组件，找出其数据需求，并在 Storybook 中使用它。 所有这些，都无需启动服务器或构建出页面!

在本章中，我们通过将组件组成一个页面，并在 Storybook 中，开发该页面，来继续提高复杂性。

## 嵌套的容器组件

由于我们的应用程序非常简单，我们将构建的页面非常简单，只需在某些布局中，简单包装`TaskList`组件 (通过 Redux 提供数据)，并拉出 redux 中，顶级`error`字段 (假设我们在连接到服务器时，遇到问题，我们将设置该字段) 。在你的`components`文件夹，创建`InboxScreen.js`:

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({error}) {
  if (error) {
    return (
      <div className="page lists-show">
        <div className="wrapper-message">
          <span className="icon-face-sad" />
          <div className="title-message">Oh no!</div>
          <div className="subtitle-message">Something went wrong</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page lists-show">
      <nav>
        <h1 className="title-page">
          <span className="title-wrapper">Taskbox</span>
        </h1>
      </nav>
      <TaskList />
    </div>
  );
}

PureInboxScreen.propTypes = {
  error: PropTypes.string
};

PureInboxScreen.defaultProps = {
  error: null
};

export default connect(({error}) => ({error}))(PureInboxScreen);
```

我们也改变了`App`组建，用于渲染`InboxScreen` (最终我们会使用一个路由器(router)，来选择正确的页面，但在此不要担心) :

```javascript
import React, {Component} from 'react';
import {Provider} from 'react-redux';
import store from './lib/redux';

import InboxScreen from './components/InboxScreen';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <InboxScreen />
      </Provider>
    );
  }
}

export default App;
```

然而，事情变得有趣的是，在 Storybook 中，渲染故事。

正如，我们之前看到的那样，`TaskList`组件是一个 **容器**，渲染`PureTaskList`这个外观组件。 根据定义，容器组件不能独自，简单渲染; 他们希望获取一些上下文或连接到服务。 这意味着要在 Storybook 中，渲染容器，我们必须模拟 (即提供) 它所需的上下文或服务。

放`TaskList`，进入 Storybook，我们能够通过简单地渲染`PureTaskList`，避开容器组件，来避开这个问题。类似的做法，我们也会在 Storybook 中，渲染`PureInboxScreen`。

但是，对于`PureInboxScreen`我们有一个问题，因为虽然`PureInboxScreen`本身是外观组件，它的孩子`TaskList`， 不是。 从某种意义上说，`PureInboxScreen`被"容器"污染了。所以，当我们设置我们的故事`InboxScreen.stories.js`:

```javascript
import React from 'react';
import {storiesOf} from '@storybook/react';

import {PureInboxScreen} from './InboxScreen';

storiesOf('InboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

我们看到了，虽然`error`故事工作得很好，我们`default`故事却有一个问题，因为`TaskList`没有要连接的 Redux Store 。 (在尝试单元测试，测试`PureInboxScreen`时，您也会遇到类似的问题) 。

![Broken inbox](/broken-inboxscreen.png)

避免此问题的一种方法是，永远不要在应用程序中的任何位置，渲染容器组件，除非在最高级别，并将所有要求的数据，传递到组件层次结构中。

但是，开发人员 **将** 不可避免地需要在组件层次结构中，进一步渲染容器。 如果我们想要在 Storybook 中，渲染大部分或全部应用程序 (我们这样做!) ，我们需要一个解决此问题的方法。

<div class="aside">
另外，在层次结构中，传递数据是合法的方法，尤其是在使用 <a href="http://graphql.org/">GraphQL</a>。 这就是我们建立 <a href="https://chromaticqa.com">Chromatic</a> 的方式，有 800+ 故事。
</div>

## 用装饰器提供上下文

好消息是，在一个故事中， Redux Store 很容易提供给 一个`InboxScreen`! 我们可以使用 Redux Store 的模拟版本，提供到装饰器(Decorator)中:

```javascript
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Provider} from 'react-redux';

import {PureInboxScreen} from './InboxScreen';
import {defaultTasks} from './TaskList.stories';

// A super-simple mock of a redux store
const store = {
  getState: () => {
    return {
      tasks: defaultTasks
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch')
};

storiesOf('InboxScreen', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

存在类似的方法，来为其他数据库提供模拟的上下文，例如[Apollo](https://www.npmjs.com/package/apollo-storybook-decorator)，[Relay](https://github.com/orta/react-storybooks-relay-container)和别的。

循环浏览 Storybook 中的状态，可以轻松测试，我们当前是否已完成:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## 组件驱动开发

我们从底部的`Task`开始，然后进展到`TaskList`，现在我们在这里，使用全页面 UI。 我们的`InboxScreen`容纳了，一个嵌套的容器组件，并包括随附的故事。

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**组件驱动开发**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)允许您在往上移动组件层次结构时，逐渐扩展复杂性。 其中的好处包括，更集中的开发过程 ，以及所有可能的 UI 组合 的覆盖范围。 简而言之，CDD 可帮助您构建 更高质量和更复杂的用户界面。

我们还没有完成 - 在 UI 构建后，工作不会结束。 我们还需要确保它随着时间的推移，保持完好。
