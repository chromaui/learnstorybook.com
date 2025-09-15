---
title: '접근성 테스트'
tocTitle: '접근성 테스트'
description: '접근성 테스트를 워크플로우에 통합하는 방법 배우기'
---

지금까지는 기능성과 시각적 테스트에 중점을 두고 UI 컴포넌트를 구축해 왔고, 점점 복잡해지고 있었습니다. 하지만 아직 UI 개발의 중요한 측면 하나인 '접근성'을 고려하지 않았습니다.

## 왜 접근성(A11y)인가?

접근성은 모든 사용자가 능력과 상관없이 컴포넌트와 효과적으로 상호작용할 수 있음을 보장합니다. 여기에는 시각, 청각, 운동, 인지 장애가 있는 사용자도 포함됩니다. 접근성은 올바른 일일 뿐만 아니라, 법적 요구 사항과 업계 표준에 따라 점점 더 의무화되고 있습니다. 이러한 필요성을 고려할 때, 우리는 컴포넌트의 접근성 문제를 일찍 그리고 자주 테스트해야 합니다.

## Storybook으로 접근성 문제 포착하기

Storybook은 컴포넌트의 접근성을 테스트하는 [접근성 애드온](https://storybook.js.org/addons/@storybook/addon-a11y) (A11y)을 제공합니다. [axe-core](https://github.com/dequelabs/axe-core)를 기반으로 만들어졌으며, [WCAG 이슈의 최대 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)를 포착할 수 있습니다.

어떻게 동작하는지 살펴봅시다! 다음 명령을 실행해 애드온을 설치하세요:

```shell
yarn exec storybook add @storybook/addon-a11y
```

<div class="aside">

💡 Storybook의 `add` 명령은 애드온의 설치와 구성을 자동화합니다. 사용 가능한 다른 명령에 대해 더 알아보려면 [공식 문서](https://storybook.js.org/docs/api/cli-options)를 확인하세요.

</div>

Storybook을 재시작하면 UI에서 새 애드온이 활성화된 것을 볼 수 있습니다.

![Task accessibility issue in Storybook](/intro-to-storybook/accessibility-issue-task-non-react-9-0.png)

스토리를 확인해 보면, 애드온이 테스트 상태 중 하나에서 접근성 문제를 발견했음을 알 수 있습니다. [**색 대비**](https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI) 위반은 본질적으로 작업 제목과 배경 사이의 색 대비가 충분하지 않다는 의미입니다. 애플리케이션의 CSS(`src/index.css`)에서 텍스트 색상을 더 어두운 회색으로 바꾸면 빠르게 수정할 수 있습니다.

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
 text-decoration: line-through;
}
```

이게 다입니다. UI가 접근성을 유지하도록 보장하기 위한 첫 걸음을 내디뎠습니다. 그러나 할 일은 아직 끝나지 않았습니다. 접근성 있는 UI를 유지하는 일은 지속적인 과정이며, 앱이 발전하고 UI가 복잡해짐에 따라 회귀가 도입되지 않도록 새로운 접근성 문제를 지속적으로 모니터링해야 합니다.

## Chromatic으로 접근성 테스트하기

Storybook의 접근성 애드온을 사용하면 개발 중에 접근성 문제를 테스트하고 즉각적인 피드백을 받을 수 있습니다. 하지만 접근성 문제를 추적하고 어떤 문제를 우선 해결할지 정하는 일은 쉽지 않을 수 있으며, 별도의 노력이 필요할 수 있습니다. 이때 Chromatic을 사용할 수 있습니다. 앞서 보았듯이 Chromatic으로 컴포넌트를 [시각적으로 테스트](/intro-to-storybook/svelte/en/test/)하여, 컴포넌트가 회귀하는 것을 방지할 수 있었습니다. Chromatic의 [접근성 테스트 기능](https://www.chromatic.com/docs/accessibility)을 사용하여 UI의 접근성을 유지하고 실수로 새로운 위반 사항이 도입되는 것을 막아봅시다.

### 접근성 테스트 활성화

Chromatic 프로젝트로 이동해 **Manage** 페이지로 들어가세요. **Enable** 버튼을 클릭해 프로젝트의 접근성 테스트를 활성화합니다.

![Chromatic accessibility tests enabled](/intro-to-storybook/chromatic-a11y-tests-enabled.png)

### 접근성 테스트 실행

이제 접근성 테스트를 활성화했고 CSS의 색 대비 문제도 수정했으니, 변경 사항을 푸시해 새로운 Chromatic 빌드를 트리거합시다.

```shell:clipboard=false
git add .
git commit -m "Fix color contrast accessibility violation"
git push
```

Chromatic이 실행되면, 향후 테스트 결과를 비교할 출발점으로서 [접근성 기준](https://www.chromatic.com/docs/accessibility/#what-is-an-accessibility-baseline)을 설정합니다. 이를 통해 새 회귀를 도입하지 않으면서도 접근성 문제를 더 효율적으로 우선순위화하고, 해결하고, 수정할 수 있게 됩니다.

![Chromatic build with accessibility tests](/intro-to-storybook/chromatic-build-a11y-tests.png)

이제 개발의 각 단계에서 UI가 접근성을 유지하도록 보장하는 워크플로우를 성공적으로 구축했습니다. 개발 중에는 Storybook이 접근성 문제를 포착하는 데 도움을 주고, Chromatic은 접근성 회귀를 추적하여 시간이 지남에 따라 점진적으로 수정하기 쉽게 만들어 줍니다.
