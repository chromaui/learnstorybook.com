---
title: 'Crie um componente simples'
tocTitle: 'Componente Simples'
description: 'Crie um componente simples isoladamente'
---

Construiremos nossa interface do usuário seguindo uma metodologia de Desenvolvimento Orientado a Componentes [Component-Driven Development](https://www.componentdriven.org/) (CDD). É um processo que constrói UIs de "baixo para cima", começando com componentes e terminando com telas. O CDD nos ajuda a dimensionar a quantidade de complexidade que você enfrenta ao criar a interface do usuário.

## Tarefas

![Componente de tarefas em três estados](/intro-to-storybook/task-states-learnstorybook.png)

`Tarefa` é o componente principal em nosso aplicativo. Cada tarefa é exibida de maneira ligeiramente diferente, dependendo exatamente do estado em que está. Exibimos uma caixa de seleção marcada (ou desmarcada), algumas informações sobre a tarefa e um botão "fixar", permitindo mover as tarefas para cima e para baixo na lista. Juntando tudo isso, vamos precisar dessas propriedades:

- `title` – uma string que descreve a tarefa
- `state` - em qual lista está a tarefa atualmente e ela está marcada?

Quando começamos a construir `Tarefa`, primeiro escrevemos nossos estados de teste que correspondem aos diferentes tipos de tarefas esboçadas acima. Em seguida, usamos o Storybook para construir o componente isoladamente usando dados fictícios. Faremos um “teste visual” da aparência do componente em cada estado à medida que avançamos.

Esse processo é semelhante ao [desenvolvimento orientado a testes](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) que podemos chamar de “Visual TDD” “[Visual TDD](https://www.chromatic.com/blog/visual-test-driven-development)”.

## Prepare-se

Vamos abrir `.storybook/main.js` e dar uma olhada

```js:title=.storybook/main.js
module.exports = {
  stories: ["../components/**/*.stories.?(ts|tsx|js|jsx)"],
  addons: [
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-actions",
  ],
};
```

Se você verificar a propriedade `stories`, verá que o Storybook está procurando histórias na pasta de `components`.

No React Native Storybook, usamos a configuração em `main.js` para gerar um arquivo chamado `storybook.requires.js`, porque o React Native ainda não suporta importações dinâmicas. Este arquivo é gerado quando você executa `yarn storybook` para iniciar o storybook ou `yarn storybook-generate` se desejar apenas gerar novamente o arquivo `storybook.requires.js`. Este arquivo é usado para carregar todas as histórias do projeto e também importar seus addons, sempre que você achar que uma história não está sendo carregada, você pode tentar regenerar este arquivo.

Agora vamos criar o componente de tarefa e o arquivo de história que o acompanha: `components/Task.jsx` e `components/Task.stories.jsx`.

Começaremos com uma implementação básica da `Tarefa`, simplesmente pegando os atributos que sabemos que precisaremos e as duas ações que você pode realizar em uma tarefa (para movê-la entre as listas):

```jsx:title=components/Task.jsx
import { StyleSheet, TextInput, View } from "react-native";
import { styles } from "./styles";

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TextInput value={title} editable={false} />
    </View>
  );
};
```

Agora adicione o arquivo da história:

```jsx:title=components/Task.stories.jsx
import { Task } from "./Task";

export default {
  title: "Task",
  component: Task,
  argTypes: {
    onPinTask: { action: "onPinTask" },
    onArchiveTask: { action: "onArchiveTask" },
  },
};

export const Default = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX"
    },
  },
};

export const Pinned = {
  args: { task: { ...Default.args.task, state: "TASK_PINNED" } },
};

export const Archived = {
  args: { task: { ...Default.args.task, state: "TASK_ARCHIVED" } },
};
```

Em nossos arquivos de histórias, usamos uma sintaxe chamada Component Story Format (CSF). Neste caso, estamos usando o CSF3, que é uma nova versão atualizada do CSF ​​compatível com as versões mais recentes do Storybook. Nesta versão do CSF, há muito menos clichê, o que facilita o início.

There are two basic levels of organization in Storybook: the component and its child stories. Think of each story as a permutation of a component. You can have as many stories per component as you need.

Existem dois níveis básicos de organização no Storybook: o componente e suas histórias filhas. Pense em cada história como uma permutação de um componente. Você pode ter quantas histórias por componente precisar.

- **Componente**
  - História
  - História
  - História

Para informar ao Storybook sobre o componente que estamos documentando, criamos uma exportação `padrão` que contém:

- `component` -- o próprio componente
- `title` -- como se referir ao componente na barra lateral do aplicativo Storybook
- `argTypes` -- nos permite especificar os tipos de nossos args, aqui usamos para definir ações que serão registradas sempre que essa interação ocorrer

Para definir nossas histórias, exportamos um objeto com uma propriedade `args`. Argumentos ou [`args`](https://storybook.js.org/docs/react/writing-stories/args) para abreviar, nos permitem editar ao vivo nossos componentes com o complemento de controles sem reiniciar o Storybook. Uma vez que um valor [`args`](https://storybook.js.org/docs/react/writing-stories/args) muda, o mesmo acontece com o componente.

Ao criar uma história, usamos um arg de `tarefa` base para criar a forma da tarefa que o componente espera. Normalmente modelado a partir da aparência dos dados reais. Novamente, `exportar` essa forma nos permitirá reutilizá-la em histórias posteriores, como veremos.

Agora que configuramos o básico, vamos reexecutar o `yarn storybook` e ver nossas alterações. Se você já tiver o Storybook em execução, também poderá executar `yarn storybook-generate` para gerar novamente o arquivo `storybook.requires.js`.

Você deve ver uma IU semelhante a esta:
![uma animação mostrando o componente task no storybook](/intro-to-storybook/react-native-task-component.gif)

Você pode usar a guia Barra lateral para alternar entre histórias, a aba Tela para ver a história atual e a aba complementos para interagir com argumentos e ações.

## Construir os estados

Agora podemos começar a construir nosso componente para combinar com os designs.

The component is still basic at the moment. First write the code that achieves the design without going into too much detail:

O componente ainda é básico no momento. Primeiro escreva o código que alcança o design sem entrar em muitos detalhes:

```jsx:title=components/Task.jsx
import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./styles";

export const Task = ({
  task: { id, title, state },
  onArchiveTask,
  onPinTask,
}) => {
  return (
    <View style={styles.listItem}>
      <TouchableOpacity onPress={() => onArchiveTask(id)}>
        {state !== "TASK_ARCHIVED" ? (
          <MaterialIcons
            name="check-box-outline-blank"
            size={24}
            color="#26c6da"
          />
        ) : (
          <MaterialIcons name="check-box" size={24} color="#26c6da" />
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Input Title"
        value={title}
        editable={false}
        style={
          state === "TASK_ARCHIVED"
            ? styles.listItemInputTaskArchived
            : styles.listItemInputTask
        }
      />
      <TouchableOpacity onPress={() => onPinTask(id)}>
        <MaterialIcons
          name="star"
          size={24}
          color={state !== "TASK_PINNED" ? "#eee" : "#26c6da"}
        />
      </TouchableOpacity>
    </View>
  );
};
```

Quando terminar, deve ficar assim:

![Uma imagem mostrando o componente task no storybook](/intro-to-storybook/react-native-task-component-completed.gif)

## Componente construído!

Agora construímos com sucesso um componente sem precisar de um servidor ou executar todo o aplicativo. A próxima etapa é criar os componentes restantes do Taskbox, um por um, de maneira semelhante.

Como você pode ver, começar a criar componentes isoladamente é fácil e rápido. Podemos esperar produzir uma IU de alta qualidade com menos bugs e mais polimento porque é possível aprofundar e testar todos os estados possíveis.

<div class="aside">
💡 Não se esqueça de confirmar suas alterações com o git!
</div>
