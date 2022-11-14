---
title: '部署 Storybook'
tocTitle: '部署'
description: '學習把 Storybook 部署到線上的方法'
commit: 'af610d9'
---

在這套教學的過程中，我們已經在本地端機器打造元件。有一些進展後，要把成果分享出去，藉以獲得回饋。接下來，要把 Storybook 部署到線上，協助隊友檢查 UI 的實作方法。

## 以靜態 App 輸出

部署 Storybook 的第一件事是以靜態網頁 app 輸出。這是 Storybook 的內建功能，而且已經預先設定好了。

執行 `yarn build-storybook` 就會在 `storybook-static` 資料夾輸出靜態的 Storybook。接著，就可以部署到任何靜態網站放置服務。

## 發布 Storybook

這一份教學使用 Storybook 維護團隊製作的免費發布服務：<a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>，可以在雲端安全地部署與放置 Storybook。

### 在 Github 設定 Repository

開始之前，本地端的程式碼得要與遠端版本控制服務同步。在[《開始》那章節](/intro-to-storybook/react/zh-TW/get-started/)，專案進行初始設定時，就已經有一份本地端 Repository。在這階段，已經有一組可以推到遠端的 commit。

[點此](https://github.com/new)到 Github 為專案開新 Repository。取名為 “Taskbox”，跟本地端的專案一樣。

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

在新的 Repo 裡，用以下指令加上 repo 的 git 專案 origin 網址：

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

最後，把本地端 repo 推到在 GitHub 的遠端 repo。

```shell
git push -u origin main
```

### 安裝 Chromatic

新增開發模式的 dependency。

```shell
yarn add -D chromatic
```

安裝好套件後即可使用 Github 帳號[登入 Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)（Chromatic 只會要求一點權限）。接著，新增名為 "taskbox" 的專案，與剛剛設定好的 Github Repository 同步。

點擊在 collaborator 下方的 'Choose GitHub repo'，接著選擇 Repo。

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

複製專案裡產生，識別用的 'project-token'。在文字指令列執行下方那行，即可 build 和部署 Storybook。記得要把 'project-token' 換成專案的 token。

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

完成之後，發布出去的 Storybook 連結是 `https://random-uuid.chromatic.com`。與團隊分享此連結來獲得回饋。

![以 Chromatic 套件部署出去的 Storybook](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

萬歲！只用了 1 個指令就將 Storybook 發布。只是，每次想要獲得 UI 實做回饋的時候，都要手動執行指令會覺得很冗。理想狀況應該是只要推程式碼時，就會發布最新版本。也就是，得要進行持續部署 Storybook。

## 以 Chromatic 進行持續部署

既然專案是放在 Github Repository，就可以使用持續整合 (CI) 服務，自動部署 Storybook。[GitHub Actions](https://github.com/features/actions) 是 Github 的免費 CI 服務，可以輕鬆地自動發布。

### 加入 GitHub Action 來部署 Storybook

在專案的根目錄新增 `.github` 資料夾，其中再新增 `workflows` 資料夾。

如下方所示，新增 `chromatic.yml` 這個檔案。把 `CHROMATIC_PROJECT_TOKEN` 以專案的 token 取代。

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'

# Event for the workflow
on: push

# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/react/zh-tw/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>💡 因為版面因素，沒有特別講 <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a>。 Secrets 是 Github 提供的安全環境變數，就不用把 <code>project-token</code> 直接寫在程式碼裡面。</p></div>

### 提交 Action

在文字指令列，用以下的指令來把做好的修改送出去：

```shell
git add .
```

接著，進行提交：

```shell
git commit -m "GitHub action setup"
```

最後，推上遠端 Repository：

```shell
git push origin main
```

只要設定好 Github action，每次推程式碼的時候，Storybook 就會部署到 Chromatic。在 Chromatic，可以找到專案裡所有發布過的 Storybook。

![Chromatic 的使用者儀表板](/intro-to-storybook/chromatic-user-dashboard.png)

按下最新 Build，最上面的那一項就是。

接著，按 `View Storybook` 按鈕，就可以看到最新版本的 Storybook。

![Chromatic 裡的 Storybook 連結](/intro-to-storybook/chromatic-build-storybook-link.png)

用此連結跟團隊成員分享。這對標準 App 開發流程或炫耀成果都很用有 💅。
