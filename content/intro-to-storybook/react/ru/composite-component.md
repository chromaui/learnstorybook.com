---
title: 'Создание составного компонента'
tocTitle: 'Составной компонент'
description: 'Создание составного компонента из простых компонентов'
commit: '73d7821'
---

В прошлой главе мы создали наш первый компонент; в этой главе мы расширим полученные знания, чтобы создать компонент `TaskList` - список задач. Давайте объединим компоненты вместе и посмотрим, что произойдет, когда мы добавим больше сложности.

## Компонент TaskList

`Taskbox` выделяет закреплённые задачи, размещая их над обычными задачами. Это даёт два варианта отображения компонента `TaskList`, для которых нужно создавать истории: обычный и с закреплёнными элементами.

![обычные and закреплённые задачи](/intro-to-storybook/tasklist-states-1.png)

Поскольку данные для `Task` могут быть отправлены асинхронно, нам **также** необходимо состояние загрузки для рендеринга в отсутствие соединения. Кроме того, нам нужно пустое состояние, когда нет задач.

![состояния когда нет задач и когда задачи загружаются](/intro-to-storybook/tasklist-states-2.png)

## Начинаем подготовку

Составной компонент мало чем отличается от простых компонентов, которые он содержит. Создайте компонент `TaskList` и сопроводительный файл историй: `src/components/TaskList.js` и `src/components/TaskList.stories.js`.

Начните с грубой реализации `TaskList`. Вам нужно будет импортировать компонент `Task` и передать атрибуты и действия в качестве входных данных.

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };

  if (loading) {
    return <div className="list-items">loading</div>;
  }

  if (tasks.length === 0) {
    return <div className="list-items">empty</div>;
  }

  return (
    <div className="list-items">
      {tasks.map(task => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Затем создайте тестовые состояния `TaskList` в файле истории.

```js:title=src/components/TaskList.stories.js
import React from 'react';

import TaskList from './TaskList';
import * as TaskStories from './Task.stories';

export default {
  component: TaskList,
  title: 'TaskList',
  decorators: [story => <div style={{ padding: '3rem' }}>{story()}</div>],
};

const Template = args => <TaskList {...args} />;

export const Default = Template.bind({});
Default.args = {
  // Shaping the stories through args composition.
  // The data was inherited from the Default story in Task.stories.js.
  tasks: [
    { ...TaskStories.Default.args.task, id: '1', title: 'Task 1' },
    { ...TaskStories.Default.args.task, id: '2', title: 'Task 2' },
    { ...TaskStories.Default.args.task, id: '3', title: 'Task 3' },
    { ...TaskStories.Default.args.task, id: '4', title: 'Task 4' },
    { ...TaskStories.Default.args.task, id: '5', title: 'Task 5' },
    { ...TaskStories.Default.args.task, id: '6', title: 'Task 6' },
  ],
};

export const WithPinnedTasks = Template.bind({});
WithPinnedTasks.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Default story.
  tasks: [
    ...Default.args.tasks.slice(0, 5),
    { id: '6', title: 'Task 6 (pinned)', state: 'TASK_PINNED' },
  ],
};

export const Loading = Template.bind({});
Loading.args = {
  tasks: [],
  loading: true,
};

export const Empty = Template.bind({});
Empty.args = {
  // Shaping the stories through args composition.
  // Inherited data coming from the Loading story.
  ...Loading.args,
  loading: false,
};
```

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/writing-stories/decorators"><b>Декораторы</b></a> это способ создания произвольных обёрток для историй. В данном случае мы используем декоратор для того, чтобы добавить <code>padding</code> вокруг отрисованного компонента. Их также можно использовать для обёртывания историй в "провайдеры" - т.е. библиотечные компоненты, которые устанавливают контекст React.
</div>

Импортировав `TaskStories`, мы смогли [составить](https://storybook.js.org/docs/react/writing-stories/args#args-composition) аргументы (сокращенно args) в наших историях с минимальными усилиями. Таким образом, данные и действия (замоканные коллбеки), ожидаемые обоими компонентами, сохраняются.

Теперь давайте проверим Storybook на наличие новых историй для `TaskList`.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Реализуем состояния

Наш компонент все ещё сырой, но теперь у нас есть представление о том, над чем нужно работать. Вы можете подумать, что обёртка `.list-items` слишком упрощена. Вы правы - в большинстве случаев мы не стали бы создавать новый компонент только для того, чтобы добавить обёртку. Но **реальная сложность** компонента `TaskList` проявляется в граничных случаях `withPinnedTasks`, `load` и `empty`.

```js:title=src/components/TaskList.js
import React from 'react';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  const events = {
    onPinTask,
    onArchiveTask,
  };
  const LoadingRow = (
    <div className="loading-item">
      <span className="glow-checkbox" />
      <span className="glow-text">
        <span>Loading</span> <span>cool</span> <span>state</span>
      </span>
    </div>
  );
  if (loading) {
    return (
      <div className="list-items" data-testid="loading" key={"loading"}>
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
        {LoadingRow}
      </div>
    );
  }
  if (tasks.length === 0) {
    return (
      <div className="list-items" key={"empty"} data-testid="empty">
        <div className="wrapper-message">
          <span className="icon-check" />
          <p className="title-message">You have no tasks</p>
          <p className="subtitle-message">Sit back and relax</p>
        </div>
      </div>
    );
  }

  const tasksInOrder = [
    ...tasks.filter((t) => t.state === "TASK_PINNED"),
    ...tasks.filter((t) => t.state !== "TASK_PINNED"),
  ];
  return (
    <div className="list-items">
      {tasksInOrder.map((task) => (
        <Task key={task.id} task={task} {...events} />
      ))}
    </div>
  );
}
```

Результат добавленной разметки следующий:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-tasklist-states-6-0.mp4"
    type="video/mp4"
  />
</video>

Обратите внимание на положение закреплённого элемента в списке. Мы хотим, чтобы закреплённый элемент отображался в верхней части списка, чтобы сделать его приоритетным для наших пользователей.

## Требования к данным и свойствам

По мере роста компонента растут и входные требования. Определите требования к свойствам `TaskList`. Поскольку `Task` является дочерним компонентом, убедитесь, что данные имеют соответствующую структуру для его рендеринга. Чтобы сэкономить время и головную боль, повторно используйте `propTypes`, которые вы определили в `Task` ранее.

```diff:title=src/components/TaskList.js
import React from 'react';
+ import PropTypes from 'prop-types';

import Task from './Task';

export default function TaskList({ loading, tasks, onPinTask, onArchiveTask }) {
  ...
}

+ TaskList.propTypes = {
+  /** Checks if it's in loading state */
+  loading: PropTypes.bool,
+  /** The list of tasks */
+  tasks: PropTypes.arrayOf(Task.propTypes.task).isRequired,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+ };
+ TaskList.defaultProps = {
+  loading: false,
+ };
```

<div class="aside">
💡 Не забудьте зафиксировать свои изменения с помощью git!
</div>
