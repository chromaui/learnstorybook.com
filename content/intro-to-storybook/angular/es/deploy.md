---
title: 'Desplegar Storybook'
tocTitle: 'Desplegar'
description: 'Aprende a desplegar Storybook'
commit: '0107aa6'
---

A lo largo de este tutorial, creamos componentes en nuestra máquina de desarrollo local. En algún momento, tendremos
que compartir nuestro trabajo para recibir comentarios del equipo. Implementemos Storybook en línea para ayudar a
los compañeros de equipo a revisar la implementación de la interfaz de usuario.

## Exportar como una aplicación estática

Para implementar Storybook, primero debemos exportarlo como una aplicación web estática. Esta funcionalidad ya está
integrada en Storybook y preconfigurada.

La ejecución de `npm run build-storybook` generará un Storybook estático en el directorio`storybook-static`, que
luego se puede implementar en cualquier servicio de alojamiento de sitios estáticos.

## Publicar Storybook

Este tutorial utiliza <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, un servicio de publicación gratuito
realizado por los mantenedores de Storybook. Nos permite implementar y alojar nuestro Storybook de forma segura en la nube.

### Configurar un repositorio en GitHub

Antes de comenzar, nuestro código local debe sincronizarse con un servicio de control de versiones remoto. Cuando
nuestro proyecto se inicializó en el [capítulo "Empezando"](/intro-to-storybook/angular/es/get-started/), ya
inicializamos un repositorio local. En esta etapa, ya tenemos un conjunto de confirmaciones que podemos enviar a una remota.

Vaya a GitHub y cree un nuevo repositorio para nuestro proyecto [aquí](https://github.com/new). Nombra el
repositorio "tasks", igual que nuestro proyecto local.

![GitHub setup](/intro-to-storybook/github-create-taskbox.png)

En el nuevo repositorio, tome la URL de origen del repositorio y agréguela a su proyecto git con este comando:

```shell
git remote add origin https://github.com/<su usuario>/taskbox.git
```

Finalmente, hacer "push" de nuestro repositorio local al repositorio remoto en GitHub con:

```shell
git push -u origin main
```

### Obtener Chromatic

Agregue el paquete como una dependencia de desarrollo.

```shell
npm install -D chromatic
```

Una vez que el paquete está instalado, [login en Chromatic](https://www.chromatic.com/start/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) con su cuenta de GitHub
(Chromatic solo solicitará permisos ligeros). Luego crearemos un nuevo proyecto llamado "taskbox" y lo
sincronizaremos con el repositorio de GithHub que hemos configurado.

Click `Choose GitHub repo` como colaboradores y seleccione su repositorio.

<video autoPlay muted playsInline loop style="width:520px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/chromatic-setup-learnstorybook.mp4"
    type="video/mp4"
  />
</video>

Copie el "token de proyecto" único que se generó para su proyecto. Luego ejecútelo, emitiendo lo siguiente en la
línea de comando, para construir e implementar nuestro Storybook. Asegúrate de reemplazar `project-token` con el token de tu proyecto.

```shell
npx chromatic --project-token=<project-token>
```

![Chromatic running](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Cuando termine, obtendrá un enlace `https: random-uuid.chromatic.com` a su Storybook publicado. Comparta el enlace
con su equipo para recibir comentarios.

![Storybook deployed with chromatic package](/intro-to-storybook/chromatic-manual-storybook-deploy-6-0.png)

¡Hurra! Publicamos Storybook con un comando, pero ejecutar manualmente un comando cada vez que queremos obtener
comentarios sobre la implementación de la interfaz de usuario es repetitivo. Idealmente, publicaríamos la última
versión de los componentes cada vez que hacemos un push del código. Necesitaremos implementar Storybook continuamente.

## Despliegue continuo con Chromatic

Ahora que nuestro proyecto está alojado en un repositorio de GitHub, podemos usar un servicio de integración
continua (CI) para implementar nuestro Storybook automáticamente. [GitHub Actions](https://github.com/features/actions) es un servicio gratuito de CI integrado en GitHub que facilita la publicación automática.

### Agregar una acción de GitHub para implementar Storybook

En la carpeta raíz de nuestro proyecto, cree un nuevo directorio llamado `.github` y luego cree otro directorio`workflows` dentro de él.

Cree un nuevo archivo llamado `chromatic.yml` como el que se muestra a continuación. Reemplaza `project-token` con el token de tu proyecto.

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
      - run: npm install
        #👇 Adds Chromatic as a step in the workflow
      - uses: chromaui/action@v1
        # Options required for Chromatic's GitHub Action
        with:
          #👇 Chromatic projectToken, see https://storybook.js.org/tutorials/intro-to-storybook/angular/es/deploy/ to obtain it
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```

<div class="aside"><p>💡 Por razones de brevedad, no mencionamos los <a href="https://help.github.com/en/actions/configuring-and-managing-workflows/creating-and-storing-encrypted-secrets">GitHub secrets</a>. Los secretos son variables de entorno seguras proporcionadas por GitHub para que no necesite codificar el <code>project-token</code>.</p></div>

### Commit la acción

En la línea de comando, emita el siguiente comando para agregar los cambios que se realizaron:

```shell
git add .
```

Luego, confírmelo emitiendo:

```shell
git commit -m "GitHub action setup"
```

Finalmente, envíelos al repositorio remoto con:

```shell
git push origin main
```

Una vez que haya configurado la acción de GitHub. Su Storybook se implementará en Chromatic cada vez que presione el
código. Puedes encontrar todos los Storybooks publicados en la pantalla de compilación de tu proyecto en Chromatic.

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

Haga clic en la última compilación, debería ser la que está en la parte superior.

Luego, haga clic en el botón `Ver Storybook` para ver la última versión de su Storybook.

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link.png)

Utilice el enlace y compártalo con los miembros de su equipo. Esto es útil como parte del proceso de desarrollo de
aplicaciones estándar o simplemente para presumir de trabajo. 💅.
