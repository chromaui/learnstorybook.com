---
title: 'Storybook para Vue tutorial'
tocTitle: 'Empezando'
description: 'Configurar Vue Storybook en tu entorno de desarrollo'
commit: d1c4858
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de UI aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para Vue; existe una edición para [React](/react/en/get-started) y [Angular](/angular/en/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurando Vue Storybook

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [Vue CLI](https://cli.vuejs.org) para configurar nuestro sistema de build, y añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para testear nuestra aplicación creada. Vamos a ejecutar los siguientes comandos:

```bash
# Crea nuestra aplicación, usando una preconfiguración que contiene jest:
npx -p @vue/cli vue create --preset hichroma/vue-preset-learnstorybook taskbox
cd taskbox

# Añade Storybook:
npx -p @storybook/cli sb init
```

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```bash
# Ejecuta el test de prueba (Jest) en una terminal:
yarn test:unit

# Inicia el explorador de componentes en el puerto 6006:
yarn storybook

# Ejecuta el frontend de la aplicación en el puerto 8080:
yarn serve
```

<div class="aside">
  NOTE: Si <code>yarn test:unit</code> lanza un error, puede que no tengas <a href="https://yarnpkg.com/lang/en/docs/install/">yarn instalado</a> o puede que tengas que instalar <code>watchman</code> como se explica en <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">este artículo</a>.
</div>

Nuestras tres modalidades del frontend de la aplicación: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/intro-to-storybook/app-three-modalities.png)

Dependiendo de en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Reusa CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Simplemente compilaremos nuestros archivos LESS en un único archivo CSS y lo incluiremos en nuestra aplicación. Copia y pega [este CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dentro del archivo `src/index.css` y luego importa el CSS a la aplicación editando la etiqueta tag `<style>` en `src/App.vue` entonces se vera así:

```html
<style>
  @import './index.css';
</style>
```

![Buzón de tareas UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS son proporcionados en el mismo repositorio de GitHub.</div>

## Añade recursos

También necesitamos añadir la fuente y el icono de este [directorio](https://github.com/chromaui/learnstorybook-code/tree/master/public) a la carpeta `public/`.

También necesitamos actualizar nuestro storybook script para servir el directorio `public` (en `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Después de añadir los estilos y recursos, nuestra aplicación se renderizará de forma un poco extraña. Está bien. No estamos trabajando en la aplicación ahora mismo. ¡Comenzamos con la construcción de nuestro primer componente!
