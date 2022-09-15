---
title: 'Agregar al catálogo de complementos'
tocTitle: 'Agregar al catálogo'
description: 'Comparte tu complemento de Storybook con la comunidad'
commit: '927e729'
---

El [Catálogo de complementos](https://storybook.js.org/addons) es el hogar de todos los complementos de Storybook. Es donde mostramos tus complementos y cómo los desarrolladores descubren otros nuevos. Preparemos tu complemento para su lanzamiento, empaquetado y publicación en el catálogo.

![](../../images/catalog.png)

## Preparando tu complemento para el lanzamiento

Los complementos de Storybook, como la mayoría de los paquetes en el ecosistema de JavaScript, se distribuyen a través de npm. Sin embargo, tienen ciertos criterios:

1. Tienen un directorio dist que contiene código ES5 transpilado
2. Un archivo `preset.js` en la base (root), escrito como módulo ES5
3. Un archivo `package.json` que declara:
   - Dependencias entre pares
   - Información relacionada con el módulo
   - Metadatos de catálogo

El kit Addon se encarga de la mayor parte de esto por nosotros. Solo tenemos que asegurarnos de que proporcionamos los metadatos adecuados.

## Metadatos del módulo

La primera categoría son los metadatos relacionados con el módulo. Esto incluye el punto de entrada principal para el módulo y qué archivos incluir cuando se publique el complemento; y todas las dependencias entre pares del complemento. Por ejemplo, react, react-dom y todas las API relacionadas con Storybook.

```json:title=package.json
{
  ...
  "main": "dist/preset.js",
  "files": [
    "dist/**/*",
    "README.md",
    "*.js"
  ],
  "peerDependencies": {
    "@storybook/addons": "^6.1.14",
    "@storybook/api": "^6.1.14",
    "@storybook/components": "^6.1.14",
    "@storybook/core-events": "^6.1.14",
    "@storybook/theming": "^6.1.14",
    "react": "^16.8.0 || ^17.0.0",
    "react-dom": "^16.8.0 || ^17.0.0"
  },
  ...
}
```

#### ¿Por qué las dependencias entre pares?

Supongamos que estás creando una biblioteca de formularios que funciona con React. Si incluyes React como una dependencia, el código de React se empaquetará junto con tu biblioteca. Tus usuarios ya instalan React junto a su código base. Si resulta que es una versión diferente, la aplicación no funcionará. Es la misma idea aquí.

## Metadatos del catálogo

Junto con la información relacionada con el módulo, también se deben especificar algunos metadatos para el catálogo de complementos de Storybook.

![catalog metadata includes tags, compatibility, authors, etc.](../../images/catalog-metadata.png)

Parte de esta información está preconfigurada por el kit Addon. Cosas como el nombre para mostrar, el icono o la compatibilidad de frameworks se especifican a través de la propiedad de Storybook. Para obtener la especificación completa de la API de metadatos, consulta la [Documentación de Metadatos de Complementos.](https://storybook.js.org/docs/react/addons/addon-catalog/#addon-metadata).

```json:title=package.json
{
  ...
  "name": "mi-complemento-storybook",
  "version": "1.0.0",
  "description": "Mi primer complemento de Storybook",
  "author": "Tu Nombre",
  "storybook": {
    "displayName": "Mi Complemento de Storybook",
    "unsupportedFrameworks": ["react-native"],
    "icon": "https://yoursite.com/link-to-your-icon.png"
  },
  "keywords": ["storybook-addons", "appearance", "style", "css", "layout", "debug"]
  ...
}
```

La propiedad keywords (palabras clave) aquí hace referencia a etiquetas de catálogo. Por ejemplo, storybook-addons asegura que tu complemento se incluirá en el catálogo. Y appearance es una categoría top-level (de nivel superior). El resto ayuda con la capacidad de búsqueda de tu complemento.

## Publicar en NPM

El último paso es publicar el complemento. El kit Addon viene preconfigurado con [Auto](https://github.com/intuit/auto) para la gestión de versiones. Genera un registro de cambios y lo envía tanto a GitHub como a NPM. Por lo tanto, debes configurar el acceso a ambos.

1. Autenticar usando [npm adduser](https://docs.npmjs.com/cli/adduser.html)
2. Crear un [access token](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-access-tokens). Necesitarás un token con permisos de Read and Publish (Leer y Publicar)
3. Del mismo modo, genera un [token de Github](https://github.com/settings/tokens). Este token necesitará el alcance del repositorio.
4. Crea un archivo `.env` en la base del proyecto (root) y agrega estos dos tokens:

```TEXT:title=.env
GH_TOKEN=valor_recibido_de_github
NPM_TOKEN=valor_recibido_de_npm
```

A continuación, **crea etiquetas en GitHub**. Utilizarás estas etiquetas en el futuro cuando realices cambios en el paquete.

```shell
npx auto create-labels
```

Si verificas en GitHub, ahora verás un conjunto de etiquetas que a Auto le gustaría que usaras. Úsalos para etiquetar futuras pull requests.

Finalmente, crea una versión

```shell
yarn release
```

Este paso hará lo siguiente:

- Construirá y empaquetará el código del complemento
- Lanzará la versión
- Enviará una versión (push) a GitHub y NPM
- Enviará un registro de cambios a GitHub

¡Ahí lo tienes! Publicamos con éxito nuestro paquete en NPM y lanzamos nuestro primer complemento de Storybook. Puede haber una demora en que tu complemento aparezca en el catálogo porque depende del rastreo de NPM. Si tu complemento no aparece, abre un issue en el repositorio del catálogo.
