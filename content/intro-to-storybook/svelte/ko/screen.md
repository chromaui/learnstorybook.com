---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면 구성하기'
---

작게 시작해서 복잡성을 더하며, 상향식으로 UI를 구현해봤습니다. 이렇게 하면 각 컴포넌트를 독립적으로 개발하고, 데이터 요구 사항을 파악하며, Storybook으로 실험해 볼 수 있었습니다. 그 모든 과정은 서버를 띄우거나 화면을 실제로 구성하지 않고도 진행할 수 있었죠!

이번 챕터에서는 컴포넌트를 화면에 결합하고, 그 화면을 Storybook에서 개발하여 정교함을 한층 더 높여보겠습니다.

## 중첩된 컨테이너 컴포넌트

현재 우리의 앱은 단순하기 때문에, 화면도 상당히 단순합니다. Svelte 스토어를 통해 자체 데이터를 제공하는 `TaskList` 컴포넌트를 레이아웃으로 감싸고, 스토어에서 최상위 `error` 필드를 꺼내오는 구조입니다.(서버 연결에 문제가 있을 때 해당 필드를 설정한다고 가정합시다).

새로운 `error` 필드를 포함하도록 Svelte 스토어(`src/store.js`)를 업데이트해 보겠습니다:

```diff:title=src/store.js
// 업데이트 메서드와 초기화 메서드를 갖춘 간단한 Svelte 스토어 구현입니다.
// 실제 앱은 더 복잡하고 여러 파일로 분리되어 있을 거예요.

import { writable } from "svelte/store";

/*
 * 앱이 로드될 때 스토어의 초기 상태입니다.
 * 보통은 서버에서 가져오겠지만, 지금은 신경쓰지 않겠습니다.
 */
const defaultTasks = [
  { id: '1', title: 'Something', state: 'TASK_INBOX' },
  { id: '2', title: 'Something more', state: 'TASK_INBOX' },
  { id: '3', title: 'Something else', state: 'TASK_INBOX' },
  { id: '4', title: 'Something again', state: 'TASK_INBOX' },
];

const TaskBox = () => {
  // 일부 초기 데이터로 채워진 새로운 writable 스토어를 생성합니다.
  const { subscribe, update } = writable({
    tasks: defaultTasks,
    status: 'idle',
    error: false,
  });
  return {
    subscribe,
    // Task를 보관(archive)하는 메서드로, Redux나 Pinia의 액션과 유사합니다.
    archiveTask: (id) =>
      update((store) => {
        const filteredTasks = store.tasks
          .map((task) =>
            task.id === id ? { ...task, state: 'TASK_ARCHIVED' } : task
          )
          .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');

        return { ...store, tasks: filteredTasks };
      }),
    // Task를 고정(pin)하는 메서드로, Redux나 Pinia의 액션과 유사합니다.
    pinTask: (id) => {
      update((store) => {
        const task = store.tasks.find((t) => t.id === id);
        if (task) {
          task.state = 'TASK_PINNED';
        }
        return store;
      });
    },
+   isError: () => update((store) => ({ ...store, error: true })),
  };
};
export const taskStore = TaskBox();
```

스토어에 새로운 필드를 추가했으니, `InboxScreen.svelte` 파일을 `components` 디렉토리에 생성해 봅시다:

```html:title=src/components/InboxScreen.svelte
<script>
  import TaskList from "./TaskList.svelte";
  export let error = false;
</script>

<div>
  {#if error}
    <div class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
  {:else}
    <div class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  {/if}
</div>
```

또한 `App` 컴포넌트를 변경하여 `InboxScreen`을 렌더링해야 합니다(추후에 라우터를 사용해 올바른 화면을 선택하겠지만, 지금은 걱정하지 마세요):

```html:title=src/App.svelte
<script>
  import InboxScreen from './components/InboxScreen.svelte';
  import { taskStore } from './store';
</script>

<InboxScreen error={$taskStore.error} />
```

마지막으로 `src/main.js` 파일도 변경해야 합니다:

```diff:title=src/main.js
- import './app.css';
+ import './index.css';
import App from './App.svelte';

const app = new App({
  target: document.getElementById("app"),
});

export default app;
```

여기서 흥미로운 부분은, Storybook에서 이 스토리를 렌더링하는 과정입니다.

이전 챕터에서 보았듯, `TaskList` 컴포넌트는 **컨테이너** 컴포넌트로, 프레젠테이셔널 컴포넌트인 `PureTaskList`를 렌더링합니다. 정의상 컨테이너 컴포넌트는 독립적으로 렌더링 될 수 없으며, 특정 컨텍스트 안 이거나 어떤 서비스와 연결되어야만 합니다. 즉, Storybook에서 컨테이너 컴포넌트를 렌더링 하려면 해당 컨텍스트나 필요한 서비스를 모킹(mock)해야 합니다.

`TaskList`를 Storybook에서 렌더링할 때, `PureTaskList`를 활용하여 앞서 이야기한 문제들을 회피했습니다. 마찬가지 방식으로 `InboxScreen`도 Storybook에서 렌더링해 보겠습니다.

`InboxScreen.stories.js`를 다음과 같이 작성해봅시다:

```js:title=src/components/InboxScreen.stories.js
import InboxScreen from './InboxScreen.svelte';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};
```

이렇게 하면 `Default`와 `Error` 스토리 모두 정상적으로 작동하는 것을 확인할 수 있습니다.

<div class="aside">

💡 계층 구조에 데이터를 전달하는 방식은 아주 괜찮은 접근법입니다. 특히 [GraphQL](http://graphql.org/)을 사용할 때 유용하죠. 실제로 800개 이상의 스토리를 가진 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)도 같은 방식으로 구현되어 있습니다.

</div>

Storybook에서 여러 상태를 전환해보면서 구현을 올바르게 했는지 쉽게 테스트할 수 있습니다:

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/finished-inbox-screen-states-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

## 컴포넌트 테스트

지금까지 간단한 컴포넌트에서 화면에 이르기까지 상향식으로 애플리케이션을 구현했고, 스토리를 통해 각 변경 사항을 지속적으로 테스트할 수 있었습니다. 하지만 새로운 스토리가 추가될 때마다 다른 모든 스토리를 수동으로 확인해서 UI가 깨지지 않는지 확인해야 합니다. 이건 너무 수고로운 일이죠.

컴포넌트 상호작용을 자동으로 테스트하도록 위의 과정을 자동화할 수는 없을까요?

### `play` 함수로 컴포넌트 테스트 코드 작성하기

Storybook의 [`play`](https://storybook.js.org/docs/writing-stories/play-function) 함수와 [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/interaction-testing)를 활용하면 이 문제를 해결할 수 있습니다. `play` 함수는 스토리가 렌더링 된 후 실행되는 작은 코드 스니펫을 포함합니다.

`play` 함수를 사용하면 작업이 업데이트 될 때 UI에 어떤 변화가 발생하는지 확인할 수 있습니다. 프레임워크에 구애받지 않는 DOM API를 사용하므로, 프론트엔드 프레임워크에 상관 없이 `play` 함수를 통해 UI와 상호작용하고 사람의 행동을 시뮬레이션할 수 있습니다.

`@storybook/addon-interactions`는 Storybook에서 테스트를 시각화하여 단계별 흐름을 보여줍니다. 각 상호작용을 중지, 재개, 되감기 및 단계별 진행할 수 있는 편리한 UI를 제공합니다.

실제로 어떻게 동작하는지 보겠습니다! 새로 생성한 `InboxScreen` 스토리를 업데이트하고, 다음과 같이 컴포넌트 상호작용을 설정해 보세요:

```diff:title=src/components/InboxScreen.stories.js
import InboxScreen from './InboxScreen.svelte';

+ import { fireEvent, within } from '@storybook/test';

export default {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

+ export const WithInteractions = {
+  play: async ({ canvasElement }) => {
+    const canvas = within(canvasElement);
+    // 첫 번째 Task 고정 시뮬레이션
+    await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+    // 세 번째 Task 고정 시뮬레이션
+    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+  },
+ };
```

<div class="aside">

💡 `@storybook/test` 패키지는 `@storybook/jest`와 `@storybook/testing-library`를 대체하며, [Vitest](https://vitest.dev/) 패키지 기반의 더 간단한 API와 더 작은 번들 크기를 제공합니다.

</div>

새로 생성한 스토리를 확인해 보세요. `Interactions` 패널을 클릭하면 `play` 함수에 정의된 상호작용 목록을 볼 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-interactive-stories-play-function-svelte.mp4"
    type="video/mp4"
  />
</video>

### 테스트 러너로 테스트 자동화하기

Storybook의 `play` 함수를 사용하여, 구현한 UI와 상호작용하고, 내용을 변경했을 때 어떻게 반응하는지 빠르게 확인할 수 있었습니다-추가적인 수작업 없이도 UI를 일관되게 유지할 수 있었죠.

하지만 Storybook에서는 해당 스토리를 볼 때만 상호작용을 테스트할 수 있습니다. 따라서 변경이 있을 때마다, 모든 검사를 실행하려면 각 스토리를 일일이 살펴봐야 합니다. 이것 또한 자동화할 수는 없을까요?

물론 가능합니다! Storybook의[테스트 러너](https://storybook.js.org/docs/writing-tests/test-runner)가 이것을 해줍니다. 이것은 [Playwright](https://playwright.dev/) 기반의 독립 실행형 유틸리티로, 모든 상호작용 테스트를 실행하여 스토리 오류를 잡아줍니다.

어떻게 작동하는지 보죠! 다음 명령으로 테스트 러너를 설치하세요:

```shell
yarn add --dev @storybook/test-runner
```

다음으로 `package.json`의 `scripts` 부분을 변경하고 새로운 테스트 작업을 추가합니다:

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

마지막으로, Storybook이 실행 중인 상태에서 새 터미널을 열어 다음 명령을 실행하세요:

```shell
yarn test-storybook --watch
```

<div class="aside">

💡 `play` 함수를 사용한 컴포넌트 테스트는 UI 컴포넌트를 테스트하는 멋진 방법입니다. 여기서 본 것 이상으로 많은 기능을 수행할 수 있으니, 자세한 내용은 [공식 문서](https://storybook.js.org/docs/writing-tests/component-testing)를 읽어보시기 바랍니다.

테스트에 대해 더 깊이 있게 파고들고 싶다면, [Testing Handbook](/ui-testing-handbook)를 읽어보세요. 규모가 큰 프론드엔드 팀에서 사용하는 테스트 전략이 담겨 있어 개발 워크플로우를 강화할 수 있을 거예요.

</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

성공! 이제 모든 스토리가 오류 없이 렌더링되고 모든 assertion이 자동으로 통과되는지 확인할 수 있습니다. 게다가, 테스트가 실패하면 실패한 스토리를 브라우저에서 열 수 있는 링크도 제공됩니다.

## 컴포넌트 주도 개발(Component-Driven Development)

`Task` 컴포넌트를 시작으로, `TaskList` 컴포넌트, 그리고 전체 화면 UI까지 구현해보았습니다. `InboxScreen` 컴포넌트는 중첩된 컨테이너 컴포넌트를 포함하고 있고, 그것에 맞는 스토리도 가지고 있습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**컴포넌트 주도 개발(CDD)**](https://www.componentdriven.org/)은 컴포넌트 계층을 따라 점진적으로 복잡도를 확장시킬 수 있게 해줍니다. 더 집중된 개발 프로세스와 가능한 모든 UI 변형에 대해 폭넓은 커버리지를 기대할 수 있죠. 다시 말하면, CDD는 더 높은 품질의 복잡한 UI를 구축하는 데 도움이 됩니다.

아직 끝이 아닙니다-UI를 만들고 나서도 일은 끝나지 않습니다. 시간이 지나도 UI는 견고해야 합니다.

<div class="aside">
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>
