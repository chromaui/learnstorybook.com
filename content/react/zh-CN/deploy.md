---
title: "发布 Storybook"
tocTitle: "发布"
description: "使用 GitHub 和 Netlify 发布 Storybook网站 "
---

在本教程中,我们在开发机器上运行了Storybook. 您可能还想与团队分享该 Storybook,尤其是非技术成员. 值得庆幸的是,在线部署 Storybook 很容易. 

<div class="aside">
<strong>您之前是否安装过Chromatic 测试？?</strong>
<br/>
🎉 你的故事已经部署好了！ Chromatic 在线安全地为您的故事编制索引，并在分支和提交中跟踪它们。 跳过这一章，然后转到 <a href="/react/zh-CN/conclusion">总结</a>.
</div>

## 导出为静态应用程序

要部署Storybook,我们首先需要将其导出为 静态Web应用程序. 这个功能已经内置到 Storybook中,我们只需要通过添加脚本来激活它`package.json`. 

```javascript
{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

现在当你运行`npm run build-storybook`,它会输出一个 静态的`storybook-static`目录. 

## 持续部署

我们希望在推送代码时共享最新版本的组件. 为此,我们需要不断部署Storybook. 我们将依靠 GitHub和Netlify 来部署我们的静态站点. 我们正在使用 Netlify免费计划. 

### GitHub上

首先,您要在本地目录中为项目设置Git. 如果您从上一个测试章节开始,请跳转到在 GitHub上 设置存储库. 

```bash
$ git init
```

接下来将文件添加到第一次提交. 

```bash
$ git add .
```

现在提交文件. 

```bash
$ git commit -m "taskbox UI"
```

转到GitHub并设置存储库[这里](https://github.com/new). 将您的仓库命名为"taskbox". 

![GitHub setup](/github-create-taskbox.png)

在新的repo设置中,复制repo的原始URL,并使用以下命令将其添加到git项目中: 

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最后将回购推送到GitHub

```bash
$ git push -u origin master
```

### Netlify

Netlify内置了持续部署服务,使我们无需配置自己的CI,即可部署Storybook. 

<div class="aside">
如果您在公司使用CI，请在您上传的配置中添加部署脚本 <code>storybook-static</code> 到像S3这样的静态托管服务.
</div>

[在Netlify上创建一个帐户](https://app.netlify.com/start)然后单击"创建站点". 

![Netlify create site](/netlify-create-site.png)

然后单击GitHub按钮将,Netlify连接到GitHub. 这允许它访问我们的远程 Taskbox 仓库. 

现在从选项列表中选择任务框GitHub repo. 

![Netlify connect to repo](/netlify-account-picker.png)

通过突出显示在其CI中运行的构建命令,以及输出静态站点的目录 来配置 Netlify. 对于分支选择 `master`. 目录是`storybook-static`. `yarn build-storybook`构建.

![Netlify settings](/netlify-settings.png)

提交表单以 构建和部署代码任务箱的`master`分支. 完成后,我们将在 Netlify上 看到一条确认消息,其中包含指向 Taskbox在线 Storybook 的链接. 

如果您正在跟进,您部署的 Storybook应该在线[像这样](https://clever-banach-415c03.netlify.com/).

![Netlify Storybook deploy](/netlify-storybook-deploy.png)

我们完成了 Storybook的持续部署! 现在我们可以通过链接与队友分享我们的故事. 

这有助于视觉 作为 标准应用程序开发过程的 一部分审查 或 仅仅是为了展示工作💅. 
