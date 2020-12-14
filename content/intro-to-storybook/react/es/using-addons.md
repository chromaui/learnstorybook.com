---
title: 'Complementos'
tocTitle: 'Complementos'
description: 'Aprende cómo interar y usar el popular complemento Controls'
commit: '271f39d'
---

Storybook tiene un ecosistema robusto de [complementos](https://storybook.js.org/docs/react/configure/storybook-addons) que puedes usar para mejorar la experiencia de desarrollo de todas las personas en tu equipo. Vedlos todos [aquí](https://storybook.js.org/addons),

Si has estado siguiendo este tutrial, ya te has encontrado con múltiples complementos, y has configurado uno en el capítulo [Testing](/react/en/test/).

Hay complementos para cada posible escenario. Se tardaría una eternidad en escribir acerca de todos ellos. Integremos uno de los complementos más populares: [Controls](https://storybook.js.org/docs/react/essentials/controls).

## What is Controls?
## ¿Qué son Controls?

Controls (o Controles) permite a los diseñadores y desarrolladores explorar fácilmente el comportamiento de los componentes _jugando_ con sus argumentos. No se necesita código. Controls crea un panel de complemento junto a tus historias, de manera que puedes editar sus argumentos en directo.

Las instalaciones de cero de Storybook incluyen Controls de serie. No se necesita ninguna configuración adicional.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Addons unlock new Storybook workflows
## Los complementos desbloquean nuevos workflows de Storybook

Storybook is a wonderful [component-driven development environment](https://www.componentdriven.org/). The Controls addon evolves Storybook into an interactive documentation tool.

### Usando Controls para encontrar casos extremos
¡Con Controls los Ingenieros QA, UI y cualquier otro interesado puede llevar el componente al límite! Consideremos el siguiente ejemplo: ¿Qué le ocurriría a nuestra `Task` si le añadiesemos una cadena de texto **MASIVA**?

![¡Oh no! El contenido de la derecha del todo sale cortado!](/intro-to-storybook/task-edge-case.png)

¡Eso no está bien! Parece que el texto se corre más allá de los límites del componente Task.
Controls nos permiten verificar rápidamente diferentes inputs a un componente. En este caso una cadena de texto larga. Esto reduce el trabajo requerido para descubrir problemas de interfaz de usuario.
Ahora, arreglemos el problema de desbordamiento añadiendo un estilo a `Task.js`:
```js
// src/components/Task.js

<input
  type="text"
  value={title}
  readOnly={true}
  placeholder="Input title"
  style={{ textOverflow: 'ellipsis' }}
/>
```

![Eso está mejor.](/intro-to-storybook/edge-case-solved-with-controls.png)

¡Problema resuelto! El texto está ahora truncado cuando alcanza el límite del area de Task usando una hermosa elipsis.

## Añadiendo una nueva historia para evitar regresiones

En el futuro, podemos reproducir manualmente este problema introduciendo la misma cadena de texto por medio de Controls. Pero es más fácil escribir una historia que exponga este caso extremo. Eso expande nuestra prueba o test de regresión  regresioó That expands our cobertura de la prueba de regresión y describe claramente los límites del componente o componentes para el resto del equipo.

Añade una nueva historia para el caso del texto largo en `Task.stories.js`:

```js
// src/components/Task.stories.js

const longTitleString = `El nombre de esta tarea es absurdamente grande. De hecho, creo que si sigo adelante podría terminar con un desbordamiento de contenido. ¿Qué pasará? La estrella que representa una tarea clavada podría tener el texto superpuesto. El texto podría cortarse abruptamente cuando llegue a la estrella. ¡Espero que no!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

Ahora podemos reproducir y trabajar en este caso de borde con facilidad.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

Si estamos haciendo [pruebas visuales](/react/en/test/), también se nos informará si la solución de ellipsize se rompe. ¡Los casos de bordes oscuros son susceptibles de ser olvidados si no se realiza la cobertura de pruebas!

### Fusionar cambios

¡No te olvides de fusionar tus cambios con git!

<div class="aside"><p>Controls es una manera genial de hacer que personas que no se dedican al desarrollo jueguen con tus componentes e historias, y mucho más de lo que hemos visto aquí, recomendamos leer la <a href="https://storybook.js.org/docs/react/essentials/controls"> documentación oficial</a> para saber más acerca de esto. Sin embargo, hay más maneras de customizar Storybook para adaptarlo a tu workflow con complementos. En el capítulo <a href="/intro-to-storybook/react/en/creating-addons">crear complementos</a> extra te enseñaremos eso, creando un complemento que te ayudará a supercargar tu workflow de desarrollo.</p></div>
