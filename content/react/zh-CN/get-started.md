---
title: '开始吧'
tocTitle: '从头开始'
description: '在你的开发环境， 设置 React Storybook '
commit: ebe2ae2
---

# 开始吧

**Storybook**（**俗称：故事书**） 是在开发模式下，您的应用程序的好伙伴。 它可以帮助您构建 UI 组件，能把应用程序的业务逻辑和上下文分隔开来。本章节为，学习故事书的 **React** 版本; 其他现有版本为 [Vue](/vue/en/get-started) 和 [Angular](/angular/en/getstarted)。

![Storybook and your app](/storybook-relationship.jpg)

> 整个页面 -> 拿出各种组件 -> 分隔出 **每个组件** ，或把`组件组合`用来测试与文档说明

## 设置 React Storybook

我们需要按照几个步骤设置 Storybook 环境。 首先，我们想要使用[Create React App](https://github.com/facebook/create-react-app) (**CRA**) 快速设置我们的环境，并启用[Storybook](https://storybook.js.org/)和[ jest-笑话 ](https://facebook.github.io/jest/)，测试我们创建的应用。 让我们运行以下命令:

```bash
# 创建应用:
npx create-react-app taskbox
cd taskbox

# 添加 Storybook:
npx -p @storybook/cli sb init
```

我们可以快速检查,我们的应用程序的各种命令是否正常工作:

```bash
# 运行 测试引擎(Jest):
yarn test

# 启动 storybook 在端口:9009 :
yarn run storybook

# 启动 前端 页面 在端口:3000:
yarn start
```

<div class="aside">
  注意: 如果 <code>yarn test</code> 运行错误, 你可能需要安装 <code>watchman</code> ,具体问题来自 <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">这个Issue</a>。
</div>

我们的三个前端应用程序模型: 自动化测试 (Jest) ，组件开发 (Storybook) 和 应用程序本身。

![3 modalities](/app-three-modalities.png)

根据您正在处理的应用程序的哪个部分，您可能希望同时让其中一个或多个持续运行着。 由于我们目前的重点是创建单个 UI 组件，因此我们将持续运行 Storybook。

## 重用 CSS

本例子`Taskbox` 重用了 [GraphQL 和 React 教程示例应用](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858)中的设计元素，所以我们不需要在本教程中，编写 CSS。 我们只需将 LESS 编译为单个 CSS 文件， 并将其包含在我们的应用程序中。根据 **CRA**的规则，复制和粘贴[这个已编译的 CSS](https://github.com/hichroma/learnstorybook-code/blob/master/src/index.css) 进 **src/index.css** 文件。

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
如果要修改样式，在 GitHub 存储库中，有提供 源LESS文件。
</div>

## 添加资源

我们还需要添加 字体(font)和图标(icon) [文件夹](https://github.com/hichroma/learnstorybook-code/tree/master/public)到`public/`文件夹。 添加样式和静态资源(assets)后，应用程序的渲染会奇奇怪怪的。没关系，因为我们还没有开发应用程序。 现在我们开始构建我们的第一个组件!
