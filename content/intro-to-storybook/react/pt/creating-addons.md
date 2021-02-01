---
title: 'Bonus: Criar um extra'
tocTitle: 'Bonus: Criação de extras'
description: 'Aprende a criar os teus próprios extras que irão impulsionar o teu desenvolvimento'
commit: 'ed54b16'
---

No capítulo anterior foi apresentada uma das funcionalidades chave do Storybook, o seu sistema robusto de [extras](https://storybook.js.org/addons/introduction/), que pode ser usado para melhorar não somente a tua experiência de desenvolvimento e fluxos de trabalho, mas também para a tua equipa.

Neste capítulo vamos ver como podemos criar o nosso próprio extra. Pode pensar que implementá-lo pode ser uma tarefa extremamente difícil, mas muito pelo contrário. Somente é necessário seguir alguns pequenos passos e podemos começar a sua implementação.

Mas antes de tudo, vamos primeiro definir o que irá fazer.

## O que vamos criar

Neste exemplo, vamos assumir que a nossa equipa tem alguns items de design que estão de alguma forma ligados aos nossos componentes de IU. Olhando para o presente estado do IU do Storybook esta relação não é aparente. Como podemos resolver isto?

Temos o nosso objetivo, vamos agora definir quais as funcionalidades que o nosso extra irá suportar:

- Apresentar os items de design num painel
- Suporte de não somente imagens, mas também urls que podem ser embebidos
- Deverá suportar vários items, para o caso de existirem múltiplas versões ou temas.

A forma que vamos usar para adicionar a lista de items às estórias é através de uma opção do Storybook, chamada [parâmetros](https://storybook.js.org/docs/configurations/options-parameter/#per-story-options), esta opção permite injetar informação customizada às nossas estórias. São usados de forma semelhante aos decoradores que vimos anteriormente.

```javascript
// YourComponent.stories.js

export default {
  title: 'Your component',
  decorators: [
    /*...*/
  ],
  parameters: {
    //👇 Name of the parameter used with the addon.
    assets: ['path/to/your/asset.png'],
  },
  //
};
```

## Configuração

Já delineamos o que o nosso extra irá fazer, está na altura de começar a implementação.

Na pasta (ou diretório) raiz do projeto, vamos adicionar um novo ficheiro (ou arquivo) chamado `.babelrc` com o seguinte conteúdo:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

Com esta adição, vamos garantir que o nosso extra, irá utilizar as predefinições e opções corretas.

Em seguida, dentro da pasta (ou diretório) `.storybook`, vamos criar uma nova pasta (ou diretório) chamada `design-addon` e dentro desta um ficheiro (ou arquivo) chamado `register.js`.

E já está! Fácil não é?

<div class="aside">Vamos usar a pasta (ou diretório)<code>.storybook</code> como base para o nosso extra. A razão por detrás disto, é para manter a implementação simples e evitar muita complicação. Caso este exemplo fosse transformado num extra verdadeiro, a abordagem correta seria mover a implementação para um pacote com a sua própria estrutura de ficheiros (ou arquivos) e pastas (ou diretórios).</div>

## Implementar o extra

Adicione o conteúdo abaixo ao ficheiro (ou arquivo) que acabámos de criar:

```javascript
//.storybook/design-addon/register.js

import React from 'react';
import { AddonPanel } from '@storybook/components';
import { addons, types } from '@storybook/addons';

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        implement
      </AddonPanel>
    ),
  });
});
```

Este é o código inicial para se começar com qualquer extra. Analisando o que o código está a fazer um pouco mais em detalhe:

- Estamos a registar um novo extra no nosso Storybook.
- Adicionamos um novo elemento de IU para o nosso extra com algumas opções (um título que irá definir o nosso extra e o tipo de elemento usado) e renderizamos um bloco de texto por enquanto.

Se iniciarmos o Storybook agora, não será ainda possível ver o nosso extra. Este tem que ser registado no ficheiro (ou arquivo) `.storybook/main.js`, tal como foi feito anteriormente com o extra Knobs. Com isto em mente, adicione o seguinte a lista de addons:

```js
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    // same as before
    './design-addon/register.js', //👈 Our addon registered here
  ],
};
```

![Extra design assets a ser executado no Storybook](/intro-to-storybook/create-addon-design-assets-added.png)

Sucesso! Temos o nosso extra adicionado ao IU do Storybook.

<div class="aside">Storybook permite que adicione não só painéis, mas também uma vasta gama de componentes de IU. E quase todos encontram-se disponíveis no interior do pacote @storybook/components, para que não se perca muito tempo a implementar o IU e focar-se na implementação de funcionalidades.</div>

### Criar o componente de conteúdo

Atingimos o primeiro objetivo. É agora tempo de começar a trabalhar no objetivo seguinte.

Para este objetivo, precisamos de efetuar umas pequenas alterações aos imports e introduzir um novo componente que irá mostrar a informação acerca do item.

Faça a seguinte alteração no seu ficheiro (ou arquivo):

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
/* same as before */
import { useParameter } from '@storybook/api';

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};
```

Acabámos de criar o componente, modificámos os imports, somente o que falta é ligar o componente ao nosso painel e temos um extra completamente funcional capaz de apresentar a informação que está contida na estória.

O seu código deverá ser semelhante a isto:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter } from '@storybook/api';
import { addons, types } from '@storybook/addons';

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  return (
    <Fragment>
      {results.length ? (
        <ol>
          {results.map(i => (
            <li>{i}</li>
          ))}
        </ol>
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

Repare que estamos a usar [useParameter](https://storybook.js.org/docs/react/addons/addons-api#useparameter), este hook bastante útil permite que possamos ler o conteúdo fornecido pela opção `parameters` de cada uma das estórias, o que no nosso caso será uma lista de localizações ou somente uma. Mas não se preocupe com isso agora, em breve vamos ver isto a funcionar.

### Usar uma estória com o nosso extra

Temos as peças todas ligadas. Mas como podemos verificar que está tudo a funcionar e conseguimos ver alguma coisa?

Para isto, vamos fazer uma ligeira alteração ao ficheiro (ou arquivo) `Task.stories.js` e adicionar a opção [parameters](https://storybook.js.org/docs/react/writing-stories/parameters#story-parameters).

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  parameters: {
    //👇 Story's parameter defined here
    assets: [
      'path/to/your/asset.png',
      'path/to/another/asset.png',
      'path/to/yet/another/asset.png',
    ],
  },
  // Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
};
/* same as before  */
```

Reinicie o seu Storybook e escolha a estória associada à Task e deverá ver algo semelhante a isto:

![storybook story showing contents with design assets addon](/intro-to-storybook/create-addon-design-assets-inside-story.png)

### Apresentar o conteúdo no nosso extra

Podemos ver que o extra está a funcionar corretamente, mas vamos fazer uma ligeira alteração ao componente `Content` para que este mostre o pretendido:

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';
import { AddonPanel } from '@storybook/components';
import { useParameter, useStorybookState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    // do image viewer
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  // story's parameter being retrieved here
  const results = useParameter('assets', []);
  // the id of story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  const url = getUrl(results[0]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
    </Fragment>
  );
};
```

Se olhar com atenção, irá reparar que está a ser usada a tag `styled`, esta tag vem do pacote `@storybook/theming`. Com esta, podemos costumizar não somente o tema usado pelo Storybook, mas também o IU de acordo com as nossas necessidades. E ainda o [`useStorybookState`](https://storybook.js.org/docs/react/addons/addons-api#usestorybookstate), um hook deveras útil, que permite que possamos aceder ao estado interno do Storybook e obter toda a informação disponível. No nosso caso vamos usá-lo somente para obter o identificador de cada estória que foi criada.

### Apresentar os itens

Para que possamos ver os nossos itens no nosso extra, temos que copiá-los para a pasta `public` e ajustar a opção `parameters` da nossa estória de acordo.

O storybook irá detetar a alteração e irá carregar os itens, mas por agora somente o primeiro item.

![Items a serem carregados](/intro-to-storybook/design-assets-image-loaded.png)

## Extras com estado

Olhando uma vez mais para os nossos objetivos:

- ✔️ Apresentar os items de design num painel
- ✔️ Suporte de não somente imagens, mas também urls que podem ser embebidos
- ❌ Deverá suportar vários items, para o caso de existirem múltiplas versões ou temas.

Estamos quase lá, falta somente um objetivo.

Para este objetivo, vamos precisar de uma forma qualquer de guardar o estado do componente, isto podia ser feito com o hook `useState` do React, ou se estivéssemos a usar classes com `this.setState()`. Mas para evitar implementar lógica adicional ao componente vamos antes usar o `useAddonState` do Storybook, esta funcionalidade ajuda-nos não só a evitar ter de criar lógica adicional, mas também garante uma forma de persistir o estado do nosso extra. Além desta funcionalidade, vamos usar um outro elemento de IU do Storybook, o `ActionBar`, que permite selecionar elementos.

Com isto vamos ajustar os imports que estão a ser usados para se adequarem às nossas necessidades:

```javascript
//.storybook/design-addon/register.js

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { AddonPanel, ActionBar } from '@storybook/components';
/* same as before */
```

E modificar o componente `Content`, para que possamos movimentar-nos entre itens:

```javascript
//.storybook/design-addon/register.js

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  // addon state being persisted here
  const [selected, setSelected] = useAddonState('my/design-addon', 0);
  // the id of the story retrieved from Storybook global state
  const { storyId } = useStorybookState();

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);
  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};
```

## Extra construído

Atingimos tudo o que nos propusemos a fazer. Ou seja criar um extra do Storybook, completamente funcional que irá apresentar itens de design associados aos componentes de IU.

<details>
  <summary>Clique aqui para expandir e ver o código completo usado neste exemplo</summary>

```javascript
//.storybook/design-addon/register.js

import React, { Fragment } from 'react';

import { useParameter, useStorybookState, useAddonState } from '@storybook/api';
import { addons, types } from '@storybook/addons';
import { AddonPanel, ActionBar } from '@storybook/components';
import { styled } from '@storybook/theming';

const getUrl = input => {
  return typeof input === 'string' ? input : input.url;
};

const Iframe = styled.iframe({
  width: '100%',
  height: '100%',
  border: '0 none',
});
const Img = styled.img({
  width: '100%',
  height: '100%',
  border: '0 none',
  objectFit: 'contain',
});

const Asset = ({ url }) => {
  if (!url) {
    return null;
  }
  if (url.match(/\.(png|gif|jpeg|tiff|svg|anpg|webp)/)) {
    return <Img alt="" src={url} />;
  }

  return <Iframe title={url} src={url} />;
};

const Content = () => {
  //👇 Story's parameter being retrieved here
  const results = useParameter('assets', []);
  const [selected, setSelected] = useAddonState('my/design-addon', 0); // addon state being persisted here
  const { storyId } = useStorybookState(); // the story«s unique identifier being retrieved from Storybook global state

  if (results.length === 0) {
    return null;
  }

  if (results.length && !results[selected]) {
    setSelected(0);
    return null;
  }

  const url = getUrl(results[selected]).replace('{id}', storyId);

  return (
    <Fragment>
      <Asset url={url} />
      {results.length > 1 ? (
        <ActionBar
          actionItems={results.map((i, index) => ({
            title: typeof i === 'string' ? `asset #${index + 1}` : i.name,
            onClick: () => setSelected(index),
          }))}
        />
      ) : null}
    </Fragment>
  );
};

addons.register('my/design-addon', () => {
  addons.add('design-addon/panel', {
    title: 'assets',
    type: types.PANEL,
    render: ({ active, key }) => (
      <AddonPanel active={active} key={key}>
        <Content />
      </AddonPanel>
    ),
  });
});
```

</details>

## Próximos passos

O passo lógico seguinte para o seu extra, será transformá-lo no seu próprio pacote e permitir que seja distribuído e consumido pela sua equipa e possivelmente com o resto da comunidade.

Mas este vai além do pretendido com este tutorial. Este exemplo somente demonstra como pode usar a API do Storybook para criar o seu próprio extra de forma a otimizar o seu fluxo de desenvolvimento.

Aprenda a costumizar ainda mais o seu extra:

- [adicionar botões na barra de tarefas do Storybook](https://github.com/storybookjs/storybook/blob/next/addons/viewport/src/register.tsx#L8-L15)
- [comunicação através de um canal com a iframe](https://github.com/storybookjs/storybook/blob/next/dev-kits/addon-roundtrip/README.md)
- [envio de comandos e resultados](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [efetuar análise ao html/css obtido do componente](https://github.com/storybookjs/storybook/tree/next/addons/a11y)
- [envolver componentes e renderizar de novo com outros dados](https://github.com/storybookjs/storybook/tree/next/addons/knobs)
- [disparar eventos na DOM e alterar a DOM](https://github.com/storybookjs/storybook/tree/next/addons/events)
- [efetuar testes](https://github.com/storybookjs/storybook/tree/next/addons/jest)

E muito mais!

<div class="aside">Caso crie um novo extra e esteja interessado em apresentá-lo á comunidade, esteja á vontade para abrir um PR no repositório do Storybook. </div>

### Kits de desenvolvimento

De forma a ajudá-lo com o desenvolvimento de extras, a equipa do Storybook criou um conjunto de kits de desenvolvimento.

Estes pacotes são nada mais nada menos que kits de principiante para ajudá-lo a começar a implementar os seus próprios extras.

O extra que acabámos de criar é baseado num destes, mais especificamente o kit `addon-parameters`.

Não só este mas outros estão disponíveis aqui: https://github.com/storybookjs/storybook/tree/next/dev-kits

Futuramente mais e mais kits de desenvolvimento irão estar disponíveis.

## Partilha de extras com a equipa

Os extras são adições ao fluxo de trabalho que poupam imenso tempo, mas não esquecer que para outros elementos da equipa não técnicos, tais como revisores, para estes tirarem proveito de todas estas funcionalidades pode ser algo difícil. Não podemos garantir que as pessoas vão executar o seu Storybook localmente. É por isto que uma implementação do Storybook online e de fácil acesso pode ser algo deveras útil. No próximo capítulo, vamos fazer isso mesmo!
