---
title: '시스템 설계'
tocTitle: '설계'
description: '컴포넌트 라이브러리에서 디자인 시스템을 추출하는 방법'
---

2장에서는 디자인 시스템을 컴포넌트 라이브러리에서 추출하는 방법에 대해 알아봅니다. 그 과정에서 디자인 시스템에 속하게 되는 컴포넌트를 결정하고, 개발자들이 직면하는 일반적인 문제에 대해 살펴보겠습니다.

큰 회사의 경우, 이 단계를 디자인, 개발, 제품 팀이 함께 수행합니다. Chromatic(Storybook을 만든 회사)과 Storybook은 3개 이상의 자산에서 약 800명의 오픈 소스 기여자에게 서비스를 제공하는 프론트엔드 인프라 팀을 공유하고 있으므로, 이 프로세스를 간략히 설명하겠습니다.

## 우리의 도전

당신이 개발 팀에서 일한다면, 규모가 크다고 팀이 효율적이지 않다는 사실을 알고 있을 것입니다. 팀이 성장할수록 미스 커뮤니케이션 또는 오해가 생길 수 있지요. 기존 UI 패턴을 문서화하지 못하거나 이를 잃어버리기도 합니다. 즉, 개발자는 새로운 기능을 개발하는 게 아니라 바퀴를 재창조하게 됨을 의미합니다. 시간이 지남에 따라 프로젝트는 일회용 컴포넌트로 가득 차게 됩니다.

우리도 이러한 곤경에 빠졌습니다. 팀이 숙련되었음에도 불구하고, UI 컴포넌트는 끊임없이 불어나고 재구성되었습니다. UI 패턴이란 모양과 기능이 동일해야 하지만, 각각의 컴포넌트는 진실의 근원(source of truth)을 분별할 수 없을 정도로 독특한 모양을 띠었습니다. 기여도 또한 현저히 낮았습니다.

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## 디자인 시스템 만들기

디자인 시스템은 패키지 매니저를 통해 배포된 저장소에서 공통적으로 사용하는 UI 컴포넌트들을 통합시킵니다. 이로써 개발자는 여러 프로젝트에 동일한 UI 코드를 붙여넣지 않고, 표준회된 UI 컴포넌트를 사용하게 됩니다.

대부분의 디자인 시스템은 처음부터 만들어진 게 아닙니다. 실제 회사에서 사용 중인 검증된 UI 컴포넌트들이 디자인 시스템으로 재조립된 것입니다. 우리 프로젝트도 예외는 아닙니다. 시간을 절약하고,이해 관계자들에게 보다 신속하게 디자인 시스템을 제공하기 위해 기존 프로덕션 컴포넌트 라이브러리에서 컴포넌트를 선별합니다.

![What's in a design system](/design-systems-for-developers/design-system-contents.jpg)

## 디자인 시스템 찾아내기

디자인 시스템을 또 다른 컴포넌트 라이브러리라고 생각할 수 있지만, 하나의 앱을 서비스하는 것이 아니라 전체 조직에 서비스를 제공하는 것입니다. 디자인 시스템은 UI 기본 요소에 초점을 맞추는 반면, 프로젝트별 컴포넌트 라이브러리는 복합적인 컴포넌트부터 화면에 이르기까지 모든 것을 포함할 수 있습니다.

따라서 디자인 시스템은 모든 프로젝트로부터 독립적이어야 하며, 또한 모든 프로젝트에 종속성이 있어야 합니다. 변경 사항은 패키지 매니저를 통해 배포된 버전으로 조직 전체에 적용됩니다. 이렇게 프로젝트는 디자인 시스템의 컴포넌트를 재사용하고, 필요한 경우에는 추가로 사용자 정의를 할 수 있습니다. 이러한 조건들은 프론트엔드 프로젝트를 개발하는 데에 청사진이 되기도 합니다.

![Who uses a design system](/design-systems-for-developers/design-system-consumers.jpg)

## 깃허브와 create-react-app으로 저장소 만들기

[State of JS](https://stateofjs.com/)의 설문조사에 따르면, 가장 인기 있는 뷰 레이어는 리액트(React)입니다. 압도적으로 많은 스토리북에서 리액트를 사용하기 때문에, 이 튜토리얼에서도 [create-react-app](https://github.com/facebook/create-react-app) 보일러플레이트를 사용하겠습니다.

터미널에 아래 명령어를 입력하여 실행해보세요.

```shell
# Clone the files
npx degit chromaui/learnstorybook-design-system#setup learnstorybook-design-system

cd learnstorybook-design-system

# Install the dependencies
yarn install
```

<div class="aside">여기에서는 깃허브(GitHub)로부터 폴더를 다운로드 받기 위해 <a href="https://github.com/Rich-Harris/degit">degit</a>를 사용했습니다. 수동으로 직접 가져오고 싶다면, <a href="https://github.com/chromaui/learnstorybook-design-system/tree/setup">여기</a>를 참고하세요.</div>

파일들과 종속되는 요소들까지 설치가 완료되었으면, 이를 깃허브에 푸쉬(push)할 수 있습니다. 이 과정을 통해 우리의 디자인 시스템을 웹에 호스트할 수 있게 됩니다. 먼저 GitHub.com에 가입을 하여 새 저장소를 만듭니다.

![Create a GitHub repository](/design-systems-for-developers/create-github-repository.png)

그런 다음 깃허브에서 제공하는 명령어를 사용해 원격 저장소를 git 저장소에 추가하고 (아마 거의 비어있을) 저장소를 푸쉬합니다.

```shell
git init
git add .
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/your-username/learnstorybook-design-system.git
git push -u origin master
```

`your-username`을 본인 계정 이름으로 바꾸는 것을 잊지 마세요.

![Initial commit to GitHub repository](/design-systems-for-developers/created-github-repository.png)

<div class="aside">디자인 시스템을 만드는 다른 방법으로는 원시 HTML/CSS 파일을 포함하거나 다른 뷰 레이어 사용하기, Svelte로 구성된 컴포넌트 컴파일하기, 혹은 다른 웹 컴포넌트 사용하기 등이 있습니다. 팀에 적합한 것을 선택하세요.</div>

## 필요한 것과 그렇지 않은 것

디자인 시스템은 순수해야 하고 [프레젠테이션 컴포넌트](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)만을 포함해야 합니다. 이러한 컴포넌트는 UI가 표시되는 방식을 처리합니다. 이들은 props에 대해서만 변화하고, 어떠한 비즈니스 로직을 포함하지 않으며, 데이터 로드 방식에 구애받지 않아야 합니다. 이는 컴포넌트를 재사용하기 위해서 필수적으로 지켜야하는 속성입니다.

디자인 시스템은 조직에서 사용하는 모든 컴포넌트 라이브러리의 상위 집합이 아닙니다. 그렇게 된다면 추적하기 힘든 골칫거리가 됩니다.

비즈니스 로직이 포함된 특정 컴포넌트는 사용자 프로젝트들에 동일한 비즈니스 로직을 요구하게 되므로, 재사용을 방해하기 때문에 포함해서는 안 됩니다.

현재 재사용하지 않는 컴포넌트들은 생략합니다. 언젠가는 디자인 시스템의 일부가 되기를 바라더라도, 가능하면 코드가 지저분해지지 않도록 합니다.

## 목록 생성하기

첫번째 작업은 가장 많이 사용되는 컴포넌트를 구분하기 위한 인벤토리를 생성하는 것입니다. 여기에는 종종 공통적으로 사용하는 UI 패턴을 식별하기 위해 다양한 웹사이트 또는 앱의 화면을 수동으로 분류하는 작업도 포함됩니다. 두 디자이너 [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/), [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517)가 컴포넌트 목록을 생성하는 편리한 방법을 소개하고 있으니, 이 튜토리얼에서는 생략하도록 하겠습니다.

개발자에게 유용한 휴리스틱:

- UI 패턴이 3회 이상 사용되는 경우, 재사용 가능한 UI 컴포넌트로 간주합니다.
- UI 컴포넌트가 3개 이상의 프로젝트/팀에서 사용되는 경우, 디자인 시스템에 포함시킵니다.

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

이러한 방법을 따르다 보면 결국 UI 기본 요소들이 남게 됩니다: 아바타, 뱃지, 버튼, 체크 박스, 입력, 라디오 버튼, 선택 박스, 텍스트 영역, 하이라이트(코드), 아이콘, 링크, 툴팁 등. 이러한 요소들은 클라이언트 앱에서 수많은 고유 기능과 레이아웃을 조합하기 위해 다양한 방식으로 구성됩니다.

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)

<p>
샘플 코드에서는 저장소를 간단하게 만들기 위해 이러한 컴포넌트들의 일부만 가져왔습니다. 몇몇 팀들은 표나 폼을 위해 사용자 정의된 외부 컴포넌트를 디자인 시스템에 포함하기도 합니다.</p></div>

<div class="aside">CSS-in-JS: 이 튜토리얼에서는 <a href="https://www.styled-components.com">Styled-components</a>를 사용합니다. 이 라이브러리를 사용하면 컴포넌트에 스타일링 범위를 지정할 수 있습니다. 컴포넌트를 스타일링하는 방법에는 class를 지정하는 방법, CSS 모듈 등이 있습니다.</div>

UI 컴포넌트 외에도 프로젝트 간에 재사용되는 타이포그래피, 색상, 간격 등에 대한 스타일링 상수를 포함하는 것이 좋습니다. 디자인 시스템 명명법에서 전역 스타일 변수를 "디자인 토큰"이라고 합니다. 이 가이드에서 디자인 토큰에 대한 이론에 대해서는 다루지 않지만, 온라인에서 더 자세히 알아볼 수 있습니다(이와 관련한 [좋은 글](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)을 첨부합니다).

## 개발을 시작해봅시다

우리는 무엇을 만들지, 그리고 어떻게 조화를 이룰지를 정의했습니다. 이제 본격적인 작업을 시작할 때입니다. 3장에서는 디자인 시스템을 위한 기본 도구에 대해 설명합니다. Storybook의 도움을 받아 UI 컴포넌트들의 원시 디렉토리를 카탈로그 형태로 작성하고 확인할 수 있습니다.
