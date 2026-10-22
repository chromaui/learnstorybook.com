---
title: '시각적 테스트'
tocTitle: '시각적 테스트'
description: 'UI 컴포넌트를 테스트하는 방법을 배워보세요'
---

Storybook 튜토리얼에서 테스트를 빼놓을 수는 없습니다. 완성도 높은 UI를 만들려면 테스트가 필요합니다. 여러 컴포넌트가 맞물려 동작하는 시스템에서는 작은 수정 하나가 기존에 잘 동작하던 UI를 망가뜨리는 큰 회귀(regression)로 이어질 수 있습니다. 지금까지 다음 두 가지 테스트를 살펴봤습니다:

- Storybook과 Vitest를 연동한 **컴포넌트 테스트**는 실제 브라우저 환경에서 컴포넌트의 렌더링과 동작을 자동으로 확인합니다.
- `play` 함수를 사용하는 **상호작용 테스트**는 사용자가 컴포넌트를 조작했을 때 예상대로 동작하는지 확인합니다. 실제 사용 중에 나타나는 컴포넌트의 동작을 테스트하기에 적합합니다.

## 제대로 보이는지도 확인해야 합니다

앞서 살펴본 테스트만으로는 UI 버그를 모두 막을 수 없습니다. 디자인에는 주관적인 판단과 미묘한 차이가 있어 테스트가 까다롭습니다. 수동 테스트는 매번 사람이 확인해야 하고, 스냅샷 테스트는 문제가 아닌 변경까지 오류로 잡아내는 경우가 많습니다. 픽셀 단위의 유닛 테스트도 들이는 노력에 비해 얻는 효과가 적습니다. 따라서 Storybook의 테스트 전략에는 시각적 회귀 테스트도 포함되어야 합니다.

## Storybook으로 시각적 테스트하기

시각적 테스트는 UI의 모습이 의도치 않게 바뀌는 시각적 회귀를 찾아내고, UI의 외관을 일관되게 유지하는 데 도움을 줍니다. 각 테스트의 화면을 캡처하고 커밋 간에 비교해 달라진 부분을 보여줍니다. 레이아웃, 색상, 크기, 대비처럼 눈에 보이는 요소를 확인하는 데 적합합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook의 각 스토리는 그 자체로 테스트 명세이기도 합니다. 스토리를 작성하거나 수정할 때마다 별도의 작업 없이 시각적 테스트에 필요한 명세가 마련됩니다.

시각적 테스트 도구는 여러 가지가 있습니다. 여기서는 Storybook 유지 관리팀이 만든 무료 배포 서비스인 [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)을 권장합니다. 클라우드 브라우저 환경에서 시각적 테스트를 빠르게 실행하며, [이전 장](/intro-to-storybook/vue/ko/deploy/)에서 살펴본 것처럼 Storybook을 온라인에 배포할 수도 있습니다.

## UI 변경 감지하기

시각적 테스트는 새 코드로 렌더링한 UI 이미지를 기준 이미지와 비교합니다. UI가 달라졌다면 알림을 받게 됩니다.

`Task` 컴포넌트의 배경색을 바꿔 어떻게 동작하는지 살펴보겠습니다.

먼저 이 작업을 위한 새 브랜치를 만듭니다:

```shell
git checkout -b change-task-background
```

`src/components/Task.vue`를 다음과 같이 수정하세요:

```diff:title=src/components/Task.vue
<template>
  <div :class="classes">
    <label :for="'checked' + task.id" :aria-label="'archiveTask-' + task.id" class="checkbox">
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
+       style="background-color: red"
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

<script lang="ts" setup>
import type { TaskData } from '../types'

import { computed } from 'vue'

type TaskProps = {
  /** Composition of the task */
  task: TaskData
  /** Event to change the task to archived */
  onArchiveTask: (id: string) => void
  /** Event to change the task to pinned */
  onPinTask: (id: string) => void
}

const props = defineProps<TaskProps>()

const classes = computed(() => {
  return `list-item ${props.task.state}`
})

/*
 * Computed property for checking the state of the task
 */
const isChecked = computed(() => props.task.state === 'TASK_ARCHIVED')

const emit = defineEmits<{
  (e: 'archive-task', id: string): void
  (e: 'pin-task', id: string): void
}>()

/**
 * Event handler for archiving tasks
 */
function archiveTask() {
  emit('archive-task', props.task.id)
}

/**
 * Event handler for pinning tasks
 */
function pinTask(): void {
  emit('pin-task', props.task.id)
}
</script>
```

이렇게 하면 작업의 배경색이 바뀝니다.

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
   - Filename should be as follows:
     - chromatic-task-changes-non-react-9-0.png
 -->

![작업의 배경색 변경](/intro-to-storybook/chromatic-task-changes-non-react-9-0.png)

변경한 파일을 스테이징합니다:

```shell
git add .
```

변경 사항을 커밋합니다:

```shell
git commit -m "change task background to red"
```

이어서 원격 저장소에 푸시합니다:

```shell
git push -u origin change-task-background
```

마지막으로 GitHub 저장소에서 `change-task-background` 브랜치의 풀 리퀘스트를 만듭니다.

![GitHub에서 풀 리퀘스트 만들기](/github/pull-request-background.png)

변경 내용을 설명하고 `Create pull request`를 클릭하세요. 그런 다음 페이지 아래쪽의 PR 검사 항목에서 "🟡 UI Tests"를 클릭합니다.

![GitHub에 생성된 풀 리퀘스트](/github/pull-request-background-ok.png)

이번 커밋에서 감지된 UI 변경 사항이 표시됩니다.

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
 -->

![Chromatic이 감지한 변경 사항](/intro-to-storybook/chromatic-catch-changes.png)

생각보다 많은 곳이 바뀌었습니다. `Task`는 `PureTaskList`와 `InboxScreen`의 하위 컴포넌트이므로, 작은 수정 하나가 여러 컴포넌트와 화면으로 번져 큰 회귀 문제를 일으킬 수 있습니다. 시각적 테스트를 다른 테스트와 함께 사용해야 하는 이유입니다.

![작은 UI 수정이 여러 화면에 미치는 영향](/intro-to-storybook/minor-major-regressions.gif)

## 변경 사항 검토하기

시각적 테스트는 컴포넌트가 의도치 않게 바뀌는 것을 막아줍니다. 다만 감지된 변경이 의도한 것인지 판단하는 일은 여전히 개발자의 몫입니다.

의도한 변경이라면 다음 테스트부터 최신 스토리를 기준으로 비교하도록 기준 이미지를 갱신합니다. 의도하지 않은 변경이라면 코드를 수정해야 합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

컴포넌트로 구성된 애플리케이션은 컴포넌트 단위로 테스트하는 것이 중요합니다. 그래야 화면이나 복합 컴포넌트에 나타난 증상만 보고 대응하는 대신, 변경의 원인이 된 컴포넌트를 정확히 찾을 수 있습니다.

## 변경 사항 병합하기

검토를 마쳤다면 의도치 않은 버그가 없는지 확인한 상태에서 UI 변경 사항을 병합할 수 있습니다. 새로 바꾼 빨간 배경색(`red`)을 적용하려면 변경을 승인하고, 그렇지 않다면 이전 상태로 되돌리세요.

<!--
 TODO: Follow up with Design for:
   - A non-React version of this asset to include PureTaskList to align with the overall design and tutorial structure
 -->

![검토를 마치고 병합을 기다리는 변경 사항](/intro-to-storybook/chromatic-review-finished.png)

Storybook은 컴포넌트를 **만드는** 데, 테스트는 컴포넌트를 **유지 관리하는** 데 도움을 줍니다. 지금까지 UI를 직접 확인하는 수동 테스트와 시각적 테스트를 살펴봤습니다. 앞서 설정한 CI에서 이러한 검사 과정을 자동화하면, 미처 발견하지 못한 버그에 대한 걱정을 줄이고 컴포넌트를 배포할 수 있습니다. 하지만 테스트할 부분은 더 남아 있습니다. 장애가 있는 사용자를 포함해 누구나 컴포넌트를 사용할 수 있는지도 확인해야 합니다. 다음 장에서는 개발 과정에 접근성 테스트를 추가하겠습니다.
