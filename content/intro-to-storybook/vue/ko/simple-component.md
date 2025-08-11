---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '독립적으로 간단한 컴포넌트 만들기'
commit: 'b586083'
---

우리는 컴포넌트 기반 개발(Component-Driven Development)(CDD) 방법론에 따라 UI를 만들어 볼 것입니다. 이는 컴포넌트부터 시작하여 마지막 화면에 이르기까지 상향식(bottom-up)으로 UI를 개발하는 과정입니다. CDD는 UI를 구현할 때 직면하게 되는 규모의 복잡성을 해결하는 데 도움이 됩니다.

## Task

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task`는 앱의 핵심 컴포넌트입니다. 각 Task는 상태에 따라 조금씩 다르게 표시됩니다. 체크박스(선택/해제), Task 정보, Task를 목록의 위아래로 이동시키는 “pin” 버튼이 포함됩니다. 이를 위해 필요한 props는 다음과 같습니다.

- `title` – Task를 설명하는 문자열
- `state` – Task가 현재 속한 목록과 체크 여부

`Task`를 만들 때 먼저 위 그림과 같은 테스트 상태를 정의합니다. 그다음 Storybook에서 모의(mock) 데이터를 사용해 컴포넌트를 독립적으로 생성하고, 각 상태에 따라 UI가 올바르게 표시되는지 수동으로 확인합니다.

## 설정하기

먼저 Task 컴포넌트와 해당 Story 파일을 생성합니다.  
파일 경로: `src/components/Task.vue` 및 `src/components/Task.stories.js`

아래는 `Task`의 기본 구현으로, 필요한 속성(props)과 Task에 대해 수행할 수 있는 두 가지 액션(목록 간 이동)을 포함합니다.

```html:title=src/components/Task.vue
<template>
  <div class="list-item">
    <label for="title" :aria-label="task.title">
      <input type="text" readonly :value="task.title" id="title" name="title" />
    </label>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: '', state: '', title: '' }),
      validator: (task) => ['id', 'state', 'title'].every((key) => key in task)
    }
  }
}
</script>
```

위 예시는 Todos 애플리케이션의 HTML 구조를 기반으로 Task를 단순하게 렌더링한 것입니다.

다음으로, Story 파일에서 Task의 세 가지 테스트 상태를 정의합니다:

```js:title=src/components/Task.stories.js
import { fn } from '@storybook/test';

import Task from './Task.vue';

export const ActionsData = {
  onPinTask: fn(),
  onArchiveTask: fn(),
};

export default {
  component: Task,
  title: 'Task',
  tags: ['autodocs'],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData
  }
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

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions)는 UI 컴포넌트를 독립적으로 만들 때 상호작용을 검증하는 데 도움을 줍니다. 앱 컨텍스트 내의 함수와 상태에 접근할 수 없는 경우, `fn()`을 사용해 이를 대체할 수 있습니다.

</div>

Storybook에는 두 가지 기본 구성 단위가 있습니다. 컴포넌트와 그 하위의 스토리입니다.
스토리는 컴포넌트의 다양한 상태를 나타내며, 필요한 만큼 생성할 수 있습니다.

- **Component**
  - Story
  - Story
  - Story

스토리북에게 우리가 문서화하고 테스트하고 있는 컴포넌트에 대해 알려주기 위해, 아래 사항들을 포함하는 `default` export를 생성합니다:

- `component` -- 컴포넌트 자체
- `title` -- 스토리북 사이드바에서 컴포넌트를 그룹화하거나 분류하는 방법
- `tags` -- 컴포넌트에 대한 문서를 자동으로 생성하기 위한 태그
- `excludeStories`-- 스토리에 필요하지만 스토리북에서 렌더링되지 않아야 하는 추가 정보
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
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
- stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
+ stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {},
  },
};
export default config;
```

위와 같이 변경을 마치셨다면, `.storybook` 폴더 내의 `preview.ts`를 다음과 같이 변경합니다:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/react';

+ import '../src/index.css';

const preview: Preview = {
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

```html:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label
      :for="'checked' + task.id"
      :aria-label="'archiveTask-' + task.id"
      class="checkbox"
    >
      <input
        type="checkbox"
        :checked="isChecked"
        disabled
        :name="'checked' + task.id"
        :id="'archiveTask-' + task.id"
      />
      <span class="checkbox-custom" @click="archiveTask" />
    </label>
    <label :for="'title-' + task.id" :aria-label="task.title" class="title">
      <input
        type="text"
        readonly
        :value="task.title"
        :id="'title-' + task.id"
        name="title"
        placeholder="Input title"
      />
    </label>
    <button
      v-if="!isChecked"
      class="pin-button"
      @click="pinTask"
      :id="'pinTask-' + task.id"
      :aria-label="'pinTask-' + task.id"
    >
      <span class="icon-star" />
    </button>
  </div>
</template>

<script>
import { reactive, computed } from 'vue';

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Task',
  props: {
    task: {
      type: Object,
      required: true,
      default: () => ({ id: '', state: '', title: '' }),
      validator: task => ['id', 'state', 'title'].every(key => key in task),
    },
  },
  emits: ['archive-task', 'pin-task'],

  setup(props, { emit }) {
    props = reactive(props);
    return {
      classes: computed(() => ({
        'list-item TASK_INBOX': props.task.state === 'TASK_INBOX',
        'list-item TASK_PINNED': props.task.state === 'TASK_PINNED',
        'list-item TASK_ARCHIVED': props.task.state === 'TASK_ARCHIVED',
      })),
      /**
       * Computed property for checking the state of the task
       */
      isChecked: computed(() => props.task.state === 'TASK_ARCHIVED'),
      /**
       * Event handler for archiving tasks
       */
      archiveTask() {
        emit('archive-task', props.task.id);
      },
      /**
       * Event handler for pinning tasks
       */
      pinTask() {
        emit('pin-task', props.task.id);
      },
    };
  },
};
</script>
```

위의 추가 마크업과 앞서 가져온 CSS를 결합하면 다음과 같은 UI가 생성됩니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/finished-task-states-7-0.mp4"
    type="video/mp4"
  />
</video>

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
/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
  stories: ['../src/components/**/*.stories.js'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
+   '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/vue3-vite',
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
