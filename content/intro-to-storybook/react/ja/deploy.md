---
title: 'Storybook をデプロイする'
tocTitle: 'デプロイ'
description: 'GitHub と Netlify を使用して Storybook をインターネット上にデプロイします'
---

このチュートリアルでは Storybook を開発しているマシンで実行してきました。もしかすると、Storybook をチームで、特に非技術者メンバーと共有したいと思っているかもしれません。ありがたいことに、Storybook をインターネット上にデプロイするのは簡単です。

<div class="aside">
<strong>Chromatic テストを既に導入していますか？</strong>
<br/>
🎉 それならば、ストーリーはすでにデプロイされています。Chromatic はインターネット上で安全にストーリーを分類し、ブランチとコミットを横断して追跡します。この章を飛ばして<a href="/react/en/conclusion">まとめ</a>に進んでください。
</div>

## 静的サイトとしてデプロイする

Storybook をデプロイするには、まず静的サイトとしてエクスポートします。この機能はすでに組み込まれて、使える状態となっているので、設定について気にする必要はありません。

`yarn build-storybook` を使用して Storybook をビルドすると、`storybook-static` ディレクトリーに Storybook が静的サイトとして出力されます。

## 継続的なデプロイメント

コードをプッシュしたときに、最新のコンポーネントを共有したいと思います。そのためには、Storybook を継続的にデプロイする必要があります。GitHub と Netlify を使用してこの静的サイトをデプロイしましょう。今回は Netlify の無料プランを使用します。

### GitHub

まず、ローカルディレクトリーの Git をセットアップしましょう。既にテストの章で Git のセットアップが済んでいるのならば、GitHub の設定に進んでください。

Create React App を使用してプロジェクトを初期化した場合、ローカルリポジトリーは既にセットアップされています。この段階ならば初回のコミットに向けてファイルをインデックスに追加しましょう。

```bash
$ git add .
```

次いでファイルをコミットします。

```bash
$ git commit -m "taskbox UI"
```

### GitHub にリポジトリーを作る

[ここから](https://github.com/new) GitHub にアクセスし、リポジトリーを作りましょう。リポジトリーの名前は「taskbox」とします。

![GitHub のセットアップ](/intro-to-storybook/github-create-taskbox.png)

新しいリポジトリーを作ったら origin の URL をコピーして、次のコマンドを実行し、ローカルの Git プロジェクトにリモートを追加します:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

最後に GitHub にリポジトリーをプッシュします。

```bash
$ git push -u origin master
```

### Netlify

Netlify には継続的デプロイのサービスがあるので、自分たちの CI を構築することなく Storybook をデプロイできます。

<div class="aside">
もし CI を使用しているのなら、設定に <code>storybook-static</code> フォルダーを S3 のような静的ホスティングサービスにアップロードするスクリプトを追加しましょう。
</div>

[Netlify にアカウントを作成](https://app.netlify.com/start)し、「New site from Git」をクリックしてください。

![Netlify サイト作成ボタン](/intro-to-storybook/netlify-create-site.png)

次に GitHub のボタンをクリックして、Netlify を GitHub に関連付けます。これにより Netlify に GitHub のリポジトリーへのアクセスが許可されます。

そして、リストから taskbox の GitHub リポジトリーを選択します。

![Netlify でリポジトリーに接続する](/intro-to-storybook/netlify-account-picker.png)

CI でどのビルドコマンドを実行し、どのディレクトリーに静的サイトが出力されるかを Netlify に設定します。ブランチには `master` を、ビルドコマンドには `yarn build-storybook` を、ディレクトリーには `storybook-static` をそれぞれ指定します。

![Netlify の設定](/intro-to-storybook/netlify-settings.png)

<div class="aside">
<p>Netlify へのデプロイが失敗する場合、<a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet </a> フラグを <code>build-storybook</code> スクリプトに追加してください。</p>
</div>

フォームを送信すると、taskbox の `master` ブランチのコードがビルドされデプロイされます。

完了すると、Netlify に確認メッセージとともに Taskbox の Storybook へのリンクが表示されます。ここまで問題がなければ、Storybook がインターネット上に[このように](https://clever-banach-415c03.netlify.com/)公開されています。

![Netlify で動く Storybook](/intro-to-storybook/netlify-storybook-deploy.png)

Storybook を継続的デプロイメントするための設定が完了しました。これでリンクを使ってチームメートとストーリーを共有できます。

これは標準的なアプリケーション開発のプロセスにおけるレビューや、作業内容を見せるのに役立ちます 💅
