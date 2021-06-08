---
title: 'Introducción a los Sistemas de Diseño'
tocTitle: 'Introducción'
description: 'Una guía de las últimas herramientas listas para producción para sistemas de diseño'
---

<div class="aside">Esta guía está hecha para <b>desarrolladores profesionales</b> que aprenden a construir sistemas de diseño. Se recomienda experiencia intermedia en JavaScript, Git e integración continua. También debe conocer los conceptos básicos de Storybook, como escribir una historia y editar archivos de configuración (<a href="/intro-to-storybook">(la Introducción a Storybook</a> enseña los conceptos básicos).
</div>

<br/>

Los sistemas de diseño están ganando popularidad. Desde los pesos pesados de la tecnología como Airbnb hasta las nuevas empresas ágiles, las organizaciones de todas las formas están reutilizando los patrones de UI para ahorrar tiempo y dinero. Pero existe un abismo entre los sistemas de diseño creados por Airbnb, Uber o Microsoft y los sistemas de diseño creados por la mayoría de los desarrolladores.

¿Por qué los equipos de sistemas de diseño líderes utilizan las herramientas y técnicas que utilizan? Mi coautor Tom y yo investigamos las características de los sistemas de diseño exitosos de la comunidad de Storybook para identificar las mejores prácticas.

Esta guía paso a paso revela las herramientas automatizadas y los cuidadosos flujos de trabajo que se utilizan en los sistemas de diseño de producción a escala. Analizaremos cómo ensamblar un sistema de diseño a partir de bibliotecas de componentes existentes y, luego, configuraremos los servicios básicos, las bibliotecas y los flujos de trabajo.

![Design system overview](/design-systems-for-developers/design-system-overview.jpg)

## ¿Qué es todo el alboroto sobre los sistemas de diseño de todos modos?

Vamos a aclarar algo: el concepto de una interfaz de usuario reutilizable no es nuevo. Las guías de estilo, los kits de interfaz de usuario y los widgets que se pueden compartir existen desde hace décadas. Hoy en día, los diseñadores y desarrolladores se están alineando con la construcción del componente de la interfaz de usuario. Un componente de la interfaz de usuario encapsula las propiedades visuales y funcionales de las distintas piezas de la interfaz de usuario. Piense en ladrillos LEGO.

Las interfaces de usuario modernas se ensamblan a partir de cientos de componentes de UI modulares que se reorganizan para ofrecer diferentes experiencias de usuario.

Los sistemas de diseño contienen componentes de UI reutilizables que ayudan a los equipos a crear interfaces de usuario complejas, duraderas y accesibles en todos los proyectos. Dado que tanto los diseñadores como los desarrolladores contribuyen a los componentes de la interfaz de usuario, el sistema de diseño sirve como puente entre las disciplinas. También es la "fuente de la verdad" para los componentes comunes de una organización.

![Design systems bridge design and development](/design-systems-for-developers/design-system-context.jpg)

Los diseñadores a menudo hablan de sistemas de diseño dentro de sus herramientas. El alcance holístico de un sistema de diseño abarca activos (Sketch, Figma, etc.), principios de diseño generales, estructura de contribución, gobernanza y más. Hay una gran cantidad de guías orientadas al diseñador que profundizan en estos temas, por lo que no lo repetiremos aquí.

Para los desarrolladores, algunas cosas son seguras, los sistemas de diseño de producción deben incluir los componentes de la interfaz de usuario y la infraestructura de interfaz detrás de todo. Hay tres partes técnicas en un sistema de diseño de las que hablaremos en esta guía:

- 🏗 Componentes de UI reutilizables
- 🎨 Variables específicas de estilo, como el espaciado y los colores de la marca.
- 📕 Sitio de documentación: instrucciones de uso, narrativa, lo que se debe y no se debe hacer

Las piezas se empaquetan, versionan y distribuyen a las aplicaciones de los consumidores a través de un administrador de paquetes.

## ¿Necesitas un sistema de diseño?

A pesar del bombo publicitario, un sistema de diseño no es una solución milagrosa. Si trabaja con un equipo modesto en una sola aplicación, estará mejor con un directorio de componentes de UI en lugar de configurar la infraestructura para habilitar un sistema de diseño. Para proyectos pequeños, el costo de mantenimiento, integración y herramientas supera con creces cualquier beneficio de productividad que pueda ver.

La economía de escala en un sistema de diseño funciona a su favor cuando comparte componentes de interfaz de usuario en muchos proyectos. Si se encuentra pegando los mismos componentes de la interfaz de usuario en diferentes aplicaciones o entre equipos, esta guía es para usted.

## Qué estamos construyendo

Storybook impulsa los sistemas de diseño de [Uber](https://github.com/uber-web/baseui), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/), y cientos de empresas más. Las recomendaciones aquí están inspiradas en las mejores prácticas y herramientas de los equipos más inteligentes. Seguiremos el siguiente frontend stack:

#### Construir componentes

- 📚 [Storybook](http://storybook.js.org) para el desarrollo de componentes de UI y documentación generada automáticamente
- ⚛️ [React](https://reactjs.org/) para UI declarativa centrada en componentes (a través de create-react-app)
- 💅 [Styled-components](https://www.styled-components.com/) para un estilo con alcance de componente
- ✨ [Prettier](https://prettier.io/) para formateo de código automático

#### Mantener el sistema

- 🚥 [GitHub Actions](https://github.com/features/actions) para integración continua
- 📐 [ESLint](https://eslint.org/) para linting de JavaScript
- ✅ [Chromatic](https://chromatic.com) para detectar errores visuales en los componentes (creado por los mantenedores de Storybook)
- 🃏 [Jest](https://jestjs.io/) para pruebas unitarias de componentes
- 📦 [npm](https://npmjs.com) para distribuir la librería
- 🛠 [Auto](https://github.com/intuit/auto) para la gestión de versiones

#### Storybook addons

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y) para comprobar si hay problemas de accesibilidad durante el desarrollo
- 💥 [Actions](https://storybook.js.org/docs/react/essentials/actions) para control de calidad e interacciones
- 🎛 [Controls](https://storybook.js.org/docs/react/essentials/controls) para ajustar de forma interactiva los props y experimentar con componentes
- 📕 [Docs](https://storybook.js.org/docs/react/writing-docs/introduction) para la generación automática de documentación a partir de historias

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## Comprender el flujo de trabajo

Los sistemas de diseño son una inversión en infraestructura frontend. Además de mostrar cómo utilizar la tecnología anterior, esta guía también se centra en los flujos de trabajo centrales que promueven la adopción y simplifican el mantenimiento. Siempre que sea posible, las tareas manuales se automatizarán. A continuación se muestran las actividades que encontraremos.

#### Cree componentes de interfaz de usuario de forma aislada

Cada sistema de diseño está compuesto por componentes de interfaz de usuario. Usaremos Storybook como un "banco de trabajo" para crear componentes de UI de forma aislada fuera de nuestras aplicaciones para consumidores. Luego, integraremos complementos que le permitirán ahorrar tiempo y que lo ayudarán a aumentar la durabilidad de los componentes (Acciones, A11y, Controles).

#### Revisar para llegar a un consenso y recopilar comentarios

El desarrollo de UI es un deporte de equipo que requiere alineación entre desarrolladores, diseñadores y otras disciplinas. Publicaremos los componentes de la UI del trabajo en progreso para que las partes interesadas participen en el proceso de desarrollo para que podamos realizar envíos más rápido.

#### Prueba para evitar errores de UI

Los sistemas de diseño son una única fuente de verdad y un único punto de falla. Los errores menores de la interfaz de usuario en los componentes básicos pueden convertirse en incidentes en toda la empresa. Automatizaremos las pruebas para ayudarlo a mitigar los errores inevitables para enviar componentes de UI accesibles y duraderos con confianza.

#### Documentar para acelerar la adopción

La documentación es esencial, pero crearla suele ser la última prioridad de un desarrollador. Le facilitaremos la documentación de los componentes de la interfaz de usuario mediante la generación automática de documentos mínimos viables que se pueden personalizar aún más.

#### Distribuya el sistema de diseño a los proyectos de los consumidores.

Una vez que tenga los componentes de la interfaz de usuario bien documentados, debe distribuirlos a otros equipos. Cubriremos el empaquetado, la publicación y cómo mostrar el sistema de diseño en otros Storybooks.

## Sistema de diseño con Storybook

El sistema de diseño de ejemplo de esta guía se inspiró en el [sistema de diseño de producción](https://github.com/storybookjs/design-system) de Storybook. Es consumido por tres sitios y tocado por decenas de miles de desarrolladores en el ecosistema Storybook.

En el siguiente capítulo, le mostraremos cómo extraer un sistema de diseño de librerías de componentes.
