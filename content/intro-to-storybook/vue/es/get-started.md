---
title: 'Tutorial Storybook para Vue'
tocTitle: 'Empezando'
description: 'Configurar Vue Storybook en tu entorno de desarrollo'
commit: '9e3165c'
---

Storybook se ejecuta junto con tu aplicación en modo desarrollo. Te ayuda a crear componentes de interfaz de usuario aislados de la lógica y el contexto de tu aplicación. Esta edición del tutorial de Aprende Storybook es para Vue; existe otras ediciones para [React](/intro-to-storybook/react/es/get-started), [React Native](/intro-to-storybook/react-native/es/get-started/), [Angular](/intro-to-storybook/angular/es/get-started) y [Svelte](/intro-to-storybook/svelte/es/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurar Storybook con Vue

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [degit](https://github.com/Rich-Harris/degit) para configurar nuestro sistema de build. Con este paquete, puede descargar "plantillas" (aplicaciones parcialmente creadas con alguna configuración predeterminada) para ayudarlo a acelerar su flujo de trabajo de desarrollo.

Vamos a ejecutar los siguientes comandos:

```bash
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class = "aside">
💡 Esta plantilla contiene los estilos, recursos y configuraciones esenciales para esta versión del tutorial.
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

## Commitear cambios

En esta etapa, es seguro agregar nuestros archivos a un repositorio local. Ejecute los siguientes comandos para inicializar un repositorio local, agregue y confirme los cambios que hemos realizado hasta ahora.

```shell
$ git init
```

Seguido por:

```shell
$ git add .
```

Y finalmente:

```shell
$ git commit -m "first commit"
```

¡Comencemos a construir nuestro primer componente!
