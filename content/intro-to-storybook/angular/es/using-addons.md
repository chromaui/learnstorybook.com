---
title: 'Complementos'
tocTitle: 'Complementos'
description: 'Aprenda a integrar y utilizar el popular complemento de controles'
commit: 'a4e9728'
---

Storybook tiene un ecosistema robusto de [complementos](https://storybook.js.
org/docs/angular/configure/storybook-addons) que puede utilizar para mejorar la experiencia de desarrollo para todos
los miembros de su equipo. Verlos todos [aquí](https://storybook.js.org/addons),

Si ha estado siguiendo este tutorial, ya ha encontrado varios complementos y ha configurado uno en el capítulo [Testing](/intro-to-storybook/angular/es/test/).

Hay complementos para cada caso de uso posible. Llevaría una eternidad escribir sobre todos ellos. Integremos uno de
los complementos más populares: [Controls](https://storybook.js.org/docs/angular/essentials/controls).

## ¿Qué son los controles?

Los controles permiten a los diseñadores y desarrolladores explorar fácilmente el comportamiento de los componentes
al _jugar_ con sus argumentos. No se requiere código. Controls crea un panel adicional junto a sus historias, para
que pueda editar sus argumentos en vivo.

Las nuevas instalaciones de Storybook incluyen controles listos para usar. No se necesita configuración adicional.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action.mp4"
    type="video/mp4"
  />
</video>

## Los complementos desbloquean nuevos flujos de trabajo de Storybook

Storybook es un maravilloso [component-driven development environment](https://www.componentdriven.org/). El
complemento Controls convierte Storybook en una herramienta de documentación interactiva.

### Usar controles para encontrar casos extremos

Con Controls, los ingenieros de control de calidad, los ingenieros de interfaz de usuario o cualquier otra parte
interesada pueden llevar el componente al límite. Consideremos el siguiente ejemplo, ¿qué pasaría con nuestra
`Task` si agregamos una cadena **MASIVA**?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case.png)

¡Eso no está bien! Parece que el texto se desborda más allá de los límites del componente Task.

Los controles nos permitieron verificar rápidamente diferentes entradas a un componente. En este caso una cadena
larga. Esto reduce el trabajo necesario para descubrir problemas de UI.

Ahora solucionemos el problema del desbordamiento agregando un estilo a `Task.vue`:

```diff:title=src/app/components/task.component.ts
<input
  type="text"
  [value]="task?.title"
  readonly="true"
  placeholder="Input title"
+ style="text-overflow: ellipsis;"
/>
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls.png)

¡Problema resuelto! El texto ahora está truncado cuando alcanza el límite del área de Tarea usando una ellipsis
atractiva.

### Agregar una nueva historia para evitar regresiones

En el futuro, podemos reproducir manualmente este problema ingresando la misma cadena a través de Controles. Pero es
más fácil escribir una historia que muestre este caso extremo. Eso amplía la cobertura de nuestra prueba de regresión y
describe claramente los límites de los componentes para el resto del equipo.

Agregue una nueva historia para el caso de texto largo en `Task.stories.js`:

```ts:title=src/app/components/task.stories.ts
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = Template.bind({});
LongTitle.args = {
  task: {
    ...Default.args.task,
    title: longTitleString,
  },
};
```

Ahora podemos reproducir y trabajar en este caso de desborde con facilidad.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title.mp4"
    type="video/mp4"
  />
</video>

Si estamos haciendo un [test visual](/intro-to-storybook/angular/es/test/), también se nos informará si se rompe la
solución de ellipse. ¡Los casos de borde oscuros pueden olvidarse sin cobertura de prueba!

<div class="aside"><p>💡 Los controles son una excelente manera de hacer que los no desarrolladores jueguen con sus 
componentes e historias, y mucho más de lo que hemos visto aquí, recomendamos leer la <a href="https://storybook.js.org/docs/angular/essentials/controls">documentation oficial</a> para aprender más acerca de esto. Sin embargo, hay muchas más formas de personalizar Storybook para que se adapte a su flujo de trabajo con complementos.</div>

### Mergear Cambios

¡No olvide guardar sus cambios con git!
