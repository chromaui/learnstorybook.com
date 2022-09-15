---
title: '测试UI组件'
tocTitle: '测试'
description: '学习如何测试您的UI组件'
---

任何的 Storybook 教程都需要提及测试。测试旨在提供高质量的 UI。在模块化系统中，即使是细微的改变也可能引发极大的问题。我们已经提及了三种类型的测试：

- **手动测试** 这需要开发者自己去观察以确保组件的正确性。它们使得我们可以理性的确保组件外观的正确性。
- **快照测试** Storybook 快照帮助我们记录下组件的渲染特征。它们帮助我们了解因渲染出错或者警告所导致的特征变更。
- **单元测试** 通过 Jest，我们可以确保组件在给定输入的情况下，保持相同的输出。它们在测试组件的功能特性时十分有用。

## “但这看起来就是正确的吗？”

不幸的是，只依靠上述的测试方法是不足以防止 UI 漏洞发生的。UI 难以测试在于其主观性。手动测试，显然是手动的。快照测试很可能出发太多的错误报告。像素级别的测试又没那么有价值。一个完整的 Storybook 测试策略也应该包括视觉回归测试。

## Storybook 中的视觉测试

视觉回归测试，也叫做视觉测试，主要是用来捕获外观的变化。他们通过获取每一个 story 的截图，并进行 commit 级别的比较。这对于验证像布局，颜色，大小和对比度等图像元素来说再合适不过了。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是一个完全适用于视觉回归测试的工具，因为每一个 story 本质上都是一个测试规格。每次对 story 的创建或修改都意味着我们创建了一个新的规格！

我们有很多视觉回归测试工具可以使用。我们推荐使用[**Chromatic**](https://www.chromatic.com/)，一个由 Storybook 团队维护的免费发布服务，并支持在云端并行的运行视觉测试。同时正如[前一章](/intro-to-storybook/vue/zh-CN/deploy/)所示，此服务也允许我们在线发布 Storybook。

## 捕获 UI 改变

视觉回归测试依赖于新 UI 代码生成的图像和基准图像的比较。一旦 UI 被改变，我们将会收到通知。

让我们修改`Task`组件的背景来看看它是怎么工作的吧。

先创建一个新的分支：

```shell
git checkout -b change-task-background
```

按如下修改`Task`：

```diff:title=src/components/Task.vue
<input
  type="text"
  :value="task.title"
  readonly
  placeholder="Input title"
+ style="background: red;"
/>
```

这为每个 task 项提供了一个新的背景色。

![task background change](/intro-to-storybook/chromatic-task-change.png)

添加文件：

```shell
git add .
```

提交：

```shell
git commit -m "change task background to red"
```

提交到远程仓库：

```shell
git push -u origin change-task-background
```

最后，打开您的 GitHub 仓库，并为`change-task-background`分支建立一个拉取请求（pull request）。

![Creating a PR in GitHub for task](/github/pull-request-background.png)

为您的拉取请求添加一些描述并点击`Create pull request`。点击页面底部的"🟡 UI Tests"PR 检查。

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

您提交所产生的 UI 改变将会显示出来。

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

这里有太多改变了！从组件层级来说，因为`Task`是`TaskList`和`Inbox`的子组件，这也就意味着即使是很小的修改也会被滚雪球式的放大。这种情况恰恰精准的展示了为什么开发者除了需要其他测试方法之外，还需要视觉回归测试的原因。

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

现代应用是基于组件进行开发的，所以在组件级别进行测试尤为重要。这帮助我们理解改变的根本原因，即组件本身，而不是只看到由改变而导致的症状，即画面或者合成组件。

## 合并修改

当我们审查完代码后，我们相信现在可以合并这些 UI 改变了 --也就是说这些修改不会意外地导致漏洞发生。如果你喜欢新的`红色`背景则保留此次修改，否则恢复到原来的状态。

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook 帮助我们**构建**组件；测试帮助我们**维护**组件。本教程中提及的 UI 测试包括手动，快照，单元和视觉回归测试。后三种可以通过添加进 CI 来实现自动化，正如我们所设置的那样。这可以帮助我们在编写组件时规避漏洞的产生。整体的流程如下所示。

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
