---
title: 'Desplegar Storybook'
tocTitle: 'Desplegar'
description: 'Desplegar Storybook online con GitHub y Netlify'
---

Durante este tutorial, construimos componentes en nuestra máquina de desarrollo local. En algún momento, vamos a necesitar compartir nuestro trabajo para obtener feedback del equipo. Vamos a desplegar Storybook para ayudar a nuestros compañeros a revisar la implementación de la interfaz de usuario.


## Exportando como una app estática

Para desplegar Storybook primero necesitamos exportarlo como una aplicación web estática. Esta funcionalidad ya está incorporada en Storybook y preconfigurada.

Ejecutando `yarn build-storybook` generará un Storybook estático en el directorio `storybook-static`, que luego se puede desplegar en cualquier servicio de hosting de sitios estáticos.

## Publicar Storybook

This tutorial uses <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, a free publishing service made by the Storybook maintainers. It allows us to deploy and host our Storybook safely and securely in the cloud.

Este tutorial usa <a href="https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook">Chromatic</a>, un servicio de publicación gratuito hecho por los mantenedores de Storybook. Nos permite desplegar y alojar nuestro Storybook de forma segura en la nube.

### Configurar un repositorio en GitHub

Antes de empezar, nuestro código local tiene que sincronizar con un servicio de control de versiones remoto. Cuando configuramos nuestro proyecto en el capítulo de [Empezando](/intro-to-storybook/react/es/get-started/), ya inicializamos un repositorio local. En este punto del tutorial ya tenemos varios commits que podemos enviar a un repositorio remoto.

Ve a GitHub y crea un nuevo repositorio para nuestro proyecto [aquí](https://github.com/new). Nombra tu repo “taskbox”, igual que nuestro proyecto local.

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

Agrega el paquete como una dependencia de desarrollo.

```shell
yarn add -D chromatic
```

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

## Despliegue continuo con Chromatic

Ahora que alojamos nuestro proyecto en un repositorio GitHub, podemos usar un servicio de integración continua (CI) para desplegar nuestro Storybook automáticamente. [GitHub Actions](https://github.com/features/actions) es un servicio de CI gratuito integrado en GitHub que facilita la publicación automática.

### Añadir un Accion de GitHub para desplegar Storybook

En la carpeta raíz de nuestro proyecto, cree un nuevo directorio que se llama `.github`. Luego cree otro directorio `workflows` dentro de él.

Crea un nuevo archivo llamado `chromatic.yml` como este ejemplo:

```yaml:title=.github/workflows/chromatic.yml
# Nombre de workflow
name: 'Chromatic Deployment'
# Evento para el workflow
on: push
# Lista de trabajos
jobs:
  test:
    # Sistema operativo
    runs-on: ubuntu-latest
    # Pasos del trabajo
    steps:
      - uses: actions/checkout@v1
      - run: yarn
        #👇 Añade Chromatic como un paso en el workflow
      - uses: chromaui/action@v1
        # Opciones requeridas para el GitHub Action de Chromatic
        with:
          #👇 projectToken de Chromatic, revisar https://storybook.js.org/tutorials/intro-to-storybook/react/es/deploy/ para información sobre como obtenerlo
          projectToken: ${{ secrets.CHROMATIC_PROJECT_TOKEN }}
          token: ${{ secrets.GITHUB_TOKEN }}
```


<div class="aside"><p>💡 Para mantener el tutorial breve no mencionamos a <a href=" https://docs.github.com/en/actions/security-guides/encrypted-secrets#creating-encrypted-secrets-for-a-repository ">secretos de GitHub</a>. Secretos son variables de entorno seguras proporcionadas por GitHub para que no tengas que codificar el <code>project-token</code>.</p></div>

### Hace commit la acción

Ejecuta el siguiente comando para agregar los cambios que has realizado:

```shell
git add .
```

Y después haz commit:

```shell
git commit -m "GitHub action setup"
```

Por último, haz push al repositorio remoto con:

```shell
git push origin main
```

Una vez que hayas configurado el GitHub action, tu Storybook se desplegará a Chromatic cada vez que haces push. Puedes encontrar todos los Storybooks publicados en la pantalla de compilación de su proyecto en Chromatic.

![Chromatic user dashboard](/intro-to-storybook/chromatic-user-dashboard.png)

Haz click en la última compilación. Debería ser el de arriba.

Luego, haz click en el botón `View Storybook` para ver la última versión de su Storybook.

![Storybook link on Chromatic](/intro-to-storybook/chromatic-build-storybook-link-6-4-optimized.png)

Usa el enlace y compartélo con tus compañeros de equipo. Es útil como parte del proceso estándar de desarrollo de aplicaciones o simplemente para mostrar el trabajo💅.
