---
title: '插件'
tocTitle: '插件'
description: '学习如何集成并使用热门插件'
commit: '4631b22'
---

Storybook 拥有一个健壮的[插件](https://storybook.js.org/docs/vue/configure/storybook-addons)生态系统来帮助您的团队提高开发体验。在[这里](https://storybook.js.org/addons)查看它们，

如果您完成了教程之前的部分，您实际上已经接触了一些插件，并在[测试](/intro-to-storybook/vue/zh-CN/test/)章节配置了其中一个。

基本上每一个用例都有对应的插件，要把它们都写出来可能要花很长时间。让我们来集成其中最受欢迎的一个吧：[Controls](https://storybook.js.org/docs/vue/essentials/controls)。

## 什么是 Controls？

Controls 允许设计人员和开发人员通过*修改*组件参数的方式轻松浏览组件的行为。不需要写代码。Controls 通过在您的 story 旁创建一个插件面板，让您可以动态的修改组件参数。

全新安装的 Storybook 默认包含了 Controls，开箱即用。无需额外配置。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## 使用插件解锁新的 Storybook 工作流程

Storybook 是一个非常棒的[组件驱动式开发环境](https://www.componentdriven.org/)。Controls 插件将 Storybook 演变成一个交互式文档工具。

### 使用 Controls 来发现边界用例

通过 Controls，任何的 QA 工程师，UI 工程师，或者其他的利益相关者都可以将组件推进到极致！让我们考虑下面这个例子，如果我们添加了一个**非常长**的字符串，我们的 `Task` 会发生什么？

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case.png)

这显然不对！就好像文本从 Task 组件的边界溢出了一样。

Controls 使得我们可以快速验证组件的各种输入。在这个例子中是一个长字符串。这减少了发现 UI 问题所需要的工作量。

现在让我们通过给 `Task.vue` 追加一个样式来解决这个问题：

```diff:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label
      :for="'checked' + task.id"
      :aria-label="'archiveTask-' + task.id"
      class="checkbox"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
+       style="text-overflow: ellipsis;" />
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls.png)

问题解决了！当文本到达 Task 区域边界时，通过漂亮的省略号将其截断。

### 增加一个新的 story 来避免回归

未来我们可以通过 Controls 输入相同的字符串来重现这个问题。但是更简单的方式是写一个 story 来表明这个边缘用例。这样做的好处在于增加了我们回归测试的覆盖率，并向其他组员清晰的表明了组件的局限性。

在 `Task.stories.js` 中为长文本的情况增加一个新的 story。

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

现在我们可以轻松的复现并处理此边缘用例了。

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

如果我们在进行[视觉测试](/intro-to-storybook/vue/zh-CN/test/)，那么在截断方案失效时我们也会得到提示。如果没有覆盖测试，这样的模糊的边缘用例很容易被忽视。

<div class="aside"><p>💡 Controls 非常适合让一些非开发人员测试您的组件和 story，它远比您想象的要强大。我们推荐您阅读<a href="https://storybook.js.org/docs/vue/essentials/controls">官方文档</a>来了解更多。此外您还可以使用很多别的方式来定制  Storybook，以通过插件来适应您的工作流程。在<a href="/create-an-addon/react/zh-CN/introduction/">创建组件指导</a>中我们将会教您，通过创建一个插件来帮助增强您的开发工作流程。</div>

### 合并修改

别忘了在 git 里合并您的修改！
