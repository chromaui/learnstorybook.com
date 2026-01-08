---
title: 'Automatizar las pruebas visuales'
tocTitle: 'Automatizar'
description: 'Automatice las pruebas visuales para detectar regresiones'
commit: '86e7ca5'
---

En el curso natural del desarrollo, los errores son inevitables. La automatización de pruebas visuales utiliza máquinas para detectar cambios en la apariencia de la interfaz de usuario para que los revise un humano.

En pocas palabras, se toma una instantánea de cada variación de los componentes. Esto sirve como "línea base" de la prueba visual. Con cada commit, se capturan nuevas instantáneas y luego se comparan píxel por píxel con las líneas base. Si hay cambios en la interfaz de usuario, se le notificará para que revise si son errores o actualizaciones intencionales.

<video autoPlay muted playsInline loop >
  <source
    src="/visual-testing-handbook/automate-visual-workflow-test-diff.mp4"
    type="video/mp4"
  />
</video>

## Configure un repositorio en GitHub

Antes de comenzar, nuestro código local `CommentList` debe sincronizarse con un servicio de control de versiones remoto.

Vaya a GitHub y cree un nuevo repositorio para el proyecto [aquí](https://github.com/new). Nombre el repositorio "commentlist", igual que nuestro proyecto local.

![Configure el repositorio de 'comment list' en GitHub](/visual-testing-handbook/commentlist-gh-repo-optimized.png)

Luego, siga las instrucciones para configurar el repositorio. Reemplace `your-username` con el nombre de tu cuenta de GitHub.

```shell:clipboard=false
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/your-username/commentlist.git
git push -u origin main
```

## Configure Chromatic

Usaremos los mantenedores de Chromatic by Storybook para demostrar el proceso de captura de imágenes. Vaya a [chromatic.com](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook) y regístrese con su cuenta de GitHub.

![Inicio de sesión de Chromatic](/visual-testing-handbook/chromatic-sign-in-optimized.png)

Desde allí, elija el repositorio que acaba de crear.

<video autoPlay muted playsInline loop>
  <source src="/visual-testing-handbook/chromatic-create-project-optimized.mp4"
    type="video/mp4" />
</video>
 
Las pruebas de interfaz de usuario capturan una instantánea de cada historia en un entorno de navegador en la nube. Siempre que envíe código, Chromatic genera un nuevo conjunto de instantáneas y las compara con las líneas base. Si hay cambios visuales, verifica si son intencionales.

### Establezca líneas base

Agregue Chromatic como paquete de desarrollo a su proyecto:

```shell
yarn add --dev chromatic
```

Una vez que termine de instalarse, tendremos todo lo que necesitamos. Ahora es un excelente momento para confirmar y enviar los cambios al repositorio remoto.

```shell:clipboard=false
git add .
git commit -m "Added Chromatic"
git push
```

Construya y publique nuestro Storybook con el comando `chromatic`. No olvide reemplazar el <code> project-token </code> con un suministro de Chromatic en el sitio web.

```shell
yarn chromatic --project-token=<project-token>
```

![Ejecutando Chromatic](/intro-to-storybook/chromatic-manual-storybook-console-log.png)

Con este comando, usted publicó su Storybook, activó Chromatic para capturar una instantánea de cada historia (en un navegador en la nube estandarizado) y estableció la instantánea como línea base.

Las compilaciones posteriores generarán nuevas instantáneas que se comparan con las líneas base existentes para detectar cambios en la interfaz de usuario.

![Líneas base en Chromatic](/visual-testing-handbook/commentlist-accepted-baselines-optimized.png)

### Ejecute las pruebas

Cada vez que una pull request contiene cambios en la interfaz de usuario, grandes o pequeños, es útil ejecutar las pruebas visuales. Chromatic compara nuevas instantáneas con líneas base existentes de compilaciones anteriores.

Hagamos un pequeño cambio en la interfaz de usuario para demostrar este concepto.

```shell
git checkout -b change-commentlist-outline
```

Ajuste el componente `CommentList`

```diff:title=src/components/CommentList.tsx
import styled, { createGlobalStyle } from 'styled-components';

interface Author {
  name: string;
  avatar: string;
}

interface Comment {
  text: string;
  author: Author;
}

export interface CommentListProps {
  /**
   * Is the component in the loading state
   */
  loading?: boolean;

  /**
   * Total number of comments
   */
  totalCount?: number;

  /**
   * List of comments
   */
  comments?: Comment[];
}

const CommentListWrapper = styled.div`
  font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  color: #333;
  display: inline-block;
  vertical-align: top;
  width: 265px;
`;

const CommentItem = styled.div`
  font-size: 12px;
  line-height: 14px;
  clear: both;
  height: 48px;
  margin-bottom: 10px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0;
  background: linear-gradient(
    120deg,
    rgba(248, 248, 254, 0.95),
    rgba(250, 250, 250, 0.95)
  );
  border-radius: 48px;
+ border: 4px solid red;
+ font-weight: bold;
`;

const Avatar = styled.div`
  float: left;
  position: relative;
  overflow: hidden;
  height: 48px;
  width: 48px;
  margin-right: 14px;
  background: #dfecf2;
  border-radius: 48px;
`;

const AvatarImg = styled.img`
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  z-index: 1;
  background: #999;
`;

const Message = styled.div`
  overflow: hidden;
  padding-top: 10px;
  padding-right: 20px;
`;

const Author = styled.span`
  font-weight: bold;
`;

const CommentText = styled.span``;

const GlobalStyle = createGlobalStyle`
   @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
 `;

/**
* The Commentlist component should display the comments from the user.
*/
export default function CommentList({
  loading = false,
  comments = [],
  totalCount = 10,
}: CommentListProps) {
  if (loading) {
    return <div>loading</div>;
  }
  if (comments.length === 0) {
    return <div>empty</div>;
  }
  return (
    <>
      <GlobalStyle />
      <CommentListWrapper>
        {comments.map(({ text, author: { name, avatar } }) => (
          <CommentItem key={`comment_${name}`}>
            <Avatar>
              <AvatarImg src={avatar} />
            </Avatar>
            <Message>
              <Author>{name}</Author> <CommentText>{text}</CommentText>
            </Message>
          </CommentItem>
        ))}
      </CommentListWrapper>
    </>
  );
}
```

Confirme el cambio, envíelo al repositorio y ejecute Chromatic:

```shell:clipboard=false
git commit -am "make CommentList sparkle"
git push -u origin change-commentlist-outline
yarn chromatic --project-token=<project-token>
```

Abra una pull request para la nueva rama en su repositorio de GitHub.

![Comment list pull requested abierta en GitHub](/visual-testing-handbook/commentlist-gh-pullrequest-optimized.png)

Chromatic detectó cambios en la interfaz de usuario para que los revises. Vaya a las verificaciones de la PR y haga clic en "🟡 UI Test" para ver la lista de cambios. La compilación se marcará como “unreviewed”, o “no revisada”, y los cambios se enumerarán en la tabla “Tests”.

![Nuevos cambios publicados en Chromatic](/visual-testing-handbook/commentlist-ui-tests-chromatic-optimized.png)

### Revise los cambios

La automatización de las pruebas visuales garantiza que los componentes no cambien por accidente. Pero aún depende de los desarrolladores determinar si los cambios son intencionales o no.

Si un cambio es intencional, aceptamos la instantánea para actualizar la línea base. Eso significa que las pruebas futuras se compararán con el componente `CommentList` con bordes rojos.

Si un cambio no es intencional, es necesario corregirlo. Nuestro diseñador cree que el ✨majestuoso✨ borde rojo es horripilante, así que deshagámoslo.

![Chromatic pantalla de prueba](/visual-testing-handbook/chromatic-test-screen-optimized.png)

### Fusionar los cambios

Una vez que los errores se corrijan y las líneas base estén actualizadas, estás listo para fusionar el código nuevamente en la rama de destino. Chromatic transferirá las líneas base aceptadas entre las ramas para que solo tenga que aceptar las líneas base una vez.

![flujo de trabajo de las pruebas visuales](/visual-testing-handbook/workflow-uitest.png)

### Integración continua

Ejecutar este comando localmente cada vez que hacemos un cambio es tedioso. Los equipos de producción activan ejecuciones de pruebas visuales cuando se inserta el código en su CI/CD pipeline. Si bien no lo configuraremos en este tutorial, puede obtener más información en [Chromatic's CI docs](https://www.chromatic.com/docs/ci?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook).

## Su viaje comienza

El manual de pruebas visuales muestra cómo los equipos de frontend líderes prueban la apariencia de la interfaz de usuario. Es una forma práctica de verificar que la interfaz de usuario coincide con el diseño previsto y permanece libre de errores con el tiempo.

Esperamos que esta guía inspire su propia estrategia de prueba visual. El capítulo final concluye con el código de muestra completo y recursos útiles.
