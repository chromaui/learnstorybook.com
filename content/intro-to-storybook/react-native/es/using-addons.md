---
title: 'Complementos'
tocTitle: 'Complementos'
description: 'Aprende a integrar y usar complementos usando un ejemplo popular'
---

Storybook cuenta con un sistema robusto de [complementos](https://storybook.js.org/addons/introduction/) con el que puede mejorar la experiencia del desarrollador para
todos en tu equipo.

<div class = "aside">
    <strong> ¿Busca una lista de posibles complementos? </strong>
    <br/>
    😍 Puede ver la lista de complementos de la comunidad con respaldo oficial y con un fuerte respaldo <a href="https://storybook.js.org/addons/addon-gallery/"> aquí </a>.
</div>

Podríamos escribir para siempre sobre la configuración y el uso de complementos para todos sus casos de uso particulares. Por ahora, trabajemos para integrar uno de los complementos más populares dentro del ecosistema de Storybook: [knobs](https://github.com/storybooks/storybook/tree/master/addons/knobs).

## Configurando Knobs

Knobs es un recurso increíble para que los diseñadores y desarrolladores experimenten y jueguen con componentes en un entorno controlado sin necesidad de codificar! Básicamente, proporciona campos definidos dinámicamente con los que un usuario manipula los props que se pasan a los componentes de sus historias. Esto es lo que vamos a implementar ...

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/addon-knobs-demo.mp4"
    type="video/mp4"
  />
</video>

### Installation

Primero, tendremos que agregarlo como una dependencia de desarrollo

```bash
yarn add -D @storybook/addon-knobs @storybook/addon-ondevice-knobs
```

Registra Knobs en tu archivo `storybook/addons.js`.

```javascript

// storybook/addons.js
import '@storybook/addon-actions/register';
import '@storybook/addon-knobs/register';
import '@storybook/addon-links/register';
```

Y tambien en `storybook/rn-addons.js`.

```javascript

// storybook/rn-addons.js
import '@storybook/addon-ondevice-actions/register';
import '@storybook/addon-ondevice-knobs/register';
```

<div class = "aside">
<strong> 📝 ¡El orden de registro de complementos es importante! </strong>
<br/>
El orden en que enumere estos complementos determinará el orden en que aparecerán como pestañas en su panel de complementos (para aquellos que aparecen allí).
</div>

¡Eso es! Es hora de usarlo en una historia.

### Uso

Usemos el tipo de knob de objeto en el componente `Task`.

Primero, importe el decorador `withKnobs` y el tipo de knob `object` a `Task.stories.js`:

```javascript

// components/Task.stories.js
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, object } from '@storybook/addon-knobs';
```

A continuación, dentro de las historias de `Task`, agregue `withKnobs` como un parámetro para la funcion `addDecorator()`:

```javascript
// src/components/Task.stories.js

storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add(/*...*/);
```

Por último, integre el tipo de knob `object` dentro de la historia "predeterminada":

```javascript

// components/Task.stories.js
storiesOf('Task', module)
  .addDecorator(withKnobs)
  .add('default', () => <Task task={object('task', { ...task })} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />);
```

Ahora debería aparecer una nueva pestaña "Knobs" al lado de la pestaña "Action Logger" en el panel inferior.

Como se documenta [aquí](https://github.com/storybooks/storybook/tree/master/addons/knobs#object), el tipo `object` del knob acepta una etiqueta y un objeto predeterminado como parámetros. La etiqueta es constante y se muestra a la izquierda de un campo de texto en el panel de complementos. El objeto que ha pasado se representará como un blob JSON editable. ¡Siempre que envíe un JSON válido, su componente se ajustará en función de los datos que se pasan al objeto!

## Complementos evolucionan el alcance de tus Storybooks

Su instancia de Storybook no solo sirve como un maravilloso [CDD environment](https://blog.hichroma.com/component-driven-development-ce1109d56c8e), sino que ahora estamos proporcionando una fuente interactiva de documentación. Los props son geniales, pero un diseñador o alguien completamente nuevo en el código de un componente podrá descubrir su comportamiento muy rápidamente a través de Storybook con el complemento de knobs implementado.

## Usando Knobs para encontrar casos de borde

Además, con un fácil acceso para editar los datos pasados ​​a un componente, los QA Engineers o los UI Engineers ahora pueden llevar un componente al límite. Como ejemplo, ¿qué le sucede a `Task` si nuestro elemento de la lista tiene un string _GIGANTESCO_?

![¡Oh no! ¡El contenido de la extrema derecha está cortado!](/intro-to-storybook/addon-knobs-demo-edge-case.png) 😥

¡Gracias a poder probar rápidamente diferentes entradas a un componente, podemos encontrar y solucionar estos problemas con relativa facilidad! Arreglemos el problema de desbordamiento agregando un estilo a `Task.js`:

```javascript

// components/Task.js
// This is the input for our task title. It was changed to a simple text contrary to textinput,
// to illustrate how to see what's intended
<Text
  numberOfLines={1}
  ellipsizeMode="tail"
  style={
    state === 'TASK_ARCHIVED' ? styles.list_item_input_TASK_ARCHIVED : styles.list_item_input_TASK
  }
>
  {title}
</Text>
```

![Mucho mejor.](/intro-to-storybook/addon-knobs-demo-edge-case-resolved.png) 👍

## Agregar una nueva historia para evitar regresiones

Por supuesto, siempre podemos reproducir este problema ingresando la misma entrada en los mandos, pero es mejor escribir una historia fija para esta entrada. Esto aumentará sus pruebas de regresión y describirá claramente los límites de los componentes para el resto de su equipo.

Agreguemos una historia para el caso de texto largo en `Task.stories.js`:

```javascript

// components/Task.stories.js
const longTitle = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not`;

storiesOf('Task', module)
  .add('default', () => <Task task={task} {...actions} />)
  .add('pinned', () => <Task task={{ ...task, state: 'TASK_PINNED' }} {...actions} />)
  .add('archived', () => <Task task={{ ...task, state: 'TASK_ARCHIVED' }} {...actions} />)
  .add('long title', () => <Task task={{ ...task, title: longTitle }} {...actions} />);
```

Ahora que hemos agregado la historia, podemos reproducir este caso extremo con facilidad siempre que queramos trabajar en él:

![Aqui esta en la Storybook.](/intro-to-storybook/addon-knobs-demo-edge-case-in-storybook.png)

### Fusionar cambios

¡No olvides fusionar tus cambios con git!

## Compartir complementos con el equipo

Knobs es una excelente manera de hacer que los no desarrolladores jueguen con sus componentes e historias. Sin embargo, puede ser difícil para ellos ejecutar Storybook en su máquina local. Es por eso que implementar storybook en una ubicación en línea puede ser realmente útil. ¡En el próximo capítulo haremos exactamente eso!
