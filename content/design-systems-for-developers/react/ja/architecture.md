---
title: 'システム設計'
tocTitle: '設計'
description: 'コンポーネントライブラリーからデザインシステムを抽出する方法'
commit: '5aa78f3'
---

第 2 章では、既存のコンポーネントライブラリーからデザインシステムを抽出します。その過程で、どのコンポーネントがデザインシステムに属するのか決定する過程を通して開発者が着手時に直面する共通の課題を浮き彫りにします。

大企業では、この活動はデザイン、エンジニアリング、そしてプロダクトチームの協働で行われます。[Chromatic](https://www.chromatic.com/) (Storybook の開発会社)と [Storybook](https://storybook.js.org/) は 3 つ以上の領域に渡り 1400 人を超えるオープンソース貢献者に対して、活発なフロントエンド基盤チームを共有していますので、そこでの協働プロセスを説明します。

## 課題

あなたが開発チームで働いているなら、おそらく大きなチームはあまり効率的ではないことに気付いているでしょう。チームが大きくなるにしたがいコミュニケーションロスがはびこります。既存の UI パターンが文書化されず、完全に失われていきます。それは開発者が新しい機能を開発する代わりに車輪を再発明することを意味します。時が経つにつれ、プロジェクトは 1 回限りのコンポーネントで山積みになります。

私たちもこの困難な状況へ飛び込みました。熟練したチームの最適な意向があるにも関わらず、UI コンポーネントは際限なく再開発またはコピー＆ペーストされ続けていました。同じであるべき UI パターンは見た目と機能が分かれてしまいました。各コンポーネントは新参の開発者にとって信頼できる情報源と見なすのは不可能であり、まして貢献など無理と思わせる独特な雪の結晶でした。

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## デザインシステムを作成する

デザインシステムはパッケージマネージャ経由で配布される一つのしっかりとメンテナンスされたリポジトリにて共通の UI コンポーネントを束ねます。開発者は複数のプロジェクト間で同じ UI コードをペーストする代わりに標準化された UI コンポーネントをインポートします。

多くのデザインシステムはゼロから構築されていません。むしろ、それらは検証済みの UI コンポーネントでありデザインシステムとして手直しして会社を横断して使われています。私たちのプロジェクトも例外ではありません。時間の節約のため既存の本番コンポーネントライブラリーからいいとこ取りをしてデザインシステムをステークホルダーへいち早く届けます。

![What's in a design system](/design-systems-for-developers/design-system-contents.jpg)

## デザインシステムはどこにあるのですか？

デザインシステムは、単一のアプリではなく組織全体に向けて提供される、別のコンポーネントライブラリーだと考えることができます。デザインシステムが UI のプリミティブにフォーカスする一方で、特定プロジェクトのコンポーネントライブラリーは複合コンポーネントから画面まですべてが含まれます。

そういうわけで、デザインシステムはいかなるプロジェクトからも独立しかつ全てのプロジェクトが従属する必要があります。変更はパッケージマネージャで配布されるバージョン管理されたパッケージ経由で組織全体に渡り伝播します。プロジェクトはデザインシステムのコンポーネントを再利用し更に必要であればカスタマイズできます。これらの制約はフロントエンドのプロジェクトを構成する青写真を提供します。

![Who uses a design system](/design-systems-for-developers/design-system-consumers.jpg)

## create-react-app と GitHub でリポジトリをセットアップする

React は [State of JS](https://stateofjs.com/) の調査によると最も人気のあるビューレイヤーです。Storybook の大多数が React を使っているので、このチュートリアルでは [create-react-app](https://github.com/facebook/create-react-app) ボイラープレートを使います。

コマンドラインで、次のコマンドを実行してください:

```shell
# Clone the files
npx degit chromaui/learnstorybook-design-system-template learnstorybook-design-system

cd learnstorybook-design-system

# Install the dependencies
yarn install
```

<div class="aside">
💡 私たちは <a href="https://github.com/Rich-Harris/degit">degit</a> を使って GitHub からフォルダーをダウンロードします。手動で行いたい場合は、<a href="https://github.com/chromaui/learnstorybook-design-system-template">ここ</a>でコンテンツを取得できます。
</div>

すべてインストールしたら、それを GitHub (デザインシステムのコードをホストするために使います) へプッシュできます。 GitHub.com にサインインして新しいリポジトリの作成から始めましょう:

![Create a GitHub repository](/design-systems-for-developers/create-github-repository.png)

それから GitHub の案内にしたがい (今のところ空っぽの) リポジトリを作成します:

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

<div class="aside">💡デザインシステムの作成に有効な他の方法は生の HTML/CSS を配布したり、他のビューレイヤーを使用したり、Svelte でコンポーネントをコンパイルしたり、Webコンポーエントの使用を含んだりします。チームに合うものを選択してください。</div>

## 何を含め何を含めないか

デザインシステムは純粋コンポーネントと[プレゼンテーショナルコンポーネント](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)のみを含めるべきです。これらのコンポーネントはどのように UI を表示するかを取り扱い、プロパティに対してのみ反応し、アプリ特有のビジネスロジックは含まず、いかなるデータ読み込みも関知しません。これらの特質はコンポーネントが再利用可能であることを許容するために不可欠です。

デザインシステムは組織内の全てのコンポーネントの上位セットではありません。それでは最新の状態を把握するのに頭痛の種となるでしょう。

コンポーネントが同じビジネス上の制約を持つことをユーザープロジェクトに求めると、再利用がしづらくなるのでビジネスロジックを含むアプリ特有のコンポーネントは含めるべきではありません。

現時点で再利用されない 1 度きりのコンポーネントは省きましょう。それがいつの日かデザインシステムの一部になることをあなたが望んでいるとしても、機敏なチームはなるべく余計なコードのメンテナンスは避けるものです。

## 棚卸をする

最初のタスクは最も使われるコンポーネントを特定し一覧を作成することです。それはしばしば共通の UI パターンと分かる各種 Web サイトやアプリの画面を手作業で列挙したものを含めます。[Brad Frost](http://bradfrost.com/blog/post/interface-inventory/) や [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517) のようなデザイナーがコンポーネントを一覧化する手軽な方法を発信しているため当チュートリアルではこれ以上詳細には触れません。

開発者にとって便利な経験則は:

- ある UI パターンが 3 回以上使われているなら、再利用可能な UI コンポーネントにします。
- ある UI パターンが 3 つかそれ以上のプロジェクト/チームで使われているなら、デザインシステムに取り入れます。

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

この方法に従い、UI プリミティブを最終決定します: アバター、バッジ、ボタン、チェックボックス、インプット、ラジオ、セレクト、テキストエリア、 (ソースコードに対する) ハイライト、アイコン、リンク、ツールチップ、などなど。これらの組み立てブロックはクライアントアプリにて無数の固有な特徴とレイアウトを構築するために様々な方法で設定されます。

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

私たちはリポジトリをより簡潔に説明するために当チュートリアル向けのコンポーネントのサブセットを選びました。いくつかのチームはまたテーブルやフォームのような他のコンポーネントに対してはサードパーティコンポーネントをデザインシステムに含めます。

<div class="aside">💡 CSS-in-JS: 私たちは <a href="https://www.styled-components.com">styled-components</a> を使っています、コンポーネントのスコープ化ができるライブラリーです。コンポーネントをスタイリングする他の有効な手段として手動でクラスを絞り込む、CSS モジュールを利用する、等があります。</div>

UI コンポーネントに加え、タイポグラフィ、色、スペーシングなどのスタイリング定数を含めることは意味があります、それはプロジェクトをまたいで再利用されます。デザインシステムにおいてグローバルスタイル変数の命名体系は「デザイントークン」と呼ばれています。当ガイドではデザイントークンを支える理論は深掘りしませんが、オンラインで詳しく学べます (こちらに[良い記事](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)があります) 。

## 開発を始めましょう

私たちは何を構築しどう適用するか定義しました。今が取り掛かる時です。第 3 章では、デザインシステムの基本的な道具の土台を作ります。私たちの UI コンポーネントのむきだしなディレクトリは Storybook の手助けにより一覧化され見える化されます。
