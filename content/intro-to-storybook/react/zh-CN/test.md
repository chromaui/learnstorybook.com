---
title: '测试 UI 组件'
tocTitle: '测试'
description: '了解测试UI组件的方法'
---

Storybook 教程没有测试是不完整的. 测试对于创建高质量的 UI 至关重要. 在模块化系统中,微小的调整可能导致重大的回溯. 到目前为止,我们遇到了三种类型的测试

- **视觉测试** 依赖开发人员手动查看组件以验证其正确性. 它们帮助我们在构建时检查组件的外观.
- **快照测试** 使用 Storyshots 捕获组件的渲染标记. 它们可以帮助我们及时了解导致 渲染错误和警告的标记更改.
- **单元测试** 使用 Jest 验证 在给定固定输入的情况下 组件的输出保持不变. 它们非常适合测试组件的功能质量.

## "但看起来不错吗?"

不幸的是,单独的上述测试方法不足以防止 UI 错误. 用户界面很难测试,因为设计是主观的,细致入微的. 可视化测试 过于手动,快照测试在用于 UI 时 会触发太多误报,而 像素级单元测试的价值很低. 完整的 Storybook 测试策略 还包括视觉回溯测试.

## Storybook 的视觉回溯测试

视觉回溯测试旨在捕捉外观的变化. 他们通过捕获每个故事的屏幕截图,并将它们提交到 表面更改 进行比较工作. 这非常适合验证布局,颜色,大小和对比度等图形元素.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是视觉回溯测试的绝佳工具,因为每个故事本质上都是一个测试规范. 每次我们编写或更新故事时,我们都会免费获得规格!

有很多用于视觉回归测试的工具。我们推荐 [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)，一个由 Storybook 维护者提供的在并发云上运行可视化测试的免费发布服务。如 [上一章节](/intro-to-storybook/react/zh-CN/deploy/) 中所示，它也允许我们在线发布 Storybook。

## 捕获 UI 更改

视觉回溯测试 依赖于将 新呈现的 UI 代码的图像 与 基线图像 进行比较. 如果捕获到 UI 更改,则会收到通知. 通过调整背景 来了解 `Task` 组件是如何工作的:

首先为此次修改创建一个新的分支：

```shell
git checkout -b change-task-background
```

按照下面修改 `Task` 组件：

```js:title=src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
    style={{ background: 'red' }}
  />
</div>
```

这会为项目生成新的背景颜色.

![task background change](/intro-to-storybook/chromatic-task-change.png)

添加文件：

```shell
git add .
```

提交：

```shell
git commit -m "change task background to red"
```

将修改推送至远程仓库：

```shell
git push -u origin change-task-background
```

至此，打开 Github 仓库并开启一个 `change-task-background` 分支的拉取请求。

![Creating a PR in GitHub for task](/github/pull-request-background.png)

为该请求添加描述性文字并点击 `Create pull request`。点击页面底部的"🟡 UI 测试"PR 进行检查。

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

这将展示你提交的所有已捕获的 UI 修改。

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

有很多修改！`Task` 是 `TaskList` 和 `Inbox` 的子组件，这样的组件体系意味着小的调整会滚雪球为主要的回归。这就是开发者除了其他测试方法还需要视觉测试的原因。

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 查看更改

视觉回溯测试确保组件不会意外更改. 但是,您仍然需要确定更改是否是有意的.

如果有意更改,则需要更新基线,以便将来的测试与故事的最新版本进行比较. 如果改变是无意的,则需要修复.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

由于现代应用程序是 由组件构建的,因此我们在组件级别 进行测试非常重要. 这样做有助于我们找出变化的根本原因,即组件,而不是对 变化的症状,页面 和 复合组件 做出反应.

## 合并更改

当我们完成审核后,我们已准备好自信地合并 UI 更改 - 知道更新不会意外地引入错误. 如果你喜欢新的`red`背景色,然后接受更改,如果不需要恢复到以前的状态.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook 可以帮助你 **建立** 组件;测试可以帮助你 **保持** 他们. 本教程介绍了四种类型的 UI 测试,包括 可视化,快照,单元和可视化回溯测试. 您可以通过将它们添加到 CI 脚本 来自动执行最后三个. 这有助于您运输组件 而不必担心 偷渡漏洞. 整个工作流程如下所示.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
