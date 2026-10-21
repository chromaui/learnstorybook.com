---
title: '접근성 테스트'
tocTitle: '접근성 테스트'
description: '워크플로우에 접근성 테스트를 통합하는 방법을 배워보세요'
---

지금까지 우리는 시각적 테스트와 그 기능에 중점을 두고, 점차 복잡도를 높여가며 UI 컴포넌트를 구축하는 것에 집중해 왔습니다. 하지만 아직 UI 개발에 중요한 한 측면을 다루지 않았습니다. 바로 접근성입니다.

## 왜 접근성(A11y)일까요?

접근성은 모든 사용자가 신체적 능력에 관계없이 컴포넌트와 효과적으로 상호작용할 수 있도록 보장합니다. 여기에는 시각, 청각, 운동 또는 인지 장애가 있는 사용자가 포함됩니다. 접근성은 올바른 일일 뿐만 아니라 법적 요구 사항과 업계 표준에 따라 점점 더 의무화되고 있습니다. 이러한 요구 사항을 고려할 때, 우리는 UI 컴포넌트의 접근성을 개발 초기부터 자주 테스트해야 합니다.

## Storybook으로 접근성 문제 해결하기

Storybook은 컴포넌트의 접근성을 테스트하는 데 도움을 주는 [접근성 애드온](https://storybook.js.org/addons/@storybook/addon-a11y) (A11y)을 제공합니다. [axe-core](https://github.com/dequelabs/axe-core)를 기반으로 하며, [WCAG 문제의 최대 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)를 포착할 수 있습니다.

어떻게 작동하는지 봅시다! 애드온을 설치하려면 다음 명령을 실행하세요:

```shell
yarn exec storybook add @storybook/addon-a11y
```

<div class="aside">

💡 Storybook의 `add` 명령은 애드온의 설치와 설정을 자동화합니다. 사용 가능한 다른 명령어에 대해 자세히 알아보려면 [공식 문서](https://storybook.js.org/docs/api/cli-options)를 참조하세요.

</div>

스토리북을 재시작하여 UI에서 새로운 애드온이 활성화되었는지 확인하세요.

![Task accessibility issue in Storybook](/intro-to-storybook/accessibility-issue-task-react-9-0.png)

스토리들을 순환하면서, 애드온이 테스트 상태 중 하나에서 접근성 문제를 발견한 것을 볼 수 있습니다.[**"색상 대비"**](https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI)위반은 기본적으로 작업 제목 색과 배경 색 간의 대비가 충분하지 않다는 의미입니다. 애플리케이션의 CSS(`src/index.css`)에서 텍스트 색상을 더 어두운 회색으로 변경하여 간단히 해결할 수 있습니다.

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
 text-decoration: line-through;
}
```

됐습니다! 우리는 UI 접근성 확보의 첫 걸음을 뗐습니다. 하지만 이게 우리가 해야할 일의 끝은 아닙니다. 접근성을 유지하는것은 지속적인 과정이며 우리는 애플리케이션의 발전하고 UI가 복잡해짐에 따라 새로운 접근성 문제나 회귀 현상이 발생하지 않도록 모니터링해야 합니다.

## Chromatic을 이용한 접근성 테스트

스토리북의 접근성 애드온을 사용하면 개발 중에 접근성 문제를 테스트하고 즉각적인 피드백을 받을 수 있습니다. 하지만 접근성 문제를 추적하는 것은 쉽지 않은 일이며, 어떤 문제를 먼저 해결할지 우선순위를 정하는 데에도 노력이 필요할 수 있습니다. 바로 이 때 Chromatic이 도움을 줄 수 있습니다. 이미 보았듯이, Chromatic은 [시각적 테스트](/intro-to-storybook/react/ko/test/)를 통해 회귀를 방지하는 데 도움을 주었습니다. 이제 [접근성 테스트 기능](https://www.chromatic.com/docs/accessibility)을 사용하여 UI가 접근성을 유지하도록 하고, 실수로 새로운 위반 사항이 발생하지 않도록 할 것입니다.

### 접근성 테스트 활성화하기

Chromatic 프로젝트로 이동하여 **Manage** 페이지로 이동합니다. **Enable** 버튼을 클릭하여 해당 프로젝트의 접근성 테스트를 활성화합니다.

![Chromatic accessibility tests enabled](/intro-to-storybook/chromatic-a11y-tests-enabled.png)

### 접근성 테스트 실행하기

이제 접근성 테스트를 활성화 했고 CSS의 색상 대비 문제를 해결했으니, 변경 사항을 푸시하여 새로운 Chromatic 빌드를 실행해 봅시다.

```shell:clipboard=false
git add .
git commit -m "Fix color contrast accessibility violation"
git push
```

Chromatic이 실행되면, 향후 진행할 테스트들의 기준점이 될 [접근성 기준선](https://www.chromatic.com/docs/accessibility/#what-is-an-accessibility-baseline)을 설정합니다. 이를 통해 우리는 새로운 회귀 현상을 일으키지 않으면서 효과적으로 우선순위에 따라 해결할 수 있습니다.

<!--

TODO: Follow up with Design for an updated asset
 - Needs a React and non-React version to ensure parity with the tutorial
 -->

![Chromatic build with accessibility tests](/intro-to-storybook/chromatic-build-a11y-tests-react.png)

이제 우리는 성공적으로 개발의 모든 단계에서 UI가 접근성을 유지할 수 있는 워크플로우를 구축했습니다. Storybook이 개발 과정에서 발생하는 접근성 문제를 발견하는데 도움을 준다면, Chromatic은 접근성 회귀 현상을 추적하고 점진적으로 해결해나가기 쉽게 만들어줍니다.
