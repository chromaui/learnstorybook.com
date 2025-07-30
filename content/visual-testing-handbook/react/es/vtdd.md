---
title: 'TDD Visual'
description: 'Escribe tus primeras pruebas visuales'
commit: 'bbdb86d'
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

```shell:clipboard=false
# Clone the template for this tutorial
npx degit chromaui/visual-testing-handbook-react-template commentlist

cd commentlist

# Install dependencies
yarn
```

A continuación, crearemos la implementación de `CommentList` más simple posible para que podamos asegurarnos de que nuestras pruebas estén configuradas correctamente.

Dentro de su directorio `src`, cree una nueva carpeta llamada`components`, luego cree un nuevo archivo llamado `CommentList.tsx` con el siguiente contenido:

```tsx:title=src/components/CommentList.tsx
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

/**
* The Commentlist component should display the comments from the users.
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
    <div>
      {comments.length} of {totalCount}
    </div>
  );
}
```

Ahora que tenemos una implementación básica, podemos construir nuestros estados de prueba. Storybook hace que esto sea rápido y fácil.

Cree un nuevo archivo llamado `CommentList.stories.ts` en `src/components` y agregue lo siguiente:

```ts:title=src/components/CommentList.stories.ts
import type { Meta, StoryObj } from '@storybook/react-vite';

import CommentList from './CommentList';

const meta = {
  component: CommentList,
  title: 'CommentList',
} satisfies Meta<typeof CommentList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paginated: Story = {
  args: {
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
  },
};

export const HasData: Story = {
  args: {
    comments: [...(Paginated?.args?.comments?.slice(0, 3) || [])],
    totalCount: 3,
  },
};

export const Loading: Story = {
  args: {
    comments: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Loading.args,
    loading: false,
  },
};
```

### 2. Consulte las pruebas en Storybook

Inicie Storybook para ver los casos de prueba. La implementación de nuestros componentes es básica, pero nos permite confirmar que nuestros casos de prueba se procesan según lo previsto.

```shell
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

```diff:title=src/components/CommentList.tsx
+ import styled, { createGlobalStyle } from 'styled-components';

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

+ const CommentListWrapper = styled.div`
+   font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
+   color: #333;
+   display: inline-block;
+   vertical-align: top;
+   width: 265px;
+ `;

+ const CommentItem = styled.div`
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

+ const Avatar = styled.div`
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

+ const Message = styled.div`
+   overflow: hidden;
+   padding-top: 10px;
+   padding-right: 20px;
+ `;

+ const Author = styled.span`
+   font-weight: bold;
+ `;

+ const CommentText = styled.span``;

+ const GlobalStyle = createGlobalStyle`
+   @import url('https://fonts.googleapis.com/css?family=Nunito+Sans:400,400i,800');
+ `;

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
+   <>
+     <GlobalStyle />
+     <CommentListWrapper>
+       {comments.map(({ text, author: { name, avatar } }) => (
+         <CommentItem key={`comment_${name}`}>
+           <Avatar>
+             <AvatarImg src={avatar} />
+           </Avatar>
+           <Message>
+             <Author>{name}</Author> <CommentText>{text}</CommentText>
+           </Message>
+         </CommentItem>
+       ))}
+     </CommentListWrapper>
+   </>
  );
}
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

En el próximo capítulo, veremos cómo podemos automatizar el proceso VTDD con [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook), un servicio gratuito de prueba visual creado por los mantenedores de Storybook.
