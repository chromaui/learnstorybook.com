---
title: '部署 Storybook'
tocTitle: '發布'
description: '使用 GitHub 和 Netlify 發布 Storybook 網站'
---

在本教學中，我們在開發機上執行了 Storybook，您可能還想與團隊分享該 Storybook，尤其是非技術背景的成員。值得慶幸的是，將 Storybook 部署上線是很容易的。

<div class="aside">
<strong>您之前是否安裝過 Chromatic 測試？</strong>
<br/>
🎉 你的故事已經部署好了！ Chromatic 在線上安全地為您的不是編制索引，並且會在個別追蹤 Git 的每個分支與每次的提交。你可以跳過這一張，直接到<a href="/react/zh-TW/conclusion">總結</a>。
</div>

## 匯出為靜態 Web 應用程式

要部署 Storybook，我們首先要將其匯出為靜態的 Web 應用程式。這個功能是 Storybook 內建的功能，我們只需在 `package.json` 增加相關的腳本即可執行。

```javascript
{
  "scripts": {
   "build-storybook": "build-storybook -s public"
  }
}
```

現在，當你執行 `yarn build-storybook`，它會接著將 Storybook 建構為靜態化的網站，輸出在 `storybook-static` 目錄底下。

## 持續部署

我們希望能在每次提交程式碼並推送到團隊的 Git 儲存庫後能共享最新版本的元件。因此，我們需要持續部署 Storybook，我們將藉由 GitHub 及 Netlify 來部署我們的靜態網站。我們正使用 Netlify 所提供的免費方案。

### GitHub 上

首先，您要在本地目錄中為 Storybook 專案建立 Git 儲存庫。如果您從上一個測試章節開始，請先跳到在 GitHub 上建立儲存庫的章節。

```bash
git init
```

接下來將所有檔案加入 Git 程式庫追蹤。

```bash
git add .
```

現在將所有的檔案提交到 Git 程式庫。

```bash
git commit -m "taskbox UI"
```

接著，在 GitHub 上[建立一個新的 Git 程式庫](https://github.com/new)。將您的程式庫命名為 "taskbox"。

![GitHub 設定](/intro-to-storybook/github-create-taskbox.png)

在新的程式庫設定中，複製程式庫的原始網址，並使用以下指令將其添加到本地端的 Git 專案中：

```bash
git remote add origin https://github.com/<your username>/taskbox.git
```

最後將本地端的專案內容，推送到 GitHub 上。

```bash
git push -u origin master
```

### Netlify

Netlify 內建持續部署的服務，因此我們無需建立自己的持續部署環境，就可在 Netlify 上部署 Storybook。

<div class="aside">
如果您在公司內使用自建的持續部署環境，請在該系統中增加部署相關的腳本程式，將 `storybook-static` 上傳到像 S3 之類的靜態託管服務。
</div>

[在 Netlify 上註冊帳號](https://app.netlify.com/start)並接著「建立新網站」。

![Netlify Create site](/intro-to-storybook/netlify-create-site.png)

然後點擊 GitHub 按鈕，將 Netlify 連接到 GitHub 並授權其存取我們在 GitHub 上的 taskbox 遠端程式庫。

從專案列表中選擇 taskbox：

![Netlify connect to repo](/intro-to-storybook/netlify-account-picker.png)

Netlify 的設定重點主要在 Netlify CI 上執行的建構指令，以及建構後的靜態網站匯出的目錄位置。

預計進行部署的 Git 分支則選擇 `master`。要發布的目錄則為 `storybook-static`。建構指令設定為 `yarn build-storybook`。

通过突出显示在其 CI 中运行的构建命令,以及输出静态站点的目录 来配置 Netlify. 对于分支选择 `master`. 目录是`storybook-static`. `yarn build-storybook`构建.

![Netlify settings](/intro-to-storybook/netlify-settings.png)

<div class="aside"><p>倘若你在 Netlify 上的部署遇到錯誤訊息，可在建構指令 `build-storybook` 的腳本中增加 <a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet </a> 的旗標。</p></div>

完成後送出表單即可開始進行 taskbox 主分支的建構及部署。

完成後，我們會在 Netlify 的畫面上看到包括了 Taskbox Storybook 連結的確認訊息。點擊此連結即可看到你的 Storybook 已成功部署上線，會看到[像這樣](https://clever-banach-415c03.netlify.com/)的畫面。

![Netlify Storybook deploy](/intro-to-storybook/netlify-storybook-deploy.png)

如此，我們便完成了 Storybook 的持續部署！現在我們可以直接分享 Storybook 的網址連結給團隊成員，分享我們建立的 Story。

部署到線上的 Storybook 會有助於將應用程式開發過程的審查視覺化，或是非常適合用來在線上展示您的成果💅。
