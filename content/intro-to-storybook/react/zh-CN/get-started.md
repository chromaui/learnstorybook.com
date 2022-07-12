---
title: 'Storybook React 教程'
tocTitle: '开始吧'
description: '在你的开发环境下设置 Storybook'
commit: 'b66f341'
---

Storybook 是在开发模式下 与 您的应用程序一起运行的. 它可以帮助您构建 UI 组件,并与 应用程序的 业务逻辑和上下文 隔离开来. 当前版本的Storybook教程是针对React的,其他版本适用于[React Native](/intro-to-storybook/react-native/en/get-started), [Vue](/intro-to-storybook/vue/en/get-started), [Angular](/intro-to-storybook/angular/en/get-started), [Svelte](/intro-to-storybook/svelte/en/get-started) 以及 [Ember](/intro-to-storybook/ember/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## 设置 React Storybook

我们将需要通过几个步骤设置环境。首先，我们需要使用[degit](https://github.com/Rich-Harris/degit)来设置我们的构建系统，使用这个软件包，你可以下载 "模板"（使用了部分默认配置所构建的应用程序）来帮助你快速跟踪你的开发工作流程。

让我们运行以下命令:

```bash
# 克隆模板
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# 安装依赖
yarn
```

<div class="aside">
💡 此模板包含此版本教程所需的样式、资产和一些基本配置
</div>


我们可以快速检查应用程序的各种环境是否正常运行：

```bash
# 在命令行中运行测试(Jest):
yarn test --watchAll

# 在6006端口启动组件资源管理器:
yarn storybook

# 在3000端口正确运行前端项目:
yarn start
```

<div class="aside">
💡 请注意测试命令中的 <code>--watchAll</code> 标志，这个标志将确保我们应用程序的所有测试用例运行并一切正常。当你在学习本套教程的过程中，将会将你介绍不同的测试场景，因此你可能会考虑为 <code>package.json</code> 中的测试脚本添加该标志以确保你的完整的测试用例能够运行。
</div>


我们的三个前端应用程序模式: 自动化测试（Jest），组件开发（Storybook）和 应用程序本身.

![3 modalities](/intro-to-storybook/app-three-modalities.png)

根据您正在处理的应用程序的哪个部分，您可能希望同时运行其中一个或多个。由于我们目前的重点是创建单个 UI 组件，因此我们将坚持运行 Storybook。



## 提交更改

在这个阶段，将我们的文件添加到本地版本库是更加安全的选择。运行下面的命令来初始化本地版本库，添加并提交我们到目前为止所做的修改。



```shell
$ git init
```

接着是:

```shell
$ git add .
```

然后:

```shell
$ git commit -m "first commit"
```

最后:

```shell
$ git branch -M main
```




让我们开始构建我们的第一个组件!
