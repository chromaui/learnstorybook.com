---
title: '화면 만들기'
tocTitle: '화면'
description: '컴포넌트를 조합해 화면을 만들어보세요'
commit: 'ce81973'
---

지금까지 작은 컴포넌트에서 시작해 점차 복잡한 UI를 만들어왔습니다. 각 컴포넌트를 독립적으로 개발하면서 어떤 데이터가 필요한지 파악하고, Storybook에서 직접 동작을 확인할 수 있었습니다. 서버를 띄우거나 화면 전체를 만들 필요도 없었죠.

이번 장에서는 한 단계 더 나아가 컴포넌트를 조합해 화면을 만들고, 그 화면을 Storybook에서 개발하겠습니다.

## 데이터에 연결된 화면

애플리케이션이 단순한 만큼 이번에 만들 화면도 간단합니다. 원격 API에서 데이터를 가져오고, Pinia를 통해 데이터를 받는 `TaskList` 컴포넌트를 레이아웃 안에 배치합니다. 또 스토어의 최상위 `error` 필드를 읽어 오류를 표시합니다. 서버에 연결하는 데 문제가 생기면 이 필드에 오류 정보가 저장된다고 가정하겠습니다.

먼저 `src/store.ts`의 스토어를 수정해 원격 API에 연결하고, 오류나 성공 등 애플리케이션의 여러 상태를 처리하도록 합니다:

```ts:title=src/store.ts
import type { TaskData } from './types'

/* A simple Pinia store/actions implementation.
 * A true app would be more complex and separated into different files.
 */
import { defineStore } from 'pinia'

interface TaskBoxState {
  tasks: TaskData[]
  status: 'idle' | 'loading' | 'failed' | 'succeeded'
  error: string | null
}

/*
 * The store is created here.
 * You can read more about Pinia defineStore in the docs:
 * https://pinia.vuejs.org/core-concepts/
 */
export const useTaskStore = defineStore('taskbox', {
  state: (): TaskBoxState => ({
    tasks: [],
    status: 'idle',
    error: null,
  }),
  actions: {
    archiveTask(id: string) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.state = 'TASK_ARCHIVED'
      }
    },
    pinTask(id: string) {
      const task = this.tasks.find((task) => task.id === id)
      if (task) {
        task.state = 'TASK_PINNED'
      }
    },
    async fetchTasks() {
      this.status = 'loading'
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?userId=1')
        const data = await response.json()
        const result = data
          .map((task: { id: number; title: string; completed: boolean }) => ({
            id: `${task.id}`,
            title: task.title,
            state: task.completed ? 'TASK_ARCHIVED' : 'TASK_INBOX',
          }))
          .filter((task: TaskData) => task.state === 'TASK_INBOX' || task.state === 'TASK_PINNED')
        this.tasks = result
        this.status = 'succeeded'
      } catch (error) {
        if (error && typeof error === 'object' && 'message' in error) {
          this.error = (error as Error).message
        } else {
          this.error = String(error)
        }
        this.status = 'failed'
      }
    },
  },
  getters: {
    getFilteredTasks: (state) => {
      const filteredTasks = state.tasks.filter(
        (t) => t.state === 'TASK_INBOX' || t.state === 'TASK_PINNED',
      )
      return filteredTasks
    },
  },
})
```

이제 스토어가 원격 API에서 데이터를 가져오고 애플리케이션의 여러 상태를 처리할 수 있습니다. `src/components` 디렉터리에 `InboxScreen.vue`를 만듭니다:

```html:title=src/components/InboxScreen.vue
<template>
  <div>
    <div v-if="isError" class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
    <div v-else class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

import { useTaskStore } from '../store'

import TaskList from './TaskList.vue'

//👇 Creates a store instance
const store = useTaskStore()
// 👇 Fetches tasks for the store
store.fetchTasks()

//👇 Retrieves the error from the store's state
const isError = computed(() => store.status === 'failed')
</script>
```

이어서 하위 컴포넌트에서도 스토어를 사용할 수 있도록 애플리케이션의 진입점인 `src/main.ts`를 수정합니다:

```diff:title=src/main.ts
import { createApp } from 'vue'
+ import { createPinia } from 'pinia'
- import './style.css'

import App from './App.vue'


- createApp(App).mount('#app')
+ createApp(App).use(createPinia()).mount('#app')
```

`InboxScreen`을 렌더링하도록 `App` 컴포넌트도 수정해야 합니다. 실제 애플리케이션에서는 라우터로 표시할 화면을 선택하겠지만, 여기서는 다루지 않겠습니다:

```html:title=src/App.vue
<script setup lang="ts">
import InboxScreen from './components/InboxScreen.vue'
</script>

<template>
  <InboxScreen />
</template>
<style>
@import './index.css';
</style>
```

이제 이 화면을 Storybook에 띄우려면 무엇이 필요한지 살펴보겠습니다.

앞서 살펴본 것처럼 `TaskList`는 프레젠테이셔널 컴포넌트인 `PureTaskList`를 렌더링하는 **컨테이너**입니다. 컨테이너 컴포넌트는 컨텍스트를 전달받거나 외부 서비스에 연결되어 있어야 하므로, 컴포넌트만 따로 렌더링할 수는 없습니다. Storybook에서 컨테이너를 렌더링하려면 필요한 컨텍스트나 서비스를 모의 구현해야 합니다.

`TaskList`를 Storybook에 추가할 때는 컨테이너 대신 `PureTaskList`를 렌더링해 이 문제를 피했습니다. 하지만 애플리케이션이 커지면 데이터에 연결된 컴포넌트마다 별도의 프레젠테이셔널 컴포넌트를 만들어 관리하기가 어려워집니다. `InboxScreen` 역시 데이터에 연결된 컴포넌트이므로, 스토어와 스토어가 제공하는 데이터를 모의 구현할 방법이 필요합니다.

우선 `InboxScreen.stories.ts`에 다음과 같이 스토리를 작성해봅시다:

```ts:title=src/components/InboxScreen.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

import InboxScreen from './InboxScreen.vue'

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Error: Story = {}
```

스토리를 확인하면 작업 목록이 나와야 할 자리에 빈 화면이 보입니다. 지난 장처럼 작업 목록과 오류 상태를 props로 받는 `PureInboxScreen`을 만들 수도 있습니다. 하지만 앞서 설명했듯이, 데이터에 연결된 컴포넌트가 많아질수록 이런 방식은 관리하기 어려워집니다. 이번에는 스토리에 필요한 컨텍스트를 제공해 문제를 해결해보겠습니다.

<!-- TODO:
  - Follow up with Design to get an updated image for this section
  - Update the image to include the Storybook UI based on the latest version and story names
-->

![작업 목록이 표시되지 않는 화면](/intro-to-storybook/inboxscreen-vue-pinia-tasks-issue.png)

## 스토리에 컨텍스트 제공하기

`InboxScreen`이 제대로 렌더링되려면 필요한 상태와 액션을 가진 Pinia 스토어를 여러 스토리에서 사용할 수 있어야 합니다. `.storybook/preview.ts`를 수정하고, Storybook의 `setup` 함수로 Pinia 스토어를 등록합니다:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/vue3-vite'

+ import { setup } from '@storybook/vue3-vite'

+ import { createPinia } from 'pinia'

import '../src/index.css';

//👇 Registers a global Pinia instance inside Storybook to be consumed by existing stories
+ setup((app) => {
+   app.use(createPinia());
+ });

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
}

export default preview;
```

스토어를 등록하니 `InboxScreen` 스토리는 렌더링되지만, `Error` 스토리는 여전히 오류 화면 대신 작업 목록을 보여줍니다. 스토어의 상태와 액션을 모의 구현하는 방법은 여러 가지입니다. 여기서는 널리 쓰이는 API 모킹 라이브러리와 Storybook 애드온을 함께 사용해 해결하겠습니다.

![오류 상태 대신 작업 목록을 보여주는 화면](/intro-to-storybook/broken-inbox-error-state-9-0-non-react.png)

## API 모킹하기

애플리케이션이 단순하고 원격 API 호출에 크게 의존하지 않으므로, [Mock Service Worker](https://mswjs.io/)와 [Storybook MSW 애드온](https://storybook.js.org/addons/msw-storybook-addon)을 사용하겠습니다. Mock Service Worker는 서비스 워커로 네트워크 요청을 가로채고 미리 준비한 데이터를 응답으로 보내주는 API 모킹 라이브러리입니다.

[시작하기](/intro-to-storybook/vue/ko/get-started/)에서 애플리케이션을 설정할 때 두 패키지가 함께 설치되었습니다. 이제 설정을 추가하고 스토리에서 사용하면 됩니다.

터미널에서 다음 명령어를 실행해 `public` 폴더에 서비스 워커를 생성하세요:

```shell
yarn init-msw
```

그런 다음 `.storybook/preview.ts`를 수정하여 MSW를 초기화합니다:

```diff:title=.storybook/preview.ts
import type { Preview } from '@storybook/vue3-vite'

import { setup } from '@storybook/vue3-vite'

+ import { initialize, mswLoader } from 'msw-storybook-addon'

import { createPinia } from 'pinia'

import '../src/index.css'

//👇 Registers a global Pinia instance inside Storybook to be consumed by existing stories
setup((app) => {
  app.use(createPinia())
})

// Registers the msw addon
+ initialize()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
+ loaders: [mswLoader],
}

export default preview
```

마지막으로 `InboxScreen` 스토리에 원격 API 호출을 모의 구현하는 [파라미터](https://storybook.js.org/docs/writing-stories/parameters)를 추가합니다:

```diff:title=src/components/InboxScreen.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

+ import { http, HttpResponse } from 'msw'

import InboxScreen from './InboxScreen.vue'

+ import * as PureTaskListStories from './PureTaskList.stories.ts'

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return HttpResponse.json(PureTaskListStories.TaskListData);
+       }),
+     ],
+   },
+ },
};

export const Error: Story = {
+ parameters: {
+   msw: {
+     handlers: [
+       http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
+         return new HttpResponse(null, {
+           status: 403,
+         });
+       }),
+     ],
+   },
+ },
};
```

<div class="aside">

💡 참고로, 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달하는 것도 좋은 방법입니다. 특히 [GraphQL](http://graphql.org/)을 사용할 때 유용합니다. [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)도 이 방식으로 개발했으며, 800개가 넘는 스토리를 함께 관리하고 있습니다.

</div>

Storybook을 확인하면 이제 `Error` 스토리가 의도대로 동작합니다. MSW가 원격 API 호출을 가로채고 알맞은 응답을 반환한 덕분입니다.

<video autoPlay muted playsInline loop >
  <source
    src="/intro-to-storybook/inbox-screen-with-msw-addon-non-react-9.0.mp4"
    type="video/mp4"
  />
</video>

## 상호작용 테스트

간단한 컴포넌트에서 시작해 화면까지 만들면서, 스토리로 변경 사항을 확인해왔습니다. 이제 실제로 동작하는 애플리케이션이 완성됐습니다. 하지만 스토리를 추가할 때마다 다른 스토리의 UI가 깨지지 않았는지 일일이 확인해야 한다면 손이 많이 갑니다.

컴포넌트의 상호작용도 자동으로 테스트할 수 없을까요?

### play 함수로 상호작용 테스트 작성하기

Storybook의 [`play`](https://storybook.js.org/docs/writing-stories/play-function) 함수를 사용하면 됩니다. `play` 함수에는 스토리가 렌더링된 후 실행할 짧은 코드를 작성합니다. 특정 프레임워크에 의존하지 않는 DOM API를 사용하므로, 어떤 프론트엔드 프레임워크에서든 사용자처럼 UI를 조작하는 코드를 작성할 수 있습니다. 이를 이용해 작업 상태를 바꿨을 때 UI가 예상대로 동작하는지 확인하겠습니다.

방금 만든 `InboxScreen` 스토리에 다음 코드를 추가해 컴포넌트와의 상호작용을 정의하세요:

```diff:title=src/components/InboxScreen.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3-vite'

+ import { waitFor, waitForElementToBeRemoved } from 'storybook/test'

import { http, HttpResponse } from 'msw'

import InboxScreen from './InboxScreen.vue'

import * as PureTaskListStories from './PureTaskList.stories.ts'

const meta = {
  component: InboxScreen,
  title: 'InboxScreen',
  tags: ['autodocs'],
} satisfies Meta<typeof InboxScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return HttpResponse.json(PureTaskListStories.TaskListData);
        }),
      ],
    },
  },
+ play: async ({ canvas, userEvent }: any) => {
+   await waitForElementToBeRemoved(await canvas.findByTestId('empty'))
+   await waitFor(async () => {
+     await userEvent.click(canvas.getByLabelText('pinTask-1'))
+     await userEvent.click(canvas.getByLabelText('pinTask-3'))
+   })
+ },
};

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('https://jsonplaceholder.typicode.com/todos?userId=1', () => {
          return new HttpResponse(null, {
            status: 403,
          });
        }),
      ],
    },
  },
};
```

<div class="aside">

💡 `Interactions` 패널에서는 테스트의 진행 과정을 단계별로 확인할 수 있습니다. 테스트를 일시 정지하거나 다시 실행하고, 이전 단계로 돌아가거나 한 단계씩 실행하는 기능도 제공합니다.

</div>

`Default` 스토리를 열고 `Interactions` 패널을 클릭하면 `play` 함수에 정의한 상호작용 목록을 볼 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-play-function-non-react.mp4"
    type="video/mp4"
  />
</video>

### Vitest 애드온으로 테스트 자동화하기

`play` 함수로 사용자 동작을 재현하고, 작업 상태를 바꿨을 때 컴포넌트가 제대로 동작하는지 확인했습니다. 그런데 이 테스트는 해당 스토리를 열어야만 실행됩니다. 코드를 수정할 때마다 모든 테스트를 실행하려면 여전히 스토리를 하나씩 열어봐야 합니다. 이 과정도 자동화해봅시다.

Storybook의 [Vitest 애드온](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)을 사용하면 상호작용 테스트를 자동으로 실행할 수 있습니다. Vitest를 기반으로 동작해 테스트를 빠르고 효율적으로 실행합니다. 직접 사용해보겠습니다.

Storybook이 실행 중인 상태에서 사이드바의 "Run Tests"를 클릭하세요. 스토리의 렌더링과 동작, `play` 함수에 정의된 상호작용을 테스트합니다. 방금 `InboxScreen` 스토리에 추가한 테스트도 함께 실행됩니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-vitest-addon-non-react.mp4"
    type="video/mp4"
  />
</video>

<div class="aside">

💡 Vitest 애드온은 여기서 다룬 것 외에도 여러 종류의 테스트를 지원합니다. 자세한 내용은 [공식 문서](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon)를 참고하세요.

</div>

이제 스토리를 하나씩 확인하지 않아도 UI 테스트를 자동으로 실행할 수 있습니다. 애플리케이션에 기능을 추가하면서도 기존 UI가 제대로 동작하는지 확인할 수 있고, 테스트가 실패하면 바로 알 수 있어 문제를 빠르게 수정할 수 있습니다.

## 컴포넌트 주도 개발

가장 작은 단위인 `Task`에서 시작해 `TaskList`를 거쳐 화면 전체를 완성했습니다. `InboxScreen`은 데이터에 연결된 컴포넌트들을 포함하며, 이를 확인할 스토리도 갖추고 있습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**컴포넌트 주도 개발**](https://www.componentdriven.org/)을 따르면 작은 컴포넌트부터 상위 컴포넌트로 올라가면서 복잡성을 단계적으로 다룰 수 있습니다. 한 번에 하나의 컴포넌트에 집중하고, UI가 가질 수 있는 다양한 상태를 더 꼼꼼하게 확인할 수 있다는 장점이 있습니다. 덕분에 복잡한 UI도 완성도 있게 만들 수 있습니다.

하지만 UI를 만들었다고 끝은 아닙니다. 앞으로 코드를 수정해도 UI가 안정적으로 동작하는지 확인해야 합니다.

<div class="aside">
💡 변경 사항을 git으로 커밋하는 것을 잊지 마세요!
</div>
