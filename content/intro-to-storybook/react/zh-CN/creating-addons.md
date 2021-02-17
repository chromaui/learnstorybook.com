---
title: '奖励：创建一个插件'
tocTitle: '奖励：创建一个插件'
description: '了解如何构建自己的插件，这些插件将为您的开发增添更多动力'
commit: 'ed54b16'
---

之前，我们介绍了 Storybook 的一个关键功能，就是强大的 [插件](https://storybook.js.org/docs/react/configure/storybook-addons) 生态系统。插件用于增强你的开发体验和工作流程。

在这一章中，我们将介绍如何创建自己的插件。您可能会认为编写它可能是一项艰巨的任务，但实际上并非如此，我们只需要采取几个步骤就可以开始编写它。

但是首先，让我们先确定插件的作用。

## 我们要写的插件

对于此示例，假设我们的团队拥有与现有 UI 组件某种程度上相关的一些设计资产。从当前的 Storybook UI 来看，这种关系似乎并不是很明显。我们该如何解决？

我们有我们的目标，现在让我们定义插件将支持哪些功能：

- 面板中显示设计资产
- 支持图片及嵌入网址
- 应该支持多个资产，以防万一会有多个版本或主题

我么将通过 [参数 parameters](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters)将资产列表附加到故事中，可以除 Storybook 功能以外添加额外的元数据到故事中。

```javascript
// YourComponent.stories.js

export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    //👇 Name of the parameter used with the addon.
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## 设置

我们已经概述了插件的功能，是时候开始研究它了。

在您的 `.storybook` 文件夹中，创建一个名为 `design-addon` 的新文件夹，并在其中创建一个名为 `register.js` 的新文件。

就是这样！我们准备开始开发插件。

<div class="aside">我们将使用 <code>.storybook</code> 文件夹作为插件的占位符。其背后的原因是要保持一种简单的方法，并避免使其过于复杂。如果将此插件转换为实际的插件，最好将其移动到具有其自己的文件和文件夹结构的单独软件包中。</div>

## Writing the addon

将以下内容添加到您最近创建的文件中：

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

这是入门的典型样板代码。回顾一下代码在做什么：

- 我们正在故事书中注册一个新插件。
- 为我们的插件添加一个新的 UI 元素，并带有一些选项（标题将定义我们的插件和所使用的元素的类型），并暂时用一些文本进行渲染。

此时启动 Storybook，我们暂时还看不到该插件。我们需要在 [`.storybook/main.js`](https://storybook.js.org/docs/react/configure/overview#configure-your-storybook-project) 文件中注册自己的文件。只需将以下内容添加到已经存在的`addons`列表中：

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    './design-addon/register.js', //👈 Our addon registered here
  ],
};
```

![design assets addon running inside Storybook](/intro-to-storybook/create-addon-design-assets-added-6-0.png)

成功！我们将新创建的插件添加到 Storybook UI 中。

<div class="aside">使用 Storybook 不仅可以添加面板，还可以添加各种不同类型的UI组件。而且大多数（如果不是全部的话）它们都已经在 @storybook/components 包中创建了，因此您无需花费太多时间来实现UI并专注于编写功能。</div>

### 创建内容组件

我们已经完成了第一个目标。是时候开始第二个了。

要完成此操作，我们需要对导入进行一些更改，并引入一个新组件来显示资产信息。

对插件文件进行以下更改：

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

我们已经创建了组件，修改了导入，所缺少的就是将组件连接到面板，并且我们将有一个工作附加程序，能够显示有关我们故事的信息。

您的代码应如下所示：

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

请注意，我们正在使用 [useParameter](https://storybook.js.org/docs/react/api/addons-api#useparameter) ，该钩子将使我们能够方便地读取 `parameters` 提供的信息。每个故事的选项，在我们的案例中，它可以是资产的单一路径或路径列表。您很快就会看到它的生效。

### 在故事中使用我们的插件

我们已经连接了所有必要的部分。但是，我们如何查看它是否确实在工作并显示任何内容？

为此，我们将对 `Task.stories.js` 文件进行少量更改，然后添加 [parameters](https://storybook.js.org/docs/react/writing-stories/parameters) 选项。

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  parameters: {
    //👇 Story's parameter defined here
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
};
/* same as before  */
```

继续并重新启动 Storybook，然后选择 Task 故事，您应该会看到类似以下内容：

![故事书故事，显示带有设计资产附加组件的内容](/intro-to-storybook/create-addon-design-assets-inside-story-6-0.png)

### 在我们的插件中显示内容

在这个阶段，我们可以看到插件正在正常运行，但是现在让我们更改 `Content` 组件以实际显示我们想要的内容：

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

让我们看一下代码。我们使用来自 [`@storybook/theming`](https://storybook.js.org/docs/react/configure/theming) 包的 `styled` 标签。这使我们可以自定义 Storybook 的主题和插件 UI。 [useStorybookState](https://storybook.js.org/docs/react/api/addons-api#usestorybookstate) 是一个挂钩，可让我们利用 Storybook 的内部状态来获取存在的任何信息。在我们的案例中，我们正在使用它来获取创建的每个故事的 ID。

### 显示实际资产

要实际查看插件中显示的资产，我们需要将其复制到 `public` 文件夹中，并调整故事的 `parameters` 选项以反映这些更改。

故事书将获取更改并加载资产，但目前仅第一个。

![加载的实际资产](/intro-to-storybook/design-assets-image-loaded-6-0.png)

## 有状态的插件

超越我们的最初目标：

- ✔️ 在面板中显示设计资产
- ✔️ 支持图像，但也包含用于嵌入的网址
- ❌ 应该支持多个资产，以防万一会有多个版本或主题

我们快到了，只剩下一个目标。

对于最后一个，我们将需要某种状态，我们可以使用 React 的 `useState` 钩子，或者如果我们正在使用类组件 `this.setState()`。但是相反，我们将使用 Storybook 自己的 [`useAddonState`](https://storybook.js.org/docs/react/api/addons-api#useaddonstate)，这为我们提供了一种持久化插件状态的方法，并且避免创建额外的逻辑来持久化本地状态。我们还将使用 Storybook 中的另一个 UI 元素 `ActionBar` ，该元素可让我们在各项之间进行切换。

我们需要根据需要调整进口量：

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

并修改 `Content` 组件，以便我们可以在资产之间进行更改：

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## 内置插件

我们已经完成了要做的工作，即创建一个功能全面的 Storybook 插件，以显示与 UI 组件相关的设计资产。

<details>
  <summary>单击以展开并查看此示例中使用的完整代码</summary>

```javascript
// .storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  const results = useParameter('assets', []); // story's parameter being retrieved here
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'Assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## 下一步

我们插件的下一个合乎逻辑的步骤是使其成为自己的软件包，并允许将其与您的团队以及社区其他成员一起分发。

但这超出了本教程的范围。本示例演示如何使用 Storybook API 创建自己的自定义插件，以进一步增强开发工作流程。

了解如何进一步自定义您的插件：

- [在 Storybook 工具栏中添加按钮](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [通过渠道与 iframe 进行交流](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [发送命令和结果](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [对您的组件输出的 html/css 进行分析](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [包装组件，用新数据重新渲染](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [触发 DOM 事件，进行 DOM 更改](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [运行测试](https://github.com/storybookjs/storybook/tree/next/addons/jest)

以及更多！

<div class="aside">如果您创建了一个新插件，并且对使其具有功能感兴趣，请随时在Storybook文档中打开PR使其具有功能。</div>

### 开发套件

为了帮助您快速启动插件开发，Storybook 团队开发了一些 `dev-kits`。

这些软件包是入门工具包，可帮助您开始构建自己的插件。
我们刚刚完成的插件基于这些入门套件之一，更具体地说是 `addon-parameters` dev-kit。

您可以在这里找到这个和其他：
https://github.com/storybookjs/storybook/tree/next/dev-kits

将来会有更多开发套件可用。

## 与团队共享插件

插件是节省时间的工作流，但非技术团队成员和审阅者可能很难利用它们的功能。您不能保证人们会在其本地计算机上运行 Storybook。这就是为什么将您的 Storybook 部署到在线位置以供所有人参考的原因。
