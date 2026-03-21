---
title: '単純なコンポーネントを作る'
tocTitle: '単純なコンポーネント'
description: '単純なコンポーネントを切り離して作りましょう'
commit: '18e218e'
---

それでは、[コンポーネント駆動開発](https://www.componentdriven.org/) (CDD) の手法にのっとって UI を作ってみましょう。コンポーネント駆動開発とは、UI を最初にコンポーネントから作り始めて、最後に画面を作り上げる「ボトムアップ」形式の開発プロセスです。CDD を活用することで、 UI を作る際に直面する複雑性を軽減できます。

## Task (タスク)

![Task コンポーネントの 3 つの状態](/intro-to-storybook/task-states-learnstorybook-accessible.png)

`Task` は今回作るアプリケーションのコアとなるコンポーネントです。タスクはその状態によって見た目が微妙に異なります。タスクにはチェックされた (または未チェックの) チェックボックス、タスクについての説明、リストの上部に固定したり解除したりするためのピン留めボタンがあります。これをまとめると、以下のプロパティが必要となります:

- `title` – タスクを説明する文字列
- `state` - タスクがどのリストに存在するか。またチェックされているかどうか。

`Task` の作成を始めるにあたり、事前に上記のそれぞれのタスクに応じたテスト用の状態を作成します。次いで、Storybook で、モックデータを使用し、コンポーネントを切り離して作ります。コンポーネントのそれぞれの状態について見た目を確認しながら進めます。

## セットアップする

まずは、タスクのコンポーネントと、対応するストーリーファイル `src/components/Task.vue` と `src/components/Task.stories.ts` を作成しましょう。

`Task` の基本的な実装から始めます。`Task` は上述したプロパティと、タスクに対して実行できる 2 つの (リスト間を移動させる) アクションを引数として取ります。

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <label for="title" :aria-label="task.title">
      <input type="text" readonly :value="task.title" id="title" name="title" />
    </label>
  </div>
</template>

<script lang="ts" setup>
type TaskData = {
  id: string
  title: string
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED'
}

type TaskProps = {
  task: TaskData
  onArchiveTask: (id: string) => void
  onPinTask: (id: string) => void
}
const props = withDefaults(defineProps<TaskProps>(), {
  task: { id: '', title: '', state: 'TASK_INBOX' },
})
</script>
```

上のコードは Todo アプリケーションの HTML を基にした `Task` の簡単なマークアップです。

下のコードは `Task` に対する 3 つのテスト用の状態をストーリーファイルに書くものです。

```ts:title=src/components/Task.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import { fn } from 'storybook/test'

import Task from './Task.vue'

export const TaskData = {
  id: '1',
  title: 'Test Task',
  state: 'TASK_INBOX' as 'TASK_INBOX' | 'TASK_ARCHIVED' | 'TASK_PINNED',
  events: {
    onArchiveTask: fn(),
    onPinTask: fn(),
  },
}

const meta = {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...TaskData.events,
  },
} satisfies Meta<typeof Task>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    task: TaskData,
  },
}

export const Pinned: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
}

export const Archived: Story = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
}
```

<div class="aside">

💡 [**アクション**](https://storybook.js.org/docs/essentials/actions) は、UI コンポーネントを単独で構築する際にインタラクションを検証するのに役立ちます。アプリのコンテキストで使える関数や状態にアクセスできないことも多いため、`fn()` を使ってスタブとして差し込みましょう。

</div>

Storybook には基本となる 2 つの階層があります。コンポーネントとその子供となるストーリーです。各ストーリーはコンポーネントに連なるものだと考えてください。コンポーネントには必要なだけストーリーを記述できます。

- **コンポーネント**
  - ストーリー
  - ストーリー
  - ストーリー

Storybook にコンポーネントを認識させるには、以下の内容を含む `default export` を記述します:

- `component` -- コンポーネント自体
- `title` -- Storybook のサイドバーでコンポーネントをグループ化または分類するためのタイトル
- `tags` -- このコンポーネントのドキュメントを自動生成するためのタグ
- `excludeStories` -- ストーリーに必要な追加情報で、Storybook にはレンダリングしないもの
- `args` -- コンポーネントが期待するアクション [args](https://storybook.js.org/docs/essentials/actions#action-args) を定義し、カスタムイベントをモック化する

ストーリーを定義するには、コンポーネント ストーリー フォーマット 3 ( [CSF3](https://storybook.js.org/docs/api/csf) )を使用してテストケースを構築します。このフォーマットは、各テストケースを簡潔に構築するために設計されています。各コンポーネントの状態を含むオブジェクトをエクスポートすることで、テストをより直感的に定義し、ストーリーをより効率的に作成・再利用できます。

Arguments (略して [`args`](https://storybook.js.org/docs/writing-stories/args)) を使用することで、コントロールアドオンを通して、Storybook を再起動することなく、コンポーネントを動的に編集することができるようになります。[`args`](https://storybook.js.org/docs/writing-stories/args) の値が変わるとコンポーネントもそれに合わせて変わります。

`fn()` を使うと、Storybook UI のアクションパネルにクリック時のコールバックが表示されます。つまり、ピン留めボタンを作成したとき、ボタンクリックが成功したかどうかを UI 上で確認できます。

コンポーネントのすべての変化形に同じアクションのセットを渡す必要があるため、それらを 1 つの `TaskData` 変数にまとめて、毎回ストーリー定義に渡すのが便利です。`TaskData` をまとめるもう 1 つの利点は、それを `export` して、このコンポーネントを再利用する別のコンポーネントのストーリーで使えることです。これについては後ほど説明します。

## 設定する

作成したストーリーを認識させたり、CSS ファイル (`src/index.css`にあります) を Storybook 上で使用できるようにするため、Storybook の設定をいくつか変更する必要があります。

まず、設定ファイル (`.storybook/main.ts`) を以下のように変更してください。

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/vue3-vite'

const config: StorybookConfig = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.ts'],
  staticDirs: ['../public'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
```

上記の変更が完了したら、`.storybook` フォルダー内の `preview.ts` を、以下のように変更してください。

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/vue3-vite'

+ import '../src/index.css'

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters) は Storybook の機能やアドオンの振る舞いをコントロールするのに使用します。今回はアプリケーションの CSS ファイルをインポートするために利用します。

Storybook のサーバーを再起動すると、タスクの 3 つの状態のテストケースが生成されているはずです:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 状態を作り出す

ここまでで、Storybook のセットアップが完了し、スタイルをインポートし、テストケースを作りました。早速、デザインに合わせてコンポーネントの HTML を実装していきましょう。

今のところコンポーネントは簡素な状態です。まずはデザインを実現するために最低限必要なコードを書いてみましょう:

```html:title=src/components/Task.vue
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
import { computed } from 'vue'

type TaskData = {
  id: string
  title: string
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED'
}

type TaskProps = {
  /** Composition of the task */
  task: TaskData
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void
}

const props = withDefaults(defineProps<TaskProps>(), {
  task: { id: '', title: '', state: 'TASK_INBOX' },
})

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

追加したマークアップとインポートした CSS により以下のような UI ができます:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## データ要件を明示する

コンポーネントの構築を続けていく中で、TypeScript の型を定義して `Task` コンポーネントが期待するデータの形状を明示できます。こうすることで、エラーを早期に発見でき、複雑さが増してもコンポーネントが正しく使われるようになります。まず `src` フォルダに `types.ts` ファイルを作成し、既存の `TaskData` 型をそこに移動しましょう:

```ts:title=src/types.ts
export type TaskData = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
```

次に、`Task` コンポーネントを更新して、新しく作成した型を使用するようにします:

```html:title=src/components/Task.vue
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

## 完成！

これでサーバーを起動したり、フロントエンドアプリケーションを起動したりすることなく、コンポーネントを作りあげることができました。次の章では、Taskbox の残りのコンポーネントを、同じように少しずつ作成します。

見た通り、コンポーネントを切り離して開発を始めるのは、迅速かつ簡単です。あらゆる状態を掘り下げてテストできるので、高品質で、バグが少なく、洗練された UI を作ることができることでしょう。

<div class="aside">
💡 Git へのコミットを忘れずに行ってください！
</div>
