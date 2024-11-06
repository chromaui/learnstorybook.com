---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '간단한 컴포넌트를 독립적으로 만들어봅시다'
commit: '9b36e1a'
---

우리는 [컴포넌트 기반 개발(Component-Driven Development)](https://www.componentdriven.org/)(CDD) 방법론에 따라 UI를 만들어 볼 것입니다. 이는 컴포넌트부터 시작하여 마지막 화면에 이르기까지 상향식(bottom-up)으로 UI를 개발하는 과정입니다. CDD는 UI를 구현할 때 직면하게 되는 규모의 복잡성을 해결하는 데 도움이 됩니다.

## Task 컴포넌트

![Task 컴포넌트의 3가지 상태(states)](/intro-to-storybook/task-states-learnstorybook.png)

`Task`는 우리 앱의 핵심 컴포넌트입니다. 각각의 task는 현재 어떤 상태에 있는지에 따라 약간씩 다르게 나타납니다. 선택된(또는 선택되지 않은) 체크 박스, task에 대한 정보, 그리고 task를 위아래로 움직일 수 있도록 도와주는 '핀' 버튼이 표시될 것입니다. 이를 위해 다음과 같은 prop들이 필요합니다.

- `title` – task를 설명해주는 문자열
- `state` - 현재 어떤 task가 목록에 있으며, 선택되어 있는지의 여부

`Task` 컴포넌트를 만들기 위해, 위에서 살펴본 여러 유형의 task에 해당하는 테스트 상태를 작성합니다. 그런 다음 모의 데이터를 사용하여 독립적 환경에서 컴포넌트를 구현하기 위해 스토리북(Storybook)을 사용합니다. 각각의 상태에 따라 컴포넌트의 모습을 수동으로 테스트하면서 진행할 것입니다.

## 설정하기

먼저 `Task` 컴포넌트와 그에 해당하는 스토리 파일을 만들어 봅시다. `src/components/Task.jsx`와 `src/components/Task.stories.jsx`을 생성해 주세요.

`Task`의 기본 구현부터 시작하겠습니다. 우리가 필요로 하는 속성들과 여러분이 task에 대해 취할 수 있는 두 가지 액션(목록 간 이동하는 것)을 간단히 살펴보도록 하겠습니다.

```jsx:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className="list-item">
      <label htmlFor={`title-${id}`} aria-label={title}>
        <input type="text" value={title} readOnly={true} name="title" id={`title-${id}`} />
      </label>
    </div>
  );
}
```

위의 코드는 Todos 앱의 기존 HTML을 기반으로 `Task`에 대한 간단한 마크업을 렌더링 합니다.

아래의 코드는 `Task`의 세 가지 테스트 상태를 스토리 파일에 작성한 것입니다.

```jsx:title=src/components/Task.stories.jsx

import { fn } from "@storybook/test";

import Task from './Task';

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 "Data"로 끝나는 export들은 스토리가 아닙니다.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
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
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_PINNED',
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: 'TASK_ARCHIVED',
    },
  },
};
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions)는 UI 컴포넌트를 독립적으로 만들 때 상호작용을 확인하는 데 도움을 줍니다. 종종 앱의 컨텍스트에서 사용하는 함수나 상태에 접근할 수 없을 때가 있습니다. 이때 `fn()`을 사용해 해당 함수들을 임시로 대체하세요.

</div>

스토리북에는 두 가지 기본 구성 단계가 있습니다: 컴포넌트와 그 하위 스토리들입니다. 각 스토리를 컴포넌트의 변형이라고 생각해보세요. 한 컴포넌트는 필요한 만큼 많은 스토리를 가질 수 있습니다.

- **컴포넌트**
  - 스토리(story)
  - 스토리(story)
  - 스토리(story)

스토리북에게 우리가 문서화하고 테스트하고 있는 컴포넌트에 대해 알려주기 위해, 아래 사항들을 포함하는 `default` export를 생성합니다:

- `component` -- 컴포넌트 자체
- `title` -- 스토리북 사이드바에서 컴포넌트를 그룹화하거나 분류하는 방법
- `tags` -- 컴포넌트에 대한 문서를 자동으로 생성하기 위한 태그
- `excludeStories` -- 스토리에 필요하지만 스토리북에서 렌더링되지 않아야 하는 추가 정보
- `args` -- 컴포넌트가 사용자 정의 이벤트를 모킹하기 위해 기대하는 액션 [args](https://storybook.js.org/docs/essentials/actions#action-args)를 정의

스토리를 정의하기 위해, 우리는 Component Story Format 3 ([CSF3](https://storybook.js.org/docs/api/csf)로도 알려진)를 사용하여 각 테스트 케이스를 구현할 것입니다. 이 포맷은 각 테스트 케이스를 간결하게 구현하도록 설계되었습니다. 각 컴포넌트의 상태를 포함하는 객체를 내보냄으로써, 우리는 테스트를 보다 직관적으로 정의하고 스토리를 더 효율적으로 작성 및 재사용할 수 있습니다.

Arguments(인수) 혹은 줄여서 [`args`](https://storybook.js.org/docs/writing-stories/args)를 사용하면 스토리북을 다시 시작하지 않고도 스토리북의 controls addon을 통해 컴포넌트를 라이브로 편집할 수 있습니다. [`args`](https://storybook.js.org/docs/writing-stories/args)값이 변경되면 컴포넌트도 함께 변경됩니다.

`fn()`을 사용하면 클릭 시 스토리북 UI의 **Actions** 패널에 나타나는 콜백을 생성할 수 있습니다. 따라서 핀 버튼을 만들 때 버튼 클릭이 UI에서 성공적으로 이루어졌는지를 확인할 수 있습니다.

모든 컴포넌트의 모든 조합에 동일한 액션 세트를 전달해야 하므로, 이를 하나의 `ActionsData` 변수로 묶어 매번 스토리 정의에 전달하는 것이 편리합니다. 컴포넌트가 필요로 하는 `ActionsData`를 묶는 또 다른 장점은, 이를 `export`하고 나중에 이 컴포넌트를 재사용하는 컴포넌트의 스토리에서 사용할 수 있다는 것입니다. 나중에 살펴보겠습니다.

스토리를 만들 때, 컴포넌트가 기대하는 작업의 형태를 만들기 위해 우리는 기본 `task` 인수를 사용합니다. 이 인수는 일반적으로 실제 데이터의 형태를 기반으로 모델링됩니다. 다시 말해, 이 형태를 `export` 하면 나중에 다른 스토리에서 재사용할 수 있습니다.

## 환경설정

최근에 생성한 스토리를 인식하고 애플리케이션의 CSS 파일(`src/index.css`에 위치한)을 사용하기 위해 스토리북 구성 파일에 몇 가지 변경 사항이 필요합니다.

먼저 스토리북 구성 파일(`.storybook/main.js`)을 다음과 같이 변경합니다:

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
```

위와 같이 변경을 마치셨다면, `.storybook` 폴더 내의 `preview.js`를 다음과 같이 변경합니다:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 Configures Storybook to log the actions( onArchiveTask and onPinTask ) in the UI.
/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
```

[`매개변수(parameters)`](https://storybook.js.org/docs/writing-stories/parameters)는 일반적으로 스토리북의 기능과 애드온의 동작을 제어하는 데 사용됩니다. 하지만 이번 경우에는 그 목적으로 사용하지 않을 것입니다. 대신에 우리는 애플리케이션의 CSS 파일을 import할 것입니다.

`actions`은 클릭이 되었을 때 스토리북 UI의 **actions** 패널에 나타날 콜백을 생성할 수 있도록 해줍니다. 따라서 pin 버튼을 만들 때, 버튼 클릭이 성공적이었는지 테스트 UI에서 확인 할 수 있을 것입니다.

이 작업을 완료하면 스토리북 서버를 재시작할 때 세 가지 작업(Task) 상태에 대한 테스트 케이스가 생성될 것입니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(States) 구현하기

이제 스토리북 설정, 스타일 가져오기, 테스트 케이스를 구현했으므로 디자인에 맞춰 컴포넌트의 HTML을 빠르게 구현할 수 있습니다.

컴포넌트는 아직 기본만 갖춘 상태입니다. 우선, 자세한 사항은 생략하고 디자인 코드를 작성해보겠습니다.

```jsx:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
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

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
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

위의 추가 마크업과 앞서 가져온 CSS를 결합하면 다음과 같은 UI가 생성됩니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 데이터 요구 사항 명시하기

컴포넌트에 필요한 데이터 형태를 명시하려면 리액트(React)에서 `propTypes`를 사용하는 것이 가장 좋습니다. 이는 자체적 문서화일 뿐만 아니라, 문제를 조기에 발견하는 데 도움이 됩니다.

```diff:title=src/components/Task.jsx
+ import PropTypes from 'prop-types';

export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
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

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
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

이제 Task 컴포넌트가 잘못 사용된다면 경고가 나타날 것입니다.

<div class="aside">
💡 동일한 목적을 달성하는 다른 방법으로는 TypeScript 같은 JavaScript의 타입 시스템을 사용하여 컴포넌트의 속성에 대한 타입을 만드는 것입니다.
</div>

## 컴포넌트 완성!

지금까지 우리는 서버나 프런트엔드 앱 전체를 실행하지 않고도 성공적으로 컴포넌트를 만들었습니다. 다음 단계는 비슷한 방식으로 나머지 Taskbox 컴포넌트를 하나씩 만드는 것입니다.

보시다시피, 컴포넌트를 독립적으로 구현하는 것은 쉽고 빠릅니다. 가능한 모든 상태를 테스트할 수 있기 때문에 버그가 적은 고품질 UI를 만들 수 있을 것입니다.

## 접근성 문제 발견하기

접근성 테스트는 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 규칙 및 기타 업계의 모범 사례를 기반한 일련의 경험적 방법(heuristics)과 함께 자동화 도구를 사용하여 렌더링된 DOM을 감사하는 관행을 의미합니다. 이 테스트는 명백한 접근성 위반을 적발하는 QA의 첫 번째 역할을 하며, 애플리케이션이 시각 장애인, 청각 장애인, 인지 장애인 등 가능한 많은 사람들이 애플리케이션을 사용할 수 있도록 보장합니다.

스토리북에는 공식 [접근성 애드온](https://storybook.js.org/addons/@storybook/addon-a11y)이 포함되어 있습니다. Deque의 [axe-core](https://github.com/dequelabs/axe-core)를 기반으로 하며, [최대 57%의 WCAG 문제](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)를 포착할 수 있습니다.

어떻게 작동하는지 봅시다! 다음 명령을 실행하여 애드온을 설치하세요:

```shell
yarn add --dev @storybook/addon-a11y
```

그 다음, 스토리북 구성 파일(`.storybook/main.js`)을 업데이트하여 활성화합니다:

```diff:title=.storybook/main.js
/** @type { import('@storybook/react-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.@(js|jsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
};
export default config;
```

마지막으로, 스토리북을 재시작하여 UI에서 새로운 애드온이 활성화되었는지 확인하세요.

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

스토리를 순환하면서, 애드온이 우리의 테스트 상태 중 하나에서 접근성 문제를 발견한 것을 볼 수 있습니다. [**"요소는 충분한 색 대비를 가져야 합니다"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI)라는 메시지는 기본적으로 작업 제목과 배경 간의 대비가 충분하지 않다는 의미입니다. 애플리케이션의 CSS(`src/index.css`)에 있는 텍스트 색상을 더 어두운 회색으로 변경하여 이를 빠르게 수정할 수 있습니다.

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

이제 끝입니다! 우리는 UI가 접근성을 확보하도록 첫 번째 단계를 밟았습니다. 애플리케이션의 복잡성이 올라가도 추가 도구나 테스트 환경을 구동할 필요 없이 다른 모든 컴포넌트에서도 이 과정을 반복할 수 있습니다.

<div class="aside">
💡 변경된 사항을 깃(Git)에 commit하는 것을 잊지 마세요!
</div>
