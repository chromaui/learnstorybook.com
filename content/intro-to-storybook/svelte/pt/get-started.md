---
title: 'Tutorial do Storybook para o Svelte'
tocTitle: 'Introdução'
description: 'Configuração do Storybook em seu ambiente de desenvolvimento Svelte'
---

Storybook executa paralelamente à aplicação em modo de desenvolvimento. Ajuda a construir componentes de interface de usuário (UI) isolados à lógica de negócio e contexto da aplicação. Esta edição do tutorial Introdução ao Storybook é para Svelte; outras edições existem para [Vue](/intro-to-storybook/vue/pt/get-started), [Angular](/intro-to-storybook/angular/pt/get-started), [React](/intro-to-storybook/react/pt/get-started), [React Native](/intro-to-storybook/react-native/pt/get-started) e [Ember](/intro-to-storybook/ember/pt/get-started).

![Storybook e sua aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Set up Svelte Storybook

Precisaremos seguir alguns passos para configurar o processo de compilação em nosso ambiente de desenvolvimento. Para começar, queremos utilizar [degit](https://github.com/Rich-Harris/degit) para configurar nosso sistema de compilação. Utilizando este pacote, é possível obter "modelos" (aplicações parcialmente construídas com configurações padrão) para ajudar a acelerar o fluxo de desenvolvimento da aplicação.

Execute os seguintes comandos:

```shell:clipboard=false
# Create our application:
npx degit chromaui/intro-storybook-svelte-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 Este modelo contém estilos, recursos e configurações essenciais, todos necessários para esta versão do tutorial.
</div>

Agora é possível verificar que os diversos ambientes de nossa aplicação estão funcionando corretamente:

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5000:
yarn dev
```

As três modalidades de aplicação frontend: testes automatizados (Jest), desenvolvimento de componentes (Storybook), e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities-svelte.png)

Dependendo de qual parte da aplicação está sendo modificada, pode ser desejável executar um ou mais destes simultaneamente. Como o foco atual é criar um único componente de interface de usuário, será executado apenas Storybook

## Submeter suas mudanças

Nesse estágio já é seguro adicionar os arquivos a um repositório local. Execute os seguintes comandos para inicializar um repositório local, adicione e submeta (commit) as mudanças feitas até o momento.

```shell
git init
```

Seguido por:

```shell
git add .
```

Então:

```shell
git commit -m "first commit"
```

Finalmente:

```shell
git branch -M main
```

Vamos começar a construção de nosso primeiro componente!