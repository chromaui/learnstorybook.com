---
title: '与团队一起审查'
tocTitle: '审查'
description: '视觉审查与持续集成并进'
commit: '5bbfa8c'
---

在第四章中，我们将学习专业的工作流程是如何改进设计系统来减少不一致性。本章介绍如何去收集反馈并与团队达成共识，Auth0， Shopify 和 Discovery Network 都在使用这种方法。

## 真理之源或失败之源

之前我写过一篇为何设计系统可能成为前端团队的[失败之源](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure/), 本质上，设计系统是一个依赖项， 如果您修改了设计系统中的一个组件，其相对应的应用程序都会受影响。采用版本变更的方式是一把双刃剑，它既能帮您改进设计系统，也可能为您的设计系统带来问题。

![Design system dependencies](/design-systems-for-developers/design-system-dependencies.png)

任何一个设计系统都可能存在问题，所以我们需要竭尽全力去防止问题发生。 一次小小的修改产生的问题可能会滚雪球般越来越大，最终会导致不计其数的回溯。一个没有维护策略的设计系统最终都会变成强弩之末。

> “但是他是运行在我本地的?!” – 所有人

## 在您的团队中展示您的 UI 组件

视觉检查是确认用户界面的外观和行为是否正确的一个必须流程，在您开发 UI 组件或者进行测试的时候都需要执行该流程。

大多数的开发人员应该对代码审查比较熟悉，它是从其他开发者那里收集代码质量相关反馈的一个流程。由于 UI 组件是以图形的方式表达代码，因此需要与 UI/UX 进行视觉检查来收集反馈。

### 建立一个通用的参考点

删除 node_modules、重新安装包、清除本地存储、清除本地 cookies。 如果您对这些操作很熟悉，那么您应该会很清楚让所有的团队成员保持一致的代码运行环境是一件非常难的事情。如果团队成员间没有相同的开发环境，那么就很难识别出问题究竟是源于本地环境还是其他原因。

幸运的是，作为一个前端开发，我们有一个共同的编译目标： 浏览器。聪明的团队会在线发布他们的 Storybook，这样便可以作为视觉审查的通用参考点。同时也规避了本地开发人员可能存在环境不一致的复杂性（技术支持永远的痛）。

![Review your work in the cloud](/design-systems-for-developers/design-system-visual-review.jpg)

当可以通过 URL 来访问所有现存的 UI 组件时， 干系人便可以从选择自己喜欢的浏览器去确认 UI 的外观。这意味着开发人员、设计人员和 PM 不必因为过时的引用、错误的本地环境或过期的 UI 组件而虚惊一场。

> "在每次提交之后部署 Storybook 可以使视觉审查更加容易，并且有助于产品负责人从组件的角度去思考" –Norbert de Langen, Storybook core maintainer

<h2 id="publish-storybook">发布 Storybook</h2>

我们将演示如何使用 Storybook 维护团队免费发布工具 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) 来创建一个在线视觉审查。它可以让你安全的在云端部署和托管您的 Storybook，但是我们也可以通过简单明了的[将 storybook 打包为静态网站并部署](https://storybook.js.org/docs/react/sharing/publish-storybook)在其他的服务器上。

### 获取 Chromatic

首先，打开网站： [chromatic.com](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) 并使用您的 Github 账号进行注册。

![Signing up at Chromatic](/design-systems-for-developers/chromatic-signup.png)

在这里选择您设计系统的代码仓库，与此同时，该操作将授权该网站在您的每次合并请求时添加一个检查工具。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/design-systems-for-developers/chromatic-setup-learnstorybook-design-system.mp4"
    type="video/mp4"
  />
</video>

通过 npm 安装 [chromatic](https://www.npmjs.com/package/chromatic).

```shell
yarn add --dev chromatic
```

完成安装后，运行如下命令来构建和部署您的 Storybook（您将需要 Chromatic 网站上提供给您的项目代码）

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic in the command line](/design-systems-for-developers/chromatic-manual-storybook-console-log.png)

复制链接提供的地址，并在新的浏览器窗口打开该地址来浏览您发布的 Storybook。 您将看到在线的 Storybook 和您本地开发环境下的一模一样。

![Storybook built with Chromatic](/design-systems-for-developers/chromatic-published-storybook.png)

这便可以让您的团队轻而易举地看到和您本地一模一样的 UI 组件。

![Result of our first Chromatic build](/design-systems-for-developers/chromatic-first-build.png)

恭喜您！现在您已经完了发布 Storybook 的基础架构，现在我们来演示如何去收集反馈。

### 持续集成

持续集成是目前维护 Web 应用程序的有效方法，它允许您在每次提交新代码时运行自己编写的脚本，如： 测试、分析和部署。 我们将借用这种技术来避免重复的手工工作。

在这里我们采用了在我们这种模式下免费的 GitHub Actions，它和其他 CI 提供一样的服务。

在根目录下添加一个 `.github` 的目录，然后在该目录下创建一个名为 `workflows` 的目录。

创建一个名为 `chromatic.yml` 文件，该文件将描述我们持续集成的流程。我们将循序渐进地来提高它：

```yaml:title=.github/workflows/chromatic.yml
# name of our action
name: 'Chromatic'
# the event that will trigger the action
on: push

# what the action will do
jobs:
  test:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
      #- run: yarn build-storybook
      - uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

通过命令来添加这些变更:

```shell
git add .
```

并对变更进行提交:

```shell
git commit -m "Storybook deployment with GitHub action"
```

最后通过如下命令将您的提交上传到远端代码仓库:

```shell
git push origin master
```

成功了！就在刚才我们改进了我们系统的基础能力。

## 邀请您的团队做视觉审查

与干系人一起发起视觉审查来达成共识，当您提交了一个包含了 UI 修改的 pull request 。这样便可以避免给他们“惊喜”或带来不必要的返工。

我们将在一个新的分支上演示如何做一个视觉审查

```shell
git checkout -b improve-button
```

首先，给 Button 组件做一个小小的修改。 “把它变为流行的样式” —— 我们的设计师应该会喜欢它

```js:title=src/Button.js
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

提交您的修改并把它发布到您的 Github 仓库中

```shell:clipboard=false
git commit -am “make Button pop”
git push -u origin improve-button
```

打开 Github.com 并为 `improve-button` 分支创建一个 pull request。 创建成功后，一个关于发布 Storybook 的工作也会在 CI 中自动运行。

![Created a PR in GitHub](/design-systems-for-developers/github-created-pr-actions.png)

在您当前合并请求的页面底部的任务列表中，点击 **Storybook Publish** 来浏览您新发布的 Storybook。

![Button component changed in deployed site](/design-systems-for-developers/chromatic-deployed-site-with-changed-button.png)

找到每个修改的组件和 story 并从浏览器中复制相应的 URL， 然后粘贴到项目管理员的任务表中（Github、Asana、Jira 等），这样方便整个团队成员审查相关的改动。

![GitHub PR with links to storybook](/design-systems-for-developers/github-created-pr-with-links-actions.png)

将问题分配给您的团队成员并实时关注他们的反馈

![Why?!](/design-systems-for-developers/github-visual-review-feedback.gif)

<div class="aside">在 Chromatic 的收费版本中，它也提供一个完整的 UI 审查工作流. 通过复制 Storybook 的链接到 Github 的合并请求中适用于规模较小的情况（不光适用于 Chromatic，也适用于其他可以部署您 Storybook 的服务），但是随着您使用频率的增加，你可能会考虑将它变为一个自动化的流程。</div>

在软件开发中的大多数缺陷不是源于技术，而是缺乏沟通。视觉审查可以帮助团队在开发过程中持续的收集反馈，以便于更快的交付设计系统。

![Visual review process](/design-systems-for-developers/visual-review-loop.jpg)

> 在 Shopify 的设计系统 和 Pplaris 中，每一次 pull request 都会部署一个新的 Storybook URL，这对我们来说帮助非常大。 Ben Scott, Engineer at Shopify

## 测试您的设计系统

视觉审查是非常重要的，但是手动审查数百个组件的 stories 可能需要数小时的时间。理想情况下，我们只希望看到出自本意的更改（增加/改进）并自动捕获意外的回溯。

在第五章，我们将引入测试策略去减少视觉审查中的干扰因素并保证组件的可持续维护。
