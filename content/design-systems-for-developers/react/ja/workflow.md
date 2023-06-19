---
title: 'デザインシステムのためのワークフロー'
tocTitle: 'ワークフロー'
description: 'フロントエンド開発者のためのデザインシステムワークフローの概要'
commit: '9d13d12'
---

いかにフロントエンドのツール群を使いこなすかは、デザインと開発チームが実現しうる究極の価値に大きく影響します。上手くいくと、UI コンポーネントを開発し再利用することが円滑になるはずです。

本章は AvatarList という新しいコンポーネントの導入によるワークフローの 5 つのステップを紹介します。

![Design system workflow](/design-systems-for-developers/design-system-workflow-horizontal.jpg)

## ビルド

`AvatarList` は複数のアバターを表示するコンポーネントです。他のデザインシステムのコンポーネントのように、`AvatarList` は数多くのプロジェクトで貼り付けられるところから始まりました。それがデザインシステムへ導入するには十分な理由です。当デモのため、コンポーネントが他のプロジェクトで開発され完成コードがすでにあるとしましょう。

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

最初に、この作業を追跡する新しいブランチを作成してください。

```shell
git checkout -b create-avatar-list-component
```

あなたの PC に `AvatarList` コンポーネントとストーリーをダウンロードして `/src` ディレクトリに配置します:

- [コンポーネントファイル](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.js)
- [ストーリーファイル](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.stories.js)

![Storybook with AvatarList component](/design-systems-for-developers/storybook-with-avatarlist-6-0.png)

<div class="aside">
💡 Storybook は <code>*.stories.js</code> で終わるファイルを自動的に検知して設定し UI 上に表示します。
</div>

いいですね！では `AvatarList` に支えられる各 UI の状態と関連付けましょう。見たところ、`AvatarList` が `small` と `loading` のような `Avatar` プロパティをいくつかサポートしているのは明らかです。

```js:title=src/AvatarList.stories.js
export const SmallSize = Template.bind({});
SmallSize.args = {
  users: Short.args.users,
  size: 'small',
};

export const Loading = Template.bind({});
Loading.args = {
  loading: true,
};
```

![Storybook with more AvatarList stories](/design-systems-for-developers/storybook-with-avatarlist-loading-6-0.png)

プロパティがリストなら、多数のアバターを表示するべきです。多数と少数のリストアイテムを表示するストーリーを追加しましょう。

```js:title=src/AvatarList.stories.js
export const Ellipsized = Template.bind({});
Ellipsized.args = {
  users: [
    ...Short.args.users,
    {
      id: '3',
      name: 'Zoltan Olah',
      avatarUrl: 'https://avatars0.githubusercontent.com/u/81672',
    },
    {
      id: '4',
      name: 'Tim Hingston',
      avatarUrl: 'https://avatars3.githubusercontent.com/u/1831709',
    },
  ],
};

export const BigUserCount = Template.bind({});
BigUserCount.args = {
  users: Ellipsized.args.users,
  userCount: 100,
};

export const Empty = Template.bind({});
Empty.args = {
  users: [],
};
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-with-all-avatarlist-stories-6-0.mp4"
    type="video/mp4"
  />
</video>

進んだものを保存してコミットします。

```shell
git commit -am "Added AvatarList and stories"
```

## ドキュメント

Storybook Docs のおかげで、最小限の労力でカスタマイズ可能なドキュメンテーションが手に入ります。他の人が Storybook Docs タブを参照して AvatarList の使い方を学ぶことを助けます。

![Storybook docs with minimal AvatarList info](/design-systems-for-developers/storybook-docs-minimal-avatarlist.png)

最小限の価値あるドキュメント！ AvatarList に使い方の補足的な背景を提供してもう少し親近感を加えましょう。

```js:title=src/AvatarList.js
/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {
```

サポートされるプロパティについていくつか補足的な詳細を書き散らします。

```js:title=src/AvatarList.js
AvatarList.propTypes = {
  /**
   * Are we loading avatar data from the network?
   */
  loading: PropTypes.bool,
  /**
   * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayed.
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    })
  ),
  /**
   * The total number of users, if a subset is passed to `users`.
   */
  userCount: PropTypes.number,
  /**
   * AvatarList comes in four sizes. In most cases, you’ll be fine with `medium`.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

パイを食べるくらい簡単ですね！今のところ、この詳細の水準で十分です—後で MDX を使っていつでもカスタマイズできます。

![Storybook docs with full AvatarList info](/design-systems-for-developers/storybook-docs-full-avatarlist.png)

ドキュメンテーションは面倒である必要はありません。自動化されたツールを使い、すぐにライティングに取りかかるために単調な作業を省きました。

変更をコミットし GitHub へプッシュします。

```shell
git commit -am "Improved AvatarList docs"
```

#### プルリクエストを作成する

`AvatarList` ブランチを GitHub へプッシュしてプルリクエストを作成しましょう:

```shell
git push -u origin create-avatar-list-component
```

それから GitHub へ移動してプルリクエストをオープンします。

![PR created in PR for AvatarList](/design-systems-for-developers/github-pr-create-avatarlist.png)

## レビュー

この時点で、`AvatarList` はデザインシステムに取り込む候補です。ステークホルダーは機能性と見た目が期待通りなのか確かめるためにコンポーネントをレビューしなければなりません。

デザインシステムの Storybook はレビューをごく簡単にするそれぞれのプルリクエストを自動的に発行します。PR チェックまでスクロールしデプロイされた Storybook へのリンクを探してください。

![PR check for deployed PR](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

発行された Storybook で `AvatarList`を探してください。ローカルの Storybook と同じように見えるはずです。

![AvatarList in Storybook online](/design-systems-for-developers/netlify-deployed-avatarlist-stories.png)

発行された Storybook はチームにとって共通の参照ポイントです。より早くフィードバックを得るために他のステークホルダーに `AvatarList` へのリンクをシェアしましょう。コードを読むことに取り掛かったり開発環境をセットアップしたりする必要がないのでチームはあなたを気に入るでしょう。

![Looks good, ship it!](/design-systems-for-developers/visual-review-shipit.png)

多くのチームと合意に至るのはしばしば無駄な活動のように感じます。みんな開発環境を持たないで有効期限切れのコードを参照したり複数のツールをまたがりフィードバックを撒き散らします。オンラインで Storybook のレビューは URL を共有するだけの簡単なものになります。

## テスト

私たちのテストパッケージはコミットのたびに裏で動いています。`AvatarList` はシンプルなプレゼンテーショナルコンポーネントのため、単体テストは必要ありません。しかし PR チェックを見れば、ビジュアルテストツールである Chromatic がすでにレビューが必要な変更を検知しています。

![Chromatic changes on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

AvatarList は新しいため、まだビジュアルテストはありません。ストーリーそれぞれにテスト基準を追加する必要があります。ビジュアルテストの範囲を広げるために Chromatic で “new stories” を受け入れます。

![Chromatic changes to the AvatarList stories](/design-systems-for-developers/chromatic-avatarlist-changes.png)

受け入れが完了すると、 Chromatic でビルドが通るでしょう。

![Chromatic changes to the AvatarList stories accepted](/design-systems-for-developers/chromatic-avatarlist-changes-accepted.png)

それから順次、GitHub で PR チェックが更新されます。

![Chromatic changes accepted on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes-accepted.png)

テストが首尾よく更新されました。今後、リグレッションがデザインシステムへ忍び込むのは難しいでしょう。

## 配布

デザインシステムに `AvatarList` を加えるプルリクエストをオープンしました。ストーリーを書いて、テストを通し、ドキュメンテーションがあります。ようやく、Auto と npm を用いてデザインシステムのパッケージを更新する準備が整いました。

プルリクエストに `minor` ラベルを追加しましょう。これはマージの際 Auto にパッケージのマイナーバージョンの更新を伝えます。

![GitHub PR with labels](/design-systems-for-developers/github-pr-labelled.png)

さてプルリクエストをマージして、npm 上であなたのパッケージへ移動し、パッケージが更新されるまで数分待ちましょう。

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

上手くいきました！デザインシステムのパッケージが Github の快適さにより更新されました。コマンドラインを触ったり npm に手間取る必要は一切ありません。AvatarList を使い始めるためにサンプルアプリで `learnstorybook-design-system` の依存関係を更新しましょう。

## 旅の始まり

_Design Systems for Developers_ はあなた自身の開発が有利なスタートを切れるようプロのフロントエンドチームに使われるエンド・ツー・エンドのワークフローに焦点を当てました。デザインシステムの成長にともない、チームの求めに応じるためこれらのツールを追加、再編成、拡張してゆきましょう。

第 9 章は完成したサンプルコード、参考資料、開発者からのよくある質問で締めくくります。
