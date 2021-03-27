---
title: '設計系統簡介'
tocTitle: '簡介'
description: '正式環境的最新設計系統工具指南'
---

<div class="aside">這篇是為了<b>專業開發者</b>學習打造設計系統的指南。建議具備相當的 JavaScript、Git 和持續整合經驗。也應該要懂 Storybook 的基礎，例如撰寫 story 和編輯設定檔（<a href="/intro-to-storybook">Storybook 入門</a>有教基礎）。
</div>

<br/>

設計系統迅速竄紅。不管是技術強權 Airbnb，還是靈敏的新創，各式各樣的組織都為了節省時間與金錢而重複使用 UI 樣式。但是，Airbnb、Uber 或 Microsoft 蓋出的設計系統，與大多數開發者的有落差。

領先的設計系統團隊，是什麼原因選用該工具和技術？我和共同作者 Tom 在 Storybook 社群為成功的設計系統其特質進行研究，找出最佳方案。

這份一步一步來的指南，說明已經具備規模且 的設計系統，所使用的自動化工具與仔細的工作流程。接下來，會仔細說明如何從既有的元件資源庫組裝為設計系統，接著設定好核心服務、資源庫和工作流程。

![Design system overview](/design-systems-for-developers/design-system-overview.jpg)

## 設計系統都在大聲什麼？

有一點要先搞清楚：可重複利用的使用者介面不是什麼新玩意。樣式指南、UI 組件和可分享的小工具早已存在數十年。今日的設計師和開發者則是向 UI 元件構造靠攏。UI 元件就是將個別使用者介面的一小部份，其視覺與功能屬性封裝起來。就像是樂高玩具。

現代的使用者介面是組裝自數以百計、模組化的 UI 元件，經過重新排列，傳遞各式各樣的使用者經驗。

設計系統裡，可以重複利用的 UI 元件，讓團隊在各種專案打造複雜、耐用且無障礙的使用者介面。因為設計師和開發者都參與製作 UI 元件，設計系統就要成為兩個領域之間的橋樑，也是組織裡常見元件的「信任來源」。

![Design systems bridge design and development](/design-systems-for-developers/design-system-context.jpg)

Designers often talk about building design systems inside their tools. The holistic scope of a design system encompasses assets (Sketch, Figma, etc.), overarching design principles, contribution structure, governance, and more. There’s an abundance of designer-oriented guides that dive deep into these topics so we won’t rehash that here.

For developers, a few things are certain, production design systems must include the UI components and the frontend infrastructure behind it all. There are three technical parts to a design system that we’ll talk about in this guide:

- 🏗 Common reusable UI components
- 🎨 Design tokens: Styling-specific variables such as brand colors and spacing
- 📕 Documentation site: Usage instructions, narrative, do’s and don'ts

The parts are packaged up, versioned, and distributed to consumer apps via a package manager.

## Do you need a design system?

Despite the hype, a design system isn’t a silver bullet. If you work with a modest team on a single app, you’re better off with a directory of UI components instead of setting up the infrastructure to enable a design system. For small projects, the cost of maintenance, integration, and tooling far outweighs any productivity benefits you might see.

The economy of scale in a design system works in your favor when sharing UI components across many projects. If you find yourself pasting the same UI components in different apps or across teams, this guide is for you.

## What we’re building

Storybook powers the design systems for [Uber](https://github.com/uber-web/baseui), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/), and hundreds more companies. The recommendations here are inspired by best practices and tools from the smartest teams. We’ll be building the following frontend stack:

#### Build components

- 📚 [Storybook](http://storybook.js.org) for UI component development and auto-generated docs
- ⚛️ [React](https://reactjs.org/) for declarative component-centric UI (via create-react-app)
- 💅 [Styled-components](https://www.styled-components.com/) for component-scoped styling
- ✨ [Prettier](https://prettier.io/) for automatic code formatting

#### Maintain the system

- 🚥 [GitHub Actions](https://github.com/features/actions) for continuous integration
- 📐 [ESLint](https://eslint.org/) for JavaScript linting
- ✅ [Chromatic](https://chromatic.com) to catch visual bugs in components (by Storybook maintainers)
- 🃏 [Jest](https://jestjs.io/) for unit testing components
- 📦 [npm](https://npmjs.com) for distributing the library
- 🛠 [Auto](https://github.com/intuit/auto) for release management workflow

#### Storybook addons

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) to check for accessibility issues during development
- 💥 [Actions](https://storybook.js.org/docs/react/essentials/actions) to QA click and tap interactions
- 🎛 [Controls](https://storybook.js.org/docs/react/essentials/controls) to interactively adjust props to experiment with components
- 📕 [Docs](https://storybook.js.org/docs/react/writing-docs/introduction) for automatic documentation generation from stories

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## Understand the workflow

Design systems are an investment in frontend infrastructure. In addition to showcasing how to use the technology above, this guide also focuses on core workflows that promote adoption and simplify maintenance. Wherever possible, manual tasks will be automated. Below are the activities we’ll encounter.

#### Build UI components in isolation

Every design system is composed of UI components. We’ll use Storybook as a “workbench” to build UI components in isolation outside of our consumer apps. Then we’ll integrate timesaving addons that help you increase component durability (Actions, A11y, Controls).

#### Review to reach consensus and gather feedback

UI development is a team sport that requires alignment between developers, designers, and other disciplines. We’ll publish work-in-progress UI components to loop stakeholders into the development process so we can ship faster.

#### Test to prevent UI bugs

Design systems are a single source of truth and a single point of failure. Minor UI bugs in basic components can snowball into company-wide incidents. We’ll automate tests to help you mitigate the inevitable bugs to ship durable, accessible UI components with confidence.

#### Document to accelerate adoption

Documentation is essential, but creating it is often a developer’s last priority. We’ll make it much easier for you to document UI components by auto-generating minimum viable docs which can be further customized.

#### Distribute the design system to consumer projects

Once you have well-documented UI components, you need to distribute them to other teams. We’ll cover packaging, publishing, and how to surface the design system in other Storybooks.

## Storybook Design System

This guide’s example design system was inspired by Storybook’s own [production design system](https://github.com/storybookjs/design-system). It is consumed by three sites and touched by tens of thousands of developers in the Storybook ecosystem.

In the next chapter we’ll show you how to extract a design system from disparate component libraries.
