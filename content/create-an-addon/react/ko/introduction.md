---
title: '애드온(addons)에 대한 소개'
tocTitle: '소개'
description: '애드온의 구조'
---

<div class="aside">본 가이드는 Storybook 애드온을 구축하고자 하는 <b>프로페셔널한 개발자</b>들을 위해 작성되었습니다. 중급 이상의 자바스크립트나 리액트에 대한 경험이 필요합니다. Storybook에 대한 기본 개념 역시 알아야 하는데, 그 예로는 스토리를 쓴다거나 환경설정(config)을 쓰는 방법 등이 있습니다. (<a href="/intro-to-storybook">Intro to Storybook</a> 에서 기본을 가르치고 있습니다).
</div>

<br/>

Storybook은 앱 외부의 분리된 공간에서의 UI 컴포넌트 개발을 위한 도구입니다.
애드온은 워크플로우 부분을 자동화하고 향상하는 것을 도와줍니다. 실제로, Storybook의 중요한 특징들은 애드온과 만들어져 있습니다. 예시로 - [문서 Documentation](https://storybook.js.org/docs/react/writing-docs/introduction), [접근성 테스트 Accessibility testing](https://storybook.js.org/addons/@storybook/addon-a11y) and [상호작용 통제 Interactive controls](https://storybook.js.org/docs/react/essentials/controls) 등이 있습니다.[200여 개의 애드온이](https://storybook.js.org/addons) UI 개발자들의 시간 절약을 돕고 있습니다.

## 무엇을 만들 것인가?

CSS 레이아웃이 디자인과 맞는지에 대해 확언하는 것은 어려운 일입니다. 눈대중을 사용한 정렬은 미묘할 수 있습니다. 특히나 DOM 엘리먼트가 멀리 떨어져 있거나 이상한 모양을 가지고 있다면 말입니다.

[아웃라인 애드온](https://storybook.js.org/addons/storybook-addon-outline) 아웃라인 애드온은 CSS를 이용해서 UI 엘리먼트의 아웃라인을 잡는 툴바 버튼을 더하고 있습니다. 이것은 포지셔닝이나 자리 배치에 대한 것들을 한눈에 쉽게 하도록 도와줍니다. 아래 예제를 살펴보세요.

![아웃라인 애드온(../../images/outline-addon-hero.gif)

## Addon의 구조

애드온은 Storybook으로 가능한 것들을 더욱 확장할 수 있게 도와줍니다. 인터페이스에 있는 것들부터 API까지 모두 말입니다. 이것들이 UI 엘리먼트 개발 워크플로우를 크게 도와줍니다.

애드온은 두 가지의 넓은 카테고리로 나뉩니다 - 

- **UI-based:** 인터페이스를 커스터마이징하고, 반복적인 일이나 포맷, 추가적인 정보 배치에 단축키를 더합니다. 예를 들면 문서화, 접근성 테스트, 상호작용통제(interactive controls), 그리고 디자인 미리보기 등이 있습니다.

- **Presets:** Storybook에 자동적으로 적용된 환경설정의 모음입니다. 이것들은 주로 Storybook을 다른 특정 기술과 함께 사용하도록 빠르게 짝지어줍니다. 예를 들면, preset-create-react-app, preset-nuxt 그리고 preset-scss 이 있습니다.

## UI 기반의(UI-based) 애드온

애드온은 세가지 타입의 인터페이스 엘리먼트를 만들 수 있습니다 - 

1. 툴바에 툴을 더할 수 있습니다. [그리드와 배경](https://storybook.js.org/docs/react/essentials/backgrounds) 등의 도구가 있습니다.

![](../../images/toolbar.png)

2. [액션 애드온](https://storybook.js.org/docs/react/essentials/actions) 을 닮은 애드온은 판넬을 만들 수 있습니다. 현황 일지를 배치할 수 있습니다.

![](../../images/panel.png)

3. 새로운 탭을 만듭니다. [Storybook 문서](https://storybook.js.org/docs/react/writing-docs/introduction) 컴포넌트 문서화를 보여줍니다.

![](../../images/tab.png)

애드온으로 많은 것을 할 수 있다는 것은 확실해보입니다. 그래서 대체 애드온은 뭘 하는 걸까요?

아웃라인 애드온은 개발자로 하여금 스토리에 있는 각 엘리먼트의 아웃라인을 그릴 수 있는 툴바의 버튼을 클릭하게 도와줍니다. 버튼을 한 번 더 누르면, 이제 아웃라인들은 지워집니다.

애드온 코드는 앞으로 우리가 다룰 챕터에서 네 가지 부분으로 나누어 설명합니다 - 

- **애드온 UI** 툴바에 “tool” 버튼을 만듭니다. 이것이 사용자가 클릭하는 버튼입니다.
- **등록** 스토리북에 addon을 등록합니다.
- **State 관리** 툴의 토글 상태를 확인합니다. 이것으로 아웃라인을 시각적으로 보이게 하느냐 마느냐를 통제할 수 있습니다.
- **데코레이터** CSS를 미리보기 iframe에서 주입하여 아웃라인을 그립니다.
