---
title: '品質を保つためのテスト'
tocTitle: 'テスト'
description: 'デザインシステムの見た目、機能性、アクセシビリティをテストする方法'
commit: '5f69e5c'
---

第 5 章では、UI バグを防ぐためにデザインシステムのテストを自動化します。本章で UI コンポーネントのどのような特徴がテストを保証するのか、潜在的な落とし穴を避けるのかについて掘り下げます。包括的なカバレッジ、分かりやすいセットアップ、コストの低いメンテナンスに釣り合いを取るテスト戦略をそれぞれ手に入れるため Wave、BBC、Salesforce の専門家チームを調査しました。

<img src="/design-systems-for-developers/ui-component.png" width="250">

## UI コンポーネントテストの基本

始める前に、テストの意味を理解しましょう。デザインシステムは UI コンポーネントで構成されています。各 UI コンポーネントはインプット (props) のセットを与えられ意図したルック＆フィールを記述するストーリー (順列) を含みます。ストーリーはそれからエンドユーザーのブラウザまたはデバイスで描画されます。

![Component states are combinatorial](/design-systems-for-developers/component-test-cases.png)

うわぁ！見ての通り、ひとつのコンポーネントに沢山の状態を含みます。デザインシステムコンポーネントの数に状態を掛け合わせると、なぜ全てを追跡することが大変苦しいタスクなのかが分かるでしょう。実際、手作業でそれぞれのユーザー体験をレビューすることは、特にデザインシステムが成長していくと、維持できないものです。

だからこそ**今**テストの自動化をセットアップして**未来**の仕事を減らすことに意味があるのです。

## テストの準備

私は[前の記事](https://www.chromatic.com/blog/the-delightful-storybook-workflow)で専門的な Storybook のワークフローについて 4 つのフロントエンドチームを調査しました。彼らはテストを簡単で包括的にするストーリーを書くため次のベストプラクティスに賛同してくれました。

**サポートされたコンポーネントの状態を明確にすること**はどの入力の組み合わせが与えられた状態を引き起こすのか明らかにします。 ノイズを避けるためにサポートされない状態をきっぱり省きます。

**一貫してコンポーネントを描画すること**はランダムな (Math.random()) または相対的な (Date.now()) 入力によりトリガーされる変異性を軽減します

> “最適なストーリーはコンポーネントが野生の中で遭遇しうる全てのコンポーネントの状態を提供することだ。” – Tim Hingston、Apollo GraphQL のテックリード

## ビジュアルテストの外観

デザインシステムはプレゼンテーショナルなコンポーネントを含みます、それは本質的にビジュアルを含んだものです。ビジュアルテストは描画された UI の視覚的な側面を検証します。

ビジュアルテストは一貫したブラウザ環境で各コンポーネントのイメージをキャプチャします。新しいスクリーンショットは前に受け入れられた基準のスクリーンショットと自動的に比較されます。

![Visual test components](/design-systems-for-developers/component-visual-testing.gif)

もしあなたがモダンな UI を構築しているなら、ビジュアルテストは時間を浪費する手作業のレビューからフロントエンドチームを助けコストの高い UI のリグレッションを防ぎます。

<a href="https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/#publish-storybook">前の章</a>で [Chromatic](https://www.chromatic.com/) を使って Storybook を配信する方法を学びました。各`Button`コンポーネントの周りに太い赤線を加えそれからチームメイトからのフィードバックをリクエストしました。

![Button red border](/design-systems-for-developers/chromatic-button-border-change.png)

これから Chromatic にビルトインされている[テストツール](https://www.chromatic.com/features/test)を使ったビジュアルテストがどう働くか見てみましょう。プルリクエストを作成したら、Chromatic は変更内容のイメージをキャプチャし同じコンポーネントの前のバージョンと比較しました。4 つの変更点が見つかりました:

![List of checks in the pull request](/design-systems-for-developers/chromatic-list-of-checks.png)

**🟡 UI Tests**をクリックしてレビューしましょう。

![Second build in Chromatic with changes](/design-systems-for-developers/chromatic-second-build-from-pr.png)

変更点が意図的なもの (改善) なのか意図しないもの (バグ) なのか確認のためにレビューしましょう。変更点を受け入れたら、テスト基準が更新されます。それは後続のコミットがバグを見つけるために新しい基準と比較されることを意味します。

![Reviewing changes in Chromatic](/design-systems-for-developers/chromatic-review-changes-pr.png)

前の章で、チームメイトが何らかの理由で `Button` の周りに赤い線を引くことを望みませんでした。元に戻す必要があることを示すために変更を否決しましょう。

![Review deny in Chromatic](/design-systems-for-developers/chromatic-review-deny.png)

変更を取り消し再度ビジュアルテストを通すために再コミットしましょう。

## ユニットテストの役割

ユニットテストは UI コードが制御されたインプットを与えられて正しいアウトプットを返すかどうかを検証します。ユニットテストはコンポーネントに沿って特定の機能性を検証する手助けをします。

React、Vue、Angular のようなモダンなビューレイヤーにおいて全てはコンポーネントです。コンポーネントは地味なボタンから凝ったデートピッカーまで様々な機能性をカプセル化します。コンポーネントが複雑になればなるほど、ビジュアルテストだけで差異を捕捉するのに手こずります。だからユニットテストが必要なのです。

![Unit test components](/design-systems-for-developers/component-unit-testing.gif)

例えば、私たちの Link コンポーネントはリンク URL を生成するシステム (ReactRouter、Gatsby、Next.js の「LinkWrapper」) と組み合わせると少し複雑です。実装のミスが href に不正な値が入っているリンクを生み出す可能性があります。

視覚的に、`href`属性が存在し、正しい場所を指しているか見るのは不可能です、それがユニットテストがリグレッションを避けるために適切になり得る理由です。

#### href のユニットテスト

`Link`コンポーネントにユニットテストを追加しましょう。 [Create React App](https://create-react-app.dev/) はすでにユニットテストの環境をセットアップしており、単純に`src/Link.test.js`ファイルを作成するだけでテストができます:

```js:title=src/Link.test.js
import { render } from '@testing-library/react';
import { Link } from './Link';

test('has a href attribute when rendering with linkWrapper', () => {
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  const LinkWrapper = props => <a {...props} />;
  const { container } = render(
    <Link href="https://storybook.js.org/tutorials/" LinkWrapper={LinkWrapper}>
      Link Text
    </Link>
  );

  const linkElement = container.querySelector('a[href="https://storybook.js.org/tutorials/"]');
  expect(linkElement).not.toBeNull();
  expect(linkElement.textContent).toEqual('Link Text');
});
```

`yarn test`コマンドで上記ユニットテストを実行できます。

![Running a single Jest test](/design-systems-for-developers/jest-test.png)

事前に、Storybook をデプロイするために GitHub アクションを設定しました、そして今アクションにテストを含めるよう調整できます。貢献者はこのユニットテストから恩恵を受け、Link コンポーネントはリグレッションに対して強固なものとなるでしょう。

```diff:title=.github/workflows/chromatic.yml
# ... Same as before
jobs:
  test:
    # The operating system it will run on
    runs-on: ubuntu-latest
    # The list of steps that the action will go through
    steps:
      - uses: actions/checkout@v1
      - run: yarn
+     - run: yarn test # Adds the test command
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/design-systems-for-developers/react/en/review/ to obtain it
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

![Successful circle build](/design-systems-for-developers/gh-action-with-test-successful-build.png)

<div class="aside"> 💡 <strong>注意事項: </strong>更新が面倒になる多過ぎるユニットテストに注意してください。適度なデザインシステムのユニットテストを推奨します。</div>

> "私たちの高度に自動化されたテスト体制はデザインシステムチームがより自信を持って早く動けるよう力を与える。" – Dan Green-Leipciger、Wave のシニアソフトウェアエンジニア

## アクセシビリティテスト

「アクセシビリティが意味するのは全ての人が、障害を持つ人をふくめ、アプリを理解し、操作し、インタラクションできることだ...オンラインでは、タブキーとスクリーンリーダーでサイトを渡り歩くといったような、コンテンツにアクセスするための別の方法もある。」 と述べるのは開発者の [T.Rowe Price の Alex Wilson](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347) です。

[世界保健機構](https://www.who.int/disabilities/world_report/2011/report/en/)によると人口の 15 パーセントが障害の影響を受けています。デザインシステムはユーザーインターフェースの構築ブロックを含むためアクセシビリティに大きな影響があります。たった一つのコンポーネントのアクセシビリティを改善するだけで、会社全体にわたって、そのコンポーネントのすべてのインスタンスに利があります。

![Storybook accessibility addon](/design-systems-for-developers/storybook-accessibility-addon.png)

リアルタイムに Web のアクセシビリティ標準 (WCAG) を検証するツールである Storybook の Accessibility アドオンを使って包括的な UI において優位に立ちましょう。

```shell
yarn add --dev @storybook/addon-a11y

```

`.storybook/main.js`にアドオンを追加します:

```diff:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
+   '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

`.storybook/preview.js`の[パラメータ](https://storybook.js.org/docs/react/writing-stories/parameters)を更新して次の`a11y`設定を追加します:

```diff:title=.storybook/preview.js

import React from 'react';

import { GlobalStyle } from '../src/shared/global';

/*
* More on Storybook global decorators at:
* https://storybook.js.org/docs/react/writing-stories/decorators#global-decorators
*/
export const decorators = [
  Story => (
    <>
      <GlobalStyle />
      <Story />
    </>
  ),
];

/*
* More on Storybook global parameters at:
* https://storybook.js.org/docs/react/writing-stories/parameters#global-parameters
*/
+ export const parameters = {
+   actions: { argTypesRegex: '^on[A-Z].*' },
+   // Storybook a11y addon configuration
+   a11y: {
+     // the target DOM element
+     element: '#root',
+     // sets the execution mode for the addon
+     manual: false,
+   },
+ };
```

全てセットアップすると、Storybook のアドオンパネルに新しく「Accessibility」タブが見えます。

![Storybook a11y addon](/design-systems-for-developers/storybook-addon-a11y-6-0.png)

そこに DOM エレメントのアクセシビリティレベル [Violations (違反) と Passes (合格)] を表示します。「Highlight results」チェックボックスを押して UI コンポーネントがある場所に違反を表示します。

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-addon-a11y-6-0-highlighted.mp4"
    type="video/mp4"
  />
</video>

ここから、アドオンのアクセシビリティの推奨に従いましょう。

## その他のテスト戦略

逆説的ですが、テストは時間を節約できますが、その保守により開発速度は停滞します。すべてではなく、適切なものをテストするよう判断しましょう。ソフトウェア開発には多くのテスト手法がありますが、いくつかはデザインシステムに合わないことを痛感しました。

#### スナップショットテスト (Jest)

これは UI コンポーネントのコード出力をキャプチャし前のバージョンと比較するテクニックです。UI コンポーネントのマークアップのテストは実装の詳細 (コード) をテストすることになります、ブラウザでユーザー体験をテストするものではありません。

コードスナップショットの差分は予測不可能で擬陽性になる傾向があります。コンポーネントレベルで、コードのスナップショットはデザイントークン、CSS、サードパーティの API の更新 (Web フォント、Stripe フォーム、Google マップ、等) のような全体的な変更の理由を説明するものではありません。実際には、開発者は「全て承認する」かスナップショットテストを完全に無視することになります。

> 多くのコンポーネントスナップショットテストは実際スクリーンショットテストの悪いバージョンだ。アウトプットをテストしよう。描画したスナップショットで、背後にある (気まぐれな！) マークアップではなく。 – Mark Dalgliesh、SEEK のフロントエンド基盤、CSS モジュールのクリエイター

#### エンドツーエンドテスト (Selenium、Cypress)

エンドツーエンドテストはユーザーフローをシミュレートするためにコンポーネントを行き来します。サインアップやチェックアウトのプロセスのようなアプリのフローを検証するのに最も適しています。機能が複雑になればなるほど、このテスト戦略は役に立ちます。

デザインシステムは比較的簡単な機能を持った Atomic コンポーネントを含みます。ユーザーフローの検証はテストに時間を使いすぎメンテナンスしづらいため、タスクの割にしばしば過剰になります。しかしながら、まれな状況において、コンポーネントはエンドツーエンドテストの恩恵を受けられるかもしれません。たとえば、デートピッカーや自前の支払いフォームのような複雑な UI コンポーネントを検証する場合です。

## ドキュメンテーションで採用を推進する

デザインシステムはテストだけでは完全ではありません。組織を横断してデザインシステムをステークホルダーに提供するため、よくテストされた UI コンポーネントから最大限に活用する方法を教える必要があります。

第 6 章では、ドキュメンテーションによりデザインシステムの採用を加速させる方法を学びます。なぜ Storybook Docs が労力をかけず、網羅的なドキュメントを作成するための秘密兵器なのか理解を深めていきましょう。
