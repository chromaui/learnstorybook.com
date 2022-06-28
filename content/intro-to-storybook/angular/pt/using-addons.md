---
title: 'Extras'
tocTitle: 'Extras'
description: 'Aprender a integrar e usar extras com recurso a um exemplo popular'
---

Storybook possui um sistema robusto de [extras](https://storybook.js.org/docs/angular/configure/storybook-addons) com o qual se pode aumentar a experiência de desenvolvimento para qualquer elemento da sua equipa. Se estiver a seguir este tutorial, pode ter reparado que já foram mencionados múltiplos extras e já terá implementado um no [capitulo de testes](/intro-to-storybook/angular/pt/test/).

<div class="aside">
    <strong>Á procura de uma lista de extras?</strong>
    <br/>
    😍 A lista de extras oficiais e da comunidade pode ser consultada <a href="https://storybook.js.org/addons">aqui</a>.
</div>

Poderíamos ficar aqui eternamente a discutir como configurar e usar os extras para todos os casos. Por enquanto, vamos focar-nos em integrar um dos extras mais populares no ecossistema Storybook: [knobs](https://github.com/storybookjs/addon-knobs).

## Configuração do extra Knobs

Knobs é um recurso fantástico quer para designers quer para programadores, para fazerem experiências com componentes num ambiente controlado sem ser necessário qualquer tipo de código! Essencialmente, são fornecidos dados com os quais um qualquer utilizador irá manipular e fornecer aos componentes que se encontram definidos nas estórias. Isto é o que iremos implementar....

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

## Instalação

Primeiro irá ser necessário adicioná-lo como dependência de desenvolvimento.

```bash
yarn add -D @storybook/addon-knobs
```

Registe o Knobs no ficheiro `.storybook/main.js`.

```javascript
// .storybook/main.js

module.exports = {
  stories: ['../src/app/components/**/*.stories.ts'],
  addons: ['@storybook/addon-actions', '@storybook/addon-knobs', '@storybook/addon-links'],
};
```

<div class="aside">
    <strong>📝A ordem em que se registam os extras tem muita importância!</strong>
    <br/>
    A ordem em que são listados os extras irá ditar a ordem em que aparecem como tabs no painel de extras( para os que irão aparecer).
</div>

E já está! É tempo de usar o extra numa estória.

### Utilização

Vamos usar o objeto knob no componente `Task`.

Primeiro, importamos o decorador `withKnobs` e o tipo `object` de knob para o ficheiro `task.stories.js`:

```javascript
// src/app/components/task.stories.ts
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
```

Em seguida, dentro do `default` export do ficheiro `task.stories.ts`, vamos fornecer `withKnobs` como elemento do `decorators`:

```javascript
// src/app/components/task.stories.ts
export default {
  title: 'Task',
  decorators: [withKnobs],
  // same as before
};
```

Finalmente, integramos o tipo `object` do knob na estória "padrão":

```javascript
// src/app/components/task.stories.ts

// default task state
export const Default = () => ({
  component: TaskComponent,
  props: {
    task: object('task', { ...taskData }),
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});

// same as before
```

Agora um novo item denominado "Knobs" deverá surgir próximo do "Action Logger" no painel inferior da aplicação.

Tal como documentado [aqui](https://github.com/storybookjs/addon-knobs#object), este tipo aceita uma "etiqueta" e um objeto padrão como parâmetros.
A etiqueta é constante e irá aparecer no painel de extras á esquerda do campo de texto. O objeto fornecido será representado como um blob JSON que pode ser editado. Desde que seja submetido JSON válido, o componente irá ajustar-se com base na informação fornecida ao objeto!

## Os extras aumentam a esfera de ação do teu Storybook

Não somente a tua instância Storybook serve como um [ambiente CDD](https://www.componentdriven.org/) fantástico, mas agora estamos também a fornecer uma forma de documentação interativa. Os adereços (ou props) são fantásticos, mas quer um designer quer uma outra pessoa qualquer nova que é apresentada ao código do componente irá ser capaz de entender qual é o seu comportamento rapidamente graças ao Storybook e a este extra.

## Utilização de Knobs para afinar os casos extremos

Adicionalmente com a facilidade de edição de dados fornecidos ao componente, engenheiros QA ou Engenheiros UI, podem levar o componente ao extremo! Como exemplo o que irá acontecer ao nosso componente se contém uma cadeia de caracteres _GIGANTESCA_ ?

![OHH não! O conteúdo á direita aparece corto!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

Devido a facilidade com que é possível testar inputs diferentes podemos descobrir e resolver estes problemas com facilidade! Vamos então resolver o nosso problema, através da adição de um elemento de estilo ao `task.component.ts`:

```html
<!-- src/app/components/task.component.ts -->

<!-- This is the input for our task title. In practice we would probably update the styles for this element
but for this tutorial, let's fix the problem with an inline style:
 -->
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
  [ngStyle]="{textOverflow:'ellipsis'}"
/>
/>
```

![Assim sim.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Criação de uma nova estória para evitar regressões

Claro que podemos sempre reproduzir este problema através da introdução do mesmo input no objeto knob, mas é melhor escrever uma estória adicional para este input.
Isto irá expandir os testes de regressão e delinear com maior facilidade quais são os limites do componente(s) aos restantes elementos da equipa.

Vamos então adicionar uma estória para o caso da ocorrência de um texto grande no ficheiro `task.stories.ts`:

```javascript
// src/app/components/task.stories.ts

// tslint:disable-next-line: max-line-length
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

// same as before

export const LongTitle = () => ({
  component: TaskComponent,
  props: {
    task: {
      ...taskData,
      title: longTitle,
    },
    onPinTask: actionsData.onPinTask,
    onArchiveTask: actionsData.onArchiveTask,
  },
});
```

Agora que foi adicionada a estória, podemos reproduzir este caso extremo com relativa facilidade quando for necessário:

![Aqui está ele no Storybook](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

Se estiverem a ser usados [testes de regressão visual](/intro-to-storybook/angular/pt/test/), iremos ser informados se a nossa solução elíptica for quebrada.
Tais casos extremos considerados obscuros têm tendência a ser esquecidos!

### Fusão das alterações

Não esquecer de fundir as alterações com o git!
