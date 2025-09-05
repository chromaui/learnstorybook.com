---
title: '애드온'
tocTitle: '애드온'
description: '유명한 Controls 애드온을 통합하고 사용하는 방법을 배워봅시다'
---

Storybook에는 팀의 개발 경험을 향상시킬 수 있는 탄탄한 [애드온](https://storybook.js.org/docs/configure/storybook-addons) 생태계가 있습니다. 모든 애드온은 [여기](https://storybook.js.org/integrations)에서 볼 수 있습니다.

이 튜토리얼을 따라왔다면, 이미 여러 애드온을 접했을 것이고, [시각적 테스트](/intro-to-storybook/svelte/en/test/) 챕터에서 실제로 설정해보았습니다.

여러 가능한 사용 사례를 위한 애드온이 존재하며, 그것들을 모두 다루려면 끝이 없을 겁니다. 여기서는 잘 알려진 애드온인 [Controls](https://storybook.js.org/docs/essentials/controls)를 통합해 봅시다.

## Controls란?

Controls는 디자이너와 개발자가 컴포넌트의 인자를 가지고 놀면서 동작을 확인할 수 있게 합니다. 코드가 필요하지 않습니다. Controls는 스토리 옆에 애드온 패널을 생성하여 인자를 실시간으로 편집할 수 있게 해줍니다.

Storybook을 새로 설치하면 Controls가 기본으로 포함되어 있습니다. 추가 설정은 필요하지 않습니다.

<!-- record video  -->
<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/controls-in-action-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

## 애드온은 새로운 Storybook 워크플로우를 열어줍니다.

Storybook은 훌륭한 [컴포넌트 주도 개발 환경](https://www.componentdriven.org/)입니다. Controls 애드온은 Storybook을 상호작용 가능한 문서화 도구로 진화시킵니다.

### Controls로 엣지 케이스 찾기

Controls를 사용하면 QA 엔지니어, UI 엔지니어 또는 다른 이해관계자 누구든지 컴포넌트를 한계까지 밀어붙일 수 있습니다! 다음 예제를 봅시다. `Task` 컴포넌트에 **거대한** 문자열을 추가하면 어떤 일이 벌어질까요?

![Oh no! The far right content is cut-off!](/intro-to-storybook/task-edge-case-7-0.png)

이것은 잘못 됐습니다! 텍스트가 `Task` 컴포넌트의 경계를 넘어서고 있습니다.

Controls를 사용하면 컴포넌트에 다양한 입력--이 경우에는 긴 문자열--을 빠르게 확인할 수 있었고, 여러 UI 문제를 발견하기 위해 필요한 작업을 줄일 수 있습니다.

이번에는 `Task.svelte`에 스타일을 추가해서 오버플로우 문제를 해결해 봅시다:

```diff:title=src/components/Task.svelte
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
+     style="text-overflow: ellipsis;"
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

![That's better.](/intro-to-storybook/edge-case-solved-with-controls-7-0.png)

문제가 해결됐습니다! 텍스트가 `Task` 컴포넌트 영역의 경계에 도달하면 멋진 줄임표를 사용하여 잘립니다.

### 회귀를 방지하기 위한 새 스토리 추가하기

앞으로 우리는 Controls를 통해 같은 문자열을 입력하여 위의 문제를 재현할 수 있습니다. 하지만 이 엣지 케이스를 보여주는 스토리를 작성하는 것이 더 쉽습니다. 이렇게 하면 회귀 테스트 커버리지가 확장되고 팀의 다른 구성원들에게 컴포넌트의 한계를 명확하게 제시할 수 있습니다.

`Task.stories.js`에 긴 텍스트가 사용되는 스토리를 추가해 봅시다:

```js:title=src/components/Task.stories.js
const longTitleString = `This task's name is absurdly large. In fact, I think if I keep going I might end up with content overflow. What will happen? The star that represents a pinned task could have text overlapping. The text could cut-off abruptly when it reaches the star. I hope not!`;

export const LongTitle = {
  args: {
    task: {
      ...Default.args.task,
      title: longTitleString,
    },
  },
};
```

이제 해당 엣지 케이스를 손쉽게 재현하고 작업할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/intro-to-storybook/task-stories-long-title-svelte-7-0.mp4"
    type="video/mp4"
  />
</video>

[시각적 테스트](/intro-to-storybook/svelte/en/test/)를 수행하고 있다면, 텍스트를 자르는(truncatiing) 해결책이 망가질 때에도 알림을 받을 수 있습니다. 테스트 커버리지 없이는 모호한 엣지 케이스는 쉽게 잊혀질 거예요!

<div class="aside">

💡 Controls는 비개발자도 여러분의 컴포넌트와 스토리를 다뤄볼 수 있게 해 주는 훌륭한 방법입니다. 여기에서 본 것보다 훨씬 더 많은 기능을 수행할 수 있으니, 자세한 내용은 [공식 문서](https://storybook.js.org/docs/essentials/controls)를 확인해 보세요. 또한 애드온을 사용하여 Storybook을 여러분의 워크플로우에 맞춰 다양하게 커스텀할 수 있습니다. [애드온 만들기 가이드](https://storybook.js.org/docs/addons/writing-addons)에서는 개발 워크플로우를 강화하는 데 도움이 될 애드온을 직접 만들어 볼 수 있을 거예요.

</div>

### 변경 사항 병합하기

git으로 변경 사항을 병합하는 것을 잊지 마세요!
