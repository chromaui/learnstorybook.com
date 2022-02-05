---
title: 'システム設計'
tocTitle: '設計'
description: 'コンポーネントライブラリからデザインシステムを抽出する方法'
commit: '798276b'
---

第 2 章では、既存のコンポーネントライブラリからデザインシステムを抽出します。その過程で、どのコンポーネントがデザインに属するのか決定し開発者が着手時に直面する共通の課題を浮き彫りにします。

大企業では、この活動はデザイン、エンジニアリング、そしてプロダクトチームの協働で行われます。[Chromatic](https://www.chromatic.com/) (Storybook の開発会社)と[Storybook](https://storybook.js.org/)は 3 つ以上の領域に渡り 1400 超のオープンソースの貢献者を擁する活発なフロントエンド基盤を共有しているため、あなたのために当プロセスの概略を伝えていきます。

## 課題

あなたが開発チームで働いているなら、おそらく大きなチームはあまり効率的ではないことに気付いているでしょう。チームが大きくなるにしたがいコミュニケーションロスがはびこります。既存の UI パターンが文書化されないか完全に失われます。それは開発者が新しい機能を開発する代わりに車輪を再生産することを意味します。時が経つにつれ、プロジェクトは 1 回限りのコンポーネントで山積みになります。

私たちはこの困難な状況へ飛び込みました。経験を積んだチームの望ましい意志にも関わらず、UI コンポーネントは終わることなく再開発されるかコピー＆ペーストされていました。UI パターンは外観と機能性の点で同じ源流だと思われていました。各コンポーネントは新参の開発者にとって信頼できる情報源と見なすのは不可能でしたし、まして貢献など無理なものでした。

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## デザインシステムを作成する

デザインシステムはパッケージマネージャ経由で中心的によくメンテナンスされたリポジトリにおいて共通の UI コンポーネントを強固なものにします。開発者は複数のプロジェクト間で同じ UI コードをペーストする代わりに標準化された UI コンポーネントをインポートします。

多くのデザインシステムはゼロから構築されていません。代わりに、いち企業においてデザインシステムとして再パッケージされて用いられる検証済みの UI コンポーネントから作成されます。私たちのプロジェクトも例外ではありません。時間の節約のため既存の本番コンポーネントライブラリからいいとこ取りをしてデザインシステムをステークホルダーへいち早く届けます。

![What's in a design system](/design-systems-for-developers/design-system-contents.jpg)

## デザインシステムはどこにあるのですか？

デザインシステムは別のコンポーネントライブラリだと考えることができます、しかしそれはいちアプリだけではなく組織全体に提供しているのです。デザインシステムは UI の基礎にフォーカスする一方で、特定プロジェクトのコンポーネントライブラリは複合コンポーネントからスクリーンまであらゆる箇所に含まれます。

そういうわけで、デザインシステムはいかなるプロジェクトからも独立しかつ全てのプロジェクトが従属する必要があります。変更はパッケージマネージャで配布されるバージョン管理されたパッケージ経由で組織全体に渡り伝播します。プロジェクトはデザインシステムのコンポーネントを再利用し更に必要であればカスタマイズできます。これらの制約はフロントエンドのプロジェクトを構成する青写真を提供します。

![Who uses a design system](/design-systems-for-developers/design-system-consumers.jpg)

## create-react-app と GitHub でリポジトリをセットアップする

React は[State of JS](https://stateofjs.com/)の調査によると最も人気のあるビューレイヤーです。Storybook の大多数が React を使っているので、それを[create-react-app](https://github.com/facebook/create-react-app)のボイラープレートにそって使います。

コマンドラインで、次のコマンドを実行してください:

```shell
# Clone the files
npx degit chromaui/learnstorybook-design-system-template learnstorybook-design-system

cd learnstorybook-design-system

# Install the dependencies
yarn install
```

<div class="aside">
💡 私たちは<a href="https://github.com/Rich-Harris/degit">degit</a>を使ってGitHubからフォルダーをダウンロードします。手動で行いたい場合は、<a href="https://github.com/chromaui/learnstorybook-design-system-template">ここ</a>でコンテンツを取得できます。
</div>

すべてインストールしたら、それを GitHub(デザインシステムのコードをホストするために使います)へプッシュできます。 GitHub.com にサインインして新しいリポジトリの作成から始めましょう:

![Create a GitHub repository](/design-systems-for-developers/create-github-repository.png)

それから GitHub の案内にしたがい(今のところ空っぽの)リポジトリを作成します:

```shell
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/learnstorybook-design-system.git
git push -u origin main
```

`your-username`はあなたのアカウント名で置き換えるのを忘れずに。

![Initial commit to GitHub repository](/design-systems-for-developers/created-github-repository.png)

<div class="aside">💡デザインシステムの作成に有効な他の方法は生のHTML/CSSを配布、他のビューレイヤーを使用、Svelteでコンポーネントをコンパイル、Webコンポーエントの使用を含みます。チームが機能するものを選択してください。</div>

## 何を含め何を含めないか

デザインシステムは純粋コンポーネントと[プレゼンテーショナルコンポーネント](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)のみを含めるべきです。これらのコンポーネントはどのように UI を表示するか、プロパティに対し排他的に反応するかを取り扱い、アプリ特有のビジネスロジックは含まず、いかなるデータ読み込みも関知しません。これらの特質はコンポーネントが再利用可能であることを許容するために不可欠です。

デザインシステムは組織内の全てのコンポーネントの上位セットではありません。それでは最新の状態を把握するのに頭痛の種となるでしょう。

ユーザプロジェクトにビジネス上の制約をそのままを持たせる必要があると再利用が難しくなるためアプリ固有のコンポーネントにビジネスロジックを含めるべきではありません。

現時点で再利用されない 1 度きりのコンポーネントは省きましょう。それがいつの日かデザインシステムの一部になることをあなたが望んでいるとしても、機敏なチームはなるべく余計なコードのメンテナンスは避けるものです。

## 一覧を作成する

最初のタスクは最も使われるコンポーネントを特定し一覧を作成することです。それはしばしば共通の UI パターンと分かる各種 Web サイトやアプリの画面を手作業で列挙したものを含めます。[Brad Frost](http://bradfrost.com/blog/post/interface-inventory/)や[Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517)のようなデザイナーがコンポーネントを一覧化する手軽な方法を発信しているため当チュートリアルではこれ以上詳細には触れません。

開発者にとって便利な経験則は：

- ある UI パターンが 3 回以上使われているなら、再利用可能な UI コンポーネントになります。
- ある UI パターンが 3 つかそれ以上のプロジェクト/チームで使われているなら、デザインシステムに取り入れます。

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

この方法にしたがい、UI の基礎を最終決定します : アバター、バッジ、ボタン、チェックボックス、インプット、ラジオ、セレクト、テキストエリア、(コード向けの)ハイライト、アイコン、リンク、ツールチップ、などなど。これらの組み立てブロックはクライアントアプリにて無数の固有な特徴とレイアウトを構築するために様々な方法で設定されます。

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

私たちはリポジトリをより簡潔に説明するために当チュートリアル向けのコンポーネントのサブセットを選びました。いくつかのチームはまたテーブルやフォームのような他のコンポーネントに対してはサードパーティコンポーネントをデザインシステムに含めます。

<div class="aside">💡 CSS-in-JS: 私たちは<a href="https://www.styled-components.com">styled-components</a>を使っています、コンポーネントのスコープ化ができるライブラリです。それはクラスを手動で絞り込むこと、CSSモジュール、等を含むコンポーネントをスタイリングするための有効な方法です。</div>

UI コンポーネントに加え、タイポグラフィ、色、スペーシングなどのスタイリング定数を含めることは意味があります、それはプロジェクトを横断して再利用されます。デザインシステムにおいてグローバルスタイル変数の命名体系は「デザイントークン」と呼ばれています。当ガイドではデザイントークンを支える理論は深掘りしませんが、オンラインで詳しく学べます(こちらに[良い記事](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)があります)。

## 開発を始めましょう

私たちは何を構築しどう適用するか定義しました。今が取り掛かる時です。第 3 章では、デザインシステムの基本的な道具の土台を作ります。私たちの UI コンポーネントのむきだしなディレクトリは Storybook の手助けにより一覧化され見える化されます。
