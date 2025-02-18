---
title: '시각적 테스팅 소개'
tocTitle: '소개'
description: 'UI를 테스트하는 실용적인 방법'
---

사용자 인터페이스는 주관적입니다. "이게 맞나요?"라는 질문에 대한 대답은 사용하고 있는 브라우저, 디바이스, 개인적인 취향에 따라 결정됩니다. 하지만 여전히 렌더링된 UI를 보고 모양을 확인해야 합니다.

그러나 각 commit마다 전체 UI를 수동으로 확인하는 데는 시간이 오래 걸립니다. 유닛 테스트나 스냅샷 테스트와 같은 다양한 접근 방식은 시각적 검증을 자동화하려고 시도합니다. 이런 테스트들은 HTML 태그와 CSS 클래스 명의 연속성에서 UI의 정확도를 확인할 수 없기 때문에 종종 실패합니다.

회사들은 어떻게 시각적인 버그(bug))들을 방지할까요? Microsoft, BBC, Shopify는 수백만 명의 사람들에게 UI를 제공하기 위해 어떤 기술을 사용할까요? 저와 제 공동 저자인 Tom은 주요 회사를 조사해 실제로 어떤 기술이 작동하고 있는지 알아보았습니다.

이 핸드북은 시각적 테스팅을 소개하고 있습니다. 이는 사람 눈의 정확성과 기계의 효율성을 합친 실용적인 접근법입니다. 시각적 테스팅은 사람을 테스트 상황에서 배제하는 대신 여러 도구를 사용해 주의가 필요한 특정 UI의 변경사항에 집중합니다.

![시각적 테스팅 기반 경로](/visual-testing-handbook/visual-testing-handbook-vtdd-path-optimized.png)

## 유닛 테스트는 눈(eyeballs)이 없습니다.

시각적 테스팅을 온전히 이해하려면 유닛 테스트부터 시작하는 게 좋습니다. 최신 UI들은 컴포넌트 기반[component-driven](https://componentdriven.org/)입니다 - 모듈 단위로 구성된다는 뜻입니다. 컴포넌트 구조를 이용하면 UI를 props와 상태(state)로 이루어진 함수로 렌더링할 수 있습니다. 즉 다른 함수들과 마찬가지로 컴포넌트를 유닛테스트 할 수 있음을 의미합니다.

유닛 테스트는 모듈을 분리하고 모듈의 작동방식을 검증합니다. 이는 입력값(props, state 등)을 제공하며 기댓값과 출력값을 비교합니다. 유닛 테스트는 바람직한 테스팅 방식입니다. 왜냐하면 개별적으로 모듈을 테스트하면서 edge case들을 쉽게 다루고 실패의 원인을 잡아낼 수 있기 때문입니다.

<video autoPlay muted playsInline loop>
  <source
    src="/visual-testing-handbook/component-unit-testing.mp4"
    type="video/mp4"/>
</video>

핵심 문제는 UI의 고유한 복잡성의 상당 부분이 시각적, 즉 생성된 HTML 및 CSS가 사용자 화면에서 어떻게 렌더링 되는지에 대한 세부 사항이라는 것입니다.

유닛 테스트는 구체적인 출력을 평가하는 데 아주 적합합니다 - `2 + 2 === 4`. 그러나 HTML 또는 CSS의 어떤 세부 사항이 외관에 영향을 미치고 어떻게 영향을 미치는지 식별하기 어렵기 때문에 UI에는 적합하지 않습니다. 예를 들어 HTML 변경이 UI가 어떻게 보이고 느껴지는지에 항상 영향을 미치는 것은 아닙니다.

## 그렇다면 스냅샷 테스트들은 어떨까요?

스냅샷 테스트[Snapshot tests](https://reactjs.org/docs/testing-recipes.html#snapshot-testing)는 UI 모양을 확인하는 대안적 접근법을 제공합니다. 스냅샷 테스트는 컴포넌트를 렌더링한 다음 생성된 DOM을 '기준값'으로 포착합니다. 그다음에 일어나는 변경 사항은 기준값과 새로운 DOM을 비교합니다. 만약 변경 사항이 있다면, 개발자는 기준점을 명시적으로 업데이트해야 합니다.

![축소된 컴포넌트 코드](/visual-testing-handbook/code-visual-testing-optimized.png)

실제로 DOM 스냅샷은 HTML blob을 평가하여 UI가 렌더링 되는 방식을 결정하기 어렵기 때문에 불편합니다.

스냅샷 테스트 또한 다른 자동화된 UI 테스트와 같은 취약점이 있습니다. 컴포넌트의 내부 작업을 변경하려면 컴포넌트의 렌더링된 출력값의 변경 여부와 관계없이 테스트를 업데이트해야 합니다.

## UI를 위해 만들어진 시각적 테스팅

시각적 테스트는 UI 외관의 변경 사항들을 포착하도록 설계되었습니다. 스토리북(Storybook)과 같은 컴포넌트 탐색기를 사용하여 UI 컴포넌트를 격리하고, 다양한 변화형(variations)를 모방하고, 지원되는 테스트 케이스를 'story'로 저장합니다.

개발하는 동안, 브라우저에서 컴포넌트를 렌더링해 컴포넌트의 모습을 확인하는 빠른 수동 검증을 '실행'해보세요. 컴포넌트 탐색기에 나열된 각 테스트 케이스를 작동시키면서 컴포넌트의 변화형들(variations)을 확인해보세요.

<video autoPlay muted playsInline loop>
  <source 
  src="/visual-testing-handbook/storybook-toggling-stories.mp4"
  type="video/mp4" />
</video>

QA 단계에서 회귀를 감지하고 UI 일관성을 적용하기위해 자동화를 사용해보세요. [Chromatic](https://www.chromatic.com/?utm_source=storybook_website&utm_medium=link&utm_campaign=storybook)과 같은 도구들은 일관된 브라우저 환경에서 마크업, 스타일링 및 기타 asset으로 완성된 각 테스트 케이스의 이미지 스냅샷을 캡처합니다.

commit할 때마다 새 이미지 스냅샷이 이전에 승인된 기준 스냅샷과 자동으로 비교됩니다. 컴퓨터가 시각적 차이를 감지하면 개발자는 의도적인 변경을 승인하거나 우발적인 버그를 수정하라는 알림을 받습니다.

<video autoPlay muted playsInline loop>
  <source 
  src="/visual-testing-handbook/component-visual-testing.mp4"
  type="video/mp4" />
</video>

#### 할 일이 많은 것 같습니다...

번거롭게 들릴 수도 있겠지만 이것은 자동화된 테스트에서 잘못된 탐지를 걸러내고, 사소한 UI 변경에 따라 테스트 케이스를 업데이트하고, 테스트를 다시 통과하기 위해 초과 근무를 하는 것보다는 쉬운 일입니다.

## 도구 배우기

이제 시각적 테스트에 대한 감이 생겼으니 이를 실행하는데 필요한 주요 도구인 컴포넌트 탐색기를 확인해 볼 것입니다. 다음 장에서는 컴포넌트 탐색기가 개발자가 컴포넌트를 빌드(build)하고 테스트하는 데 어떻게 도움이 되는지 알아보겠습니다.
