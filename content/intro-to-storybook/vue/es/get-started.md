---
title: 'Tutorial Storybook para Vue'
tocTitle: 'Empezando'
description: 'Configurar Vue Storybook en tu entorno de desarrollo'
commit: d1c4858
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de interfaz de usuario aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para Vue; existe otras ediciones para [React](/react/es/get-started), [React Native](/react-native/es/get-started/), [Angular](/angular/es/get-started) y [Svelte](/svelte/es/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurar Storybook con Vue

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [Vue CLI](https://cli.vuejs.org) para configurar nuestro sistema de build, y añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para testear nuestra aplicación creada. Vamos a ejecutar los siguientes comandos:

```bash
# Create our application, using a preset that contains jest:
npx -p @vue/cli vue create taskbox --preset chromaui/vue-preset-learnstorybook

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class = "aside">
A lo largo de esta versión del tutorial, usaremos <code>yarn</code> para ejecutar la mayoría de nuestros comandos.
Si tiene instalado Yarn, pero prefiere usar <code>npm</code>, no se preocupe, puede seguir el tutorial sin ningún problema. Simplemente agregue el indicador <code>--packageManager=npm</code> al primer comando anterior y tanto Vue CLI como Storybook se inicializarán en función de esto. Además, mientras avanza en el tutorial, no olvide ajustar los comandos utilizados a sus contrapartes <code>npm</code>.
</div>

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```bash
# Run the test runner (Jest) in a terminal:
yarn test:unit

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 8080:
yarn serve
```

Nuestras tres modalidades del frontend de la aplicación: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/intro-to-storybook/app-three-modalities-vue.png)

Dependiendo de en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Reusa CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6), por lo que no necesitaremos escribir CSS en este tutorial. Simplemente compilaremos nuestros archivos LESS en un único archivo CSS y lo incluiremos en nuestra aplicación. Copia y pega [este CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dentro del archivo `src/index.css` y luego importa el CSS a la aplicación editando la etiqueta tag `<style>` en `src/App.vue` entonces se vera así:

```html
<style>
  @import './index.css';
</style>
```

![Buzón de tareas UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS son proporcionados en el mismo repositorio de GitHub.</div>

## Añadiendo recursos

Para que coincida con el diseño previsto del tutorial, deberá transferir las carpetas de los iconos y las fuentes a la carpeta `src/assets/`.

<div class="aside"> Svn (Subversion) se usó para facilitar la transferencia de carpetas de GitHub. Si no tiene instalado Subversion o simplemente desea hacerlo manualmente, puede obtener las carpetas directamente <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">aquí</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/icon src/assets/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/src/assets/font src/assets/font
```

Después de añadir los estilos y recursos, nuestra aplicación se renderizará de forma un poco extraña. Está bien. No estamos trabajando en la aplicación ahora mismo. ¡Comenzamos con la construcción de nuestro primer componente!
