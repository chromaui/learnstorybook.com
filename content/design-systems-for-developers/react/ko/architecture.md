---
title: '시스템 설계'
tocTitle: '설계'
description: '컴포넌트 라이브러리에서 디자인 시스템을 추출하는 방법'
commit: '798276b'
---

2장에서는 디자인 시스템을 컴포넌트 라이브러리에서 추출하는 방법에 대해 알아봅니다. 그 과정에서 디자인 시스템에 속하게 되는 컴포넌트를 결정하고, 개발자가 흔히 직면하는 문제는 어떤 것이 있는지 살펴보겠습니다.

대규모 회사의 경우 디자인팀, 개발팀, 제품팀이 이 과정을 함께 수행합니다. [크로매틱(Chromatic)](https://www.chromatic.com/) (스토리북(Storybook)을 만든 회사)과 [스토리북](https://storybook.js.org/)은 3개 이상의 자산에서 약 1,400명 이상의 오픈 소스 기여자에게 서비스를 제공하는 프런트엔드 인프라팀을 공유하고 있으므로, 이 프로세스를 간략히 설명하겠습니다.

## 우리의 도전

개발팀에서 일하는 분이라면 아시겠지만 규모가 큰 팀은 효율성이 떨어지는 경우가 많습니다. 팀이 성장할수록 잘못된 소통으로 인한 오해가 증가합니다. 기존 UI 패턴을 문서화하는데 실패하거나 중간에 유실되는 경우도 있습니다. 탈 것으로 예를 들자면, 개발자들이 해야하는 일이 자동차라는 구조물에 새로운 기능을 추가하는 정도가 아니라 바퀴 발명부터 새로 시작해야한다는 뜻입니다. 이런 식의 작업이 반복되다보면 한 번 쓰고 말 컴포넌트만이 가득한 프로젝트가 됩니다.

우리도 바로 이 난관에 봉착했습니다. 경험이 풍부한 팀이 최선의 결과를 위해 노력하는 것이 분명한데도, UI 컴포넌트를 새로 만들거나 이전 것을 가져다 붙여놓는 일이 끊임없이 반복되었습니다. 동일할 거라고 기대한 UI 패턴들이 외관이나 기능에 차이를 보였습니다. 각각의 컴포넌트는 유일무이한 눈 결정처럼 고유해서 새로운 개발자가 기여를 보태기는 커녕 단일한 진실의 원천(source of truth)이 무엇인지조차 파악할 수 없었습니다.

![UIs diverge](/design-systems-for-developers/design-system-inconsistent-buttons.jpg)

## 디자인 시스템 만들기

디자인 시스템은 패키지 매니저를 통해 배포되는 중앙 저장소에서 공통으로 사용되는 UI 컴포넌트를 통합시킵니다. 이로써 개발자는 여러 프로젝트에 동일한 UI 코드를 붙여넣지 않고 표준화된 UI 컴포넌트를 불러들여 사용할 수 있습니다.

대부분의 디자인 시스템은 기초부터 새로 만들어지지 않았습니다. 실제 회사에서 사용 중인 검증된 UI 컴포넌트들이 디자인 시스템으로 재조립된 것입니다. 우리 프로젝트도 예외는 아닙니다. 시간을 절약하고 이해 관계자들에게 보다 신속하게 디자인 시스템을 제공하기 위해 기존 프로덕션 컴포넌트 라이브러리에서 컴포넌트를 선별합니다.

![디자인 시스템안에 있는 것들](/design-systems-for-developers/design-system-contents.jpg)

## 디자인 시스템 찾아내기

또 하나의 컴포넌트 라이브러리라고 생각할 수도 있는 디자인 시스템은 사실 특정 앱을 위해서만 활용되는 것이 아니라 전체 조직을 위한 것입니다. 디자인 시스템은 UI 기본 요소에 초점을 맞추는 반면, 특정 프로젝트를 위한 컴포넌트 라이브러리는 복합체 컴포넌트부터 화면에 이르기까지 모든 것을 포함할 수 있습니다.

따라서 디자인 시스템은 모든 프로젝트로부터 독립적이어야 하는 동시에 모든 프로젝트에 종속성이 있어야 합니다. 변경 사항은 패키지 매니저를 통해 배포된 버전으로 조직 전체에 적용됩니다. 이렇게 프로젝트는 디자인 시스템의 컴포넌트를 재사용하고, 필요한 경우에는 추가로 사용자 정의를 할 수 있습니다. 이러한 조건들은 프런트엔드 프로젝트를 개발하는 데에 청사진이 되기도 합니다.

![디자인 시스템을 사용하는 사람들](/design-systems-for-developers/design-system-consumers.jpg)

## 깃허브(Github)와 create-react-app으로 저장소 만들기

[State of JS](https://stateofjs.com/)의 설문조사에 따르면 가장 인기 있는 뷰 레이어는 리액트(React)입니다. 압도적으로 많은 Storybook에서 리액트를 사용하기 때문에 이 튜토리얼에서도 [create-react-app](https://github.com/facebook/create-react-app) 보일러플레이트(Boilerplate)와 함께 리액트를 사용하겠습니다.

터미널에 아래 명령어를 입력하여 실행해보세요.

```shell
# Clone the files
npx degit chromaui/learnstorybook-design-system#setup learnstorybook-design-system

cd learnstorybook-design-system

# Install the dependencies
yarn install
```

<div class="aside">💡 여기에서는 깃허브(GitHub)로부터 폴더를 다운로드 받기 위해 <a href="https://github.com/Rich-Harris/degit">degit</a>를 사용했습니다. 수동으로 직접 가져오고 싶다면, <a href="https://github.com/chromaui/learnstorybook-design-system/tree/setup">여기</a>를 참고하세요.</div>

설치가 모두 완료되면 이를 깃허브에 푸쉬(push)할 수 있습니다. 이 과정을 통해 우리의 디자인 시스템을 웹에 호스트할 수 있게 됩니다. 먼저 GitHub.com에 가입한 후 새 저장소를 만드세요.

![Create a GitHub repository](/design-systems-for-developers/create-github-repository.png)

그런 다음 깃허브에서 제공하는 명령어를 사용해 원격 git 저장소를 만듭니다. (처음 생성하면 거의 비어있는 상태일 것입니다.)

```shell
git init
git add .
git commit -m "first commit"
git branch -M master
git remote add origin https://github.com/your-username/learnstorybook-design-system.git
git push -u origin master
```

잊지 말고 `your-username`을 본인 계정 이름으로 바꾸세요.

![Initial commit to GitHub repository](/design-systems-for-developers/created-github-repository.png)

<div class="aside">💡 디자인 시스템을 만드는 다른 방법으로는 원시 HTML/CSS 파일 포함하기, 다른 뷰 레이어 사용하기, Svelte로 구성된 컴포넌트 컴파일하기, 다른 웹 컴포넌트 사용하기 등이 있습니다. 팀에 적합한 방법을 선택하세요.</div>

## 필요한 것과 그렇지 않은 것

디자인 시스템은 순수해야 하고 [프레젠테이션 컴포넌트](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)만을 포함해야 합니다. 이러한 컴포넌트는 UI가 표시되는 방식을 처리합니다. 이들은 props에만 반응하고, 특정 비즈니스 로직을 포함하지 않으며, 데이터 로드 방식에 구애받지 않습니다. 컴포넌트 재사용이 가능하려면 이런 속성은 필수적으로 지켜져야 합니다.

디자인 시스템은 조직에서 사용하는 모든 컴포넌트 라이브러리의 상위 집합이 아닙니다. 만약 그렇다면 빈틈없이 추적해야 하기 때문에 골칫거리가 될 것입니다.

비즈니스 로직을 포함하는 특정 앱을 위한 컴포넌트는 포함되어서는 안됩니다. 고객 프로젝트가 재사용을 시도할 때 동일한 비즈니스 조건을 설정하는 것을 방해하기 때문입니다.

현재 재사용 중이 아닌 일회성 컴포넌트들은 생략합니다. 혹여 나중에 디자인 시스템에 포함되기를 바라는 요소이더라도, 총명한 팀은 잉여 코드를 최대한 삭제해서 코드가 지저분해지지 않도록 합니다.

## 목록 생성하기

첫번째 작업은 가장 많이 사용되는 컴포넌트를 구분하기 위한 인벤토리를 생성하는 것입니다. 이는 종종 공통적으로 사용하는 UI 패턴을 식별하기 위해 다양한 웹사이트 또는 앱의 화면을 수동으로 분류하는 작업도 포함합니다. 두 디자이너 [Brad Frost](http://bradfrost.com/blog/post/interface-inventory/), [Nathan Curtis](https://medium.com/eightshapes-llc/the-component-cut-up-workshop-1378ae110517)가 컴포넌트 목록을 생성하는 편리한 방법을 소개하고 있으니 이 튜토리얼에서는 생략하도록 하겠습니다.

개발자에게 유용한 휴리스틱 -

- 하나의 UI 패턴이 3회 이상 사용되는 경우, 재사용 가능한 UI 컴포넌트로 간주합니다.
- 하나의 UI 컴포넌트가 3개 이상의 프로젝트/팀에서 사용되는 경우, 디자인 시스템에 포함시킵니다.

![Contents of a design system](/design-systems-for-developers/design-system-grid.png)

이러한 방법을 따르다 보면 결국 다음과 같은 UI 기본 요소들이 남을 것입니다: 아바타, 뱃지, 버튼, 체크 박스, 입력, 라디오 버튼, 선택 박스, 텍스트 영역, 하이라이트(코드), 아이콘, 링크, 툴팁 등. 이러한 요소들은 클라이언트 앱에서 수많은 고유 기능과 레이아웃을 조합하기 위해 다양한 방식으로 구성됩니다.

![Variants in one component](/design-systems-for-developers/design-system-consolidate-into-one-button.jpg)


샘플 코드에서는 저장소를 간단하게 만들기 위해 이러한 컴포넌트들의 일부만 가져왔습니다. 어떤 팀은 표나 폼과 같은 다른 컴포넌트 위해 외부 컴포넌트에 사용자 정의를 적용하여 디자인 시스템에 포함시키도 합니다.


<div class="aside">💡 CSS-in-JS: 이 튜토리얼에서는 <a href="https://www.styled-components.com">Styled-components</a>를 사용합니다. 이 라이브러리를 사용하면 컴포넌트에 스타일링 범위를 지정할 수 있습니다. 컴포넌트를 스타일링하는 다른 유효한 방법으로는 class를 수동으로 지정하는 방법, CSS 모듈을 이용하는 방법 등이 있습니다.</div>

UI 컴포넌트 외에도 여러 프로젝트에 걸쳐 재사용되는 타이포그래피, 색상, 간격 등에 대한 스타일링 상수를 포함하는 것이 좋습니다. 디자인 시스템 명명법에서 전역 스타일 변수를 "디자인 토큰"이라고 합니다. 이 가이드에서는 디자인 토큰에 대한 이론을 다루지 않지만 온라인에서 더 자세히 알아볼 수 있습니다 (이와 관련한 [좋은 글](https://medium.com/eightshapes-llc/tokens-in-design-systems-25dd82d58421)을 첨부합니다).

## 개발을 시작해봅시다

우리는 무엇을 구축할지, 그리고 그것이 어떻게 서로 조화를 이룰지 정의했습니다. 이제 본격적인 작업에 들어갈 시간입니다. 3장은 디자인 시스템을 위한 기본 도구를 설명합니다. 스토리북의 도움을 받아 UI 컴포넌트들의 원시 디렉토리를 카탈로그 형태로 작성하고 확인할 수 있습니다.
