---
title: 'UI 컴포넌트 테스트'
tocTitle: '테스트'
description: 'UI 컴포넌트 테스트 방법 배우기'
---

테스팅 없이는 스토리북(Storybook) 튜토리얼을 완료했다고 할 수 없습니다. 테스팅은 고품질의 UI를 만드는 데 필수적입니다. 모듈식 시스템에서는 미세한 변화가 중대한 회귀를 초래할 수도 있습니다. 지금까지 우리는 세 가지 유형의 테스트를 경험했습니다.

- **수동 테스트**는 개발자가 컴포넌트의 정확성을 수동으로 확인하여 정확성을 검증합니다. 빌드 시 컴포넌트의 모양이 온전한지 확인하는 데 도움이 됩니다.
- **스냅샷 테스트**는 Storyshots을 사용하여 컴포넌트가 렌더링 된 마크업을 캡처합니다. 렌더링 오류 및 경고를 유발하는 마크업의 변경사항을 파악하는데 도움을 줍니다.
- **단위 테스트**는 Jest를 사용하여 컴포넌트의 출력이 고정 입력값에서 동일하게 유지되는지를 확인합니다. 컴포넌트의 기능적 품질을 테스트하는데 유용합니다.

## “자동 테스트만 진행해도 괜찮을까요?”

안타깝게도 위에서 언급한 테스트 방법만으로는 UI 버그를 예방하기에 충분하지 않습니다. 디자인은 주관적이고 미묘해서 UI는 테스트하기가 까다롭습니다. 수동 테스트는, 음... 수동입니다. UI에 사용되는 스냅샷 테스트는 많은 오탐을 발생하고, 픽셀 수준 단위 테스트는 가치가 없습니다. 완전한 스토리북의 테스트 전략에는 시각적 회귀 테스트도 포함됩니다.

## 스토리북용 시각적 테스트

시각적 테스트라고도 하는 시각적 회귀 테스트(Visual regression test)는 모양의 변화를 포착하도록 설계되었습니다. 모든 스토리(story)의 스크린샷을 캡처하고 commit 간 표면 변경 사항을 비교하며 작동합니다. 레이아웃, 색상, 크기 및 대비와 같은 그래픽 요소를 확인하는데 적합합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

스토리북은 모든 스토리가 본질적으로 테스트 사양이므로 시각적 회귀 테스트를 위한 환상적인 도구입니다. 스토리를 작성하거나 업데이트할 때마다 무료로 스펙(spec)을 제공합니다.

시각적 회귀 테스트를 위한 몇 가지 도구가 있습니다. 스토리북 관리자들에 의해 만들어진 무료 배포 서비스로 병렬화된 클라우드에서 시각적 테스트를 실행하는 [**크로마틱(Chromatic)**](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook/)을 추천합니다. [이전 장](/intro-to-storybook/react/ko/deploy/)에서 보았듯이 온라인으로 스토리북을 배포할 수도 있습니다.

## UI 변화 파악

시각적 회귀 테스트는 새로 렌더링 된 UI 코드의 이미지를 기준 이미지와 비교하는 것에 의존합니다. UI 변경이 포착되면 알림을 받게 됩니다.

`Task` 컴포넌트의 배경을 변경하여 작동 방식을 살펴보겠습니다.

변경을 위한 새로운 브랜치를 만드는 것부터 시작하세요:

```shell
git checkout -b change-task-background
```

`src/components/Task.jsx`를 다음과 같이 변경하세요:

```diff:title=src/components/Task.jsx
export default function Task({ task: { id, title, state }, onArchiveTask, onPinTask }) {
  return (
    <div className={`list-item ${state}`}>
      <label
        htmlFor={`archiveTask-${id}`}
        aria-label={`archiveTask-${id}`}
        className="checkbox"
      >
        <input
          type="checkbox"
          disabled={true}
          name="checked"
          id={`archiveTask-${id}`}
          checked={state === "TASK_ARCHIVED"}
        />
        <span
          className="checkbox-custom"
          onClick={() => onArchiveTask(id)}
        />
      </label>

      <label htmlFor={`title-${id}`} aria-label={title} className="title">
        <input
          type="text"
          value={title}
          readOnly={true}
          name="title"
          id={`title-${id}`}
          placeholder="Input title"
+         style={{ backgroundColor: 'red' }}
        />
      </label>

      {state !== "TASK_ARCHIVED" && (
        <button
          className="pin-button"
          onClick={() => onPinTask(id)}
          id={`pinTask-${id}`}
          aria-label={`pinTask-${id}`}
          key={`pinTask-${id}`}
        >
          <span className={`icon-star`} />
        </button>
      )}
    </div>
  );
}
```

항목에 대한 새로운 배경색이 생성됩니다.

![task 배경 변경](/intro-to-storybook/chromatic-task-change-7-0.png)

파일을 추가합니다:

```shell
git add .
```

그리고 추가된 파일을 commit합니다:

```shell
git commit -m "change task background to red"
```

그리고 변경 사항을 원격 저장소로 push해줍니다:

```shell
git push -u origin change-task-background
```

마지막으로 깃허브(Github) 저장소를 열어 `change-task-background` 브랜치에 대한 풀 리퀘스트(pull request)를 엽니다.

![깃허브 저장소에서 task에 대한 PR 생성](/github/pull-request-background.png)

풀 리퀘스트에 설명을 추가하고 `Create pull request` 을 클릭합니다. 그리고 페이지 하단에서 "🟡 UI Tests" PR 확인을 클릭합니다.

![깃허브 저장소에서 task에 대한 PR 생성](/github/pull-request-background-ok.png)

commit에 의해 포착된 UI 변경 사항이 표시됩니다.

![크로마틱이 포착한 변화](/intro-to-storybook/chromatic-catch-changes.png)

많은 변화가 있습니다! `Task` 컴포넌트가 `TaskList`와 `Inbox`의 자식인 컴포넌트의 계층 구조를 통해 작은 변화가 눈덩이처럼 불어나 큰 회귀로 이어지는 것을 알 수 있습니다. 이러한 상황이 바로 개발자가 다른 테스트 방법 이외에도 시각적 회귀 테스트가 필요한 이유입니다.

![작은 UI 변화와 큰 회귀](/intro-to-storybook/minor-major-regressions.gif)

## 변경사항 검토

시각적 회귀 테스트는 컴포넌트를 실수로 변경되지 않도록 합니다. 그러나 변경이 의도적인지 여부를 결정하는 것은 여전히 우리에게 달렸습니다.

의도적인 변경이라면, 향후 테스트를 가장 최신 버전의 스토리와 비교할 수 있도록 기준을 업데이트해야 합니다. 만약 의도하지 않은 변경이라면 이는 수정해야 합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

최신 앱은 컴포넌트로 구성되기 때문에 컴포넌트 레벨에서 테스트하는 것이 중요합니다. 이는 변경 사항의 증상, 화면 및 복합적 컴포넌트에 반응하는 대신 변경의 근본 원인인 컴포넌트를 정확히 파악할 수 있습니다.

## 변경 사항 병합(merge)

검토를 마치면 업데이트로 인해 실수로 버그가 발생하지 않는다는 것을 알고 자신 있게 UI 변경 사항을 merge할 준비가 된 것입니다. 새 `빨간색` 배경이 마음에 들면 변경을 수락하고 아니라면 이전 상태로 되돌립니다.

![병합할 수 있는 변경사항](/intro-to-storybook/chromatic-review-finished.png)

스토리북은 컴포넌트를 **제작**하는 데 도움을 주며, 테스트는 이를 **유지**하는 데 도움이 됩니다. 본 튜토리얼에서 다루는 네 가지 유형의 UI 테스트는 수동, 스냅샷, 단위 및 시각적 회귀 테스트였습니다. 방금 설정을 마친 대로 마지막 3개를 CI에 추가하여 자동화할 수 있었으며 숨은 버그에 대한 걱정 없이 컴포넌트를 배포하는 데 도움이 되었습니다. 전체 작업 흐름이 아래에 나와 있습니다.

![시각적 회귀 테스트 작업 흐름](/intro-to-storybook/cdd-review-workflow.png)
