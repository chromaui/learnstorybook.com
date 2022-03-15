---
title: '디자인 시스템 소개'
tocTitle: '소개'
description: 'A guide to the latest production-ready tools for design systems'
---

<div class="aside">이 가이드는 <b>전문 개발자들을 위한</b> 디자인 시스템 학습법에 대해 다루고 있습니다. 자바스크립트(JavaScript), 깃(Git), 그리고 지속적인 통합 환경(Continuous Integration, CI)에 대해 어느 정도 경험을 하고 읽기를 권합니다. 또한 story 작성이나 설정 파일 수정 등의 Storybook의 기본 사용법을 알고 있어야 합니다.(<a href="/intro-to-storybook">Storybook 소개</a>를 참고해보세요).
</div>
<br/>

디자인 시스템의 인기는 폭발적으로 증가하고 있습니다. Airbnb와 같은 거대 기술 기업부터 신생 스타트업까지, 회사들은 시간과 비용을 절약하기 위해 UI 패턴을 재사용하는 방식을 도입하고 있습니다. 하지만 BBC, Airbnb, IBM, Microsoft에서 만든 디자인 시스템과 대부분의 개발자가 만든 디자인 시스템 사이에는 큰 차이가 존재하고 있습니다.

선도적인 디자인 시스템 팀들은 어떤 이유로 그 기술과 도구를 사용할까요? 공동 저자 톰과 함께 Storybook 커뮤니티의 우수 사례들을 통해 성공적인 디자인 시스템의 특성을 연구했습니다.

이 단계별 가이드에서는 확장된 프로덕션 디자인 시스템에 사용되는 자동화된 툴과 신중한 워크플로우에 대해 설명합니다. 우리는 기존 컴포넌트 라이브러리를 조합하여 디자인 시스템이 만들어지는 과정을 살펴본 후, 핵심 서비스와 라이브러리, 워크플로우에 대해 알아볼 것입니다.

![Design system overview](/design-systems-for-developers/design-system-overview.jpg)

## 왜 디자인 시스템이 필요할까요?

재사용이 가능한 사용자 인터페이스는 새로운 개념이 아닙니다. 스타일 가이드, UI 키트 및 공유 가능한 위젯은 수십 년 동안 존재해왔습니다. 오늘날 디자이너와 개발자들은 UI 컴포넌트 구조화를 위해 노력하고 있습니다. UI 컴포넌트는 사용자 인터페이스를 이루는 조각들의 시각적이고 기능적인 속성을 캡슐화합니다. 레고(LEGO) 블록을 생각해보세요.

최근에 등장한 유저 인터페이스들은 다양한 사용자 경험을 제공하기 위해 수백 개의 모듈식 UI 컴포넌트가 재배열된 구조로 이루어져 있습니다.  

디자인 시스템은 재사용이 가능한 UI 컴포넌트들로 이루어져, 복잡하고 견고하며 사용자가 접근하기에 용이한 사용자 인터페이스를 구축할 수 있습니다. 디자이너와 개발자 모두 UI 컴포넌트를 다루기 때문에, 디자인 시스템은 두 분야를 연결하는 다리이기도 합니다. 또한 조직의 공용 컴포넌트에 대한 "진실의 근원(source of truth)"이 됩니다.

![Design systems bridge design and development](/design-systems-for-developers/design-system-context.jpg)

디자이너들은 종종 도구 안에서 디자인 시스템을 구축하는 것에 대해 이야기합니다. 디자인 시스템의 전체적 범위는 자산(Sketch, Figma 등), 설계 원리, 기여 구조, 관리와 그 이상을 포괄하고 있습니다. 디자이너 중심의 가이드는 이미 많기에, 여기서는 자세히 다루지 않겠습니다.

개발자의 경우, 몇 가지는 필수적으로, 프로덕션 디자인 시스템에는 UI 컴포넌트와 프론트엔드 인프라구조를 포함해야 합니다. 디자인 시스템을 위한 3가지 기술적 파트가 있는데, 그것이 우리가 이 가이드에서 다룰 내용입니다. 

- 🏗 재사용이 가능한 공용 UI 컴포넌트
- 🎨 디자인 토큰: 브랜드 색상, 간격과 같은 스타일 변수
- 📕 문서: 사용 방법, 설명, 좋은 예와 나쁜 예

이 파트들은 패키지 관리자를 통해 패키지화, 버전화되어 앱으로 배포됩니다.

## 정말 디자인 시스템이 필요할까?

이런 유명세에도 불구하고, 디자인 시스템이 모든 문제를 해결해주지는 않습니다. 만약 소규모의 팀에서 단일 앱으로 작업하는 경우, 디자인 시스템을 사용하도록 인프라를 설정하는 대신 UI 컴포넌트로 이루어진 디렉터리를 사용하는 것이 좋습니다. 작은 프로젝트의 경우 유지보수 비용, 환경 통합, 도구에 드는 비용이 생산성 향상에 드는 비용보다 훨씬 커질 것이기 때문입니다.

디자인 시스템은 여러 프로젝트가 같은 UI 컴포넌트를 공유할수록 이점이 있습니다. 다른 앱이나 여러 팀 간에 같은 UI 컴포넌트를 공유하는 경우라면 이 가이드가 적합할 것입니다.

## 우리가 사용하는 도구들

<<<<<<< sieunlee0
[BBC](https://www.bbc.co.uk/iplayer/storybook/index.html?path=/story/style-guide--colours), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/)을 비롯한 수백 개가 넘는 기업의 디자인 시스템에 스토리북이 사용되고 있습니다. 여기에서 권장하는 사항들은 가장 똑똑한 팀의 우수 사례 및 도구를 참고했습니다. 아래 프론트엔드 환경을 구성해보세요.
=======

[BBC](https://www.bbc.co.uk/iplayer/storybook/index.html?path=/story/style-guide--colours), [Airbnb](https://github.com/airbnb/lunar), [IBM](https://www.carbondesignsystem.com/), [GitHub](https://primer.style/css/)을 비롯한 수백 개가 넘는 기업의 디자인 시스템에 스토리북이 사용되고 있습니다. 여기에서 권장하는 사항들은 가장 똑똑한 팀의 우수 사례 및 도구를 참고했습니다. 아래 프론트엔드 환경을 구성해보세요.

>>>>>>> master

#### 빌드 컴포넌트

- 📚 [Storybook](http://storybook.js.org): UI 컴포넌트 개발과 자동으로 문서를 생성할 때 사용합니다.
- ⚛️ [리액트(React)](https://reactjs.org/): 선언 중심 컴포넌트 UI(create-react-app)를 사용합니다.
- 💅 [스타일 컴포넌트(Styled-components)](https://www.styled-components.com/): 컴포넌트 단위의 스타일링에 사용합니다.
- ✨ [프리티어(Prettier)](https://prettier.io/): 자동화된 코드 포맷팅에 사용합니다.

#### 시스템 유지

- 🚥 [GitHub Actions](https://github.com/features/actions): 빌드와 테스트를 자동화하기 위해 사용합니다.
- 📐 [ESLint](https://eslint.org/): 자바스크립트 코드 포맷팅에 사용합니다.
- ✅ [Chromatic](https://chromatic.com): 컴포넌트에서 일어나는 오류를 시각적으로 발견할 수 있습니다(Storybook 메인테이너들이 제작).
- 🃏 [Jest](https://jestjs.io/): 유닛 테스트에 사용합니다.
- 📦 [npm](https://npmjs.com): 배포 및 라이브러리 관리에 사용합니다.
- 🛠 [Auto](https://github.com/intuit/auto): 릴리즈 워크플로우를 관리할 때 사용합니다.

#### Storybook 애드온

- ♿ [Accessibility](https://github.com/storybookjs/storybook/tree/master/addons/a11y): 개발하면서 접근성 체크를 도와줍니다.
- 💥 [Actions](https://storybook.js.org/docs/react/essentials/actions): QA 클릭과 탭 인터렉션이 가능하도록 해줍니다
- 🎛 [Controls](https://storybook.js.org/docs/react/essentials/controls): 컴포넌트의 props를 동적으로 화면에 반영해줍니다.
- 📕 [Docs](https://storybook.js.org/docs/react/writing-docs/introduction): story에서 자동으로 문서를 생성해줍니다.

![Design system workflow](/design-systems-for-developers/design-system-workflow.jpg)

## 워크플로우 이해하기

디자인 시스템은 프론트엔드 인프라에 대한 투자입니다. 이 가이드에서는 위의 기술을 사용하는 방법 외에도 적용과 유지 보수를 단순화하는 핵심 워크플로우에 대해서도 중점적으로 설명할 예정입니다. 가능하다면 수동 작업은 모두 자동화가 될 것입니다. 다음은 우리가 마주하게 될 활동들입니다.

#### UI 컴포넌트는 분리하여 작업하기

모든 디자인 시스템은 UI 컴포넌트들로 구성되고 있습니다. 우리는 Storybook을 "워크벤치(workbench)"로 사용하여 소비자 앱 밖에서 UI 컴포넌트를 구축할 것입니다. 그다음엔 Storybook에서 컴포넌트의 내구성을 향상시키는 애드온들(Actions, Source, Knobs)을 통합할 것입니다.

#### 리뷰를 통해 합의를 이끌어내고 피드백을 수집하기

UI 개발은 개발자, 디자이너 및 다른 분야 간의 조정이 필요한 팀 스포츠입니다. Storybook에서는 작업 중인 UI 컴포넌트들을 게시하여 이해관계자들을 개발 과정에 포함시키도록 합니다. 이를 통해 우리는 더 빠르게 서비스를 출시 할 수 있습니다.

#### UI에서 발생하는 버그를 방지하기위해 테스트하는법

디자인 시스템들은 하나의 진실의 원천이며 단일 실패 지점입니다. 기본 컴포넌트에 있는 사소한 UI 버그가 순식간에 회사 전체의 사고로 이어질 수도 있습니다. Storybook은 테스트를 자동화하여 불가피하게 발생하는 버그를 방지하고, 접근성과 내구성이 뛰어난 UI 컴포넌트를 안심하고 사용할 수 있도록 합니다.

#### 빠른 채택을 위한 문서

개발자에게 문서 작업은 필수적이지만, 이를 생성하는 건 개발자의 우선순위 작업은 아닙니다. Storybook에서는 최소한의 설정을 통해 문서를 자동으로 생성할 수 있어, UI 컴포넌트를 문서화 할 수 있습니다.

#### 사용자 프로젝트에게 디자인 시스템 배포하기

문서화가 잘 된 UI 컴포넌트가 만들어졌다면, 다른 팀에게도 배포를 해야합니다. 패키징, 배포 및 다른 Storybook에서 디자인 시스템을 표시하는 방법에 대해 알아볼 것입니다.

## Storybook 디자인 시스템

이 가이드의 예제 디자인 시스템은 Storybook의 자체 [프로덕션 디자인 시스템](https://github.com/storybookjs/design-system)을 참고로 했습니다. 이는 3개의 사이트에서 소비되고 수만 명의 개발자들이 사용하고 있습니다.

다음 장에서는 서로 다른 컴포넌트 라이브러리에서 디자인 시스템을 추출하는 방법에 대해 알아볼 것입니다.
