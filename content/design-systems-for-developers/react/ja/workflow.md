---
title: 'デザインシステムのためのワークフロー'
tocTitle: 'ワークフロー'
description: 'フロントエンド開発者のためのデザインシステムワークフローの概要'
commit: ab64b4c
---

いかにフロントエンドツールに取り組むかは最終的に価値のあるデザインと開発チームが現実化するかに重要なインパクトがあります。うまくできると、UI コンポーネントを開発し再利用することが円滑になります。

本章では新しいコンポーネントである AvatarList の導入による 5 つのステップのワークフローを紹介します。

![Design system workflow](/design-systems-for-developers/design-system-workflow-horizontal.jpg)

## 構築

`AvatarList`は複数のアバターを表示するコンポーネントです。他のデザインシステムコンポーネントのように、`AvatarList`は多くのプロジェクトへ貼り付けられることから始まります、それがデザインシステムへ取り込む十分な理由です。このデモでコンポーネントが別のプロジェクトで開発され完成したコードに至ったと想定しましょう。

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

最初に、この仕事を追跡する新しいブランチを作成します。

```shell
git checkout -b create-avatar-list-component
```

`AvatarList`コンポーネントとストーリーをあなたの PC へダウンロードして`/src`ディレクトリにそれらを配置します:

- [コンポーネントファイル](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.js)
- [ストーリーファイル](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/716a4c22160eaeaabb8e2c78241f2807844deed0/src/AvatarList.stories.js)

![Storybook with AvatarList component](/design-systems-for-developers/storybook-with-avatarlist-6-0.png)

<div class="aside">
💡 Storybookは<code>*.stories.js</code>で終わるファイルを自動的に検知してそれらを表示します。
</div>

いいですね！では`AvatarList`をサポートする各 UI の状態と関連付けましょう。一見して、`AvatarList`が`small`と`loading`のような`Avatar`プロパティのいくつかをサポートしているのは明らかです。

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

リストを与えると、多くのアバターを表示します。ストーリーを追加して多数のリストアイテムと少数のリストアイテムで何が起こるか閲覧するストーリーを追加しましょう。

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

できたものを保存してコミットします。

```shell
git commit -am "Added AvatarList and stories"
```

## ドキュメント

Storybook ドキュメントのおかげで、最小の労力でカスタマイズされたドキュメンテーションを手に入れます。他の人が Storybook の Docs タブを参照して AvatarList の使い方を学ぶ助けになります。

![Storybook docs with minimal AvatarList info](/design-systems-for-developers/storybook-docs-minimal-avatarlist.png)

最小限の価値あるドキュメント！AvatarList に使い方の補足的なコンテキストを提供してやや人間味を加えましょう。

```js:title=src/AvatarList.js
/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {
```

サポートされるプロパティについていくつか補足的な詳細を散布します。

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

パイを食べるくらい簡単ですね！今の詳細はこの水準で十分です-–MDX を使っていつでもカスタマイズできます。

![Storybook docs with full AvatarList info](/design-systems-for-developers/storybook-docs-full-avatarlist.png)

ドキュメンテーションは退屈なものである必要はありません。自動化されたツールで、ライティングに直結するために退屈さを取り除きました。

変更をコミットし GitHub へプッシュします。

```shell
git commit -am "Improved AvatarList docs"
```

#### プルリクエストを作成する

`AvatarList`ブランチを GitHub へプッシュしてプルリクエストを作成します：

```shell
git push -u origin create-avatar-list-component
```

それから GitHub へ移動してプルリクエストをオープンします。

![PR created in PR for AvatarList](/design-systems-for-developers/github-pr-create-avatarlist.png)

## レビュー

この時点で、`AvatarList`はデザインシステムへ取り込む候補です。ステークホルダーは機能性と外観が期待に沿うかレビューしなければなりません。

デザインシステムの Storybook は極めて簡単にレビューするための各プルリクエストを自動的に発行します。PR チェックまでスクロールしデプロイされた Storybook へのリンクを見つけます。

![PR check for deployed PR](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

`AvatarList`を発行した Storybook で見つけましょう。ローカルの Storybook に同じものが見えます。

![AvatarList in Storybook online](/design-systems-for-developers/netlify-deployed-avatarlist-stories.png)

発行された Storybook はチームにとって共通の参照ポイントです。早くフィードバックを得るために他のステークホルダーに`AvatarList`へのリンクをシェアしましょう。コードを扱うか開発環境をセットアップする必要がないのであなたを気に入るでしょう。

![Looks good, ship it!](/design-systems-for-developers/visual-review-shipit.png)

数多くのチームと合意に至ることはよく骨折りなエクササイズのように感じます。みんな有効期限切れのコードを参照し、開発環境を持たないか複数のツールでフィードバックをばらまきます。オンラインで Storybook のレビューは URL をシェアするくらい簡単になります。

## テスト

私たちのテストパッケージはコミットのたび背後で実行します。`AvatarList`はシンプルなプレゼンテーショナルコンポーネントで、単体テストは必要ありません。しかし PR チェックを見れば、ビジュアルテストツールである Chromatic はレビューが必要な変更をすでに検知しています。

![Chromatic changes on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes.png)

AvatarList は新しいので、まだビジュアルテストがありません。各ストーリーの基準を追加する必要があります。ビジュアルテストの範囲を広げるために Chromatic で“new stories”を受け入れます。

![Chromatic changes to the AvatarList stories](/design-systems-for-developers/chromatic-avatarlist-changes.png)

完了すると、ビルドが Chromatic で通過します。

![Chromatic changes to the AvatarList stories accepted](/design-systems-for-developers/chromatic-avatarlist-changes-accepted.png)

そうして、順番に、GitHub で PR チェックを更新します。

![Chromatic changes accepted on the GitHub PR check](/design-systems-for-developers/avatarlist-github-pr-checks-chromatic-changes-accepted.png)

テストがうまく更新されました。これ以降、リグレッションがデザインシステムへこそこそ入り込むのは困難でしょう。

## 配布

デザインシステムへ`AvatarList`を加えるプルリクエストをオープンしました。ストーリーを書いて、テストを通過し、ドキュメンテーションがあります。ようやく、デザインシステムパッケージを Auto と npm へ更新する準備が整いました。

プルリクエストに`minor`ラベルを追加しましょう。これはマージの際 Auto にパッケージのマイナーバージョンの更新を伝えます。

![GitHub PR with labels](/design-systems-for-developers/github-pr-labelled.png)

さて PR をマージして、npm 上であなたのパッケージへ移動し、パッケージが更新されるまで数分待ちましょう。

![Package published on npm](/design-systems-for-developers/npm-published-package.png)

上手くいきました！デザインシステムは Github の快適さにより更新されました。コマンドラインを触ったり npm に手間取る必要は一切ありません。AvatarList を使い始めるためにサンプルアプリで`learnstorybook-design-system`の依存関係を更新しましょう。

## 旅の始まり

_Design Systems for Developers_ はプロのフロントエンドチームにより使われるエンド・ツー・エンドのワークフローがあなた自身の開発で有利なスタートが切れるよう焦点を当てました。デザインシステムの成長にともない、チームの求めに応じてこれらのツールを追加、再編成、拡張してゆきましょう。

第 9 章は完成したサンプルコード、補助的な資料、開発者からのよくある質問で締めくくります。
