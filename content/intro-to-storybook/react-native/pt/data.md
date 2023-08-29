---
title: 'Conectar dados'
tocTitle: 'Dados'
description: 'Aprenda como conectar dados ao seu componente de UI'
---

Até agora, criamos componentes sem estado isolados – ótimos para o Storybook, mas, em última análise, não são úteis até fornecermos a eles alguns dados em nosso aplicativo.

Este tutorial não tem foco nos detalhes da criação de um aplicativo, então não vamos nos aprofundar nesses detalhes aqui. Mas vamos dedicar um momento para examinar um padrão comum de possibilitar dados em componentes conectados.

## Componentes conectados

Atualmente o nosso componente `TaskList`, conforme escrito, é “apresentativo” no sentido de que não fala com nada externo à sua própria implementação. Precisamos conectá-lo a um provedor de dados para obter dados nele.

Este exemplo usa o [Redux Toolkit](https://redux-toolkit.js.org/), o conjunto de ferramentas mais eficaz para desenvolver aplicativos para armazenar dados com [Redux](https://redux.js.org/), para criar um modelo de dados simples para nosso aplicativo. No entanto, o padrão usado aqui também se aplica a outras bibliotecas de gerenciamento de dados, como [Apollo](https://www.apollographql.com/client/) e [MobX](https://mobx.js.org/).

Adicione as dependências necessárias ao seu projeto com:

```shell
yarn add @reduxjs/toolkit react-redux
```

Primeiro, construiremos uma store Redux simples que responde a ações que alteram o estado da tarefa em um arquivo chamado `store.js` na raiz do nosso projeto.

```js:title=store.js
/* A simple redux store/actions/reducer implementation.
 * A true app would be more complex and separated into different files.
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';

/*
 * The initial state of our store when the app loads.
 * Usually, you would fetch this from a server. Let's not worry about that now
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];
const TaskBoxData = {
  tasks: defaultTasks,
  status: 'idle',
  error: null,
};

/*
 * The store is created here.
 * You can read more about Redux Toolkit's slices in the docs:
 * https://redux-toolkit.js.org/api/createSlice
 */
const TasksSlice = createSlice({
  name: 'taskbox',
  initialState: TaskBoxData,
  reducers: {
    updateTaskState: (state, action) => {
      const { id, newTaskState } = action.payload;
      const task = state.tasks.findIndex((task) => task.id === id);
      if (task >= 0) {
        state.tasks[task].state = newTaskState;
      }
    },
  },
});

// The actions contained in the slice are exported for usage in our components
export const { updateTaskState } = TasksSlice.actions;

/*
 * Our app's store configuration goes here.
 * Read more about Redux's configureStore in the docs:
 * https://redux-toolkit.js.org/api/configureStore
 */
const store = configureStore({
  reducer: {
    taskbox: TasksSlice.reducer,
  },
});

export default store;
```

Em seguida, atualizaremos nosso componente `TaskList` para conectar-se à store Redux e renderizar as tarefas nas quais estamos interessados:

```js:title=components/TaskList.jsx
import { Task } from "./Task";
import { FlatList, Text, View } from "react-native";
import { LoadingRow } from "./LoadingRow";
import { MaterialIcons } from "@expo/vector-icons";
import { styles } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { updateTaskState } from "../store";

export const TaskList = () => {
  // We're retrieving our state from the store
  const tasks = useSelector((state) => {
    const tasksInOrder = [
      ...state.taskbox.tasks.filter((t) => t.state === "TASK_PINNED"),
      ...state.taskbox.tasks.filter((t) => t.state !== "TASK_PINNED"),
    ];
    const filteredTasks = tasksInOrder.filter(
      (t) => t.state === "TASK_INBOX" || t.state === "TASK_PINNED"
    );
    return filteredTasks;
  });

  const { status } = useSelector((state) => state.taskbox);

  const dispatch = useDispatch();

  const pinTask = (value) => {
    // We're dispatching the Pinned event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_PINNED" }));
  };

  const archiveTask = (value) => {
    // We're dispatching the Archive event back to our store
    dispatch(updateTaskState({ id: value, newTaskState: "TASK_ARCHIVED" }));
  };

  if (status === "loading") {
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

  return (
    <View style={styles.listItems}>
      <FlatList
        data={tasks}
        keyExtractor={(task) => task.id}
        renderItem={({ item }) => (
          <Task
            key={item.id}
            task={item}
            onPinTask={(task) => pinTask(task)}
            onArchiveTask={(task) => archiveTask(task)}
          />
        )}
      />
    </View>
  );
};

```

Agora que temos alguns dados reais preenchendo nosso componente, obtidos na store Redux, poderíamos ter conectado nosso aplicativo `App.jsx` e renderizado o componente lá. Mas, por enquanto, vamos adiar isso e continuar nossa jornada orientada a componentes.

## Fornecendo contexto com decoradores

Nossas histórias do Storybook pararam de funcionar com essa mudança porque nossa `Tasklist` agora é um componente conectado, pois depende de uma store Redux para recuperar e atualizar nossas tarefas.

<img src="/intro-to-storybook/react-native-broken-tasklist.png" alt="error screen" height="600">

Podemos usar várias abordagens para resolver esse problema. Ainda assim, como nosso aplicativo é bastante simples, podemos contar com um decorador, semelhante ao que fizemos no [capítulo anterior](/intro-to-storybook/react-native/en/composite-component), e fornecer uma store mocada – em nossas histórias do Storybook:

```js:title=src/components/TaskList.stories.jsx
import { TaskList } from "./TaskList";
import { Default as TaskStory } from "./Task.stories";
import { View } from "react-native";
import { Provider } from "react-redux";

import { configureStore, createSlice } from "@reduxjs/toolkit";

// A super-simple mock of the state of the store
const MockedState = {
  tasks: [
    { ...TaskStory.args.task, id: "1", title: "Task 1" },
    { ...TaskStory.args.task, id: "2", title: "Task 2" },
    { ...TaskStory.args.task, id: "3", title: "Task 3" },
    { ...TaskStory.args.task, id: "4", title: "Task 4" },
    { ...TaskStory.args.task, id: "5", title: "Task 5" },
    { ...TaskStory.args.task, id: "6", title: "Task 6" },
  ],
  status: "idle",
  error: null,
};

// A super-simple mock of a redux store
const Mockstore = ({ taskboxState, children }) => (
  <Provider
    store={configureStore({
      reducer: {
        taskbox: createSlice({
          name: "taskbox",
          initialState: taskboxState,
          reducers: {
            updateTaskState: (state, action) => {
              const { id, newTaskState } = action.payload;
              const task = state.tasks.findIndex((task) => task.id === id);
              if (task >= 0) {
                state.tasks[task].state = newTaskState;
              }
            },
          },
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

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
  decorators: [
    (story) => <Mockstore taskboxState={MockedState}>{story()}</Mockstore>,
  ],
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
  decorators: [
    (story) => {
      const pinnedtasks = [
        ...MockedState.tasks.slice(0, 5),
        { id: "6", title: "Task 6 (pinned)", state: "TASK_PINNED" },
      ];

      return (
        <Mockstore
          taskboxState={{
            ...MockedState,
            tasks: pinnedtasks,
          }}
        >
          {story()}
        </Mockstore>
      );
    },
  ],
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
  decorators: [
    (story) => (
      <Mockstore
        taskboxState={{
          ...MockedState,
          status: "loading",
        }}
      >
        {story()}
      </Mockstore>
    ),
  ],
  args: {
    tasks: [],
    loading: true,
  },
};

export const Empty = {
  decorators: [
    (story) => (
      <Mockstore
        taskboxState={{
          ...MockedState,
          tasks: [],
        }}
      >
        {story()}
      </Mockstore>
    ),
  ],
  args: {
    // Shaping the stories through args composition.
    // Inherited data coming from the Loading story.
    ...Loading.args,
    loading: false,
  },
};
```

<div class="aside">
💡 Não se esqueça de confirmar suas alterações com o git!
</div>

Sucesso! Estamos exatamente onde começamos, nosso Storybook agora está funcionando e podemos ver como poderíamos fornecer dados a um componente conectado.

![Components TaskList](/intro-to-storybook/react-native-finished-tasklist-states.gif)
