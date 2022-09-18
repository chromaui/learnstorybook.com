---
title: 'Testar para manter a qualidade'
tocTitle: 'Testar'
description: 'Como testar a aparência,funcionalidade e acessibilidade do sistema de design'
commit: 'a856d54'
---

No capítulo 5, vamos automatizar os testes do sistema de design de forma a prevenir problemas com o IU. Neste capítulo vão ser analisadas quais as caraterísticas dos componentes de IU que justificam aplicar testes e quais as possíveis armadilhas a serem evitadas. Com base na pesquisa feita com equipas profissionais na Wave, BBC e Salesforce, acabámos por criar uma estratégia para testes que equilibra, baixa manutenção, uma configuração simples e uma cobertura abrangente.

<img src="/design-systems-for-developers/ui-component.png" width="250">

## Fundamentos para testes de componentes de IU

Antes de iniciarmos, vamos primeiro descobrir o que faz sentido testar. Os sistemas de design são compostos por componentes de IU. Cada componente de IU inclui estórias (permutações) que descrevem qual a aparência pretendida, com base num conjunto de inputs (adereços (props na forma original)). As estórias são depois renderizadas por um browser ou dispositivo para o utilizador final.

![Estados dos componentes são combinatórios](/design-systems-for-developers/component-test-cases.png)

O quê? Como pode ver, um só componente contêm inúmeros estados. Multiplique os estados pelo número de componentes do sistema de design e irá reparar que tentar acompanhar isto tudo é uma tarefa sisífica. Na realidade, rever cada experiência manualmente é insustentável, especialmente á medida que o sistema de design cresce.

Mais uma razão para configurar testes automatizados **agora** de forma a poupar trabalho no **futuro**.

## Prepare-se para testar

Num [artigo anterior](https://www.chromatic.com/blog/the-delightful-storybook-workflow) fiz uma pesquisa a 4 equipas de frontend, acerca dos fluxos de trabalho profissionais do Storybook. Concordaram com as seguintes práticas recomendadas para escrita de estórias de forma a tornar os testes fáceis e abrangentes.

**Articular os estados suportados pelos componentes** como estórias de forma a clarificar quais as combinações de inputs produzem um determinado estado. Omita categoricamente estados que não são suportados de forma a reduzir ruído.

**Renderizar os componentes de forma consistente** de forma a reduzir qualquer variabilidade que possa ser gerada através de inputs aleatórios tais como (Math.random) ou inputs relativos (Date.now).

> “O melhor tipo de estória é aquele que vos permite visualizar todos os estados que o componente pode vivenciar lá fora na natureza” – Tim Hingston, Tech lead da Apollo GraphQL

## Aparência visual dos testes

Os sistemas de design contêm componentes de IU de apresentação, que são inerentemente visuais. Os testes visuais validam os aspetos visuais do IU que é renderizado.

Os testes visuais capturam uma imagem de cada componente do IU, num ambiente consistente de browsers. As novas capturas de ecrã são automáticamente comparadas com capturas de ecrã anteriores, consideradas como linhas de base. Quando existem diferenças visuais, será notificado.

![Componentes de teste visual](/design-systems-for-developers/component-visual-testing.gif)

Se está a construir um interface de utilizador moderno, os testes visuais irão poupar a sua equipa de frontend de revisões manuais dispendiosas em termos de tempo e prevenir regressões no IU que podem ser também dispendiosas. Vai ser usado o Chromatic, um serviço de nível industrial mantido pela equipa por detrás do Storybook, para demonstrar testes visuais.

Primeiro, vá a [chromatic.com](https://chromatic.com) e registe-se usando a sua conta GitHub.

![Registo na Chromatic](/design-systems-for-developers/chromatic-signup.png)

A partir daí, escolha o seu repositório que contêm o sistema de design. Nos bastidores, as permissões de acesso irão ser sincronizadas e serão instrumentalizadas as verificações associadas ao pull request (PR).

![Criar um projeto no Chromatic](/design-systems-for-developers/chromatic-create-project.png)

Instale o pacote [chromatic](https://www.npmjs.com/package/chromatic) package via npm.

```shell
yarn add --dev chromatic
```

Abra uma nova consola e navegue até à pasta ou diretório do `design-system`. Em seguida execute o seu primeiro teste para gerar uma linha de base para os seus testes visuais posteriores (não se esqueça que terá que usar o app code fornecido pelo site da Chromatic)

```shell
npx chromatic --project-token=<project-token>
```

![Resultado da primeira compilação do Chromatic](/design-systems-for-developers/chromatic-first-build.png)

A Chromatic gerou uma imagem como linha de base para cada estória! Iterações posteriores da execução de testes irão gerar um novo conjunto de imagens que irão ser comparadas contra as imagens da linha de base. Pode verificar isto através da alteração de um componente do IU e guardar as alterações. Abra o ficheiro (`src/shared/styles.js`) que contém os elementos de estilo globais e altere o tamanho da fonte.

```js:title=src/shared/styles.js
// …
export const typography = {
  // ...
  size: {
    s1: '13',
    // ...
  },
};
// ...
```

Execute o comando de testes de novo.

```shell
npx chromatic --project-token=<project-token>
```

Chiça! Esta alteração minúscula gerou num número gigantesco de alterações do IU.

![Segunda compilação no Chromatic com alterações](/design-systems-for-developers/chromatic-second-build.png)

Os testes visuais ajudam a identificar alterações do IU no Storybook. Reveja as alterações de forma a confirmar que as alterações são intencionais (melhorias) ou não intencionais (erros). Se gostar do novo tamanho, aceite as alterações e submeta as alterações para o git. Ou se pelo contrário as alterações são demasiado ostensivas, então desfaça-as.

Vamos agora adicionar testes visuais ao processo de integração contínua. Abra o ficheiro `.circleci/config.yml` e adicione o comand test

```yml:title=.circleci/config.yml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:8.10.0

    working_directory: ~/repo

    steps:
      - checkout

      - restore_cache:
          keys:
            - v1-dependencies-{{ checksum "package.json" }}
            - v1-dependencies-

      - run: yarn install

      - save_cache:
          paths:
            - node_modules
          key: v1-dependencies-{{ checksum "package.json" }}

      - run: yarn test
      - run: npx chromatic --project-token=<project-token> --exit-zero-on-changes
```

Guarde as alterações e execute o comando `git commit` para submeter as alterações feitas. Parabéns, acabou de configurar testes visuais na integração contínua (IC)!

## Funcionalidades de testes unitários

Testes unitários verificam se o código do IU devolve o resultado correto com base num input controlado. Coexistem com o componente e ajudam na validação de funcionalidades específicas.

Nas camadas modernas tais como React,Vue e Angular tudo é um componente. Estes encapsulam diversas funcionalidades, que vão desde botões modestos a seletores de datas extremamente complexos. Quanto mais complexo o componente é, mais difícil será capturar certas nuances somente com base em testes visuais. É por isso mesmo que são necessários testes unitários.

![Testes unitários de components](/design-systems-for-developers/component-unit-testing.gif)

Por exemplo, o nosso componente Link torna-se um pouco complicado quando é combinado com sistemas que geram URLS a partir de Links (os denominados "LinkWrappers" usados por ReactRouter,Gatsby ou Next.js). Um erro na implementação aqui, pode originar links que não possuem um valor válido para o href.

Visualmente, não é possível "ver" se o atributo `href` existe e aponta para a localização correta, o que faz com que um teste unitário seja mais apropriado de forma a evitar regressões.

#### Testes unitários para hrefs

Vamos adicionar um teste unitário para o componente `Link`. Inicialmente o create-react-app configurou um ambiente de testes unitários, como tal será somente necessário criar o ficheiro `src/Link.test.js`:

```js:title=src/Link.test.js
import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from './Link';

// A straightforward link wrapper that renders an <a> with the passed props. What we are testing
// here is that the Link component passes the right props to the wrapper and itselfs
const LinkWrapper = (props) => <a {...props} />; // eslint-disable-line jsx-a11y/anchor-has-content

it('has a href attribute when rendering with linkWrapper', () => {
  const div = document.createElement('div');
  ReactDOM.render(
    <Link href="https://learnstorybook.com" LinkWrapper={LinkWrapper}>
      Link Text
    </Link>,
    div
  );

  expect(div.querySelector('a[href="https://learnstorybook.com"]')).not.toBeNull();
  expect(div.textContent).toEqual('Link Text');

  ReactDOM.unmountComponentAtNode(div);
});
```

Podemos executar o teste unitário acima como parte do comando `yarn test`.

![Execução de um teste Jest único](/design-systems-for-developers/jest-test.png)

Como anteriormente o ficheiro config.js do Circle foi configurado de forma a executar `yarn test` a cada submissão para o repositório. Logo todos os contribuidores irão beneficiar deste teste unitário. E o componente Link torna-se mais robusto relativamente a quaisquer regressões.

![Compilação com sucesso no Circle](/design-systems-for-developers/circleci-successful-build.png)

<div class="aside"> Nota: Tenha em consideração que um número extremamente grande de testes unitários podem tornar quaisquer atualizações extremamente complicadas. Recomendamos a moderação na criação de testes unitários no sistema de design.</div>

> "O nosso conjunto de testes automatizado e aprimorado permitiu que a nossa equipa de sistemas de design se mova mais rapidamente e com maior confiança " – Dan Green-Leipciger, Engenheiro de software senior na Wave

## Testes de acessibilidade

O programador [Alex Wilson da T.Rowe Price](https://medium.com/storybookjs/instant-accessibility-qa-linting-in-storybook-4a474b0f5347) escreve:
"Acessibilidade diz que todas as pessoas, incluíndo as que são portadoras de algum tipo de deficiência, podem entender, podem navegar e podem interagir com a vossa aplicação.... [Exemplos online incluem] formas alternativas de aceder a conteúdos, tais como utilizar a tecla tab e um leitor de telas para percorrer um site".

De acordo com a [World Health Organization](https://www.who.int/disabilities/world_report/2011/report/en/), 15% da população é sofre de algum tipo de deficiência. Com isto os sistemas de design têm um impacto enorme em termos de acessibilidade visto que contêm todas as peças que constituem um interface de utilizador. Ao melhorar a acessibilidade de somente um componente faz com que a sua empresa beneficie de cada instância desse componente.

![Extra de acessibilidade Storybook](/design-systems-for-developers/storybook-accessibility-addon.png)

Obtenha um avanço com um IU inclusivo através do extra Accessibility do Storybook, uma ferramenta que verifica em tempo real os padrões standard de acessibilidade na Web (WCAG).

```shell
yarn add --dev @storybook/addon-a11y

```

Registe o extra em `.storybook/addons.js`:

```js:title=.storybook/addons.js
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-a11y/register';
```

Em seguida adicione o decorador `withA11y` no ficheiro `.storybook/config.js`:

```js:title=.storybook/config.js
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { withA11y } from '@storybook/addon-a11y';
import 'chromatic';

import { GlobalStyle } from '../src/shared/global';

addDecorator(withA11y);
addDecorator((story) => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

// automatically import all files ending in \*.stories.js
configure(require.context('../src', true, /\.stories\.js\$/), module);
```

Uma vez instalado, irá verificar que existe um nova tab chamado “Accessibility” no painel de extras do Storybook.

![Extra a11y do Storybook](/design-systems-for-developers/storybook-addon-a11y.png)

O que nos mostra os diferentes níveis de acessibilidade dos elementos na DOM (infrações e sucessos). Click na caixa de seleção “highlight results” para visualizar localmente todas e quaisquer infrações associadas ao componente de interface de utilizador.

![Extra Storybook a11y com os sucessos passes delineados](/design-systems-for-developers/storybook-addon-a11y-highlighted.png)

A partir daqui basta seguir as recomendações oferecidas pelo extra de acessibilidade.

## Outras estratégias de teste

Paradoxalmente efetuar testes pode economizar tempo, mas também reduzir a velocidade de desenvolvimento devido á manutenção. Seja bastante criterioso em testar o que realmente interessa; não tudo. Ainda que o desenvolvimento de software ofereça inúmeras metodologias de teste, descobrimos da forma mais difícil que algumas destas não são as adequadas para sistemas de design.

#### Testes Snapshot (Jest)

Com esta técnica captura-se o resultado obtido oriundo do código dos componentes do IU e compara-o com versões anteriores. Efetuar testes ao markup dos componentes de IU leva-nos a testar detalhes de implementação (código) e não o que o utilizador vivencia no browser.

Diferenciar snapshots de código é imprevisível e propenso a gerar falsos positivos. Ao nível do componente os snapshots de código não têm em consideração alterações globais, tais como tokens de design, CSS e atualizações de API de terceiros (tais como fontes web, forms da Stripe, Google Maps, etc.). As práticas comuns por parte dos programadores consistem em "aprova tudo" ou por ignorar completamente este tipo de testes.

> A maioria dos testes de snapshot dos componentes são na realidade uma versão pior dos testes de capturas de ecrã. Testem os vossos resultados. Capturem o que é renderizado, mas não o markup subjacente (que é volátil!) – Mark Dalgliesh, Infraestrutura de frontend na SEEK, criador do CSS modules

#### Testes End-to-end (Selenium, Cypress)

Os testes End-to-end percorrem a DOM do componente de forma a simular o fluxo usado pelo utilizador. São mais adequados para verificar os fluxos da aplicação, como por exemplo o registo ou checkout. Quanto maior for a complexidade da funcionalidade, mais útil este tipo de teste se torna.

Os sistemas de design contêm componentes atómicos com funcionalidades relativamente simples. Validar os fluxos do utilizador neste caso é algo excessivo, visto que implementar os testes torna-se uma tarefa dispendiosa em termos de tempo e também são bastante frágeis para serem mantidos. No entanto, salvo rara exceção os componentes podem vir a beneficiar deste tipo de teste. Por exemplo validar IU deveras complexos tais como datepickers ou formulários para pagamento independentes.

## Promova a adoção através de documentação

Um sistema de design não estará completo somente com testes. Visto que os sistemas de design irão servir diversas partes interessadas na organização, será necessário ensinar os outros a como obter o máximo dos nossos componentes de IU que estão extremamente bem testados.

No capítulo 6, vamos aprender a acelerar a adoção do sistema de design através de documentação. Veja porque o Storybook Docs funciona como uma arma secreta para gerar documentação sem ser necessário muito trabalho.
