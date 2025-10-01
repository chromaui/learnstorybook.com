---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면 구성하기'
---

작게 시작해서 복잡성을 더하며, 상향식으로 UI를 구현해봤습니다. 이렇게 하면 각 컴포넌트를 독립적으로 개발하고, 데이터 요구 사항을 파악하며, Storybook으로 실험해 볼 수 있었습니다. 그 모든 과정은 서버를 띄우거나 화면을 실제로 구성하지 않고도 진행할 수 있었죠!

이번 챕터에서는 컴포넌트를 화면에 결합하고, 그 화면을 Storybook에서 개발하여 정교함을 한층 더 높여보겠습니다.

## 연결된 페이지

현재 우리의 앱은 단순하기 때문에, 화면도 상당히 단순합니다. Svelte 스토어를 통해 자체 데이터를 제공하는 `TaskList` 컴포넌트를 레이아웃으로 감싸고, 스토어에서 최상위 `error` 필드를 꺼내오는 구조입니다.(서버 연결에 문제가 있을 때 해당 필드를 설정한다고 가정합시다).

스토어(`src/lib/state/store.svelte.ts`)를 업데이트하여 원격 API에 연결하고 애플리케이션의 다양한 상태(즉, `error`, `succeeded`)를 처리해 봅시다:

```ts:title=src/lib/state/store.svelte.ts
// 룬(상태 업데이트)과 초기 데이터를 이용한 간단한 Svelte 상태 관리 구현.
// 실제 앱은 더 복잡하고 다른 파일로 분리되어 있을 것입니다.
import type { TaskData } from '../../types';

interface TaskBoxState {
  tasks: TaskData[];
  status: 'idle' | 'loading' | 'failed' | 'succeeded';
  error: string | null;
}

const initialState: TaskBoxState = {
  tasks: [],
  status: 'idle',
  error: null,
};


export const store: TaskBoxState = $state(initialState);

// API에서 task를 가져와서 스토어를 채우는 함수
export async function fetchTasks() {
  store.status = 'loading';
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1');
    const data = await response.json();
    // TaskData 타입을 맞추기 위한 데이터 변환.
    const result = data.map(
      (task: { id: number; title: string; completed: boolean }) => ({
        id: `${task.id}`,
        title: task.title,
        state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
      })
    ).filter(
      (task: TaskData) => task.state === 'TASK_INBOX' || task.state === 'TASK_PINNED');


    store.tasks = result;
    store.status = 'succeeded';
  } catch (error) {
    if (error && typeof error === 'object' && 'message' in error) {
      store.error = (error as { message: string }).message;
    } else {
      store.error = String(error);
    }
    store.status = 'failed';
  }
}

// 작업을 보관하는 함수
export function archiveTask(id: string) {
  const filteredTasks = store.tasks
    .map((task): TaskData =>
      task.id === id ? { ...task, state: 'TASK_ARCHIVED' as TaskData['state'] } : task
    )
    .filter((t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED');
  store.tasks = filteredTasks;
}

// 작업을 고정시키는 함수
export function pinTask(id: string) {
  const task = store.tasks.find((task) => task.id === id);
  if (task) {
    task.state = "TASK_PINNED";
  }
}
```

이제 원격 API 엔드포인트에서 데이터를 검색하고 앱의 다양한 상태를 처리할 수 있도록 스토어를 업데이트했으니, 'src/lib/components' 디렉토리에 'InboxScreen.svelte'를 생성해 봅시다:

```html:title=src/lib/components/InboxScreen.svelte
<script lang="ts">
  import TaskList from './TaskList.svelte';

  import { fetchTasks, store } from '../state/store.svelte';

  $effect(() => {
    fetchTasks();
  });
</script>

{#if store.status === "failed"}
  <div class="page lists-show">
    <div class="wrapper-message">
      <span class="icon-face-sad"></span>
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
```

또한 `App` 컴포넌트를 변경하여 `InboxScreen`을 렌더링해야 합니다(추후에 라우터를 사용해 올바른 화면을 선택하겠지만, 지금은 걱정하지 마세요):

```html:title=src/App.svelte
<script lang="ts">
  import InboxScreen from "./lib/components/InboxScreen.svelte";
</script>

<InboxScreen />
```

마지막으로 `src/main.ts` 파일도 변경해야 합니다:

```diff:title=src/main.ts
import { mount } from 'svelte';

- import './app.css';
+ import './index.css';

import App from './App.svelte';

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
```

여기서 흥미로운 부분은, Storybook에서 이 스토리를 렌더링하는 과정입니다.

이전 챕터에서 보았듯, `TaskList` 컴포넌트는 **컨테이너** 컴포넌트로, 프레젠테이셔널 컴포넌트인 `PureTaskList`를 렌더링합니다. 정의상 컨테이너 컴포넌트는 독립적으로 렌더링 될 수 없으며, 특정 컨텍스트 안 이거나 어떤 서비스와 연결되어야만 합니다. 즉, Storybook에서 컨테이너 컴포넌트를 렌더링 하려면 해당 컨텍스트나 필요한 서비스를 모의(mock)해야 합니다.

Storybook에 `TaskList`를 넣을 때, 컨테이너 대신 `PureTaskList`를 렌더링하는 것으로 문제를 피할 수 있었습니다. 하지만 애플리케이션이 커질수록, 연결된 컴포넌트를 Storybook에서 제외하고 매번 별도의 프레젠테이셔널 컴포넌트를 만들어 관리하는 것은 금세 한계에 부딪힙니다. `InboxScreen`처럼 연결된 컴포넌트라면, 스토어와 스토어가 제공하는 데이터를 모킹(mocking)할 방법이 필요합니다.

`InboxScreen.stories.svelte`를 다음과 같이 스토리를 작성해봅시다:

```html:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import InboxScreen from './InboxScreen.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story name="Default" />

<Story name="Error" />

```

`Error` 스토리에서 문제를 빠르게 확인할 수 있습니다. 올바른 상태를 보여주는 대신, 작업 목록을 보여줍니다. 지난 챕터에서와 동일한 접근 방식을 쉽게 적용할 수도 있습니다. 대신, 이 문제를 해결하기 위해 잘 알려진 API 모킹(mocking) 라이브러리와 Storybook 애드온을 함께 사용할 것입니다.

![Broken inbox screen state](/intro-to-storybook/broken-inbox-error-state-9-0-non-react.png)

## 모킹 API 서비스

우리의 애플리케이션은 꽤 단순하고 원격 API 호출에 크게 의존하지 않기 때문에, [Mock Service Worker](https://mswjs.io/)와 [Storybook의 MSW 애드온](https://storybook.js.org/addons/msw-storybook-addon)을 사용하겠습니다. Mock Service Worker는 API 모킹(mocking) 라이브러리입니다. 서비스 워커를 이용해 네트워크 요청을 가로채고, 응답에 모의(mock) 데이터를 제공합니다.

[시작하기 챕터](/intro-to-storybook/svelte/en/get-started)에서 애플리케이션을 설정할 때 두 패키지도 함께 설치되었습니다. 따라서, 그것을 설정하고 스토리에서 사용하도록 업데이트만 하면 됩니다.

터미널에서 다음 명령을 통해 `public` 폴더 안에 일반 서비스 워커를 생성하세요:

```shell
yarn init-msw
```

`.storybook/preview.ts`를 업데이트하고 서비스 워커를 초기화해야 합니다:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/svelte-vite';

import '../src/index.css';

+ import { initialize, mswLoader } from 'msw-storybook-addon';

// msw 애드온을 등록합니다.
+ initialize();

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
+ loaders: [mswLoader],
};

export default preview;
```

마지막으로 `InboxScreen` 스토리를 업데이트하고 원격 API 호출을 모킹(mocking)하는 [매개변수](https://storybook.js.org/docs/writing-stories/parameters)를 포함시킵니다:

```diff:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

+ import { http, HttpResponse } from 'msw';

  import InboxScreen from './InboxScreen.svelte';

  import * as PureTaskListStories from './PureTaskList.stories.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
+   parameters={{
+     msw: {
+       handlers: [
+         http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+           return HttpResponse.json(PureTaskListStories.TaskListData);
+         }),
+       ],
+     },
+   }}
/>

<Story
  name="Error"
+  parameters={{
+     msw: {
+       handlers: [
+         http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+           return new HttpResponse(null, {
+             status: 403,
          });
+         }),
+       ],
+     },
+   }}
/>
```

<div class="aside">

💡 계층 구조에 데이터를 전달하는 방식은 아주 괜찮은 접근법입니다. 특히 [GraphQL](http://graphql.org/)을 사용할 때 유용하죠. 실제로 800개 이상의 스토리를 가진 [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)도 같은 방식으로 구현되어 있습니다.

</div>

Storybook을 확인해보면, `Error` 스토리가 의도한대로 동작하는 걸 볼 수 있습니다. MSW는 원격 API 호출을 가로챘고 적절한 응답을 제공했습니다.

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/inbox-screen-with-msw-addon-non-react-9.0.mp4"
    type="video/mp4"
  />
</video>

## 상호작용 테스트

지금까지 우리는 간단한 컴포넌트부터 화면에 이르기까지 완벽한 기능을 갖춘 애플리케이션을 처음부터 구축하고, 스토리를 사용하여 각 변경 사항을 지속적으로 테스트할 수 있었습니다. 하지만 새로운 스토리를 만들 때마다 UI가 깨지지 않도록 다른 모든 스토리를 수동으로 확인해야 합니다. 그건 너무 수고로운 일이죠.

컴포넌트 상호작용을 자동으로 테스트하도록 위의 과정을 자동화할 수는 없을까요?

### `play` 함수로 상호작용 테스트 코드 작성하기

Storybook의 [`play`](https://storybook.js.org/docs/writing-stories/play-function)함수가 이것을 도와줍니다. `play` 함수는 스토리가 렌더링된 후 실행되는 작은 코드 스니펫을 포함합니다. 프레임워크에 구애받지 않는 DOM API를 사용하므로, 프론트엔드 프레임워크에 관계 없이 `play` 함수를 사용하여 스토리를 작성하고 UI와 상호 작용하며 인간의 행동을 시뮬레이션할 수 있습니다. 이것을 통해 코드를 업데이트할 UI가 예상대로 작동하는지 확인할 수 있습니다.

새로 생성된 `InboxScreen` 스토리를 업데이트하고, 다음을 추가하여 컴포넌트 상호 작용을 설정하세요:

```diff:title=src/lib/components/InboxScreen.stories.svelte
<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';

  import { http, HttpResponse } from 'msw';

+ import { waitFor, waitForElementToBeRemoved } from 'storybook/test';

  import InboxScreen from './InboxScreen.svelte';

  import * as PureTaskListStories from './PureTaskList.stories.svelte';

  const { Story } = defineMeta({
    component: InboxScreen,
    title: 'InboxScreen',
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
  parameters={{
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(PureTaskListStories.TaskListData);
        }),
      ],
    },
  }}
+ play={async ({ canvas, userEvent }) => {
+   await waitForElementToBeRemoved(await canvas.findByTestId("loading"));
+   await waitFor(async () => {
+     await userEvent.click(canvas.getByLabelText("pinTask-1"));
+     await userEvent.click(canvas.getByLabelText("pinTask-3"));
+   });
+ }}
/>

<Story
  name="Error"
  parameters={{
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  }}
/>
```

<div class="aside">

💡 `Interactions` 패널은 Storybook에서 테스트를 시각화하여 단계별 흐름을 제공합니다. 또한, 각 상호작용을 일시 중지, 재개, 되감기 및 단계별로 진행할 수 있는 편리한 UI 제어 세트를 제공합니다.

</div>

`Default` 스토리를 확인해 보세요. `Interactions` 패널을 클릭해서 스토리의 `play` 함수 안에 있는 상호작용 목록도 확인해 보세요.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-non-react.mp4"
    type="video/mp4"
  />
</video>

### Vitest 애드온으로 테스트 자동화하기

`play` 함수로 컴포넌트에 대한 사용자 상호작용을 빠르게 시뮬레이션하고, 코드를 업데이트할 때마다 동작을 확인하여 UI 일관성을 유지할 수 있었습니다. 하지만, Storybook을 살펴보면, 상호작용 테스트가 스토리를 보고 있을 때만 실행된다는 것을 알 수 있습니다. 다시 말하면, 변경 사항이 있을 때마다 각 스토리를 수동으로 확인해야 한다는 것입니다. 이것을 자동화할 수는 없을까요?

할 수 있습니다! Storybook의 [Vitest 애드온](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)은 Vitest의 기능을 활용하여 더 빠르고 효율적인 테스트 경험을 제공하면서, 상호작용 테스트를 보다 자동화된 방식으로 실행할 수 있게 해줍니다. 어떻게 동작하는지 살펴봅시다!

Storybook이 실행 중인 상태에서, 사이드바의 "Run Tests"를 클릭하세요. 그러면 방금 `InboxScreen` 스토리에 추가한 것을 포함해, 스토리가 어떻게 렌더링되는지, 그 동작, 그리고 `play` 함수에 정의된 상호작용에 대한 테스트가 실행됩니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-vitest-addon-non-react.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

💡 Vitest 애드온은 훨씬 더 많은 일을 할 수 있으며, 다른 유형의 테스트도 포함합니다. 더 알아보고 싶다면[공식 문서](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)를 읽어보시기 바랍니다.

</div>

이제 수동으로 확인하지 않고, UI 테스트를 자동화하는 도구를 갖게 되었습니다. 이것은 애플리케이션을 계속 구축해 나가면서 UI의 일관성과 기능성을 보장하는 훌륭한 방법입니다. 더 나아가 테스트가 실패할 경우 즉시 알림을 받아, 문제를 빠르고 쉽게 고칠 수 있습니다.

## 컴포넌트 주도 개발(Component-Driven Development)

`Task` 컴포넌트를 시작으로, `TaskList` 컴포넌트, 그리고 전체 화면 UI까지 구현해보았습니다. `InboxScreen` 컴포넌트는 중첩된 컨테이너 컴포넌트를 포함하고 있고, 그것에 맞는 스토리도 가지고 있습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**컴포넌트 주도 개발(CDD)**](https://www.componentdriven.org/)은 컴포넌트 계층을 따라 점진적으로 복잡도를 확장시킬 수 있게 해줍니다. 더 집중된 개발 프로세스와 가능한 모든 UI 변형에 대해 폭넓은 커버리지를 기대할 수 있죠. 다시 말하면, CDD는 더 높은 품질의 복잡한 UI를 구축하는 데 도움이 됩니다.

아직 끝이 아닙니다 - UI를 만들고 나서도 일은 끝나지 않습니다. 시간이 지나도 UI는 견고해야 합니다.

<div class="aside">
💡 git으로 변경 사항 커밋하는 것을 잊지 마세요!
</div>
