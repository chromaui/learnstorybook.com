---
title: 'TDD Visual'
description: 'Escribe tus primeras pruebas visuales'
---

Ahora que los conceptos básicos fueron cubiertos, veamos los detalles. Este ejemplo muestra la construcción de un estado de un componente `CommentList` usando **TDD Visual** (desarrollo guiado por pruebas visuales) con Storybook.

1. Cree casos de prueba visuales
2. Consulte las pruebas en Storybook
3. Desarrolle la implementación
4. Compare la implementación con el diseño.
5. Iterar

### Lo que estamos construyendo

`CommentList` es parte de una herramienta de chat para luchadores por la libertad galáctica. Nuestro diseñador nos ha entregado un diseño para las diversas formas en que debe verse la lista de comentarios según los datos y el estado de la aplicación. Nuestro trabajo es garantizar que la lista se muestre correctamente en términos del texto exacto, las imágenes mostradas y el tratamiento visual.

![Especificaciones de diseño de Commentlist](/visual-testing-handbook/visual-testing-handbook-commentlist-design-optimized.png)

### 1. Cree casos de prueba visuales

Inicie el desarrollo guiado por pruebas visuales mediante la creación de casos de prueba. Crearemos tres casos que coincidan con las tres imágenes de arriba. Un desarrollo guiado por pruebas estricto diría que necesitamos desarrollar e implementar un caso de prueba a la vez; depende de usted si cree que esto ayuda a su proceso.

Configuremos el proyecto de ejemplo usando [degit](https://github.com/Rich-Harris/degit) para descargar las plantillas repetitivas necesarias (aplicaciones parcialmente construidas con alguna configuración predeterminada). Ejecute los siguientes comandos:

```shell
# Clone the template for this tutorial
npx degit chromaui/visual-testing-handbook-react-template commentlist

cd commentlist

# Install dependencies
yarn
```

A continuación, crearemos la implementación de `CommentList` más simple posible para que podamos asegurarnos de que nuestras pruebas estén configuradas correctamente.

Dentro de su directorio `src`, cree una nueva carpeta llamada` components`, luego cree un nuevo archivo llamado `CommentList.js` con el siguiente contenido:

```js:title=src/components/CommentList.js
import React from 'react';

import PropTypes from 'prop-types';

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>empty</div>;
  }
  if (comments.length === 0) {
    return <div>loading</div>;
  }
  return (
    <div>
      {comments.length} of {totalCount}
    </div>
  );
}

CommentList.propTypes = {
  /**
   * Is the component in the loading state
   */
  loading: PropTypes.bool,

  /**
   * Total number of comments
   */
  totalCount: PropTypes.number,
  /**
   * List of comments
   */
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    })
  ),
};

CommentList.defaultProps = {
  loading: false,
  totalCount: 10,
  comments: [],
};
```

Ahora que tenemos una implementación básica, podemos construir nuestros estados de prueba. Storybook hace que esto sea rápido y fácil.

Cree un nuevo archivo llamado `CommentList.stories.js` en `src/components` y agregue lo siguiente:

```js:title=src/components/CommentList.stories.js
import React from 'react';

import CommentList from './CommentList';

export default {
  component: CommentList,
  title: 'CommentList',
};

const Template = args => <CommentList {...args} />;

export const Paginated = Template.bind({});
Paginated.args = {
  comments: [
    {
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
      author: {
        name: 'Luke',
        avatar: 'luke.jpeg',
      },
    },
    {
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      author: {
        name: 'Leah',
        avatar: 'leah.jpeg',
      },
    },
    {
      text: 'Duis aute irure dolor in reprehenderit in voluptate.',
      author: {
        name: 'Han',
        avatar: 'han.jpeg',
      },
    },
    {
      text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco.',
      author: {
        name: 'Poe',
        avatar: 'poe.jpeg',
      },
    },
    {
      text: 'Duis aute irure dolor in reprehenderit in voluptate.',
      author: {
        name: 'Finn',
        avatar: 'finn.jpeg',
      },
    },
  ],
  totalCount: 10,
};

export const HasData = Template.bind({});
HasData.args = {
  comments: [...Paginated.args.comments.slice(0, 3)],
  totalCount: 3,
};
export const Loading = Template.bind({});
Loading.args = {
  comments: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  ...Loading.args,
  loading: false,
};
```

### 2. Consulte las pruebas en Storybook

Inicie Storybook para ver los casos de prueba. La implementación de nuestros componentes es básica, pero nos permite confirmar que nuestros casos de prueba se procesan según lo previsto.

```shell
# Start Storybook in development mode
yarn storybook
```

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-initial-state-optimized.mp4"
    type="video/mp4"/>
</video>

### 3. Desarrolle la implementación

Hasta ahora, edificamos una implementación rudimentaria y luego configuramos Storybook para renderizar nuestros casos de prueba. Es hora de comenzar a construir una implementación de la variación `HasData` de forma aislada.

Usamos [`styled-components`](https://styled-components.com/) - una biblioteca que encapsula CSS a nivel de componente. Ejecute el siguiente comando:

```shell
yarn add styled-components
```

Actualice su archivo `CommentList.js` con lo siguiente:

```diff:title=src/components/CommentList.stories.js
import React from 'react';

import PropTypes from 'prop-types';

+ import styled, { createGlobalStyle } from 'styled-components';

+ const CommentListDiv = styled.div`
+   font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
+   color: #333;
+   display: inline-block;
+   vertical-align: top;
+   width: 265px;
+ `;

+ const CommentItemDiv = styled.div`
+   font-size: 12px;
+   line-height: 14px;
+   clear: both;
+   height: 48px;
+   margin-bottom: 10px;
+   box-shadow: rgba(0, 0, 0, 0.2) 0 0 10px 0;
+   background: linear-gradient(
+    120deg,
+    rgba(248, 248, 254, 0.95),
+    rgba(250, 250, 250, 0.95)
+   );
+   border-radius: 48px;
+ `;

+ const AvatarDiv = styled.div`
+   float: left;
+   position: relative;
+   overflow: hidden;
+   height: 48px;
+   width: 48px;
+   margin-right: 14px;
+   background: #dfecf2;
+   border-radius: 48px;
+ `;

+ const AvatarImg = styled.img`
+   position: absolute;
+   height: 100%;
+   width: 100%;
+   left: 0;
+   top: 0;
+   z-index: 1;
+   background: #999;
+ `;

+ const MessageDiv = styled.div`
+   overflow: hidden;
+   padding-top: 10px;
+   padding-right: 20px;
+ `;

+ const AuthorSpan = styled.span`
+   font-weight: bold;
+ `;

+ const TextSpan = styled.span``;

+ const GlobalStyle = createGlobalStyle`
+   @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
+ `;

export default function CommentList({ loading, comments, totalCount }) {
  if (loading) {
    return <div>empty</div>;
  }
  if (comments.length === 0) {
    return <div>loading</div>;
  }
  return (
+   <>
+   <GlobalStyle/>
+   <CommentListDiv>
+     {comments.map(({ text, author: { name, avatar } }) => (
+       <CommentItemDiv key={`comment_${name}`}>
+         <AvatarDiv>
+           <AvatarImg src={avatar} />
+         </AvatarDiv>
+         <MessageDiv>
+           <AuthorSpan>{name}</AuthorSpan> <TextSpan>{text}</TextSpan>
+         </MessageDiv>
+       </CommentItemDiv>
+     ))}
+   </CommentListDiv>
+   </>
  );
}

CommentList.propTypes = {
  /**
   * Is the component in the loading state
   */
  loading: PropTypes.bool,

  /**
   * Total number of comments
   */
  totalCount: PropTypes.number,
  /**
   * List of comments
   */
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      author: PropTypes.shape({
        name: PropTypes.string,
        avatar: PropTypes.string,
      }),
    })
  ),
};

CommentList.defaultProps = {
  loading: false,
  totalCount: 10,
  comments: [],
};
```

### 4. Compare la implementación con el diseño

Compruebe cómo se ve el componente en Storybook. Este ejemplo ya proporcionó el CSS, pero en la práctica, modificaríamos los estilos y los confirmamos en Storybook a medida que avanzamos.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/commentlist-finished-state-optimized.mp4"
    type="video/mp4"/>
</video>

### 5. Iterar

Si no estamos satisfechos con la implementación en el paso 4, regresaremos al paso 3 y seguiremos trabajando en ello. Si la interfaz de usuario coincide con la especificación, pasaremos a crear la siguiente variación, tal vez agregando el botón "cargar más" a la historia `Paginada`.

Mientras iteramos a través de este flujo de trabajo, verifique regularmente cada historia para asegurarse de que la implementación final maneje correctamente cada estado de prueba y no solo el último en el que trabajamos.

## Aprenda a automatizar las pruebas visuales

En el próximo capítulo, veremos cómo podemos automatizar el proceso VTDD con [Chromatic](https://chromatic.com/), un servicio gratuito de prueba visual creado por los mantenedores de Storybook.
