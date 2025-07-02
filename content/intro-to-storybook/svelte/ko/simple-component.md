---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '컴포넌트를 독립적으로 빌드하기'
---

우리는 컴포넌트 주도 개발[Component-Driven Development](https://www.componentdriven.org/) (CDD) 방법론을 따라 UI를 구축할 겁니다. CDD는 컴포넌트로 시작하여 마지막 화면에 이르기까지 "상향식(bottom-up)"으로 UI를 구성하는 프로세스입니다. 이렇게 하면 UI를 구축할 때 마주치는 복잡도를 단계적으로 관리할 수 있습니다.

## Task 컴포넌트

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task`는 우리 앱의 핵심 컴포넌트입니다. 각 task는 상태에 따라 다르게 표시됩니다. 체크박스(체크 여부), task 정보, 목록 상단/하단으로 이동시키는 "pin" 버튼이 필요합니다. 이를 위해 다음과 같은 props가 필요합니다:

- `title` – task를 설명하는 문자열
- `state` - task가 현재 어떤 목록에 있는지, 체크되었는지 여부

`Task` 컴포넌트를 만들기 위해, 먼저 위에서 살펴본 상태에 대응되는 테스트 상태를 작성합니다. 그런 다음 Storybook을 사용해 모의 데이터가 들어간 컴포넌트를 독립적으로 빌드합니다. 아래에서는 각 상태에 대해 컴포넌트가 어떻게 보이는지 테스트해볼 것입니다.

## 시작하기

먼저 task 컴포넌트와 그것에 대한 스토리 파일을 만들어봅시다: `src/components/Task.svelte`, `src/components/Task.stories.js`.

`Task` 컴포넌트의 기본 구현으로, 현재 필요한 속성과 두 가지 액션(목록 간 이동)을 처리할 수 있도록 합니다:

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  /** Event handler for the Pin Task */
  function PinTask() {
    dispatch('onPinTask', {
      id: task.id,
    });
  }

  /** Event handler for the Archive Task */
  function ArchiveTask() {
    dispatch('onArchiveTask', {
      id: task.id,
    });
  }

  /** Composition of the task */
  export let task = {
    id: '',
    title: '',
    state: '',
  };
</script>

<div class="list-item">
  <label for="title" aria-label={task.title}>
    <input type="text" value={task.title} name="title" readonly />
  </label>
</div>
```

위에서는 Todos 앱의 기존 HTML 구조를 기반으로, `Task` 컴포넌트에 대한 간단한 마크업을 렌더링합니다.

아래에서는 스토리 파일에 `Task` 컴포넌트의 세 가지 상태를 작성합니다:

```js:title=src/components/Task.stories.js
import Task from './Task.svelte';

import { action } from '@storybook/addon-actions';

export const actionsData = {
  onPinTask: action('onPinTask'),
  onArchiveTask: action('onArchiveTask'),
};

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 "Data"로 끝나는 export들은 스토리가 아닙니다.
  excludeStories: /.*Data$/,
  render: (args) => ({
    Component: Task,
    props: args,
    on: {
      ...actionsData,
    },
  }),
};

export const Default = {
  args: {
    task: {
      id: "1",
      title: "Test Task",
      state: "TASK_INBOX",
    },
  },
};

export const Pinned = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_PINNED",
    },
  },
};

export const Archived = {
  args: {
    task: {
      ...Default.args.task,
      state: "TASK_ARCHIVED",
    },
  },
};
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions)는 UI 컴포넌트를 독립적으로 빌드할 때 상호작용을 검증하는 데 도움을 줍니다. 앱의 컨텍스트 내의 실제 함수나 상태에 접근할 수 없을 때, `action()`으로 스텁(stub)을 만들어서 확인할 수 있습니다.

</div>

Storybook에는 '컴포넌트'와 그것의 '하위 스토리'라는, 기본적인 조직이 있습니다. 각 스토리는 컴포넌트의 한 가지 상태 변형을 나타냅니다. 각 컴포넌트는 필요한 만큼 스토리를 가질 수 있습니다.

- **컴포넌트**
  - 스토리(Story)
  - 스토리(Story)
  - 스토리(Story)

Storybook에게 어떤 컴포넌트를 문서화 중인지 알려주기 위해, 아래의 내용을 포함하는 `default` `export`를 생성합니다:

- `component` -- 문서화할 컴포넌트
- `title` -- 사이드바에 표시될 컴포넌트 이름
- `excludeStories` -- 스토리로 렌더링하지 않을 데이터
- `tags` -- 자동 문서화 기능을 위한 태그
- `render` -- 스토리 렌더링 방식을 커스터마이징할 함수

스토리를 정의할 때는, Component Story Format 3 ([CSF3](https://storybook.js.org/docs/api/csf))를 사용해 테스트 케이스를 작성합니다. 이 포맷은 각 테스트 케이스를 간결하게 구현하도록 설계되었습니다. 각 컴포넌트의 상태를 포함하는 객체를 `export`하는 것으로, 테스트를 더 직관적으로 정의하고 스토리를 더 효율적으로 작성하고 재사용할 수 있습니다.

[`args`](https://storybook.js.org/docs/writing-stories/args)(arguments)를 사용하면 Storybook을 다시 시작하지 않고도 controls addon을 통해 컴포넌트 속성을 실시간으로 편집할 수 있습니다. [`args`](https://storybook.js.org/docs/writing-stories/args) 값이 변경되면, 해당 컴포넌트도 변경됩니다.

`action()`을 사용하면 Storybook UI의 **Actions** 패널에 클릭시 나타나는 콜백을 생성할 수 있습니다. 예를 들어, 핀 버튼을 만들 때, UI에서 버튼 클릭이 잘 작동하는지 확인할 수 있습니다.

컴포넌트의 모든 상태 변형에서 여러 액션의 동작을 확인하고 싶다면, 하나의 `actionData` 변수로 액션들을 묶어서 스토리 정의에 전달하는 것이 좋습니다. 또한, `actionData`를 `export`해서 해당 컴포넌트가 사용되는 곳에서 재사용할 수 있습니다.

스토리를 만들 때는 실제 데이터 형태를 모델링해서 기본 `task` 인자를 구성하고, 이것을 `export`해서 다른 컴포넌트 스토리에서 재사용할 수 있습니다.

## 설정

이제 Storybook에서 새로 생성한 스토리가 애플리케이션의 CSS 파일(`src/index.css`)를 사용하도록 설정 파일을 수정해야 합니다.

먼저 `.storybook/main.js`를 다음과 같이 변경하세요:

```diff:title=.storybook/main.js
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
};
export default config;
```

변경 후, `.storybook/preview.js`를 다음과 같이 변경하세요:

```diff:title=.storybook/preview.js
+ import '../src/index.css';

//👇 UI에서 액션(onArchiveTask, onPinTask)의 로그를 남기는 설정입니다.
/** @type { import('@storybook/svelte').Preview } */
const preview = {
  actions: { argTypesRegex: "^on.*" },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters)는 Storybook의 기능과 addon 동작을 제어하는 설정입니다. 여기서는 `actions`(모의 콜백) 처리 방식을 지정합니다.

`action()`을 사용하면 Storybook UI의 **Actions** 패널에 클릭시 나타나는 콜백을 생성할 수 있습니다. 예를 들어, 핀 버튼을 만들 때, UI에서 버튼 클릭이 잘 작동하는지 확인할 수 있습니다.

위 설정을 마친 뒤, Storybook 서버를 재시작하면 세 가지 `Task` 컴포넌트 상태에 대한 테스트 케이스가 보일 것입니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 상태 구현하기

Storybook 설정, CSS 로드, 테스트 케이스 작성이 완료되었으니, 디자인에 맞게 컴포넌트의 HTML을 빠르게 구현할 수 있습니다.

컴포넌트는 현재 기본적인 형태만 가지고 있습니다. 먼저, 자세한 사항은 넘어가고, 디자인을 위한 코드를 작성해봅시다.

```html:title=src/components/Task.svelte
<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /** Pin Task 이벤트 핸들러 */
  function PinTask() {
    dispatch('onPinTask', { id: task.id });
  }

  /** Archive Task 이벤트 핸들러 */
  function ArchiveTask() {
    dispatch('onArchiveTask', { id: task.id });
  }

  /** Task 데이터 */
  export let task = {
    id: '',
    title: '',
    state: ''
  };

  /* 반응형 선언(다른 프레임워크의 prop) */
  $: isChecked = task.state === "TASK_ARCHIVED";
</script>

<div class="list-item {task.state}">
  <label
    for={`checked-${task.id}`}
    class="checkbox"
    aria-label={`archiveTask-${task.id}`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      disabled
      name={`checked-${task.id}`}
      id={`archiveTask-${task.id}`}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="checkbox-custom"
      role="button"
      on:click={ArchiveTask}
      tabindex="-1"
      aria-label={`archiveTask-${task.id}`}
    />
  </label>
  <label for={`title-${task.id}`} aria-label={task.title} class="title">
    <input
      type="text"
      value={task.title}
      readonly
      name="title"
      id={`title-${task.id}`}
      placeholder="Input title"
    />
  </label>
  {#if task.state !== 'TASK_ARCHIVED'}
    <button
      class="pin-button"
      on:click|preventDefault={PinTask}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star" />
    </button>
  {/if}
</div>
```

위의 마크업과 CSS를 적용하면 다음과 같은 UI가 완성됩니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 컴포넌트 완성!

서버나 전체 애플리케이션을 띄우지 않고도 성공적으로 컴포넌트를 완성했습니다. 다음으로는 나머지 Taskbox 컴포넌트들을 같은 방식으로 구현합니다.

이처럼 컴포넌트를 독립적으로 빌드하면 빠르고 쉽게 높은 품질의 UI를 만들 수 있습니다. 그리고 모든 가능한 상태에 대해 테스트해볼 수 있기 때문에,, 버그를 줄이고 세련된 결과물을 얻을 수 있습니다.

## 접근성 이슈 발견하기

접근성 테스트는 자동화 도구와 함께 [WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/) 규칙 및 업계 표준 지침을 기반의 경험적 방법(heuristics)으로 렌더링 된 DOM을 검사하는 관행입니다. 이 테스트는 시각 장애, 청력 문제, 인지 상태와 같은 장애가 있는 사람들을 포함하여 가능한 한 많은 사람들이 애플리케이션을 사용할 수 있도록 노골적인 접근성 위반을 감지하는 첫 번째 QA 역할을 합니다.

Storybook에는 공식 [접근성 애드온](https://storybook.js.org/addons/@storybook/addon-a11y)이 포함되어 있습니다. Deque의 [axe-core](https://github.com/dequelabs/axe-core)를 기반으로 하며, [최대 57% 의 WCAG 이슈](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)를 감지할 수 있습니다.

어떻게 작동하는지 봅시다! 다음 명령을 실행하여 애드온을 설치하세요:

```shell
yarn add --dev @storybook/addon-a11y
```

다음으로, Storybook 설정 파일(`.storybook/main.js`)을 다음과 같이 수정하여 활성화할 수 있습니다:

```diff:title=.storybook/main.js
/** @type { import('@storybook/svelte-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: "@storybook/svelte-vite",
    options: {},
  },
};
export default config;
```

마지막으로, UI에서 새로운 애드온이 활성화되도록 Storybook을 재시작 하세요.
Finally, restart your Storybook to see the new addon enabled in the UI.

![Task accessibility issue in Storybook](/intro-to-storybook/finished-task-states-accessibility-issue-7-0.png)

스토리를 살펴보면, 테스트 상태 중 접근성 이슈를 발견한 것을 볼 수 있습니다. [**"Elements must have sufficient color contrast"**](https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=axeAPI)라는 메시지는 기본적으로 task 제목과 배경 간의 대비가 충분하지 않다는 것을 의미합니다. 애플리케이션의 CSS(`src/index.css`)에 있는 텍스트 색상을 더 어두운 회색으로 변경하여 이것을 고칠 수 있습니다.

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
  text-decoration: line-through;
}
```

이제 끝입니다! UI에 접근하기 좋게 하는 첫 번째 단계를 밟았습니다. 애플리케이션이 더 복잡해지더라도, 추가적인 도구나 테스트 환경을 고려할 필요 없이 위의 프로세스를 반복하여 문제를 해결할 수 있습니다.

<div class="aside">
💡 git에 변경 사항 커밋하는 것을 잊지 마세요!
</div>
