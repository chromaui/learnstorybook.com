---
title: 'UI 테스트 소개'
tocTitle: '소개'
description: 'UI 테스트를 위한 최신 개발 방법'
commit: '6b9ff97'
---

<div class="aside">이 가이드는 JavaScript와 React, 그리고 스토리북(Storybook)에 <b>숙련된 개발자</b>를 위해 작성되었습니다. 만약 스토리북 사용에 익숙하지 않다면 <a href="/intro-to-storybook">Intro to Storybook</a>을 방문해 기초부터 배워보기를 추천합니다!
</div>

<br/>

UI 테스트는 까다롭습니다. 사용자는 새로운 기능이 자주 출시되기를 기대합니다. 하지만 새로운 기능이 출시된다는 건, 이전보다 더 많은 양의 UI와 상태를 테스트해야 한다는 뜻이기도 합니다. 모든 테스팅 도구는 "쉽고, 신뢰할 수 있으며, 빠를 것" 을 보장하지만, 그 어려움에 대해서는 크게 언급하지 않습니다.

앞서가는 프런트엔드 팀을 어떻게 따라갈 수 있을까요? 그들은 대체 어떤 테스트 전략과 메소드를 사용할까요? 우리는 스토리북 커뮤니티에서 10팀을 골라 - Twilio, Adobe, Peloton, Shopify 등 - 그들을 조사해보았습니다.

이 가이드는 규모가 큰 엔지니어링 팀이 사용하는 UI 테스트 기술에 대해 소개합니다. 이를 통해 테스트의 적용 범위, 설정 및 유지보수의 균형을 유지하는 실용적인 방법을 배울 수 있을 것입니다. 또한 테스트 과정에서 피해야 할 함정도 알려드리겠습니다.

## 어떤 것들을 테스트해야 할까요?

널리 사용되는 JavaScript 프레임워크는 모두 [컴포넌트 기반 (component-driven)](https://www.componentdriven.org/) 으로 동작합니다. 즉, UI는 가장 작은 단위인 Atomic 컴포넌트부터 시작해서 점진적으로 페이지가 되는 "아래에서부터 위로"(bottom-up)의 방식으로 구성됩니다.

오늘날 UI를 구성하는 모든 조각이 컴포넌트라는 것을 기억합시다. 물론 페이지도 마찬가지입니다. 페이지와 버튼의 차이점은 데이터를 소비하는 방식뿐입니다.

그러니까 UI 테스트는 곧 컴포넌트 테스트인 셈입니다.

<img style="max-width: 400px;" src="/ui-testing-handbook/component-testing.gif" alt="컴포넌트 계층: 원자, 조합, 페이지와 앱" />

유닛 테스트(Unit Test), 통합 테스트(integration test), e2e 테스트 등으로 구분하는 건 다소 모호할 수 있습니다. 그 대신 UI에서 어떤 요소들이 테스트가 가능한지 살펴보도록 하죠.

#### 시각적 요소

시각적 요소 테스트는 컴포넌트가 props 및 상태에 대해 올바르게 렌더링되는지 확인합니다. 그들은 모든 컴포넌트의 스크린샷을 찍은 뒤 commit 단위에서 비교하여 변경 사항을 식별합니다.

#### 구성 요소

컴포넌트들은 데이터의 흐름을 따라 서로 연결되어 있습니다. 상위 레벨의 컴포넌트나 페이지에서 시각적 요소 테스트를 실행하면 그들의 긴밀한 연결을 확인할 수 있습니다.

#### 상호작용

상호작용 테스트는 이벤트가 의도한 대로 처리되는지 검증하는 작업입니다. 컴포넌트를 분리해서 렌더링한 다음, 클릭이나 입력 같은 사용자 동작을 시뮬레이션합니다. 마지막으로는 상태가 올바르게 업데이트 되었는지 확인합니다.

#### 접근성

접근성 테스트는 시각장애, 청각장애 등 다양한 장애와 관련된 사용성을 알아냅니다. Axe와 같은 자동화 도구를 QA의 우선적으로 사용해서 노골적인 접근성 위반을 탐지하세요. 이후에 실제 디바이스에서 수동으로 QA를 수행하면 사람의 주의가 필요한 까다로운 문제를 해결할 수 있습니다.

#### 사용자 흐름(User flow)

아주 간단한 작업이라도 사용자가 여러 컴포넌트에 걸쳐 일련의 단계를 완료해야 합니다. 이는 또다른 잠재적인 실패가 될 수 있습니다. Cypress 및 Playwright와 같은 도구를 사용하면 전체 애플리케이션에 대해 테스트를 실행하여 이러한 상호작용을 확인할 수 있습니다.

## 작업 흐름(Workflow)에 대한 이해

UI에서 테스트가 필요한 다양한 측면을 다루었지만, 이를 실제 작업 흐름에 결합하기란 무척 까다롭습니다. 무언가 실수라도 했다간 UI 개발 과정이 지루하고 힘들게 느껴질 수 있습니다. 변경사항이 있을 때마다 테스트가 중단되기 때문에 모든 도구에 테스트 케이스를 복제해야 하고, 이는 결국 유지보수의 악몽으로 변하기도 합니다.

우리가 조사한 팀들은 팀의 규모와 기술 스택이 각기 달랐음에도 비슷한 전략을 가지고 있었습니다. 그 내용을 취합해 효율적인 작업 흐름을 만들면 다음과 같습니다 -

- 📚 [Storybook](http://storybook.js.org/)을 이용한 **컴포넌트 분리**. props와 모의 데이터를 사용하여 각 상태를 재현하는 테스트 케이스를 작성합니다.
- ✅ [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)을 이용한 **시각적 요소 버그 포착 및 구성 확인**.
- 🐙 [Jest](https://jestjs.io/)와 [Testing Library](https://testing-library.com/)를 이용한 **상호작용 검증**.
- ♿️ [Axe](https://www.deque.com/axe/)를 이용한 **접근성 심사**.
- 🔄 [Cypress](https://www.cypress.io/)를 이용해 e2e 테스트 코드를 작성하여 **사용자 흐름 검증**.
- 🚥 [GitHub Actions](https://github.com/features/actions)을 통해 자동으로 테스트를 실행해 **회귀 포착**.

![](/ui-testing-handbook/ui-testing-workflow.png)

## 테스트를 시작해봅시다.

다음 장에서는 테스트 스택의 각 계층에 대해 더 깊이 파고들어 테스트 전략을 구현하는 메커니즘에 대해 알아보겠습니다. 테스트를 해볼 예시로 Taskbox 앱을 사용하겠습니다. Taskbox는 Asana와 비슷한 일정 관리 앱입니다.

![](/ui-testing-handbook/taskbox.png)

UI를 테스트하는 방법에 집중하고 있으므로, 구현의 세부 정보는 중요하지 않습니다. 또한 여기서는 React를 사용했지만, 이러한 테스트 개념은 모든 컴포넌트 기반 프레임워크로 확장될 수 있습니다.

코드를 가져오기 위해 이 저장소 https://github.com/chromaui/ui-testing-guide-code 를 fork한 다음, 아래의 명령어를 따라해보세요.

```shell:clipboard=false
# fork한 저장소 복제
git clone https://github.com/<your_github_username>/ui-testing-guide-code

cd ui-testing-guide-code

# 의존성 설치
yarn
```
