---
title: '設計系統簡介'
tocTitle: '簡介'
description: '正式環境的最新設計系統工具指南'
---

<div class="aside">這篇是寫給<b>專業開發者</b>學習打造設計系統的指南。建議具備相當的 JavaScript、Git 和持續整合經驗。也應該要懂 Storybook 的基礎，例如撰寫 story 和編輯設定檔（<a href="/intro-to-storybook">Storybook 入門</a>有教基礎）。
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

通常，設計師談論打造設計系統，是在使用的工具裡面。設計系統整體來說，涵蓋圖像（Sketch、Figma⋯ 等）、 設計原則、貢獻結構、行政管理 ⋯。寫給設計師，深入探討這些話題的指南已經非常多，因此就不再贅述。

對開發者來說，確定的事情不多。正式環境的設計系統必須包含 UI 元件，以及背後的前端基礎建設。接下來，這份指南在設計系統的技術部分會談到 3 種：

- 🏗 常見可重複使用的 UI 元件
- 🎨 設計 Token：專用在樣式的變數，例如品牌顏色和留白。
- 📕 文件網站：使用教學、說明、可做與不可做。

這些都會透過 Package Manager 打包起來、進行版控，並配送至會用到的 App。

## 設計系統，有必要嗎？

先不管熱潮，設計系統並不是萬靈丹。如果是在只有單一 App，中等規模的團隊，最好只要 UI 元件的目錄即可，而不是為了能使用設計系統就設定基礎建設。對小型專案來說，維護、整合與工具選用的成本，會遠超過任何可以感覺到的生產力提升。

設計系統在 UI 元件橫跨多個專案時，所達到的規模經濟會最對胃口。發現自己在不同 App 或團隊裡複製貼上 UI 元件的時候，這份指南就是為你而寫的。

## 會打造出什麼？

Storybook 為 [Uber](https://github.com/uber-web/baseui)、[Airbnb](https://github.com/airbnb/lunar)、[IBM](https://www.carbondesignsystem.com/)、[GitHub](https://primer.style/css/) 和其他數以百計的公司提供設計系統。這裡的建議名單，啟發自最傑出團隊的最佳方法和工具。我們將打造以下前端組合包：

#### 打造元件

- 📚 [Storybook](http://storybook.js.org) 用來進行 UI 元件開發，以及自動產生文件
- ⚛️ [React](https://reactjs.org/) 用來進行宣告式，元件為中心的 UI（使用 create-react-app）
- 💅 [Styled-components](https://www.styled-components.com/) 用來設定元件範圍內的樣式
- ✨ [Prettier](https://prettier.io/) 用來自動排好程式碼格式

#### 維護系統

- 🚥 [GitHub Actions](https://github.com/features/actions) 用來進行持續整合
- 📐 [ESLint](https://eslint.org/) 用來整理 JavaScript
- ✅ [Chromatic](https://chromatic.com) 找出元件裡的視覺臭蟲 (由 Storybook 維護者營運)
- 🃏 [Jest](https://jestjs.io/) 用來進行元件的單元測試
- 📦 [npm](https://npmjs.com) 用來配送資源庫
- 🛠 [Auto](https://github.com/intuit/auto) 用來管理釋出版本的工作流程

#### Storybook 外掛

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) 檢查開發過程的的無障礙設計
- 💥 [Actions](https://storybook.js.org/docs/react/essentials/actions) 確保點擊與觸擊的品質
- 🎛 [Controls](https://storybook.js.org/docs/react/essentials/controls) 以互動的方式調整 props，對元件做實驗
- 📕 [Docs](https://storybook.js.org/docs/react/writing-docs/introduction) 從 story 自動產生文件

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## 瞭解工作流程

設計系統就是投資在前端基礎建設。除了展示如何使用以上提到的技術，這份指南也專注在採用程度提升與維護簡化的核心工作流程。手動的任務會盡可能自動化。以下是會遇到的行動。

#### 打造獨立的 UI 元件

每個設計系統都是由 UI 元件組成。Storybook 是 打造各自獨立 UI 元件的「工作檯」。接著，整合能夠節省時間、增加元件耐用度的外掛 (Actions, A11y, Controls)。

#### 為達成共識、蒐集回饋的檢查

UI 開發是團隊運動，開發者、設計師和其他領域之間都必須遵守。我們做好 UI 元件半成品，將利害關係人納入開發流程，就可以更快上線。

#### 為避免 UI 臭蟲的測試

設計系統是唯一可信任來源 (single source of truth)，也可能是唯一失靈點。基本元件裡，微小的 UI 臭蟲可以滾學球成為一間公司的災難。我們將測試自動化，幫助減緩無可避免的臭蟲，有自信地將耐用、無障礙的 UI 元件推上線。

#### 為加速採用而撰寫文件

撰寫文件是一定要做的，但通常是開發者最後才進行的事情。有自動產生的最小可行性文件，為 UI 元件撰寫文件就輕鬆多了，之後還可以深入客製化。

#### 將設計系統配送至要用到的專案

一旦有完整記錄在文件的 UI 元件，就得要傳給其他團隊。接著會談到打包 (packaging)、推出 (publishing)，還有在其它 Storybook 如何將設計系統凸顯出來。

## Storybook 設計系統

這份指南示範的設計系統，來自 Storybook 自有[正式環境的設計系統](https://github.com/storybookjs/design-system)。它用在 3 個網站，以及 Storybook 生態系裡數萬位開發者參與其中。

下一章節，將展示如何從截然不同的元件資源庫提取出設計系統。
