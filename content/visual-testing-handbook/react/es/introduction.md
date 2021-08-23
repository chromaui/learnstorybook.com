---
title: 'Introducción a las pruebas visuales'
tocTitle: 'Introducción'
description: 'La manera pragmática de probar interfaces de usuario'
---

Las interfaces de usuario son subjetivas. La respuesta a "¿esto se ve bien?" depende del navegador, del dispositivo, y del gusto personal. Todavía se debe mirar la interfaz de usuario renderizada para verificar su apariencia.

Pero lleva una eternidad controlar manualmente toda la UI commit a commit. Diferentes enfoques como pruebas unitarias y pruebas de instantáneas intentan automatizar la verificación visual. Usualmente terminan fracasando porque las máquinas no pueden determinar la exactitud de la UI desde la secuencia de las etiquetas de HTML y de las clases de CSS.

¿Cómo previenen errores visuales los equipos? ¿Qué técnicas utilizan Microsoft, BBC y Shopify para
enviar UIs a millones de personas? Mi co-autor Tom y yo investigamos equipos líderes para descubrir qué funciona realmente.

Este manual introduce las pruebas visuales, un enfoque pragmático que combina la precisión del ojo humano con la eficiencia de las máquinas. En lugar de eliminar a las personas de la ecuación de prueba, las pruebas visuales utilizan herramientas para centrar su esfuerzo en los cambios específicos de la interfaz de usuario que requieren atención.

![Ruta impulsada por pruebas visuales](/visual-testing-handbook/visual-testing-handbook-vtdd-path-optimized.png)

## Las pruebas unitarias no poseen globos oculares

Para comprender las pruebas visuales, tiene sentido comenzar con pruebas unitarias. Las UIs modernas son [component-driven](https://componentdriven.org/) - están compuestas de piezas modulares. La construcción del componente le permite representar la interfaz de usuario en función de las propiedades y el estado. Eso significa que puedes realizar pruebas unitarias de componentes como cualquier otra función.

Una prueba unitaria aísla un módulo y luego verifica su comportamiento. Proporciona entradas (propiedades, estado, etc.) y compara la salida con un resultado esperado. Las pruebas unitarias son deseables porque probar los módulos de forma aislada facilita cubrir los casos extremos y señalar el origen de las fallas.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/component-unit-testing.mp4"
    type="video/mp4"/>
</video>
 
El problema principal es que gran parte de la complejidad inherente de una interfaz de usuario es visual: los detalles de cómo se representan los elementos HTML y CSS generados en la pantalla del usuario.

Las pruebas unitarias son perfectas para evaluar salidas concretas: `2 + 2 === 4`. Pero no son buenas para la interfaz de usuario porque es difícil discernir qué detalles de HTML o CSS afectan la apariencia y cómo lo hacen. Por ejemplo, los cambios en HTML no siempre afectan la apariencia de la UI.

## ¿Qué pasa con las pruebas de instantáneas?

Las [pruebas instantáneas](https://reactjs.org/docs/testing-recipes.html#snapshot-testing) proporcionan un enfoque alternativo para la verificación de la apariencia de la interfaz de usuario. Representan el componente y luego capturan el DOM generado como una "línea base". Los cambios posteriores comparan el nuevo DOM con la línea base. Si hay diferencias, el desarrollador debe actualizar explícitamente dicha línea base.

![Código de componente minificado](/visual-testing-handbook/code-visual-testing-optimized.png)

En la práctica, las instantáneas DOM son incómodas porque es complicado determinar cómo se representa una interfaz de usuario mediante la evaluación de un blob de HTML.

Las pruebas instantáneas sufren de la misma fragilidad que otras pruebas de UI automatizadas. Cualquier cambio en el funcionamiento interno de un componente requiere que se actualice la prueba, independientemente de si cambió la salida renderizada del componente.

## Las pruebas visuales están hechas para la interfaz de usuario

Las pruebas visuales están diseñadas para detectar cambios en la apariencia de la interfaz de usuario. Utilice un explorador de componentes como Storybook para aislar los componentes de la interfaz de usuario, simular sus variaciones y guardar los casos de prueba como "historias".

Durante el desarrollo, “ejecute” una verificación manual rápida de un componente renderizandolo en un navegador para ver cómo se ve. Confirme las variaciones de su componente alternando entre cada caso de prueba enumerado en el explorador de componentes.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/storybook-toggling-stories.mp4"
    type="video/mp4"/>
</video>

En QA, utilice la automatización para detectar regresiones y reforzar la coherencia de la interfaz de usuario. Herramientas como [Chromatic](https://www.chromatic.com/) capturan una instantánea de cada caso de prueba, completa con marcado, estilo y otros activos, en un entorno de navegador coherente.

En cada commit, nuevas instantáneas se comparan automáticamente con instantáneas de línea base aceptadas previamente. Cuando la máquina detecta diferencias visuales, el desarrollador recibe una notificación para aprobar el cambio intencional o corregir el error accidental.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/component-visual-testing.mp4"
    type="video/mp4"/>
</video>

#### Eso suena a mucho trabajo...

Eso puede parecer laborioso, pero termina siendo más fácil que examinar los falsos positivos de las pruebas automatizadas, actualizar los casos de prueba para que coincidan con cambios menores en la interfaz de usuario y trabajar horas extras para que las pruebas vuelvan a pasar exitosamente.

## Aprenda a usar las herramientas

Ahora que tenemos conocimiento sobre las pruebas visuales, echemos un vistazo a la herramienta principal que necesitas para habilitarla: un explorador de componentes. En el próximo capítulo, veremos cómo los exploradores de componentes ayudan a los desarrolladores a crear y probar componentes.
