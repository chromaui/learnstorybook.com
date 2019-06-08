---
title: "Storybook para React tutorial"
tocTitle: "Empezando"
description: "Configurar React Storybook en tu entorno de desarrollo"
commit: ebe2ae2
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de UI aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para React; otras ediciones para Vue y Angular vendrán pronto.

![Storybook and your app](/storybook-relationship.jpg)

## Configurando React Storybook

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [Create React App](https://github.com/facebook/create-react-app) (CRA) para configurar nuestro sistema de build, y añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para testear nuestra aplicación creada. Vamos a ejecutar los siguientes comandos:

```bash
# Crea nuestra aplicación:
npx create-react-app taskbox
cd taskbox

# Añade Storybook:
npx -p @storybook/cli sb init
```

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```bash
# Corre el test de prueba (Jest) en una terminal:
yarn test

# Inicia el explorador de componentes en el puerto 9009:
yarn run storybook

# Ejecuta el frontend de la aplicación en el puerto 3000:
yarn start
```

Nuestras tres modalidades del frontend de la aplicación: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/app-three-modalities.png)

Dependiendo de en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Reusa CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Simplemente compilaremos nuestros archivos LESS en un único archivo CSS y lo incluiremos en nuestra aplicación. Copia y pega [este CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dentro del archivo src/index.css según la convención de CRA.

![Buzón de tareas UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS son proporcionados en el mismo repositorio de GitHub.</div>

## Añade recursos

También necesitamos añadir la fuente y el icono de este [directorio](https://github.com/chromaui/learnstorybook-code/tree/master/public) a la carpeta `public/`.
Después de añadir los estilos y recursos, nuestra aplicación se renderizará de forma un poco extraña. Está bien. No estamos trabajando en la aplicación ahora mismo. Comenzamos con la construcción de nuestro primer componente!
