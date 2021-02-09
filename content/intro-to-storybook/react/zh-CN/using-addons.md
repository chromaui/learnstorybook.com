---
title: '插件'
tocTitle: '插件'
description: '学习如何集成并使用热门的 Controls 插件'
commit: 'a23f4d0'
---

Storybook 有一个强大的生态系统 [addons](https://storybook.js.org/docs/react/configure/storybook-addons)，你能够用来增强你的团队中每个人的开发体验。在 [这里](https://storybook.js.org/addons) 浏览全部。

如果你一直遵循着本教程，那么你已经遇到了多个插件，并在 [测试](/react/zh-CN/test/) 章节进行了设置。

有些插件对于每个例子都可能用到。让我们集成最受欢迎的插件：[Controls](https://storybook.js.org/docs/react/essentials/controls)。

## 什么是 Controls ？

Controls 允许设计者和开发者通过修改参数轻松地对组件行为进行探索。无需代码。Controls 会在你的 stories 下创建一个 addon 插件面板，因此你可以实时编辑你的 arguments 参数。

全新安装的 Storybook 包含了开箱即用的 Controls，不需要额外的配置。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## 插件解锁了新的 Storybook 工作流程

Storybook 是一个绝妙的 [组件驱动开发环境](https://www.componentdriven.org/)。Controls 插件将 Storybook 进化为交互式文档工具。

### 使用 Controls 查找边缘用例

有了 Controls，QA 及 UI 工程师或其他任何相关者都可以将组件推送至极限！让我们考虑以下示例，当我们添加一个 **MASSIVE** 字符串时，我们的 `Task` 会发生什么？

![不好！右边的内容被截断了！](/intro-to-storybook/task-edge-case.png)

这是不对的，看起来文本超出了 Task 组件范围。

Controls 允许我们快速验证不同输入下组件的情况。如很长的字符串。这减少了发现 UI 问题的工作量。

现在通过给 `Task.js` 添加样式解决这个溢出问题：

```js
// src/components/Task.js

<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![这样更好。](/intro-to-storybook/edge-case-solved-with-controls.png)

问题解决了！现在当文本到达 Task 区域边界时使用省略号替代。

### 添加一个新的 story 避免回归

将来，我们可以通过通过 Controls 输入相同的字符串来手动重现此问题。但是写一个展示这种极端情况的故事更容易。这扩大了我们的回归测试范围，并清楚地概述了团队其余部分的组件限制。

在 `Task.stories.js` 中为长文本添加新的故事：

```js
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

现在，我们可以轻松地复制和处理这种情况。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

如果我们是[视觉测试](/react/zh-CN/test/)，那么如果省略号式的解决方案中断，我们也会收到通知。没有测试覆盖范围的情况下，容易遗忘的边缘盒！

### 合并修改

不要忘记使用 git 合并你的修改！

<div class="aside"><p>Controls 控件是让非开发人员玩弄您的组件和故事的好方法，它比我们在这里看到的要多得多，我们推荐阅读 <a href="https://storybook.js.org/docs/react/essentials/controls">官方文档</a> 学习关于它的更多。并且你可以通过多种方式自定义 Storybook 插件以适合你的工作流程。 在 <a href="/create-an-addon/react/en/introduction/">创建插件</a> 章节中，我们将通过创建一个插件来教您这一点，该插件将帮助您增强开发工作流程。</p></div>
