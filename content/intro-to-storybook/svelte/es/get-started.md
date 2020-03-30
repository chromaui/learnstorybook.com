---
title: 'Storybook for Svelte tutorial'
tocTitle: 'Get started'
description: 'Setup Storybook in your development environment'
---

Storybook runs alongside your app in development mode. It helps you build UI components isolated from the business logic and context of your app. This edition of Learn Storybook is for Svelte; other editions exist for [Vue](/vue/es/get-started), [Angular](/angular/es/get-started), [React](/angular/es/get-started) and [React Native](/react-native/es/get-started).

![Storybook and your app](/intro-to-storybook/storybook-relationship.jpg)

## Configurar Storybook con Svelte

Necesitaremos seguir algunos pasos para configurar el proceso de build de nuestro entorno. Para iniciar, vamos a usar [Degit](https://github.com/Rich-Harris/degit) para configurar nuestro sistema de build, y añadiremos [Storybook](https://storybook.js.org/) y [Jest](https://facebook.github.io/jest/) para testear nuestra aplicación creada. Vamos a ejecutar los siguientes comandos:

```bash
# Create our application:
npx degit sveltejs/template taskbox

cd taskbox

# Install the dependencies
npm install

# Add Storybook:
npx -p @storybook/cli sb init --type svelte
```

### Configurar Jest con Svelte

Tenemos dos de las tres modalidades configuradas en nuestra aplicación, pero aún necesitamos una, tenemos que configurar [Jest](https://facebook.github.io/jest/) para habilitar las pruebas.

Vamos a ejecutar los siguientes comandos:

```bash
npm install -D jest @testing-library/svelte jest-transform-svelte @testing-library/jest-dom
```

Creamos una nueva carpeta llamada `__mocks__`, con dos archivos:

- El primero llamado `fileMock.js` con el siguiente contenido:
  ```javascript
  module.exports = 'file-stub';
  ```
- El segundo llamado `styleMock.js` con el siguiente contenido:
  ```javascript
  module.exports = {};
  ```

Cree un archivo `.babelrc` en la raíz del proyecto con lo siguiente:

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ]
}
```

Y un nuevo campo en `package.json`:

```json
"jest": {
    "transform": {
      "^.+\\.js$": "babel-jest",
      "^.+\\.svelte$": "jest-transform-svelte"
    },
    "moduleFileExtensions": [
      "js",
      "svelte",
      "json"
    ],
    "moduleNameMapper": {
      "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
      "\\.(css|scss|stylesheet)$": "<rootDir>/__mocks__/styleMock.js"
    },
    "setupFilesAfterEnv": [
      "@testing-library/jest-dom/extend-expect"
    ],
    "testPathIgnorePatterns": [
      "/node_modules/",
      "/build/",
      "/storybook-static/"
    ]
  }
```

Y se requiere un nuevo script para ejecutar Jest:

```json
"test": "jest --watchAll"
```

<div class="aside">El uso de la bandera `--watchAll` en el script es para evitar que Jest arroje un error, porque en esta etapa todavía no hay un repositorio configurado. Eso se abordará más adelante.</div>

Para asegurarnos de que todo funciona correctamente, necesitamos crear un archivo de prueba. En la carpeta `src`, agregue un archivo llamado `Sample.test.js` con lo siguiente:

```javascript
function sum(a, b) {
  return a + b;
}
describe('Sample Test', () => {
  it('should return 3 as the result of the function', () => {
    // set timeout to prevent false positives with tests
    expect(sum(1, 2)).toBe(3);
  });
});
```

Ahora podemos comprobar rápidamente que los diversos entornos de nuestra aplicación funcionan correctamente:

```bash
# Run the test runner (Jest) in a terminal:
npm run test

# Start the component explorer on port 9009:
npm run storybook

# Run the frontend app proper on port 5000:
npm run dev
```

Nuestras tres modalidades del frontend de la aplicación: test automatizado (Jest), desarrollo de componentes (Storybook) y la propia aplicación.

![3 modalities](/intro-to-storybook/app-three-modalities-svelte.png)

Dependiendo de en qué parte de la aplicación estés trabajando, es posible que quieras ejecutar uno o más de estos simultáneamente. Dado que nuestro objetivo actual es crear un único componente de UI, seguiremos ejecutando Storybook.

## Reusa CSS

Taskbox reutiliza elementos de diseño de la aplicación de ejemplo de este [Tutorial de GraphQL y React](https://blog.hichroma.com/graphql-react-tutorial-part-1-6-d0691af25858), por lo que no necesitaremos escribir CSS en este tutorial. Copia y pega [este CSS compilado](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css) dentro del archivo `public/global.css`.

![Taskbox UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
Si deseas modificar los estilos, los archivos fuente de CSS en formato LESS son proporcionados en el mismo repositorio de GitHub.
</div>

## Añadiendo recursos

Para que coincida con el diseño previsto del tutorial, deberá transferir las carpetas de los iconos y las fuentes a la carpeta pública.

<div class="aside"> Svn (Subversion) se usó para facilitar la transferencia de carpetas (o directorios) de GitHub. Si no tiene instalado Subversion o simplemente desea hacerlo manualmente, puede obtener las carpetas directamente <a href="https://github.com/chromaui/learnstorybook-code/tree/master/public">aquí</a>.</p></div>

```bash
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/icon public/icon
svn export https://github.com/chromaui/learnstorybook-code/branches/master/public/font public/font
```

Finalmente necesitamos actualizar nuestro script storybook para servir el directorio `public` (en `package.json`):

```json
{
  "scripts": {
    "storybook": "start-storybook -p 6006 -s public"
  }
}
```

Después de añadir los estilos y recursos, nuestra aplicación se renderizará de forma un poco extraña. Está bien. No estamos trabajando en la aplicación ahora mismo. ¡Comenzamos con la construcción de nuestro primer componente!
