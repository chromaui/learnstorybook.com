---
title: '測試 UI 元件'
tocTitle: '測試'
description: '瞭解測試 UI 元件的方法'
commit: '3e283f7'
---

Storybook 教程沒有測試是不完整的. 測試對於建立高質量的 UI 至關重要. 在模組化系統中,微小的調整可能導致重大的回溯. 到目前為止,我們遇到了三種類型的測試

- **視覺測試** 依賴開發人員手動檢視元件以驗證其正確性. 它們幫助我們在構建時檢查元件的外觀.
- **快照測試** 使用 Storyshots 捕獲元件的渲染標記. 它們可以幫助我們及時瞭解導致 渲染錯誤和警告的標記更改.
- **單元測試** 使用 Jest 驗證 在給定固定輸入的情況下 元件的輸出保持不變. 它們非常適合測試元件的功能質量.

## "但看起來不錯嗎?"

不幸的是,單獨的上述測試方法不足以防止 UI 錯誤. 使用者介面很難測試,因為設計是主觀的,細緻入微的. 視覺化測試 過於手動,快照測試在用於 UI 時 會觸發太多誤報,而 畫素級單元測試的價值很低. 完整的 Storybook 測試策略 還包括視覺回溯測試.

## Storybook 的視覺回溯測試

視覺回溯測試旨在捕捉外觀的變化. 他們通過捕獲每個故事的螢幕截圖,並將它們提交到 表面更改 進行比較工作. 這非常適合驗證佈局,顏色,大小和對比度等圖形元素.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是視覺回溯測試的絕佳工具,因為每個故事本質上都是一個測試規範. 每次我們編寫或更新故事時,我們都會免費獲得規格!

有許多用於視覺回溯測試的工具. 對於專業團隊,我們建議[**Chromatic**](https://www.chromatic.com/),由 Storybook 維護者製作的外掛,在雲中執行測試.

## 設定視覺回溯測試

Chromatic 是一個無障礙的 Storybook 外掛,用於在雲中進行視覺回溯測試和審查. 由於它是付費服務 (免費試用) ,因此可能並非適合所有人. 但是,Chromatic 是生產視覺測試工作流程的一個有益的例子,我們將免費試用. 我們來看一下.

### 初始化 Git

首先,您要在本地目錄中為專案設定 Git. Chromatic 使用 Git 歷史記錄 來跟蹤您的 UI 元件.

```bash
$ git init
```

接下來將檔案新增到第一次提交.

```bash
$ git add .
```

現在提交檔案.

```bash
$ git commit -m "taskbox UI"
```

### 獲得 Chromatic

將包新增為依賴項.

```bash
yarn add chromatic
```

匯入 Chromatic 到你的`.storybook/config.js`檔案.

```javascript
import { configure } from '@storybook/react';
import requireContext from 'require-context.macro';
import 'chromatic';

import '../src/index.css';

const req = requireContext('../src/components', true, /\.stories\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
```

然後[登入 Chromatic](https://www.chromatic.com/start)使用您的 GitHub 帳戶 (Chromatic 僅要求輕量級許可權) . 建立名為"taskbox"的專案並複製您的唯一專案`project-token`.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

在命令列中執行 test 命令 以設定 Storybook 的視覺化回溯測試. 不要忘記新增您的 唯一應用程式碼 來代替`<project-token>`.

```bash
npx chromatic --project-token=<project-token>
```

第一次測試完成後, 我們會為每個故事提供測試基準. 換句話說,每個故事的螢幕截圖都被稱為"good". 這些故事的未來變化 將與 基線進行比較.

![Chromatic baselines](/intro-to-storybook/chromatic-baselines.png)

## 捕獲 UI 更改

視覺回溯測試 依賴於將 新呈現的 UI 程式碼的影象 與 基線影象 進行比較. 如果捕獲到 UI 更改,則會收到通知. 通過調整背景 來了解它是如何工作的`Task`元件:

![code change](/intro-to-storybook/chromatic-change-to-task-component.png)

這會為專案生成新的背景顏色.

![task background change](/intro-to-storybook/chromatic-task-change.png)

使用之前的 test 命令執行另一個 Chromatic 測試.

```bash
npx chromatic --project-token=<project-token>
```

點選您將看到 更改的網路使用者介面 連結.

![UI changes in Chromatic](/intro-to-storybook/chromatic-catch-changes.png)

有很多變化! 元件層次結構表明 `Task`是`TaskList`的孩子和`Inbox`意味著一個小小的調整滾雪球成為主要的回溯. 這種情況正是開發人員除了其他測試方法之外,還需要視覺回溯測試的原因.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 檢視更改

視覺回溯測試確保元件不會意外更改. 但是,您仍然需要確定更改是否是有意的.

如果有意更改,則需要更新基線,以便將來的測試與故事的最新版本進行比較. 如果改變是無意的,則需要修復.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

由於現代應用程式是 由元件構建的,因此我們在元件級別 進行測試非常重要. 這樣做有助於我們找出變化的根本原因,即元件,而不是對 變化的症狀,頁面 和 複合元件 做出反應.

## 合併更改

當我們完成稽核後,我們已準備好自信地合併 UI 更改 - 知道更新不會意外地引入錯誤. 如果你喜歡新的`red`背景色,然後接受更改,如果不需要恢復到以前的狀態.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook 可以幫助你 **建立** 元件;測試可以幫助你 **保持** 他們. 本教程介紹了四種類型的 UI 測試,包括 視覺化,快照,單元和視覺化回溯測試. 您可以通過將它們新增到 CI 指令碼 來自動執行最後三個. 這有助於您運輸元件 而不必擔心 偷渡漏洞. 整個工作流程如下所示.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
