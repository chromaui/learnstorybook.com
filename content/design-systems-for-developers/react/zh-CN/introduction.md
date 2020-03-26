---
title: '设计系统简介'
tocTitle: '简介'
description: '最新发布的设计系统工具的指南'
---

<div class="aside">本指南是为<b>专业开发人员</b>学习如何打造设计系统而量身定做的。 本指南要求学员有 JavaScript、Git 和持续集成的经验。您也需要具备关于 Storybook 的基础知识，例如：如何去写一个 story 和如何去编辑您的配置文件。(<a href="/intro-to-storybook">Storybook 学习指南</a>).
</div>

<br/>

现如今设计系统正在快速发展的阶段。无论 Airbnb 这类重量级的技术公司还是轻量的创业公司，各类组织都在尝试以复用 UI 组件的方式来节省开发时间和成本。 但是由 Airbnb、Uber 或 Microsoft 这类公司创建的设计系统与大部分开发人员创建的设计系统之间存在着巨大的差别。

为何这类巨头公司的设计团队使用自己的工具和技术去构建他们的设计系统呢？我和我的合编作者 Tom 研究了 Storybook 社区的一些成功案例来确认什么才是设计系统的最佳实践。

本指南将带领大家一步步的去揭示：如何通过自动化工具和详细的工作流去规模化的构建一个设计系统。 我们将逐步从现有的组件库组装一个设计系统，然后设置它的核心服务、库和工作流程。

![Design system overview](/design-systems-for-developers/design-system-overview.jpg)

## 设计系统究竟是什么呢？

在此之前我们先想想：可重复使用的用户界面这个概念并不新鲜。 样式指南、UI 套件和可共享的组件已经至少存在数十年了。如今设计人员和开发人员共同协作去构建整个 UI 组件。如同乐高积木一样， UI 组件封装了各类用户界面的视觉和功能模块。

目前用户界面由数百个模块化的 UI 组件组装而成， 这些 UI 组件经过重新排列来展现出不同的用户体验。

设计系统包含可重用的 UI 组件，这些组件帮助开发团队在各个项目中构造复杂、稳定和无障碍访问的用户界面。由于开发人员和设计人员都在为 UI 组件作出贡献，因此设计系统作为学科之间的桥梁，成为不同组织间通用组件的 “真理之源”。

![Design systems bridge design and development](/design-systems-for-developers/design-system-context.jpg)

设计师经常会谈论到在其使用的工具内部构建设计系统。完整的设计系统应包含 assets （Sketch、 Figma 等）、整体设计原则、设计结构、设计方案等。有大量面向设计师的指南，深入探讨了这些主题，因此我们不在这里赘述。

对于开发人员来说，有几件事情是确定的，开发一个设计系统必须包含 UI 组件和所有关于该组件背后的前端基础结构。我们将在本指南中讨论设计系统的三个部分：

- 🏗 常见的可复用组件
- 🎨 设计变量： 特定的样式变量，例如品牌的颜色和间距
- 📕 网站文档：用法说明、示例和注意事项等

构建好的组件通过包管理工具进行打包、版本化并在各个应用程序中使用。

## 您需要一个设计系统吗?

尽管对设计系统进行了大量的宣传，但是设计系统并不适用于所有场景。如果您和一个体量适中的团队一起开发一个应用，那么您最好将可复用组件放在一个目录下进行管理而不是动用大量人力去构建一个设计系统。对于小的项目而言，设计系统的维护、集成和工具使用的成本可能会远超于它为您带来的收益。

设计系统适用于在各个项目之间共享组件的场景，如果您发现您自己复制粘贴了相同的 UI 组件在不同的应用程序或者团队之间，那么这个指南是非常适合您的。

## 我们正在做的

Storybook 正在为 [Uber](https://github.com/uber-web/baseui)、 [Airbnb](https://github.com/airbnb/lunar)、 [IBM](https://www.carbondesignsystem.com/)、 [GitHub](https://primer.style/css/) 等其余百家公司提供帮助。 以下的建议是从这些最聪明的团队中的最佳实践总结而来，我们需要以下的工具帮助我们构建设计系统：

#### 创建组件

- 📚 [Storybook](http://storybook.js.org) 用于开发组件并生成文档
- ⚛️ [React](https://reactjs.org/) 用于构建以组件为中心的 UI （通过 create-react-app）
- 💅 [Styled-components](https://www.styled-components.com/) 用于限制组件样式的作用域范围
- ✨ [Prettier](https://prettier.io/) 用于自动格式化代码

#### 维护设计系统

- 🚥 [CircleCI](https://circleci.com/) 用于持续集成
- 📐 [ESLint](https://eslint.org/) 用于 Javascript 语法检查
- ✅ [Chromatic](https://chromaticqa.com) 用于捕获组件中的视觉错误 (由 Storybook 维护人员执行)
- 🃏 [Jest](https://jestjs.io/) 用于组件的单元测试
- 📦 [npm](https://npmjs.com) 用于发行组件库
- 🛠 [Auto](https://github.com/intuit/auto) 用于发布管理工作流程

#### Storybook 插件

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) 用于在开发过程中检查无障碍访问问题
- 💥 [Actions](https://github.com/storybookjs/storybook/tree/master/addons/actions) 用于检查用户点击和互动
- 🎛 [Knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs) 用于以交互式的方式预览组件
- 📝 [Storysource](https://github.com/storybookjs/storybook/tree/master/addons/storysource) 用于查看组件源代码并粘贴到您的项目中
- 📕 [Docs](https://github.com/storybookjs/storybook/tree/master/addons/docs) 用于自动生成文档

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## 了解工作流程

设计系统是对前端基础架构的投资。除了展示如何使用上述的技术之外，本指南还着重介绍了如何快速采用和简化核心工作流程。条件允许的情况下，一些手动执行的命令可以被自动化替代，以下是我们可以采取的措施：

#### 构建独立的 UI 组件

任何一个设计系统都是由组件组合而成的。我们把 Storybook 作为工作台来单独构建组件为其消费者提供服务。所以我们需要集成一些插件（如： Actions，Source，Knobs）来帮助我们节省时间和提升组件的耐用性。

#### 通过审核的方式收集反馈并达成共识

UI 开发是一项团队合作的工作，我们需要开发人员、设计师和其他参与者保持一致的认知。为了更快的发布产品，我们应该在开发过程中及时引入其他的干系人，让他们及早了解到我们正在开发的 UI 组件。

#### 用测试规避 UI 错误

设计系统既是唯一的“真理之源”，也是 UI 组件唯一的 “错误之源”。设计系统中一个小小的 UI 错误，可能会像滚雪球一样导致整个产品出现问题。我们将自动执行测试来帮助您规避不可避免的错误，并让您能放心的交付稳定、无障碍访问的 UI 组件。

#### 提早交付文档

在设计系统中，文档是必不可少的，但是开发人员往往将创建文档作为最低的优先级。我们通过 UI 组件将会为您提供自动生成最小可行的文档，极大的降低了您开发文档的难度，您也可以自行修改自动生成的文档。

#### 供其他团队使用

当您有了完备文档的 UI 组件之后，您需要将他们发布给其他的团队去使用。我们将包含打包、发布、以及如何在其他 Storybook 中展示您的设计系统。

## Storybook 设计系统

本指南的示例设计系统灵感来自于 Storybook 自己的设计系统： [产品设计系统](https://github.com/storybookjs/design-system)。 目前有三个站点在使用它，有数万名来自 Storybook 社区的开发人员在维护它。

在下一章中，我们将向您展示如何从不同的组件库中提取出设计系统。
