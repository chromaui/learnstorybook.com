---
title: '通过测试来保证质量'
tocTitle: '测试'
description: '如何测试设计系统的界面、功能和无障碍访问'
commit: 5b71208
---

在第五章，我们将通过自动化脚本来测试设计系统以规避 UI 问题。本章将会深入讨论 UI 组件有哪些属性值得去测试以及如何避免潜在的问题。我们通过研究 Wave、BCC 和 Salesforce 这样的专业团队去寻求在高覆盖范围、低设置难度和低维护成本间之间找到一个平衡点。

<img src="/design-systems-for-developers/ui-component.png" width="250">

## UI 组件的测试基础

在开始之前，我们需要先搞清楚什么样的测试是合理的。设计系统是由 UI 组件组成的，每个 UI 组件都有自己的 stories, 这些 stories 描述了在不同输入值的情况下组件预期的外观是什么样子。然后 Stories 通过浏览器或者其他设备呈现给终端用户。

![Component states are combinatorial](/design-systems-for-developers/component-test-cases.png)

哇！如您所见，一个组件包含很多的状态。将每个组件的状态乘以在设计系统中组件的数量您就会发现持续关注每个组件是一项不可能完成的任务。实际上，手工审查每个元素的每一个状态不是长久之道，尤其当设计系统越来越庞大。

**现在**我们更需要设置自动测试来节约**以后**的工作时间。

## 测前须知

在[之前的文章](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) 我对 4 个涉及到专业的 Storybook 工作流程的前端团队做过调查。他们认为开发 stories 是一个最佳实践，它让测试变得容易和全面。

**清楚地将组件支持的状态**表达为 stories 可以阐明不同的输入组合所对应的组件状态，尽可能去忽略不支持的状态来降低干扰。

使用**一致性的渲染**原则来避免由随机（Math.random）或相对输入（Date.now）而带来的不确定性。

> “最好的 stories 应让您可视化您可以体验到的所有的组件状态” – Tim Hingston, Tech lead at Apollo GraphQL

## 用视觉测试来测试组件外观

设计系统包含了可展示的 UI 组件，这些组件基本上都是可视的。视觉测试验证了渲染后的 UI 组件的视觉效果。

视觉测试会在一个保持一致的浏览器环境下对每个 UI 组件截图。新的截图将会自动与之前的基准截图进行对比，如果在视觉上有任何不同，您将会被告知。

![Visual test components](/design-systems-for-developers/component-visual-testing.gif)

如果您在创建现代化 UI，视觉测试可帮助您的前端开发团队节省人工审查的时间，也可以避免昂贵的 UI 回归测试。我们将使用 Storybook 维护者提供的工业级服务 Chromatic 来演示视觉测试。

首先，通过您的 Github 在 [Chromatic.com](https://www.chromatic.com/) 上注册一个账号

![Signing up at Chromatic](/design-systems-for-developers/chromatic-signup.png)

从那里选择您目前设计系统的 Git 仓库，此时会把访问权限同步到后台以便于检查您每次的提交请求。

![Creating a project at Chromatic](/design-systems-for-developers/chromatic-create-project.png)

通过 npm 安装 [chromatic](https://www.npmjs.com/package/chromatic)

```bash
yarn add --dev chromatic
```

打开您的命令行并跳转到 `design-system` 目录。然后运行您的第一次测试来生成您视觉测试的基准截图。(您将需要使用在 Chromatic 网站中提供的应用程序代码)

```bash
npx chromatic --project-token=<project-token>
```

![Result of our first Chromatic build](/design-systems-for-developers/chromatic-first-build.png)

Chromatic 为您的每个 UI 组件生成了一个基准图片！随后每当您运行测试时都会与这些基准图片进行比较。让我们修改一个 UI 组件来看看它是如何工作的。在全局样式文件(`src/shared/styles.js`)中将字体尺寸变大。

```javascript
// …
export const typography = {
  // ...
  size: {
    s1: '13',
    // ...
  },
};
// ...
```

在此运行测试命令

```bash
npx chromatic --project-token=<project-token>
```

您看！细微的调整导致大量的 UI 发生变化

![Second build in Chromatic with changes](/design-systems-for-developers/chromatic-second-build.png)

视觉测试帮助识别出在 Storybook 中的 UI 变化，审查这些变化来确定是有意（改进）或无意（bugs）而为之的。如果您喜欢新的字体大小，那么请同意本次修改并提交到 git。抑或是这些变化也许有些过于夸张，那么您可以撤销您的改动。

让我们将视觉测添加到持续集成的过程中。打开 `.circleci/config.yml` 并添加运行测试的命令

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:10.13

    working_directory: ~/repo

    steps:
      - checkout

      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-

      - run: yarn install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      - run: yarn test
      - run: yarn chromatic --project-token=<project-token> --exit-zero-on-changes
```

保存并运行 `git commit`。 恭喜您刚刚已经在持续集成过程中成功添加了视觉测试！

## 用单元测试来测试功能

单元测试验证了在给定输入下 UI 代码是否能返回正确的输出值。它与组件并存来帮助您验证特定的功能。

在像 React、Vue 和 Angular 这样的视图层中任何东西都可以看作一个组件。组件封装了各种功能，从简单的按钮到精致的日期选择器。越错综复杂的组件，越是难以用视觉测试去捕获细微的差别，这就是为什么我们需要单元测试的原因。

![Unit test components](/design-systems-for-developers/component-unit-testing.gif)

例如当与生成系统链接的组件（ReactRouter 中的 “LinkWrappers”、 Gatsby 或 Next.js）结合时，我们的 Link 组件就会变得很复杂。一个错误的实现可能就会导致我们链接没有有效的 href 值。

从视觉层面上来看，我们是无法判断 `href` 属性是不是指向一个正确的地方，此时使用单元测试刚好可以避免该问题。

#### 用单元测试验证 hrefs

让我们为 `Link` 组件添加一个单元测试。 create-react-app 已经配置好了一个单元测试的运行环境，所以我们只需要创建一个文件 `src/Link.test.js`：

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = props => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

it('has a href attribute when rendering with linkWrapper', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Link href="https://learnstorybook.com" LinkWrapper={LinkWrapper}>
      Link Text
    </Link>,
    div
  );

  expect(div.querySelector('a[href="https://learnstorybook.com"]')).not.toBeNull();
  expect(div.textContent).toEqual('Link Text');

  ReactDOM.unmountComponentAtNode(div);
});
```

我们可以通过执行 `yarn test` 来运行上述测试

![Running a single Jest test](/design-systems-for-developers/jest-test.png)

之前我们已经配置了我们的 Circle config.js 在每一次提交之后运行 `yarn test`。现在我们这条单元测试便可从中获益。在之后的反复修改组件时，我们也会对强大的 Link 组件保持信心。

![Successful circle build](/design-systems-for-developers/circleci-successful-build.png)

<div class="aside"> 请注意: 过多的单元测试可能会导致更新组件变得更复杂，所以建议您在设计系统中适度的使用单元测试。</div>

> "越来越强大的自动化测试套件使我们团队更有信心的加快开发脚步" – Dan Green-Leipciger, Senior software engineer at Wave

## 无障碍访问测试

“无障碍访问意味着所有的人（包括残疾人）都可以理解、导航并与您的应用进行交互......在线[示例包括]访问内容的其他替代方案，例如使用 Tab 键和屏幕阅读器来遍历整个网站内容”。作者：[Alex Wilson from T.Rowe Price](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347).

根据[世界卫生组织](https://www.who.int/disabilities/world_report/2011/report/en/)统计，目前全球有 15%的残疾人。由于囊括了用户界面的 UI，所以设计系统对无障碍访问的影响很大。提高哪怕单个组件的可访问性就意味着整个公司的每个用到该实例的地方都会收益。

![Storybook accessibility addon](/design-systems-for-developers/storybook-accessibility-addon.png)

为相关的 UI 组件添加 Storybook 的无障碍访问插件，它是一个实时验证 Web 可访问性标准（WCAG）的工具

```bash
yarn add --dev @storybook/addon-a11y

```

在文件 `.storybook/main.js` 中添加插件:

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
  ],
};
```

并且在文件 `.storybook/preview.js` 添加 `withA11y` 修饰器

```javascript
import React from 'react';
import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(withA11y);
addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));
```

当您完成安装后， “Accessibility” 页签将会出现在 Storybook 的插件面板中。

![Storybook a11y addon](/design-systems-for-developers/storybook-addon-a11y.png)

它会告诉您 DOM 元素的无障碍访问等级（违反标准或通过标准）。单击 “highlight results” 选择框便会可视化您 UI 组件不符合标准的设置。

![Storybook a11y addon with passes highlighted](/design-systems-for-developers/storybook-addon-a11y-highlighted.png)

然后我们只需遵循插件给出的关于无障碍访问的建议即可。

## 其他测试策略

矛盾的是，测试可以节省时间但也会降低维护速度。您需要自己判断做正确的“测试”，而不是“全部”测试。即使软件开发有很多测试策略，我们还是发现有一些不适合设计系统的。

#### 快照测试 (Jest)

这个技术会捕捉 UI 组件实际的输出代码，并将其与以前的版本进行比较。它并不会测试 UI 组件在浏览器中的具体表现，而是通过对比 UI 组件生成的标记代码来测试代码实现细节是否发生变化。

利用快照来对比代码差异是不可预测的，容易产生误报。在组件级别，代码快照是无法兼顾到设计变量、css 和 第三方 API 更新（网络字体， stripe 表单，Google Maps 等）等全局上的更改。实际上，开发人员往往会重新生成快照或直接忽略快照测试。

> 大多数情况下的组件快照测试只是低配版的截图测试。测试您的输出，应更加关注在内容上面而不是底层的标记代码（很容易改变！）。 – Mark Dalgliesh, Frontend infrastructure at SEEK, CSS modules creator

#### 端到端测试 (Selenium, Cypress)

端到端测试用来模拟用户的操作，它们比较适合应用在应用程序的一个流程上（比如：注册或者结账流程），功能越复杂该测试策略越有效。

设计系统大多由功能相对简单的原子组件构成，往往不需要验证用户流程，而且创建测试其实是比较耗时的，也需要经常维护。但是，在极少数情况下，端到端测试可能会帮助到组件，例如，验证复杂的 UI 组件（如：日期选择器或付款表单）。

## 使用文档推动组件的使用

由于设计系统为整个组织的干系人服务，所以不仅仅只有测试，我们需要教别人如果使用经过良好测试的 UI 组件。

在第六章，我们将学习如何通过文档来推动组件的使用，深入了解为什么说用较少的工作就能创建比较全面的文档的 Storybook Docs 插件是一个秘密武器。
