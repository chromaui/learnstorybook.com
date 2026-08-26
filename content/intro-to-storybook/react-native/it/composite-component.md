---
title: 'Assembla un componente composito'
tocTitle: 'Componente composito'
description: 'Assembla un componente composito da componenti più semplici'
---

Nell'ultimo capitolo, abbiamo costruito il nostro primo componente; questo capitolo estende ciò che abbiamo imparato per realizzare TaskList, una lista di Task. Uniamo insieme i componenti e vediamo cosa succede quando introduciamo più complessità.

## Tasklist

Taskbox enfatizza i task in evidenza posizionandoli sopra i task predefiniti. Questo produce due varianti di `TaskList` per cui devi creare delle storie: elementi predefiniti ed elementi predefiniti e in evidenza.

![task predefiniti e in evidenza](/intro-to-storybook/tasklist-states-1.png)

Poiché i dati di `Task` possono essere inviati in modo asincrono, abbiamo **anche** bisogno di uno stato di caricamento da renderizzare in assenza di una connessione. Inoltre, è necessario uno stato vuoto per quando non ci sono task.

![task vuoti e in caricamento](/intro-to-storybook/tasklist-states-2.png)

## Prepariamoci

Un componente composito non è molto diverso dai componenti di base che contiene. Crea un componente `TaskList` e un file di storia associato: `components/TaskList.jsx` e `components/TaskList.stories.jsx`.

Inizia con un'implementazione approssimativa di `TaskList`. Dovrai importare il componente `Task` di prima e passare gli attributi e le azioni come input.

```jsx:title=components/TaskList.jsx
import { Task } from './Task';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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

Successivamente, crea gli stati di test di `Tasklist` nel file di storia.

```jsx:title=components/TaskList.stories.jsx
import { TaskList } from './TaskList';
import { Default as TaskStory } from './Task.stories';
import { View } from 'react-native';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [
    (Story) => (
      <View style={{ padding: 42, flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.js.
    tasks: [
      { ...TaskStory.args.task, id: '1', title: 'Task 1' },
      { ...TaskStory.args.task, id: '2', title: 'Task 2' },
      { ...TaskStory.args.task, id: '3', title: 'Task 3' },
      { ...TaskStory.args.task, id: '4', title: 'Task 4' },
      { ...TaskStory.args.task, id: '5', title: 'Task 5' },
      { ...TaskStory.args.task, id: '6', title: 'Task 6' },
    ],
  },
};

export const WithPinnedTasks = {
  args: {
    tasks: [
      ...Default.args.tasks.slice(0, 5),
      { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
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

[**Decorators**](https://storybook.js.org/docs/react/writing-stories/decorators) sono un modo per fornire wrapper arbitrari alle storie. In questo caso stiamo usando un decorator per aggiungere del padding intorno alla lista, in modo da rendere più semplice la verifica visiva. Possono anche essere usati per avvolgere le storie in “provider” –cioè componenti di libreria che impostano il contesto React.

</div>

`TaskStory.args.task` fornisce la forma di un `Task` che abbiamo creato ed esportato dal file `Task.stories.js`. Allo stesso modo, gli `argTypes` che abbiamo aggiunto per `onPinTask` e `onArchiveTask` indicano a Storybook di fornire delle azioni (callback simulate) di cui il componente `TaskList` ha bisogno.

Se non vedi subito la nuova storia, prova a ricaricare l'app. Se questo non funziona, puoi rieseguire `yarn storybook-generate` per rigenerare il file `storybook.requires`.

Ora controlla Storybook per le nuove storie di `TaskList`.

![una gif che mostra il componente task list in storybook](/intro-to-storybook/react-native-tasklist.gif)

## Sviluppa gli stati

Il nostro componente è ancora grezzo, ma ora abbiamo un'idea delle storie a cui puntare. Potresti pensare che il wrapper `listitems` sia eccessivamente semplicistico. Hai ragione – nella maggior parte dei casi non creeremmo un nuovo componente solo per aggiungere un wrapper. Ma la **complessità reale** del componente `TaskList` è rivelata nei casi limite `withPinnedTasks`, `loading` ed `empty`.

Per il caso di caricamento, creeremo un nuovo componente che mostrerà l'animazione di caricamento.

Crea un nuovo file chiamato `LoadingRow.jsx` con il seguente contenuto:

```jsx:title=components/LoadingRow.jsx
import { useState, useEffect } from 'react';
import { Animated, Text, View, Easing, StyleSheet } from 'react-native';
import { styles } from './styles';

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

E aggiorna `TaskList.jsx` come segue:

```jsx:title=components/TaskList.jsx
import { Task } from './Task';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LoadingRow } from './LoadingRow';
import { MaterialIcons } from '@expo/vector-icons';
import { styles } from './styles';

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
    ...tasks.filter((t) => t.state === 'TASK_PINNED'),
    ...tasks.filter((t) => t.state !== 'TASK_PINNED'),
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

Queste modifiche producono la seguente UI:

![TaskList con stato di caricamento](/intro-to-storybook/react-native-tasklist-completed.gif)

Ottimo! Abbiamo realizzato quello che ci eravamo proposti di fare. Se controlliamo la nostra UI aggiornata, possiamo notare rapidamente che i nostri task in evidenza sono ora visualizzati in cima alla lista, in linea con il design previsto. Nei prossimi capitoli, amplieremo quanto imparato e continueremo ad aggiungere complessità alla nostra applicazione applicando questi principi a UI più complesse.

<div class="aside">
💡 Non dimenticare di committare le tue modifiche con git!
</div>
