---
title: '작업 흐름(WorkFlow)'
description: '컴포넌트 설계를 위한 테스트 주도(test-driven) 작업 흐름(workflow)'
---

사용자 인터페이스(user interfaces)를 개발하는 것은 늘 잘못 정의되어 왔습니다. UI의 주관적인 특성은 즉흥적인(ad-hoc) 개발 작업흐름(workflow)으로 이어지고, 이는 곧 버그투성이 UI를 만들어 냅니다. 이번 장에서는 철저하면서도 시각적 테스트 주도적인(test-driven) 방식으로 얼마나 전문적으로 UI를 설계할 수 있는지 살펴볼 것입니다.

## 테스트 주도적인(Test-driven) 개발

시작에 앞서, 일반화된 기술 관습인 **[테스트 주도 방법론 (TDD)](https://en.wikipedia.org/wiki/Test-driven_development)**에 대해 간단히 짚고 넘어가겠습니다. 테스트 주도 방법론(TDD)을 이루는 핵심 개념은 테스트 중인 기능을 개발하기 전에 테스트를 작성하는 것입니다.

1. 코드에 자동화된 유닛 테스트를 적용해보세요
2. 테스트에 '초록불이 들어오는' 코드를 작성해보세요

테스트 주도 방법론(TDD)를 통해 사용자는 정확한 입력값의 측면에서 어떤 코드가 필요한지 명확하게 파악할 수 있게 됩니다. (컴포넌트의 경우, 이를 '상태(state)'라고 합니다.) 이러한 방식으로, 모듈의 모든 사례를 다루게 됩니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/test-driven-development.mp4"
    type="video/mp4">
</video>

예시를 하나 살펴봅시다. 가공되지 않은 날짜 객체를 '2주 전'과 같은 형식으로 변환하는 `상대화(relativize)` 함수가 있다고 생각해봅시다. 다루고자 하는 모든 다양한 유형의 입력값을 간단히 설명해 보는 것은 어려운 일이 아닙니다. 그런 다음, 해결책에 가까워졌다고 생각이 들 때마다 '테스트(test)' 버튼을 누르세요.

테스트 프레임워크(framework)를 사용하면 단순히 한 부분을 테스트 하기 위해 전체 애플리케이션에 입력값을 넣을 필요 없이 `상대화(relativize)` 함수를 분리해서 실행할 수 있습니다.

하지만, UI 개발을 할 때는 테스트 주도 방법론(TDD)이 잘 맞진 않습니다. 테스트를 미리 정의하기 어렵고, 모듈을 분리하기 어려우며, 산출값이 주관적이기 때문입니다. 이러한 단점은 컴포넌트를 개별적으로 분리해 시각적 테스트를 함으로써 해결할 수 있습니다.

## 시각적 테스팅

UI 테스트의 가장 까다로운 부분은 코드만으론 적절한 시각적인 세부사항을 확인할 수 없다는 점입니다. 시각적 테스팅은 빠르고 집중적인 방식으로 인간의 판단을 포함한 이러한 확인절차를 건너뜁니다.

#### 시각적 테스트의 작업흐름(workflow)

실제로, 시각적 테스트는 스토리북(Storybook)을 사용해 정의된 테스트의 상태의 전체에 걸쳐 컴포넌트를 '시각적인' 방법으로 테스트 합니다. 시각적 테스트는 다른 유형의 테스트 방식과 동일한 설정, 실행과 분해 단계를 공유하지만, 확인단계는 사용자의 몫입니다.

```shell:clipboard=false
test do
  setup
  execute 👈 Storybook renders stories
  verify 👈 you look at stories
  teardown
end
```

그런 다음 이미지 스냅샷을 자동으로 캡처하고 비교하면서 회귀합니다.

```shell:clipboard=false
test do
  setup
  execute 👈 Storybook renders stories
  verify 👈 capture image snapshots and compare them to baselines
  teardown
end
```

위의 두 가지 경우 모두 동일한 테스트 케이스를 사용하며, 확인단계에서만 차이가 있습니다.

#### 시각적 테스트 케이스를 작성하는 방법

첫번째 경우부터 살펴봅시다. 스토리북에서 테스트는 리액트(React)의 요소를 렌더링하는 것만큼 간단합니다. 시각적 테스트 케이스를 작성하려면 컴포넌트와 관련된 상태에 대해 짚고 넘어가봐야 합니다. 이것을 스토리북 용어로는 '스토리'라고 합니다. 아래의 예시 코드를 통해 `InboxTask`, `SnoozedTask`, `PinnedTask`에 대한 시각적 테스트를 작성하는 방법을 알아봅시다.

```ts:title=src/components/Task.stories.ts
import type { Meta, StoryObj } from '@storybook/react';

import Task from './Task';

const meta: Meta = {
  component: Task,
  title: 'Task',
} satisfies Meta<typeof Task>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InboxTask: Story = {
  args: {
    task: {
      id: '1',
      title: 'Test Task',
      state: 'TASK_INBOX',
      updatedAt: new Date(2023, 0, 1, 9, 0),
      boardName: 'On Test Board',
    },
  },
};

export const SnoozedTask: Story = {
  args: {
    task: {
      // Shaping the stories through args composition.
      ...InboxTask.args?.task,
      state: 'TASK_SNOOZED',
    },
  },
};

export const PinnedTask: Story = {
  args: {
    task: {
      // Shaping the stories through args composition.
      ...InboxTask.args?.task,
      state: 'TASK_PINNED',
    },
  },
};
```

스토리북에서 `Task`와 변경 사항을 사이드바에서 확인할 수 있습니다. 이는 테스트 주기에서 _'실행단계(execute)'_ 에 해당합니다. 스토리북에서 우리가 눈으로 확인하는 것은 _'확인단계(verify)'_ 에 해당합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/task-stories-snoozed-optimized.mp4"
    type="video/mp4"/>
</video>

UI 테스팅을 하면서, 육안으로 확인하는 것은 실용적인 접근입니다. 시각적인 모양에 영향을 주지 않으면서 컴포넌트를 변화시키는 코드를 작성하는 것은 강건한 방법이기 때문입니다. 또한, 미리 입력값을 작성하고 시각적으로 출력값을 확인하기만 하면 되므로, 자연스럽게 테스트 주도 방법론(TDD) 식으로 UI를 설계하게 됩니다.

## 시각적 테스트 주도(test-driven) 개발 배워보기

잘 짜인 디자인대로 앱을 설계하게 되면, 디자인 산출물에 내포된 입력값과 출력값을 가진 명시적인 컴포넌트를 만들어낼 수 있습니다. 시각적 테스팅 과정을 '디자인 스펙'과 연결해보면 테스트 주도 방법론(TDD)과 상당히 유사한 방식으로 테스트를 진행할 수 있습니다.

다음 장에서는, 시각적 테스트 주도 방법론(Visual TDD)을 이용해 예시 컴포넌트를 만들어보면서 지금까지 배웠던 내용을 적용해볼 것입니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/visual-test-driven-development.mp4"
    type="video/mp4">
</video>
