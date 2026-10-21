---
title: 'Complementos'
tocTitle: 'Complementos'
description: 'Aprende como integrar y utilizar el popular complemento Controls'
---

Storybook tiene un ecosistema sólido de [complementos, o "addons"](https://storybook.js.org/docs/configure/user-interface/storybook-addons) que puedes utilizar para mejorar la experiencia del desarrollador para todos en tu equipo. Puedes ver todo los complementos [aquí](https://storybook.js.org/integrations).

Si has estado siguiendo este tutorial, ya encontraste varios complementos y configuraste uno en el capítulo [Testing](/intro-to-storybook/react/es/test/).

Hay complementos para cada posible caso de uso, y demoraría una eternidad en escribir sobre todos. Vamos a integrar uno de los complementos más populares: [Controls](https://storybook.js.org/docs/essentials/controls).

## ¿Qué es Controls?

Controls permite a los diseñadores y desarrolladores explorar el comportamiento de los componentes _jugando_ con sus argumentos. No se requiere código. Controls crea un panel adicional junto a tus historias para que puedes editar sus argumentos en vivo.

Las nuevas instalaciones de Storybook incluyen Controls listo para usar. No se necesita configuración adicional.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-7-0.mp4"
    type="video/mp4"
  />
</video>

## Los complementos desbloquean nuevos flujos de trabajo de Storybook

Storybook es un [entorno de desarrollo basado en componentes](https://www.componentdriven.org/) maravilloso. El complemento Controls convierte a Storybook en una herramienta de documentación interactiva.

### Utilizando Controls para encontrar casos extremos

Con Controls, ingenieros de control de calidad (QA), ingenieros de UI o cualquier otra parte interesada pueden llevar el componente al límite. Considerando el siguiente ejemplo, ¿qué pasaría con nuestra `Task` si agregamos una cadena **ENORME**?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case-7-0.png)

Eso no está bien. Parece que el texto se desborda más alla de los límites del componente Task.

Controls nos permitió verificar rápidamente diferentes entradas a un componente (en este caso, una cadena larga) y redujo el trabajo requerido para descubrir problemas de interfaz de usuario.

Ahora solucionemos el problema con el desbordamiento agregando un estilo a `Task.jsx`:

```diff:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
          placeholder="Input title"
+         style={{ textOverflow: 'ellipsis' }}
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

![That's better.](/intro-to-storybook/edge-case-solved-with-controls-7-0.png)

Hemos resuelto el problema. Cuando el texto alcanza el límite del área de Task, usamos unos puntos suspensivos para truncar el texto.

### Agregando una nueva historia para evitar regresiones

En el futuro, podemos reproducir manualmente este problema ingresando la misma cadena a través de Controls. Pero es más fácil escribir una historia que muestre este caso extremo. Eso amplia nuestra cobertura de pruebas de regresión y describe claramente los límites de los componentes para el resto del equipo.

Agrega una nueva historia para el caso de texto largo en `Task.stories.jsx`:

```js:title=src/components/Task.stories.jsx
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};
```

Ahora podemos reproducir y trabajar en este caso extremo con facilidad.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-7-0.mp4"
    type="video/mp4"
  />
</video>

Si estamos haciendo [pruebas visuales](/intro-to-storybook/react/es/test/), las pruebas nos dirán si la solución de truncamiento se rompe. Los casos extremos podrían ser ignorados sin la cobertura de prueba.

<div class="aside">

💡 Controls es una excelente manera de hacer que los que no son desarrolladores jueguen con tus componentes e historias. Puede hacer mucho más que hemos visto aquí; recomendamos leer la [documentación oficial](https://storybook.js.org/docs/essentials/controls) para aprender más al respecto. Sin embargo, hay muchas más formas de personalizar Storybook para que se adapte a tu flujo de trabajo con complementos. En la [guía de crear un complemento](https://storybook.js.org/docs/addons/writing-addons) te enseñaremos eso, mediante la creación de un complemento que te ayudará a potenciar tu flujo de trabajo de desarrollo.

</div>

### Fusionar cambios

¡No olvides fusionar (merge) tus cambios con git!
