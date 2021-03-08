---
title: 'Distribuir o IU numa organização'
tocTitle: 'Distribuição'
description: 'Aprenda como empacotar e importar o seu sistema de design para outras aplicações'
commit: 3a5cd35
---

De uma perspetiva arquitetónica, os sistemas de design são apenas mais uma dependência de frontend. Não são tão diferentes de outras dependências populares, tais como moment ou lodash. Os componentes de IU são apenas código, como tal podemos utilizar técnicas estabelecidas para reutilização de código.

Este capítulo ilustra como distribuir sistemas de design, desde empacotamento dos componentes de IU até à importação dos mesmos noutras aplicações. Iremos desvendar técnicas que economizam tempo em termos de publicação e versões.

![Propagar componentes em sites](/design-systems-for-developers/design-system-propagation.png)

## Empacotar o sistema de design

As organizações possuem milhares de componentes de IU espalhados por inúmeras aplicações. Anteriormente extraímos os componentes comuns para o sistema de design. Agora é necessário reintroduzi-los de volta nas aplicações

O nosso sistema de design usa o gestor de pacotes npm para Javascript, para lidar com a gestão de dependências, distribuição e controlo de versões.

Existem muitas outros métodos válidos para empacotar os sistemas de design. Dê uma olhadela aos sistemas de design da Lonely Planet, Auth0, Salesforce, GitHub e Microsoft para ver a diversidade de abordagens. Alguns lançam cada componente como um pacote separado. Outros lançam todos os componentes num só pacote.

Para sistemas de design recém-nascido, a forma mais direta é a publicação de um pacote com controlo de versões que encapsula:

- 🏗 Componentes interface utilizador comuns
- 🎨 Tokens de design(também conhecidos como variáveis de estilo)
- 📕 Documentação

![Package a design system](/design-systems-for-developers/design-system-package.jpg)

## Prepare o seu sistema de design para ser exportado

Utilizámos como ponto de partida para o nosso sistema de design o create-react-app, com isto ainda existem alguns vestígios da aplicação inicial criada pelo pacote. Vamos fazer agora uma limpeza.

Primeiro deveremos adicionar um ficheiro README.md básico:

```markdown
# The Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/),
created as a learning resource for those interested in learning how to write and publish a design system using best in practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

Em seguida, vamos criar o ficheiro `src/index.js`, como ponto de partida para o nosso sistema de design. Neste ficheiro vão ser exportados todos os tokens de design e também os componentes:

```javascript
import * as styles from './shared/styles';
import * as global from './shared/global';
import * as animation from './shared/animation';
import * as icons from './shared/icons';

export { styles, global, animation, icons };

export * from './Avatar';
export * from './Badge';
export * from './Button';
export * from './Icon';
export * from './Link';
```

Após isto, vamos adicionar uma nova dependência de desenvolvimento `@babel/cli` para ser possível compilar o nosso Javascript para publicação:

```bash
yarn add --dev @babel/cli
```

Para ser possível compilar o nosso pacote, vamos adicionar ainda um script no ficheiro `package.json`, que irá compilar o conteúdo da pasta de código diretamente para a pasta `dist`:

```json
{
  "scripts": {
    "build": "BABEL_ENV=production babel src -d dist",
      ...
  }
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

Podemos agora executar `yarn build` para compilar o nosso código para a pasta `dist`; é boa ideia adicionar esta pasta ao ficheiro `.gitignore` também:

```
// ..
storybook-static
dist
```

#### Adicionar metadados ao pacote para a publicação

Finalmente, vamos fazer algumas alterações adicionais ao ficheiro `package.json`, de forma a garantir que todos os consumidores do pacote, obtenham todas as informações necessárias. A forma mais simples para isto é executar `yarn init`: um comando que inicializa o pacote para ser publicado:

```bash
yarn init

yarn init v1.16.0
question name (learnstorybook-design-system):
question version (0.1.0):
question description (Learn Storybook design system):
question entry point (dist/index.js):
question repository url (https://github.com/chromaui/learnstorybook-design-system.git):
question author (Tom Coleman <tom@thesnail.org>):
question license (MIT):
question private: no
```

Ao executar este comando, irão ser apresentados um conjunto de questões, algumas destas já contêm a resposta pré-preenchida, para outras terá que pensar um pouco mais. Terá que escolher um nome que será único ao pacote no npm (não será possível usar, visto que já existe `learnstorybook-design-system`; uma boa escolha é `<o-seu-nome-de-utilizador>-learnstorybook-design-system`).

Em resumo, com base nas respostas fornecidas o ficheiro `package.json` irá ser atualizado com os novos valores:

```json
{
  "name": "learnstorybook-design-system",
  "description": "Learn Storybook design system",
  "version": "0.1.0",
  "license": "MIT",
  "main": "dist/index.js",
  "repository": "https://github.com/chromaui/learnstorybook-design-system.git"
  // ...
}
```

Com isto preparámos o nosso pacote e podemos publicá-lo no npm pela primeira vez!

## Controlo de versões com o Auto

De forma a publicar diversas versões para o npm, vamos utilizar um processo que irá atualizar um registo de alterações, define um valor para versão de forma sensata e cria uma tag no git, que depois irá vincular o número da versão a uma submissão no nosso repositório. De forma a ajudar com tudo isto, vamos utilizar uma ferramenta de código aberto chamada [Auto](https://github.com/intuit/auto), que foi criada específicamente para este propósito.

Vamos instalar o Auto:

```bash
yarn add --dev auto
```

O Auto é uma ferramenta da linha de comandos, que podemos utilizar para diversas tarefas relacionadas com a gestão de versões. Pode aprender mais sobre o Auto na sua [página de documentação](https://intuit.github.io/auto/).

#### Obter um token para o Github e npm

Nos próximos passos, o Auto irá ter uma conversa com o GitHub e o npm. De forma que a conversa corra sem incidentes, será necessário obter um token de acesso pessoal. Para o GitHub pode obter um destes [nesta página](https://github.com/settings/tokens). Não esquecer que o token irá necessitar de um escopo `repo`.

Para o npm, pode gerar um token no seguinte URL:https://www.npmjs.com/settings/&lt;your-username&gt;/tokens.

Neste caso irá necessitar de um token com permissões “Read and Publish”.

Com esta informação ao nosso dispor, vamos adicionar os tokens obtidos num ficheiro chamado `.env` no nosso projeto:

```
GH_TOKEN=<value you just got from GitHub>
NPM_TOKEN=<value you just got from npm>
```

Ao criar este ficheiro, com base no conteúdo do ficheiro `.gitignore`, garantimos que estes valores não são adicionados acidentalmente no repositório de código aberto, que todas as pessoas podem ver! Isto é crucial. Se alguém pretender publicar o pacote localmente (posteriormente iremos alterar as configurações para publicar automáticamente quando os pull requests (PR) são fundidos com o ramo master), então deverão configurar os seus próprios ficheiros `.env` com base neste processo:

```
storybook-static
dist
.env
```

#### Criar etiquetas no GitHub

A primeira coisa que temos que fazer com o Auto é criar um conjunto de etiquetas no GitHub. Vamos usar estas etiquetas futuramente, quando forem feitas alterações ao pacote (veja o próximo capítulo), o que irá permitir ao `auto` atualizar a versão de forma sensata e criar um registo de alterações e notas de lançamento.

```bash
yarn auto create-labels
```

Se verificar no GitHub, irá observar que existe um conjunto de etiquetas que o `auto` gostaria que fossem usadas:

![Conjunto de etiquetas criadas pelo auto no GitHub](/design-systems-for-developers/github-auto-labels.png)

Antes de ser fundido, cada pull request (PR) deverá ser etiquetado com uma das seguintes etiquetas `major`, `minor`, `patch`, `skip-release`, `prerelease`, `internal`, `documentation`.

#### Publicar manualmente a primeira versão com o Auto

Futuramente os novos valores das versões irão ser calculados pelo `auto`, recorrendo a scripts, mas para a primeira versão, vamos executar os comandos manualmente de forma a entender o que cada um faz. Vamos gerar a primeira entrada no registo de alterações:

```bash
yarn auto changelog
```

O que o comando faz, é gerar uma entrada no registo de alterações bem grande, com cada submissão feita (e um aviso que temos estado a fazer alterações no ramo master e devemos parar com isso o mais depressa possível).

No entanto é extremamente útil manter um registo de alterações gerado automaticamente, de forma que não se percam pitada do que está a acontecer, é também uma muito boa ideia, editá-lo manualmente e gerar uma mensagem útil para os utilizadores. Neste caso, os utilizadores não precisam ter conhecimento de todo e qualquer submissão feita até agora. Vamos criar uma mensagem simples e agradável para a primeira versão v0.1.0. Para isto, primeiro desfaça a alteração feita Auto (mas mantenha-a):

```bash
git reset HEAD^
```

Em seguida atualize o registo de alterações e faça a submissão:

```
# v0.1.0 (Tue Sep 03 2019)

- Created first version of the design system, with `Avatar`, `Badge`, `Button`, `Icon` and `Link` components.

#### Authors: 1
- Tom Coleman ([@tmeasday](https://github.com/tmeasday))
```

Vamos agora sim adicionar o registo de alterações ao git. Tenham em atenção que usamos `[skip ci]` para notificar toda e qualquer plataforma de integração contínua (IC) para ignorar este tipo de submissões, caso contrário acabamos por entrar num loop the compilação e publicação.

```bash
git add CHANGELOG.md
git commit -m "Changelog for v0.1.0 [skip ci]"
```

E agora sim podemos publicar:

```bash
npm version 0.1.0 -m "Bump version to: %s [skip ci]"
npm publish
```

E usamos o Auto para gerar uma versão de lançamento no GitHub:

```bash
git push --follow-tags origin main
yarn auto release
```

Parabéns! Publicámos com sucesso o nosso pacote para o npm e criámos uma versão
de lançamento no GitHub (com muita sorte!).

![Pacote publicado no npm](/design-systems-for-developers/npm-published-package.png)

![Versão de lançamento publicada no GitHub](/design-systems-for-developers/github-published-release.png)

(Note-se que apesar que o `auto` ter gerado automáticamente as notas de lançamento para a primeira versão, mas também foram modificadas de forma a fazerem sentido para uma primeira versão).

<h4>Configurar scripts para usarem o Auto</h4>

Vamos agora configurar o Auto para seguir o mesmo processo quando for necessário publicar o nosso pacote no futuro. Vamos alterar o ficheiro `package.json` e adicionar o seguinte script:

```json
{
  "scripts": {
    "release": "auto shipit --base-branch=main"
  }
}
```

Agora, quando for executado o `yarn release`, irão ser percorridos quase todos os passos mencionados anteriormente (sendo a exceção, a utilização do registo de alterações que foi gerado automaticamente), de forma automática. Iremos garantir que todas as submissões para o ramo master do repositório são publicados através da adição de um comando ao ficheiro de configuração do circle:

```yml
# ...
- run: yarn test
- run: npx chromatic --project-token=2wix88i1ziu
- run: |
    if [ $CIRCLE_BRANCH = "main" ]
    then
      yarn release
    fi
```

Será também necessário adicionar os tokens npm e GitHub ao ambiente CircleCI associado ao vosso projeto, mais exatamente no website do CircleCI (https://circleci.com/gh/&lt;your-username&gt;/learnstorybook-design-system/edit#env-vars):

![Definir variáveis de ambiente no CircleCI](/design-systems-for-developers/circleci-set-env-vars.png)

Desta forma, assim que cada PR for fundido com o ramo master, irá publicar automaticamente uma nova versão, incrementando o número da versão apropriadamente, graças ás etiquetas adicionadas.

<div class="aside">Não mencionámos todas as funcionalidades e integrações existentes no Auto, que poderão ser úteis para sistemas de design emergentes. Para isso leia a documentação <a href="https://github.com/intuit/auto">aqui</a>.</div>

![Importar o sistema de design](/design-systems-for-developers/design-system-import.png)

## Importar o sistema de design numa aplicação

Agora que o nosso sistema de design está online, é bastante trivial instalar a dependência e começar a utilizar os diversos componentes do IU.

#### Obter a aplicação de exemplo

Anteriormente neste tutorial, optámos pela stack de frontend popular que inclui React e styled-components. O que significa que a nossa aplicação de exemplo deverá usar também React e styled-components para retirar o máximo do sistema de design.

<div class="aside">Outros métodos que também são muito promissores, tal como o Svelte ou componentes web, que permitem também que se criem de IU completamente agnósticos. No entanto, estes são relativamente novos, ainda não estão bem documentados ou ainda não têm uma adoção generalizada, como tal não foram incluídos ainda neste guia.</div>

A aplicação de exemplo usa o Storybook de forma a facilitar o [desenvolvimento orientado a componentes](https://www.componentdriven.org/), que é uma metodologia de desenvolvimento de aplicações usada para criar IU de baixo para cima, começando por componentes, acabando nos ecrãs. Durante a demonstração iremos executar dois Storybooks lado a lado: um para a aplicação de exemplo e outro para o nosso sistema de design.

Clone a aplicação de exemplo do repositório do GitHub

```bash
git clone chromaui/learnstorybook-design-system-example-app
```

Instale as dependências e inicie o Storybook da aplicação de exemplo

```bash
yarn install
yarn storybook
```

Deverá ver o Storybook a ser executado com as estórias associadas aos componentes utilizados pela aplicação:

![Storybook inicial para a aplicação de exemplo](/design-systems-for-developers/example-app-starting-storybook.png)

<h4>Integrar o sistema de design</h4>

Adicione o seu sistema de design que foi publicado anteriormente como uma dependência.

```bash
yarn add <your-username>-learnstorybook-design-system
```

Em seguida, vamos alterar o ficheiro `.storybook/config.js` da aplicação de exemplo, de forma a listar os componentes utilizados no sistema de design e também os estilos globais que foram definidos. Faça a alteração seguinte:

```javascript
import React from 'react';
import { configure. addDecorator } from '@storybook/react';
import { GlobalStyles } from '<your-username>-learnstorybook-design-system';
addDecorator(s => <><GlobalStyles/>{s()}</>);

// automatically import all files ending in *.stories.js
configure(
  [
    require.context('../src', true, /\.stories\.js$/),
    require.context(
      '../node_modules/<your-username>-learnstorybook-design-system/dist',
      true,
      /\.stories\.(js|mdx)$/
    ),
  ],
  module
);
```

![Aplicação de exemplo com as estórias do sistema de design](/design-systems-for-developers/example-app-storybook-with-design-system-stories.png)

Poderá agora pesquisar os componentes do sistema de design e documentação, enquanto continua a trabalhar na aplicação de exemplo. Apresentar o sistema de design durante o desenvolvimento de funcionalidades aumenta a probabilidade dos componentes serem reutilizados ao invés de perder tempo a inventar os seus próprios componentes.

Alternativamente, se o Storybook do sistema de design foi publicado online anteriormente (veja o capítulo 4), pode consultar toda a informação no endereço gerado.

Vamos usar o componente Avatar do nosso sistema de design no componente UserItem da nossa aplicação. O UserItem deverá renderizar a informação relativa ao utilizador incluíndo um nome e foto de perfil.

No vosso editor, abram o ficheiro UserItem.js. Mas procurem também pelo UserItem na barra lateral do Storybook, para verem todas as alterações de código serem atualizadas instantaneamente através do hot module reload.

Importe o componente Avatar.

```javascript
import { Avatar } from '<your-username>-learnstorybook-design-system';
```

Como queremos renderizar o Avatar lado a lado com o username, faça a seguinte alteração.

```javascript
import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'learnstorybook-design-system';

const Container = styled.div`
  background: #eee;
  margin-bottom: 1em;
  padding: 0.5em;
`;

const Name = styled.span`
  color: #333;
  font-size: 16px;
`;

export default ({ user: { name, avatarUrl } }) => (
  <Container>
    <Avatar username={name} src={avatarUrl} />
    <Name>{name}</Name>
  </Container>
);
```

Assim que guardar estas alterações, o componente UserItem será atualizado no Storybook e irá apresentar estas alterações. Visto que o UserItem faz parte do componente UserList, as mesmas alterações serão propagadas para este componente também.

![Aplicação de exemplo a utilizar o sistema de design](/design-systems-for-developers/example-app-storybook-using-design-system.png)

E já está! Com isto acabou de importar um componente do sistema de design diretamente para a aplicação de exemplo. Quando for publicada uma nova atualização ao componente Avatar no sistema de design, essa alteração será depois propagada para a aplicação de exemplo, assim que a dependência for atualizada.

![Distribuir sistemas de design](/design-systems-for-developers/design-system-propagation-storybook.png)

## Domine o fluxo de trabalho associado ao sistema de design

O fluxo de trabalho associado ao sistema de design começa pelo desenvolvimento de componentes de IU no Storybook e termina com a distribuição para aplicações cliente. No entanto isso não é tudo. Os sistemas de design deverão continuar a evoluir de forma a poderem servir os requisitos de produto que estão em mutação constante. O nosso trabalho ainda agora começou.

O capítulo 8 ilustra o fluxo de trabalho completo associado ao sistema de design que foi criado neste guia. Iremos ver como alterações no IU propagam-se para fora do sistema de design.
