---
title: 'Extras'
tocTitle: 'Extras'
description: 'Aprender a integrar e usar extras com recurso a um exemplo popular'
commit: 'b3bca4a'
---

Storybook possui um sistema robusto de [extras](https://storybook.js.org/addons/introduction/) com o qual se pode aumentar a experiência de desenvolvimento para qualquer elemento da sua equipa. Se estiver a seguir este tutorial, pode ter reparado que já foram mencionados múltiplos extras e já terá implementado um no [capitulo de testes](/react/pt/test/).

<div class="aside">
    <strong>Á procura de uma lista de extras?</strong>
    <br/>
    😍 A lista de extras oficiais e da comunidade pode ser consultada <a href="https://storybook.js.org/addons">aqui</a>.
</div>

Poderíamos ficar aqui eternamente a discutir como configurar e usar os extras para todos os casos. Por enquanto, vamos focar-nos em integrar um dos extras mais populares no ecossistema Storybook: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Configuração do extra Knobs

Knobs é um recurso fantástico quer para designers quer para programadores, para fazerem experiências com componentes num ambiente controlado sem ser necessário qualquer tipo de código! Essencialmente, são fornecidos dados com os quais um qualquer utilizador irá manipular e fornecer aos componentes que se encontram definidos nas estórias. Isto é o que iremos implementar....

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

## Instalação

Primeiro irá ser necessário instalar todas as dependências necessárias.

```bash
yarn add -D @storybook/addon-knobs
```

Registe o Knobs no ficheiro (ou arquivo) `.storybook/main.js`.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
  ],
};
```

<div class="aside">
    <strong>📝A ordem em que se registam os extras tem muita importância!</strong>
    <br/>
    A ordem em que são listados os extras irá ditar a ordem em que aparecem como tabs no painel de extras(para os que irão aparecer).
</div>

E já está! É tempo de usar o extra numa estória.

### Utilização

Vamos usar o objeto knob no componente `Task`.

Primeiro, importamos o decorador `withKnobs` e o tipo `object` de knob para o ficheiro (ou arquivo) `Task.stories.js`:

```javascript
// src/components/Task.stories.js

import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

<div class="aside">Se estiver a usar TypeScript, o import terá que ser ligeiramente diferente, terá que ser <code>import { withKnobs, object } from '@storybook/addon-knobs'</code>.</div>

Em seguida, dentro do `default` export do ficheiro (ou arquivo) `Task.stories`, vamos fornecer `withKnobs` como elemento do `decorators`:

```javascript
// src/components/Task.stories.js

export default {
  component: Task,
  title: 'Task',
  decorators: [withKnobs],
  excludeStories: /.*Data$/,
};
```

Finalmente, integramos o tipo `object` do knob na estória "padrão":

```javascript
// src/components/Task.stories.js

export const Default = () => {
  return <Task task={object('task', { ...taskData })} {...actionsData} />;
};
```

Agora um novo item denominado "Knobs" deverá surgir próximo do "Action Logger" no painel inferior da aplicação.

Tal como documentado [aqui](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), este tipo aceita uma "etiqueta" e um objeto padrão como parâmetros.
A etiqueta é constante e irá aparecer no painel de extras á esquerda do campo de texto. O objeto fornecido será representado como um blob JSON que pode ser editado. Desde que seja submetido JSON válido, o componente irá ajustar-se com base na informação fornecida ao objeto!

## Os extras aumentam a esfera de ação do teu Storybook

Não somente a tua instância Storybook serve como um [ambiente CDD](https://www.componentdriven.org/) fantástico, mas agora estamos também a fornecer uma forma de documentação interativa. Os adereços (ou props) são fantásticos, mas quer um designer quer uma outra pessoa qualquer nova que é apresentada ao código do componente irá ser capaz de entender qual é o seu comportamento rapidamente graças ao Storybook e a este extra.

## Utilização de Knobs para afinar os casos extremos

Adicionalmente com a facilidade de edição de dados fornecidos ao componente, engenheiros QA ou Engenheiros UI, podem levar o componente ao extremo! Como exemplo o que irá acontecer ao nosso componente se contém uma cadeia de caracteres _GIGANTESCA_ ?

![OHH não! O conteúdo á direita aparece corto!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Devido a facilidade com que é possível testar inputs diferentes podemos descobrir e resolver estes problemas com facilidade! Vamos então resolver o nosso problema, através da adição de um elemento de estilo ao`Task.js`:

```javascript
// src/components/Task.js

// This is the input for our task title. In practice we would probably update the styles for this element
// but for this tutorial, let's fix the problem with an inline style:
<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![Assim sim.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Criação de uma nova estória para evitar regressões

Claro que podemos sempre reproduzir este problema através da introdução do mesmo input no objeto knob, mas é melhor escrever uma estória adicional para este input.
Isto irá expandir os testes de regressão e delinear com maior facilidade quais são os limites do componente(s) aos restantes elementos da equipa.

Vamos então adicionar uma estória para o caso da ocorrência de um texto grande no ficheiro Task.stories.js

```javascript
// src/components/Task.stories.js

const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = () => (
  <Task task={{ ...taskData, title: longTitleString }} {...actionsData} />
);
```

Agora que foi adicionada a estória, podemos reproduzir este caso extremo com relativa facilidade quando for necessário:

![Aqui está ele no Storybook](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Se estiverem a ser usados [testes de regressão visual](/react/pt/test/), iremos ser informados se a nossa solução elíptica for quebrada.
Tais casos extremos considerados obscuros têm tendência a ser esquecidos!

## Fusão das alterações

Não esquecer de fundir as alterações com o git!

<!-- this is commented based on the restructuring that was introduced with pr 341. Once 6.0 lands this needs to be added back based on controls.-->

<!-- ## Partilha de extras com a equipa

Knobs é uma forma fantástica de forma a permitir que elementos não programadores brinquem com os componentes e estórias. No entanto, pode ser difícil para estes executarem o Storybook nos seus ambientes locais. É por isso que uma implementação online pode ajudar em muito. No próximo capitulo iremos fazer exatamente isso!! -->
