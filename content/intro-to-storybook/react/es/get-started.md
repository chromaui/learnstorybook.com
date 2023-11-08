---
title: 'Storybook para React tutorial'
tocTitle: 'Empezando'
description: 'Configurar React Storybook en tu entorno de desarrollo'
commit: 'a80866b'
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de UI aislados de la lógica y el contexto de tu aplicación. Esta edición de Aprende Storybook es para React; existe otras ediciones para [React Native](/intro-to-storybook/react-native/es/get-started), [Vue](/intro-to-storybook/vue/es/get-started), [Angular](/intro-to-storybook/angular/es/get-started) y [Svelte](/intro-to-storybook/svelte/es/get-started).

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
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
💡 Observa el indicador --watchAll en el comando de prueba. Si incluyes este indicador en tu comando, garantizarás que se ejecuten todas las pruebas. Mientras avanzas en este tutorial, vas a ver diferentes escenarios de prueba. Es posible que desees considerar ajustar los scripts de tu archivo package.json en consecuencia.
</div>

Nuestras tres modalidades para la aplicación frontend son: el test automatizado (Jest), el desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalidades](/intro-to-storybook/app-three-modalities.png)

Dependiendo de la parte de la aplicación en la que estés trabajando, es posible que desees ejecutar una o varias de estas herramientas simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Guardar cambios

Ahora vamos a añadir nuestros archivos a un repositorio local. Ejecuta los siguientes comandos para inicializar un repositorio local, agregar y hacer commit de los cambios que hemos hecho hasta ahora.

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
