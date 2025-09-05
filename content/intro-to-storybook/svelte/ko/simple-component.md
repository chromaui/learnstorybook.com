---
title: '간단한 컴포넌트 만들기'
tocTitle: '간단한 컴포넌트'
description: '컴포넌트를 독립적으로 빌드하기'
---

우리는 [컴포넌트 주도 개발](https://www.componentdriven.org/) (Component-Driven Development, CDD) 방법론을 따라 UI를 구축할 겁니다. CDD는 컴포넌트로 시작하여 마지막 화면에 이르기까지 "상향식(bottom-up)"으로 UI를 구성하는 프로세스입니다. 이렇게 하면 UI를 구축할 때 마주치는 복잡도를 단계적으로 관리할 수 있습니다.

## Task 컴포넌트

![Task component in three states](/intro-to-storybook/task-states-learnstorybook.png)

`Task`는 우리 앱의 핵심 컴포넌트입니다. 각 task는 상태에 따라 다르게 표시됩니다. 체크박스(체크 여부), task 정보, 목록 상단/하단으로 이동시키는 "pin" 버튼이 필요합니다. 이를 위해 다음과 같은 속성(prop)들이 필요합니다:

- `title` – task를 설명하는 문자열
- `state` - task가 현재 어떤 목록에 있는지, 체크되었는지 여부

`Task` 컴포넌트를 만들기 위해, 먼저 위에서 살펴본 상태에 대응되는 테스트 상태를 작성합니다. 그런 다음 Storybook을 사용해 모의 데이터가 들어간 컴포넌트를 독립적으로 빌드합니다. 아래에서는 각 상태에 대해 컴포넌트가 "어떻게 보이는지 테스트"해볼 것입니다.

## 준비하기

먼저 task 컴포넌트와 그것에 대한 스토리 파일을 만들어봅시다: `src/components/Task.svelte`, `src/components/Task.stories.js`.

`Task` 컴포넌트의 기본 구현으로, 현재 필요한 속성과 두 가지 액션(목록 간 이동)을 처리할 수 있도록 합니다:

```html:title=src/lib/components/Task.svelte
<script lang="ts">
  type TaskData = {
    id?: string;
    title?: string;
    state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
  };

  interface Props {
    task: TaskData;
    onArchiveTask: (id: string) => void;
    onPinTask: (id: string) => void;
  }

  const {
    task = {
      id: '',
      title: '',
      state: 'TASK_INBOX',
    },
    onArchiveTask,
    onPinTask,
  }: Props = $props();
</script>

<div class="list-item">
  <label for={`title-${task.id}`} aria-label={task.title}>
    <input
      type="text"
      value={task.title}
      readOnly
      name="title"
      id={`title-${task.id}`}
    />
  </label>
</div>
```

위에서는 Todos 앱의 기존 HTML 구조를 기반으로, `Task` 컴포넌트에 대한 간단한 마크업을 렌더링합니다.

아래에서는 스토리 파일에 `Task` 컴포넌트의 세 가지 상태를 작성합니다:

```html:title=src/lib/components/Task.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { fn } from 'storybook/test';

  import Task from './Task.svelte';

  export const TaskData = {
    id: '1',
    title: 'Test Task',
    state: 'TASK_INBOX',
    events: {
      onArchiveTask: fn(),
      onPinTask: fn(),
    },
  };

  const { Story } = defineMeta({
    component: Task,
    title: 'Task',
    tags: ['autodocs'],
    excludeStories: /.*Data$/,
    args: {
      ...TaskData.events,
    },
  });
</script>

<Story name="Default" args={{ task: TaskData }} />

<Story name="Pinned" args={{ task: { ...TaskData, state: 'TASK_PINNED' } }} />

<Story
  name="Archived"
  args={{ task: { ...TaskData, state: 'TASK_ARCHIVED' } }}
/>
```

<div class="aside">

💡 [**Actions**](https://storybook.js.org/docs/essentials/actions)는 UI 컴포넌트를 독립적으로 빌드할 때 상호작용을 검증하는 데 도움을 줍니다. 앱의 컨텍스트 내의 실제 함수나 상태에 접근할 수 없을 때, `action()`으로 스텁(stub)을 만들어서 확인할 수 있습니다.

</div>

Storybook에는 '컴포넌트'와 그것의 '하위 스토리'라는, 기본적인 조직이 있습니다. 각 스토리는 컴포넌트의 한 가지 상태 변형을 나타냅니다. 각 컴포넌트는 필요한 만큼 스토리를 가질 수 있습니다.

- **컴포넌트**
  - 스토리(Story)
  - 스토리(Story)
  - 스토리(Story)

테스트하려는 컴포넌트를 Storybook에게 알려주기 위해, 커뮤니티에서 만든 [Svelte CSF 포맷](https://github.com/storybookjs/addon-svelte-csf)의 `defineMeta` 함수를 사용할 것입니다. 이 포맷을 사용하면 컴포넌트에 대한 메타데이터를 정의할 수 있으며, 다음과 같은 속성이 포함됩니다:

- `component` -- 컴포넌트 자체
- `title` -- Storybook 사이드바에서 컴포넌트를 참조하는 방식
- `excludeStories` -- 스토리에 필요하지만, 렌더링되지 않아도 되는 정보
- `tags` -- 자동으로 컴포넌트의 문서화를 생성하기 위해 사용
- `args` -- 컴포넌트가 사용자 정의 이벤트를 모의(mock)하기 위한 액션 [인자(args)](https://storybook.js.org/docs/essentials/actions#action-args)를 정의

스토리를 정의하기 위해, `defineMeta` 함수에서 반환된 `Story` 컴포넌트를 사용하여 각 테스트 케이스를 작성할 것입니다.

Arguments, 줄여서 [`args`](https://storybook.js.org/docs/writing-stories/args)는 Storybook을 다시 시작하지 않고도 controls 애드온으로 컴포넌트를 실시간으로 편집할 수 있게 해줍니다. [`args`](https://storybook.js.org/docs/writing-stories/args) 값이 변경되면, 컴포넌트도 함께 변경됩니다.

`fn()`은 클릭했을 때 Storybook UI의 **Actions** 패널에 나타나는 콜백을 생성할 수 있게 해줍니다. 따라서 핀 버튼을 만들었을 때, 버튼 클릭이 UI에서 성공했는지 확인할 수 있습니다.

컴포넌트의 모든 변형(permutation)에 동일한 액션 집합을 전달해야 하기 때문에, 이를 단일 `TaskData` 변수로 묶어 두고 각 스토리 정의마다 전달하는 것이 편리합니다. 또 다른 좋은 점은, 컴포넌트가 필요로 하는 `TaskData`를 묶어두면 이를 `export`하여 이 컴포넌트를 재사용하는 다른 컴포넌트의 스토리에서도 활용할 수 있다는 것입니다. 나중에 이 부분을 확인하게 될 것입니다.

## 설정

우리가 새로 만든 스토리를 Storybook이 인식하고, 애플리케이션의 CSS 파일(`src/index.css`에 위치)을 사용할 수 있도록 Storybook의 설정 파일을 수정해야 합니다.

먼저 Storybook 설정 파일(`.storybook/main.ts`)을 다음과 같이 변경하세요:

```diff:title=.storybook/main.ts
import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
- stories: [
-   '../src/**/*.stories.mdx',
-   '../src/**/*.stories.@(js|jsx|ts|tsx)'
- ],
+ stories: ['../src/lib/**/*.stories.@(js|ts|svelte)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-svelte-csf',
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
};

export default config;
```

변경을 완료한 후, `.storybook` 폴더 안에 있는 `preview.ts`를 다음과 같이 변경하세요:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/svelte-vite';

+ import '../src/index.css';

const preview: Preview = {
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

[`parameters`](https://storybook.js.org/docs/writing-stories/parameters)는 Storybook의 기능과 addon 동작을 제어하는 설정입니다. 여기서는 그 목적으로 사용하지 않을 것입니다. 대신, 애플리케이션의 CSS 파일을 import 할 것입니다.

위 설정을 마친 뒤, Storybook 서버를 재시작하면 세 가지 `Task` 컴포넌트 상태에 대한 테스트 케이스가 보일 것입니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 상태(states) 구현하기

Storybook 설정, CSS 로드, 테스트 케이스 작성이 완료되었으니, 디자인에 맞게 컴포넌트의 HTML을 빠르게 구현할 수 있습니다.

컴포넌트는 현재 기본적인 형태만 가지고 있습니다. 먼저, 자세한 사항은 넘어가고, 디자인을 위한 코드를 작성해봅시다.

```html:title=src/lib/components/Task.svelte
<script lang="ts">
  type TaskData = {
    id: string;
    title: string;
    state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
  };

  interface Props {
    /** 작업 구성 */
    task: TaskData;
    /** 작업을 보관하는 이벤트 */
    onArchiveTask: (id: string) => void;
    /** 작업을 고정시키는 이벤트 */
    onPinTask: (id: string) => void;
  }

  const {
    task = {
      id: '',
      title: '',
      state: 'TASK_INBOX',
    },
    onArchiveTask,
    onPinTask,
  }: Props = $props();

  const isChecked = $derived(task.state === 'TASK_ARCHIVED');
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
    <span
      role="button"
      class="checkbox-custom"
      aria-label={`archivedTask-${task.id}`}
      onclick={() => onArchiveTask(task.id ?? "")}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onArchiveTask(task.id ?? "");
        }
      }}
      tabindex="-1"
    ></span>
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
  {#if task.state !== "TASK_ARCHIVED"}
    <button
      class="pin-button"
      onclick={(e) => {
        e.preventDefault();
        onPinTask(task.id ?? "");
      }}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star"></span>
    </button>
  {/if}
</div>
```

위에서 가져온 추가 마크업과 이전에 가져온 CSS가 결합되어 다음과 같은 UI가 생성됩니다:

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/inprogress-task-states-9-0.mp4"
    type="video/mp4"
  />
</video>

## 데이터 요구 사항 지정하기

컴포넌트를 만들 때, `Task` 컴포넌트에 필요한 데이터의 형태를 TypeScript 타입을 정의하여 지정할 수 있습니다. 이렇게 하면 오류를 일찍 잡아낼 수 있고, 더 복잡한 기능을 추가할 때 컴포넌트가 올바르게 사용되고 있음을 보장할 수 있습니다. 먼저 `src` 폴더에 `types.ts` 파일을 만들고, 기존의 `TaskData` 타입을 그곳으로 옮기세요:

```ts:title=src/types.ts
export type TaskData = {
  id: string;
  title: string;
  state: 'TASK_ARCHIVED' | 'TASK_INBOX' | 'TASK_PINNED';
};
```

그리고, `Task` 컴포넌트를 새롭게 만든 타입을 사용하도록 변경하세요:

```html:title=src/lib/components/Task.svelte
<script lang="ts">
  import type { TaskData } from '../../types';

  interface Props {
    /** 작업 구성 */
    task: TaskData;
    /** 작업을 보관하는 이벤트 */
    onArchiveTask: (id: string) => void;
    /** 작업을 고정시키는 이벤트 */
    onPinTask: (id: string) => void;
  }

  const {
    task = {
      id: '',
      title: '',
      state: 'TASK_INBOX',
    },
    onArchiveTask,
    onPinTask,
  }: Props = $props();

  const isChecked = $derived(task.state === 'TASK_ARCHIVED');
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
    <span
      role="button"
      class="checkbox-custom"
      aria-label={`archivedTask-${task.id}`}
      onclick={() => onArchiveTask(task.id ?? "")}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onArchiveTask(task.id ?? "");
        }
      }}
      tabindex="-1"
    ></span>
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
  {#if task.state !== "TASK_ARCHIVED"}
    <button
      class="pin-button"
      onclick={(e) => {
        e.preventDefault();
        onPinTask(task.id ?? "");
      }}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star"></span>
    </button>
  {/if}
</div>
```

이제, `Task` 컴포넌트가 잘못 사용된다면 개발 중 오류가 발생할 겁니다.

## 컴포넌트 완성!

서버나 전체 프론트엔드 애플리케이션을 실행하지 않고도 성공적으로 컴포넌트를 완성했습니다. 다음으로는 나머지 Taskbox 컴포넌트들을 같은 방식으로 구현합니다.

이처럼 컴포넌트를 독립적으로 만들며 시작하는 것은 쉽고 빠릅니다. 가능한 모든 상태를 파악하고 테스트할 수 있기 때문에 버그가 적고 더 윤기나는 고품질 UI를 만들 수 있습니다.

<div class="aside">
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>
