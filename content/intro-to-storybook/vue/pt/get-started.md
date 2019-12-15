---
title: 'Tutorial do Storybook para o Vue'
tocTitle: 'Introdução'
description: 'Configuração do Storybook num ambiente de desenvolvimento Vue'
---

O Storybook executa paralelamente à aplicação em desenvolvimento.
Ajuda-o a construir componentes de interface de utilizador (UI na forma original) isolados da lógica de negócio e contexto da aplicação.
Esta edição de Aprendizagem de Storybook é destinada para Vue.
Encontram-se disponíveis outras edições quer para [React](/react/pt/get-started), quer para [Angular](/angular/pt/get-started).

![Storybook e a aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configurar o Storybook com Vue

Precisamos de alguns passos extra para configurar o processo de compilação no nosso ambiente de desenvolvimento. Para começar queremos usar o pacote [Vue CLI](https://cli.vuejs.org), para compilação e permitir ao [Storybook](https://storybook.js.org/) e
[Jest](https://facebook.github.io/jest/) fazerem testes na nossa aplicação. Vamos executar os seguintes comandos:

```bash
# Create our application, using a preset that contains jest:
npx -p @vue/cli vue create --preset hichroma/vue-preset-learnstorybook

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

Podemos rapidamente verificar que os vários ambientes da nossa aplicação estão a funcionar corretamente:

```bash
# Run the test runner (Jest) in a terminal:
yarn test:unit

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 8080:
yarn serve
```

As três modalidades de frontend da aplicação: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities-vue.png)

Dependendo de qual parte da aplicação em que está a trabalhar, pode querer executar uma ou mais simultaneamente.
Mas, visto que o nosso foco é a criação de um único componente de interface de utilizador (UI na forma original), vamos ficar somente pela execução do Storybook.

## Reutilizar CSS

A Taskbox reutiliza elementos de design deste [tutorial React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), logo não precisamos escrever CSS neste tutorial. Copie e cole o [CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) no ficheiro (ou arquivo) `src/index.css` e em seguida importe o CSS para a aplicação editando a tag `<style>` no ficheiro (ou arquivo) `src/App.vue` para que fique assim:

```html
<style>
  @import './index.css';
</style>
```

![Interface Utilizador Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se quiser alterar os estilos, os arquivos ou ficheiros LESS originais encontram-se disponíveis no repositório GitHub.
</div>

## Adicionar recursos

Adicione as pastas (ou diretório) de fontes e icones localmente, através de:

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

<div class="aside"> Foi usado o svn (Subversion) para facilitar a transferência das pastas (ou diretórios) do GitHub. Se não tiver o subversion instalado, ou pretender transferir manualmente, pode obtê-las <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">aqui</a>.</p></div>

E também atualizar o nosso script de execução do storybook (no `package.json`) para servir a pasta `public`

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Após adicionar os estilos e assets, a aplicação irá renderizar de forma estranha. Tudo bem. Não vamos trabalhar nela agora. Vamos antes começar por construir o nosso primeiro componente.
