---
title: "Empezando"
tocTitle: "Empezando"
description: "Configurar Vue Storybook en tu entorno de desarrollo"
---

# Empezando

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de UI aislados de la lógica y el contexto de su aplicación. Esta edición de Aprende Storybook es para Vue; existen otras ediciones para [React](/react/es/get-started) y [Angular](/angular/es/get-started).

![Storybook and your app](/storybook-relationship.jpg)

## Configurando Vue Storybook

Tendremos que seguir algunos pasos para configurar el proceso de compilación en tu entorno. Para empezar, vamos a querer usar [Vue CLI](https://cli.vuejs.org) para configurar nuestro sistema de compilación. También añadiremos[Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para probar nuestra aplicación. Vamos a ejecutar los siguientos comandos:

```bash
# Crea tu aplicación, usando un preset que contiene jest:
npx -p @vue/cli vue create --preset hichroma/vue-preset-learnstorybook taskbox
cd taskbox

# Añade Storybook:
npx -p @storybook/cli sb init
```

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```bash
# Ejecuta el compilador de prueba (Jest) en un terminal.
yarn test:unit

# Inicia el explorador de componentes en el puerto 6006:
yarn run storybook

# Ejecuta el frontend de la aplicación en el puerto 8080:
yarn serve
```
<div class="aside">
  NOTA: Si <code>yarn test:unit</code> produce un error, es posible que no tenga <a href="https://yarnpkg.com/lang/en/docs/install/">Yarn instalado</a> o es posible que debe instalar <code>watchman</code> como se indica en <a href="https://github.com/facebook/create-react-app/issues/871#issuecomment-252297884">este problema</a>.
</div>

Nuestras tres modalidades del frontend de la aplicación: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/app-three-modalities.png)

Dependiendo en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro enfoque actual es crear un único componente de UI, nos mantendremos en la ejecución de Storybook.

## Reusa CSS
Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Simplemente compilaremos nuestros archivos LESS en un solo archivo CSS y lo incluiremos en nuestra aplicación. Copia y pega [este CSS compilado](https://github.com/hichroma/learnstorybook-code/blob/master/src/index.css) dentro del archivo `src/index.css` e importa el CSS en la aplicación editando la etiqueta `<style>` en `src/App.vue` para que se vea como lo siguiente:
```html
<style>
@import './index.css';
</style>
```

![Buzón de tareas UI](/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS se encuentran en el mismo repositorio de GitHub.</div>

## Añade recursos
También tenemos que añadir la fuente y el icono [directorio](https://github.com/hichroma/learnstorybook-code/tree/master/public) a la carpeta `public/`.

También necesitamos actualizar nuestro script de Storybook para servir el directorio `public` (en `package.json`):
```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Después de agregar estilos y elementos, la aplicación se renderizará un poco de forma extraña. Está bien. No estamos trabajando en la aplicación en este momento. ¡Comenzamos con la construcción de nuestro primer componente!