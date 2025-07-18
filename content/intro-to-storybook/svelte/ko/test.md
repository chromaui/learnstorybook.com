---
title: '시각적 테스트하기'
tocTitle: '시각적 테스트'
description: 'UI 컴포넌트를 테스트하는 방법을 알아봅시다'
---

Storybook 튜토리얼은 테스트 없이는 완전하지 않습니다. 테스트는 고품질 UI를 만드는 데 필수적입니다. 모듈식 시스템에서는, 아주 작은 수정이 큰 회귀를 야기시킬 수 있습니다. 지금까지 세 종류의 테스트를 접했습니다:

- **수동 테스트**는 컴포넌트가 올바른지 검증하기 위해 개발자가 수동으로 컴포넌트를 확인하는 것입니다. 이것은 빌드하면서 컴포넌트의 외관을 점검하는 데 도움이 됩니다.

- **접근성 테스트**는 a11y 애드온으로 컴포넌트가 모든 사람들에게 접근성이 좋은지 확인하는 것입니다. 이 테스트를 통해 특정 유형의 장애가 있는 사람들이 우리의 컴포넌트를 어떻게 사용하는지에 대한 정보를 수집할 수 있습니다.

- **컴포넌트 테스트**는 `play` 함수를 통해 컴포넌트와 상호작용할 때 기대한 대로 동작하는 지를 검증합니다. 컴포넌트가 사용될 때의 동작을 테스트하는 데에 좋습니다.

## “그것이 맞을까요?”

안타깝게도 앞서 언급한 테스트 방법만으로는 UI 버그를 예방하기에 충분하지 않습니다. UI는 디자인이 주관적이고 미묘하기 때문에 테스트하기 까다롭습니다. 수동 테스트는, 음, 수동입니다. 스냅샷 테스트 같은 UI 테스트는 거짓 양성(false positive)을 너무 많이 발생시키고, 픽셀 단위의 테스트는 가치가 낮습니다. 완전한 Storybook 테스트 전략에는 시각적 회귀 테스트도 포함됩니다.

## Storybook을 위한 시각적 테스트

시각적 회귀 테스트, 또는 시각적 테스트는 외관상의 변화를 포착하도록 설계되었습니다. 각 스토리의 스크린샷을 캡처한 뒤 커밋 간 비교를 통해 변화를 드러냅니다. 에것은 레이아웃, 색상, 크기, 대비와 같은 그래픽 요소를 검증하는 데 최적입니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook은 모든 스토리가 본질적으로는 테스트 명세서이기 때문에 시각적 회귀 테스트 도구로써 훌륭합니다. 스토리를 작성하거나 업데이트할 때마다 명세를 공짜로 얻습니다!

시각적 회귀 테스트 도구는 여러 가지가 있습니다. 우리는 Storybook 유지 관리자가 만든 무료 게시 서비스인 [**Chromatic**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)을 추천합니다. Chromatic은 번개처럼 빠른 클라우드 브라우저 환경에서 시각적 테스트를 실행합니다. 또한[이전 챕터](/intro-to-storybook/svelte/en/deploy/)에서 보았듯이 Storybook을 온라인에 게시할 수도 있습니다.

## UI 변경 포착하기

시각적 회귀 테스트는 새로 렌더링된 UI 코드의 이미지를 기준 이미지와 비교합니다. UI 변경이 포착되면 알림을 받게 됩니다.

`Task` 컴포넌트의 배경을 약간 수정해서 이것이 어떻게 작동하는지 살펴봅시다.

먼저 변경을 위한 새로운 브랜치를 만듭니다:

```shell
git checkout -b change-task-background
```

`src/components/Task.svelte`를 다음과 같이 변경합니다:

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
+     style="background-color: red;"
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

이렇게 하면 항목의 새로운 배경 색상이 지정됩니다.

![task background change](/intro-to-storybook/chromatic-task-change-7-0.png)

파일을 추가합니다:

```shell
git add .
```

커밋합니다:

```shell
git commit -m "change task background to red"
```

변경 사항을 원격 저장소로 푸시합니다:

```shell
git push -u origin change-task-background
```

마지막으로 GitHub 저장소에서 `change-task-background` 브랜치에 대한 풀 리퀘스트(PR)를 엽니다.

![Creating a PR in GitHub for task](/github/pull-request-background.png)

풀 리퀘스트에 설명 텍스트를 추가하고 `Create pull request`를 클릭합니다. 그리고 페이지 하단의 "🟡 UI Tests"를 클릭합니다.

![Created a PR in GitHub for task](/github/pull-request-background-ok.png)

그러면 커밋으로 인해 포착된 UI 변경 사항을 보여줍니다.

![Chromatic caught changes](/intro-to-storybook/chromatic-catch-changes.png)

변경 사항이 많습니다! `Task`가 `TaskList`와 `Inbox`의 자식인 컴포넌트 계층 구조에서는 작은 수정(Minor tweaks)이 대규모 회귀(Major regressions)로 눈덩이처럼 커집니다. 이런 상황이 개발자들에게 다른 테스트와 더불어 시각적 회귀 테스트가 필요한 이유입니다.

![UI minor tweaks major regressions](/intro-to-storybook/minor-major-regressions.gif)

## 변경 사항 리뷰하기

시각적 회귀 테스트는 컴포넌트가 잘못 변경되는 것을 방지합니다. 하지만 그 변경이 의도된 것인지 아닌지는 직접 판단해야 합니다.

변경이 의도된 것이라면, 앞으로의 테스트가 스토리의 최신 버전과 비교될 수 있도록 기준(baseline)을 업데이트해야 합니다. 변경이 의도되지 않은 것이라면 수정이 필요합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

현대 애플리케이션은 컴포넌트로 구성되어 있으므로, 컴포넌트 수준에서 테스트하는 것이 중요합니다. 이것은 화면이나 복합 컴포넌트 같은 변화의 '증상'에 대응하는 대신, 변화의 근본적인 원인이 되는 컴포넌트에 집중할 수 있게 해줍니다.

## 변경 사항 병합하기

리뷰가 끝났다면, 업데이트가 버그를 발생시키지 않을 것이라는 확신을 가지고 UI 변경을 병합할 준비가 된 것입니다. 새로운 `red` 배경이 마음에 든다면 변경 사항을 승인하고, 마음에 들지 않는다면 이전 상태로 되돌리면 됩니다.

![Changes ready to be merged](/intro-to-storybook/chromatic-review-finished.png)

Storybook은 컴포넌트를 **구축(build)**하는 데 도움을 주고, 테스트는 컴포넌트를 **유지 관리(maintain)**하는 데 도움을 줍니다. 이 튜토리얼에서는 네 가지 UI 테스트-수동 테스트, 스냅샷 테스트, 단위 테스트, 시각적 회귀 테스트-를 다뤘습니다. 수동 테스트를 제외한 세 가지 테스트는 CI에 추가하여 자동화할 수 있고, 이것은 숨어 있는 버그 걱정 없이 컴포넌트를 배포할 수 있도록 합니다. 전체 워크플로우는 아래에 설명되어 있습니다.

![Visual regression testing workflow](/intro-to-storybook/cdd-review-workflow.png)
