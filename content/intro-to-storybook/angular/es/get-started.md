---
title: 'Tutorial de Storybook para Angular'
tocTitle: 'Empezando'
description: 'Configurar Angular Storybook en tu entorno de desarrollo'
commit: 'bc34d9c'
---

Storybook se ejecuta junto con su aplicación en modo de desarrollo. Le ayuda a crear componentes de interfaz de
usuario aislados de la lógica de negocio y el contexto de su aplicación. Esta edición del tutorial de Storybook es para
Angular;
existen otras ediciones para [React](/intro-to-storybook/react/en/get-started/), [React Native](/intro-to-storybook/react-native/en/get-started/), [Vue](/intro-to-storybook/vue/en/get-started/), [Svelte](/intro-to-storybook/svelte/en/get-started/).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurar Angular Storybook

Necesitaremos seguir algunos pasos para configurar el proceso de transformación y agregación de recursos y archivos en nuestro entorno. Para empezar, vamos
a usar [degit](https://github.com/Rich-Harris/degit) para configurar nuestro sistema de construcción. Usando este
paquete, podrás descargar
"templates" (aplicaciones parcialmente construidas con alguna configuración predeterminada) para ayudarte a acelerar
tu flujo de trabajo de desarrollo.

Ejecutemos los siguientes comandos:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-angular-template taskbox

cd taskbox

# Install dependencies
npm install
```

<div class="aside">
💡 Esta plantilla contiene los estilos, recursos y configuraciones esenciales necesarios para esta versión del tutorial.
</div>

Ahora podemos comprobar rápidamente que los distintos entornos de nuestra aplicación funcionan correctamente:

```shell:clipboard=false
# Run the test runner (Jest) in a terminal:
npm run test

# Start the component explorer on port 6006:
npm run storybook

# Run the frontend app proper on port 4200:
npm run start
```

Nuestras tres modalidades de aplicaciones frontend: test automáticos (Jest), desarrollo de componentes (Storybook),
y la propia aplicación.

![3 modalities](/intro-to-storybook/app-three-modalities-angular.png)

Dependiendo de la parte de la aplicación en la que estés trabajando, es posible que quieras ejecutar una o varias de ellas simultáneamente. Dado que nuestro objetivo es crear un componente de interfaz gráfica en completo aislamiento del resto de la aplicación, utilizaremos Storybook.

## Confirmar cambios

En esta etapa, es seguro agregar nuestros archivos a un repositorio local. Ejecute los siguientes comandos para inicializar un repositorio local, agregue y confirme los cambios que hemos realizado hasta ahora.

```shell
git init
```

Seguido de:

```shell
git branch -M main
```

En seguida:

```shell
git add .
```

Y finalmente:

```shell
git commit -m "first commit"
```

¡Comencemos a construir nuestro primer componente!
