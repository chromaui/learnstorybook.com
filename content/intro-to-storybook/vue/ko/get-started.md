---
title: '뷰(Vue)를 위한 스토리북(Storybook) 튜토리얼'
tocTitle: '시작하기'
description: 'Vue 스토리북(Storybook)을 개발 환경에 설정해보세요'
commit: '7bff3f5'
---

스토리북(Storybook)은 개발 모드에서 앱과 함께 실행됩니다. 비즈니스 로직과 컨텍스트(context)로부터 분리된 환경에서 UI 컴포넌트를 만들 수 있도록 도와줍니다. 이 Storybook 입문 튜토리얼은 Vue를 위해 작성되었습니다. 그 밖에 [React](/intro-to-storybook/react/ko/get-started/), [React Native](/intro-to-storybook/react-native/en/get-started/), [Angular](/intro-to-storybook/angular/en/get-started/), [Svelte](/intro-to-storybook/svelte/en/get-started/) 버전도 있습니다.

![Storybook과 애플리케이션의 관계](/intro-to-storybook/storybook-relationship.jpg)

## Vue Storybook 설정하기

먼저 개발에 필요한 빌드 환경을 준비하겠습니다. [degit](https://github.com/Rich-Harris/degit)을 사용하면 기본 설정과 일부 코드가 갖춰진 "템플릿"을 내려받아 개발을 빠르게 시작할 수 있습니다.

다음 명령어를 실행하세요:

```shell:clipboard=false
# Clone the template
npx degit chromaui/intro-storybook-vue-template taskbox

cd taskbox

# Install dependencies
yarn
```

<div class="aside">
💡 이 템플릿에는 튜토리얼을 따라 하는 데 필요한 스타일, 에셋, 기본 설정이 포함되어 있습니다.
</div>

다음 명령어로 Storybook과 애플리케이션이 정상적으로 실행되는지 확인하세요:

```shell:clipboard=false
# Start the component explorer on port 6006:
yarn storybook

# Run the frontend app proper on port 5173:
yarn dev
```

컴포넌트를 개발할 때는 Storybook을, 애플리케이션 전체를 확인할 때는 개발 서버를 사용합니다.

<!--

TODO:
- Update the image  to include the default Vite start screen and updated Storybook UI
-->

![애플리케이션의 주요 실행 환경](/intro-to-storybook/app-main-modalities-vue.png)

애플리케이션의 어느 부분을 작업하느냐에 따라 여러 환경을 동시에 실행할 수도 있습니다. 지금은 단일 UI 컴포넌트를 만드는 데 집중할 것이므로 Storybook만 실행하겠습니다.

## 변경 사항 커밋하기

이제 작업한 파일을 로컬 저장소에 추가해도 좋습니다. 다음 명령어를 실행하여 로컬 저장소를 초기화하고 지금까지의 변경 사항을 추가하고 커밋하세요.

```shell
git init
```

그다음:

```shell
git add .
```

이어서:

```shell
git commit -m "first commit"
```

마지막으로:

```shell
git branch -M main
```

이제 첫 번째 컴포넌트를 만들어봅시다!
