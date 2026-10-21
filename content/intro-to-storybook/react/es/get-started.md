---
title: 'Storybook para React tutorial'
tocTitle: 'Empezando'
description: 'Configurar React Storybook en tu entorno de desarrollo'
commit: 'afe05db'
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de UI aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para React; existe otras ediciones para [React Native](/intro-to-storybook/react-native/es/get-started/), [Vue](/intro-to-storybook/vue/es/get-started/), [Angular](/intro-to-storybook/angular/es/get-started/) y [Svelte](/intro-to-storybook/svelte/es/get-started/).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurando React Storybook

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [degit](https://github.com/Rich-Harris/degit) para configurar nuestro sistema de build. Con este paquete, puedes descargar "plantillas" (aplicaciones parcialmente construidas con alguna configuración predeterminada) para ayudarte a acelerar tu flujo de trabajo de desarrollo.

Vamos a ejecutar los siguientes comandos:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-react-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside"> 
💡 Esta plantilla contiene los estilos, recursos y configuraciones básicas necesarias para esta versión del tutorial. 
</div>

Podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

Nuestras principales modalidades para la aplicación frontend son: el desarrollo de componentes (Storybook) y la propia aplicación.

![Main modalities](/intro-to-storybook/app-main-modalities-react.png)

Según la parte de la aplicación en la que estés trabajando, es posible que quieras ejecutar uno o más de estos elementos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Guardar cambios

En este momento, es seguro agregar nuestros archivos a un repositorio local. Ejecuta los siguientes comandos para inicializar un repositorio local, agregar y hacer commit de los cambios que hemos hecho hasta ahora.

```shell
git init
```

Seguido por:

```shell
git add .
```

Luego:

```shell
git commit -m "primer commit"
```

Y, por último:

```shell
git branch -M main
```

¡Comenzamos con la construcción de nuestro primer componente!
