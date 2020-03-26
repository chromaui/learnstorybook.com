---
title: '总结'
tocTitle: '总结'
description: '持续发展的设计系统帮您节省时间并提高效率'
---

研究数据表明重用代码可以[减少 42-81%的时间](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA) ，并且提高[40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf)的生产效率。因此便于共享“用户界面代码”的设计系统在开发人员中广泛流行也是情理之中。

在过去的几年里，Tom 和我目睹了无数的专业团队使用 Storybook 来固化他们的设计系统。他们致力于降低沟通成本、持久化构建框架并自动执行重复的手工任务。我们希望总结这些通用的知识来为您设计系统的蓬勃发展助力。

谢谢您与我们一起学习，您可以通过定于 Chroma 邮件列表来获取最新发布的文章和指南。

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/bface0?as_embed"></iframe>

## 本指南的示例代码

如果您一直遵循我们的指南来开发，您的代码仓库应该和下面的仓库一样：

- [示例设计系统仓库](https://github.com/chromaui/learnstorybook-design-system)
- [示例应用程序仓库](https://github.com/chromaui/learnstorybook-design-system-example-app)

该示例是基于 [Storybook 自己的设计系统](https://github.com/storybookjs/design-system) (SDS)，它可以为成千上万的开发者提供良好的用户体验。目前 SDS 还在持续开发过程中，我们欢迎您给我们的社区贡献代码。作为一个贡献者，您将获得关于设计系统的最佳实践和新兴技术的实际动手经验。SDS 也是 Storybook 团队演示尖端功能的地方。

## 关于我们

_针对开发人员的设计系统_ 是由 [Dominic Nguyen](https://twitter.com/domyen) 和 [Tom Coleman](https://twitter.com/tmeasday) 一起创建的。 Dominic 设计了 Storybook 的用户界面、品牌和设计系统。 Tom 是 Storybook 前端技术架构指导委员会成员，主要负责组件 Story 的格式，插件的 API 和参数的 API。

[Kyle Suss](https://github.com/kylesuss) （Storybook 设计系统的技术主管） 和 [Michael Shilman](https://twitter.com/mshilman)（Storybook Docs 插件的创始人）提供专业的技术指导。

[Chroma](https://hichroma.com/) 为我们提供的内容、代码和产品。InVision 的 [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) 慷慨的为我们提供了启动资金。我们仍然在寻求其他的赞助商来帮助我们持续维护和提出类似的新指南。更多详情请致邮：[Dominic](mailto:dom@hichroma.com)

## 拓宽视野

为了大而全的从多角度去获得整个设计系统，拓宽您的关注点是必不可少的：

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/) (book)
- [Eightshapes by Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (blog)
- [Building Design Systems by Sarrah Vesselov and Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (book)

该作者的更多文章：

- [Intro to Storybook](http://learnstorybook.com/intro-to-storybook) (guide)
- [Component-Driven Development by Tom Coleman](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) (article)
- [Why design systems are a single point of failure by Dominic Nguyen](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) (article)
- [Delightful Storybook Workflow by Dominic Nguyen](https://blog.hichroma.com/the-delightful-storybook-workflow-b322b76fd07) (article)
- [Visual Testing by Tom Coleman](https://blog.hichroma.com/visual-testing-the-pragmatic-way-to-test-uis-18c8da617ecf) (article)

## 常见问题

#### 设计系统就仅此而已吗？

设计系统包含（但不限于）设计文件、组件库、元素、文档、规范和贡献流程。本指南仅从开发者的角度去讨论设计系统，所以我们只涵盖了部分内容。具体来说，是开发设计系统中的工程细节，API 和基础结构。

#### 那么关于设计系统的管理体系呢？

管理体系是一个更加细致的话题，而且不同的组织也不尽相同，很难用九章的内容去覆盖到。

#### Storybook 是否与设计工具集成？

是到！Storybook 社区创建了易于设计工具集成的插件。例如： InVision 的 [Design System Manager](https://www.invisionapp.com/design-system-manager) 与 Storybook 集成在一起来展示 InVision 应用程序的 stories。当然还有社区为 [design tokens](https://github.com/UX-and-I/storybook-design-token)、[Sketch](https://github.com/chrisvxd/story2sketch) 和 [Figma](https://github.com/pocka/storybook-addon-designs) 创建的插件。

![Design tool integrations](/design-systems-for-developers/storybook-integrations-design.jpg)

#### 如果只有一个应用程序是否需要设计系统？

不，这可能会引发创建和维护的成本。在规模的设计生产中，一个设计系统节省的时间可能会小于创建它而耗费的时间。

#### 应用程序如何避免设计系统意外修改而带来的影响？

没有完美的东西，您的应用程序很可能会被设计系统的错误影响。通过对客户端应用的 Storybook 进行与设计系统一样的自动化测试（视觉测试或单元测试）可以一定程度上规避这种风险。这样的话，当您在一个分支上更新您的依赖项（手动或者使用像 [Dependabot](https://dependabot.com/) 这样的服务），您客户端程序的测试将会检测出从设计系统而来的修改。

![Design system updates](/design-systems-for-developers/design-system-update.png)

#### 如何对设计系统提出调整意见？

设计系统团队是一个服务团队，它帮助内部应用程序团队提高生产力，而不是直接面对终端用户。设计系统的管理人员应该负责应对其他团队提出的请求和更新目前状态。许多团队使用如 Jira、Asana 或 Trello 这样任务管理系统来追踪进度。

## 特别鸣谢

感谢非常赞的 Storybook 社区提供的宝贵建议。

Gert Hengeveld 和 Norbert de Langen (Chroma)、 Alex Wilson (T. Rowe Price)、 Jimmy Somsanith (Talend)、Dan Green-Leipciger (Wave)、 Kyle Holmberg (Acorns)、 Andrew Frankel (Salesforce)、 Fernando Carrettoni (Auth0)、 Pauline Masigla 和 Kathleen McMahon (O’Reilly Media)、 Shawn Wang (Netlify)、 Mark Dalgleish (SEEK)、 Stephan Boak (Datadog)、 Andrew Lisowski (Intuit)、 Kaelig Deloumeau-Prigent 和 Ben Scott (Shopify)、 Joshua Ogle (Hashicorp)、 Atanas Stoyanov、 Daniel Miller (Agile Six)、 Matthew Bambach (2u)、 Beau Calvez (AppDirect)、 Jesse Clark (American Family Insurance)、 Trevor Eyre (Healthwise)、 Justin Anastos (Apollo GraphQL)、 Donnie D’Amato (Compass)、 Michele Legait (PROS)、 Guilherme Morais (doDoc)、 John Crisp (Acivilate)、 Marc Jamais (SBS Australia)、 Patrick Camacho (Framer)、 Brittany Wetzel (United Airlines)、 Luke Whitmore、 Josh Thomas (Ionic)、 Ryan Williamson-Cardneau (Cisco)、 Matt Stow (Hireup)、 Mike Pitt (Zeplin)、 Jordan Pailthorpe (NextRequest)、 Jessie Wu (New York Times)、 Lee Robinson (Hy-Vee)
