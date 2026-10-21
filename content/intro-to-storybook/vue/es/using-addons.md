---
title: 'Complementos'
tocTitle: 'Complementos'
description: 'Aprende a integrar y usar complementos usando un ejemplo popular'
---

Storybook cuenta con un sistema robusto de [complementos](https://storybook.js.org/docs/vue/configure/storybook-addons) con el que puede mejorar la experiencia del desarrollador para todos en tu equipo. Véalos todos [aquí](https://storybook.js.org/addons).

Si ha seguido este tutorial linealmente, hasta ahora hemos hecho referencia a varios complementos, y ya habrá implementado uno en el capítulo [Testing](/intro-to-storybook/vue/es/test/).

Hay complementos para cada caso de uso posible. Llevaría una eternidad escribir sobre todos ellos. Integremos uno de los complementos más populares: [Controles](https://storybook.js.org/docs/vue/essentials/controls).

## ¿Qué son los controles?

Los controles permiten a los diseñadores y desarrolladores explorar fácilmente el comportamiento de los componentes al _jugar_ con sus argumentos. No se requiere código. Controls crea un panel adicional junto a sus historias, para que pueda editar sus argumentos en vivo.

Las nuevas instalaciones de Storybook incluyen controles listos para usar. No se necesita configuración adicional.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Los complementos desbloquean nuevos flujos de trabajo de Storybook

Storybook es un maravilloso [entorno de desarrollo basado en componentes](https://www.componentdriven.org/). El complemento de Controles convierte Storybook en una herramienta de documentación interactiva.

### Usando controles para encontrar casos de borde

Con los Controles, los ingenieros de control de calidad, los ingenieros de interfaz de usuario o cualquier otra parte interesada pueden llevar el componente al límite. Consideremos el siguiente ejemplo, ¿qué pasaría con nuestra `Task` si agregamos una string **GIGANTESCO**?

![¡Oh no! ¡El contenido de la extrema derecha está cortado!](/intro-to-storybook/task-edge-case.png)

¡Eso no está bien! Parece que el texto se desborda más allá de los límites del componente Task.

Los controles nos permitieron verificar rápidamente diferentes entradas a un componente. En este caso un string largo. Esto reduce el trabajo necesario para descubrir problemas de IU.

Ahora solucionemos el problema del desbordamiento agregando un estilo a `Task.vue`:

```diff:title=src/components/Task.vue
<input
  type="text"
  :value="task.title"
  readonly
  placeholder="Input title"
+ style="text-overflow: ellipsis;"
/>
```

![Mucho mejor.](/intro-to-storybook/edge-case-solved-with-controls.png) 👍

¡Problema resuelto! El texto ahora está truncado cuando alcanza el límite del área de Tarea usando una elipsis atractiva.

## Agregar una nueva historia para evitar regresiones

En el futuro, podemos reproducir manualmente este problema ingresando la misma entrada a través de Controles. Pero es más fácil escribir una historia que muestre este caso de vanguardia. Eso amplía la cobertura de nuestra prueba de regresión y describe claramente los límites de los componentes para el resto del equipo.

Agreguemos una historia para el caso de texto largo en `Task.stories.js`:

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;
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

Si estamos utilizando [pruebas de regresión visual](/intro-to-storybook/vue/es/test/), también se nos informará si alguna vez rompemos nuestra solución de elipsis. ¡Esos casos extremos oscuros siempre pueden ser olvidados!

<div class="aside"><p>💡 Los controles son una excelente manera de hacer que los no desarrolladores jueguen con sus componentes e historias, y mucho más de lo que hemos visto aquí, recomendamos leer la <a href="https://storybook.js.org/docs/vue/essentials/controls">documentación oficial</a> para obtener más información al respecto. Sin embargo, hay muchas más formas de personalizar Storybook para que se adapte a su flujo de trabajo con complementos.</div>

### Fusionar cambios

¡No olvides fusionar tus cambios con git!
