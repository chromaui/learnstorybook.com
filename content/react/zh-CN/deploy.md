---
title: '发布 Storybook'
tocTitle: '发布'
description: '使用 GitHub 和 Netlify 发布 Storybook网站 '
---

# 部署 Storybook

在本教程中，我们在开发机器上，运行了 Storybook。但您可能还想与团队分享该 Storybook，尤其是非技术成员。值得庆幸的是，在线部署 Storybook 很容易。

<div class="aside">
<strong>您之前是否安装过 Chromatic 测试？?</strong>
<br/>
🎉 那么，你的故事已经部署好了！ Chromatic 在线安全地为您的故事编制索引，并在分支和提交中，跟踪它们。跳过这一章，然后转到 <a href="/react/zh-CN/conclusion">总结</a>。
</div>

## 导出为静态应用程序

要部署 Storybook，我们首先需要将其，导出为静态 Web 应用程序。这个功能已经内置到 Storybook 中，我们只需要在`package.json`添加脚本，来激活它。

```javascript
{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

现在当你运行`npm run build-storybook`，它会输出一个`storybook-static`目录，里面有静态文件。

## 持续部署

我们希望在推送代码(push)时，共享最新版本的组件。为此，我们需要不断部署 Storybook。我们将依靠 GitHub 和 Netlify 来部署我们的静态站点。我们正在使用 Netlify 的免费计划。

### 上传 GitHub

首先，您要在本地目录中，为项目设置 Git。如果您从上一个测试章节开始，请跳转到 GitHub，设置存储库。

```bash
$ git init
```

接下来将文件，添加到第一次提交(commit)。

```bash
$ git add .
```

现在，提交文件。

```bash
$ git commit -m "taskbox UI"
```

上 GitHub 网站，并在[这里](https://github.com/new)设置存储库。将您的仓库命名为"taskbox"。

![GitHub setup](/github-create-taskbox.png)

在新的存储库设置中，复制存储库的原始 URL，并使用以下命令，将其添加到 git 项目中:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最后将存储库推送(push)到 GitHub。

```bash
$ git push -u origin master
```

### Netlify

Netlify 内置了持续部署服务，使我们无需配置自己的 CI，即可部署 Storybook。

<div class="aside">
如果您在公司使用 CI，请在您上传的配置中，添加部署脚本，把 <code>storybook-static</code> 上传到，像 S3 这样的静态托管服务。
</div>

[在 Netlify 上创建一个帐户](https://app.netlify.com/start)然后单击"创建站点(create site)"。

![Netlify create site](/netlify-create-site.png)

然后单击 GitHub 按钮，将 Netlify 连接到 GitHub。这允许它访问我们的远程 Taskbox 仓库。

现在从选项列表中，选择 GitHub 存储库：taskbox。

![Netlify connect to 存储库](/netlify-account-picker.png)

通过高亮显示，在其 CI 中运行的构建命令，以及输出静态站点的目录，来配置 Netlify。对于分支选择 `master`。目录是`storybook-static`。构建命令是`yarn build-storybook`。

![Netlify settings](/netlify-settings.png)

提交表单，以构建和部署 taskbox 的`master`分支代码。

完成后，我们将在 Netlify 上，看到一条确认消息，其中包含指向 taskbox Storybook 的在线链接。

如果您一路走来，您部署的 Storybook 应该[像这样](https://clever-banach-415c03.netlify.com/)。

![Netlify Storybook deploy](/netlify-storybook-deploy.png)

我们完成了 Storybook 的持续部署! 现在我们可以通过链接，与队友分享我们的故事。

这有助于将，视觉作为标准应用程序开发过程的一部分审查，或仅仅是为了展示工作 💅。
