---
title: 'Configuración'
description: 'Comenzar con el kit de complementos'
commit: 'd3b6651'
---

![](../../images/addon-kit-demo.gif)

Usaremos el kit de complementos [Addon Kit](https://github.com/storybookjs/addon-kit)  para iniciar nuestro proyecto. Nos brinda todo lo necesario para crear un complemento de Storybook:

- 📝 Edición en vivo en modo de desarrollo
- ⚛️ Soporte de React / JSX para el UI
- 📦 Transpilar y empaquetar con [Babel](http://babeljs.io/)
- 🏷 Plugin para metadatos
- 🚢 Gestión de versiones con [Auto](https://github.com/intuit/auto)

Para comenzar, clickea en el botón **Use this template** (Usar esta plantilla) en el repositorio del kit de complementos: [Addon Kit repository](https://github.com/storybookjs/addon-kit). Esto generará un nuevo repositorio con todo el código del kit de complementos.


![](../../images/addon-kit.png)

A continuación, clona tu repositorio e instala las dependencias.

```bash
yarn
```

The Addon Kit uses TypeScript by default. However, we'll use the eject command to convert the boilerplate code to JavaScript for the purposes of this tutorial.

El Addon Kit usa TypeScript de forma predeterminada. Sin embargo, para los propósitos de este tutorial usaremos el comando eject para convertir el código en JavaScript .

```bash
yarn eject-ts
```

Esto convertirá todo el código a JS. Es un proceso destructivo, por lo que recomendamos ejecutarlo antes de comenzar a escribir cualquier código.

Finalmente, inicia el modo de desarrollo. Esto da inicio a Storybook y ejecuta Babel en modo observador (Watch Mode).

```bash
yarn start
```

El código del complemento vive en el directorio `src`. El código modelo incluido demuestra los tres paradigmas del UI y otros conceptos como la gestión del estado y la interacción con una historia. Exploraremos esto con más detalle en las próximas secciones.
