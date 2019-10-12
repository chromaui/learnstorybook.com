---
title: 'Revisão com equipas'
tocTitle: 'Revisão'
description: 'Colaboração através de integração contínua e revisão visual'
commit: eabed3d
---

No capítulo 4, vamos aprender quais os fluxos de trabalho profissionais para fazer melhoramentos no sistema de design mitigando inconsistências. Este capítulo abrange técnicas para obter feedback sobre o IU e chegar a um consenso na equipa. Estes processos de produção são usados pelas equipas de pessoas da Auth0, Shopify e Discovery Network.

## Fonte de verdade única ou ponto único de falhanço

Anteriormente, escrevi um artigo mencionando que os sistemas de design são um [ponto único de falhanço](https://blog.hichroma.com/why-design-systems-are-a-single-point-of-failure-ec9d30c107c2) para equipas de frontend. Na sua essência os sistemas de design são uma dependência. Se alterarem um componente do sistema de design, essa alteração propaga-se para todas as aplicações dependentes. Como o mecanismo de distribuição é imparcial - melhoramentos, ou erros são lançados igualmente.

![Dependências do sistema de design](/design-systems-for-developers/design-system-dependencies.png)

Os erros são um risco existêncial para os sistemas de design, como tal fazemos tudo para evitá-los. Ajustes pequenos, têm tendência em transformar-se num número grande de regressões. Sem uma estratégia clara de manutenção contínua os sistemas de design têm tendência a murchar.

## Integração contínua

A integração contínua é a abordagem ideal para manutenção de aplicações web modernas. Permite que se codifiquem comportamentos tais como testes, análise e implementação á medida que se adiciona código. Vamos pedir emprestada esta técnica de forma a poupar-nos qualquer tipo de trabalho manual repetitivo.

Neste caso vamos usar o CircleCI, que é gratuito para a nossa utilização modesta. Mas os mesmos princípios podem ser aplicados a quaisquer outros serviços de CI também. 

Primeiro, registe-se no CircleCI se ainda não o fez. Uma vez feito o registo, irá reparar na tab com o nome "add projects", é aqui que pode configurar o projeto de sistemas de design da seguinte forma.

![Adicionar um projeto no CircleCI](/design-systems-for-developers/circleci-add-project.png)

Crie uma pasta ou diretório chamado `.circleci` na raíz do seu projeto e no seu interior crie um ficheiro chamado config.yml. Isto irá permitir definir qual o coportamento do processo de integração contínua (IC). Por agora pode simplesmente utilizar a recomendação fornecida pela Circle para Node:

```yml
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
```

Presentemente só vai ser executado `yarn test`, que não é nada mais nada menos que um teste básico para React, configurado inicialmente pelo create-react-app. Vamos verificar que funciona no Circle:

![Primeira execução no CircleCI](/design-systems-for-developers/circleci-first-build.png)

Reparem que a execução falhou, visto que ainda não existem testes definidos para o projeto. Não há problema, brevemente vão ser adicionados, vamos continuar por agora.

> “Mas isto funciona na minha máquina?!” – toda a gente

## Revisão visual dos componentes de IU com a equipa

A revisão visual é o processo de confirmação tanto do comportamento, como da estética associada aos interfaces de utilizador. Este ocorre durante o processo de desenvolvimento do interface de utilizador, mas também durante o controlo de qualidade com os restantes elementos da equipa.

A maioria dos programadores estão familiarizados com revisões de código, ou seja, o processo de obter feedback sobre o código vindo de outros programadores de forma a melhorar a sua qualidade. Visto que os componentes do IU expressam código graficamente, a revisão visual é necessária de forma a obter feedback sobre o IU, ou experiência de utilizador (UX).

#### Estabelecer um ponto de referência universal

Eliminar a pasta ou diretório node_modules. Reinstalar os pacotes. Limpar a localstorage. Eliminar cookies. Se estas ações são familiares, já sabe como é difícil manter uma referência relativa á ultima versão do código para todos os elementos da equipa. Quando os elementos da equipa não possuem os mesmos ambientes de trabalho, torna-se um pesadelo distinguir problemas causados pelo ambiente de desenvolvimento local de erros reais.

Felizmente, como programadores frontend, possuímos um alvo comum para compilação: o browser. Equipas experientes publicam os seus Storybook online, para que sirvam como um ponto de referência universal para o processo de revisão visual. Com isto, evitam-se complicações que possam surgir devido aos ambientes locais de desenvolvimento (de qualquer forma é chato ser o suporte técnico).

![Revisão do trabalho na núvem](/design-systems-for-developers/design-system-visual-review.jpg)

Quando os componentes vivos do IU estão acessíveis através de um URL, as partes interessadas podem confirmar a aparência do IU no conforto dos seus próprios browsers. O que significa que programadores, designers e gestores de projeto não precisam de se preocupar com coisas tais como ambientes de desenvolvimento, distribuir capturas de ecrã por todo o lado, ou referenciar IU desatualizados.

> "Implementação do Storybook em cada PR torna a revisão visual mais fácil e ajuda os proprietários dos produtos pensarem em termos de componentes." –Norbert de Langen, Storybook core maintainer

#### Publicar o Storybook

Utilize o serviço [Netlify](http://netlify.com), que é um serviço de implementação deveras fácil de utilizar para construir o fluxo de trabalho associado à revisão visual. O Netlify é gratuito para o nosso caso de uso, mas também é bastante [fácil implementar o Storybook como um site estático e implementá-lo](https://storybook.js.org/docs/basics/exporting-storybook/) noutros serviços de hospedagem.

![Escolher o Netlify no GitHub](/design-systems-for-developers/netlify-choose-provider.png)

Localize o repositório GitHub associado ao sistema de design que foi criado no capítulo anterior.

![Escolha do repositório no Netlify](/design-systems-for-developers/netlify-choose-repository.png)

Introduza o comando `storybook-build` para este seja executado pelo Netlify sempre que for feita uma alteração.

![Configurar a primeira implementação no Netlify](/design-systems-for-developers/netlify-setup-build.png)

Até agora está tudo a correr bem, deverá ver que o Netlify compilou com sucesso.

![Primeira compilação executou com sucesso no Storybook](/design-systems-for-developers/netlify-deployed.png)

Navegue no seu Storybook que foi publicado, clickando no link fornecido. Irá verificar que o seu ambiente de desenvolvimento local do Storybook, foi espelhado online. O que faz com que seja mais fácil para a sua equipa rever os componentes de IU reais renderizados da mesma forma que os vê localmente.

![Visualizando a primeira compilação no Netlify](/design-systems-for-developers/netlify-deployed-site.png)

O Netlify executa um comando de compilação para cada submissão feita que afeta a implementação do Storybook. Irá encontar um link associado na lista de verificações do PR (pull request) do GitHub (iremos observar isto em seguida).

Parabéns! Agora que foi configurada a infraestrutura para publicar o Storybook, vamos recolher feedback através de uma demonstração.

Já que estamos a tocar neste assunto, adicione a pasta ou diretório `storybook-static` ao ficheiro `.gitignore`:

```
# …
storybook-static
```

E faça a submissão da alteração.

```bash
git commit -am “ignore storybook static”
```

#### Solicite uma revisão visual da sua equipa.

Sempre que for feito um pull request que contém alterações ao interface de utilizador, é extremamente útil iniciar um processo de revisão visual com as partes envolvidas de forma a chegar a um consenso ao que irá ser expedido para o utilizador. Com isto evitam-se surpresas desagradáveis ou refazer o trabalho já feito.

Iremos demonstrar a revisão visual através de uma alteração no interface de utilizador, feita num novo ramo.

```bash
git checkout -b improve-button
```

Primeiro, faça uma alteração no componente Button. "Faça com que brilhe" - os designers irão adorar.

```javascript
// ...
const StyledButton = styled.button`
  border: 10px solid red;
  font-size: 20px;
`;
// ...
```

Submeta a alteração para o repositório GitHub.

```bash
git commit -am “make Button pop”
git push -u origin improve-button
```

No browser, navegue para o GitHub.com e crie um pull request para o ramo `improve-button`.

![Criar um PR no GitHub](/design-systems-for-developers/github-create-pr.png)

![PR criado no GitHub](/design-systems-for-developers/github-created-pr.png)

Abra o URL gerado pelo Netlify, que se encontra na lista de verificações do PR para visualizar o seu componente.

![Componnte Button alterado no site implementado](/design-systems-for-developers/netlify-deployed-site-with-changed-button.png)

Para cada componente e estória que foi alterada, copie o URL da barra de endereço e 
partilhe-a na plataforma utilizada pela equipa para gerir tarefas (GitHub, Asana, Jira, etc), de forma a ajudar os restantes elementos da equipa a rever as estórias que são relevantes.

![PR do GitHub com links para o storybook](/design-systems-for-developers/github-created-pr-with-links.png)

Atribua o problema aos seus colegas de equipa e fique a aguardar pelo retorno de feedback.

![Porquê?!](/design-systems-for-developers/visual-review-feedback-github.gif)

No desenvolvimento de software, a maioria dos defeitos são oriundos de falhas de comunicação e não da tecnologia. As revisões visuais ajudam as equipas a obter feedback contínuo durante o processo de desenvolvimento de forma a ser possível lançar sistemas de design mais rapidamente.

![Processo de revisão visual](/design-systems-for-developers/visual-review-loop.jpg)

> A implementação de um URL do Storybook para cada Pull Request é algo que temos estado a fazer á algum tempo com o sistema de design do Shopify, Polaris e tem sido extremamente útil. Ben Scott, Engenheiro na Shopify

## Testar o sistema de design

A revisão visual é inestimável; no entanto, rever manualmente centenas de estórias de componentes pode demorar horas. Idealmente, o que se pretende é ver somente as alterações intencionais (adições/melhoramentos) e capturar automaticamente quaisquer regressões não intencionais.

No capítulo 5, vamos introduzir estratégias de teste que ajudam a reduzir qualquer ruído introduzido durante a revisão visual e garantir que os componentes continuam a ser duradouros ao longo do tempo.
