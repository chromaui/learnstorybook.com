---
title: 'Implementar Storybook'
tocTitle: 'Implementação'
descrição: 'Implemntação online do Storybook com GitHub e Netlify'
---

Neste tutorial o Storybook foi executado na máquina local. Poderá ser necessária a partilha com o resto da equipa, em particular com membros considerados não técnicos. Felizmente, é bastante fácil implementar o Storybook online.

<div class="aside">
    <strong>Foram seguidos os passos para implementar os teste com Chromatic, tal como mencionado anteriormente?</strong>
    <br/>
    Então as estórias já se encontram implementadas!🎉 O Chromatic indexa-as e segue-as ao longo das ramificações feitas e dos commits
    Pode saltar-se este capítulo e seguir para <a href="/intro-to-storybook/angular/pt/conclusion">conclusão</a>.
</div>

## Exportação sob a forma de uma app estática

Para implementar o Storybook será necessário ser exportado como uma aplicação estática para a web. Esta funcionalidade já está implementada e configurada, como tal não precisamos preocupar-nos com qualquer tipo de configuração.

Quando executar o Storybook através de `npm run build-storybook`, irá gerar a pasta `storybook-static` com o conteúdo estático do seu Storybook.

## Implementação contínua

Pretende-se que seja partilhada ultima versão dos componentes á medida que o código é produzido. Para tal é necessário que o Storybook também o seja. Dependendo do GitHub e Netlify para implementar o site estático. Será usado o plano gratuito.

### GitHub

Se estiver a seguir o tutorial a partir da secção anterior de testes pode saltar para a configuração do repositório no GitHub.

Quando o projeto foi inicializado pelo cli do angular, foi criado um repositório local. Nesta altura é seguro adicionar os ficheiros ao primeiro commit.

```bash
$ git add .
```

Agora pode ser feito o commit dos ficheiros.

```bash
$ git commit -m "taskbox UI";
```

Navegue até ao GitHub e configure [aqui](https://github.com/new) um repositório. E vai ser atribuído o nome “taskbox”.

![Configuração GitHub](/intro-to-storybook/github-create-taskbox.png)

No novo repositório de código, copia-se o URL original deste, e adicionado ao projeto com o seguinte comando:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente injeta-se o repositório no GitHub

```bash
$ git push -u origin main
```

### Netlify

O Netlify possui um serviço de implementação continua, o que permite a implementação do Storybook sem ser necessária a configuração de uma IC (CI na forma nativa) própria.

<div class="aside">
    Se for usado um IC (CI na forma nativa) na empresa, é necessário adicionar um script de implementação para que seja feito o upload da pasta <code>storybook-static</code> para um serviço de hospedagem estático, tal como o S3.
</div>

[Criação da conta no Netlify](https://app.netlify.com/start), em seguida “create site”.

![Criação Site Netlify](/intro-to-storybook/netlify-create-site.png)

Em seguida click no botão GitHub para ser feita a ligação do Netlify ao GitHub. O que permite o acesso ao repositório remoto Taskbox.

Seguida da seleção do repositório da lista de opções.

![Conexão Netlify para o repositório](/intro-to-storybook/netlify-account-picker.png)

É feita a configuração no Netlify ao selecionar-se o comando apropriado para executar no IC(CI na forma nativa) e qual a pasta de output. Como ramo, seleciona-se `main`. Pasta (ou diretório) `storybook-static`. Comando `npm run build-storybook`.

![Configurações Netlify](/intro-to-storybook/netlify-settings-npm.png)

<div class="aside"><p>Caso o deploy no Netlify falhe, adicione a flag <a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet </a> ao comando <code>build-storybook</code>.</p></div>

Em seguida é feita a submissão do formulário, para compilar o código no ramo `main` do repositório taskbox.

Quando isto terminar, é apresentada uma mensagem de confirmação no Netlify, juntamente com um link para o Storybook da Taskbox online. Se o tutorial estiver a ser seguido o Storybook estará online [tal como](https://clever-banach-415c03.netlify.com/).

![Implementação Storybook Netlify](/intro-to-storybook/netlify-storybook-deploy.png)

Com isto terminou a implementação continua do Storybook! Pode ser agora partilhado através de um link.

Isto é bastante útil, para a revisão visual, como parte do processo por defeito de desenvolvimento, ou para ser possível gabar o nosso trabalho 💅.
