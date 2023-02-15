---
title: 'Desplegar Storybook'
tocTitle: 'Desplegar'
description: 'Desplegar Storybook online con GitHub y Netlify'
---

Durante este tutorial, construimos componentes en nuestra máquina de desarrollo local. En algún momento, vamos a necesitar compartir nuestro trabajo para obtener feedback del equipo. Vamos a desplegar Storybook para ayudar a nuestros compañeros a revisar la implementación de la interfaz de usuario.


## Exportando como una app estática

Para desplegar Storybook primero necesitamos exportarlo como una aplicación web estática. Esta funcionalidad ya está incorporada en Storybook y preconfigurada.

Running `yarn build-storybook` will output a static Storybook in the `storybook-static` directory, which can then be deployed to any static site hosting service.

Ejecutando `yarn build-storybook` generará un Storybook estático en el directorio `storybook-static`, que luego se puede desplegar en cualquier servicio de hosting de sitios estáticos.

## Publicar Storybook

This tutorial uses <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, a free publishing service made by the Storybook maintainers. It allows us to deploy and host our Storybook safely and securely in the cloud.

Este tutorial usa <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, un servicio de publicación gratuito hecho por los mantenedores de Storybook. Nos permite desplegar y alojar nuestro Storybook de forma segura en la nube.

### Configurar un repositorio en GitHub

Antes de empezar, nuestro código local tiene que sincronizar con un servicio de control de versiones remoto. Cuando configuramos nuestro proyecto en el capítulo de [Empezando](/intro-to-storybook/react/es/get-started/), ya inicializamos un repositorio local. En este punto del tutorial ya tenemos varios commits que podemos enviar a un repositorio remoto.

Ve a GitHub y cree un nuevo repositorio para nuestro proyecto [aquí](https://github.com/new). Nombra tu repo “taskbox”, igual que nuestro proyecto local.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

En la nueva configuración del repositorio copia la URL de origen del repositorio y añádelo a tu proyecto git con este comando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Por último, haz push para enviar nuestro repositorio local al repositorio remoto en GitHub con:

```shell
git push -u origin main
```

### Usa Chromatic

Agregue el paquete como una dependencia de desarrollo.

```shell
yarn add -D chromatic
```

Once the package is installed, [log in to Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) with your GitHub account (Chromatic will only ask for lightweight permissions), then we'll create a new project called "taskbox" and sync it with the GitHub repository we've set up.

Una vez que el paquete esté instalada, [inicia sesión con Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) con tu cuenta de GitHub (Chromatic solo solicitará permisos muy ligeros), luego crearemos un nuevo proyecto que se llama "taskbox" y lo sincronizaremos con el repositorio de GitHub que hemos configurado.

Haz click en `Choose GitHub repo` abajo de colaboradores y selecciona tu repositorio.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copia el `project-token` único que se generó para tu proyecto. Después ejecútala con el siguiente comando para construir e implementar nuestro Storybook. Asegúrate de reemplazar `project-token` con su token de proyecto.

```shell
yarn chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Cuando termines, vas a recibir un enlace `https://random-uuid.chromatic.com` a tu Storybook publicado. Comparte el enlace con tu equipo para recibir comentarios.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-4.png)

Hurra! Publicamos Storybook con un comando, pero ejecutar un comando manualmente cada vez que queremos obtener feedback sobre la implementación de la interfaz de usuario es repetitivo. Idealmente, publicaríamos la última versión de los componentes cada vez que hacemos push a GitHub. Tendremos que desplegar continuamente Storybook.

___


## Despliegue continuo

Queremos compartir la última versión de los componentes cada vez que hagamos push del código. Para ello necesitamos desplegar de forma continua Storybook. Confiaremos en GitHub y Netlify para desplegar nuestro sitio estático. Estaremos usando el plan gratuito de Netlify.

### GitHub

Primero debes configurar Git para tu proyecto en el directorio local. Si estás siguiendo el capítulo anterior sobre testing, salta a la creación de un repositorio en GitHub.

```shell
git init
```

Agrega archivos al primer commit.

```shell
git add .
```

Ahora haz commit de los archivos.

```shell
git commit -m "taskbox UI"
```

Ve a Github y configura un repositorio [aquí](https://github.com/new). Nombra tu repo “taskbox”.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

En la nueva configuración del repositorio copia la URL de origen del repositorio y añádelo a tu proyecto git con este comando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente haz push al repo en GitHub.

```shell
git push -u origin main
```

### Netlify

Netlify tiene incorporado un servicio de despliegue continuo que nos permitirá desplegar Storybook sin necesidad de configurar nuestro propio CI.

<div class="aside">
Si usas CI en tu empresa, añade un script de implementación a tu configuración que suba <code>storybook-static</code> a un servicio de alojamiento de estáticos como S3.
</div>

[Crea una cuenta en Netlify](https://app.netlify.com/start) y da click en “crear sitio”.

![Crear sitio en Netlify](/intro-to-storybook/netlify-create-site.png)

A continuación, haz clic en el botón de GitHub para conectar Netlify a GitHub. Esto le permite acceder a nuestro repositorio remoto Taskbox.

Ahora selecciona el repo de taskbox de GitHub de la lista de opciones.

![Conectar un repositorio en Netlify](/intro-to-storybook/netlify-account-picker.png)

Configura Netlify resaltando el comando build que se ejecutará en tu CI y el directorio en el que se enviará el sitio estático. Para la rama elegir `main`. El directorio es `storybook-static`. Ejecuta el comando `yarn build-storybook`.

![Ajustes Netlify](/intro-to-storybook/netlify-settings.png)

Ahora envía el formulario para construir e implementar el código en la rama `main` del taskbox.

Cuando esto termine veremos un mensaje de confirmación en Netlify con un enlace al Storybook de Taskbox online. Si lo estás siguiendo, tu Storybook desplegado debería estar en línea [como este](https://clever-banach-415c03.netlify.com/).

![Despliegue de Netlify Storybook](/intro-to-storybook/netlify-storybook-deploy.png)

Terminamos de configurar el despliegue continuo de tu Storybook! Ahora podemos compartir nuestras historias con nuestros compañeros de equipo a través de un enlace.

Esto es útil para la revisión visual como parte del proceso de desarrollo de aplicaciones estándar o simplemente para mostrar nuestro trabajo💅.
