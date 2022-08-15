---
title: '在整个组织中发布您的 UI 组件'
tocTitle: '发布'
description: '学习如何打包并在别的应用程序中引入您的设计系统'
commit: '5911000'
---

从软件架构的角度来看，设计系统就是一个前端的依赖项。它和一些流行的依赖项（moment 或 lodash）没有什么区别。UI 组件也是代码，所以我们大可以依赖已有的前端技术来重用这些代码。

在本章我们将一起来探讨如何打包设计系统中的 UI 组件并发布给其他应用程序去引入。我们也会涵盖到使用更节省时间的技术去简化版本控制和发布。

![Propagate components to sites](/design-systems-for-developers/design-system-propagation.png)

## 打包设计系统

一个组织会有成千上万的 UI 组件散布在不同的应用程序中。之前，我们将最常用的组件提取到我们的设计系统中，现在我们需要将这些组件重新引入到应用程序中。

我们的设计系统使用 JavaScript 包管理工具（npm）来发布、版本控制和管理依赖。

有很多有效的方法可以去打包设计系统，纵观 Lonely Planet、Auth0、Salesforce、GitHub 和 Microsoft 的设计系统，我们可以了解到各种不同的方法。有些人将每个组件作为单独的软件包提供给使用者，有的则将所有的组件打包在一起。

对于新生的设计系统，最直接的方法就是发布一个封装了以下内容且版本单一的软件包：

- 🏗 通用 UI 组件
- 🎨 设计变量 (又称： 样式变量)
- 📕 文档

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## 为导出设计系统作准备

由于我们使用 create-react-app 作为我们设计系统的起点，在我们的项目中仍然残存一些脚手架自动生成的代码，我们需要先清理掉这些代码：

首先我们需要添加一个基本的 README.md:

```markdown
# The Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

然后我们需要创建一个名为 `src/index.js` 的文件作为设计系统的入口，从这个文件中我们将导出我们所有的设计变量和组件：

```javascript
//src/index.js

import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

让我们在开发环境依赖项中添加 `@babel/cli` 和 `cross-env` 这两个库来帮助我们构建发布版本：

```bash
yarn add --dev @babel/cli cross-env
```

我们需要在 `package.json` 文件中添加一些命令来帮助我们将设计系统打包到 `dist` 文件夹：

```json
{
  "scripts": {
    "build": "cross-env BABEL_ENV=production babel src -d dist",
      ...
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

现在我们可以运行 `yarn build` 命令去构建我们的代码到 `dist` 文件夹了 —— 我们也应该将 `dist` 文件夹添加到 `.gitignore` 中：

```
// ..
storybook-static
dist
```

#### 添加软件包元数据以进行发布

最终，我们需要对文件 `package.json` 做一些修改来保证使用者获得所有他们所需的信息。最简单的方法是通过运行 `yarn init` —— 一个发布软件包的初始化命令：

```bash
yarn init

yarn init v1.16.0
question name (learnstorybook-design-system):
question version (0.1.0):
question description (Learn Storybook design system):
question entry point (dist/index.js):
question repository url (https://github.com/chromaui/learnstorybook-design-system.git):
question author (Tom Coleman <tom@thesnail.org>):
question license (MIT):
question private: no
```

该命令会问一些预先设置好的问题，一些问题会提前填好答案，而另一些需要我们来给出答案。您需要在 npm 中为您的软件包起一个独一无二的名字（您不能使用 `learnstorybook-design-system` 这个名字因为它已经存在了 —— 推荐使用类似 `<your-username>-learnstorybook-design-system` 的名字）。

总而言之, 上述步骤将会用问题中输入的新值来替换 `package.json` 中原来的值:

```json
{
  "name": "learnstorybook-design-system",
  "description": "Learn Storybook design system",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/chromaui/learnstorybook-design-system.git"
  // ...
}
```

到目前为止，我们已经准备好打包我们的程序并将它首次发布到 npm!

## 使用 Auto 来做发布管理

要将打包好的包发布到 npm，我们需要经历修改变更日志、设置合理的版本号和创建 git 标签这些过程。上述步骤便于我们将该版本号链接到我们 git 仓库中的提交。为了帮助解决这些问题，我们将使用一个名为 [Auto](https://github.com/intuit/auto) 的开源工具。

让我们安装 Auto:

```bash
yarn add --dev auto
```

Auto 是一个命令行工具，它用于 release 管理相关的各种常见任务。您可以通过学习[它们的文档](https://intuit.github.io/auto/)来了解更多关于 Auto 的使用方法。

#### 获取 GitHub 和 npm 令牌

在接下来的步骤中，Auto 将访问 GitHub 和 npm，为了保证有正确的访问权限，我们需要一个私人访问令牌。您可以通过[这篇文章](https://github.com/settings/tokens)来获取 GitHub 的令牌。令牌应该只限于访问您当前的 `GitHhb 仓库`。

您可以通过访问 https://www.npmjs.com/settings/&lt;your-username&gt;/tokens 来创建一个 npm 的令牌。

该令牌需要有 “读取和发布” 的权限。

让我们在项目中的 `.env` 文件中添加令牌信息：

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

通过添加上述文件到 `.gitignore` 来保证我们不会不经意的将令牌信息发布到所有用户都可以看到的开源仓库中。需要特别注意的是，如果其他维护者需要从本地发布软件包（之后我们会将设置当提交请求被合并到主分支后会自动发布），也应该按照上述的过程去设置自己的 `.env` 文件。

```
dist
.env
```

#### 在 GitHub 中创建标签

我们要对 Auto 做的第一件事情是在 GitHub 中创建一组标签，将来我们在对软件包进行更改时将使用这些标签（请参阅下一章）来帮助 `auto` 合理的更新软件包的版本，并创建更改日志和发行说明。

```bash
yarn auto create-labels
```

如果您查看 GitHub, 现在则会看到 `auto` 推荐我们使用的一组标签：

![Set of labels created on GitHub by auto](/design-systems-for-developers/github-auto-labels.png)

我们需要在我们所有的合并提交被合并之前为他们打上以下之一的标签：`major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation`。

#### 手动使用 Auto 发布我们第一个版本

在未来，我们将使用 `auto` 通过脚本来计算新的版本号。但是在第一次发布的时候，让我们手动运行命令来理解它是如何做的。让我们来创建我们第一个修改日志条目：

```bash
yarn auto changelog
```

这将根据我们创建的每一次提交来生成一个很长的修改条目（还有一条我们一直将代码直接发布到主分支的警告，我们应该尽快停止这么做）。

自动生成改动日志也是很有用的，这样您就不会错过任何东西，而且我们也推荐手动去修改和编写成对用户更有用的消息，这样一来，用户则不用知道所有的提交内容。让我们来为第一个版本 v0.1.0 写一个简单的信息。首先撤销 Auto 刚刚创建的提交（但是保留更改）：

```bash
git reset HEAD^
```

然后我们修改更新日志并提交它：

```
# v0.1.0 (Tue Sep 03 2019)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
```

让我们添加更新日志到 git。请注意：我们需要使用 `[skip ci]` 来告诉 CI 平台忽略本次提交，否则我们将会触发构建和发布。

```bash
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

现在我们可以发布了:

```bash
npm version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish
```

并且使用 Auto 工具在 GitHub 上创建一个 release：

```bash
git push --follow-tags origin master
yarn auto release
```

赞! 我们已经成功的在 npm 中发布了我们的软件包并且在 GitHub 上创建了一个 release (祝好运!)。

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

![Release published to GitHub](/design-systems-for-developers/github-published-release.png)

（注意：虽然 `auto` 在第一次发布的时候帮我们自动生成了发布日志，我们仍然还是修改了它来保证第一个版本更加通俗易懂）

<h4>创建使用 Auto 的命令</h4>

让我们对 Auto 进行配置，保证之后我们在发布软件包的时候遵循一样的流程。我们将在 `package.json` 中添加如下代码：

```json
{
  "scripts": {
    "release": "auto shipit"
  }
}
```

现在当我们执行命令 `yarn release`, 我们将以自动化的方式逐步执行上述所有的步骤（自动生成变更日志除外）。我们需要保证所有提交到主分支的代码会被自动发布：

恭喜您！现在您已经配置好了发布您设计系统的基础设施，现在是时候将他升级为持续集成的设计系统了。

但是在开始之前，为了让我们的令牌信息更安全的存储起来，我们需要一些额外的步骤。在该场景下我们将引入 Github “密令”。

#### 设置 “密令”

在浏览器中打开您的 Github 仓库。

点击 ⚙️ Settings 页签中的 Secrets 按钮， 您将看到该页面：

![Empty GitHub secrets page](/design-systems-for-developers/github-empty-secrets-page.png)

点击 `New secret` 并填写相关的必填项，为方便和保持一致起见，请将 “密令” 的名字设置为 `NPM_TOKEN` 并将 “密令” 的值设置为之前章节中提到的 npm 令牌。

![Filled GitHub secrets form](/design-systems-for-developers/github-secrets-form-filled.png)

点击 "Add secret" 按钮将该 “密令” 添加到您的仓库中。

![npm token in GitHub](/design-systems-for-developers/gh-npm-token-added.png)

成功了！我们通过安全的方式将我们的令牌存储起来了， 现在我们可以添加一个新的 Github action 来帮助我们发布我们自己的设计系统当我们每一次的合并请求被合并到主分支后。

## 使用 GitHub actions 来自动发布

在与之前提到的<a href="https://www.learnstorybook.com/design-systems-for-developers/react/en/review/#publish-storybook">发布 Storybook</a>章节的相同文件夹下， 我们可以添加一个名为 `push.yml` 的 Github action 文件：

```yml
# .github/workflows/push.yml
## name of our action
name: Release
# the event that will trigger the action
on:
  push:
    branches: [master]
# what the action will do
jobs:
  release:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # this check needs to be in place to prevent a publish loop with auto and github actions
    if: "!contains(github.event.head_commit.message, 'ci skip') && !contains(github.event.head_commit.message, 'skip ci')"
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v2
      - name: Prepare repository
        run: git fetch --unshallow --tags
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Cache node modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: yarn-deps-${{ hashFiles('yarn.lock') }}
          restore-keys: |
            yarn-deps-${{ hashFiles('yarn.lock') }}
      - name: Create Release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
        run: |
          yarn install --frozen-lockfile
          yarn build
          yarn release
```

别忘了我们也需要将 npm 令牌添加至我们的项目中。

![Setting secrets in GitHub](/design-systems-for-developers/gh-npm-token-added.png)

<div class="aside"><p>为简洁起见，我们没有提到<a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub “密令”</a>。 “密令” 是 Github 提供的一个安全访问环境变量的方式，因此我们不需要将任何敏感信息硬编码到代码中。</p></div>

现在每当您合并一个 pull request 到主分支，它将自动发布一个新的版本，并且根据您添加的标签适当增加版本号。

<div class="aside">我们并没有涵盖 Auto 很多对持续增长的设计系统有用的功能。阅读<a href="https://github.com/intuit/auto">此文档</a>了解更多。</div>

![Import the design system](/design-systems-for-developers/design-system-import.png)

## 在一个应用程序中导入设计系统

现在我们的设计系统已经在线运行，安装依赖项并开始使用它将会变得非常简单。

#### 获取示例应用

在本教程前面的部分，我们标准化了一个流行的技术框架（React 和 styled-components），这意味着为了充分利用设计系统，我们的示例应用程序也必须使用 React 和 styled-components。

<div class="aside">其他的方法如 Svelte 和 web components 也许允许您采用与框架无关的 UI 组件。 但是，他们相对较新、文档不足或者缺乏广泛使用。因此本指南中未包含这些部分。</div>

该示例应用程序采用 Storybook 去简化[组件驱动开发](https://blog.hichroma.com/component-driven-development-ce1109d56c8e)（一种软件开发方法，采用自下而上的方式，先构建组件再构建页面）。在演示过程中，我们将运行两个 Storybook，一个用于示例应用程序，另一个用于设计系统。

从 GitHub 上克隆示例应用程序的代码仓库到本地：

```bash
git clone https://github.com/chromaui/learnstorybook-design-system-example-app.git
```

安装依赖项并且启动程序的 Storybook：

```bash
yarn install
yarn storybook
```

您应该可以看到 Storybook 中包含了应用程序使用的简单组件的 stories：

![Initial storybook for example app](/design-systems-for-developers/example-app-starting-storybook.png)

<h4>集成设计系统</h4>

将您发布的设计系统添加为依赖项：

```bash
yarn add <your-username>-learnstorybook-design-system
```

现在，让我们更新示例程序的 `.storybook/main.js` 文件来引入设计系统的组件：

```javascript
// .storybook/main.js

module.exports = {
  stories: [
    '../src/**/*.stories.js',
    '../node_modules/<your-username>-learnstorybook-design-system/dist/**/*.stories.(js|mdx)',
  ],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
  ],
};
```

同样的我们可以在新配置文件 `.storybook/preview.js` 中添加全局修饰器来使用设计系统定义的全局样式。在文件中做如下修改：

```javascript
// .storybook/preview.js

import React from 'react';
import { addDecorator } from '@storybook/react';
import { global as designSystemGlobal } from '<your-username>-learnstorybook-design-system';

const { GlobalStyle } = designSystemGlobal;

addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

![Example app storybook with design system stories](/design-systems-for-developers/example-app-storybook-with-design-system-stories.png)

现在在您的开发过程中，您将可以通过浏览器去浏览您的设计系统和文档。在开发功能的过程中展示设计系统会增加开发人员重用现有组件的可能性，而不是浪费时间开发自己组件。

另外，如果您之前已经在 <a href="https://www.learnstorybook.com/design-systems-for-developers/react/en/review/#publish-storybook">Chromatic</a> 中部署了您的设计系统（请参阅第四章），您可以在线浏览您设计系统的 Storybook。

我们将在示例应用程序的 UserItem 组件中使用设计系统中的 Avatar 组件。UserItem 应该渲染包含用户名和头像的信息。

在您的编辑器中打开 UserItem.js 文件，另外，当您更改了代码之后，热加载模块可以保证您在 Storybook 的边栏中的 UserItem 中立即查看到更新后的界面。

引入 Avatar 组件：

```javascript
// src/components/UserItem.js

import { Avatar } from '<your-username>-learnstorybook-design-system';
```

我们要在用户名的旁边显示头像：

```javascript
//src/components/UserItem.js

import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
    <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

保存之后，UserItem 组件将会在 Storybook 中更新并显示新的 Avatar 组件。因为 UserItem 组件是 UserList 组件的一部分，所以您也将在 UserList 组件中看到 Avatar 组件。

![Example app using the Design System](/design-systems-for-developers/example-app-storybook-using-design-system.png)

现在您可以看到它了！ 您刚刚成功到将设计系统组件导入到示例应用程序中。每当您在设计系统中发布 Avatar 组件的新版本时，如果您更新程序包，新版本也将反映在您的示例应用程序中。

![Distribute design systems](/design-systems-for-developers/design-system-propagation-storybook.png)

## 掌握设计系统的工作流程

设计系统的工作流程始于在 Storybook 中开发 UI 组件，终于发布给客户端的应用程序。然而这并不是全部，设计系统必须不断进步来满足不断变化的产品需求。我们的工作才刚刚开始。

第八章详述了本指南中我们创建的端到端设计系统的工作流程，我们将看到 UI 的变化如何从设计系统开始向外扩散。
