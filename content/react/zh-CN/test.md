---
title: '测试'
description: '了解测试。UI 组件的方法'
commit: 78a45d1
---

# 测试 UI 组件

没有测试的 Storybook 教程是不完整的。 测试对于创建高质量的 UI 至关重要。 在模块化系统中，微小的调整可能导致重大的回退。 到目前为止，我们遇到了三种类型的测试

- **视觉测试** 依赖开发人员手动查看组件，以验证其正确性。 它们帮助我们在构建时，检查组件的外观。
- **快照测试** 使用 Storyshots 捕获组件的渲染标记。它们可以帮助我们及时了解，导致渲染错误和警告的标记语言更改。
- **单元测试** 使用 Jest 验证，在给定固定输入的情况下，组件的输出保持不变。 它们非常适合测试组件的函数质量。

## "但是它看起来对吗?"

不幸的是，单独的上述测试方法，不足以防止 UI 错误。用户界面很难测试，因为设计是主观的，细致入微的。 视觉测试过于手动，快照测试在用于 UI 时，会触发太多误报，而像素级单元测试的价值很低。 完整的 Storybook 测试策略，还包括视觉回归测试。

## Storybook 的视觉回归测试

视觉回归测试旨在捕捉外观的变化。他们通过捕获每个故事的屏幕截图，观察表面变化 ，进行一个 commit 对一个 commit 的比较工作。 这非常适合验证布局，颜色，大小和对比度等图形元素。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是视觉回归测试的绝佳工具，因为每个故事本质上都是一个测试规范。每次我们编写或更新故事时，我们都会免费获得一个规范!

有许多用于视觉回归测试的工具。对于专业团队，我们建议[**Chromatic**](https://www.chromaticqa.com/)，由 Storybook 维护者制作的插件，在云中，运行测试。

## 设置视觉回归测试

Chromatic 是一个无障碍的 Storybook 插件，用于在云中进行视觉回归测试和审查。由于它是付费服务 (免费试用) ，因此可能并非适合所有人。 但是，Chromatic 是视觉测试生产的工作流程的一个好例子，我们提供免费试用。 我们来看一下。

### 让 git 跟上

Create React App 会为你的项目，初始为一个 git 存储库；让我们看看，我们现有的更改:

```bash
$ git add -A
```

现在提交文件。

```bash
$ git commit -m "taskbox UI"
```

### 获得 Chromatic

将包，添加为依赖项。

```bash
yarn add storybook-chromatic
```

导入 Chromatic 到你的`.storybook/config.js`文件。

```javascript
import {configure} from '@storybook/react';
import requireContext from 'require-context.macro';
import 'react-chromatic/storybook-addon';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

然后[登录 Chromatic](https://chromaticqa.com/start)使用您的 GitHub 帐户 (Chromatic 仅要求轻量级权限)。 创建名为"taskbox"的项目，并复制您的唯一项目 ID`app-code`。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

在命令行中，运行 test 命令 以设置 Storybook 的视觉回归测试。 不要忘记添加您的唯一应用代码，来代替`<app-code>`。

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

<div class="aside">
<code>--do-not-start</code> 是一个选项，告诉 Chromatic 不要启动故事书。 如果您已经运行了故事书，请使用此选项。 如果没有会省略 <code>--do-not-start</code>。
</div>

第一次测试完成后， 我们会为每个故事提供测试基准。 换句话说，每个故事的屏幕截图，都被称为"good"。 这些故事的未来变化，将与基线进行比较。

![Chromatic baselines](/chromatic-baselines.png)

## 捕获一个 UI 更改

视觉回归测试，依赖于将新渲染的 UI 代码的图像， 与基线图像进行比较。如果捕获到 UI 更改，则会收到通知。通过调整`Task`组件的背景，来了解它是如何工作的:

![code change](/chromatic-change-to-task-component.png)

这会为项目，生成新的背景颜色.

![task background change](/chromatic-task-change.png)

使用之前的 test 命令，运行另一个 Chromatic 测试.

```bash
./node_modules/.bin/chromatic test --app-code=<app-code>
```

点击链接，您将看到更改的网络用户界面。

![UI changes in Chromatic](/chromatic-catch-changes.png)

有很多变化! 组件层次结构表明，`Task`是`TaskList`的孩子，和`Inbox`意味着一个小小的调整，滚雪球成为大的变化。这种情况，正是开发人员除了其他测试方法之外，还需要视觉回归测试的原因.

![UI minor tweaks major regressions](/minor-major-regressions.gif)

## 查看更改

视觉回归测试确保组件不会意外更改。但是，您仍然需要确定，更改是否是有意的.

如果有意更改，则需要更新基线，以便将来的测试与故事的最新版本，进行比较。如果改变是无意的，则需要修复.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

由于现代应用程序是由组件构建的，因此我们在组件级别，进行测试非常重要。这样做有助于我们找出变化的根本原因，即组件，而不是对一个更改，页面或是复合组件做出反应。

## 合并更改

当我们完成审核后，我们自信已准备好，合并 UI 更改 - 知道更新，不会意外地引入错误。如果你喜欢新的`papayawhip`背景色，然后接受更改，如果不喜欢，需要恢复到以前的状态。

![Changes ready to be merged](/chromatic-review-finished.png)

Storybook 可以帮助你 **建立** 组件；测试可以帮助你 **保养** 他们。本教程介绍了四种类型的 UI 测试，包括 视觉(可视化)，快照，单元和视觉回归测试。您可以通过，将它们添加到 CI 脚本 ，来自动执行最后三个。这有助于您'运输'组件，而不必担心 bug 偷渡。整个工作流程如下所示.

![Visual regression testing workflow](/cdd-review-workflow.png)
