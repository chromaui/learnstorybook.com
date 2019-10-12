---
title: "Introdução aos sistemas de design"
tocTitle: "Introdução"
description: "Um guia para as ferramentas mais recentes orientadas para sistemas de design prontas para produção"
---

<div class="aside">Este guia é orientado para <b>programadores profissionais</b> que pretendem aprender a construir sistemas de design. É recomendado possuír conhecimentos intermédios em Javascript, Git e integração contínua. É também conveniente saber o básico sobre o funcionamento do Storybook, tal como escrever uma estória, ou editar ficheiros de configuração (O guia <a href="/intro-to-storybook">Introdução ao Storybook</a> ensina o básico).
</div>

<br/>

Os sistemas de design estão a explodir em termos de popularidade. Desde gigantes da tecnologia tal como a Airbnb até às startups emergentes, organizações de todos os tipos estão a reutilizar padrões de interface de utilizador (IU) de forma a economizar tempo e dinheiro. 
Mas existe um fosso bem grande entre os sistemas de design criados pela Airbnb, Uber ou a Microsoft e os sistemas de design criados pela maioria dos programadores.

Porque é que as equipas na vanguarda dos sistemas de design usam as ferramentas e as técnicas que usam? Eu e o meu co-autor Tom fizemos uma pesquisa com base na comunidade Storybook sobre quais seriam as características para um sistema de design bem sucedido, de forma a identificar as melhores práticas. 

Este guia passo a passo apresenta quais as ferramentas automatizadas e os fluxos de trabalho bastante  cuidadosos, que são usados em sistemas de design de produção em larga escala. Iremos percorrer os passos necessários em como construir um sistema de design a partir de bibliotecas de componentes existentes e em seguida como configurar os serviços essenciais e fluxos de trabalho.

![Visão geral do sistema de design](/design-systems-for-developers/design-system-overview.jpg)

## O que é este barulho todo acerca de sistemas de design afinal?

Vamos por algo em pratos limpos: o conceito de interfaces de utilizador reutilizáveis não é algo novo. Guias de estilo, kits de interface de utilizador (IU) e widgets partilhados existem à décadas. Hoje em dia, designers e programadores estão a gravitar em torno da construção de interfaces de utilizador (IU) com componentes. Um componente de interface de utilizador (IU) incorpora tanto as propriedades visuais, como funcionais, que estão associadas a cada uma das peças individuais e discretas que constituem o interface de utilizador. Pensem em peças de LEGO.

Os interfaces de utilizador modernos são construídos a partir de centenas de componentes de interface de utilizador (IU) modulares que são reorganizados de forma a oferecer diferentes experiências de utilizador.

Os sistemas de design contêm componentes de interface de utilizador (IU) reutilizáveis que ajudam as equipas a construir interfaces de utilizadores complexos, duráveis e acessíveis ao longo de diversos projetos. Visto que tanto designers, como programadores contribuem para estes, o sistema de design serve como ponte entre as disciplinas. Funciona também como "fonte de verdade" para os componentes comuns numa organização.

![Sistemas de design criam ponte entre design e desenvolvimento](/design-systems-for-developers/design-system-context.jpg)

Inúmeras vezes os designers falam acerca da construção de sistemas de design dentro das suas próprias ferramentas. O âmbito holístico associado a um sistema de design abrange quer elementos (Sketch,Figma,etc), princípios gerais de design, estruturas para contribuições, governança, entre muitos outros. Existem guias em abundância orientados para o designer que aprofundam estes tópicos, como tal não o vamos abordar aqui.

Para programadores, algumas coisas são certas, os sistemas de design para produção deverão incluir os componentes do interface de utilizador (IU) e a infraestrutura frontend que os suporta. Existem três partes técnicas associadas ao sistema de design que vamos falar ao longo deste guia:

- 🏗 Componentes comuns reutilizáveis do interface de utilizador (IU)
- 🎨 Tokens de design: Variáveis específicas associadas ao estilo, tais como cores associadas à marca e espaçamento
- 📕 Site de documentação: Com instruções de utilização, uma narrativa e o que fazer e não fazer

Estas partes irão ser empacotadas, com versões e distribuídas através de um gestor de pacotes para aplicações que as irão consumir.

## Será que precisa de um sistema de design?

Apesar do furor, um sistema de design não é uma solução infalível. Se trabalha com uma equipa modesta numa única aplicação, fica mais bem servido com uma pasta ou  directório de componentes de interface de utilizador (IU), ao invés de implementar toda a infraestrutura associada ao sistema de design. Para projetos pequenos o custo de manutenção, integração e ferramentas associadas supera em larga escala todos e quaisquer benefícios de produtividade poderá observar.

A economia de escala associada a um sistema de design funciona a seu favor quando se partilham os componentes de IU por diversos projetos. Se dá por si a copiar e colar os mesmos componentes em diversas aplicações ou equipas, então este guia é para você.

## O que estamos a construir

O Storybook alimenta os sistemas de design da [Uber](https://github.com/uber-web/baseui), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/), além de centenas de outras empresas. As recomendações aqui apresentadas são inspiradas nas melhores práticas e ferramentas criadas pelas pessoas mais inteligentes. Vamos construir a seguinte stack de frontend:

#### Construir componentes

- 📚 [Storybook](http://storybook.js.org) para o desenvolvimento de componentes para o interface de utilizador (IU) e documentação gerada automáticamente
- ⚛️ [React](https://reactjs.org/) para o interface de utilizador (IU) centralizado em torno de componentes declarativos (via create-react-app)
- 💅 [Styled-components](https://www.styled-components.com/) para aplicação de estilos ao nível do componente.
- ✨ [Prettier](https://prettier.io/) para formatação automática de código

#### Manutenção do sistema

- 🚥 [CircleCI](https://circleci.com/) para integração contínua
- 📐 [ESLint](https://eslint.org/) para o linting de JavaScript
- ✅ [Chromatic](https://chromaticqa.com) para capturar erros visuais nos componentes (pela equipa de manutenção do Storybook)
- 🃏 [Jest](https://jestjs.io/) para testes unitários dos componentes
- 📦 [npm](https://npmjs.com) para distribuição da biblioteca
- 🛠 [Auto](https://github.com/intuit/auto) para gestão do fluxo de trabalho associado ao lançamento de versões

#### Extras Storybook

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) para verificar problemas de acessibilidade durante o desenvolvimento
- 💥 [Actions](https://github.com/storybookjs/storybook/tree/master/addons/actions) para oferecer uma garantia de qualidade nas interações de click e tap
- 🎛 [Knobs](https://github.com/storybookjs/storybook/tree/master/addons/knobs) para ajustar os adereços (props na forma original) de forma interactiva para ser possível fazer experiências com os componentes
- 📝 [Storysource](https://github.com/storybookjs/storybook/tree/master/addons/storysource) para visualizar o código fonte da estória e copiá-lo para o projecto. 
- 📕 [Docs](https://github.com/storybookjs/storybook/tree/master/addons/docs) para geração automática de documentação a partir das estórias

![Fluxo do sistema de design](/design-systems-for-developers/design-system-workflow.jpg)

## Compreensão do fluxo de trabalho

Os sistemas de design são um investimento na infraestrutura de frontend. Além de demonstrar como utilizar toda a tecnologia acima, este guia foca-se também nos fluxos de trabalho nucleares que promovem a adopção e simplificam a sua manutenção. Sempre que possível todas as tarefas manuais serão automatizadas. Em seguida são apresentadas todas actividades com que iremos lidar.

#### Construção de componentes IU em isolamento

Cada sistema de design é composto por componentes IU. Vamos usar o Storybook como uma "bancada de trabalho" para construir os componentes de IU em isolamento, fora das todas as nossas aplicações. Em seguida vamos integrar alguns extras que nos irão ajudar em termos de tempo e aumentar a durabilidade do componente (Actions,Source,Knobs).

#### Revisões para chegar ao consenso e obter feedback

Desenvolvimento de IU é um desporto de equipa que requer um alinhamento entre programadores, designers, mas também outras disciplinas. Vamos publicar componentes de interface de utilizador não finalizados, de forma a envolver outras partes interessadas no processo e agilizar a expedição.

#### Testar para evitar bugs IU

Os sistemas de design são uma única fonte de verdade, mas também um ponto único de falhanço. Erros pequenos em componentes básicos do IU  podem rapidamente originar incidentes ao nível empresarial. Vamos automatizar um conjunto de testes que o irão ajudar a mitigar erros inevitáveis, de forma a ser possível lançar componentes de IU duradouros e acessíveis com confiança.

#### Documentação de forma a acelerar a adoção

A documentação é essencial, mas geralmente a última prioridade para o programador é criá-la. vamos tornar esta tarefa bastante mais fácil, através da geração de documentação minimamente viável de forma automática, para os componentes de IU, que poderá ser alterada posteriormente.

#### Distribuição do sistema de design para outros projetos consumidores

Assim que obtiver os componentes de IU extremamente bem documentados, terão que ser distribuidos. Iremos descrever como empacotar, publicar e como introduzir o sistema de design noutros Storybooks.

## Sistema de design do Storybook

O sistema de design neste guia foi inspirado no próprio [sistema de design em produção](https://github.com/storybookjs/design-system) do Storybook. Que é utilizado em três sites e normalmente mexido por dezenas de milhares de programadores no ecossistema Storybook.

No próximo capítulo iremos mostrar como extrair um sistema de design a partir de diversas bibliotecas de componentes.
