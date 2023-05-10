---
title: 'Desplegar Storybook'
tocTitle: 'Desplegar'
description: 'Aprenda a desplegar Storybook en línea'
commit: '8d3e9ad'
---

A lo largo de este tutorial, creamos componentes en nuestra máquina de desarrollo. En algún momento, tendremos que compartir nuestro trabajo para recibir comentarios del equipo. Despleguemos Storybook en línea para ayudar a los compañeros de equipo a revisar la implementación de la interfaz de usuario.

## Exportando como una app estática

Para desplegar Storybook primero necesitamos exportarlo como una aplicación web estática. Esta funcionalidad ya está incorporada en Storybook.

Ahora, cuando ejecutes Storybook a través de `yarn build-storybook`, obtendrás un Storybook estático en el directorio `storybook-static`, que luego se puede implementar en cualquier servicio de alojamiento de sitios estáticos.

## Publicar Storybook

Este tutorial utiliza <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, un servicio de publicación gratuito creado por los mantenedores de Storybook. Nos permite implementar y alojar nuestro Storybook de forma segura en la nube..

### Configurar un repositorio en GitHub

Antes de comenzar, nuestro código local debe sincronizarse con un servicio de control de versiones remoto. Cuando nuestro proyecto se inicializó en el [Empezando](/intro-to-storybook/vue/es/get-started), ya inicializamos un repositorio local. En esta etapa, ya tenemos un conjunto de commits que podemos enviar remotamente.

Ve a Github y configura un repositorio [aquí](https://github.com/new). Nombra tu repo “taskbox”, igual que nuestro proyecto local.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

En la nueva configuración del repositorio copia la URL de origen del repositorio y añádelo a tu proyecto git con este comando:

```shell
git remote add origin https://github.com/<your username>/taskbox.git
```

Finalmente haz push al repo en GitHub.

```shell
git push -u origin main
```

### Agrega Chromatic

Agregue el paquete como una dependencia de desarrollo.

```shell
yarn add -D chromatic
```

Una vez que el paquete esté instalado, [inicie sesión en Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) con su cuenta de GitHub (Chromatic solo pedirá permisos simples). Luego crearemos un nuevo proyecto llamado "taskbox" y lo sincronizaremos con el repositorio de GithHub que hemos configurado.

Haga clic en `Elegir repositorio de GitHub` debajo de colaboradores y seleccione su repositorio.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copie el "project-token" único que se generó para su proyecto. Luego ejecútelo, emitiendo lo siguiente en la línea de comando, para construir e implementar nuestro Storybook. Asegúrate de reemplazar `project-token` con el token de tu proyecto.

```shell
yarn chromatic --project-token=<project-token>
```

![Lanzando Chromatic](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Cuando termine, obtendrá un enlace `https://random-uuid.chromatic.com` a su Storybook publicado. Comparta el enlace con su equipo para recibir comentarios.

![Despliegue de storybook con el paquete chromatic](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

¡Hurra! Publicamos Storybook con un comando, pero ejecutar manualmente un comando cada vez que queremos obtener comentarios sobre la implementación de la interfaz de usuario es repetitivo. Idealmente, publicaríamos la última versión de los componentes cada vez que hagamos push del código. Necesitaremos desplegar continuamente Storybook.

## Despliegue continuo con Chromatic

Ahora que nuestro proyecto está alojado en un repositorio de GitHub, podemos usar un servicio de integración continua(CI) para implementar nuestro Storybook automáticamente. [Acciones de GitHub](https://github.com/features/actions) es un servicio gratuito de CI integrado en GitHub que facilita la publicación automática.

### Agregar una acción de GitHub para implementar Storybook

En la carpeta raíz de nuestro proyecto, cree un nuevo directorio llamado `.github` y luego cree otro directorio `workflows` dentro de él.

Cree un nuevo archivo llamado `chromatic.yml` como el siguiente. Asegúrate de reemplazar `project-token` con su token de proyecto.

```yaml:title=.github/workflows/chromatic.yml
# Workflow name
name: 'Chromatic Deployment'
# Event for the workflow
on: push
# List of jobs
jobs:
  test:
    # Operating System
    runs-on: ubuntu-latest
    # Job steps
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/vue/es/deploy/ to obtain it
          projectToken: project-token
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>💡 Por motivos de brevedad, no se mencionaron los <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a>. Los secrets son variables de entorno seguras proporcionadas por GitHub para que no necesite codificar el <code>project-token</code>.</p></div>

### Commit en acción

En la línea de comando, emita el siguiente comando para agregar los cambios que se realizaron:

```shell
git add .
```

Luego, confírmelos emitiendo:

```shell
git commit -m "GitHub action setup"
```

Finalmente, envíelos al repositorio remoto con:

```shell
git push origin main
```

Una vez que haya configurado la acción de GitHub. Su Storybook se implementará en Chromatic cada vez que actualice el código. Puedes encontrar todos los Storybook publicados en la pantalla de compilación de tu proyecto en Chromatic.

![Panel de usuario de Chromatic](/intro-to-storybook/chromatic-user-dashboard.png)

Haga clic en la última compilación, debería ser la que está en la parte superior.

Luego, haga clic en el botón "Ver Storybook" para ver la última versión de su Storybook.

![Enlace de Storybook en Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Utilice el enlace y compártalo con los miembros de su equipo. Esto es útil como parte del proceso de desarrollo de aplicaciones estándar o simplemente para presumir de trabajo 💅.
