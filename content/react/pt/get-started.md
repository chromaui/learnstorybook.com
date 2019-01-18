---
title: "Introdução"
tocTitle: "Introdução"
description: "Configuração do React Storybook no ambiente de desenvolvimento"
---

# Introdução

Storybook funciona em paralelo à aplicação em modo de desenvolvimento.
Ajuda na construção de componentes de interface de usuário, isolados de qualquer lógica e contexto da aplicação.
Esta edição de Aprenda Storybook é destinada para React.
Encontram-se disponíveis outras edições tanto para [Vue](/vue/pt/get-started), quanto para [Angular](/angular/pt/get-started).

![Storybook e a aplicação](/storybook-relationship.jpg)

## Configurando o Storybook com React

Serão necessárias algumas etapas adicionais para que seja possível configurar o processo de compilação em nosso ambiente de desenvolvimento.
Para começar, usaremos o pacote [Create React App](https://github.com/facebook/create-react-app), ou como é conhecido (CRA), para configurar o nosso ambiente local e ativar o modo de testes com [Storybook](https://storybook.js.org/) e 
[Jest](https://facebook.github.io/jest/) em nossa aplicação.

Para isso executaremos os seguintes comandos:

```bash
# Create our application:
npx create-react-app taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

Podemos verificar rapidamente que os vários ambientes da nossa aplicação estão funcionando corretamente através de:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
  Nota: Se o comando <code>yarn test</code> produzir um erro, será necessário instalar o pacote <code>watchman</code>, conforme recomendado nesta <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">thread</a>
</div>

Sendo estes os seguintes: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/app-three-modalities.png)


Dependendo de qual parte da aplicação que estamos trabalhando, podemos querer executar um ou mais simultâneamente.
Visto que, neste caso, o foco é a criação de um componente de interface de usuário simples, continuaremos executando o Storybook.

## Reutilização CSS

A Taskbox reutiliza elementos de design do tutorial de React e GraphQL
[Tutorial React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por isso não será necessária a criação de CSS neste tutorial. 

Desta forma o conteúdo do arquivo LESS será compilado em um único arquivo CSS e incluído na aplicação.

O CSS compilado encontra-se disponível [aqui](https://github.com/hichroma/learnstorybook-code/blob/master/src/index.css) e pela convenção CRA(Create React App) será necessário copiar seu conteúdo para o seguinte arquivo src/index.css.

![Interface Usuário Taskbox](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se desejar alterar o estilo, os arquivos LESS originais encontram-se disponíveis no repositório Github.
</div>

## Adicionar recursos

Será necessário adicionar também as pastas com o tipo de letra e icones que se encontram disponíveis [aqui](https://github.com/hichroma/learnstorybook-code/tree/master/public) à pasta `public`. Ao adicionar estes elementos, a aplicação irá renderizar de forma um pouco estranha. 
Mas isto é esperado, visto que não iremos trabalhar na aplicação agora.
Iremos então iniciar o desenvolvimento do nosso primeiro componente!
