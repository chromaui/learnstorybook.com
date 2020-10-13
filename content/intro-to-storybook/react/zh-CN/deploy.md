---
title: '部署 Storybook'
tocTitle: '部署'
description: '学习如何在线部署 Storybook'
---

在本教程中,我们在开发机器上运行了 Storybook. 您可能还想与团队分享该 Storybook,尤其是非技术成员. 值得庆幸的是,在线部署 Storybook 很容易.

## 导出为静态应用程序

要部署 Storybook 我们首先需要导出一个静态 web 应用程序。这个功能已经内置到了 Storybook 中并且已经预先配置。

现在当你运行 `npm run build-storybook`，它在 `storybook-static` 目录输出一个静态的 Storybook。然后可以将其部署到任何静态站点托管服务。

## 发布 Storybook

本教程使用 <a href="https://www.chromatic.com/">Chromatic</a>，这是一个有 Storybook 维护者提供的一个免费发布托管服务。它允许我们安全可靠的部署和托管我们的 Storybook。

### GitHub 仓库设置

在我们开始前，我们本地需要与远程控制服务版本同步。在[开始吧 章节](/react/en/get-started/)中我们的项目已经初始化，Create React App (CRA) 已经为我们创建了一个本地仓库。在此阶段，我们添加文件完成第一次提交是安全的。

发出以下命令以添加并提交目前为止我们的所有修改。

```bash
$ git add .
```

其次是：

```bash
$ git commit -m "taskbox UI"
```

转到 GitHub 并设置存储库[这里](https://github.com/new)。将您的仓库命名为"taskbox"，与我们的本地项目相同。

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

在新的 repo 设置中，复制 repo 的原始 URL，并使用以下命令将其添加到 git 项目中：

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最后将本地仓库推送到 GitHub 远程仓库

```bash
$ git push -u origin master
```

### 开始 Chromatic

添加包作为开发环境依赖。

```bash
yarn add -D chromatic
```

当依赖包安装完成时，[登录 Chromatic](https://www.chromatic.com/start) 以及 Github 账号（Chromatic 仅要求一些轻量的权限）。接下来我们将创建一个新仓库命名为“taskbox”并同步到我们设置好的 Github 仓库。

点击协作者下的 `Choose GitHub repo` 并选择你的仓库。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

复制为你的项目生成的唯一 `project-token`。执行下面的命令行，构建并部署我们的 Storybook。确保将 `project-token` 替换为你项目的 `project-token`。

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

当完成后，你将得到一个链接 `https://random-uuid.chromatic.com` 到已发布的 Storybook。分享该链接到你的团队中获得反馈。

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

不错！我们通过一行命令发布了 Storybook，但是每次我们想要获得 UI 实现的反馈时都需要手动执行命令。理想的情况是，每当我们推送代码时发布组件的最新版本。我们需要不断部署 Storybook。

## 使用 Chromatic 持续部署

现在我们的项目托管在 Github 仓库，我们能够使用持续集成 CI 服务完成 Storybook 自动化部署。[GitHub Actions](https://github.com/features/actions) 是一个免费的 CI 服务，内置在 Github 中，轻松实现自动发布。

### 添加 GitHub Action 部署 Storybook

在项目根文件夹下创建一个新目录命名为 `.github` 并在其中创建另一个 `workflows` 目录。

像下面的一样，创建一个新文件命名为 `chromatic.yml`。将 `project-token` 替换为你项目的 project token。

```yaml
# .github/workflows/chromatic.yml
# name of our action
name: 'Chromatic Deployment'
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
      - uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # our project token, to see how to obtain it
          # refer to https://www.learnstorybook.com/intro-to-storybook/react/en/deploy/
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>为了简洁起见，没有提到 <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a> 。Secrets 是 Github 提供的一个安全环境变量是你不需要对 <code>project-token</code> 进行硬编码。</p></div>

### 提交 action

发出以下命令添加目前的修改：

```bash
git add .
```

接下来提交：

```bash
git commit -m "GitHub action setup"
```

最后推送到远程分支：

```bash
git push origin master
```

设置了 GitHub action 后，当推送代码时，你的 Storybook 将部署到 Chromatic 上。你可以在 Chromatic 的构建屏幕中找到所有已发布的 Storybook。

![Chromatic 用户仪表盘](/intro-to-storybook/chromatic-user-dashboard.png)

点击 latest build 它应该是顶部的版本。

接下来点击 `View Storybook` 按钮查看 Storybook 的最新版。

![Storybook 链接到 Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

<!--
And that's it, all is required is to commit and push the changes to our repository and we've successfully automated our Storybook deployment
 -->

使用链接分享给您的团队成员。作为标准应用程序开发过程的一部分，或仅用于展示工作 💅 都是有用的。
