---
title: '写给利益相关者的文档'
tocTitle: '文档'
description: '通过文档推动设计系统的使用'
commit: a032b50
---

[专业的](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) [前端](https://segment.com/blog/driving-adoption-of-a-design-system/) [团队](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7) 通过采用率来衡量设计系统的成功程度。为了简化所有人的工作量，组件必须是灵活通用的，否则有什么意义呢？

在本章中，我们将创建一个设计系统的“用户手册”来帮助利益相关者在他们的应用程序中复用组件。在此过程中，我们揭示 Shopify、Microsoft、Auth0 和 英国政府使用 UI 文档的最佳实践。

![Generate docs with Storybook automatically](/design-systems-for-developers/design-system-generate-docs.jpg)

## 编写详尽的文档

很明显，文档对于 UI 协作开发非常关键，它帮助团队理解如何去使用常用的 UI 组件，但是为什么它需要很多时间去做呢？

如果你从没有创建过文档，你可能会花很多时间忙于非文档内容的部分，比如网站基础架构或和关于技术名词如何写的争论。而且，即使您有时间发布这些文档，再继续开发功能的同时去维护它也很麻烦。

**大多数文档在创建时就已经过时了**，过时的文档破坏了开发人员对设计系统的信任，所以开发人员选择创建新组建而不是重用现有组件。

## 需求

我们的文档必须通过以下几点来克服创建和维护文档的固有痛点：

- **🔄 时刻保持最新版本** 通过使用最新生产环境上的代码
- **✍️ 易于编写** 使用例如：Markdown 这样熟悉的写作工具
- **⚡️ 减少维护时间** 这样团队可以更专于写作
- **📐 提供样板** 这样开发人员不需要重写一些通用的模板
- **🎨 提供可定制** 来适用于极其复杂的用例和组件

作为 Storybook 的用户，我们具有领先优势，因为组件的各个变体已经被记录为 stories（一种文档形式）。一个 story 展示了组件不在不同输入下应该如何工作， story 利于编写，且因其引用了生产环境的组件，所以可以自动更新。并且，我们可以使用上一章重的工具对 story 进行回归测试！

> 当您编写 story 时您将免费获得组件的属性文档和使用用例 – Justin Bennett, Engineer at Artsy

## 用 story 生成文档

借助于 Storybook 的文档插件，我们可以从现有的 stories 中生成丰富的文档，它可以减少您的维护时间且默认情况下开箱即用。首先，跳转到您的设计系统根目录下，我们将安装文档插件：

```bash
yarn add --dev @storybook/addon-docs
```

在文件 `.storybook/main.js` 中添加插件:

```javascript
module.exports = {
  stories: ['../src/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    {
      name: '@storybook/addon-docs',
      options: {
        configureJSX: true,
      },
    },
  ],
};
```

您应该可以看到您的 Storybook 中有两个选项卡，"Canvas" 选项卡是您的组件开发环境，"Docs" 选项卡是您组件的文档。

![Storybook docs tab](/design-systems-for-developers/storybook-docs.png)

Storybook Docs 插件在运行时帮您的每个组件创建了一个 "Docs" 选项卡。它在您的选项卡中自动填充了常用的文档，例如预览交互式组件，源代码查看和组件属性列表。您可以在 Shopify 和 Auth0 的设计系统正找到类似的功能，所有的设置在 5 分钟内即可完成。

## 扩展文档

目前为止我们只花费了一点点力气就取得了这么大的进步，但是，文档仍然缺少一点“人情味”。我们需要为开发人员提供更多的背景信息（原因、时间和方式）。

首先添加更多的元数据来阐述组件到底是做什么的。 在文件 `src/Avatar.stories.js` 中添加一个副标题来阐述 Avatar 组件是做什么的：

```javascript
export default {
  title: 'Design System|Avatar',

  parameters: {
    component: Avatar,
    componentSubtitle: 'Displays an image that represents a user or organization',
  },
};
```

然后给 Avatar 添加 JSDoc（在文件 `src/components/Avatar.js` 中），它为该组件提供了相应的描述。

```javascript
/**
- Use an avatar for attributing actions or content to specific users.
- The user's name should always be present when using Avatar – either printed beside the avatar or in a tooltip.
**/

export function Avatar({ loading, username, src, size, ...props }) {
```

您应该可以看到下图:

![Storybook docs tab with component details](/design-systems-for-developers/storybook-docspage.png)

Storybook Docs 插件会自动生成表示组件属性类型和默认值的表格，这看起来很方便，但是这并不意味着不会有人用错 —— 很多人都可能会错用某些属性。所以我们可以在自动生成的表格中给您的每个属性添加标注。

```javascript
Avatar.propTypes = {
  /**
    Use the loading state to indicate that the data Avatar needs is still loading.
    */
  loading: PropTypes.bool,
  /**
    Avatar falls back to the user's initial when no image is provided. 
    Supply a `username` and omit `src` to see what this looks like.
    */
  username: PropTypes.string,
  /**
    The URL of the Avatar's image.
    */
  src: PropTypes.string,
  /**
    Avatar comes in four sizes. In most cases, you'll be fine with `medium`.
    */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

默认情况下，每个 Avatar story 都会被渲染在文档中，我们不能假设其他的开发人员知道每个 story 代表什么。您可以在 `src/Avatar.stories.js` 文件中为每个 story 添加一些描述文本：

```javascript
export const sizes = () => (
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
);
sizes.story = {
  parameters: { docs: { storyDescription: '4 sizes are supported.' } },
};
```

![Storybook docs tab with filled out details](/design-systems-for-developers/storybook-docspage-expanded.png)

#### 使用 Markdown/MDX 为您的文档充能

每个组件都不相同，因此对文档的要求也不同。我们使用 Storybook Docs 插件免费生成最佳实践的文档。让我们为组件添加一些补充信息，并在组件中识别一些陷阱。

Markdown 是一个格式简单的文本编辑工具，MDX 允许您在 Markdown 内部使用交互式代码（JSX）。Storybook Docs 插件使用 MDX 来帮助开发人员控制文档的最终呈现方式。

首先我们修改由插件生成默认的 Avatar 文档。如下在文件 `.storybook/main.js` 中注册 MDX。

```javascript
module.exports = {
  // automatically import all files ending in *.stories.js|mdx
  stories: ['../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
};
```

创建一个新文件 `src/Avatar.stories.mdx` 并提供一些组件详细信息。我们将删除 `Avatar.stories.js` 文件并重新使用 mdx 来创建 stories。

```javascript
import { Meta, Story } from '@storybook/addon-docs/blocks';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import { Avatar } from './Avatar';

<Meta title="Design System|Avatar" component={Avatar} />

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users. The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

<Story name="standard">
  <Avatar
    size="large"
    username="Tom Coleman"
    src="https://avatars2.githubusercontent.com/u/132554"
  />
</Story>

### Sizes

4 sizes are supported.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### Default Values

When no image is supplied to the `src` prop, Avatar displays initials. Avatar should be used sparingly in situations without access to images.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

The loading state is used when the image or username is, well, loading.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Experiment with this story with Knobs addon in Canvas mode.

<Story name="knobs" parameters={{ decorators: [withKnobs] }}>
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
</Story>
```

在 Storybook 中，您的 Avatar 组件的“docs”选项卡的内容应该被替换为 MDX 的内容。

![Storybook docs from MDX](/design-systems-for-developers/storybook-docs-mdx-initial.png)

Storybook Docs 插件随附“文档块”和现成的组件如：交互预览、属性表格等。默认情况下，他们在后端会被自动生成，他们也可以被用户单独拿来使用。我们的目标是用户可以不用重复做任何事情去自定义他们的 Avatar 文档。因此，请尽可能的重用“文档块”。

让我们来添加`属性`文档块，并将我们的原始组件封装在`预览`中

```javascript
import { Meta, Story, Props, Preview } from '@storybook/addon-docs/blocks';

# …

<Preview withToolbar>
  <Story name="standard">
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </Story>
</Preview>

<Props of={Avatar} />
```

![Storybook docs from MDX with blocks](/design-systems-for-developers/storybook-docs-mdx-docblocks.png)

赞！我们回到了起点，但是这一次我们完全自主控制并渲染我们想要的内容。我们仍然受益于自动生成文档的功能，因为我们仍然在使用“文档块”。

通过添加用例的方式自定义 Avatar 文档可以为开发者提供更多如何使用该组件的上下文。我们可以像在其他 markdown 文档中一样为组件的文档添加 markdown：

```javascript
// As before

<Props of={Avatar} />

## Usage

Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

### Sizes

// As before

```

![Storybook docs for MDX with usage info](/design-systems-for-developers/storybook-docs-mdx-usage.png)

#### 自定义页面

每一个设计系统都应该有一个封面，Storybook Docs 插件允许您使用 MDX 创建您自己的页面。

创建一个新文件 `src/components/Intro.stories.mdx`:

```javascript
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Design System|Introduction" />

# Introduction to the Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

这会独立生成一个和之前自动生成的组件文档页面不一样的纯文档页面

![Storybook docs with introduction page, unsorted](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

为了让它出现在首页，我们需要在文件 `.storybook/main.js` 文件中告诉 Storybook 去加载介绍文件：

```javascript
module.exports = {
  // automatically import all files ending in *.stories.js|mdx
  stories: ['../src/components/Intro.stories.mdx', '../src/**/*.stories.(js|mdx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-storysource',
    '@storybook/addon-knobs',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
};
```

![Storybook docs with introduction page](/design-systems-for-developers/storybook-docs-introduction.png)

## 发布在线文档

如果你创建的文档没有人去阅读又有什么用呢？光是创建一个高质量的学习文档是不够的，我们需要将文档暴露给利益相关者和同事。现在，我们的文档被埋藏在 git 仓库中，这意味着大家需要在本地运行设计系统的 Storybook 才能查看文档。

在之前的章节里，我们为了做视觉审查发布了在线版的 Storybook。我们也可以使用同样的机制去发布我们的组件文档。让我们在 `package.json` 添加一个新的脚本并用文档模式来构建我们的 Storybook：

```json
{
  "scripts": {
    "build-storybook-docs": "build-storybook -s public --docs"
  }
}
```

保存并提交，我们可以修改 Netlify 去发布我们的文档站点，或者使用其他部署系统 (例如 [now.sh](https://zeit.co/home)) 帮我们在每次发布时自动部署文档站点。

<!--
Create a second Netlify integration to run the docs build script:

![alt_text](/design-systems-for-developers/Feedback-wanted55.png)

Great. Every time you commit, you’ll now see two PR checks. One takes you to the published Storybook. The other takes you to the published Storybook Docs.

![alt_text](/design-systems-for-developers/Feedback-wanted56.png) -->

<div class="aside">伴随着设计系统的不断增长，你可能会面临到特定于组织的需求，这些要求需要使用自定义工具，甚至使用 Gatsby 或 Next 之类的工具来构建自己的静态站点。将 markdown 和 MDX 移植到其他地方的办法很简单。</div>

## 在其它应用程序中导入您的设计系统

目前位置，我们的精力全部集中在内部。首先，创建一个稳定的 UI 组件，然后对它进行审查、测试和编写文档。现在我们将视角移至外部，让我们看看从团队的角度如何去使用设计系统。

在第七章我们将介绍如何打包设计系统以便于其他应用程序使用、了解如何一起使用 Javascript 软件包管理器（npm）与节省时间的包发布工具（Auto）。
