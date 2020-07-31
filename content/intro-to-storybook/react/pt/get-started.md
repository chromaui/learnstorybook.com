---
title: 'Tutorial do Storybook para o React'
tocTitle: 'Introdução'
description: 'Configuração do React Storybook no ambiente de desenvolvimento React'
commit: '8741257'
---

O Storybook executa paralelamente à aplicação em desenvolvimento.
Ajuda-o a construir componentes de interface de utilizador (UI na forma original) isolados da lógica de negócio e contexto da aplicação.
Esta edição de Aprendizagem de Storybook é destinada para React.
Encontram-se disponíveis outras edições quer para [Vue](/vue/pt/get-started), quer para [Angular](/angular/pt/get-started).

![Storybook e a aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configurar o Storybook com React

Precisamos de alguns passos extra para configurar o processo de compilação no nosso ambiente de desenvolvimento.
Para começar queremos usar o pacote [Create React App](https://github.com/facebook/create-react-app) ou como é vulgarmente conhecido (CRA), para compilação e permitir ao [Storybook](https://storybook.js.org/) e
[Jest](https://facebook.github.io/jest/) fazerem testes na nossa aplicação. Vamos executar os seguintes comandos:

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
Ao longo desta versão do tutorial, vai ser usado o <code>yarn</code> para executar a maioria dos comandos.
Se tiver o Yarn instalado, mas preferir usar <code>npm</code>, não há qualquer problema, pode continuar a seguir o tutorial sem problemas. Somente terá que adicionar a seguinte opção: <code> --use-npm</code> ao primeiro comando mencionado acima e tanto o CRA como o Storybook irão inicializar com base nesta opção. À medida que progride no tutorial, não esqueça de ajustar os comandos mencionados para os equivalentes <code>npm</code>.
</div>

Podemos rapidamente verificar que os vários ecossistemas da nossa aplicação estão a funcionar corretamente:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
Pode ter reparado que foi adicionada a opção <code>--watchAll</code> no comando de testes, não se preocupe, é intencional. Esta pequena alteração irá garantir que todos os testes sejam executados e que a nossa aplicação está a funcionar corretamente. À medida que progride no tutorial, irão ser apresentados diversos cenários de testes, talvez queira considerar e adicionar esta opção ao script de testes no ficheiro (ou arquivo) <code>package.json</code> para garantir que todos os testes sejam executados.
</div>

As três modalidades de frontend da aplicação: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities.png)

Dependendo de qual parte da aplicação em que está a trabalhar, pode querer executar uma ou mais simultaneamente.
Mas, visto que o nosso foco é a criação de um único componente de interface de utilizador (UI na forma original), vamos ficar somente pela execução do Storybook.

## Reutilizar CSS

A Taskbox reutiliza elementos de design deste [tutorial React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), logo não precisamos escrever CSS neste tutorial. Copie e cole o [CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) no ficheiro (ou arquivo) `src/index.css`.

![Interface Utilizador Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se for necessária alguma alteração aos elementos de estilo, os ficheiros LESS originais encontram-se disponíveis no repositório Github.
</div>

## Adicionar recursos

De forma a igualar o design pretendido do tutorial, terá que transferir as pastas (ou diretórios) dos ícones e fontes para dentro da pasta `public`.

<div class="aside"> Foi usado o svn (Subversion) para facilitar a transferência das pastas (ou diretórios) do GitHub. Se não tiver o subversion instalado, ou pretender transferir manualmente, pode obtê-las <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">aqui</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

Após adicionar os estilos e assets, a aplicação irá renderizar de forma estranha. Tudo bem. Não vamos trabalhar nela agora. Vamos antes começar por construir o nosso primeiro componente.
