---
title: "Extras"
tocTitle: "Extras"
description: "Aprender a integrar e usar extras com recurso a um exemplo popular"
commit: "dac373a"
---

Storybook possui um sistema robusto de [extras](https://storybook.js.org/addons/introduction/) com o qual se pode aumentar a experiência de desenvolvimento para qualquer elemento da sua equipa. Se estiver a seguir este tutorial, pode ter reparado que já foram mencionados múltiplos extras e já terá implementado um no [capitulo de testes](/react/pt/test/).

<div class="aside">
    <strong>Á procura de uma lista de extras?</strong>
    <br/>
    😍 A lista de extras oficiais e da comunidade pode ser consultada <a href="https://storybook.js.org/addons/addon-gallery/">aqui</a>.
</div>

Poderíamos ficar aqui eternamente a discutir como configurar e usar os extras para todos os casos. Por enquanto, vamos focar-nos em integrar um dos extras mais populares no ecossistema Storybook: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Configuração do extra Knobs

Knobs é um recurso fantástico quer para designers quer para programadores, para fazerem experiências com componentes num ambiente controlado sem ser necessário qualquer tipo de código! Essencialmente, são fornecidos dados com os quais um qualquer utilizador irá manipular e fornecer aos componentes que se encontram definidos nas estórias. Isto é o que iremos implementar....

![Knobs in action](/addon-knobs-demo.gif)

## Instalação

Primeiro irá ser necessário instalar todas as dependências necessárias.

```bash
yarn add @storybook/addon-knobs
```

Registar o Knobs no ficheiro `.storybook/addons.js`.

```javascript
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

<div class="aside">
    <strong>📝A ordem em que se registam os extras tem muita importância!</strong>
    <br/>
    A ordem em que são listados os extras irá ditar a ordem em que aparecem como tabs no painel de extras(para os que irão aparecer).
</div>

E já está! É tempo de usar o extra numa estória.

### Utilização

Vamos usar o objecto knob no componente `Task`.

Primeiro, importamos o decorador `withKnobs` e o tipo `object` de knob para o ficheiro `Task.stories.js`:

```javascript
import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs/react';
```

Em seguida, dentro das estórias do componente `Task`, iremos fornecer `withKnobs` como parâmetro da função `addDecorator()`:

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

Finalmente, integramos o tipo `object` do knob na estória "padrão":

```javascript
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    return <Task task={object('task', { ...task })} {...actions} />;
  })
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Tal como se encontra documentado [aqui](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), este tipo aceita uma "etiqueta" e um objeto padrão como parâmetros.
A etiqueta é constante e irá aparecer no painel de extras á esquerda do campo de texto. O objeto fornecido será representado como um blob JSON que pode ser editado. Desde que seja submetido JSON válido, o componente irá ajustar-se com base na informação fornecida ao objeto!

## Os extras aumentam a esfera de ação do teu Storybook

Não somente a tua instância Storybook serve como um [ambiente CDD](https://blog.hichroma.com/component-driven-development-ce1109d56c8e) fantástico, mas agora estamos também a fornecer uma forma de documentação interativa. Os PropTypes são fantásticos, mas quer um designer quer uma outra pessoa qualquer nova que é apresentada ao código do componente irá ser capaz de entender qual é o seu comportamento rapidamente graças ao Storybook e a este extra.

## Utilização de Knobs para afinar os casos extremos

Adicionalmente com a facilidade de edição de dados fornecidos ao componente, engenheiros QA ou Engenheiros UI, podem levar o componente ao extremo! Como exemplo o que irá acontecer ao nosso componente se contém uma cadeia de caracteres _GIGANTESCA_ ? [OHH não! O conteúdo á direita aparece corto!](/addon-knobs-demo-edge-case.png) 😥

Devido a facilidade com que é possível testar inputs diferentes podemos descobrir e resolver estes problemas com facilidade! Vamos então resolver o nosso problema, através da adição de um elemento de estilo ao `Task.js`:

```javascript
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

[Assim sim.](/addon-knobs-demo-edge-case-resolved.png) 👍

## Criação de uma nova estória para evitar regressões

Claro que podemos sempre reproduzir este problema através da introdução do mesmo input no objeto knob, mas é melhor escrever uma estória adicional para este input.
Isto irá expandir os testes de regressão e delinear com maior facilidade quais são os limites do componente(s) aos restantes elementos da equipa.

Vamos então adicionar uma estória para o caso da ocorrência de um texto grande no ficheiro Task.stories.js

```javascript
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />)
  .add('long title', () => <Task task={{ ...task, title: longTitle }} {...actions} />);
```

Agora que foi adicionada a estória, podemos reproduzir este caso extremo com relativa facilidade quando for necessário:

[Aqui está ele no Storybook](/addon-knobs-demo-edge-case-in-storybook.png)

Se estiverem a ser usados [testes de regressão visual](/react/pt/test/), iremos ser informados se a nossa solução eliptica for quebrada.
Tais casos extremos considerados obscuros têm tendência a ser esquecidos!

## Fusão das alterações

Não esquecer de fundir as alterações com o git!

## Partilha de extras com a equipa

Knobs é uma forma fantástica de forma a permitir que elementos não programadores brinquem com os componentes e estórias. No entanto, pode ser dificil para estes executarem o storybook nos seus ambientes locais. É por isso que uma implementação online pode ajudar em muito. No próximo capitulo iremos fazer exatamente isso!
