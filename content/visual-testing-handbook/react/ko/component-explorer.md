---
title: '컴포넌트 탐색기'
tocTitle: '컴포넌트 탐색기'
description: 'UI 개발과 시각적 테스팅을 위한 도구'/
commit: ''
---

최신 UI는 상태, 언어, 장치, 브라우저 및 사용자 데이터의 무수한 조합을 지원합니다. 과거에는 UI 개발이 번거로웠습니다. 적절한 설정을 사용하여 올바른 장치에서 주어진 페이지로 이동해야 합니다. 그런 다음 주변을 클릭하여 페이지를 올바른 상태로 전환하여 코딩을 시작할 수 있습니다.

**컴포넌트 탐색기는 비즈니스 로직과 애플리케이션 context로부터 UI문제를 분리합니다.** 각 컴포넌트의 지원되는 변화형(variation)에 초점을 맞추기 위해 UI 컴포넌트를 별도로 빌드합니다. 이렇게 함으로써 입력값(props, state 등)이 렌더링된 UI에 어떻게 영향을 주는지 측정하게 해주고, test suite의 기반을 형성해줍니다.

[Storybook](https://storybook.js.org/)은 시각적 테스팅을 시연하기 위해 사용하는 업계 표준 컴포넌트 탐색기입니다. Twitter, Slack, Airbnb, Shopify, Stripe와 수 천개의 회사에서 채택하고 있어서 어디에서 일하든지 이 안내서의 학습 내용을 적용할 수 있습니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/storybook-component-explorer-visual-testing.mp4"
    type="video/mp4"/>
</video>

## UI를 별도로 빌드하는 이유는 무엇일까요?

### 버그 줄이기

컴포넌트와 state가 많아질수록, 사용자의 장치들과 브라우저들에서 올바르게 렌더링될지 확인하는 건 더욱 어려워집니다.

컴포넌트 탐색기는 컴포넌트가 지원하는 변화형(variation)을 화면에 표시해 비일관성을 방지합니다. 이는 개발자들이 각각의 state에 독립적으로 집중할 수 있게 합니다. 각각의 변화형들은 개별적으로 테스트될 수 있고, mocking을 통해 복잡한 edge case들을 재현할 수 있습니다.

![컴포넌트 테스트 케이스](/visual-testing-handbook/component-test-cases.png)

### 더 빠른 개발

애플리케이션 개발은 절대 끝나지 않습니다. 계속해서 반복해야 합니다. 그렇기 때문에 UI 아키텍처는 새로운 기능을 잘 수용할 수 있어야 합니다. 컴포넌트 모델은 UI를 애플리케이션 비즈니스 로직과 백앤드에서 분리해 호환성을 높입니다.

컴포넌트 탐색기는 애플리케이션에서 떨어져 독립적으로 UI를 개발할 수 있는 샌드박스를 제공해서 이런 구분을 명확하게 합니다. 즉 애플리케이션의 다른 부분에서 방해를 받거나 state가 오염되는 일 없이 각자 다른 UI를 동시에 작업할 수 있습니다. 

### 더 쉬워진 협업

UI의 본질은 시각적입니다. 코드만으로 이루어진 pull request는 작업을 나타내기에 불완전합니다. 진정한 협업을 위해서는 이해관계자가 UI를 살펴보아야 합니다.

컴포넌트 탐색기는 UI 컴포넌트와 컴포넌트의 모든 변화형(variations)을 시각화합니다. 이는 개발자, 디자이너, PM, QA로부터 "이게 맞나요?"라는 질문에 대해 쉽게 피드백을 얻을 수 있게 합니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/storybook-workflow-publish.mp4"
    type="video/mp4"/>
</video>

## 내가 쓰고있는 기술 스택 어디에 적합하나요?

컴포넌트 탐색기는 애플리케이션과 함께 작은 독립된 sandbox로서 묶여있습니다. 이는 컴포넌트 변화형(variations)을 개별적으로 시각화하며, 아래의 기능들을 포함하고 있습니다. -

- 🧱 컴포넌트 격리를 위한 Sandbox
- 🔭 컴포넌트 사양 및 속성에 대한 변화형(variation) 시각화 도구
- 🧩 테스트 중에 다시 확인할 수 있도록 "stories"로 변화형들(variations) 저장
- 📑 컴포넌트 검색 및 사용 지침에 관한 문서

![컴포넌트들과 컴포넌트 탐색기의 관계](/visual-testing-handbook/storybook-relationship.png)

## 작업 흐름(workflow) 배우기

컴포넌트 탐색기로 UI를 분리하면 시각적 테스팅을 진행할 수 있습니다. 다음 장은 테스트 주도 개발(Test-driven development)을 재구성하는 방법을 소개합니다.