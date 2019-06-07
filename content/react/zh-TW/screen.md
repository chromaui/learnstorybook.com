---
title: "構建一個頁面"
tocTitle: "頁面"
description: "用元件構建一個頁面"
commit: e56e345
---

我們專注於從下到上構建UI; 從小做起並增加複雜性. 這樣做使我們能夠獨立開發每個元件,找出其資料需求,並在 Storybook 中使用它. 所有這些都無需 啟動伺服器或構建出頁面!

在本章中,我們通過組合頁面中的元件,並在 Storybook中開發該頁面 來繼續提高複雜性.

## 巢狀的容器元件

由於我們的應用程式非常簡單,我們將構建的頁面非常簡單,只需簡單地包裝`TaskList`元件 (通過Redux提供自己的資料) 在某些佈局中並拉出redux中頂層`error`的欄位 (假設我們在連線到 伺服器時遇到問題,我們將設定該欄位) . 建立`InboxScreen.js`在你的`components`夾:

```javascript
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskList from './TaskList';

export function PureInboxScreen({ error }) {
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
  error: PropTypes.string,
};

PureInboxScreen.defaultProps = {
  error: null,
};

export default connect(({ error }) => ({ error }))(PureInboxScreen);
```

我們也改變了`App`,用於渲染的元件`InboxScreen` (最終我們會使用路由器來選擇正確的頁面,但不要在此擔心) :

```javascript
import React, { Component } from 'react';
import { Provider } from 'react-redux';
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

然而,事情變得有趣的是在 Storybook中渲染故事.

正如我們之前看到的那樣`TaskList`元件是一個 **容器**, 這使得`PureTaskList`表示元件. 根據定義,容器元件不能簡單地單獨呈現; 他們希望通過一些上下文或連線到服務. 這意味著要在Storybook中呈現容器,我們必須模擬 (即提供假裝版本) 它所需的上下文或服務.

放置`TaskList`進入 Storybook,我們能夠通過簡單地渲染`PureTaskList`,並避開容器來避開這個問題. 我們會渲染`PureInboxScreen`並在 Storybook中做類似的事情.

但是,對於`PureInboxScreen`我們有一個問題,因為雖然`PureInboxScreen`本身是表現性的,它的孩子,`TaskList`, 不是. 從某種意義上說`PureInboxScreen`被"容器"汙染了. 所以,當我們設定我們的故事`InboxScreen.stories.js`:

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';

import { PureInboxScreen } from './InboxScreen';

storiesOf('InboxScreen', module)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

我們看到了雖然如此`error`故事工作得很好,我們`default`故事有一個問題,因為`TaskList`沒有要連線的Redux Store . (在嘗試測試時,您也會遇到類似的問題`PureInboxScreen`用單元測試) .

![Broken inbox](/broken-inboxscreen.png)

避免此問題的一種方法是,永遠不要在應用程式中的任何位置呈現容器元件,除非在最高級別,而是將所有要求的資料 傳遞到 元件層次結構中.

但是,開發人員 **將** 不可避免地需要在元件層次結構中,進一步渲染容器. 如果我們想要在 Storybook中渲染大部分或全部應用程式 (我們這樣做!) ,我們需要一個解決此問題的方法.

<div class="aside">
另外，在層次結構中 傳遞資料 是合法的方法，尤其是在使用 <a href="http://graphql.org/">GraphQL</a>. 這就是我們的建設 <a href="https://www.chromaticqa.com">Chromatic</a> 伴隨著670多個故事.
</div>

## 用裝飾器提供上下文

好訊息是 Redux Store  很容易提供給 一個`InboxScreen`故事! 我們可以使用 Redux Store 的模擬版本 提供給到裝飾器中:

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Provider } from 'react-redux';

import { PureInboxScreen } from './InboxScreen';
import { defaultTasks } from './TaskList.stories';

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

storiesOf('InboxScreen', module)
  .addDecorator(story => <Provider store={store}>{story()}</Provider>)
  .add('default', () => <PureInboxScreen />)
  .add('error', () => <PureInboxScreen error="Something" />);
```

存在類似的方法來為其他資料庫提供模擬的上下文,例如[阿波羅](https://www.npmjs.com/package/apollo-storybook-decorator),[Relay](https://github.com/orta/react-storybooks-relay-container)和別的.

在Storybook中 迴圈瀏覽狀態 可以輕鬆測試我們是否已正確完成此操作:

<video autoPlay muted playsInline loop >

  <source
    src="/finished-inboxscreen-states.mp4"
    type="video/mp4"
  />
</video>

## 元件驅動開發

我們從底部開始`Task`,然後進展到`TaskList`,現在我們在這裡使用全屏UI. 我們的`InboxScreen`容納巢狀的容器元件,幷包括隨附的故事.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**元件驅動開發**](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)允許您在向上移動元件層次結構時,逐漸擴充套件複雜性. 其中的好處包括 更集中的開發過程 以及 所有可能的UI排列 的覆蓋範圍. 簡而言之,CDD 可幫助您構建 更高質量和更復雜 的使用者介面.

我們還沒有完成 - 在構建UI時,工作不會結束. 我們還需要確保它隨著時間的推移保持持久.
