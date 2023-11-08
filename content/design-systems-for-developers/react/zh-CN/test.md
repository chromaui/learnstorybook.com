---
title: '通过测试来保证质量'
tocTitle: '测试'
description: '如何测试设计系统的界面、功能和无障碍访问'
commit: '5f69e5c'
---

在第五章，我们将通过自动化脚本来测试设计系统以规避 UI 问题。本章将会深入讨论 UI 组件有哪些属性值得去测试以及如何避免潜在的问题。我们通过研究 Wave、BCC 和 Salesforce 这样的专业团队去寻求在高覆盖范围、低设置难度和低维护成本间之间找到一个平衡点。

<img src="/design-systems-for-developers/ui-component.png" width="250">

## UI 组件的测试基础

在开始之前，我们需要先搞清楚什么样的测试是合理的。设计系统是由 UI 组件组成的，每个 UI 组件都有自己的 stories, 这些 stories 描述了在不同输入值的情况下组件预期的外观是什么样子。然后 Stories 通过浏览器或者其他设备呈现给终端用户。

![Component states are combinatorial](/design-systems-for-developers/component-test-cases.png)

哇！如您所见，一个组件包含很多的状态。将每个组件的状态乘以在设计系统中组件的数量您就会发现持续关注每个组件是一项不可能完成的任务。实际上，手工审查每个元素的每一个状态不是长久之道，尤其当设计系统越来越庞大。

**现在**我们更需要设置自动测试来节约**以后**的工作时间。

## 测前须知

在 [之前的文章](https://storybook.js.org/blog/ui-testing-playbook/) 中，我们调查了 10 个参与专业 Storybook 工作流程的前端团队。 他们认为开发故事是一种最佳实践，可以使测试变得简单而全面。

**清楚地将组件支持的状态**表达为 stories 可以阐明不同的输入组合所对应的组件状态，尽可能去忽略不支持的状态来降低干扰。

使用**一致性的渲染**原则来避免由随机（Math.random）或相对输入（Date.now）而带来的不确定性。

> “最好的 stories 应让您可视化您可以体验到的所有的组件状态” – Tim Hingston, Tech lead at Apollo GraphQL

## 用视觉测试来测试组件外观

设计系统包含了可展示的 UI 组件，这些组件基本上都是可视的。视觉测试验证了渲染后的 UI 组件的视觉效果。

视觉测试会在一个保持一致的浏览器环境下对每个 UI 组件截图。新的截图将会自动与之前的基准截图进行对比，如果在视觉上有任何不同，您将会被告知。

![Visual test components](/design-systems-for-developers/component-visual-testing.gif)

如果您在创建现代化 UI，视觉测试可帮助您的前端开发团队节省人工审查的时间，也可以避免昂贵的 UI 回归测试。我们将使用 Storybook 维护者提供的工业级服务 Chromatic 来演示视觉测试。

在 <a href="https://www.learnstorybook.com/design-systems-for-developers/react/zh-cn/review/#publish-storybook">之前的章节</a> 我们学习到如何使用 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) 去发布一个 Storybook。 我们为 `Button` 组件添加了一个红色边框并向同事来寻求反馈。

![Button red border](/design-systems-for-developers/chromatic-button-border-change.png)

现在我们使用 Chromatic 内置的工具 [testing tools](https://www.chromatic.com/features/test/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) 来看看视觉测试是如何工作的。当合并请求被创建的时候，Chromatic 获取到我们组件和之前组件的变化差异图。有 3 个改动被发现：

![List of checks in the pull request](/design-systems-for-developers/chromatic-list-of-checks.png)

点击 "🟡 UI Tests" 按钮来浏览它们。

![Second build in Chromatic with changes](/design-systems-for-developers/chromatic-second-build-from-pr.png)

您看！细微的调整导致大量的 UI 发生变化

审查这些变化来确定是有意（改进）或无意（bugs）而为之的。如果您同意该改动，那么对比基线则会更新为当前最新版本，这意味着之后的版本将会拿该基线来对比和识别 bug。

![Reviewing changes in Chromatic](/design-systems-for-developers/chromatic-review-changes-pr.png)

在上一章中，因为一些原因，我们的同事不喜欢红色边框的 `Button` 组件，所以我们需要拒绝修改来表明本次提交需要被撤销。

![Review deny in Chromatic](/design-systems-for-developers/chromatic-review-deny.png)

撤销这些改动并且重新提交代码来发起另一轮视觉审查。

## 用单元测试来测试功能

单元测试验证了在给定输入下 UI 代码是否能返回正确的输出值。它与组件并存来帮助您验证特定的功能。

在像 React、Vue 和 Angular 这样的视图层中任何东西都可以看作一个组件。组件封装了各种功能，从简单的按钮到精致的日期选择器。越错综复杂的组件，越是难以用视觉测试去捕获细微的差别，这就是为什么我们需要单元测试的原因。

![Unit test components](/design-systems-for-developers/component-unit-testing.gif)

例如当与生成系统链接的组件（ReactRouter 中的 “LinkWrappers”、 Gatsby 或 Next.js）结合时，我们的 Link 组件就会变得很复杂。一个错误的实现可能就会导致我们链接没有有效的 href 值。

从视觉层面上来看，我们是无法判断 `href` 属性是不是指向一个正确的地方，此时使用单元测试刚好可以避免该问题。

#### 用单元测试验证 hrefs

让我们为 `Link` 组件添加一个单元测试。 create-react-app 已经配置好了一个单元测试的运行环境，所以我们只需要创建一个文件 `src/Link.test.js`：

```js:title=src/Link.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = (props) => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

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

之前我们已经配置了我们的 GitHub action 来部署 Storybook。现在我们可以修改它来让它帮助我们运行测试。代码贡献者也会从中获益，我们也会对强大的 Link 组件保持信心。

```yaml:title=.github/workflows/chromatic.yml
# ... same as before
jobs:
  test:
    # the operating system it will run on
    runs-on: ubuntu-latest
    # the list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
      - run: yarn test # adds the test command
      - uses: chromaui/action@v1
        # options required to the GitHub chromatic action
        with:
          # our project token, to see how to obtain it
          # refer to https://www.learnstorybook.com/intro-to-storybook/react/en/deploy/ (update link)
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

![Successful circle build](/design-systems-for-developers/gh-action-with-test-successful-build.png)

<div class="aside"> 请注意: 过多的单元测试可能会导致更新组件变得更复杂，所以建议您在设计系统中适度的使用单元测试。</div>

> "越来越强大的自动化测试套件使我们团队更有信心的加快开发脚步" – Dan Green-Leipciger, Senior software engineer at Wave

## 无障碍访问测试

“无障碍访问意味着所有的人（包括残疾人）都可以理解、导航并与您的应用进行交互......在线[示例包括]访问内容的其他替代方案，例如使用 Tab 键和屏幕阅读器来遍历整个网站内容”。作者：[Alex Wilson from T.Rowe Price](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347).

根据[世界卫生组织](https://www.who.int/disabilities/world_report/2011/report/en/)统计，目前全球有 15%的残疾人。由于囊括了用户界面的 UI，所以设计系统对无障碍访问的影响很大。提高哪怕单个组件的可访问性就意味着整个公司的每个用到该实例的地方都会收益。

![Storybook accessibility addon](/design-systems-for-developers/storybook-accessibility-addon.png)

为相关的 UI 组件添加 Storybook 的无障碍访问插件，它是一个实时验证 Web 可访问性标准（WCAG）的工具

```shell
yarn add --dev @storybook/addon-a11y

```

在文件 `.storybook/main.js` 中添加插件:

```js:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.js'],
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

```js:title=.storybook/preview.js
import React from 'react';
import { addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';

import { GlobalStyle } from '../src/components/shared/global';

addDecorator(withA11y);
addDecorator((story) => (
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
