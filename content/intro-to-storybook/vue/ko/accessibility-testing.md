---
title: '접근성 테스트'
tocTitle: '접근성 테스트'
description: '워크플로우에 접근성 테스트를 통합하는 방법을 배워보세요'
commit: 'c73e174'
---

지금까지 컴포넌트의 기능과 시각적 테스트에 집중하면서 조금씩 복잡한 UI를 만들어왔습니다. 하지만 아직 다루지 않은 중요한 부분이 있습니다. 바로 접근성입니다.

## 왜 접근성(A11y)일까요?

접근성은 시각, 청각, 운동, 인지 장애가 있는 사용자를 포함해 누구나 컴포넌트를 원활하게 사용할 수 있도록 하는 것입니다. 접근성은 사용자를 위해 고려해야 할 사항이면서, 법과 업계 표준에서 준수를 요구하는 경우도 늘고 있습니다. 따라서 개발 초기부터 컴포넌트의 접근성 문제를 자주 확인해야 합니다.

## Storybook으로 접근성 문제 찾기

Storybook은 컴포넌트의 접근성을 테스트하는 [접근성 애드온(A11y)](https://storybook.js.org/addons/@storybook/addon-a11y)을 제공합니다. [axe-core](https://github.com/dequelabs/axe-core)를 기반으로 하며, [WCAG 문제의 최대 57%](https://www.deque.com/blog/automated-testing-study-identifies-57-percent-of-digital-accessibility-issues/)를 찾아낼 수 있습니다.

직접 사용해보겠습니다. 다음 명령어로 애드온을 설치하세요:

```shell
yarn exec storybook add @storybook/addon-a11y
```

<div class="aside">

💡 Storybook의 `add` 명령은 애드온의 설치와 설정을 자동화합니다. 사용 가능한 다른 명령어에 대해 자세히 알아보려면 [공식 문서](https://storybook.js.org/docs/api/cli-options)를 참고하세요.

</div>

Storybook을 재시작하면 UI에서 새 애드온을 확인할 수 있습니다.

![Storybook에서 확인한 Task의 접근성 문제](/intro-to-storybook/accessibility-issue-task-non-react-9-0.png)

스토리를 하나씩 살펴보면 특정 상태에서 접근성 문제가 보고됩니다. [**색상 대비(Color contrast)**](https://dequeuniversity.com/rules/axe/4.10/color-contrast?application=axeAPI) 위반은 작업 제목과 배경의 명암 차이가 충분하지 않다는 뜻입니다. 애플리케이션의 CSS 파일인 `src/index.css`에서 글자색을 더 짙은 회색으로 바꾸면 해결할 수 있습니다.

```diff:title=src/index.css
.list-item.TASK_ARCHIVED input[type="text"] {
- color: #a0aec0;
+ color: #4a5568;
 text-decoration: line-through;
}
```

이제 UI의 접근성을 개선하는 첫 단계를 마쳤습니다. 하지만 한 번 수정했다고 끝나는 일은 아닙니다. 애플리케이션에 기능이 늘고 UI가 복잡해져도 새로운 접근성 문제로 기존 접근성이 나빠지는 회귀가 발생하지 않도록 꾸준히 확인해야 합니다.

## Chromatic을 이용한 접근성 테스트

Storybook의 접근성 애드온을 사용하면 개발 중에 문제를 발견하고 바로 확인할 수 있습니다. 다만 문제를 계속 추적하고 무엇부터 고칠지 정하는 데는 별도의 노력이 필요합니다. 이때 Chromatic을 활용할 수 있습니다. 앞서 [시각적 테스트](/intro-to-storybook/vue/ko/test/)로 UI가 의도치 않게 바뀌는 것을 막았듯이, 이번에는 [접근성 테스트 기능](https://www.chromatic.com/docs/accessibility)으로 새로운 접근성 문제가 생기지 않도록 관리하겠습니다.

### 접근성 테스트 활성화하기

Chromatic 프로젝트의 **Manage** 페이지로 이동합니다. **Enable** 버튼을 클릭하여 해당 프로젝트의 접근성 테스트를 활성화합니다.

![Chromatic에서 접근성 테스트 활성화](/intro-to-storybook/chromatic-a11y-tests-enabled.png)

### 접근성 테스트 실행하기

접근성 테스트를 활성화했고 CSS의 색상 대비 문제도 수정했습니다. 이제 변경 사항을 푸시해 새 Chromatic 빌드를 실행해봅시다.

```shell:clipboard=false
git add .
git commit -m "Fix color contrast accessibility violation"
git push
```

Chromatic이 실행되면 이후 테스트 결과를 비교할 [접근성 기준선](https://www.chromatic.com/docs/accessibility/#what-is-an-accessibility-baseline)이 만들어집니다. 이를 기준으로 기존 문제의 우선순위를 정해 하나씩 해결하고, 새로운 문제가 생기지 않았는지도 확인할 수 있습니다.

<!--

TODO: Follow up with Design for an updated asset
 - Needs a React and non-React version to ensure parity with the tutorial
 -->

![접근성 테스트가 포함된 Chromatic 빌드](/intro-to-storybook/chromatic-build-a11y-tests-non-react.png)

이제 개발의 각 단계에서 UI의 접근성을 유지할 수 있는 작업 흐름을 갖췄습니다. Storybook으로 개발 중에 문제를 찾고, Chromatic으로 접근성 회귀를 추적하면서 문제를 하나씩 해결해나갈 수 있습니다.
