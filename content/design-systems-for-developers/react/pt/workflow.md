---
title: 'Fluxo de trabalho associado ao sistema de design'
tocTitle: 'Fluxo de trabalho'
description: 'Uma visão geral do fluxo de trabalho associado ao sistema de design para programadores frontend'
commit: '9d13d12'
---

A forma como as ferramentas de trabalho frontend trabalham em conjunto, tem um impacto significativo no valor final que as equipas de design e programação poderão atingir. Quando bem feito, é bastante fácil implementar e reutilizar componentes de IU.

Este capítulo ilustra o fluxo de trabalho que assenta em 5 passos, através
da introdução de um novo componente, o AvatarList.

![Fluxo de trabalho do sistema de design](/design-systems-for-developers/design-system-workflow-horizontal.jpg)

## Construir

O AvatarList é um componente que apresenta uma lista de múltiplos avatars. Tal como outro componente qualquer do sistema de design, o AvatarList começou por ser colado em diversos projetos. Daí ser necessária a inclusão deste no sistema de design. Para esta demonstração, vamos assumir que o componente foi desenvolvido noutro projeto e vamos diretamente para o código finalizado.

![AvatarList](/design-systems-for-developers/AvatarList.jpg)

Primeiro, crie um novo ramo no git, onde este trabalho será acompanhado.

```shell
git checkout -b create-avatar-list-component
```

Faça o download do componente `AvatarList` e a sua estória para o seu computador. Coloque-o na pasta `/src`:

- [Ficheiro do component](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/2347a5e8b27635f39091728d0845ff7a2ded3699/src/AvatarList.js)
- [Ficheiro de estórias](https://raw.githubusercontent.com/chromaui/learnstorybook-design-system/2347a5e8b27635f39091728d0845ff7a2ded3699/src/AvatarList.stories.js)

O Storybook está configurado de forma a reconhecer automaticamente ficheiros que terminam em `\*.stories.js` e com isto apresenta-os diretamente no IU,

![Storybook com o componente AvatarList](/design-systems-for-developers/storybook-with-avatarlist.png)

Fantástico! Vamos articular agora cada estado do IU que é suportado pelo AvatarList. De relance podemos verificar que este suporta algumas das propriedades do componente Avatar, tais como `small` e `loading`.

```js:title=src/AvatarList.stories.js
export const smallSize = () => <AvatarList users={users.slice(0, 2)} size="small" />;
export const loading = () => <AvatarList loading />;
```

![Storybook com mais estórias para o AvatarList](/design-systems-for-developers/storybook-with-avatarlist-loading.png)

Dado que é uma lista, deverá apresentar inúmeros avatars. Vamos adicionar algumas estórias que demonstram o que acontece quando adicionamos muitos itens à lista e o que acontece quando existem poucos itens na lista.

```js:title=src/AvatarList.stories.js
export const ellipsized = () => <AvatarList users={users} />;
export const bigUserCount = () => <AvatarList users={users} userCount={100} />;
export const empty = () => <AvatarList users={[]} />;
```

![Storybook com todas as estórias do AvatarList](/design-systems-for-developers/storybook-with-all-avatarlist-stories.png)

Guarde o seu progresso e faça a submissão da alteração.

```shell
git commit -am "Added AvatarList and stories"
```

## Documentar

Graças ao Storybook Docs, obtemos documentação costumizada, requerendo um esforço mínimo. Isto ajuda outros elementos a aprender como usar o AvatarList através da consulta da documentação na tab Docs do Storybook.

![documentação Storybook com a informação mínima do Avatarlist](/design-systems-for-developers/storybook-docs-minimal-avatarlist.png)

Documentação mínima viável! Vamos tornar o AvatarList um pouco mais humano, através da inclusão de contexto adicional em como o utilizar.

```js:title=src/AvatarList.js
/**
 * A list of Avatars, ellipsized to at most 3. Supports passing only a subset of the total user count.
 */
export function AvatarList({ loading, users, userCount, size, ...props }) {}
```

Adicione uns detalhes extra sobre os adereços (props na forma original) suportados

```js:title=src/AvatarList.js
AvatarList.propTypes = {
  /**
   * Are we loading avatar data from the network?
   */
  loading: PropTypes.bool,
  /**
   * A (sub)-list of the users whose avatars we have data for. Note: only 3 will be displayed.
   */
  users: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      avatarUrl: PropTypes.string,
    })
  ),
  /**
   * The total number of users, if a subset is passed to `users`.
   */
  userCount: PropTypes.number,
  /**
   * AvatarList comes in four sizes. In most cases, you’ll be fine with `medium`.
   */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

Facílimo! Por agora, este nível de detalhe é mais que suficiente, podemos costumizar mais ainda posteriormente através de MDX.

![Documentação Storybook com a informação completa do AvatarList](/design-systems-for-developers/storybook-docs-full-avatarlist.png)

A documentação não tem que ser enfadonha. Através de ferramentas automatizadas, removeu-se o tédio para seguir diretamente para a escrita.

Faça a submissão das alterações para o GitHub.

```shell
git commit -am “Improved AvatarList docs”
```

<h4>Crie um Pull Request</h4>

Vamos adicionar o nosso ramo que contém o `AvatarList` e criar um pull request:

```shell
git push -u origin `create-avatar-list-component`
```

Em seguida no browser navegue para o GitHub e abra um pull request.

![PR criado para o AvatarList](/design-systems-for-developers/github-pr-create-avatarlist.png)

## Revisão

Presentemente, o AvatarList é um candidato para inclusão no sistema de design. Todas as partes interessadas deverão rever o componente de forma a garantir que este cumpre com as expetativas em termos de aparência e funcionalidade.

O Storybook do sistema de design é automaticamente publicado á medida que cada pull request é feito, de forma a tornar a revisão extremamente simples. Faça um scroll até à lista de verificações do PR para encontrar um link para o Storybook que foi publicado agora.

![verificações do PR para o PR implementado](/design-systems-for-developers/github-pr-checks-deployed.png)

Encontre o AvatarList no Storybook que está online. Deverá assemelhar-se ao que está no Storybook local.

![AvatarList no Storybook online](/design-systems-for-developers/netlify-deployed-avatarlist-stories.png)

O Storybook online é um ponto universal de referência para a equipa. Partilhe o link do AvatarList com as outras partes interessadas de forma a obter feedback mais depressa. A vossa equipa irá adorar-vos, visto que não têm que lidar com código, ou configurar um ambiente de desenvolvimento.

![Parece-me bem, lança-o!](/design-systems-for-developers/visual-review-shipit.png)

Chegar a um consenso com várias equipas muitas vezes assemelha-se a um exercício de futilidade. Fazem referências a código desatualizado, não possuem um ambiente de desenvolvimento, ou acabam por espalhar o feedback por várias ferramentas. Fazer a revisão do Storybook online, torna isto tão simples tal como partilhar um URL.

## Testar

O nosso conjunto de testes é executado nos bastidores a cada submissão. O AvatarList é um componente simples de apresentação, como tal testes unitários não são necessários. Mas se olharmos para as verificações do PR, o Chromatic, a nossa ferramenta de testes visuais já detetou que existem alterações que precisam de revisão.

![Alterações Chromatic nas verificações do PR no GitHub](/design-systems-for-developers/github-pr-checks-chromatic-changes.png)

Visto que o AvatarList é novo, ainda não foram definidos testes visuais para ele ainda. Será necessário adicionar linhas de base para cada estória. Aceite as "novas estórias" no Chromatic de forma a expandir a cobertura dos testes visuais.

![Alterações no Chromatic feitas as estórias do AvatarList](/design-systems-for-developers/chromatic-avatarlist-changes.png)

Assim que terminar, o processo de compilação irá ser bem sucedido no Chromatic.

![Alterações aceites para as estórias do AvatarList](/design-systems-for-developers/chromatic-avatarlist-changes-accepted.png)

O que por sua vez, atualiza as verificações do PR no GitHub.

![As alterações do Chromatic aceites nas verificações do PR no GitHub](/design-systems-for-developers/github-pr-checks-chromatic-changes-accepted.png)

Os testes foram atualizados com sucesso. No futuro, quaisquer regressão vai ter dificuldade em tentar infiltrar-se no sistema de design.

## Distribuir

Temos um pull request aberto que adiciona o AvatarList ao sistema de design. As estórias estão escritas e os testes tiveram sucesso e existe documentação também. Finalmente estamos prontos para atualizar o pacote que contêm o sistema de design com o Auto e o npm.

Adicione a etiqueta `minor` ao PR, isto faz com que o Auto atualize a versão secundária, ou minoritária do pacote assim que for fundido.

![PR GitHub com etiquetas](/design-systems-for-developers/github-pr-labelled.png)

Agora sim funda o seu PR e no seu browser, navegue para a página do npm associada ao seu pacote e aguarde uns minutos enquanto o pacote é atualizado.

![Pacote publicado no npm](/design-systems-for-developers/npm-published-package.png)

Sucesso! O seu pacote com o sistema de design foi atualizado a partir do conforto do GitHub. Sem ser necessário tocar na linha de comandos, ou mexer com o npm. Atualize a dependência `learnstorybook-design-system` na aplicação de exemplo para começar a utilizar o AvatarList.

## A sua jornada começa agora

O _Sistema de Design para Programadores_, na forma original _Design Systems for Developers_, ilustra todo o fluxo de trabalho que é utilizado por equipas profissionais de frontend de forma a fornecer-lhe um avanço enquanto implementa o seu sistema. À medida que o sistema de design cresce, adicione, reorganize e estenda este conjunto de ferramentas de forma ajustarem-se ás necessidades da sua equipa.

O capítulo 9 faz a conclusão, com todo o código de exemplo, recursos úteis e as perguntas mais frequentes por parte dos programadores.
