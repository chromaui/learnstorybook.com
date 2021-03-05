---
title: 'Documentar para as partes interessadas'
tocTitle: 'Documentar'
description: 'Acelere a adoção de sistemas de design através de documentação'
commit: a032b50
---

[Equipas](https://medium.com/@didoo/measuring-the-impact-of-a-design-system-7f925af090f7) [profissionais](https://product.hubspot.com/blog/how-to-gain-widespread-adoption-of-your-design-system) de
[frontend](https://segment.com/blog/driving-adoption-of-a-design-system/) medem o sucesso de um sistema de design através da sua adoção. De forma a colher todos os benefícios em termos de tempo de trabalho, os componentes precisam de circular. Caso contrário qual é o objetivo?

Neste capítulo vamos criar um "manual de utilizador" para o sistema de design, de forma a ajudar as restantes partes interessadas a reutilizar os componentes nas suas aplicações. Ao longo do trajeto, vamos revelar as boas práticas recomendadas para documentação de IU, usadas por equipas na Shopify, Microsoft, Auth0 e o governo britânico.

![Gerar documentação automáticamente com o Storybook](/design-systems-for-developers/design-system-generate-docs.jpg)

## A documentação é exaustiva

É óbvio; que a documentação é inestimável para um desenvolvimento colaborativo de IU. Ajuda as equipas a aprender como e quando usar os componentes de IU comuns. Mas porque é que precisa de tanto trabalho?

Se já alguma vez criou documentação, provavelmente gastou tempo com tarefas que não são relacionadas com documentação, tais como entender a infraestrutura do site, ou discutir com escritores técnicos. E mesmo que conseguiu arranjar tempo para publicar essa documentação, continua a ser doloroso mantê-la enquanto se continuam a desenvolver funcionalidades.

**A maioria da documentação está desatualizada assim que é criada.** Documentação desatualizada irá minar a confiança nos componentes do sistema de design, o que resulta que os programadores optem por criar novos componentes ao invés de reutilizar os que já existem.

## Requisitos

A nossa documentação deverá superar toda e qualquer atrito inerente á sua criação e manutenção, aqui ficam os seus deveres:

- **🔄Estar atualizada** através da utilização do código em produção mais recente
- **✍️Facilitar a escrita** recorrendo a ferramentas de escrita conhecidas tais como Markdown
- **⚡️Reduzir o tempo de manutenção** de forma que as equipas possam focar-se na escrita
- **📐Fornecer código base** para que os programadores não reescrevam quaisquer padrões comuns
- **🎨Oferecer costumizações** para qualquer caso particular complexo e componentes

Como utilizadores do Storybook, já temos um avanço, visto que as variações dos componentes estão definidas como estórias; uma forma de documentação. Uma estória ilustra como o componente irá funcionar com base em inputs diferentes (adereços (ou props na forma original)). As estórias são fáceis de escrever e podem ser atualizadas de forma automática, visto que usam os componentes em produção. Além disso as estórias podem ser testadas contra possíveis regressões recorrendo ás ferramentas mencionadas no capítulo anterior!

> Quando escreves estórias, recebes de graça a documentação dos adereços (props na forma original) do componente e também casos de utilização! – Justin Bennett, Engenheiro na Artsy

## Escreve estórias, gera documentação

Com o extra Docs do Storybook, podemos gerar documentação bastante rica a partir das estórias existentes, de forma a reduzir tempo associado a manutenção e obter os padrões prontos a usar. Com a consola aberta, navegue até à sua pasta ou diretório do sistema de design. E instale o extra de documentação:

```bash
yarn add --dev @storybook/addon-docs
```

Mas também iremos adicionar um _preset_ para este extra, crie o ficheiro `.storybook/presets.js` se ainda não existir. Note que a utilização deste ficheiro de preset, elimina a necessidade do `.storybook/webpack.config.js` e como tal pode ser eliminado:

```javascript
module.exports = ['@storybook/addon-docs/react/preset'];
```

Irá reparar que existem duas tabs no seu Storybook, a tab "Canvas" que corresponde ao seu ambiente de desenvolvimento para os componentes e a "Docs" para documentação do componente.

![tab documentação do Storybook](/design-systems-for-developers/storybook-docs.png)

Nos bastidores, o Storybook criou uma nova tab "Docs" para cada componente.A tab foi populada com as peças de documentação mais usadas, tais como pré-visualizações interativas, visualizadores de código fonte e uma tabela de adereços (props na forma original). Irá encontrar funcionalidades semelhantes na documentação do sistema de design do Shopify ou Auth0. Isto tudo em menos de 5 minutos.

## Extender a documentação

Até agora foram feitos progressos enormes sem ser necessário muito esforço da nossa parte. No entanto ainda falta á documentação um toque _humano_. É preciso oferecer um pouco mais de contexto (porquê, quando e como) para outro programador qualquer.

Começe por adicionar metadados adicionais que explicam o que o componente faz. No ficheiro `src/Avatar.stories.js`, adicione uma legenda que descreve para que o Avatar é usado:

```javascript
export default {
  title: 'Design System|Avatar',

  parameters: {
    component: Avatar,
    componentSubtitle: 'Displays an image that represents a user or organization',
  },
};
```

Em seguida adicione JSdoc ao componente Avatar (no ficheiro `src/components/Avatar.js`) sob a forma de uma descrição que será posteriormente lida:

```javascript
/**
- Use an avatar for attributing actions or content to specific users.
- The user's name should always be present when using Avatar – either printed beside
- the avatar or in a tooltip.
**/

export function Avatar({ loading, username, src, size, ...props }) {
```

Deverá ver algo do género:

![Tab documentação do Storybook com detalhes do componente](/design-systems-for-developers/storybook-docspage.png)

O Docs do Storybook gerou automaticamente a tabela de adereços (props na forma original) que apresenta quais os tipos e os valores por defeito. O que é extremamente conveniente, mas não garante que seja "á prova de bala"; diversos adereços (props na forma original) podem ser usados incorretamente. Adicione comentários aos proptypes para que sejam também renderizados na tabela de adereços (props na forma original) que é gerada automaticamente.

```javascript
Avatar.propTypes = {
  /**
    Use the loading state to indicate that the data Avatar needs is still loading.
    */
  loading: PropTypes.bool,
  /**
    Avatar falls back to the user's initial when no image is provided. 
    Supply a `username` and omit `src` to see what this looks like.
    */
  username: PropTypes.string,
  /**
    The URL of the Avatar's image.
    */
  src: PropTypes.string,
  /**
    Avatar comes in four sizes. In most cases, you'll be fine with `medium`.
    */
  size: PropTypes.oneOf(Object.keys(sizes)),
};
```

Por defeito, cada estória associada ao Avatar é renderizada na tab docs já mencionada. Não podemos assumir que os outros programadores saibam o que representa cada uma delas. No ficheiro `src/Avatar.stories.js` escreva um texto descritivo para cada uma das estórias:

```javascript
export const sizes = () => (
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
);
sizes.story = {
  parameters: { docs: { storyDescription: '4 sizes are supported.' } },
};
```

![Tab docs do Storybook com detalhes preenchidos](/design-systems-for-developers/storybook-docspage-expanded.png)

#### Energize a documentação com Markdown/MDX

Cada componente é diferente, assim como os requisitos de documentação. Usámos o Storybook Docs de forma a gerar documentação com base nas boas práticas de forma gratuita. Vamos adicionar alguma informação adicional e também identificar algumas nuances no nosso componente.

O Markdown é um formato para escrita de texto bastante linear. O MDX permite-nos usar código interativo (JSX) dentro do Markdown. O Docs do Storybook usa MDX de forma a oferecer aos programadores controlo absoluto sobre como a documentação é renderizada.

Primeiro, vamos controlar a geração de documentação do Avatar a partir do padrão existente. Registe o tipo de ficheiros MDX em `.storybook/config.js` da seguinte forma.

```javascript
// automatically import all files ending in *.stories.js|mdx
configure(require.context('../src', true, /\.stories\.(js|mdx)$/), module);
```

Crie um novo ficheiro `src/Avatar.stories.mdx` e adicione alguns detalhes. Em seguida vamos remover o ficheiro `Avatar.stories.js` e recriar as estórias existentes nesse ficheiro diretamente no ficheiro mdx:

```mdx
import { Meta, Story } from '@storybook/addon-docs/blocks';
import { withKnobs, select, boolean } from '@storybook/addon-knobs';

import { Avatar } from './Avatar';

<Meta title="Design System|Avatar" component={Avatar} />

# Avatar

## Displays an image that represents a user or organization

Use an avatar for attributing actions or content to specific users.
The user's name should _always_ be present when using Avatar – either printed beside the avatar or in a tooltip.

<Story name="standard">
  <Avatar
    size="large"
    username="Tom Coleman"
    src="https://avatars2.githubusercontent.com/u/132554"
  />
</Story>

### Sizes

4 sizes are supported.

<Story name="sizes">
  <div>
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="medium"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="small"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
    <Avatar
      size="tiny"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </div>
</Story>

### Default Values

When no image is supplied to the `src` prop, Avatar displays initials.
Avatar should be used sparingly in situations without access to images.

<Story name="initials">
  <div>
    <Avatar username="Tom Coleman" />
    <Avatar username="Dominic Nguyen" />
    <Avatar username="Kyle Suss" />
    <Avatar username="Michael Shilman" />
  </div>
</Story>

### Loading

The loading state is used when the image or username is, well, loading.

<Story name="loading">
  <div>
    <Avatar size="large" loading />
    <Avatar size="medium" loading />
    <Avatar size="small" loading />
    <Avatar size="tiny" loading />
  </div>
</Story>

### Playground

Experiment with this story with Knobs addon in Canvas mode.

<Story name="knobs" parameters={{ decorators: [withKnobs] }}>
  <Avatar
    loading={boolean('Loading')}
    size={select('Size', ['tiny', 'small', 'medium', 'large'])}
    username="Dominic Nguyen"
    src="https://avatars2.githubusercontent.com/u/263385"
  />
</Story>
```

No seu Storybook, a tab "Docs" associada ao componente Avatar, deverá ter sido substituída pela nova página que se encontra ainda algo "crua".

![documentação Storybook a partir de MDX](/design-systems-for-developers/storybook-docs-mdx-initial.png)

O Docs do Storybook vem com o "Doc Blocks", um conjunto de componentes prontos a serem usados que oferecem funcionalidades tais como: pré-visualizações interativas, a tabela de adereços (props na forma original), entre muitos outros. Por defeito, estes são usados nos bastidores durante o processo de geração das páginas de documentação automáticas.Mas podem também ser extraídos para uso individual. O nosso objetivo consiste em costumizar a documentação do Avatar sem que tenhamos que refazer tudo por nós próprios, para evitar isso vamos reutilizar os Doc Blocks sempre que for possível.

Vamos adicionar o bloco de documentação `Props` e envolver a estória inicial num `Preview`

```mdx
import { Meta, Story, Props, Preview } from '@storybook/addon-docs/blocks';

# …

<Preview withToolbar>
  <Story name="standard">
    <Avatar
      size="large"
      username="Tom Coleman"
      src="https://avatars2.githubusercontent.com/u/132554"
    />
  </Story>
</Preview>

<Props of={Avatar} />
```

![Documentação do  Storybook com MDX e blocks](/design-systems-for-developers/storybook-docs-mdx-docblocks.png)

Fantástico! Voltámos ao ponto de partida, mas agora com controlo absoluto da ordenação e conteúdo. Os benefícios inerentes à geração de documentação automática continuam a persistir, visto que estamos a usar Doc Blocks.

Altere a documentação do Avatar introduzindo uma nota acerca dos casos de uso. Isto
oferece contexto aos programadores, sobre como tirar partido deste componente. Podemos adicionar apenas algum markdown tal como noutro documento qualquer:

```mdx
// As before

<Props of={Avatar} />

## Usage

Avatar is used to represent a person or an organization.
By default the avatar shows an image and gracefully falls back to the first initial of the username.
While hydrating the component you may find it useful to render a skeleton template to indicate that Avatar is awaiting data.
Avatars can be grouped with the AvatarList component.

### Sizes

// As before
```

![Documentação Storybook para MDX com informação de utilização](/design-systems-for-developers/storybook-docs-mdx-usage.png)

#### Páginas personalizadas

Cada sistema de design vem com uma página de rosto. O Storybook Docs permite a construção de páginas discretas utilizando MDX.

Crie um novo ficheiro `src/components/Intro.stories.mdx`:

```mdx
import { Meta } from '@storybook/addon-docs/blocks';

<Meta title="Design System|Introduction" />

# Introduction to the Learn Storybook design system

The Learn Storybook design system is a subset of the full [Storybook design system](https://github.com/storybookjs/design-system/).
Created as a learning resource for those interested in learning how to write and publish a design system using best practice techniques.

Learn more at [Learn Storybook](https://learnstorybook.com).
```

Isto gera uma nova página somente de documentação, que é independente das restantes páginas de documentação automáticas criadas anteriormente, associadas a componentes.

![Storybook docs with introduction page, unsorted](/design-systems-for-developers/storybook-docs-introduction-unsorted.png)

Para que esta apareça primeiro, precisamos notificar o Storybook para carregar esta página primeiro:

```javascript
configure(
  [
    require.context('../src', false, /Intro\.stories\.mdx/),
    require.context('../src', true, /\.stories\.(js|mdx)$/),
  ],
  module
);
```

![Documentação Storybook docs com página de introdução](/design-systems-for-developers/storybook-docs-introduction.png)

## Publicar a documentação online

Se escreve documentação que ninguém lê, será útil? Não. Não chega somente criar materiais de aprendizagem de alta qualidade, precisamos divulgar estes materiais aos colegas de equipa e outras partes interessadas. Até agora a nossa documentação encontra-se escondida no repositório, o que significa que as pessoas precisam executar localmente o Storybook do sistema de design para poderem visualizar a documentação.

Num capítulo anterior, publicámos o Storybook online para revisão visual. É bastante fácil usar o mesmo mecanismo para publicar a nossa documentação dos componentes também. Vamos adicionar um novo script ao ficheiro `package.json` para poder construir o nosso Storybook em modo de documentação:

```json
{
  "scripts": {
    "build-storybook-docs": "build-storybook -s public --docs"
  }
}
```

Guarde as alterações e faça a submissão. Poderíamos alterar a publicação no Netlify para permitir a implementação do site da documentação, ou então usar um segundo sistema de implementação (tal como [now.sh](https://zeit.co/home)) para implementar o site de documentação a cada alteração.

<div class="aside">Á medida que o seu sistema de design cresce, pode encontrar alguns requisitos que são específicos á organização, que necessitam de um conjunto de ferramentas específico, ou mesmo até construir o vosso site estático utilizando ferramentas tais como Gatsby ou Next. Mas é bastante fácil migrar o markdown e MDX para outras soluções</div>

## Importar o sistema de design noutras aplicações

Até agora, temos estado concentrados no interior. Primeiro a criar componentes de IU duradouros. Em seguida a rever, testar e documentar. Agora vamos mudar de perspetiva, para o exterior de forma a examinar como as equipas consomem os sistemas de design.

O capítulo 7 demonstra como empacotar o sistema de design para ser usado noutras aplicações. Aprenda como combinar o npm, o gestor de pacotes do Javascript, com o Auto, uma ferramenta de gestão de versões que economiza tempo.
