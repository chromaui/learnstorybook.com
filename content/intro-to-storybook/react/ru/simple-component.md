---
title: 'Создание простого компонента'
tocTitle: 'Простой компонент'
description: 'Создание простого компонента в изоляции'
commit: 'efa06ff'
---

Мы создадим наш пользовательский интерфейс, следуя методологии [Component-Driven Development](https://www.componentdriven.org/) (CDD). Это процесс, при котором пользовательский интерфейс создается «снизу вверх», начиная с компонентов и заканчивая экранами. CDD помогает вам масштабировать уровень сложности, с которым вы сталкиваетесь при создании пользовательского интерфейса.

## Task

![Компонент Task в трех состояниях](/intro-to-storybook/task-states-learnstorybook.png)

`Task` это основной компонент нашего приложения. Каждая задача отображается по-разному в зависимости от того, в каком именно состоянии она находится. Мы отображаем отмеченным (или не отмеченным) чекбокс, некоторую информацию о задаче и кнопку "прикрепить", позволяющую перемещать задачи вверх и вниз по списку. Чтобы собрать всё это вместе, нам понадобятся следующие параметры:

- `title` – строка, описывающая задачу
- `state` – в каком списке находится задание в данный момент, и отмечено ли оно?

Начиная создавать компонент `Task`, мы сначала пишем наши тестовые состояния, которые соответствуют различным типам задач, описанным выше. Затем мы используем Storybook для создания компонента в изоляции с использованием замоканных данных. Мы будем вручную тестировать внешний вид компонента в каждом состоянии по ходу работы.

## Начинаем подготовку

Сначала создадим компонент `Task` и сопровождающий его файл истории: `src/components/Task.js` and `src/components/Task.stories.js`.

Мы начнём с базовой реализации `Task`, просто взяв атрибуты, которые нам понадобятся, и два действия, которые можно выполнить над задачей (чтобы переместить её между списками):

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <label htmlFor="title" aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" />
      </label>
    </div>
  );
}
```

Выше мы сделали разметку для `Task` на основе существующей HTML-структуры приложения Todos.

Ниже мы создадим три тестовых состояния `Task` в файле истории:

```js:title=src/components/Task.stories.js
import React from 'react';

import Task from './Task';

export default {
  component: Task,
  title: 'Task',
};

const Template = args => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
  },
};

export const Pinned = Template.bind({});
Pinned.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
  task: {
    ...Default.args.task,
    state: 'TASK_ARCHIVED',
  },
};
```

В Storybook есть два основных уровня организации: компонент и его дочерние истории. Считайте, что каждая история – это один из вариантов компонента. Вы можете иметь столько историй на компонент, сколько вам нужно.

- **Component**
  - Story
  - Story
  - Story

Чтобы рассказать Storybook о компоненте, который мы документируем, мы создаем экспорт по умолчанию (`export default`), который содержит:

- `component` – сам компонент
- `title` – как ссылаться на компонент в боковой панели Storybook

Чтобы определить наши истории, мы экспортируем функцию для каждого из наших тестовых состояний для создания истории. История – это функция, которая возвращает отрендеренный элемент (т.е. компонент с набором параметров) в данном состоянии – точно так же, как [Functional Component](https://ru.reactjs.org/docs/components-and-props.html#function-and-class-components).

Поскольку у нас есть несколько вариантов нашего компонента, удобно присвоить его переменной Template. Внедрение этого паттерна в ваши истории сократит количество кода, который вам нужно писать и поддерживать.

<div class="aside">
💡 <code>Template.bind({})</code> это <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Function/bind">стандартный способ JavaScript</a> для создания копии функции. Мы используем этот способ, чтобы позволить каждой экспортируемой истории устанавливать свои собственные свойства, но использовать одну и ту же реализацию.
</div>

Аргументы или кратко [`args`](https://storybook.js.org/docs/react/writing-stories/args), позволят нам редактировать наши компоненты в реальном времени с помощью аддона `controls` без перезапуска Storybook. Как только значение [`args`](https://storybook.js.org/docs/react/writing-stories/args) изменяется, изменяется и компонент.

При создании истории мы используем базовый аргумент `task` для построения структуры задачи, которую ожидает компонент. Обычно она моделируется на основе того, как выглядят фактические данные. Опять же, экпортирование этой структуры позволит нам повторно использовать её в последующих историях, как мы увидим.

<div class="aside">
💡 <a href="https://storybook.js.org/docs/react/essentials/actions"><b>Actions</b></a> помогут вам проверить взаимодействие при изолированном создании компонентов пользовательского интерфейса. Зачастую у вас не будет доступа к функциям и состояниям, которые есть в контексте приложения. Используйте <code>action()</code>, чтобы сымитировать их.
</div>

## Конфигурация

Нам потребуется внести пару изменений в конфигурационные файлы Storybook, чтобы он обнаруживал не только наши недавно созданные истории, но и позволил нам использовать CSS-файл приложения (расположенный в `src/index.css`).

Начните с изменения конфигурационного файла Storybook (`.storybook/main.js`) на следующий:

```diff:title=.storybook/main.js
module.exports = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
```

После выполнения вышеуказанных изменений, внутри папки `.storybook` внесите следующие изменения в файл `preview.js`:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

[`parameters`](https://storybook.js.org/docs/react/writing-stories/parameters) обычно используются для управления поведением функций и аддонов Storybook. В нашем случае мы будем использовать их для настройки того, как будут обрабатываться `actions` (замоканные функции).

`actions` позволяет нам создавать коллбэки, которые появляются на панели **actions** пользовательского интерфейса Storybook при нажатии на кнопку. Таким образом, когда мы создадим кнопку `pin`, мы сможем определить, было ли нажатие кнопки успешным в пользовательском интерфейсе.

После этого перезапуск Storybook должен привести к появлению тестовых примеров для трех состояний задачи:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Реализуем состояния

Теперь, когда Storybook настроен, стили импортированы, а тестовые примеры созданы, мы можем быстро приступить к реализации HTML компонента в соответствии с дизайном.

На данный момент этот компонент всё ещё находится в зачаточном состоянии. Сначала напишите код, который соответствует дизайну, не вдаваясь в излишние подробности:

```js:title=src/components/Task.js
import React from 'react';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor="checked"
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor="title" aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          placeholder="Input title"
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

Дополнительная разметка сверху в сочетании с CSS, который мы импортировали ранее, даёт следующий пользовательский интерфейс:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-6-0.mp4"
    type="video/mp4"
  />
</video>

## Определяем требования к данным

Лучшей практикой является использование `propTypes` в React для указания структуры данных, которые ожидает компонент. Это не только самодокументирование, но и помогает выявить проблемы на ранней стадии.

```diff:title=src/components/Task.js
import React from 'react';
+ import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  // ...
}

+ Task.propTypes = {
+  /** Composition of the task */
+  task: PropTypes.shape({
+    /** Id of the task */
+    id: PropTypes.string.isRequired,
+    /** Title of the task */
+    title: PropTypes.string.isRequired,
+    /** Current state of the task */
+    state: PropTypes.string.isRequired,
+  }),
+  /** Event to change the task to archived */
+  onArchiveTask: PropTypes.func,
+  /** Event to change the task to pinned */
+  onPinTask: PropTypes.func,
+ };
```

Теперь при неправильном использовании компонента Task в режиме разработки будет появляться предупреждение.

<div class="aside">
💡 Альтернативным способом достижения той же цели является использование системы типов JavaScript, например TypeScript, для создания типа для свойств компонента.
</div>

## Компонент готов!

Мы успешно создали компонент без необходимости использования сервера или запуска всего фронтенд-приложения. Следующим шагом будет создание остальных компонентов Taskbox аналогичным образом.

Как видите, начать создавать изолированные компоненты легко и быстро. Мы можем рассчитывать на создание более качественного пользовательского интерфейса с меньшим количеством ошибок и большей доработкой, потому что можно покопаться и протестировать все возможные состояния.

## Устраняем проблемы с доступностью

Тесты доступности относятся к практике аудита визуализации DOM с помощью автоматизированных инструментов на основе набора эвристик, основанных на правилах [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) и других принятых в отрасли лучших практик. Они выступают в качестве первой линии QA для выявления вопиющих нарушений доступности, гарантируя, что приложение будет пригодно для использования как можно большим количеством людей, включая людей с ограниченными возможностями, такими как нарушения зрения, проблемы со слухом и когнитивные заболевания.

Storybook имеет официальный [аддон доступности](https://storybook.js.org/addons/@storybook/addon-a11y). Он работает на основе [axe-core](https://github.com/dequelabs/axe-core) от Deque и позволяет решить [57% проблем WCAG](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/).

Давайте посмотрим, как это работает! Выполните следующую команду для установки аддона:

```bash
yarn add --dev @storybook/addon-a11y
```

Затем обновите файл конфигурации Storybook (`.storybook/main.js`), чтобы включить его:

```diff:title=.storybook/main.js
module.exports = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/preset-create-react-app',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: '@storybook/react',
  core: {
    builder: '@storybook/builder-webpack5',
  },
  features: {
    interactionsDebugger: true,
  },
};
```

![Проблема доступности задачи в Storybook](/intro-to-storybook/finished-task-states-accessibility-issue.png)

Просматривая наши истории, мы видим, что аддон обнаружил проблему доступности в одном из наших тестовых состояний. Сообщение [**"Элементы должны иметь достаточный цветовой контраст "**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI) означает, что между заголовком задачи и фоном недостаточно контраста. Мы можем быстро исправить это, изменив цвет текста на более тёмный серый в CSS нашего приложения (находится в `src/index.css`).

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

Вот и всё! Мы сделали первый шаг к тому, чтобы сделать пользовательский интерфейс доступным. По мере дальнейшего усложнения нашего приложения мы сможем повторить этот процесс для всех остальных компонентов без необходимости в дополнительных инструментах или средах тестирования.

<div class="aside">
💡 Не забудьте зафиксировать свои изменения с помощью git!
</div>
