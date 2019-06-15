---
title: "开始吧"
tocTitle: "从头开始"
description: "在你的开发环境下, 设置 React Storybook "
commit: ebe2ae2
---

 Storybook 是在开发模式下 与 您的应用程序一起运行的. 它可以帮助您构建UI组件,并与 应用程序的 业务逻辑和上下文 隔离开来. 本期"学习 Storybook"适用于 **React**; `Vue和Angular`版本即将推出. 

![Storybook and your app](/storybook-relationship.jpg)

> 整个页面 -> 拿出各种组件 -> 分隔出 **每个组件** /`组件组合`用来测试与文档说明

## 设置React Storybook

我们需要按照几个步骤设置 Storybook 环境. 首先,我们想要使用[Create React App](https://github.com/facebook/create-react-app) (**CRA**) 快速设置我们的环境,并启用[Storybook](https://storybook.js.org/)和[ jest ](https://facebook.github.io/jest/)测试我们创建的应用. 让我们运行以下命令: 

```bash
# 创建应用:
npx create-react-app taskbox
cd taskbox

# 加入 Storybook:
npx -p @storybook/cli getstorybook
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
  注意: 如果 <code>yarn test</code> 运行错误, 你可能需要安装 <code>watchman</code> 具体问题来自 <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">这个Issue</a>.
</div>

我们的三个前端应用程序模式: 自动化测试 (Jest) ,组件开发 (Storybook) 和 应用程序本身. 

![3 modalities](/app-three-modalities.png)

根据您正在处理的应用程序的哪个部分,您可能希望同时运行其中一个或多个. 由于我们目前的重点是创建单个UI组件,因此我们将坚持运行 Storybook. 

## 重用CSS

本例子`Taskbox` 重用了 [GraphQL 和 React Tutorial示例应用](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858)中的设计元素,所以我们不需要在本教程中编写CSS. 我们只需将 LESS编译为单个CSS文件, 并将其包含在我们的应用程序中. 复制和粘贴[这个编译的CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css)根据 **CRA**的规则 进入 **src/index.css** 文件. 

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
如果要修改样式，在GitHub存储库中有提供 源LESS文件。
</div>

## 添加资源

我们还需要添加 字体和图标[文件夹](https://github.com/chromaui/learnstorybook-code/tree/master/public)到了`public/`文件夹. 添加 样式和静态资源 后,应用程序会奇奇怪怪的. 没关系. 因为我们还没有开发应用程序. 现在我们开始构建我们的第一个组件!