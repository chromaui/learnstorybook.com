---
title: 'Desplegar Storybook'
tocTitle: 'Desplegar'
description: 'Desplegar Storybook online con GitHub y Netlify'
---

En este tutorial hemos ejecutado Storybook en nuestra máquina de desarrollo. También se puede compartir ese Storybook con el equipo, especialmente con los miembros no técnicos. Afortunadamente, es fácil implementar Storybook en línea.


## Exportando como una app estática

Para desplegar Storybook primero necesitamos exportarlo como una aplicación web estática. Esta funcionalidad ya está incorporada en Storybook y Expo, solo necesitamos activarlo agregando un script a `package.json`.

```javascript
// package.json

{
  "scripts": {
    "build-static-webapp":"expo build:web"
  }
}
```
<div class="aside"><p>En el momento de escribir este tutorial, el proceso de creación web para Expo todavía está en beta. Y podría estar sujeto a algunos cambios en el futuro.</p></div>

Ahora, cuando compila la aplicación a través de `yarn build-static-webapp`, mostrará tanto la aplicación como un Storybook estático en el directorio `web-build`.

## Despliegue continuo

Queremos compartir la última versión de los componentes cada vez que hagamos push del código. Para ello necesitamos desplegar de forma continua Storybook. Confiaremos en GitHub y Netlify para desplegar nuestro sitio estático. Estaremos usando el plan gratuito de Netlify.

### GitHub

Cuando el proyecto se inicializó con Expo, ya se configuró un repositorio local para usted. En esta etapa, es seguro agregar los archivos al primer commit.

```bash
$ git add .
```

Ahora haz commit de los archivos.

```bash
$ git commit -m "taskbox UI"
```

### Configurar un repositorio en GitHub

Ve a Github y configura un repositorio [aquí](https://github.com/new). Nombra tu repo “taskbox”.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

En la nueva configuración del repositorio copia la URL de origen del repositorio y añádelo a tu proyecto git con este comando:

```bash
$ git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente haz push al repo en GitHub.

```bash
$ git push -u origin master
```

### Netlify

Netlify tiene incorporado un servicio de despliegue continuo que nos permitirá desplegar Storybook sin necesidad de configurar nuestro propio CI.

<div class="aside">
Si usas CI en tu empresa, añade un script de implementación a tu configuración que suba <code>web-build</code> a un servicio de alojamiento de estáticos como S3.
</div>

[Crea una cuenta en Netlify](https://app.netlify.com/start) y da click en “crear sitio”.

![Crear sitio en Netlify](/intro-to-storybook/netlify-create-site.png)

A continuación, haz clic en el botón de GitHub para conectar Netlify a GitHub. Esto le permite acceder a nuestro repositorio remoto Taskbox.

Ahora selecciona el repo de taskbox de GitHub de la lista de opciones.

![Conectar un repositorio en Netlify](/intro-to-storybook/netlify-account-picker.png)

Configura Netlify resaltando el comando build que se ejecutará en tu CI y el directorio en el que se enviará el sitio estático. Para la rama elegir `master`. El directorio es `web-build`. Ejecuta el comando de compilación `yarn build-static-webapp`.

![Netlify settings](/intro-to-storybook/netlify-settings-rn.png)

Ahora envía el formulario para construir e implementar el código en la rama `master` del taskbox.

Cuando esto termine veremos un mensaje de confirmación en Netlify con un enlace al Storybook de Taskbox online. Si lo estás siguiendo, tu Storybook desplegado debería estar en línea [como este](https://clever-banach-415c03.netlify.com/).

<div class="aside"><p>Si su implementación falla al mencionar que la carpeta no está presente, active una compilación local, luego elimine el comentario en la carpeta de compilación del archivo <code>.gitignore</code></p><p>Commitie los cambios, luego el CI de netlify debería elegir y logrará construir la aplicación junto con Storybook.</p></div>

![Despliegue de Netlify Storybook](/intro-to-storybook/netlify-storybook-deploy.png)

Terminamos de configurar el despliegue continuo de tu Storybook! Ahora podemos compartir nuestras historias con nuestros compañeros de equipo a través de un enlace.

Esto es útil para la revisión visual como parte del proceso de desarrollo de aplicaciones estándar o simplemente para mostrar nuestro trabajo💅.
