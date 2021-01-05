---
title: 'UI 컴포넌트 테스트하기'
tocTitle: '테스트'
description: 'UI 컴포넌트를 테스트하는 방법을 배워봅시다'
---

테스팅 없이는 Storybook 튜토리얼을 완료했다고 할 수 없을 것입니다. 테스팅은 고품질의 UI를 만드는 데 필수적입니다. 모듈식 시스템에서는 미세한 변화가 중대한 회귀를 초래할 수도 있습니다. 지금까지 우리는 세 가지 유형의 테스트를 접해보았습니다.

- **수동 테스트**는 개발자가 컴포넌트의 정확성을 수동으로 확인하여 검증합니다. 빌드 할 때 컴포넌트의 모습이 온전한지 점검하는데 도움이 됩니다.
- **스냅샷 테스트**는 Storyshots을 사용하여 컴포넌트가 렌더링 된 마크업을 캡처합니다. 렌더링 오류와 경고를 유발하는 마크업의 변경사항을 파악하는데 도움을 줍니다.
- **단위 테스트**는 Jest를 사용하여 고정된 입력값을 주었을 때 컴포넌트의 출력 값이 동일하게 유지되는지를 확인합니다. 컴포넌트의 기능적 품질을 테스트하는데 유용합니다.

## “괜찮은 것처럼 보이시나요?”

안타깝게도 위에서 언급한 테스트 방법만으로는 UI 버그를 예방하기에 충분하지 않습니다. 디자인은 주관적이고 뉘앙스가 있기 때문에 UI는 테스트하기가 까다롭습니다. 수동 테스트는, 음... 수동입니다. Snapshot 테스트는 UI에 사용될 때 코드가 정상임에도 테스트가 실패하는 경우를 많이 유발합니다. 픽셀 수준의 단위 테스트는 가치가 낮습니다. 전체 Storybook의 테스트 전략은 시각적 회귀 테스트 또한 포함해야 합니다.

## Storybook을 위한 시각적 테스트

시각적 테스트라고도 하는 시각적 회귀 테스트(Visual regression test)는 외관상의 변화를 포착하도록 설계되었습니다. 모든 스토리의 스크린샷을 캡처하고 표면상 바뀐 부분을 커밋 간 비교하는 방식으로 작동합니다. 이는 레이아웃, 색상, 크기, 대비와 같은 그래픽 요소를 확인하는데 완벽합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/visual-regression-testing.mp4"
    type="video/mp4"
  />
</video>

Storybook은 시각적 회귀 테스트를 위한 멋진 도구입니다. 모든 스토리는 본질적으로 테스트 사양이라고 볼 수 있기 때문입니다. 우리가 스토리를 작성하고 업데이트할 때마다 우리는 무료로 그에 대한 사양을 얻을 수 있습니다!

시각적 회귀 테스트를 위한 여러 가지 도구가 있습니다. 저희는 Storybook 관리자들에 의해 만들어졌으며 병렬화된 클라우드에서 시각적 테스트를 실행하는 무료 배포 서비스인 [**Chromatic**](https://www.chromatic.com/)을 권장합니다. [이전 챕터](/react/ko/deploy/)에서 보셨듯이 이를 활용하여 온라인으로 Storybook을 배포할 수도 있습니다.

## UI 변화를 찾아내기

시각적 회귀 테스트는 새로 렌더링 된 UI 코드의 이미지와 기준 이미지를 비교하는 것에 의존합니다. 만일 UI 변경이 있다면 우리는 그에 대한 알림을 받을 수 있습니다.

`Task` 컴포넌트의 배경을 수정하여 어떻게 작동하는지 함께 살펴보겠습니다.

이 변경사항을 위하여 새로운 브랜치를 만들어주세요.

```bash
git checkout -b change-task-background
```

`Task`를 다음과 같이 바꿔주세요:

```js
// src/components/Task.js
<div className="title">
  <input
    type="text"
    value={title}
    readOnly={true}
    placeholder="Input title"
    style={{ background: 'red' }}
  />
</div>
```

이는 새로운 배경색을 연출할 것입니다.

![task의 배경이 변화함](/intro-to-storybook/chromatic-task-change.png)

아래 파일을 추가해주세요:

```bash
git add .
```

커밋해주세요:

```bash
git commit -m “change task background to red”
```

그런 다음 변경 사항을 원격 저장소로 푸시해주세요:

```bash
git push -u origin change-task-background
```

마지막으로 GitHub 저장소를 열어 `change-task-background` 브랜치에 대한 pull request를 해주세요.

![GitHub 저장소에서 task에 대한 PR을 작성하기](/github/pull-request-background.png)

pull request에 설명을 추가하고 `Create pull request` 버튼을 클릭해주세요. 그리고 페이지 하단의 pull request를 확인하는 부분에서 "🟡 UI Tests" 클릭하세요.

![GitHub 저장소에서 task에 대해 작성된 PR](/github/pull-request-background-ok.png)

이를 통해 커밋에서 잡아낸 UI 변경사항을 보실 수 있을 것입니다.

![Chromatic이 잡아낸 변화](/intro-to-storybook/chromatic-catch-changes.png)

바뀐 부분이 많이 있네요! `Task` 컴포넌트가 `TaskList`와 `Inbox`의 자식인 컴포넌트의 계층 구조를 통해 작은 변화가 눈덩이처럼 불어나 큰 회귀로 이어지는 것을 알 수 있습니다. 이러한 상황이 바로 개발자가 다른 테스트 방법 이외에도 시각적 회귀 테스트를 필요로 하는 이유입니다.

![작은 UI 변화와 큰 회귀](/intro-to-storybook/minor-major-regressions.gif)

## 변화를 검토하기

시각적 회귀 테스트는 컴포넌트를 실수로 변경하지 않도록 해줍니다. 하지만 그러한 변경이 의도적인 것인지 아닌지를 결정하는 것은 우리에게 달렸습니다.

의도적으로 변경한 경우라면, 향후 테스트를 가장 최신 버전의 스토리와 비교할 수 있도록 기준을 업데이트해주어야 합니다. 만약 의도하지 않은 변경이라면 이는 수정해주어야 합니다.

<video autoPlay muted playsInline loop style="width:480px; margin: 0 auto;">
  <source
    src="/intro-to-storybook/website-workflow-review-merge-optimized.mp4"
    type="video/mp4"
  />
</video>

모던한 앱은 컴포넌트로 구성되기 때문에 컴포넌트 수준에서 테스트하는 것이 중요합니다. 이는 변경 사항의 증상, 화면 및 복합적 컴포넌트에 반응하는 대신 변경의 근본 원인인 컴포넌트를 정확히 짚어 낼 수 있게 도와줍니다.

## 변경 사항 병합하기

업데이트로 인해 실수로 버그가 발생하지 않을 것이라는 검토가 끝나면 UI 변경 사항을 자신있게 병합(merge) 할 준비가 된 것입니다. 새로운 `빨간색` 배경이 마음에 드신다면 변경을 수락해주시고, 아니라면 이전 상태로 되돌려주세요.

![변경 사항의 병합 준비](/intro-to-storybook/chromatic-review-finished.png)

Storybook은 컴포넌트를 **제작**하는데 도움을 주며, 테스트는 이를 **유지**하는데 도움이 됩니다. 본 튜토리얼에서 살펴본 네 가지 유형의 UI 테스트는 시각적, 스냅샷, 단위, 시각적 회귀 테스트였습니다. 마지막 세 가지 유형은 방금 설정해본 것과 같이 CI에 추가하여 자동화할 수 있었습니다. 이를 통해 몰래 숨어든 버그에 대한 걱정없이 컴포넌트를 배포할 수 있도록 도와줍니다. 전체 작업 과정이 아래에 설명되어 있습니다.

![시각적 회귀 테스트 작업 과정](/intro-to-storybook/cdd-review-workflow.png)
