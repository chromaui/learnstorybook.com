---
title: "Desplegar Storybook"
tocTitle: "Desplegar"
description: "Desplegar Storybook online con GitHub y Netlify"
---

En este tutorial hemos ejecutado Storybook en nuestra máquina de desarrollo. Es probable que quieras compartir ese Storybook con tu equipo, especialmente con los miembros no técnicos. Afortunadamente, es fácil desplegar Storybook en línea.

<div class="aside">
<strong>¿Seguiste los pasos del capítulo anterior con Chromatic?</strong>
<br/>
🎉 ¡Tus historias ya están desplegadas! Chromatic indexa de forma segura tus historias en línea y las rastrea a través de ramas y commits. Salta este capítulo y ve a la <a href="/angular/es/conclusion">conclusión</a>.
</div>

## Exportando como una app estática

Para desplegar Storybook primero necesitamos exportarlo como una aplicación web estática. Esta funcionalidad ya está incorporada en Storybook, sólo necesitamos activarla añadiendo un script al `package.json`.

```javascript
{
  "scripts": {
    "storybook": "build-storybook -c .storybook"
  }
}
```

Ahora, cuando ejecutes `npm run storybook`, obtendrás un Storybook estático en el directorio `storybook-static`.

## Despliegue continuo

Queremos compartir la última versión de los componentes cada vez que enviemos código nuevo. Para ello necesitamos desplegar de forma continua Storybook. Confiaremos en GitHub y Netlify para desplegar nuestro sitio estático. Utilizaremos el plan gratuito de Netlify.

### GitHub

Primero debes configurar Git para tu proyecto en el directorio local. Si estás siguiendo desde el capítulo anterior sobre testing, salta a la creación de un repositorio en GitHub.

```bash
$ git init
```

Agrega archivos al primer commit.

```bash
$ git add .
```

Ahora haz commit de los archivos.

```bash
$ git commit -m "taskbox UI"
```

Ve a Github y configura un repositorio [aquí](https://github.com/new). Nombra tu repositorio “taskbox”.

![GitHub setup](/github-create-taskbox.png)

En la nueva configuración del repositorio copia la URL de origen del repositorio y añádelo a tu proyecto git con este comando:

```bash
$ git remote add origin https://github.com/<tu nombre de usuario>/taskbox.git
```

Finalmente haz push al repositorio en GitHub.

```bash
$ git push -u origin master
```

### Netlify

Netlify tiene incorporado un servicio de despliegue continuo que nos permitirá desplegar Storybook sin necesidad de configurar nuestro propio CI.

<div class="aside">
Si usas CI en tu empresa, añade un script de implementación a tu configuración que suba <code>storybook-static</code> a un servicio de alojamiento estático como S3.
</div>

[Crea una cuenta en Netlify](https://app.netlify.com/start) y da click en “crear sitio”.

![Crear sitio en Netlify](/netlify-create-site.png)

A continuación, haz clic en el botón de GitHub para conectar Netlify a GitHub. Esto le permite acceder a nuestro repositorio remoto Taskbox.

Ahora selecciona el repo de taskbox de GitHub de la lista de opciones.

![Conectar un repositorio en Netlify](/netlify-account-picker.png)

Configura Netlify resaltando cuál comando se ejecutará en tu CI y el directorio en el que se enviará el sitio estático. Elige `master` como la rama del repositorio. El directorio es `storybook-static`. Ejecuta el comando `yarn build-storybook`.

![Ajustes Netlify](/netlify-settings.png)

Ahora envía el formulario para construir e implementar el código en la rama `master` del taskbox.

Cuando esto termine veremos un mensaje de confirmación en Netlify con un enlace al Storybook de Taskbox online. Si has llevado a cabo los pasos anteriores, tu Storybook desplegado debería estar en línea [como este](https://clever-banach-415c03.netlify.com/).

![Despliegue de Netlify Storybook](/netlify-storybook-deploy.png)

¡Hemos terminado de configurar el despliegue continuo de tu Storybook! Ahora podemos compartir nuestras historias con nuestros compañeros de equipo a través de un enlace.

Esto es útil para la revisión visual como parte del proceso de desarrollo de aplicaciones estándar o simplemente para mostrar nuestro trabajo💅.
