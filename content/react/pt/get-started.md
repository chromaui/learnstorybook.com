---
title: "Storybook para o React tutorial"
tocTitle: "Introdução"
description: "Configuração do React Storybook no ambiente de desenvolvimento"
commit: ebe2ae2
---

Storybook funciona em paralelo á aplicação em modo de desenvolvimento.
Ajuda na construção de componentes de interface de utilizador isolados de qualquer lógica e contexto da aplicação.
Esta edição de Aprendizagem de Storybook é destinada para React.
Encontram-se disponíveis outras edições quer para [Vue](/vue/pt/get-started), quer para [Angular](/angular/pt/get-started).

![Storybook e a aplicação](/storybook-relationship.jpg)

## Configuração de Storybook com React

Irão ser necessárias algumas etapas adicionais de forma a ser possível configurar o processo de compilação no nosso ambiente de desenvolvimento.
Para começar queremos usar o pacote [Create React App](https://github.com/facebook/create-react-app) ou como é vulgarmente conhecido (CRA), para configurar o nosso ambiente local e ativar o modo de testes com [Storybook](https://storybook.js.org/) e
[Jest](https://facebook.github.io/jest/) na nossa aplicação.

Para tal vamos executar os seguintes comandos:

```bash
# Create our application:
npx create-react-app taskbox
cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

Podemos rapidamente verificar que os vários ecossistemas da nossa aplicação estão a funcionar corretamente através de:

```bash
# Run the test runner (Jest) in a terminal:
yarn test

# Start the component explorer on port 9009:
yarn run storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside">
  Nota: Se <code>yarn test</code> emitir um erro, será necessário instalar o pacote <code>watchman</code>, tal como recomendado neste <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">problema</a>
</div>

Sendo estes os seguintes: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/app-three-modalities.png)

Dependendo de qual parte da aplicação que estamos a trabalhar, podemos querer executar um ou mais simultâneamente.
Visto que neste caso, o foco é a criação de um componente de interface de utilizador simples, iremos cingir-nos somente á execução de Storybook.

## Reutilização CSS

A Taskbox reutiliza elementos de design do tutorial de React e GraphQL
[Tutorial React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), como tal não será necessária a criação de CSS neste tutorial.

Com isto o conteúdo do ficheiro LESS será compilado num único ficheiro CSS e incluido na aplicação.

O CSS compilado encontra-se disponível [aqui](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) e pela convenção CRA(Create React App) será necessário copiar seu conteúdo para o seguinte ficheiro src/index.css.

![Interface Utilizador Taskbox](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se for necessária alguma alteração aos elementos de estilo, os ficheiros LESS originais encontram-se disponíveis no repositório Github.
</div>

## Adicionar recursos

Irá ser necessário adicionar também as pastas com o tipo de letra e ícones que se encontram disponíveis [aqui](https://github.com/chromaui/learnstorybook-code/tree/master/public) á pasta `public`. Ao adicionar estes elementos, a aplicação irá renderizar de forma algo estranha.
Mas isto é de esperar, visto que não iremos trabalhar na aplicação agora.
Iremos então iniciar o desenvolvimento do nosso primeiro componente!
