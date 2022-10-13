---
title: '创建 UI 组件'
tocTitle: '创建'
description: '使用 Storybook 来创建和分类您设计系统中的组件'
commit: 'dc246ee'
---

在第三章中，我们将使用最受欢迎的组件资源管理器 Storybook 来创建我们的设计系统。 本指南目的是向您展示专业团队如何构建他们的设计系统。和他们一样，我们也会详细关注：代码整洁、帮助节省时间的 Storybook 插件和目录结构。

![Where Storybook fits in](/design-systems-for-developers/design-system-framework-storybook.jpg)

## 代码格式和代码整洁

设计系统是需要协作的，所以使用工具来修复错误语法、标准化代码格式对于提高文档质量至关重要。而且使用工具去管理代码一致性的工作量远远小于手动管理代码，因此这对于设计系统的开发者来说是一个非常明智的选择。

在本指南中，我们将使用 VSCode 作为我们的编辑器，您同样可以使用 Atom、Sublime 或者 Intellij。

如果我们将 Prettier 添加到我们的项目中并且正确的配置了编辑器，那么 Prettier 会保证我们所有人的代码格式一致。

```shell
yarn add --dev prettier
```

如果您是第一次使用 Prettier， 你可能需要设置您的编辑器。在 VSCode 中，安装 Prettier 的插件：

![Prettier addon for VSCode](/design-systems-for-developers/prettier-addon.png)

启用保存时自动格式化 `editor.formatOnSave` 如果您之前是禁用的。 当你安装完 Prettier 后，每当你保存修改时你就会发现你的代码会被自动格式化。

## 安装 Storybook

Storybook [组件资源管理器](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) 是用于独立开发 UI 组件的行业标准。由于设计系统专注于 UI 组件，因此使用 Storybook 在此场景下是非常合适的。我们将使用以下功能：

- 📕 对 UI 组件进行分类
- 📄 将所有组件转换成 stories
- ⚡️ 开发提升开发体验的工具，如模块热替换
- 🛠 支持包含 React 在内的各种视图层框架

安装并运行 Storybook

```shell:clipboard=false
# Installs Storybook
npx storybook init

# Starts Storybook in development mode
yarn storybook
```

安装完成后您应该可以看到下图:

![Initial Storybook UI](/design-systems-for-developers/storybook-initial.png)

赞，我们已经设置好了组件资源浏览器！

您的 Storybook 应该重新加载成下图的样子（请注意，字体的样式可能会有一些偏差，参照："Initials"。译者注：字体和示例中的不一样）

![Initial set of stories](/design-systems-for-developers/storybook-initial-stories.png)

#### 添加全局样式

我们的设计系统需要一些全局样式（CSS 样式重载） 应用于整个文档以保证组件可以被正常的显示出来。您可以通过全局通用标签的形式轻易的添加全局样式。在该文件中 `src/shared/global.js` 调整您的全局样式：

```js:title=src/shared/global.js
import { createGlobalStyle, css } from 'styled-components';
import { color, typography } from './styles';

export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* same as before */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }
`;
```

为了在 Storybook 的组件中使用 `GlobalStyle`，我们可以使用修饰器（一个组件的封装）。如果在一个应用程序中，我们需要将该样式放在顶层组件中，在 Storybook 中我们可以通过修改预配置文件 `.storybook/preview.js` 来封装所有的组件。

```js:title=.storybook/preview.js
import React from 'react';
import { addDecorator } from '@storybook/react';
import { GlobalStyle } from '../src/shared/global';

addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

修饰器将会确保无论你选择哪一个 story 的时候 `GlobalStyle` 都能被提前渲染。

<div class="aside">在修饰器的代码中，<code><></code> 并不是一个拼写错误的符号  -- 它是一个 <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> 我们可以使用它来避免给我们输出的 HTML 额外添加不必要的标签</div>

#### 添加字体标签

我们的设计系统也需要将 Nunito Sans 字体加载到应用程序中。实现此目标的方式取决于我们采用怎样的应用程序框架（详情可阅读[此篇文章](https://github.com/storybookjs/design-system#font-loading))，但是在 Storybook 中最简单的实现方式是在配置文件 `.storybook/preview-head.html` 中添加一个 `<link>` 标签：

```html:title=.storybook/preview-head.html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900">
```

您的 Storybook 应该看起来像下图一样。由于我们添加了字体样式，您应该可以发现此时的 “T” 变为 sans-serif 的字体。

![Storybook with global styles loaded](/design-systems-for-developers/storybook-global-styles.png)

## 使用插件来增强 Storybook

Storybook 的插件是由一个庞大的社区生态系统来共同维护的。对于务实的开发人员而言，使用生态系统帮我们构建的工作流要比自己创建一个更加容易。（自己创建往往比较费时）

<h4>用于验证交互的 Actions 插件</h4>

当您与 Button 或 Link 之类的交互式组件进行交互时，[actions 插件](https://github.com/storybookjs/storybook/tree/next/code/addons/actions) 可以在 Storybook 中为您的组件提供 UI 反馈。默认情况下，Actions 应该已经安装在您的 Storybook 中了，您只需要将 “action” 作为回调传给您的组件即可。

让我们看看如何在 Button 组件中使用它，该 Button 组件接受一个封装的组件来响应它的点击事件。我们的 story 给封装组件的 click 事件上传入了 action 回调：

```js:title:src/components/Button.stories.js
import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
return <CustomButton onClick={action('button action click')} {...props} />;
}

export const buttonWrapper = () => (
<Button ButtonWrapper={ButtonWrapper} appearance="primary">
// … etc ..
)
```

![Using the actions addon](/design-systems-for-developers/storybook-addon-actions.gif)

#### 通过 Source 去查看和复制代码

当您浏览一个 story 时，您常常希望查看该 story 的源代码以了解其工作原理并将其粘贴到您的项目中。Storysource 插件在插件面板中为您显示了当前您所选 story 的源代码。

```shell
yarn add --dev  @storybook/addon-storysource
```

在配置文件 `.storybook/main.js` 中加载插件:

```js:title=.storybook/main.js
//.storybook/main.js

module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
  ],
};
```

Storybook 的 storysource 如下图所示：

![The Storysource addon](/design-systems-for-developers/storybook-addon-storysource.png)

<h4>使用 Knobs 插件测试组件交互性</h4>

在 Storybook UI 中， [knobs 插件](https://github.com/storybookjs/addon-knobs) 可以帮助您动态的与您的组件进行交互。Knobs 允许你传递不同的值给组件并在 UI 上表现出相应的变化。这可以让开发设计系统的人调整不同的值去对组件进行交互测试。而且它也让使用设计系统的人在集成组件到自己的项目之前就可以了解到组件的每个属性是如何去影响它的显示的。

让我们来看看如何给 `Avatar` 组件设置 knobs 插件：

```shell
yarn add --dev @storybook/addon-knobs
```

将插件添加到 `.storybook/main.js`:

```js:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
  ],
};
```

在文件 `src/Avatar.stories.js` 中添加一个使用 knobs 插件的组件:

```js:title=src/Avatar.stories.js
import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

// …

export const knobs = () => (
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
);

knobs.story = {
  decorators: [withKnobs],
};
```

请注意插件面板上的 Knobs 选项，我们添加了 Size 选项，用户可以随意选择 Avatar 组件支持的尺寸： `tiny`, `small`, `medium` 和 `large`。您也可以使用 knobs 为组件的其他属性添加交互功能。

![Storybook knobs addon](/design-systems-for-developers/storybook-addon-knobs.gif)

也就是说， knobs 并不是替代 stories， knobs 是为了让你更方便的去探索您组件的边界情况。 Stories 是用来展示预期的效果。

在后面的章节中我们将提到无障碍访问相关的文档和插件。

> “Storybook 是一个强大的前端工作平台工具，它帮助团队摆脱繁杂的业务逻辑，更加的关注到设计、构建并且组织 UI 组件（甚至是整个页面）” – Brad Frost, Author of Atomic Design

## 学习如何自动维护

到目前位置，我们已经将组件加入到了 Storybook，在创建行业标准地设计系统中，我们又迈出了坚实的一步。现在正是一个将我们的代码提交到远程仓库的好时机。 接下来我们就可以思考如何去设置自动化工具以简化正在进行的维护工作。

一个设计系统，像所有的软件一样， 也需要持续改进，而难点是在于在持续发布的同时，我们仍要确保 UI 组件的外观和表现仍和之前预期的一样。

为方便协作起见，在第四章中我们将学习如何去搭建一个持续集成并且自动发布的设计系统。
