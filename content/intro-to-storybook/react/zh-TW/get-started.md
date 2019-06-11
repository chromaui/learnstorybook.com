---
title: "開始吧"
tocTitle: "從頭開始"
description: "在你的開發環境下, 設定 React Storybook "
commit: ebe2ae2
---

Storybook 是在開發模式下 與 您的應用程式一起執行的. 它可以幫助您構建 UI 元件,並與 應用程式的 業務邏輯和上下文 隔離開來. 本期"學習 Storybook"適用於 **React**; `Vue和Angular`版本即將推出.

![Storybook and your app](/storybook-relationship.jpg)

> 整個頁面 -> 拿出各種元件 -> 分隔出 **每個元件** /`元件組合`用來測試與文件說明

## 設定 React Storybook

我們需要按照幾個步驟設定 Storybook 環境. 首先,我們想要使用[Create React App](https://github.com/facebook/create-react-app) (**CRA**) 快速設定我們的環境,並啟用[Storybook](https://storybook.js.org/)和[ jest-笑話 ](https://facebook.github.io/jest/)測試我們建立的應用. 讓我們執行以下命令:

```bash
# 建立應用:
npx create-react-app taskbox
cd taskbox

# 加入 Storybook:
npx -p @storybook/cli sb init
```

我們可以快速檢查,我們的應用程式的各種命令是否正常工作:

```bash
# 執行 測試引擎(Jest):
yarn test

# 啟動 storybook 在埠:9009 :
yarn run storybook

# 啟動 前端 頁面 在埠:3000:
yarn start
```

<div class="aside">
  注意: 如果 <code>yarn test</code> 執行錯誤, 你可能需要安裝 <code>watchman</code> 具體問題來自 <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">這個Issue</a>.
</div>

我們的三個前端應用程式模式: 自動化測試 (Jest) ,元件開發 (Storybook) 和 應用程式本身.

![3 modalities](/app-three-modalities.png)

根據您正在處理的應用程式的哪個部分,您可能希望同時執行其中一個或多個. 由於我們目前的重點是建立單個 UI 元件,因此我們將堅持執行 Storybook.

## 重用 CSS

本例子`Taskbox` 重用了 [GraphQL 和 React Tutorial 示例應用](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858)中的設計元素,所以我們不需要在本教程中編寫 CSS. 我們只需將 LESS 編譯為單個 CSS 檔案, 並將其包含在我們的應用程式中. 複製和貼上[這個編譯的 CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css)根據 **CRA**的規則 進入 **src/index.css** 檔案.

![Taskbox UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
如果要修改樣式，在GitHub儲存庫中有提供 源LESS檔案。
</div>

## 新增資源

我們還需要新增 字型和圖示[資料夾](https://github.com/chromaui/learnstorybook-code/tree/master/public)到了`public/`資料夾. 新增 樣式和靜態資源 後,應用程式會奇奇怪怪的. 沒關係. 因為我們還沒有開發應用程式. 現在我們開始構建我們的第一個元件!
