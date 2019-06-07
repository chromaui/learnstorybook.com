---
title: "Implementar Storybook"
tocTitle: "Implementação"
descrição: "Implemntação online do Storybook com GitHub e Netlify"
---

Neste tutorial o Storybook foi executado na máquina local. Poderá ser necessária a partilha com o resto da equipa, em particular com membros considerados não técnicos. Felizmente, é bastante fácil implementar o Storybook online.

<div class="aside">
    <strong>Foram seguidos os passos para implementar os teste com Chromatic, tal como mencionado anteriormente?</strong>
    <br/>
    Então as estórias já se encontram implementadas!🎉 O Chromatic indexa-as e segue-as ao longo das ramificações feitas e dos commits
    Pode saltar-se este capítulo e seguir para <a href="/react/pt/conclusion">conclusão</a>.
</div>

## Exportação sob a forma de uma app estática

Para implementar o Storybook será necessário ser exportado como uma aplicação estática para a web. Esta funcionalidade já está implementada, somente será necessária a sua ativação através da adição de um script ao ficheiro `package.json`.

```javascript
{
  "scripts": {
    "build-storybook": "build-storybook -c .storybook"
  }
}
```

E pode agora construir-se o Storybook via `npm run build-storybook`, o que irá popular a pasta `storybook-static` com esta versão.

## Implementação contínua

Pretende-se que seja partilhada ultima versão dos componentes á medida que o código é produzido. Para tal é necessário que o Storybook também o seja. Dependendo do GitHub e Netlify para implementar o site estático. Será usado o plano gratuito.

### GitHub

Primeiro, será necessário configurar o Git localmente. Se este tutorial estiver a ser seguido, poderá saltar-se para a configuração de um repositório no GitHub.

```bash
$ git init
```

Adicionam-se os ficheiros ao primeiro commit.

```bash
$ git add .
```

Agora pode ser feito o commit dos ficheiros.

```bash
$ git commit -m &quot;taskbox UI&quot;
```

Navegue até ao GitHub e configure [aqui](https://github.com/new) um repositório. E vai ser atribuído o nome “taskbox”.

![Configuração GitHub](/github-create-taskbox.png)

No novo repositório de código, copia-se o URL original deste, e adicionado ao projeto com o seguinte comando:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente injeta-se o repositório no GitHub

```bash
$ git push -u origin master
```

### Netlify

O Netlify possui um serviço de implementação continua, o que permite a implementação do Storybook sem ser necessária a configuração de uma IC (CI na forma nativa) própria.

<div class="aside">
Se for usado um IC (CI na forma nativa) na empresa, é necessário adicionar um script de implementação para que seja feito o upload da pasta <code>storybook-static</code> para um serviço de hospedagem estático, tal como o S3. 
</div>

[Criação da conta no Netlify](https://app.netlify.com/start), em seguida “create site”.

![Criação Site Netlify](/netlify-create-site.png)

Em seguida click no botão GitHub para ser feita a ligação do Netlify ao GitHub. O que permite o acesso ao repositorio remoto Taskbox.

Seguida da seleção do repositório da lista de opções.

![Conexão Netlify para o repositorio](/netlify-account-picker.png)

É feita a configuração no Netlify ao selecionar-se o comando apropriado para executar no IC(CI na forma nativa) e qual a pasta de output. Como ramo, seleciona-se `master`. Pasta `storybook-static`. Comando `yarn build-storybook`.

![Configurações Netlify](/netlify-settings.png)

Em seguida é feita a submissão do formulário, para compilar o código no ramo `master` do repositório taskbox.

Quando isto terminar, é apresentada uma mensagem de confirmação no Netlify, juntamente com um link para o Storybook da Taskbox online. Se o tutorial estiver a ser seguido o Storybook estará online [tal como](https://clever-banach-415c03.netlify.com/).

![Implementação Storybook Netlify](/netlify-storybook-deploy.png)

Com isto terminou a implementação continua do Storybook! Pode ser agora partilhado através de um link.

Isto é bastante útil, para a revisão visual, como parte do processo por defeito de desenvolvimento, ou para ser possível gabar o nosso trabalho 💅.
