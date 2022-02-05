---
title: 'ステークホルダーに向けたドキュメント'
tocTitle: 'ドキュメント'
description: 'デザインシステムを推し進めるドキュメント'
commit: '107bb03'
---

[専門的な](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system)[フロントエンド](https://segment.com/blog/driving-adoption-of-a-design-system/)[チーム](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7)はデザインシステムの成功を採択によって測ります。デザインシステムから最大限に仕事の省力化の恩恵を得るために、コンポーネントは広く循環しなければなりません。そうでなければ、何の意味があるのでしょうか?

本章では、ステークホルダーがアプリでコンポーネントを再利用する助けとなるデザインシステムの「ユーザマニュアル」を作成します。その過程で、Shopify、Microsoft、Auth0、イギリス政府のチームによる UI ドキュメンテーションのベストプラクティスを明らかにします。

![Generate docs with Storybook automatically](/design-systems-for-developers/design-system-generate-docs.jpg)

## ドキュメンテーションは疲れる

ドキュメンテーションは協働的な UI 開発にとって計り知れない価値があります - それは明らかです。共通の UI コンポーネントを使うためどのようにいつ学ぶかの手助けをしてくれます。しかしなぜ労力がかかるのでしょうか？

ドキュメントを作成したことがあるなら、おそらくサイト基盤のような文書の無いタスクやテクニカルライターとの言い合いに時間をつぶすでしょう。たとえドキュメントを発行する時間があっても、新しいフィーチャーを開発する間にドキュメントを維持するためにへとへとになります。

**多くのドキュメントは作成された瞬間に有効期限切れ。** 期限切れのドキュメントはデザインシステムコンポーネントの信頼を損ないます、結果的に開発者はありものを再利用する代わりに新しいコンポーネントの作成を選ぶことになります。

## 必要条件

私たちのドキュメントは作成と維持との切り離せないあつれきを乗り越えなけばなりません。こちらがなすべきことです：

- **🔄 最新版のままにする**ために最新の本番コードを使います
- **✍️ ライティングを促進する**ためにマークダウンのような使い慣れたライティングツールを使います
- **⚡️ メンテナンス時間を減らす**ことでチームがライティングに集中できるようにします
- **📐 ボイラープレートを提供する**ことで開発者が共通のパターンをリライトしないようにします
- **🎨 カスタマイズ性を提供します**、特に複雑なユースケースとコンポーネントのために

Storybook ユーザーとして、私たちは先行スタートを切っています、なぜならコンポーネントのバリエーションはすでにストーリー--ドキュメンテーションの形式として記録されているからです。ストーリーはどのようにコンポーネントが異なるインプット(プロパティ)を与えて働くのかを披露します。ストーリーは本番コンポーネントであるため書くことが簡単で自動更新してくれます。そのうえ、ストーリーは前の章のツールを使ったリグレッションテストになるのです！

> ストーリーを書くと無料でプロパティのドキュメンテーションと使用例が手に入るんだ！ – Justin Bennett、Artsy のエンジニア

## ストーリーを書き、ドキュメントを生成する

Storybook のドキュメントアドオンで、メンテナンスの時間を減らすために存在するストーリーからリッチなドキュメントを生成して最初から独創的になれます。
[構築](/design-systems-for-developers/react/ja/build/)の章(コントロールとアクション)で紹介したアドオンのように、ドキュメントアドオンもまた各 Storybook のインストールに含まれ設定されています、そのためライティングとドキュメンテーションに集中できます。

Storybook を開くと、2 つのタブを見ることができます:

- 🖼️ “Canvas”タブはコンポーネントの開発環境です。
- 📝 “Docs”タブはコンポーネントのドキュメントです。

![Storybook docs tab](/design-systems-for-developers/storybook-docs-6-0.png)

背後で、Storybook ドキュメントは各コンポーネントに新しい「Docs」タブを作成します。タブをインタラクティブなプレビュー、ソースコードビューア、パラメータテーブルのようなドキュメンテーションでよく使われる部品を追加します。Shopify や Auth0 のデザインシステムのドキュメンテーションに同様の特徴を見つけることができます。すべて 2 分とかかりません。

## ドキュメンテーションを拡張する

今のところ、小さな労力で多くの改善を果たしました。しかし、ドキュメンテーションはそれでも _人の_ 手触りを欠いています。他の開発者向けにもっとコンテキスト(なぜ、いつ、どのように)を与える必要があります。

コンポーネントドキュメントを説明する更なるメタデータを追加をはじめましょう。`src/Avatar.stories.js`に、Avatar の用途を記述するサブタイトルを加えます:

```diff:title=src/Avatar.stories.js
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
  * More on Storybook argTypes at:
  * https://storybook.js.org/docs/react/api/argtypes
  */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium", 'large'],
    },
  },
  /*
  * More on Storybook parameters at:
  * https://storybook.js.org/docs/react/writing-stories/parameters#component-parameters
  */
+ parameters: {
+   componentSubtitle: 'Displays an image that represents a user or organization',
+ },
};
```

次に、[JSdoc](https://jsdoc.app/)に Avatar コンポーネント(`src/Avatar.js`に)明確な説明を提供します：

```js:title=src/Avatar.js
/**
- Use an avatar for attributing actions or content to specific users.
- The user's name should always be present when using Avatar – either printed beside the avatar or in a tooltip.
**/
export function Avatar({ loading, username, src, size, ...props }) {
```

次のように見えるはずです：

![Storybook docs tab with component details](/design-systems-for-developers/storybook-docspage-6-0.png)

Storybook ドキュメントは型とデフォルト値を表示する引数テーブルを自動的に生成します。便利ですが、`Avatar`が見せかけだけのものではないと示すことにはなりません – いくつかの引数(プロパティ)は間違えて使われます。自動生成される引数テーブルに描画するため`propTypes`にコメントを追加しましょう。

```js:title=src/Avatar.js
Avatar.propTypes = {
  /**
    Use the loading state to indicate that the data Avatar needs is still loading.
    */
  loading: PropTypes.bool,
  /**
    Avatar falls back to the user's initial when no image is provided.
    Supply a `username` and omit `src` to see what this looks like.
    */
  username: PropTypes.string,
  /**
    The URL of the Avatar's image.
    */
  src: PropTypes.string,
  /**
    Avatar comes in four sizes. In most cases, you'll be fine with `medium`.
    */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

デフォルトでは、どの`Avatar`ストーリーも docs 内に描画されますが、私たちは他の開発者がストーリーが何を示しているかを推し量ることができません。`src/Avatar.stories.js`のストーリー向けに解説的な文章を書きましょう：

```diff:title=src/Avatar.stories.js
import React from 'react';

import { Avatar } from './Avatar';

export default {
  title: 'Design System/Avatar',
  component: Avatar,
  /*
  * More on Storybook argTypes at:
  * https://storybook.js.org/docs/react/api/argtypes
  */
  argTypes: {
    size: {
      control: {
        type: 'select',
      },
      options: ['tiny', 'small', 'medium', 'large'],
    },
  },
  parameters: {
    componentSubtitle:
      'Displays an image that represents a user or organization',
  },
};

// Other Avatar stories

export const Sizes = (args) => (
  <div>
    <Avatar {...args} size="large" />
    <Avatar {...args} size="medium" />
    <Avatar {...args} size="small" />
    <Avatar {...args} size="tiny" />
  </div>
);

/*
 * More on component Storybook args at
 * https://storybook.js.org/docs/react/writing-stories/args#story-args
 */
Sizes.args = {
  username: 'Tom Coleman',
  src: 'https://avatars2.githubusercontent.com/u/132554',
};

/*
 * More on component Storybook parameters at:
 * https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters
 */
+ Sizes.parameters = {
+   docs: {
+     // The story now contains a description
+     storyDescription: '4 sizes are supported.',
+   },
+ };
```

<video autoPlay muted playsInline loop>
  <source
    src="/design-systems-for-developers/storybook-docspage-expanded-6-0.mp4"
    type="video/mp4"
  />
</video>

#### Markdown/MDX でドキュメンテーションを強化する

すべてのコンポーネントは異なります、ドキュメンテーションの要件もそうです。私たちはベストプラクティスなドキュメンテーションを生成するために Storybook Docs を無料で使いました。私たちのコンポーネントに補足的な情報を加え了解事項を明確にしましょう。

マークダウンはテキストを書くための直感的なフォーマットです。MDX はマークダウンの中でインタラクティブなコード(JSX)を使えるようにします。Storybook Docs は MDX を使って開発者にドキュメンテーション描画の究極的な制御を提供します。

Storybook のインストールワークフローの一部として、MDX ファイルはデフォルトで登録されています。`.storybook/main.js`は次のように見えるでしょう:

```js:title=.storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

新しい`src/Avatar.stories.mdx`ファイルを作成して詳細を提供しましょう。`Avatar.stories.js`ファイルを削除して mdx ファイルにストーリーを再作成します：

<!-- prettier-ignore-start -->

```js:title=src/Avatar.stories.mdx
import { Canvas, Meta, Story } from "@storybook/addon-docs";

import { Avatar } from "./Avatar";

<Meta
  title="Design System/Avatar"
  component={Avatar}
  argTypes={{
    loading: {
      control: "boolean",
      description:
        "Use the loading state to indicate that the data Avatar needs is still loading.",
      table: {
        type: { summary: "boolean" },
        defaultValue: { summary: false },
      },
    },
    username: {
      description:
        "Avatar falls back to the user’s initial when no image is provided. Supply a `username` and omit `src` to see what this looks like.",
      table: {
        defaultValue: {
          summary: "loading",
        },
      },
    },
    src: {
      description: "The URL of the Avatar's image.",
      table: {
        defaultValue: {
          summary: null,
        },
      },
    },
    size: {
      description:
        "Avatar comes in four sizes. In most cases, you’ll be fine with `medium`.",
      table: {
        defaultValue: {
          summary: "medium",
        },
      },
    },
  }}
/>

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users.

The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

export const Template = (args) => <Avatar {...args} />;

<Story
  name="standard"
  args={{
    size: "large",
    username: "Tom Coleman",
    src: "https://avatars2.githubusercontent.com/u/132554",
  }}
>
  {Template.bind({})}
</Story>

### Sizes

4 sizes are supported.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### Default Values

When no image is supplied to the `src` prop, Avatar displays initials.

Avatar should be used sparingly in situations without access to images.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

The loading state is used when the image or username is, well, loading.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Experiment with this story with the Controls addon in the Canvas tab.

<Canvas>
  <Story
    name="controls"
    args={{
      loading: false,
      size: "tiny",
      username: "Dominic Nguyen",
      src: "https://avatars2.githubusercontent.com/u/263385",
    }}
  >
    {Template.bind({})}
  </Story>
</Canvas>
```

<!-- prettier-ignore-end -->

Storybook では、Avatar コンポーネントの「Docs」タブがとぼしい MDX のページに置き換わっています。

![Storybook docs from MDX](/design-systems-for-developers/storybook-docs-mdx-initial-6-0.png)

Storybook Docs は[“Doc Blocks”](https://storybook.js.org/docs/react/writing-docs/doc-blocks)、インタラクティブプレビュー、引数テーブル等のような既製コンポーネントと一緒になっています。デフォルトで、ドキュメントページを自動生成するために裏で使われており、また個別用途としても抜き出せます。私たちのゴールはすべてを自分たちでやり直すことなく Avatar のドキュメントをカスタマイズすることで出来るところから Doc Blocks を再利用しましょう。

[`ArgsTable`](https://storybook.js.org/docs/react/writing-docs/doc-blocks#mdx)ドキュメントブロックを追加し`Canvas`にはじめのストーリーをラッピングしましょう。

```js:title=src/Avatar.stories.mdx
import { ArgsTable, Canvas, Meta, Story } from "@storybook/addon-docs";

# Same content as before

<Canvas>
  <Story
    name="standard"
    args={{
      size: "large",
      username: "Tom Coleman",
      src: "https://avatars2.githubusercontent.com/u/132554",
    }}
  >
    {Template.bind({})}
  </Story>
</Canvas>

<ArgsTable story="standard" />
```

![Storybook docs from MDX with blocks](/design-systems-for-developers/storybook-docs-mdx-docblocks-6-0.png)

いいですね！始めたところに戻ってきましたが、今度は順序と内容全般で完全なコントロールをしています。Doc Blocks を使っているため自動化されたドキュメント生成の恩恵を維持しています。

ユースケースの注釈を Avatar のドキュメントに加えましょう。それは開発者にこのコンポーネントの利点に関するコンテキストを提供します。他のマークダウンドキュメントにするようにマークダウンを加えることができます：

```js:title=src/Avatar.stories.mdx

// Same content as before

<ArgsTable story="standard" />

## Usage

Avatar is used to represent a person or an organization. By default the avatar shows an image and gracefully falls back to the first initial of the username. While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data. Avatars can be grouped with the AvatarList component.

### Sizes

// Same content as before
```

![Storybook docs for MDX with usage info](/design-systems-for-developers/storybook-docs-mdx-usage-6-0.png)

#### カスタムページ

どのデザインシステムもカバーページがあります。Storybook Docs は MDX を使って別のページを作成できます。

新しい`src/Intro.stories.mdx`ファイルを作成しましょう：

```js:title=src/Intro.stories.mdx
import { Meta } from "@storybook/addon-docs";

<Meta title="Design System/Introduction" />

# Introduction to the Storybook design system tutorial

The Storybook design system tutorial is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/), created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more in the [Storybook tutorials](https://storybook.js.org/tutorials/).
```

先に自動化されたコンポーネントドキュメントから独立した新しいドキュメントのみのページを生成します。

![Storybook docs with introduction page, unsorted](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

最初に表示するよう、Storybook に`.storybook/main.js`にイントロダクションファイルをロードするよう伝える必要があります：

```diff:title=.storybook/main.js
module.exports = {
  // Changes the load order of our stories. First loads the Intro page
  // automatically import all files ending in *.stories.js|mdx
  stories: [
+   '../src/Intro.stories.mdx',
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  staticDirs: ['../public'],
};
```

![Storybook docs with introduction page](/design-systems-for-developers/storybook-docs-introduction-6-0.png)

## オンラインでドキュメンテーションを発行する

誰も読まないドキュメンテーションを書くなら、それは役に立つでしょうか？いいえ。高品質な学習教材を作成するには十分ではなく、ステークホルダーと同僚へ教材を提供する必要があります。今や、私たちのドキュメントがリポジトリに入ります、それはみんながドキュメントを見るためにローカルにデザインシステムの Storybook を実行させる必要があることを意味します。

前の章で、ビジュアルレビューのため Storybook を発行しました。同様にコンポーネントドキュメントを発行するために同じメカニズムを使うため簡単です。Storybook をドキュメントモードで構築するために`package.json`に新しいスクリプトを追加しましょう：

```json:title=package.json
{
  "scripts": {
    "build-storybook-docs": "build-storybook  --docs"
  }
}
```

保存しコミットします。

コマンドラインで`build-storybook-docs`を実行するか継続的インテグレーション(CI)ツールで"docs"設定に静的サイトを出力します。コミットごとにドキュメントサイトをデプロイするために[Netlify](https://www.netlify.com/)または[Vercel](https://vercel.com/)をセットアップしましょう。

<div class="aside">💡 デザインシステムの成長にしたがい、カスタムツールを許可したりGatsbyやNextのようなツールを使って自前の静的サイトを構築する組織固有の要件に遭遇するかもしれません。マークダウンとMDXを他のソリューションへ移すのは簡単です。</div>

## 他のアプリにデザインシステムをインポートする

これまで、内側に焦点を当ててきました。最初は、耐久性のある UI コンポーネントの作成です。それから、レビュー、テスト、ドキュメンテーションでした。いま私たちはチームがデザインシステムを使うのを検討するために外側へ視点をシフトします。

第 7 章は他のアプリで使うためのデザインシステムのパッケージングをデモンストレーションします。Auto、時間を節約するリリースマネジメントツール、を使って npm、JavaScript パッケージマネージャー、を合成する方法を学びましょう。
