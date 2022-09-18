---
title: '架构系统'
tocTitle: '架构'
description: '如何从现有的组件库中提取出设计系统'
commit: 'c9eced8'
---

在第二章，我们将从现有的组件库中提取出设计系统。在此过程中，我们需要识别出哪些组件属于设计系统，并列举出开发人员在构建设计系统的起步阶段面临的一些问题。

在大型公司中，该实践是由设计师、工程师和产品团队一起完成的。 Chromatic（Storybook 的母公司）和 Storybook 共享了一个强大的前端基础架构团队，该团队为 3+个产品及将近 800 个开源贡献者提供服务。接下来我们将概述该实践的具体流程。

## 面临的挑战

如果您是团队中的一名开发人员，您可能已经发现团队的体量越大开发效率越低。沟通缺失随着团队的体量增加而越发明显。现有的 UI 设计模式没有相应的文档或者已经很难找到。当这种情况发生时，开发人员可能需要开发新的轮子而不是开发新的功能，随着时间流逝，项目中的“一次性”代码越来越多。

即使在一支尽职尽责、经验丰富的团队，UI 组件依然被无止尽地重建或是滥用。这使得我们陷入困境。从功能和表现上来看， UI 组件的设计模式应当保持一致。而项目中每个组件就像是一片独特的雪花，这使得新加入的开发人员无法辨别出哪一个才是自己需要的，这样也会加大他们的交付难度。

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## 创建一个设计系统

设计系统将常见的 UI 组件合并到一个持续维护的组件库中，该组件库通过程序包管理的方式供外部使用。因此，开发人员只需要从该组件库中导入标准化的 UI 组件，而不用将相同的 UI 代码粘贴到多个项目中去。

大多数的设计系统都不是凭空构建起来的，而是由已经在多个项目上并且经过验证的组件组成的。我们的项目也不例外。为了节省时间并尽快的交付给干系人，我们将从现有的组件库中挑选组件来构建设计系统。

![What's in a design system](/design-systems-for-developers/design-system-contents.jpg)

## 我们把设计系统放在哪?

您可以把设计系统想像成另外一个组件库，但它并不是服务于一个程序而是服务于整个组织。设计系统应该更加关注在基础组件上（UI primitives），而项目专用的组件库则可以包含任何与该项目 UI 相关的组件（复合组件或页面中任何 UI 元素）。

因此，我们的设计系统必须独立于任何项目并不依赖任何项目。当系统中发生任何变更的时候，我们会通过包管理工具发布一个新的版本，别的项目可以通过升级软件包来获取新的更新。项目可以使用设计系统的组件并在需要时对组件进行定制。这些限制为我们提供了组织前端项目的蓝图。

![Who uses a design system](/design-systems-for-developers/design-system-consumers.jpg)

## 使用 create-react-app 和 GitHub 创建仓库

根据 [State of JS](https://stateofjs.com/) 的调查，React 是目前最受欢迎的视图层（view layer）。大量的 Storybook 都是使用 React 的，因此我们在本教程中将使用与 React 一起流行的 [create-react-app](https://github.com/facebook/create-react-app) 来创建基于 React 的设计系统。

```shell
npx create-react-app learnstorybook-design-system
```

<div class="aside">根据您的团队需求，您也可以选择使用原生 HTML/CSS 、其他视图层（Vue、Angular）、由 Svelte 编译的组件或 web components 来构建您的设计系统</div>

当我们使用 create-react-app 创建了我们的仓库后，我们可以把它发布到 GitHub 上（用 GitHub 去托管我们的设计系统）。请在 GitHub.com 上登陆您的账号并创建一个新的仓库：

![Create a GitHub repository](/design-systems-for-developers/create-github-repository.png)

然后按照 GitHub 的说明将远程服务器添加到您的 git 仓库中，并提交（到目前为止大部分为空）仓库：

```shell:clipboard:false
cd learnstorybook-design-system
git remote add origin https://github.com/chromaui/learnstorybook-design-system.git
git push -u origin master
```

请记得把 `chromaui` 替换成您的 GitHub 账号名。

![Initial commit to GitHub repository](/design-systems-for-developers/created-github-repository.png)

## 设计系统应包含什么、不包含什么

设计系统应该只包含纯 UI 组件和[可呈现的组件](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)，这些组件关乎到如何去显示 UI。 它们仅对输入的数据作出响应，不应该包含特定于应用程序的业务逻辑，也不应该和数据的加载方式有关。这些要求对于构建一个可重复使用的组件来说至关重要。

设计系统中的组件不应该是每个组件库的超集，否则就会很难追踪。

含有业务逻辑的程序特定组件不应该包含在设计系统中，因为这些受业务逻辑约束的组件将会成为其他项目使用该组件的障碍。

避免将当前未被复用过的 UI 组件加入到设计系统，即使您希望以后它能成为您设计系统的一部分，从敏捷团队的角度出发，您应该尽量避免去维护过多的代码。

## 创建一个清单

您首要的任务是创建一个清单去收集最常用的组件。这通常会涉及到对各个项目（网页）中的 UI 页面进行手动分类，然后识别出常见的 UI 模式。采用 [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/) 和 [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517) 提供的方法可以帮助您便捷地盘点您的组件，因此在本指南中我们将不再赘述。

对开发人员的启发:

- 如果一个 UI 模式被使用至少 3 次以上，您可以把它放到可复用组件库里
- 如果一个 UI 组件至少在 3 个以上的项目/团队中使用，您可以把它放入到设计系统中

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

按照该方法，我们最终得到了如下的基础组件： Avatar、 Badge、 Button、 Checkbox、 Input、 Radio、 Select、 Textarea、 Highlight (代码高亮)、 Icon、 Link 和 Tooltip 等。我们将这些模块以不同的方式去配置，并保证它可以在我们的客户端应用程序中组合出无数个特有的功能和布局。

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

将我们方才下载的组件添加到您的组件库中并且删除 Create React App 默认提供的应用程序文件。

```shell:clipboard:false
rm -rf src

svn export https://github.com/chromaui/learnstorybook-design-system/tags/download-1/src
```

<div class="aside">
<p>我们使用 <code>svn</code> (Subversion) 来从 GitHub 上下载该目录文件. 如果您没有安装 svn 或着您想手动下载该目录，您可以通过点击 <a href="https://github.com/chromaui/learnstorybook-design-system/tree/download-1/src">这里</a>来下载。</p>

<p>
为了方便代码示例，我们只选择了一部分组件来简化抽取组件库的过程。有些团队在他们的设计系统中也会加入一些自定义的第三方组件（比如：表格、表单）。</p>
</div>

接下来我们还需要更新组件所依赖的依赖项。

```shell
yarn add prop-types styled-components polished
```

<div class="aside">CSS-in-JS: 我们使用 <a href="https://www.styled-components.com">styled-components</a> 来限制组件的样式作用域。 当然您还可以通过例如：手动定位 css 或 css 模块化的方式去设置您的组件样式</div>

除了 UI 组件外，设计系统应该还包括：文字版式、颜色和间距等样式常量。在设计系统中这种命名的全局变量被称为“设计变量（design tokens）”。我们不会在本指南中深入探讨设计变量背后的理论，如果您感兴趣可以在网上找到更多的文章（推荐[好文](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)）。

下载我们的设计变量并添加到您的组件库中

```shell
svn export https://github.com/chromaui/learnstorybook-design-system/tags/download-2/src/shared src/shared
```

<div class="aside">
<p>您也可以通过点击<a href="https://github.com/chromaui/learnstorybook-design-system/tree/download-2/src/shared">这里</a>来直接下载。</p>
</div>

## 让我们开始开发吧！

我们已经定义了如何构建内容以及如何把它们组合到一起，是时候开始开发工作了！在接下来的第三章中，我们将介绍设计系统的基本工具。我们将使用 Storybook 来分类和查看原始目录和 UI 组件库。
