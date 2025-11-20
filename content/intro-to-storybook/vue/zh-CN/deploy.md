---
title: '部署Storybook'
tocTitle: '部署'
description: '学习如何线上部署Storybook'
commit: '4b1cd77'
---

在此教程中，我们在我们本地开发环境构建了组件。某些时候，我们还需要和组员分享我们的工作以获得其他人的反馈。让我们部署 Storybook 到线上，帮助同事对 UI 实现进行 review。

## 导出为一个静态应用

为了部署 Storybook 我们首先需要将其导出为一个静态 web 应用。Storybook 已经集成了此功能并进行了预配置。

运行 `yarn build-storybook` 将会在 `storybook-static` 目录下输出一个静态 Storybook，可以被部署在任何静态网站托管服务。

## 发布 Storybook

此教程使用 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)，一个 Storybook 维护者提供的免费发布服务。它使得我们可以安全的将我们的 Storybook 部署到云端。

### 在 GitHub 中创建一个仓库

在我们开始之前，我们首先需要将本地代码和一个远程版本控制服务关联起来。当我们在[开始吧章节](/intro-to-storybook/vue/zh-CN/get-started/)中构建我们的项目时，已经初始化了了一个本地仓库。在此阶段，我们已经拥有了一系列可以推送到远程仓库的 commits。

进入 GitHub 然后在[这里](https://github.com/new)创建一个新的仓库。和我们的本地项目一样，命名为“taskbox”。

![设置GitHub](/intro-to-storybook/github-create-taskbox.png)

在新的仓库中，获得仓库的 URL 并执行下述命令将其添加到您的 git 项目中：

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

最后，执行下述命令将本地仓库提交到远程 GitHub 仓库中：

```shell
git push -u origin main
```

### 使用 Chromatic

将包作为 development dependency 添加：

```shell
yarn add -D chromatic
```

安装完成之后，使用 GitHub 账号[登录 Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)（Chromatic 只会请求很轻量级的权限）。然后我们创建一个项目名叫“taskbox”，并将我们已经设置好的 GitHub 仓库同步。

在 collaborators 下点击 `Choose GitHub repo` 并选择您的仓库。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

复制为您的项目所创建的唯一 `project-token`。然后在命令行执行以下命令来构建并部署我们的 Storybook。请确保将 `project-token` 替换为您项目的 token。

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

执行完成后，您会收到一个已经发布的 Storybook 对应的链接 `https://random-uuid.chromatic.com`。请与您的团队分享链接并获得反馈。

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy.png)

太好了！现在我们只需要一条命令就可以发布我们的 Storybook，但是每次我们需要获取团队关于 UI 的反馈时，我们都要重复的手动执行一次命令。理想情况下，我们希望每次我们提交代码时都可以同步发布最新版本的组件。我们需要持续部署 Storybook。

## 使用 Chromatic 持续部署

现在我们的项目存储在 GitHub 仓库中，所以我们可以使用一个持续集成（CI）服务来帮助我们自动部署 Storybook。[GitHub Actions](https://github.com/features/actions) 是一个免费的集成在 GitHub 中的 CI 服务，可以帮我们轻松实现自动发布。

### 添加一个 GitHub Action 来部署 Storybook

在我们项目的根目录下，创建一个叫做 `.github` 的文件夹，并在其中创建另一个叫做 `workflows` 的文件夹。

如下所示创建一个叫 `chromatic.yml` 的文件：

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  chromatic:
    name: 'Run Chromatic'
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@latest
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/vue/zh-CN/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside">

、出于文章的简洁起见，[GitHub secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository) 并没有被提及。Secrets 实际上是 GitHub 提供的安全环境变量，这样我们就不需要硬编码 `project-token` 了。

</div>

### 提交 action

在命令行中输入下述命令添加我们的修改：

```shell
git add .
```

然后提交：

```shell
git commit -m "GitHub action setup"
```

最后提交到远程仓库：

```shell
git push origin main
```

当您设置完成 GitHub action 之后，每次您提交代码时，Storybook 都会被自动的部署到 Chromatic 上。您可以在 Chromatic 上查看所有已经发布的 Storybook。

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

点击最新的构建版本，一般是最上面的那个。

然后点击 `View Storybook` 按钮查看您最新版本的 Storybook。

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

与您的团队成员分享链接。作为标准应用开发流程中的一环，这非常有用且可以帮助您展示您的工作 💅。
