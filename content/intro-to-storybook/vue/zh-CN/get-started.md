---
title: 'Storybook Vue 教程'
tocTitle: '开始吧'
description: '在你的开发环境下配置Storybook'
commit: '9e3165c'
---

Storybook是在开发模式下与您的应用程序一同运行的。它可以帮助您构建UI组件，并且将其与您应用程序中的业务逻辑和上下文分离开来。这份教程适用于Vue；其他的则适用于[React](/react/en/get-started)，[React Native](/react-native/en/get-started/)，[Angular](/angular/en/get-started)，[Svelte](/svelte/en/get-started)和[Ember](/ember/en/get-started)。

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## 设置 Vue Storybook

我们将会通过下述的几个步骤来设置环境。首先，我们使用[Vue CLI](https://cli.vuejs.org)来设置我们的构建系统，然后启用[Storybook](https://storybook.js.org/)和[Jest](https://facebook.github.io/jest/)来测试我们创建好的应用程序。让我们运行下述的命令：

```bash
# 创建我们的应用程序, 同时使用包含jest的preset:
npx -p @vue/cli vue create taskbox --preset chromaui/vue-preset-learnstorybook

cd taskbox

# 添加Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
在此版本的整个教程中，我们将使用<code>yarn</code>来运行大部分的命令。
如果您已经安装了Yarn，不过更希望使用<code>npm</code>，不用担心，使用<code>npm</code>依然可以保证您顺利的完成本次教程。您只需要在执行上述的第一条命令时加上<code> --packageManager=npm</code>，这样Vue CLI和Storybook将会按照您的配置进行初始化。同时在您阅读本教程时，不要忘记将对应的命令行调整成符合<code>npm</code>的格式。
</div>

通过下述的命令行我们可以快速查看应用程序中的各个环境是否正常运行：

```bash
# 在终端中运行(Jest):
yarn test:unit

# 在6006端口启用组件浏览器:
yarn storybook

# 在8080运行前端应用程序:
yarn serve
```
我们的三个前端应用程序模式：自动化测试(Jest)，组件开发(Storybook)和应用程序本身。

![3 modalities](/intro-to-storybook/app-three-modalities-vue.png)

您可以根据您目前所处理的应用程序的不同部分来决定同时运行上述三个中的一个或者多个。因为我们现在专注于创建一个简单的UI组件，所以我们继续运行Storybook。

## 重用CSS

Taskbox重用了GraphQL和React教程[应用示例](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6)中的设计元素，所以我们不需要在此教程中编写CSS。复制黏贴[这份编译好的CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css)到`src/index.css`，然后编辑`src/App.vue`中的`<style>`标签将上述CSS导入进来，结果如下：

```html
<!-- src/App.vue -->

<style>
  @import './index.css';
</style>
```

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
您可以通过<a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/style">这里</a>的LESS源文件修改样式。
</div>

## 添加资源

为了匹配预期的设计，您需要下载下述的字体和图标并将它们放在`src/assets`文件夹下。在您的终端中执行下述命令行：

```bash
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
我们使用<a href="https://github.com/Rich-Harris/degit">degit</a>从GitHub下载文件夹。您也可以从<a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">这里</a>手动下载。
</div>

我们还需要更新我们的storybook配置来启用`public`文件夹(在`package.json`中)：

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

添加完样式和资源后，应用程序可能会渲染得比较奇怪。没有关系，我们还尚未开始开发应用。现在让我们开始编写我们的第一个组件吧！

## 提交修改

当初始化我们的项目时，Vue CLI已经给我们创建了一个本地仓库。现在我们可以安全的将文件添加进第一个commit。

执行下述的命令行将我们目前为止的修改添加到commit中。

```shell
$ git add .
```

下一行：

```shell
$ git commit -m "first commit"
```

让我们创建第一个组件吧！
