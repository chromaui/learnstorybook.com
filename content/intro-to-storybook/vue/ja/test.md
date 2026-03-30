---
title: 'UI コンポーネントをテストする'
tocTitle: 'テスト'
description: 'UI コンポーネントのテスト手法について学びましょう'
---

Storybook のチュートリアルをテスト抜きには終われません。テストは高品質な UI を作成するのに必要なことです。疎結合なシステムにおいては、些細な変更で大きなリグレッション (手戻り) をもたらすことがあるのです。ここまでで、すでに 2 種類のテストについて学びました。

- **コンポーネントのテスト**では、Storybook と Vitest の連携機能を使い、実際のブラウザ環境でコンポーネントの描画や動作を自動的に検証します。
- **インタラクションテスト**では、play 関数を使用し、コンポーネントが操作された際に期待通りの動作をすることを検証します。コンポーネントの利用中の振る舞いをテストするのに最適です。

## 「でも、見た目は大丈夫？」

残念ながら、前述のテスト方法だけでは UI のバグを防ぎきれません。UI というのは主観的でニュアンスの違いが多いため、テストが厄介なのです。手動テストは、その名の通り、手動です。UI のスナップショットテストでは多数の偽陽性を発生させてしまいます。ピクセルレベルの単体テストは価値があまりありません。Storybook のテスト戦略には視覚的なリグレッションテストが不可欠です。

## Storybook 向けのビジュアルテスト

視覚的なリグレッションテスト (ビジュアルテスト) は、見た目の変更を検出するために設計されています。ビジュアルテストはコミット毎に各ストーリーのスクリーンショットを撮って、前のコミットと比較して変更点を探します。レイアウトや色、サイズ、コントラストといった表示要素の確認にとても適しています。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook は視覚的なリグレッションテスト用の素晴らしいツールです。なぜなら、Storybook において、すべてのストーリーがテスト仕様書そのものだからです。ストーリーを書いたり更新したりするたびに、テスト仕様も無料で手に入るようなものなのです。

視覚的なリグレッションテスト向けのツールは多々あります。Storybook のメンテナーが作成した無料のホスティングサービスである [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) がオススメです。Chromatic はクラウド環境上でビジュアルテストを高速で並列実行します。[前の章](/intro-to-storybook/vue/ja/deploy/)で見てきたように、Storybook をインターネット上に公開することもできます。

## UI の変更を検知する

視覚的なリグレッションテストでは、新しく描画された UI コードのイメージが基準となるイメージと比較されます。UI の変更が検知されると、通知を受け取ることができます。

それでは、`Task` コンポーネントの背景を変更し、どう動くのか見てみましょう。

変更する前に新しいブランチを作成します。

```shell
git checkout -b change-task-background
```

`src/components/Task.vue` を以下のように変更します。

```diff:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label :for="'checked' + task.id" :aria-label="'archiveTask-' + task.id" class="checkbox">
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
+       style="background-color: red"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { TaskData } from '../types'

import { computed } from 'vue'

type TaskProps = {
  /** Composition of the task */
  task: TaskData
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void
}

const props = defineProps<TaskProps>()

const classes = computed(() => {
  return `list-item ${props.task.state}`
})

/*
 * Computed property for checking the state of the task
 */
const isChecked = computed(() => props.task.state === 'TASK_ARCHIVED')

const emit = defineEmits<{
  (e: 'archive-task', id: string): void
  (e: 'pin-task', id: string): void
}>()

/**
 * Event handler for archiving tasks
 */
function archiveTask() {
  emit('archive-task', props.task.id)
}

/**
 * Event handler for pinning tasks
 */
function pinTask(): void {
  emit('pin-task', props.task.id)
}
</script>
```

これでタスクの背景色が変更されます。

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
   - Filename should be as follows:
     - chromatic-task-changes-non-react-9-0.png
 -->

![タスクの背景色の変更](/intro-to-storybook/chromatic-task-changes-non-react-9-0.png)

この変更をステージングします。

```shell
git add .
```

コミットします。

```shell
git commit -m "change task background to red"
```

そして変更をリモートリポジトリにプッシュします。

```shell
git push -u origin change-task-background
```

最後に、ブラウザで GitHub のリポジトリを開き `change-task-background` ブランチのプルリクエストを作成します。

![GitHub にタスクの PR を作成する](/github/pull-request-background.png)

プルリクエストに適切な説明を書き、`Create pull request` をクリックしてください。その後、ページの下部に表示された「🟡 UI Tests」の PR チェックをクリックしてください。

![GitHub にタスクの PR が作成された](/github/pull-request-background-ok.png)

これで先のコミットによって検出された UI の変更を見られます。

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
 -->

![Chromatic が変更を検知した](/intro-to-storybook/chromatic-catch-changes.png)

とてもたくさん変更されていますね！`Task` はコンポーネント階層で `PureTaskList` と `InboxScreen` の子コンポーネントなので、少しの変更で雪だるま式に大規模なリグレッションが発生します。このような状況となるからこそ、他のテスト手法に加えてビジュアルテストが必要となるのです。

![UI のちょっとした変更で大きなリグレッションが発生](/intro-to-storybook/minor-major-regressions.gif)

## 変更をレビューする

視覚的なリグレッションテストはコンポーネントが意図せず変更されていないことを保障します。しかし、その変更が意図的であるかどうかを判別するのは、やはり人になります。

もし意図的な変更であるならば、ベースラインを更新すれば、最新のストーリーが今後の比較に使用されるようになります。そうでなければ、修正が必要です。

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

モダンなアプリケーションはコンポーネントで構成されているため、コンポーネントのレベルでテストするのが重要です。そうすることで、他のコンポーネントの変更による影響を受けた画面や複合的なコンポーネントではなく、変化の根本的な原因であるコンポーネントを正確に特定するのに役立ちます。

## 変更をマージする

UI の変更をレビューしたら、その変更で意図せずバグを混入させていないことがわかっているので、自信をもってマージできます。赤色の背景が気に入ったのであれば、変更を受け入れ、そうでなければ元の状態に戻します。

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
 -->

![マージの準備ができた変更内容](/intro-to-storybook/chromatic-review-finished.png)

Storybook はコンポーネントを**作る**のに役立ち、テストはコンポーネントを**保つ**のに役立ちます。このチュートリアルでは、手動テストとビジュアルテストの 2 種類の UI テストを取り上げました。設定が完了したように、どちらも CI に組み込んで自動化できます。これにより、バグの混入を心配することなくコンポーネントをリリースできます。ただし、コンポーネントのテスト方法はこれだけではありません。障がいを持つユーザーを含むすべてのユーザーにとってコンポーネントがアクセシブルであることを確認する必要があります。つまり、アクセシビリティテストもワークフローに取り入れる必要があるのです。
