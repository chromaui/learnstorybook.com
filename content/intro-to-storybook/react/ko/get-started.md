---
title: 'React를 위한 Storybook 튜토리얼'
tocTitle: '시작하기'
description: 'Storybook을 개발 환경에 설치해봅시다'
commit: 'ac1ec13'
---

Storybook은 개발 모드에서 앱과 함께 실행됩니다. 이것은 비즈니스 로직과 컨텍스트로부터 UI 컴포넌트를 독립적으로 분리하여 만들수 있도록 도와줍니다. 본 Storybook 문서는 React를 위한 것입니다. 그 밖의 [React Native](/react-native/en/get-started), [Vue](/vue/en/get-started), [Angular](/angular/en/get-started) 그리고 [Svelte](/svelte/en/get-started)에 대한 문서도 있습니다.

![Storybook과 여러분의 앱](/intro-to-storybook/storybook-relationship.jpg)

## React Storybook 설치하기

개발 환경에 빌드 프로세스를 설정하려면 몇 가지 단계를 거쳐야 합니다. 먼저 [React App 생성하기](https://github.com/facebook/create-react-app)(CRA)를 사용하여 빌드 시스템을 설정하고 [Storybook](https://storybook.js.org/)과 [Jest](https://facebook.github.io/jest/) 테스트를 앱에서 활성화해야 합니다. 아래의 명령어들을 실행해주세요:

```bash
# Create our application:
npx create-react-app taskbox

cd taskbox

# Add Storybook:
npx -p @storybook/cli sb init
```

<div class="aside">
이 튜토리얼에서는 <code>yarn</code>을 사용하여 대부분의 명령어를 실행할 것입니다.
만약 Yarn을 설치했지만 <code>npm</code>을 사용하는 것을 선호하신다면, 걱정 마세요. 그래도 아무 문제없이 튜토리얼을 진행하실 수 있습니다. 간단히 <code>--use-npm</code> 플래그를 추가하면 이를 기반으로 CRA와 Storybook이 초기 설정됩니다. 또한, 이 튜토리얼을 진행하시면서 <code>npm</code>에 맞게 수정하는 것을 잊지 마세요.
</div>

우리는 다양한 환경에서 애플리케이션이 올바르게 작동하는지 다음 명령어를 통해 빠르게 확인할 수 있습니다:

```bash
# Run the test runner (Jest) in a terminal:
yarn test --watchAll

# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 3000:
yarn start
```

<div class="aside"> 
테스트 명령어에 <code>--watchAll</code> 플래그가 추가된 것을 보셨을 수 있습니다. 이것은 의도적인 것으로, 이 덕분에 모든 테스트가 실행되고 애플리케이션이 정상임을 확인할 수 있습니다. 이 튜토리얼을 진행하시는 동안 다양한 테스트 시나리오를 소개해드릴 것이며, <code>package.json</code>의 테스트 스크립트 부분에 이 플래그를 추가하여 모든 테스트가 실행되도록 하실 수 있습니다.
</div>

프런트엔드 앱의 3가지 양상 : 자동화된 테스트 (Jest), 컴포넌트 개발 (Storybook), 그리고 앱 그 자체.

![3가지 양상](/intro-to-storybook/app-three-modalities.png)

앱의 어느 부분을 작업하고 계신가에 따라, 하나 또는 그 이상을 동시에 실행하기를 원하실 수 있습니다. 현재는 단일 UI 컴포넌트를 만드는 데 초점을 두고 있기 때문에, Storybook을 계속 실행해두도록 하겠습니다.

## CSS를 재사용하기

Taskbox는 GraphQL과 React 튜토리얼 [연습 예제](https://www.chromatic.com/blog/graphql-react-tutorial-part-1-6)를 재사용할 것이므로 CSS를 따로 작성할 필요가 없습니다.
[컴파일된 CSS](https://github.com/chromaui/learnstorybook-code/blob/master/src/index.css)를`src/index.css` 파일에 복사하여 붙여넣기 해주세요.

![Taskbox의 UI](/intro-to-storybook/ss-browserchrome-taskbox-learnstorybook.png)

<div class="aside">
만약 스타일 변경을 원하신다면 LESS 소스파일들은 GitHub 저장소에 있습니다.
</div>

## Asset 추가하기

의도된 디자인에 맞도록 글꼴과 아이콘 디렉터리들을 모두 다운로드해서 `src/assets` 폴더 안에 넣어주세요. 터미널에서 다음 명령어를 실행하세요.

```bash
npx degit chromaui/learnstorybook-code/src/assets/font src/assets/font
npx degit chromaui/learnstorybook-code/src/assets/icon src/assets/icon
```

<div class="aside">
<p>다음 명령어들은 Github로부터 쉽게 파일과 폴더를 다운로드할 수 있도록 <a href="https://github.com/Rich-Harris/degit">degit</a>을 사용하였습니다. 만일 수동으로 다운로드하고 싶으신 경우 <a href="https://github.com/chromaui/learnstorybook-code/tree/master/src/assets">여기</a>에서 폴더를 직접 가져오실 수 있습니다.</p></div>

스타일과 asset을 추가하신 후에 앱이 약간 이상하게 랜더링 될 것입니다. 우리가 앱을 아직 작업하지 않았기에 괜찮습니다. 그럼 첫 번째 컴포넌트 제작을 시작해보겠습니다!
