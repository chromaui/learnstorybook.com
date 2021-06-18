---
title: 'Exploradores de componentes'
tocTitle: 'Exploradores de componentes'
description: 'Una herramienta para el desarrollo de la UI y las pruebas visuales'
---

Las interfaces de usuario modernas admiten innumerables permutaciones de estado, idioma, dispositivo, navegador y datos de usuario. En el pasado, desarrollar la interfaz de usuario era engorroso. Tendrías que navegar a una página determinada en el dispositivo correcto con la configuración adecuada. Luego, harías clic para colocar la página en el estado correcto para poder comenzar a codificar.

**Un explorador de componentes aísla las preocupaciones de la UI, de la lógica de negocio y el contexto de la aplicación.** Usted crea componentes de UI de forma aislada para centrarse en las variaciones compatibles de cada componente. Eso le permite medir cómo las entradas (accesorios, estado) afectan la interfaz de usuario renderizada y forma la base de su conjunto de pruebas visuales.

[Storybook](https://storybook.js.org/) es el explorador de componentes estándar de la industria que usaremos para demostrar las pruebas visuales. Twitter, Slack, Airbnb, Shopify, Stripe y miles de otras empresas lo han adoptado, por lo que puedes aplicar los aprendizajes de esta guía donde sea que termines trabajando.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/storybook-component-explorer-visual-testing.mp4"
    type="video/mp4"/>
</video>

## ¿Por qué crear interfaces de usuario de forma aislada?

### Menos errores

Cuantos más componentes y estados tengas, más difícil será confirmar que todos se renderizan correctamente en los dispositivos y navegadores de los usuarios.

Los exploradores de componentes evitan la incoherencia al mostrar las variaciones admitidas de un componente. Eso permite a los desarrolladores centrarse en cada estado de forma independiente. Se pueden probar de forma aislada y puede utilizar la simulación para replicar casos extremos complicados.

![Casos de prueba de componentes](/visual-testing-handbook/component-test-cases.png)

### Desarrollo más rápido

Las aplicaciones nunca se terminan. Repites continuamente. Por lo tanto, las arquitecturas de la interfaz de usuario deben ser capaz de acomodarse para adaptarse a las nuevas funciones. El modelo de componentes fomenta la intercambiabilidad al separar la interfaz de usuario, de la lógica de negocio de la aplicación y el backend.

Los exploradores de componentes hacen evidente esta separación al proporcionar un entorno de pruebas cerrado (sandbox) para desarrollar la interfaz de usuario de forma aislada, lejos de la aplicación. Eso significa que los equipos pueden trabajar en diferentes piezas de la interfaz de usuario simultáneamente sin distracciones o contaminación del estado de otras partes de la aplicación.

### Colaboración más sencilla

Las interfaces de usuario son inherentemente visuales. Las pull requests de código son una representación incompleta del trabajo. Para desbloquear realmente la colaboración, las partes interesadas deben mirar la interfaz de usuario.

Los exploradores de componentes visualizan los componentes de la UI y todas sus variaciones. Eso hace que sea más fácil obtener comentarios sobre "¿esto se ve bien?" de desarrolladores, diseñadores, gerentes de producto y control de calidad.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/storybook-workflow-publish.mp4"
    type="video/mp4"/>
</video>

## ¿Dónde encaja en mi stack de tecnología?

Un explorador de componentes está empaquetado como una pequeña caja de arena independiente que vive junto a su aplicación. Te permite visualizar las variaciones de los componentes de forma aislada y contiene las siguientes características:

- 🧱 Sandbox para aislamiento de componentes
- 🔭 Visualizador de variaciones para la especificación y propiedades de los componentes
- 🧩 Guarde las variaciones como "historias" para volver a visitar durante las pruebas
- 📑 Documentación para descubrimiento de componentes y pautas de uso

![Relación entre componentes y exploradores de componentes](/visual-testing-handbook/storybook-relationship.png)

## Aprenda el flujo de trabajo

Aislar su interfaz de usuario con un explorador de componentes desbloquea las pruebas visuales. El siguiente capítulo muestra cómo mezclar el desarrollo guiado por pruebas (TDD) para el desarrollo de la interfaz de usuario.
