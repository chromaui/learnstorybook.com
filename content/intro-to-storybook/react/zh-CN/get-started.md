---
title: 'Storybook React 教程'
tocTitle: '开始吧'
description: '在你的开发环境下设置 Storybook'
commit: '2407c3c'
---

Storybook 是在开发模式下 与 您的应用程序一起运行的. 它可以帮助您构建 UI 组件,并与 应用程序的 业务逻辑和上下文 隔离开来. 本期"学习 Storybook"适用于 **React**; `Vue和Angular`版本即将推出.

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## 设置 React Storybook

我们将需要通过几个步骤设置环境。首先，我们需要使用[Create React App](https://github.com/facebook/create-react-app) (CRA) 来设置我们的构建系统，并开启 [Storybook](https://storybook.js.org/) 以及 [Jest](https://facebook.github.io/jest/) 在我们创建的应用程序中进行测试。 让我们运行以下命令：

```shell:clipboard=false
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx storybook init
```

<div class="aside">
在这个版本的教程中，我们将使用 <code>yarn</code> 来运行大多数命令。
如果你已经安装了 Yarn，但更偏向使用 <code>npm</code> 替代，不必担心，你仍然可以顺利完成本教程。只需要在上面的命令后添加 <code>--use-npm</code> 标志，CRA 和 Storybook 都将基于此初始化。并且在完成本教程时不要忘记调整其中的命令为 <code>npm</code> 中对应的命令。
</div>

我们可以快速检查应用程序的各种环境是否正常运行：

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
你或许已经发现了我们给 test 命令添加了 <code>--watchAll</code> 标志，这是故意的，请不用担心，这点小的改动将确保我们应用程序的所有测试用例运行并一切正常。当你在学习本套教程的过程中，将会将你介绍不同的测试场景，因此你可能会考虑为 <code>package.json</code> 中的测试脚本添加该标志以确保你的完整的测试用例能够运行。
</div>

我们的三个前端应用程序模式: 自动化测试（Jest），组件开发（Storybook）和 应用程序本身.

![3 modalities](/intro-to-storybook/app-three-modalities.png)

根据您正在处理的应用程序的哪个部分，您可能希望同时运行其中一个或多个。由于我们目前的重点是创建单个 UI 组件，因此我们将坚持运行 Storybook。

## 重用 CSS

本例子`Taskbox` 重用了 [GraphQL 和 React Tutorial 示例应用](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6)中的设计元素,所以我们不需要在本教程中编写 CSS. 我们只需将 LESS 编译为单个 CSS 文件, 并将其包含在我们的应用程序中. 复制和粘贴[这个编译的 CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css)根据 **CRA**的规则 进入 **src/index.css** 文件.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
如果要修改样式，<a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">这里</a> 提供了源LESS文件。
</div>

## 添加资源

为了匹配预期的设计，需要你下载字体及图标目录到 `src/assets` 文件夹下。在终端执行以下命令：

```shell
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
我们使用 <a href="https://github.com/Rich-Harris/degit">degit</a> 从 Github 下载文件夹。如果想要手动，可以从 <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets/">这里</a> 抓取。
</div>

添加完样式和资源后，程序会渲染出一些奇怪的效果。没有关系，我们目前不在开发该应用，我们从构建第一个组件开始！
