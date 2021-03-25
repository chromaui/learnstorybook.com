---
title: 'React 的 Storybook 教學'
tocTitle: '開始'
description: '在開發環境設定 Storybook'
commit: 'ac1ec13'
---

Storybook 與 App 的開發模式一起運作，協助將 App 裡 UI 元件的商業邏輯和情境分開來。這裡是 Storybook 入門的 React 版本，其它還有 [React Native](/react-native/en/get-started)、[Vue](/vue/en/get-started)、[Angular](/angular/en/get-started)、[Svelte](/svelte/en/get-started) 和 [Ember](/ember/en/get-started)。

![Storybook 和 App](/intro-to-storybook/storybook-relationship.jpg)

## 設定 React Storybook

只要照著幾個步驟，就可以在環境下開始 build 的流程。一開始，我們喜歡用來設定 build 系統的是 [degit](https://github.com/Rich-Harris/degit)。用了這套件，就可以下載「範本」（已經預設寫好一些設定的應用程式半成品），它有助於快速追蹤開發流程。

讓我們執行以下指令：

```bash
# 複製範本
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# 安裝相依套件
yarn
```

<div class="aside">
💡 範本裡有此版本教學會用到的樣式、檔案和初始設定。
</div>

現在，可以來快速檢查應用程式的不同環境是否正常運作：

```bash
# 在終端機執行測試 runner (Jest)：
yarn test --watchAll

# 在 port 6006 啟動元件瀏覽器：
yarn storybook

# 在 port 3000 執行前端應用程式 proper：
yarn start
```

<div class="aside"> 
💡 請留意測試指令的 flag <code>--watchAll</code>，加上此 flag 可以確保所有測試都有跑到。在這篇教學的過程，會介紹不同的測試情境。也許你會考慮根據情況修改 <code>package.json</code>' 腳本。
</div>

現在有 3 種前端應用程式模式：自動化測試 (Jest)、元件開發 (Storybook) 和應用程式本身。

![3 種模式](/intro-to-storybook/app-three-modalities.png)

根據 app 裡開發不同的部分，可能會想要同時執行多個。然而，我們現在專注在建造單一 UI 元件，所以只會說 Storybook。

## 提交更變

這時候已經可以安心在本地端 repository 放進檔案。啟動本地端 repository 的指令在下方，然後為我們目前做好的東西提交變更。

```shell
$ git init
```

接著：

```shell
$ git add .
```

最後：

```shell
$ git commit -m "first commit"
```

開始打造第一個元件吧！
