---
title: 'Tutorial do Storybook para o React'
tocTitle: 'Introdução'
description: 'Configuração do React Storybook no ambiente de desenvolvimento React'
commit: 'ac1ec13'
---

O Storybook executa paralelamente à aplicação em desenvolvimento.
Ajuda-o a construir componentes de interface (UI na forma original) isolados da lógica de negócio e contexto da aplicação.
Esta edição de Aprendizagem de Storybook é destinada para React.
Encontram-se disponíveis outras edições quer para [Vue](/intro-to-storybook/vue/pt/get-started), quer para [Angular](/intro-to-storybook/angular/pt/get-started).

![Storybook e a aplicação](/intro-to-storybook/storybook-relationship.jpg)

## Configurar o Storybook com React

Precisamos seguir alguns passos para configurar o processo de compilação no nosso ambiente de desenvolvimento.
Para começar, queremos usar o [degit](https://github.com/Rich-Harris/degit) para configurar nosso sistema de compilação. Usando esse pacote, você poderá fazer download de "modelos" (aplicativos parcialmente compilados com alguma configuração padronizada) ajudando você a acompanhar rapidamente seu fluxo de desenvolvimento.

Vamos executar os seguintes comandos:

```bash
# Clone o modelo:
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Instale as dependencias
yarn
```

<div class="aside">
💡 Esse modelo contém os estilos, ativos e configurações essenciais básicas para esta versão do tutorial.
</div>

Podemos rapidamente verificar que os vários ecossistemas da nossa aplicação estão a funcionar corretamente:

```bash
# Execute o executor de test (Jest) em um terminal:
yarn test --watchAll

# Inicie o explorador de componentes na porta 6006:
yarn storybook

# Execute o próprio aplicativo frontend na porta 3000:
yarn start
```

<div class="aside"> 
💡 Veja o sinalizador (flag) <code>--watchAll</code> no comando de teste, incluindo este sinalizador garante que todos os testes sejam executados. Enquanto avança neste tutorial, você será apresentado a diferentes cenários de testes. Você pode considerar querer ajustar seus scripts <code>package.json</code> de acordo.
</div>

As três modalidades de frontend da aplicação: testes automáticos (Jest), desenvolvimento de componentes (Storybook) e a aplicação em si.

![3 modalidades](/intro-to-storybook/app-three-modalities.png)

Dependendo de qual parte da aplicação em que está a trabalhar, pode querer executar uma ou mais simultaneamente.
Mas, visto que o nosso foco é a criação de um único componente de interface de utilizador (UI na forma original), vamos ficar somente pela execução do Storybook.

## Confirmar as alterações

Neste estágio, é seguro adicionar nossos arquivos a um repositório local. Execute os seguintes comandos para inicializar um repositório local, adicione e confirme as alterações que fizemos feito até agora.

```shell
$ git init
```

Seguido por:

```shell
$ git add .
```

E finalmente:

```shell
$ git commit -m "first commit"
```

Vamos começar a construir nosso primeiro componente!
