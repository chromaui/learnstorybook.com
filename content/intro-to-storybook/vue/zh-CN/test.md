---
title: '视觉测试'
tocTitle: '视觉测试'
description: '学习如何测试您的UI组件'
---

任何的 Storybook 教程都需要提及测试。测试旨在提供高质量的 UI。在模块化系统中，即使是细微的改变也可能引发极大的问题。目前为止，我们已经提及了三种类型的测试：

- **手动测试**这需要开发者自己去观察以确保组件的正确性。它们帮助我们在构建组件时理性的检查其外观。
- **无障碍测试**通过 a11y 插件验证每个人都可以访问组件。它们非常适合允许我们收集特定类型的残疾人如何使用我们的组件的信息。
- **交互测试**通过 play 函数验证组件在交互过程的行为符合预期。它们非常适合测试使用组件时的行为。

## “但这看起来就是正确的吗？”

不幸的是，只依靠上述的测试方法是不足以防止 UI bug 产生。UI 难以测试在于其设计是主观及微妙的。手动测试是手动测试。其他 UI 测试，如快照测试很可能触发太多的误报，像素级别的单元测试又没那么有价值。一个完整的 Storybook 测试策略也应该包括视觉回归测试。

## Storybook 中的视觉测试

视觉回归测试，也叫做视觉测试（visual test），主要是用来捕获外观的变化。他们通过获取每一个 story 的截图，并进行 commit 级别的比较。这对于验证像布局，颜色，大小和对比度等图像元素来说再合适不过了。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是一个非常棒的视觉回归测试的工具，因为每一个 story 本质上都是一个测试规格。每次对 story 的创建或修改时，我们都可以获取一个新的规格！

有几种视觉回归测试的工具。我们推荐使用 [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)，一个由 Storybook 维护者提供的免费发布服务，可以在云端浏览器环境中快速进行运行视觉测试。同时正如[前一章](/intro-to-storybook/vue/zh-CN/deploy/)所示，此服务也允许我们在线发布 Storybook。

## 捕获 UI 改变

视觉回归测试依赖于新 UI 代码生成的图像和基准图像的比较。一旦 UI 改变被捕获，我们将会收到通知。

让我们修改 `Task` 组件的背景来看看它是怎么工作的吧。

先创建一个新的分支：

```shell
git checkout -b change-task-background
```

按如下所示修改 `src/components/Task.vue`：

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
+       style="background-color: red" />
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

这为每个 task 项提供了一个新的背景色。

![task background change](/intro-to-storybook/chromatic-task-change-7-0.png)

添加文件：

```shell
git add .
```

提交：

```shell
git commit -m "change task background to red"
```

将改动推送到远程仓库：

```shell
git push -u origin change-task-background
```

最后，打开您的 GitHub 仓库，并为 `change-task-background` 分支建立一个拉取请求（pull request）。

![Creating a PR in GitHub for task](/github/pull-request-background.png)

为您的拉取请求添加一些描述信息并点击 `Create pull request`。点击页面底部的"🟡 UI Tests" PR 检查。

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

它将显示通过 commit 捕获的 UI 变化。

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

这里有很多变化！从组件层级来说，因为 `Task`是 `TaskList` 和 `Inbox` 的子组件，这也就意味着即使是很小的修改也会被滚雪球式的放大。这种情况恰恰精准的展示了为什么开发者除了需要其他测试方法之外，还需要视觉回归测试的原因。

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 审查改变

视觉回归测试确保了组件不会被意外修改。但这仍然需要我们自己来判断修改是有意的还是无意的。

如果修改是我们有意为之的，那我们就需要更新基准来保证未来的测试可以和最新版本的 story 进行对比。如果是无意的那就说明我们需要修正它。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

由于现代应用是基于组件进行开发的，所以在组件级别进行测试尤为重要。这帮助我们理解改变的根本原因，即组件本身，而不是只看到由改变而导致的症状，即画面或者合成组件。

## 合并修改

当我们审查完代码后，我们相信现在可以合并这些 UI 改变了--也就是说这些修改不会意外地导致漏洞发生。如果你喜欢新的`红色`背景则保留此次修改，否则恢复到原来的状态。

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook 帮助我们**构建**组件；测试帮助我们**维护**组件。本教程中提及的 UI 测试包括手动，无障碍，交互和视觉回归测试。后三种可以通过添加进 CI 来实现自动化，正如我们所设置的那样。这可以帮助我们在编写组件时规避漏洞的产生。整体的流程如下所示。

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
