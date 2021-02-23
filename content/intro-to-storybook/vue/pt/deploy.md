---
title: 'Implementar Storybook'
tocTitle: 'Implementação'
descrição: 'Implementação online do Storybook com GitHub e Netlify'
commit: '107b7ce'
---

Neste tutorial o Storybook foi executado na máquina local. Poderá ser necessária a partilha com o resto da equipa, em particular com membros considerados não técnicos. Felizmente, é bastante fácil implementar o Storybook online.

<div class="aside">
    <strong>Seguiu os passos para implementar testes com Chromatic, tal como mencionado anteriormente?</strong>
    <br/>
    Então as estórias já se encontram implementadas!🎉 O Chromatic indexa-as e segue-as ao longo das ramificações feitas e dos commits
    Pode saltar-se este capítulo e seguir para <a href="/intro-to-storybook/vue/pt/conclusion">conclusão</a>.
</div>

## Exportação sob a forma de uma app estática

Para implementar o Storybook será necessário ser exportado como uma aplicação estática para a web. Esta funcionalidade já está implementada, somente será necessário alterar o script tal como quando o projeto foi inicializado [na introdução](/vue/pt/get-started).

```javascript
{
  "scripts": {
   "build-storybook": "build-storybook -s public"
  }
}
```

Quando executar o Storybook através de `yarn build-storybook`, irá gerar a pasta `storybook-static` com o conteúdo estático do seu Storybook.

## Implementação contínua

Pretende-se que seja partilhada a última versão dos componentes á medida que o código é produzido. Para tal é necessário que o Storybook também o seja. Vamos depender do GitHub e do Netlify (com o plano gratuito) para implementar o site estático.

### GitHub

Se estiver a seguir o tutorial a partir da secção anterior de testes pode saltar para a configuração do repositório no GitHub.

Quando o projeto foi inicializado pelo Vue CLI, foi criado um repositório local. Nesta altura é seguro adicionar os ficheiros ao primeiro commit.

```bash
$ git add .
```

Agora pode ser feito o commit dos ficheiros.

```bash
$ git commit -m "taskbox UI";
```

### Criar um repositório no GitHub

Navegue até ao GitHub e configure [aqui](https://github.com/new) um repositório. Como nome use “taskbox”.

![Configuração GitHub](/intro-to-storybook/github-create-taskbox.png)

No novo repositório de código, copie o URL de origem, e adicione-o ao projeto com o seguinte comando:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente injeta-se o repositório no GitHub

```bash
$ git push -u origin main
```

### Netlify

O Netlify possui um serviço de implementação contínua, o que permite a implementação do Storybook sem ser necessária a configuração de uma IC (CI na forma nativa) própria.

<div class="aside">
    Se for usado um IC (CI na forma nativa) na empresa, será necessário adicionar um script de implementação para que seja feito o upload da pasta <code>storybook-static</code> para um serviço de hospedagem estático, tal como o S3.
</div>

[Criação da conta no Netlify](https://app.netlify.com/start), em seguida “create site”.

![Criação Site Netlify](/intro-to-storybook/netlify-create-site.png)

Em seguida click no botão GitHub para ser feita a ligação entre ambos. O que permite o acesso ao repositório remoto Taskbox.

Seguida da seleção do repositório da lista de opções.

![Conexão Netlify para o repositório](/intro-to-storybook/netlify-account-picker.png)

É feita a configuração no Netlify ao selecionar-se o comando apropriado para executar no IC (CI na forma nativa) e qual a pasta de output. Como ramo, seleciona-se `main`. Pasta `storybook-static`. Comando `yarn build-storybook`.

![Configurações Netlify](/intro-to-storybook/netlify-settings.png)

<div class="aside"><p>Caso o deploy no Netlify falhe, adicione a <a href="https://storybook.js.org/docs/configurations/cli-options/#for-build-storybook">--quiet </a> flag ao comando <code>build-storybook</code>.</p></div>

Em seguida é feita a submissão do formulário, para que o Netlify compile o código existente no ramo `main` do repositório taskbox.

Quando isto terminar, é apresentada uma mensagem de confirmação no Netlify, juntamente com um link para o Storybook da Taskbox online. Se o tutorial estiver a ser seguido, o seu Storybook estará online [tal como aqui](https://clever-banach-415c03.netlify.com/).

![Implementação Storybook Netlify](/intro-to-storybook/netlify-storybook-deploy.png)

Com isto terminou a implementação continua do Storybook! Pode ser agora partilhado através de um link.

Isto é bastante útil, para a revisão visual, como parte do processo por defeito de desenvolvimento, ou para ser possível gabar o nosso trabalho 💅.
