---
title: '与团队一起审查'
tocTitle: '审查'
description: '视觉审查和持续集成并进'
commit: eabed3d
---

在第四章中，我们将学习专业的工作流程是如何改进设计系统来减少不一致性。本章介绍如何去收集反馈并与团队达成共识，Auth0， Shopify 和 Discovery Network 都在使用这种方法。

## 真理之源或失败之源

之前我写过一篇为何设计系统可能成为前端团队的[失败之源](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2), 本质上，设计系统是一个依赖项， 如果你修改了设计系统中的一个组件，其相对应的应用程序都会受影响。采用版本变更的方式是一把双刃剑，它既能帮你改进设计系统，也可能为你的设计系统带来问题。

![Design system dependencies](/design-systems-for-developers/design-system-dependencies.png)

任何一个设计系统都可能存在问题，所以我们需要竭尽全力去防止问题发生。 一次小小的修改产生的问题可能会滚雪球般越来越大，最终会导致不计其数的回溯。一个没有维护策略的设计系统最终都会变成强弩之末。

## 持续集成

持续集成是目前维护 Web 应用程序的有效方法，它允许您在每次提交新代码时运行自己编写的脚本，如： 测试、分析和部署。 我们将借用这种技术来避免重复的手工工作。

在这里我们采用了在我们这种模式下免费的 CircleCI，它和其他 CI 提供一样的服务。

如果您没有 CircleCI 账号，首先你需要注册一个。 然后你将看到一个 “add projects” 的标签栏，您可以在其中设置您的设计系统。

![Adding a project on CircleCI](/design-systems-for-developers/circleci-add-project.png)

首先在您的根目录下添加一个名为 `.circleci` 的目录，并在该目录下创建一个名为 config.yml 的文件。 这样我们便可以将我们持续集成的步骤代码化。我们可以按照 Circle 给我们建议的默认配置来配置 Node 环境下的 Circle CI:

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:10.13
    working_directory: ~/repo
    steps:
      - checkout
      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-
      - run: yarn install
      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}
      - run: yarn test
```

现在你可以通过执行 create-react-app 配置的 `yarn test` 命令去运行基本的 React 测试。我们看看它在 Circle 上面的运行结果：

![First build on CircleCI](/design-systems-for-developers/circleci-first-build.png)

请注意由于我们没有定义的测试文件，所以我们的打包失败了。 但这是我们期待的行为，我们之后会添加一些测试，目前我们先进行后续流程。

> “但是他是运行在我本地的?!” – 所有人

## 在你的团队中展示您的 UI 组件

视觉检查是确认用户界面的外观和行为是否正确的一个必须流程，在您开发 UI 组件或者进行测试的时候都需要执行该流程。

大多数的开发人员应该对代码审查比较熟悉，它是从其他开发者那里收集代码质量相关反馈的一个流程。由于 UI 组件是以图形的方式表达代码，因此需要与 UI/UX 进行视觉检查来收集反馈。

#### 建立一个通用的参考点

删除 node_modules、重新安装包、清除本地存储、清除本地 cookies。 如果你对这些操作很熟悉，那么你应该会很清楚让所有的团队成员保持一致的代码运行时是一件非常难的事情。如果团队成员间没有相同的开发环境，那么就很难识别出问题究竟是源于本地环境还是其他原因。

幸运的是，作为一个前端开发，我们有一个共同的编译目标： 浏览器。聪明的团队会发布他们在线版的 Storybook，这样便可以作为视觉审查的通用参考点。这样便规避了本地开发人员可能存在环境不一致的复杂性（技术支持永远的痛）。

![Review your work in the cloud](/design-systems-for-developers/design-system-visual-review.jpg)

当可以通过 URL 来访问所有现存的 UI 组件时， 干系人便可以从选择自己喜欢的浏览器去确认 UI 的外观。这意味着开发人员、设计人员和 PM 不必因为过时的引用、错误的本地环境或过期的 UI 组件而虚惊一场。

> "在每次提交之后部署 Storybook 可以使视觉审查更加容易，并且有助于产品负责人从组件的角度去思考" –Norbert de Langen, Storybook core maintainer

#### 发布 Storybook

使用 [Netlify](http://netlify.com) 创建在线的视觉审查, Netlify 提供一个对开发人员友好的发布服务. 在我们的场景中可以免费使用 Netlify, 当然你也可以简单的使用其他的托管服务去[搭建 Storybook 静态网站并发布](https://storybook.js.org/docs/basics/exporting-storybook/)。

![Choosing GitHub on Netlify](/design-systems-for-developers/netlify-choose-provider.png)

找到我们之前在 Github 上创建的设计系统的仓库

![Choosing our repository on Netlify](/design-systems-for-developers/netlify-choose-repository.png)

在 Netlify 中输入 `stroybook-build` 以便以后每次提交后运行该命令：

![Setting up our first build on Netlify](/design-systems-for-developers/netlify-setup-build.png)

如果一切顺利，你应该可以在 Netlify 网站中看到搭建成功

![Succeeded running our first build in Netlify](/design-systems-for-developers/netlify-deployed.png)

点击链接即可查看您发布成功的 Storybook。您会发现本地的 Storybook 和在线的版本一模一样。这样您的团队便可以像您查看本地的 UI 组件一样轻松的查看实际渲染出来的 UI 组件。

![Viewing our first build in Netlify](/design-systems-for-developers/netlify-deployed-site.png)

您的 Storybook 每提交一次， Netlify 就会重新运行一次打包命令。 您会在您的 pull request 检查时可以找到指向它的链接（下面我们将会看到）。

恭喜你！现在您已经完了发布 Storybook 的基础架构，现在我们来演示如何去收集反馈。

在开始之前，我们需要先将 `storybook-static` 文件夹添加到 `.gitignore` 文件中

```
# …
storybook-static
```

然后提交您的改动

```bash
git commit -am “ignore storybook static”
```

#### 邀请您的团队做视觉审查

与干系人一起发起视觉审查来达成共识，当您提交了一个包含了 UI 修改的 pull request 。这样便可以避免给他们“惊喜”或带来不必要的返工。

我们将在一个新的分支上演示如何做一个视觉审查

```bash
git checkout -b improve-button
```

首先，给 Button 组件做一个小小的修改。 “把它变为流行的样式” - 我们的设计师应该会喜欢它

```javascript
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

提交你的修改并把它发布到你的 Github 仓库中

```bash
git commit -am “make Button pop”
git push -u origin improve-button
```

打开 Github.com 并且创建一个对 `improve-button` 分支的 pull request

![Creating a PR in GitHub](/design-systems-for-developers/github-create-pr.png)

![Created a PR in GitHub](/design-systems-for-developers/github-created-pr.png)

在合并请中找到您的 Netlify 的 URL，并检查 Button 组件

![Button component changed in deployed site](/design-systems-for-developers/netlify-deployed-site-with-changed-button.png)

找到每个修改的组件和 story 并从浏览器中复制相应的 URL 然后粘贴到项目管理员的任务表中（Github、Asana、Jira 等），这样方便整个团队成员审查相关对改动。

![GitHub PR with links to storybook](/design-systems-for-developers/github-created-pr-with-links.png)

将问题分配给你的团队成员并实时关注他们的反馈

![Why?!](/design-systems-for-developers/visual-review-feedback-github.gif)

在软件开发中的大多数缺陷不是源于技术，而是缺乏沟通。视觉审查可以帮助团队在开发过程中持续的收集反馈，以便于更快的交付设计系统。

![Visual review process](/design-systems-for-developers/visual-review-loop.jpg)

> 在 Shopify 的设计系统 和 Pplaris 中，每一次 pull request 都会部署一个新的 Storybook URL，这对我们来说帮助非常大。 Ben Scott, Engineer at Shopify

## 测试您的设计系统

视觉审查是非常重要的，但是手动审查数百个组件的 stories 可能需要数小时的时间。理想情况下，我们只希望看到有意的更改（增加/改进）并自动捕获意外的回溯。

在第五章，我们将引入测试策略去减少视觉审查中的干扰因素并保证组件的可持续维护。
