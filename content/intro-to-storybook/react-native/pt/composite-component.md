---
title: 'Montar um componente composto'
tocTitle: 'Componente Composto'
description: 'Montar um componente composto a partir de componentes mais simples'
---

No capítulo anterior, construímos nosso primeiro componente; este capítulo extende o que aprendemos para construir ListaTarefas, uma lista de tarefas. Vamos combinar componentes e ver o que acontece quando mais complexidade é introduzida.

## Lista de tarefas

A caixa de tarefas enfatiza as tarefas fixadas, posicionando-as acima das tarefas padrão. Isso produz duas variações de `TaskList` para as quais você precisa criar histórias: itens padrão e itens padrão e fixados.

![tarefas padrão e fixadas](/intro-to-storybook/tasklist-states-1.png)

Como os dados da `Task` podem ser enviados de forma assíncrona, **também** precisamos de um estado de carregamento para renderizar na ausência de uma conexão. Além disso, um estado vazio é necessário quando não há tarefas.

![Tarefas vazias e carregando](/intro-to-storybook/tasklist-states-2.png)

## Prepare-se

Um componente composto não é muito diferente do que contém os componentes básicos. Crie um componente `TaskList` e um arquivo de história em conjunto: `components/TaskList.jsx` e `components/TaskList.stories.jsx`.

Comece com uma implementação aproximada da `TaskList`. Você precisará importar o componente `Task` anterior e passar os atributos e ações como entradas.

```jsx:title=components/TaskList.jsx
import { Task } from "./Task";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { styles } from './styles';

export const TaskList = ({ loading, tasks, onPinTask, onArchiveTask }) => {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <View style={styles.listItems}>
        <Text>loading</Text>
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.listItems}>
        <Text>empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.listItems}>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <Task key={item.id} task={item} {...events} />
        )}
      />
    </View>
  );
};
```

Em seguida, crie os estados de teste da `Tasklist` no arquivo da história.

```jsx:title=components/TaskList.stories.jsx
import { TaskList } from "./TaskList";
import { Default as TaskStory } from "./Task.stories";
import { View } from "react-native";

export default {
  component: TaskList,
  title: "TaskList",
  decorators: [
    (Story) => (
      <View style={{ padding: 42, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    onPinTask: { action: "onPinTask" },
    onArchiveTask: { action: "onArchiveTask" },
  },
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.js.
    tasks: [
      { ...TaskStory.args.task, id: "1", title: "Task 1" },
      { ...TaskStory.args.task, id: "2", title: "Task 2" },
      { ...TaskStory.args.task, id: "3", title: "Task 3" },
      { ...TaskStory.args.task, id: "4", title: "Task 4" },
      { ...TaskStory.args.task, id: "5", title: "Task 5" },
      { ...TaskStory.args.task, id: "6", title: "Task 6" },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Default story.
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" },
    ],
  },
};

export const Loading = {
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
Os <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Decoradores</b></a> são uma maneira de fornecer wrappers arbitrários para as histórias. Neste caso, estamos usando um decorador para adicionar preenchimento ao redor da lista para facilitar a verificação visual. Eles também podem ser usados ​​para agrupar histórias em “provedores” – ou seja, componentes da biblioteca que definem o contexto do React.
</div>

`TaskStory.args.task` fornece a forma de uma `Task` que criamos e exportamos do arquivo `Task.stories.js`. Da mesma forma, os `argTypes` que adicionamos para `onPinTask` e `onArchiveTask` dizem ao Storybook para fornecer ações (callbacks simulados) que o componente `TaskList` precisa.

Como adicionamos um novo arquivo Story, precisamos executar `yarn storybook-generate` novamente para gerar novamente o arquivo `storybook.require.js`.

Agora verifique o Storybook para as novas histórias da `TaskList`.

![Uma imagem mostrando o componente task list component no storybook](/intro-to-storybook/react-native-tasklist.gif)

## Construir os estados

Nosso componente ainda é bruto, mas agora temos uma ideia das histórias para trabalhar. Você pode estar pensando que o wrapper `listitems` é muito simplista. Você está certo - na maioria dos casos, não criaríamos um novo componente apenas para adicionar um wrapper. Mas a **complexidade real** do componente `TaskList` é revelada nos casos extremos `withPinnedTasks`, `loading` e `empty`.

Para o caso de carregamento, vamos criar um novo componente que exibirá a animação de carregamento.

Crie um novo arquivo chamado `LoadingRow.jsx` com o seguinte conteúdo:

```jsx:title=components/LoadingRow.jsx
import { useState, useEffect } from "react";
import { Animated, Text, View, Easing, StyleSheet } from "react-native";
import { styles } from "./styles";

const GlowView = ({ style, children }) => {
  const [glowAnim] = useState(new Animated.Value(0.3));

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        ...style,
        opacity: glowAnim,
      }}
    >
      {children}
    </Animated.View>
  );
};

export const LoadingRow = () => (
  <View style={styles.container}>
    <GlowView>
      <View style={styles.loadingItem}>
        <View style={styles.glowCheckbox} />
        <Text style={styles.glowText}>Loading</Text>
        <Text style={styles.glowText}>cool</Text>
        <Text style={styles.glowText}>state</Text>
      </View>
    </GlowView>
  </View>
);
```

E atualize `TaskList.jsx` dessa forma:

```jsx:title=components/TaskList.jsx
import { Task } from "./Task";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { LoadingRow } from "./LoadingRow";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from './styles'

export const TaskList = ({ loading, tasks, onPinTask, onArchiveTask }) => {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return (
      <View style={[styles.listItems, { justifyContent: "center" }]}>
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
        <LoadingRow />
      </View>
    );
  }

  if (tasks.length === 0) {
    return (
      <View style={styles.listItems}>
        <View style={styles.wrapperMessage}>
          <MaterialIcons name="check" size={64} color={"#2cc5d2"} />
          <Text style={styles.titleMessage}>You have no tasks</Text>
          <Text style={styles.subtitleMessage}>Sit back and relax</Text>
        </View>
      </View>
    );
  }

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <View style={styles.listItems}>
      <FlatList
        data={tasksInOrder}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <Task key={item.id} task={item} {...events} />
        )}
      />
    </View>
  );
};
```

Essas alterações resultam na seguinte IU:

![ListaTarefas com estado de carregamento](/intro-to-storybook/react-native-tasklist-completed.gif)

Sucesso! Nós realizamos o que nos propusemos a fazer. Se verificarmos nossa IU atualizada, podemos ver rapidamente que nossas tarefas fixas agora estão no topo da lista, correspondendo ao design pretendido. Nos capítulos seguintes, expandiremos o que aprendemos e continuaremos adicionando complexidade ao nosso aplicativo aplicando esses princípios a UIs mais complexas.

<div class="aside">
💡 Não se esqueça de confirmar suas alterações com o git!
</div>
