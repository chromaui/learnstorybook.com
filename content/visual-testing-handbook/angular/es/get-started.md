---
title: "Storybook para o Angular tutorial"
tocTitle: "Empezando"
description: "Configurar Angular Storybook en tu entorno de desarrollo"
commit: 0818d47
---

Storybook se ejecuta en conjunto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de interfaz gráfica aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para Angular.

![Storybook and your app](/storybook-relationship.jpg)

## Configurando Angular Storybook

Necesitaremos seguir algunos pasos para configurar el proceso de transformación y agregación de recursos y archivos en nuestro entorno. Para esto, vamos a utilizar [@angular/cli](https://cli.angular.io/). Adicionalmente, añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para probar nuestra aplicación. Para hacerlo, vamos a ejecutar los siguientes comandos:

```bash
# Crea nuestra aplicación:
npx ng new taskbox --style less
cd taskbox

# Añade Storybook:
npx -p @storybook/cli sb init
```

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```bash
# Ejecuta el corredor de pruebas (Karma) en una terminal (añadiremos Jest más adelante):
yarn test

# Inicia el explorador de componentes en el puerto 6006:
yarn run storybook

# Ejecuta la aplicación cliente en el puerto 4200:
yarn start
```

Las tres modalidades de nuestra aplicación son: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/app-three-modalities.png)

Dependiendo de la parte de la aplicación en la que estés trabajando, es posible que quieras ejecutar una o varias de ellas simultáneamente. Dado que nuestro objetivo es crear un componente de interfaz gráfica en completo aislamiento del resto de la aplicación, utilizaremos Storybook.

## Reutilizando el CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Simplemente incluiremos nuestros archivos LESS y los importaremos dentro de `styles.less`.

![Interfaz gráfica del Buzón de tareas](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS se encuentran en el mismo repositorio de GitHub.</div>

## Añadiendo los recursos

También necesitamos añadir la fuente y el icono de este [directorio](https://github.com/chromaui/learnstorybook-code/tree/master/public) a la carpeta `assets/`.
Después de añadir los estilos y recursos, nuestra aplicación se verá de forma un poco extraña. Está bien. No estamos trabajando en la aplicación y no la veremos hasta dentro de algunos capítulos. A continuación, ¡comenzamos con la construcción de nuestro primer componente!
