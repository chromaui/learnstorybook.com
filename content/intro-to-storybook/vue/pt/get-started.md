---
title: 'Tutorial do Storybook para o Vue'
tocTitle: 'Introdução'
description: 'Configuração do Vue Storybook no ambiente de desenvolvimento'
---

O Storybook executa paralelamente à aplicação em desenvolvimento.  
Ele te ajuda a construir seus componentes de UI de forma isolada da sua lógica de negócio e do contexto de sua aplicação.
Esta edição de Aprenda Storybook é destinada para o Vue.
Existem outras edições para [React](/react/pt/get-started)e para [Angular](/angular/pt/get-started).

![Storybook e a aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configurar o Storybook com Vue

Seguiremos alguns passos para que o processo de build seja configurado em seu ambiente
Para começar queremos usar o pacote [Vue CLI](https://cli.vuejs.org) para configurar o nosso sistema de build, e ativar o modo de testes com [Storybook](https://storybook.js.org/) e
[Jest](https://facebook.github.io/jest/) em nossa aplicação. Vamos executar os seguintes comandos:

```bash
# Cria nossa aplicação, utilizando um preset com jest
npx -p @vue/cli vue create --preset hichroma/vue-preset-learnstorybook taskbox
cd taskbox

# Adiciona o Storybook:
npx -p @storybook/cli sb init
```

Podemos rapidamente verificar que os vários ambientes da nossa aplicação estão funcionando corretamente:

```bash
# Execute o test runner (Jest) em um terminal:
yarn test:unit

# Inicie o component explorer na porta 6006:
yarn run storybook

# Execute o app frontend na porta 8080:
yarn serve
```

<div class="aside">
  Nota: Se <code>yarn test:unit</code> emitir algum erro, você pode não ter o <a href="https://yarnpkg.com/lang/en/docs/install/">yarn instalado</a>, ou então será necessário instalar o pacote <code>watchman</code>, como recomendado nesta <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">issue</a>
</div>

Nossas três modalidades de app: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities.png)

Dependendo de qual parte da aplicação você está trabalhando, você pode querer executar uma ou mais simultaneamente.
Visto que nosso foco é a criação de um único componente de UI, iremos ater-nos somente à execução do Storybook.

## Reutilizar CSS
A Taskbox reutiliza elementos de design do app exemplo deste [tutorial de React e GraphQL](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), então não precisamos escrever CSS neste tutorial. Iremos simplesmente compilar o LESS para um único arquivo CSS e incluí-lo em nosso app. Copie e cole [este CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) em `src/index.css` e então importe o CSS dentro do nosso app editando a tag `<style>` em `src/App.vue`, ficando assim:

```html
<style>
  @import './index.css';
</style>
```

![Interface Utilizador Taskbox](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
  Se você quiser alterar o estilo, os arquivos LESS originais encontram-se disponíveis no repositório GitHub.
</div>

## Adicionar Recursos

Precisamos também adicionar os [diretórios de fontes e ícones](https://github.com/chromaui/learnstorybook-code/tree/master/public) à pasta `public`.

Devemos também atualizar nosso script de execução do storybook (em `package.json`) para servir o diretório public
```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Após adicionar os estilos e assets, o app irá renderizar de maneira um pouco estranha. Tudo bem. Não estamos trabalhando na aplicação agora. Estamos partindo da construção de nosso primeiro componente!
