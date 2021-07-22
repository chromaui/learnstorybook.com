---
title: '部署Storybook'
tocTitle: '部署'
description: '学习如何部署Storybook'
commit: '809a7fd'
---

在此教程中，我们在自己的电脑上构建了组件。某些时候我们还需要和组员分享我们的工作以获得其他人的反馈。让我们部署 Storybook 让其他成员审查实现好的 UI 吧。

## 导出为一个静态应用

为了部署 Storybook 我们首先需要将其导出为一个静态 web 应用。Storybook 已经集成了此功能并已预配置完成，我们只需要将[开始吧章节](/intro-to-storybook/vue/zh-CN/get-started)中的脚本更新即可。

运行`yarn build-storybook`会在`storybook-static`目录下输出一个静态 Storybook，用于部署在任何可以托管静态网站的服务中。

## 发布 Storybook

此教程使用<a href="https://www.chromatic.com/">Chromatic</a>，一个 Storybook 团队开发的免费发布服务。它使得我们可以安全的将我们的 Storybook 部署到云端。

### 在 GitHub 中创建一个仓库

在我们开始之前，我们首先需要将本地代码和一个远程版本控制服务关联起来。在[开始吧章节](/intro-to-storybook/vue/zh-CN/get-started)中，Vue CLI 初始化时已经为我们创建了一个本地仓库。也就是说我们已经拥有了一系列可以提交到远程仓库的 commits。

进入 GitHub 然后创建一个新的仓库，[这里](https://github.com/new)。和我们的本地项目一样，命名为“taskbox”。

![设置GitHub](/intro-to-storybook/github-create-taskbox.png)

在新的仓库中，获得仓库的 URL 并执行下述命令将其应用于您的 git 项目中：

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最后，执行下述命令将本地仓库提交到远程 GitHub 仓库中：

```bash
$ git push -u origin main
```

### 使用 Chromatic

追加下述包到 development dependency 中：

```bash
yarn add -D chromatic
```

安装完成之后，使用 GitHub 账号[登录 Chromatic](https://www.chromatic.com/start)（Chromatic 只会请求很轻量级的权限）。然后我们创建一个项目名叫“taskbox”，并和我们已经设置好的 GitHub 仓库同步。

在 collaborators 下点击`Choose GitHub repo`并选择您的仓库。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

复制为您的项目所创建的唯一`project-token`。使用下述的命令来构建并部署我们的 Storybook。请确保替换`project-token`为您项目的 token。

```bash
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

执行完成后，您会收到一个已经发布的 Storybook 对应的链接`https://random-uuid.chromatic.com`。请与您的团队分享链接并获得反馈。

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

太好了！现在我们只需要一条命令就可以发布我们的 Storybook，但是每次我们需要获取团队关于 UI 的反馈时，我们都要重复的手动执行一次命令。理想情况下，我们希望每次我们提交代码时都可以同步发布最新版本的组件。也就是持续交付 Storybook。

## 使用 Chromatic 持续部署

现在我们的项目存储在 GitHub 仓库中，所以我们可以使用一个持续集成（CI）服务来帮助我们自动部署 Storybook。[GitHub Actions](https://github.com/features/actions)是一个免费的集成在 GitHub 中的 CI 服务，可以帮我们轻松实现自动发布。

### 添加一个 GitHub Action 来部署 Storybook

在我们项目的根目录下，创建一个叫做`.github`的文件夹并在其中创建另一个叫做`workflows`的文件夹。

创建一个叫`chromatic.yml`的文件，内容如下。替换`CHROMATIC_PROJECT_TOKEN`为您项目所持有的 token。

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/vue/en/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>出于文章简洁性的考虑，<a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a>并没有被提及。Secrets实际上是GitHub提供的安全相关环境变量，这样我们就不需要硬编码<code>project-token</code>了。</p></div>

### 提交 action

在命令行中输入下述命令添加我们的修改：

```bash
git add .
```

然后提交：

```bash
git commit -m "GitHub action setup"
```

最后提交到远程仓库：

```bash
git push origin main
```

当您设置完成 GitHub action 之后，每次您提交代码时，Storybook 都会被自动的部署到 Chromatic 上。您可以在 Chromatic 上查看所有已经发布的 Storybook。

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

点击最新的 build，一般是在最上方。

然后点击`View Storybook`按钮查看您最新版本的 Storybook。

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

与您的团队成员分享链接。作为标准应用开发流程中的一环，这非常有用且可以帮助您展示您的工作 💅。
