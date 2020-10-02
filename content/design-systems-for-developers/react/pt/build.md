---
title: 'Construção de componentes IU'
tocTitle: 'Construção'
description: 'Configurar o Storybook para catalogar e construir componentes do sistemas de design'
commit: e7b6f00
---

No capítulo 3 vamos configurar as ferramentas essenciais aos sistemas de design, a começar com o Storybook, o explorador de componentes mais popular.
O objetivo deste guia é mostrar como as equipas profissionais constroem sistemas de design, e como tal iremos focar-nos nos detalhes mais granulares tais como higiene do código, extras do Stoybook que poupam tempo e na estrutura de pastas ou diretórios.

![Onde é que o Storybook se encaixa](/design-systems-for-developers/design-system-framework-storybook.jpg)

## Formatação de código e linting para a higiene

Os sistemas de design são colaborativos, como tal ferramentas que corrigem a sintaxe e uniformizam a formatação de código irão servir para melhorar a qualidade das contribuições. A aplicação de uma consistência de código através de ferramentas é menos dispendioso do que fazer o policiamento de código manualmente, o que se torna um benefício para o autor do sistema de design.

Neste tutorial vamos usar o VSCode, mas a mesma ideia pode ser aplicada a outros editores modernos, tais como Atom, Sublime, ou IntelliJ.

Se adicionarmos o Prettier ao projeto e configurarmos o editor corretamente, deveremos obter uma formatação consistente sem precisar pensar muito:

```bash
yarn add --dev prettier
```

Se estiver a usar o Prettier pela primeira vez, poderá ter que o configurar para o seu editor escolhido. No caso do VSCode instale o seguinte extra:

![extra prettier para o VSCode](/design-systems-for-developers/prettier-addon.png)

Active a opção "Format on Save" `editor.formatOnSave` se ainda não o tiver feito.
Assim que instalar o Prettier, irá reparar que este automaticamente o código sempre que o ficheiro for guardado.

## Instalar o Storybook

O Storybook é o [explorador de componentes](https://blog.hichroma.com/the-crucial-tool-for-modern-frontend-engineers-fb849b06187a) standard da indústria para construir componentes de IU em isolamento. Visto que os sistemas de design focam-se nestes, o Storybook é a ferramenta ideal para o caso de uso. Iremos aproveitar as seguintes funcionalidades:

- 📕Catálogo de componentes de IU
- 📄Guardar as variações dos componentes como estórias
- ⚡️Uso de ferramentas de experiência para o programador tal como o Hot Module Reloading
- 🛠Suporte de inúmeras camadas de visualização, incluíndo o React

Instalar e executar o Storybook

```bash
npx -p @storybook/cli sb init
yarn storybook
```
Deverá ver o seguinte:

![Interface de utilizador inicial Storybook](/design-systems-for-developers/storybook-initial.png)

Fantástico, acabámos de configurar o explorador de componentes!

Por defeito, o Storybook, cria uma pasta `src/stories` com alguns exemplos de estórias. No entanto, quando copiámos os nossos componentes, foram copiadas também as suas estórias. Podemos indexá-las no nosso Storybook através da alteração 
da localização das estórias no ficheiro `.storybook/config.js` para `’src/components’` ao invés de `’src/stories’` e com isto podemos remover a pasta ou diretório `src/stories` sem qualquer repercussão:

```javascript
import { configure } from '@storybook/react';

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```
Com isto o vosso Storybook deverá recarregar (notem que os estilos associados ás fontes estão um pouco diferentes, por exemplo reparem na estória "Initials"):

![Conjunto inicial de estórias](/design-systems-for-developers/storybook-initial-stories.png)

#### Adicionar estilos globais

O nosso sistema de design precisa de estilos globais (um reset CSS) que terão que ser aplicados ao documento de forma que os componentes renderizem de forma correta. Estes estilos podem ser facilmente adicionados através da tag style global do Styled Componentes. Como referência, o seguinte excerto demonstra como o código é exportado de `src/shared/global.js` 

```javascript
import { createGlobalStyle, css } from 'styled-components';
import { color, typography } from './styles';

export const fontUrl = 'https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900';

export const bodyStyles = css`
  /* global styles */
`;

export const GlobalStyle = createGlobalStyle`
 body {
   ${bodyStyles}
 }
`;
```

Para utilizar o "componente" `GlobalStyle` no Storybook, podemos recorrer a um decorador (um wrapper de componentes). Hierarquicamente em termos de layout, numa aplicação, este componente seria adicionado no topo.

```javascript
import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { GlobalStyle } from '../src/shared/global';

addDecorator(story => (
  <>
    <GlobalStyle />
    {story()}
  </>
));

// automatically import all files ending in *.stories.js
configure(require.context('../src', true, /\.stories\.js$/), module);
```

O decorador irá garantir que o `GlobalStyle` seja renderizado independentemente da estória selecionada.

<div class="aside">O <code><></code> utilizado no decorador não é um erro; mas sim um <a href="https://reactjs.org/docs/fragments.html">React Fragment</a> que é usado para evitar adicionar tags HTML extra desnecessariamente ao nosso output.</div>

#### Adicionar a tag de fontes

O nosso sistema de design depende também da injeção da fonte Nunito Sans na aplicação. A forma como é injetada numa aplicação depende da framework usada (leia mais acerca deste tópico [aqui](https://github.com/storybookjs/design-system#font-loading)), mas no Storybook a forma mais simples para isto é através da utilização de `.storybook/preview-head.html` que adiciona uma tag `<link>` diretamente no elemento `<head>` de uma página.

```javascript
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:400,700,800,900">
```

O vosso Storybook deverá assemelhar-se ao seguinte. Reparem no "T" que agora usa sans-serif, isto porque adicionámos estilos globais à fonte.

![Storybook carregado com estilos globais de fonte](/design-systems-for-developers/storybook-global-styles.png)

## Energizar o Storybook através de extras

O Storybook inclui um sistema de extras bastante poderoso, criado por uma comunidade bastante grande. Para o programador mais pragmático, é mais fácil construir o seu próprio fluxo de trabalho recorrendo ao ecossistema, ao invés de criar as suas próprias ferramentas (o que pode exigir muito tempo).

<h4>Extra Actions addon para verificar a interatividade</h4>

Quando uma ação é despoletada por um elemento interativo, tal como um botão ou link, o [extra actions](https://github.com/storybookjs/storybook/tree/next/addons/actions), fornece feedback no IU. Por defeito o extra Actions é instalado juntamente com o Storybook e pode ser usado de forma extremamente fácil, simplesmente fornecendo a "ação" pretendida como um adereço (prop na forma original) callback ao componente.

Em seguida vamos ver como o podemos usar no nosso elemento Button, que opcionalmente recebe um componente wrapper que reage aos clicks. Já existe uma estória que fornece uma ação a esse wrapper:

```javascript
import React from 'react';
import styled from 'styled-components';
import { action } from '@storybook/addon-actions';

// When the user clicks a button, it will trigger the `action()`,
// ultimately showing up in Storybook's addon panel.
function ButtonWrapper(props) {
return <CustomButton onClick={action('button action click')} {...props} />;
}

export const buttonWrapper = () => (
<Button ButtonWrapper={ButtonWrapper} appearance="primary">
// … etc ..
)
```

![Uso do extra actions](/design-systems-for-developers/storybook-addon-actions.gif)

#### Visualizar o código fonte e colar código

Muitas vezes, quando visualiza uma estória, gostaria de olhar para o código subjacente, perceber como funciona e colá-lo no projeto. O extra Storysource faz isso mesmo, mostra o código associado á estória que está selecionada no painel extras.

```bash
yarn add --dev  @storybook/addon-storysource
```

Registe-o em `.storybook/addons.js`:

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
```

E atualize a configuração do webpack que se encontra em `.storybook/webpack.config.js`: 

```javascript
module.exports = function({ config }) {
 config.module.rules.unshift({
   test: /\.stories\.jsx?$/,
   loaders: [require.resolve('@storybook/addon-storysource/loader')],
   enforce: 'pre',
 });

 return config;
};
```
No Storybook este fluxo de trabalho assemelha-se ao seguinte:

![O extra Storysource](/design-systems-for-developers/storybook-addon-storysource.png)

<h4>Knobs fazer testes de stress aos componentes</h4>

O [extra Knobs](https://github.com/storybookjs/storybook/tree/next/addons/knobs) permite que interaja dinamicamente com os adereços (props na forma original) do componente no IU do Storybook. O Knobs permite que sejam fornecidos múltiplos valores ao adereço (prop na forma original) de um componente e ajustá-las de acordo via IU. O que ajuda aos criadores de sistemas de design a fazerem testes de stress aos inputs dos componentes ajustando enfim, knobs. Mas também fornece aos consumidores de sistemas de design uma forma de testar os componentes antes de serem integrados, de forma a que possam compreender como cada adereço (prop na forma original) afeta o componente.

Vamos ver como isto funciona, através da configuração dos knobs no componente `Avatar`:

```bash
yarn add --dev @storybook/addon-knobs
```

Registe-o em `.storybook/addons.js`:

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-links/register';
import '@storybook/addon-storysource/register';
import '@storybook/addon-knobs/register';
```

Adicione uma estória que usa os knobs em  `src/Avatar.stories.js`:

```javascript
import React from 'react';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

// …

export const knobs = () => (
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
);

knobs.story = {
  decorators: [withKnobs],
};
```

No painel de extras, repare na tab Knobs. Instrumentalizámos o elemento de seleção "Size" de forma a permitir alternar entre os vários tamanhos suportados para o Avatar, `tiny`, `small`, `medium` e finalmente `large`. Pode instrumentalizar quaisquer outros adereços (props na forma original) com os knobs, também criar um "recreio" interativo para o componente.

![Extra knobs Storybook](/design-systems-for-developers/storybook-addon-knobs.gif)

Posto isto, os knobs não substituem as estórias. São fantásticos para explorar casos extremos associados aos componentes. Mas para ilustrar os casos pretendidos, são usadas estórias.

Tanto o extra Docs, como o extra Accessbility serão apresentados em capítulos posteriores.

> “O Storybook é uma ferramenta de trabalho poderosa para ambiente de trabalho para o frontend, que permite projetar, construir e organizar os componentes de IU (e mesmo até ecrãs!) sem serem incomodados pela lógica de negócio ou canalização” – Brad Frost, Autor de Atomic Design

## Aprenda a automatizar a manutenção

Agora que os nossos componentes do sistema de design já se encontram no Storybook, é necessário configurar um conjunto de ferramentas automatizadas que irão agilizar a sua manutenção contínua. Um sistema de design, tal como qualquer outro software, deverá evoluir. O desafio aqui é garantir que os componentes IU mantêm a aparência pretendida á medida que o sistema de design cresce.

No capítulo 4 vamos aprender a configurar a integração contínua e publicar automaticamente o sistema de design online para permitir colaboração.
