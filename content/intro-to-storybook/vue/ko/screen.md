---
title: '화면 구성하기'
tocTitle: '화면'
description: '컴포넌트로 화면을 구성해봅시다'
commit: 'af51337'
---

우리는 지금까지 작은 것에서부터 시작하여 복잡성을 점점 더하는 방식으로 UI를 만들었습니다. 이를 통해 각 컴포넌트를 독립적으로 개발하고 데이터의 요구 사항을 파악하며 스토리북(Storybook)에서 사용해 볼 수 있었습니다. 모두 서버를 구축하거나 화면을 만들 필요가 없었습니다!

이번 챕터에서는 화면에서 컴포넌트를 결합하고 스토리북에서 그 화면을 개발함으로써 계속하여 완성도를 높여보겠습니다.

## 화면에 연결하기

앱이 단순하기 때문에 이번에 만들 화면은 꽤 간단합니다. `TaskList` 컴포넌트(Pinia를 통해 자체적으로 데이터를 제공)를 레이아웃에 감싸고, 스토어에서 최상위 `error` 필드를 가져옵니다(서버 연결에 문제가 있으면 해당 필드가 설정된다고 가정). 먼저 `src/components/` 폴더에 프레젠테이셔널 컴포넌트 `PureInboxScreen.vue`를 생성합니다.

```html:title=src/components/PureInboxScreen.vue
<template>
  <div>
    <div v-if="error" class="page lists-show">
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

<script>
import TaskList from './TaskList.vue';
export default {
  name: 'PureInboxScreen',
  components: { TaskList },
  props: {
    error: { type: Boolean, default: false },
  },
};
</script>
```

다음으로 `PureInboxScreen`의 데이터를 가져오는 컨테이너를 만듭니다.
`src/components/InboxScreen.vue`:

```html:title=src/components/InboxScreen.vue
<template>
  <PureInboxScreen :error="isError" />
</template>

<script>
import PureInboxScreen from './PureInboxScreen.vue';

import { computed } from 'vue';

import { useTaskStore } from '../store';

export default {
  name: 'InboxScreen',
  components: { PureInboxScreen },
  setup() {
    //👇 Creates a store instance
    const store = useTaskStore();

    //👇 Retrieves the error from the store's state
    const isError = computed(() => store.status==='error');
    return {
      isError,
    };
  },
};
</script>
```

다음으로 앱의 진입점(`src/main.js`)을 수정하여 스토어를 컴포넌트 계층에 연결합니다.

```diff:title=src/main.js
import { createApp } from 'vue';
+ import { createPinia } from 'pinia';
- import './assets/main.css';

import App from './App.vue';

- createApp(App).mount('#app')
+ createApp(App).use(createPinia()).mount('#app');
```

또한 `App` 컴포넌트를 수정하여 `InboxScreen`을 렌더링하도록 합니다(나중에 라우터를 사용해 화면을 선택할 수 있지만, 여기서는 생략).

```html:title=src/App.vue
<script setup>
import InboxScreen from './components/InboxScreen.vue';
</script>

<template>
  <div id="app">
    <InboxScreen />
  </div>
</template>

<style>
@import './index.css';
</style>
```

흥미로운 부분은 Storybook에서 화면을 렌더링할 때 발생합니다.

앞서 본 것처럼 `TaskList` 컴포넌트는 컨테이너로, 프레젠테이셔널 컴포넌트인 `PureTaskList`를 렌더링합니다. 컨테이너 컴포넌트는 정의상 단독으로 렌더링할 수 없고, 일부 컨텍스트나 서비스에 연결되어야 합니다. 즉, Storybook에서 컨테이너를 렌더링하려면 필요한 컨텍스트나 서비스의 모의(mock) 버전을 제공해야 합니다.

`TaskList`를 Storybook에 넣을 때는 `PureTaskList`를 렌더링함으로써 이 문제를 피했습니다. 이번에도 비슷하게 `PureInboxScreen`을 렌더링할 것입니다.

하지만 `PureInboxScreen`은 자체적으로는 프레젠테이셔널이지만, 자식인 `TaskList`는 그렇지 않기 때문에 문제가 발생합니다. 즉, `PureInboxScreen`이 “컨테이너 성격”에 오염된 셈입니다. 따라서 `src/components/PureInboxScreen.stories.js`에 스토리를 작성하면:

```js:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
}
```

error 스토리는 잘 동작하지만, default 스토리는 TaskList가 연결할 Pinia 스토어가 없어 문제가 발생합니다.

![Broken inbox](/intro-to-storybook/pure-inboxscreen-vue-pinia-tasks-issue.png)

이 문제를 피하는 한 가지 방법은 앱에서 컨테이너 컴포넌트를 최상위에서만 렌더링하고, 필요한 모든 데이터를 컴포넌트 계층 아래로 전달하는 것입니다.

그러나 개발자는 **결국** 계층 아래쪽에서도 컨테이너를 렌더링해야 하는 경우가 생깁니다. 앱 전체를 Storybook에서 렌더링하려면 이 문제를 해결해야 합니다.

<div class="aside">

💡 참고로, [GraphQL](http://graphql.org/)을 사용할 때는 데이터 전달 방식을 많이 씁니다. [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)도 800개 이상의 스토리를 이런 방식으로 구축했습니다.

</div>

## 스토리에 컨텍스트 제공하기

다행히 Storybook에서 Pinia 스토어를 쉽게 연결하고 스토리 간에 재사용할 수 있습니다!
`.storybook/preview.js` 설정 파일을 수정하고 Storybook의 `setup` 함수를 이용해 Pinia 스토어를 등록합니다.

```diff:title=.storybook/preview.js
+ import { setup } from '@storybook/vue3';

+ import { createPinia } from 'pinia';

import '../src/index.css';

//👇 Registers a global Pinia instance inside Storybook to be consumed by existing stories
+ setup((app) => {
+   app.use(createPinia());
+ });

/** @type { import('@storybook/vue3').Preview } */
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

이와 비슷하게 [Apollo](https://www.npmjs.com/package/apollo-storybook-decorator), [Relay](https://github.com/orta/react-storybooks-relay-container) 등의 다른 데이터 라이브러리에도 모의 컨텍스트를 제공할 수 있습니다.

이제 Storybook에서 상태를 변경하며 올바르게 동작하는지 쉽게 확인할 수 있습니다.:

<video autoPlay muted playsInline loop >

  <source
    src="/intro-to-storybook/finished-pureinboxscreen-states-7-0.mp4"
    type="video/mp4"
  />
</video>

## 컴포넌트 테스트

지금까지 우리는 단순한 컴포넌트에서 화면까지, 그리고 각 변경 사항을 스토리를 통해 계속 테스트하며 완전한 애플리케이션을 구축했습니다. 하지만 새 스토리를 추가할 때마다 다른 모든 스토리를 수동으로 확인해야 UI가 깨지지 않는지 알 수 있습니다. 이는 많은 추가 작업이 필요합니다.

이 과정을 자동화해 컴포넌트 상호작용을 자동으로 테스트할 수 없을까요?

### play 함수를 사용한 컴포넌트 테스트 작성

Storybook의 [`play`](https://storybook.js.org/docs/writing-stories/play-function)와 [`@storybook/addon-interactions`](https://storybook.js.org/docs/writing-tests/component-testing)는 이를 도와줍니다. play 함수는 스토리가 렌더링된 후 실행되는 간단한 코드 조각을 포함합니다.

play 함수는 Task가 업데이트될 때 UI에서 무슨 일이 일어나는지 확인하는 데 도움이 됩니다. 프레임워크에 구애받지 않는 DOM API를 사용하므로, 어떤 프론트엔드 프레임워크를 사용하든 UI와 상호작용하고 사용자 행동을 시뮬레이션할 수 있습니다.

`@storybook/addon-interactions`는 Storybook에서 테스트를 시각화하며, 단계별 진행 흐름과 일시정지, 재개, 되감기, 단계 이동 등의 UI 컨트롤을 제공합니다.

다음과 같이 새로 만든 `PureInboxScreen` 스토리에 컴포넌트 상호작용을 설정:

```diff:title=src/components/PureInboxScreen.stories.js
import PureInboxScreen from './PureInboxScreen.vue';

+ import { fireEvent, within } from '@storybook/test';

export default {
  component: PureInboxScreen,
  title: 'PureInboxScreen',
  tags: ['autodocs'],
};

export const Default = {};

export const Error = {
  args: { error: true },
};

+ export const WithInteractions = {
+  play: async ({ canvasElement }) => {
+    const canvas = within(canvasElement);
+    // Simulates pinning the first task
+    await fireEvent.click(canvas.getByLabelText('pinTask-1'));
+    // Simulates pinning the third task
+    await fireEvent.click(canvas.getByLabelText('pinTask-3'));
+  },
+ };
```

<div class="aside">

💡 `@storybook/test` 패키지는 `@storybook/jest`와 `@storybook/testing-library`를 대체하며, [Vitest](https://vitest.dev/) 기반의 더 가볍고 단순한 API를 제공합니다.

</div>

스토리의 `Interactions` 패널을 클릭하면 play 함수 안의 상호작용 목록을 확인할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/storybook-pureinboxscreen-interactive-stories.mp4"
    type="video/mp4"
  />
</video>

### 테스트 러너를 사용한 테스트 자동화

play 함수를 사용하면 UI와 상호작용하며 Task 업데이트 시 반응을 빠르게 확인할 수 있고, UI 일관성을 추가 작업 없이 유지할 수 있습니다.

하지만 Storybook은 스토리를 볼 때만 상호작용 테스트를 실행하므로, 변경 사항이 있을 때 모든 스토리를 일일이 확인해야 합니다. 이를 자동화할 수 없을까요?

좋은 소식은 Storybook의 [test runner](https://storybook.js.org/docs/writing-tests/test-runner)를 사용하면 가능합니다. Playwright 기반의 독립 실행 유틸리티로, 모든 상호작용 테스트를 실행하고 깨진 스토리를 잡아냅니다.

다음 명령으로 설치합니다.

```shell
yarn add --dev @storybook/test-runner
```

그런 다음 `package.json`의 `scripts`에 새 테스트 작업을 추가합니다.

```json:clipboard=false
{
  "scripts": {
    "test-storybook": "test-storybook"
  }
}
```

마지막으로 Storybook을 실행한 상태에서 새 터미널 창을 열고 다음 명령을 실행합니다.

```shell
yarn test-storybook --watch
```

<div class="aside">

💡 play 함수를 활용한 컴포넌트 테스트는 매우 강력하며, 여기서 다룬 것보다 훨씬 많은 기능을 제공합니다. 자세한 내용은 [공식 문서](https://storybook.js.org/docs/writing-tests/component-testing)를 참고하세요.

더 자세한 테스트 전략은 [Testing Handbook](/ui-testing-handbook)에서 확인할 수 있습니다.

</div>

![Storybook test runner successfully runs all tests](/intro-to-storybook/storybook-test-runner-execution.png)

성공입니다! 이제 모든 스토리가 오류 없이 렌더링되고 모든 검증이 자동으로 통과하는지 확인할 수 있는 도구를 갖추었습니다. 테스트 실패 시, 실패한 스토리를 브라우저에서 열 수 있는 링크도 제공합니다.

## 컴포넌트 주도 개발

우리는 `Task`에서 시작해 `TaskList`를 거쳐, 이제 전체 화면 UI에 도달했습니다. `InboxScreen`은 중첩된 컨테이너 컴포넌트를 포함하고, 이에 맞는 스토리도 함께 갖추었습니다.

<video autoPlay muted playsInline loop style="width:480px; height:auto; margin: 0 auto;">
  <source
    src="/intro-to-storybook/component-driven-development-optimized.mp4"
    type="video/mp4"
  />
</video>

[**Component-Driven Development**](https://www.componentdriven.org/)를 사용하면 구성 요소 계층 구조를 위로 이동하면서 복잡성을 점진적으로 확장할 수 있습니다. 다양한 이점 중 특히 개발 프로세스와 가능한 모든 UI 를 적용할 수 있도록 집중 되었습니다. 간단히 말해서 CDD는 고품질의 복잡한 사용자 인터페이스를 구축하는 데 도움이 됩니다.

아직 완료되지 않았습니다. UI가 빌드되었다고 작업이 끝난 것이 아닙니다. 또한 시간이 지나도 내구성이 유지되도록 보장해주어야 합니다.

<div class="aside">
💡 변경 사항을 Git에 커밋하는 것을 잊지 마세요!
</div>
