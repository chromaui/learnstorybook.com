---
title: '插件'
tocTitle: '插件'
description: '了解如何使用流行的示例，集成与使用插件'
commit: 'dac373a'
---

# 插件

故事书，拥有强大的[插件](https://storybook.js.org/addons/introduction/)系统，您可以使用它，来增强团队中每个人的开发体验。如果您一直线性学习本教程，那么到目前为止，我们已经引用了多个插件，甚至在[测试章节](/react/zh-CN/test/)您已经实现了一个。

<div class="aside">
<strong>在寻找，潜力插件的列表?</strong>
<br/>
😍 你可以在<a href="https://storybook.js.org/addons/addon-gallery/">这里</a>，看看这份官方支持，且大力推进的社区插件列表 。
</div>

我们可以一直一直，对所有特定用例的配置和插件，提供建议。但现在嘛，让我们搭配集成 Storybook 生态系统中，最受欢迎的插件之一：[knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs)吧。

## 设置 Knobs

Knobs 能让设计师和开发人员，在受控环境中，试验和游玩组件，而不需要编码的绝佳插件！您基本上，只需要提供用户操作的动态定义字段，这些字段就会传递给您的故事中的，组件的 props。以下是我们要实现的内容...

<video autoPlay muted playsInline loop>
  <source
    src="/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### 安装

首先，我们需要安装，所有必需的依赖项。

```bash
yarn add @storybook/addon-knobs
```

注册 Knobs，在你的`.storybook/addons.js`文件。

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
<strong>📝 插件注册的顺序很重要!</strong>
<br/>
插件的顺序，指示出现在插件面板的选项卡 (对于那些出现的).
</div>

就是这样！是时候在故事中，使用它了。

### 用法

让我们在`Task`组件，使用 knobs 对象类型。

首先在`Task.stories.js`，导入`withKnobs`装饰者，和 knobs 的`object`类型：

```javascript
import React from 'react';
import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {withKnobs, object} from '@storybook/addon-knobs/react';
```

接下来，在`Task`的故事中，传递`withKnobs`，作为`addDecorator()`函数的参数：

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

最后，在默认(default)故事内，整合 Knobs `object`类型：

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return <Task task={object('task', {...task})} {...actions} />;
  })
  .add('pinned', () => (
    <Task task={{...task, state: 'TASK_PINNED'}} {...actions} />
  ))
  .add('archived', () => (
    <Task task={{...task, state: 'TASK_ARCHIVED'}} {...actions} />
  ));
```

现在，新的"Knobs"选项卡，应在底部窗格中，显示在"操作记录器"选项卡旁边。

如[这里](https://github.com/storybooks/storybook/tree/master/addons/knobs#object)所记录的，knob 的`object`类型，接受一个标签和一个默认对象作为参数。标签是常量，显示在插件面板中，文本字段的左侧。您传递的对象参数，将表示为可编辑的 JSON blob。只要您提交有效的 JSON，您的组件就会，根据传递给对象的数据进行调整！

## 插件演变你的故事书的范围

你的故事书实例，不仅是一个很棒的[CDD 环境](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)，现在还提供了一个互动的文档源。PropTypes 很棒，但是一个设计师或一个对组件代码完全陌生的人，就能够，通过因实现 Knobs 插件的 Storybook 文档，非常快速地找出它的行为。

## 使用 Knobs 查找边缘案例

此外，因能轻松访问编辑组件的传递数据，QA 工程师，或预防性 UI 工程师，现在可以将组件，上升到(UI)极限！举个例子，`Task`会发生什么，如果我们的列表项有一个*超长的*字符串？

![Oh no! The far right content is cut-off!](/addon-knobs-demo-edge-case.png) 😥超出边界了。

由于能够快速的，对组件的不同输入进行尝试，我们可以相对轻松地找到，并修复这些问题！让我们在`Task.js`添加样式，来解决溢出问题：

```javascript
// 这是给我们 任务标题(title) 的 input。若是现实实际中，我们多数会为这个元素更新 样式。
// 但对于本教程，让我们通过内联样式，来修复这个问题:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{textOverflow: 'ellipsis'}}
/>
```

![That's better.](/addon-knobs-demo-edge-case-resolved.png)👍

## 添加新故事，以避免(视觉)回归

当然，我们总是可以通过在 Knobs 中，输入相同的输入，来重现此问题，但最好为此输入，编写固定的故事。这将提神您的(视觉)回归测试，并为对团队其他成员，清楚地概述组件的限制。

让我们在`Task.stories.js`中，为长文本例子，添加一个故事：

```javascript
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => (
    <Task task={{...task, state: 'TASK_PINNED'}} {...actions} />
  ))
  .add('archived', () => (
    <Task task={{...task, state: 'TASK_ARCHIVED'}} {...actions} />
  ))
  .add('long title', () => (
    <Task task={{...task, title: longTitle}} {...actions} />
  ));
```

现在我们已经添加了故事，我们只要想处理它，我们就可以轻松地重现这个边缘情况：

![Here it is in Storybook.](/addon-knobs-demo-edge-case-in-storybook.png)

如果我们使用[视觉回归测试](/react/en/test/)，若打破我们画的'鸡蛋'，我们也会收到通知。要知道，这些不起眼的边缘情况，总是容易被遗忘！

### 合并更改

不要忘记，将您的更改与 git 合并！

## 与团队共享插件

Knobs 是让非开发人员，友好玩耍你的组件和故事的好方法。但是，他们可能很难在本地机器上，运行故事书。这就是为什么将您的故事书，部署到网上，会真的很有帮助。在下一章中，我们将部署我们的故事！
