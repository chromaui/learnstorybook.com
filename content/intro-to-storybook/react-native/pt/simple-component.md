---
title: 'Crie um componente simples'
tocTitle: 'Componente Simples'
description: 'Crie um componente simples isoladamente'
---

Construiremos nossa interface do usuário seguindo uma metodologia de Desenvolvimento Orientado a Componentes [Component-Driven Development](https://www.componentdriven.org/) (CDD). É um processo que constrói UIs de "baixo para cima", começando com componentes e terminando com telas. O CDD nos ajuda a dimensionar a quantidade de complexidade que você enfrenta ao criar a interface do usuário.

## Tarefa

![Componente de tarefas em três estados](/intro-to-storybook/task-states-learnstorybook.png)

`Task` é o componente principal em nosso aplicativo. Cada tarefa é exibida de maneira ligeiramente diferente, dependendo exatamente do estado em que está. Exibimos uma caixa de seleção marcada (ou desmarcada), algumas informações sobre a tarefa e um botão "fixar", permitindo mover as tarefas para cima e para baixo na lista. Juntando tudo isso, vamos precisar dessas propriedades:

- `title` – uma string que descreve a tarefa
- `state` - em qual lista está a tarefa atualmente e ela está marcada?

Quando começamos a construir `Task`, primeiro escrevemos nossos estados de teste que correspondem aos diferentes tipos de tarefas esboçadas acima. Em seguida, usamos o Storybook para construir o componente isoladamente usando dados fictícios. Faremos um “teste visual” da aparência do componente em cada estado à medida que avançamos.

Esse processo é semelhante ao [desenvolvimento orientado a testes](https://en.wikipedia.org/wiki/Test-driven_development) (TDD) que podemos chamar de "[Visual TDD](https://www.chromatic.com/blog/how-to-run-visual-regression-tests-in-2023/)”.

## Preparação

Vamos abrir `.storybook/main.js` e dar uma olhada

```js:title=.storybook/main.js
module.exports = {
  stories: ['../components/**/*.stories.?(ts|tsx|js|jsx)'],
  addons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
};
```

Se você verificar a propriedade `stories`, verá que o Storybook está procurando histórias na pasta de `components`.

Devido a algumas limitações técnicas do bundler Metro e do Storybook para React Native, vamos recorrer ao nosso ficheiro de configuração `main.js` para gerar um ficheiro chamado `storybook.requires`. Este ficheiro é usado para carregar todas as histórias e addons no nosso projecto e gerado automaticamente quando executamos `yarn storybook` para iniciar o Storybook.

<div class="aside">

💡 O ficheiro `storybook.requires` pode ser gerado manualmente através do comando `yarn storybook-generate`. No entanto, na maioria das vezes não será necessário criá-lo novamente, a não ser que uma história, ou configuração feita no ficheiro `main.js` não seja detectada pelo Storybook. Para saber mais como este ficheiro é gerado, consulte a função `generate` no ficheiro `metro.config.js`.

</div>

Agora vamos criar o componente de tarefa e o arquivo de história que o acompanha: `components/Task.jsx` e `components/Task.stories.jsx`.

Começaremos com uma implementação básica da `Task`, simplesmente pegando os atributos que sabemos que precisaremos e as duas ações que você pode realizar em uma tarefa (para movê-la entre as listas):

```jsx:title=components/Task.jsx
import { StyleSheet, TextInput, View } from 'react-native';
import { styles } from './styles';

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
import { Task } from './Task';

export default {
  title: 'Task',
  component: Task,
  argTypes: {
    onPinTask: { action: 'onPinTask' },
    onArchiveTask: { action: 'onArchiveTask' },
  },
};

export const Default = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
    },
  },
};

export const Pinned = {
  args: { task: { ...Default.args.task, state: 'TASK_PINNED' } },
};

export const Archived = {
  args: { task: { ...Default.args.task, state: 'TASK_ARCHIVED' } },
};
```

Para os nossos arquivos de histórias, usamos uma sintaxe chamada Component Story Format (CSF). Neste caso, CSF3, que é uma versão mais recente do CSF suportada pelas versões mais recentes do Storybook. Esta versão do CSF permite que você escreva histórias em um formato mais conciso e legível, o que é ótimo para iniciantes.

Existem dois níveis básicos de organização no Storybook: o componente e suas histórias filhas. Pense em cada história como uma permutação de um componente. Você pode ter quantas histórias por componente precisar.

- **Componente**
  - História
  - História
  - História

De forma a informar o Storybook acerca do componente que está a ser documentado, é criado um `default export` que contém:

- `component` -- o próprio componente
- `title` -- como se referir ao componente na barra lateral do aplicativo Storybook
- `argTypes` -- nos permite especificar os tipos de nossos args, aqui usamos para definir ações que serão registradas sempre que essa interação ocorrer

Para definir nossas histórias, exportamos um objeto com uma propriedade `args`. Argumentos ou [`args`](https://storybook.js.org/docs/react/writing-stories/args) para abreviar, nos permitem editar ao vivo nossos componentes com o addon controls sem reiniciar o Storybook. Cada vez que um valor [`args`](https://storybook.js.org/docs/react/writing-stories/args) muda, o mesmo acontece com o componente.

Ao criar uma história, estamos a usar um arg de base `task` para definir o formato de tarefa que o componente necessita. Este, normalmente modelado a partir de dados reais. Uma vez mais, ao exportarmos os dados na nossa história, podemos reutilizá-los em histórias futuras, como veremos.

Agora que configuramos o básico, vamos reexecutar o comando `yarn storybook` e ver as nossas alterações. Se você já tiver o Storybook em execução, também poderá executar `yarn storybook-generate` para gerar novamente o arquivo `storybook.requires`.

Você deve ver uma IU semelhante a esta:
![uma animação mostrando o componente task no storybook](/intro-to-storybook/react-native-task-component.gif)

Você pode usar a aba "Sidebar" para alternar ente as histórias, a aba "Canvas" para ver a história atual e a aba "Addons" para interagir com os args e actions.

## Construir os estados

Agora podemos começar a construir nosso componente para combinar com os designs.

Neste momento, o componente ainda está básico. Vamos começar por fazer algumas alterações de forma a atingir o design pretendido, sem que entremos em muitos detalhes:

```jsx:title=components/Task.jsx
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

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

Como você pode ver, começar a criar componentes isoladamente é fácil e rápido. Podemos garantir a construção de uma IU de alta qualidade com menos bugs e bastante polida, visto que podemos aprofundar e testar todos os estados possíveis.

<div class="aside">
💡 Não se esqueça de confirmar suas alterações com o git!
</div>
