---
title: '測試 UI 元件'
tocTitle: '進行測試'
description: '瞭解測試 UI 元件的方法'
---

每個 Storybook 教學都一定有測試，才算完整，這是打造高品質 UI 的必備事項。在模組化的系統，微小的修改都會造成嚴重回溯。目前為止，已經遇到 3 種測試：

- **手動測試**倚賴開發者自行察看元件，驗證是否正確。
- **快照測試**使用的 Storyshot 攔截元件渲染出來的語法。只要有造成渲染錯誤和警告的語法變動，都能夠第一時間收到。
- **單元測試**使用 Jest，驗證元件一樣的輸入，會有相同的輸出。這適用於測試元件的功能品質。

## 「可是，看起來正常嗎？」

很不幸地，前面提到的測試方法，都無法各自避免 UI 臭蟲。由於設計是主觀的，且差距細微，使得 UI 很難進行測試。手動測試就如同字面的意思，得手動進行。快照測試用在 UI 時會引發許多偽陽性。像素等級的單元測試則沒什麼價值。完整的 Storybook 測試策略，還會包含視覺回溯測試。

## Storybook 的視覺測試

視覺回溯測試是用來找出外觀的變動，也可以稱為視覺測試。方法是抓取每個 story 的螢幕截圖，隨著每個提交進行比較，使得變動可以浮上水面。在驗證排版、顏色、尺寸和對比度等圖像元素最適合。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook 是優秀的視覺回溯測試工具，因為每個 story 基本上都是測試規格。每次撰寫或更新 story，都可以免費獲得一份規格！

視覺回溯測試工具有很多種。我們推薦 [**Chromatic**](https://www.chromatic.com/) 這款由 Storybook 維護者製作的免費出版工具，可以在雲端同時進行視覺測試。如同[上一個章節](/intro-to-storybook/react/zh-TW/deploy/)提到的，也可以在線上發布 Storybook。

## 找出 UI 變化

視覺回溯測試倚賴原本的圖片跟新渲染的 UI 程式碼之間做比較。如果抓到 UI 變動，就會收到通知。

以修改 `Task` 元件的背景，來看看是如何運作的。

一開始，為這次的修改新增分支：

```shell
git checkout -b change-task-background
```

把 `src/components/Task.js` 改成以下這樣：

```diff:title=src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
+   style={{ background: 'red' }}
  />
</div>
```

項目就冒出新的背景顏色。

![task background change](/intro-to-storybook/chromatic-task-change.png)

幫這個檔案下 add 指令：

```shell
git add .
```

提交：

```shell
git commit -m "change task background to red"
```

把變動推到遠端的 Repo：

```shell
git push -u origin change-task-background
```

最後，打開在 GitHub 的 Repository，以 `change-task-background` 分支開啟 Pull Request。

![Creating a PR in GitHub for task](/github/pull-request-background.png)

描述一下 Pull Request，點擊 `Create pull request`。接著再按頁底的 "🟡 UI Tests" PR 檢查。

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

就會看到提交內容裡的 UI 變動。

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

變動還挺多的！`Task` 在 `TaskList` 和 `Inbox` 底下，代表小小的修改滾起雪球，變成大幅度的回溯。這樣的情境，正是開發者需要視覺回溯測試的原因，其他測試方法還不夠。

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 檢查變動

視覺回溯測試確保元件不會意外地改變。但變動是否是有意的，決定權在自己身上。

如果是有意的變動，那就要更新基準，日後的測試才會跟 story 的最新版本比較。如果變動不是有意的，那就要修好。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

既然現代的應用程式都是以元件蓋起來的，以元件為層級來測試就很重要。這樣的作法有助於點出變動的根本原因，也就是元件本身，而不是變動的表徵、畫面和複合元件。

## 合併變動

檢查完成之後，就可以有自信地準備合併 UI 變動，也就是明白進行更新不會意外引發臭蟲。如果喜歡新來的`紅色`背景，那就同意變動，反之則回復到先前的狀態。

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook 幫助我們**打造**元件，而進行測試則是有助於**維護**。這篇教學裡提到的 4 種 UI 測試，分別是手動、快照、單元與視覺回溯測試。後 3 項就是剛剛設定好的，可以加到 CI 自動進行，在推出元件的時候免於擔心逃票的臭蟲。整個工作流程如下圖。

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
