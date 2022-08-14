---
title: '結論'
tocTitle: '結論'
description: 'デザインシステムの成長が時間を節約し生産性を向上させる'
---

調査を背景にした研究によるとコードの再利用は[42–81%の時間の節約](https://www.researchgate.net/publication/3188437_Evaluating_Software_Reuse_Alternatives_A_Model_and_Its_Application_to_an_Industrial_Case_Study?ev=publicSearchHeader&_sg=g8WraNGZNGPw0R-1-jGpy0XwUDeAr3qb472J6lhisyQ3l24pSmndO6anMdX2L3HdWHifsczPegR9wjA)と[40%](http://www.cin.ufpe.br/~in1045/papers/art03.pdf)生産性の増加をもたらすことを示しています。デザインシステム、**ユーザーインターフェースコード**の共有を円滑にする、が開発者の間でひろく普及している点で驚くべきことではありません。

ここ数年で、Tom と私は数えきれないベテランチームが Storybook の使用でデザインシステムを支えているのを目にしました。彼らはコミュニケーションのオーバーヘッドの削減、耐久性のある設計、繰り返しの手作業の自動化に注力しました。私たちはこれらの常識的な戦略の要約があなたのデザインシステムが育つ助けとなることを願っています。

私たちと学んでくれてありがとう。このような役に立つ記事やガイドが発行された際にお知らせを手に入れるために Storybook のメーリングリストを購読してください。

<iframe style="height:400px;width:100%;max-width:800px;margin:0px auto;" src="https://upscri.be/d42fc0?as_embed"></iframe>

## 当チュートリアルのサンプルコード

私たちと一緒にコーティングしているなら、あなたのリポジトリは次のようになっているでしょう:

- [サンプルデザインシステムリポジトリ](https://github.com/chromaui/learnstorybook-design-system)
- [サンプルアプリリポジトリ](https://github.com/chromaui/learnstorybook-design-system-example-app)

サンプルコードは [Storybook’s own design system](https://github.com/storybookjs/design-system) (SDS)をベースにしており数万もの開発者に力を与えています。SDS は進行中です – 私たちはコミュニティへの貢献を歓迎します。貢献者として、デザインシステムのベストプラクティスと新しい技術の実践的な経験を手に入れるでしょう。SDS はまた Storybook チームが最前線の特徴を実演する場でもあります。

## 私たちについて

_Design Systems for Developers_ は [Dominic Nguyen](https://twitter.com/domyen) と [Tom Coleman](https://twitter.com/tmeasday) によって作成されました。Dominic は Storybook のユーザーインターフェース、ブランド、デザインシステムをデザインしました。Tom はフロントエンドアーキテクチャにおける Storybook のステアリングコミッティーの一員です。彼は Story フォーマットのコンポーネント、アドオン API、パラメータ API に取り組みました。

エキスパートガイダンスは [Kyle Suss](https://github.com/kylesuss)、Storybook のデザインシステムのテックリード、そして [Michael Shilman](https://twitter.com/mshilman)、Storybook Docs の作成者。

コンテンツ、コード、本番環境は [Chromatic](https://www.chromatic.com/) によって提供されました。InVision の [Design Forward Fund](https://www.invisionapp.com/design-forward-fund) は承認をもってキックスタートの製品を丁重に助けてくれました。私たちは継続的なメンテナンスとこのような新しいガイドを出来る限り作るためにスポンサーを探しています。詳細は [Dominic](mailto:dom@chromatic.com) へメールをしてください。

## 視点を広げる

これらは全体論的なデザインシステムの視点を得るためにあなたの焦点を広げるのに有益です。

- [Atomic Design by Brad Frost](http://atomicdesign.bradfrost.com/) (本)
- [Eightshapes by Nathan Curtis](https://medium.com/eightshapes-llc/tagged/design-systems) (ブログ)
- [Building Design Systems by Sarrah Vesselov and Taurie Davis ](https://www.amazon.com/Building-Design-Systems-Experiences-Language/dp/148424513X) (本)

われわれの著者からさらに:

- [Intro to Storybook](http://learnstorybook.com/intro-to-storybook) (ガイド)
- [Component-Driven Development by Tom Coleman](https://www.componentdriven.org/) (記事)
- [Why design systems are a single point of failure by Dominic Nguyen](https://www.chromatic.com/blog/why-design-systems-are-a-single-point-of-failure) (記事)
- [Delightful Storybook Workflow by Dominic Nguyen](https://www.chromatic.com/blog/the-delightful-storybook-workflow) (記事)
- [Visual Testing by Tom Coleman](https://www.chromatic.com/blog/visual-testing-the-pragmatic-way-to-test-uis/) (記事)

## FAQ

#### これがデザインシステムのすべてではないでしょう？

デザインシステムはデザインファイル、コンポーネントライブラリ、トークン、ドキュメンテーション、原理、貢献フローを含みます(しかしこの限りではありません)。このガイドはデザインシステムにおける開発者の視野を掘り下げており私たちはそれらのトピックの下位部分をカバーしています。特に、本番のデザインシステムを進めるためにエンジニアリングの詳細、API、基盤についてカバーしています。

#### デザインシステムの運営サイドについてはどうでしょうか？

運営は全 9 章に適用するにはより広範かつ組織特有の微妙なトピックです。

#### Storybook はデザインツールを統合しますか？

はい！Storybook コミュニティはデザインツールを簡単に統合するアドオンを作成しています。たとえば、InVision の [Design System Manager](https://www.invisionapp.com/design-system-manager) は Storybook を統合して InVision アプリにストーリーを表示します。また [design tokens](https://github.com/UX-and-I/storybook-design-token)、[Sketch](https://github.com/chrisvxd/story2sketch)、[Figma](https://github.com/pocka/storybook-addon-designs)向けのコミュニティが作成したアドオンもあります。

![Design tool integrations](/design-systems-for-developers/storybook-integrations-design.jpg)

#### 単一のアプリにデザインシステムは必要ですか？

いいえ。デザインシステムを作成しメンテナンスするには機会費用がかかります。小さな規模において、デザインシステムは時間節約の見返り以上に多くの労力を求めます。

#### ユーザ側のアプリは想定外なデザインシステムの変更からどのように身を守るのでしょうか？

どんなデザインシステムも完璧ではありません。デザインシステムは必然的にユーザアプリに影響を与えるバグと共に送り出されます。デザインシステムにおいて同じことをしたようにクライアントアプリの Storybook にも自動化テスト (ビジュアル、単体、その他) を編成してこの混乱を軽減しましょう。そうしてブランチの依存関係を更新したら (手動か [Dependabot](https://dependabot.com/) のような自動化サービスで)、クライアントアプリのテスト体制はデザインシステムの来たるリグレッションを補足します。

![Design system updates](/design-systems-for-developers/design-system-update.png)

#### デザインシステムへの微調整はどのように提案するのですか？

デザインシステムはサービスチームです。エンドユーザーと接する代わりに、内部のアプリチームをより生産的にするために存在します。デザインシステムの管理人は要望を管理し他のチームと交流することに責任があります。多くのチームは提案を追跡するために Jira、Asana、Trello のようなタスクマネージャーを使います。

## 感謝

非常に価値のあるフィードバックをしてくれた素晴らしい Storybook のコミュニティに感謝します。

Gert Hengeveld and Norbert de Langen (Chroma), Alex Wilson (T. Rowe Price), Jimmy Somsanith (Talend), Dan Green-Leipciger (Wave), Kyle Holmberg (Air), Andrew Frankel (Salesforce), Fernando Carrettoni (Auth0), Pauline Masigla and Kathleen McMahon (O’Reilly Media), Shawn Wang (Netlify), Mark Dalgleish (SEEK), Stephan Boak (Datadog), Andrew Lisowski (Intuit), Kaelig Deloumeau-Prigent and Ben Scott (Shopify), Joshua Ogle (Hashicorp), Atanas Stoyanov, Daniel Miller (Agile Six), Matthew Bambach (2u), Beau Calvez (AppDirect), Jesse Clark (American Family Insurance), Trevor Eyre (Healthwise), Justin Anastos (Apollo GraphQL), Donnie D’Amato (Compass), Michele Legait (PROS), Guilherme Morais (doDoc), John Crisp (Acivilate), Marc Jamais (SBS Australia), Patrick Camacho (Framer), Brittany Wetzel (United Airlines), Luke Whitmore, Josh Thomas (Ionic), Ryan Williamson-Cardneau (Cisco), Matt Stow (Hireup), Mike Pitt (Zeplin), Jordan Pailthorpe (NextRequest), Jessie Wu (New York Times), Lee Robinson (Hy-Vee)
